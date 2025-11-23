import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Package, Clock, Users, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { pedidosAPI, produtosAPI } from '@shared/services/api';
import { toast } from 'sonner';
import { useAuth } from '@shared/context/AuthContext';
import type { Order } from '@shared/types';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export const EmployeeDashboard = ({ onNavigate }: EmployeeDashboardProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    if (user?.restaurantId) {
      loadDashboardData();
      // Atualizar dados a cada 30 segundos
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.restaurantId]);

  const loadDashboardData = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);
      
      // Obter o restaurantId do usuário autenticado
      const restaurantId = user?.restaurantId || "1";
      
      console.log('Carregando dados do dashboard para restaurante:', restaurantId);
      
      // Buscar dados em paralelo do banco de dados
      const [ordersData, productsData] = await Promise.all([
        pedidosAPI.listar({ restaurantId }).catch(err => {
          console.error('Erro ao carregar pedidos:', err);
          throw err; // Propagar erro para ser tratado no catch principal
        }),
        produtosAPI.listar({ restaurantId }).catch(err => {
          console.error('Erro ao carregar produtos:', err);
          throw err; // Propagar erro para ser tratado no catch principal
        }),
      ]);
      
      console.log('✅ Pedidos carregados do banco:', ordersData?.length || 0);
      console.log('✅ Produtos carregados do banco:', productsData?.length || 0);
      
      // Garantir que são arrays válidos
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      const productsArray = Array.isArray(productsData) ? productsData : [];
      
      // Processar pedidos para garantir formato correto
      const processedOrders = ordersArray.map(order => ({
        ...order,
        createdAt: order.createdAt || new Date().toISOString(),
        items: order.items || [],
        total: typeof order.total === 'number' ? order.total : 0,
      }));
      
      setOrders(processedOrders);
      setProducts(productsArray);
      
      console.log('📊 Dashboard atualizado - Pedidos:', processedOrders.length, 'Produtos:', productsArray.length);
      
      if (isRefreshing) {
        toast.success('Dashboard atualizado com sucesso');
      }
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
      setError(error.message || 'Erro ao carregar dados');
      if (isRefreshing) {
        toast.error('Erro ao atualizar dashboard');
      }
      setOrders([]);
      setProducts([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
  };

  // Função auxiliar para verificar se é hoje
  const isToday = (dateString: string) => {
    try {
      const orderDate = new Date(dateString);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  };

  // Calcular estatísticas baseadas nos dados do banco
  const todayOrders = orders.filter(o => {
    const isTodayOrder = isToday(o.createdAt);
    const isDelivered = o.status === 'delivered';
    return isTodayOrder && isDelivered;
  }).length;

  const pendingOrders = orders.filter(o => {
    const isPending = o.status === 'preparing' || o.status === 'pending' || o.status === 'confirmed';
    return isPending; // Todos os pendentes, não só de hoje
  }).length;

  const activeCustomers = new Set(
    orders
      .filter(o => isToday(o.createdAt))
      .map(o => o.customerId || o.customerName)
      .filter(id => id) // Remover valores vazios
  ).size;

  // Top selling products (contar ocorrências em pedidos do dia) - dados do banco
  const productSalesMap = new Map<string, { name: string; image: string; count: number }>();
  
  orders.forEach(order => {
    if (isToday(order.createdAt)) {
      order.items?.forEach(item => {
        // Obter ID do produto do banco de dados
        const productId = String(item.productId || (item.product?.id as string) || '');
        if (productId && productId !== '') {
          // Nome do produto vem do banco (item.productName ou item.product.name)
          const productName = item.productName || item.product?.name || 'Produto sem nome';
          // Imagem do produto vem do banco
          const productImage = item.product?.image || '';
          const quantity = Number(item.quantity) || 1;
          
          const existing = productSalesMap.get(productId);
          if (existing) {
            existing.count += quantity;
          } else {
            productSalesMap.set(productId, {
              name: productName,
              image: productImage,
              count: quantity,
            });
          }
        }
      });
    }
  });

  const topSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((p, idx) => ({
      id: String(idx + 1),
      name: p.name,
      image: p.image,
      salesCount: p.count,
    }));

  // Pedidos recentes do dia (ordenados por data mais recente) - dados do banco
  const recentOrders = orders
    .filter(o => isToday(o.createdAt))
    .sort((a, b) => {
      try {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 5);

  const stats = {
    todayOrders,
    pendingOrders,
    activeCustomers,
    topSellingProducts: topSellingProducts.length > 0 ? topSellingProducts : [
      { id: '1', name: 'Nenhum produto', image: '', salesCount: 0 }
    ],
    recentOrders,
  };

  const cards = [
    { title: 'Pedidos Hoje', value: stats.todayOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pedidos Pendentes', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Clientes Ativos', value: stats.activeCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  // Verificar se o usuário tem restaurantId
  if (!user?.restaurantId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-orange-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Restaurante não vinculado</h2>
            <p className="text-gray-600 mb-4">
              Seu usuário não está vinculado a nenhum restaurante. Entre em contato com o administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
          <p className="text-sm text-gray-500">Restaurante ID: {user.restaurantId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Erro ao carregar dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData} className="w-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do restaurante</p>
          <p className="text-xs text-gray-500 mt-1">
            📍 Restaurante ID: {user?.restaurantId} | 📦 {orders.length} pedidos carregados | 🍕 {products.length} produtos
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Produtos Mais Vendidos Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topSellingProducts.length > 0 && stats.topSellingProducts[0].salesCount > 0 ? (
            <div className="space-y-3">
              {stats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-600 w-6">{index + 1}º</div>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Sem+Imagem';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.salesCount} {product.salesCount === 1 ? 'venda' : 'vendas'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhum produto vendido hoje</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pedidos Recentes (Hoje)</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onNavigate('orders')}>
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order) => {
                const orderTotal = typeof order.total === 'number' ? order.total : 0;
                const orderTime = order.createdAt ? new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--';
                
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName || `Cliente ${order.customerId}`}</p>
                      {order.items && order.items.length > 0 && (
                        <p className="text-xs text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                      )}
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-orange-600">R$ {orderTotal.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{orderTime}</p>
                    </div>
                    <Badge className={
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'on_the_way' ? 'bg-purple-500' :
                      order.status === 'preparing' ? 'bg-yellow-500' :
                      order.status === 'pending' ? 'bg-blue-500' :
                      order.status === 'confirmed' ? 'bg-cyan-500' :
                      'bg-gray-500'
                    }>
                      {order.status === 'delivered' ? 'Entregue' :
                       order.status === 'preparing' ? 'Preparando' :
                       order.status === 'pending' ? 'Pendente' :
                       order.status === 'confirmed' ? 'Confirmado' :
                       order.status === 'on_the_way' ? 'A caminho' :
                       order.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhum pedido registrado hoje</p>
              <p className="text-xs mt-1">Os pedidos do banco de dados aparecerão aqui</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
