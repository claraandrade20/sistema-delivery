import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Package, DollarSign, Clock, Users, TrendingUp, Loader2 } from 'lucide-react';
import { pedidosAPI, produtosAPI } from '@shared/services/api';
import { toast } from 'sonner';
import type { Order } from '@shared/types';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export const EmployeeDashboard = ({ onNavigate }: EmployeeDashboardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ordersData, productsData] = await Promise.all([
        pedidosAPI.listar().catch(err => {
          console.error('Erro ao carregar pedidos:', err);
          return [];
        }),
        produtosAPI.listar().catch(err => {
          console.error('Erro ao carregar produtos:', err);
          return [];
        }),
      ]);
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
      setError(error.message || 'Erro ao carregar dados');
      toast.error('Erro ao carregar dados do dashboard');
      setOrders([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt || new Date());
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const todayRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.createdAt || new Date());
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : 0), 0);

  const pendingOrders = orders.filter(o => 
    o.status === 'preparing'
  ).length;

  const activeCustomers = new Set(orders.map(o => o.customerId || o.customerName)).size;

  // Top selling products (simplificado)
  const topSellingProducts = products.slice(0, 5).map((p, idx) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    salesCount: Math.floor(Math.random() * 100) + 20, // Dados simulados
  }));

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const stats = {
    todayOrders,
    todayRevenue,
    pendingOrders,
    activeCustomers,
    topSellingProducts,
    recentOrders,
  };

  const cards = [
    { title: 'Pedidos Hoje', value: stats.todayOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Faturamento Hoje', value: `R$ ${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Pedidos Pendentes', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Clientes Ativos', value: stats.activeCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
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
        </div>
        <Button variant="outline" size="sm" onClick={loadDashboardData}>
          Atualizar
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
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-600 w-6">{index + 1}º</div>
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.salesCount} vendas</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onNavigate('orders')}>
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Pedido #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold text-orange-600">R$ {typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Badge className={
                  order.status === 'delivered' ? 'bg-green-500' :
                  order.status === 'on_the_way' ? 'bg-purple-500' :
                  order.status === 'preparing' ? 'bg-yellow-500' : 'bg-blue-500'
                }>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
