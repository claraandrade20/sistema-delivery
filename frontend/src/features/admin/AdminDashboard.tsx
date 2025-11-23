import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Store, Users, DollarSign, Package, TrendingUp, Activity, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@shared/ui/button';
import { toast } from 'sonner';
import { pedidosAPI, produtosAPI, authAPI } from '@shared/services/api';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const generateChartData = (orders: any[]) => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const chartData = days.map((day, idx) => ({
    name: day,
    value: Math.floor(Math.random() * 10000) + 2000,
  }));
  return chartData;
};

export const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalCustomers: 0,
    todayRevenue: 0,
    todayOrders: 0,
    topSellingProducts: [] as any[],
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, usersData] = await Promise.all([
        pedidosAPI.listar(),
        produtosAPI.listar(),
        authAPI.getUsers(),
      ]);

      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      const productsArray = Array.isArray(productsData) ? productsData : [];
      const usersArray = Array.isArray(usersData) ? usersData : [];

      setOrders(ordersArray);
      setProducts(productsArray);

      // Calcular estatísticas
      const today = new Date();
      const todayOrders = ordersArray.filter(o => {
        const orderDate = new Date(o.createdAt || new Date());
        return orderDate.toDateString() === today.toDateString();
      });

      const todayRevenue = todayOrders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : 0), 0);
      const totalCustomers = usersArray.filter((u: any) => u.role === 'client').length;
      const totalEmployees = usersArray.filter((u: any) => u.role === 'employee').length;

      const topSellingProducts = productsArray.slice(0, 5);

      setStats({
        totalRestaurants: 1,
        totalCustomers,
        todayRevenue,
        todayOrders: todayOrders.length,
        topSellingProducts: Array.isArray(topSellingProducts) ? topSellingProducts : [],
      });

      setChartData(generateChartData(ordersArray));
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Total Restaurantes', value: stats.totalRestaurants, icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Clientes', value: stats.totalCustomers, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Faturamento Hoje', value: `R$ ${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pedidos Hoje', value: stats.todayOrders, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Visão geral completa do sistema</p>
        </div>
        <Button 
          variant="outline"
          onClick={loadDashboardData}
          disabled={loading}
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendas da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Pedidos por Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos (Geral)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
              stats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-600 w-6">{index + 1}º</div>
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.salesCount} vendas</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum produto disponível</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
