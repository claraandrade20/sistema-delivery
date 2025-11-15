import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { mockDashboardStats, mockRestaurants, mockUsers } from '/data/mockData';
import { Store, Users, DollarSign, Package, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const salesData = [
  { name: 'Seg', value: 4200 },
  { name: 'Ter', value: 3800 },
  { name: 'Qua', value: 5100 },
  { name: 'Qui', value: 4500 },
  { name: 'Sex', value: 6200 },
  { name: 'Sáb', value: 8500 },
  { name: 'Dom', value: 7800 },
];

export const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const stats = mockDashboardStats;
  const restaurants = mockRestaurants;
  const totalCustomers = mockUsers.filter(u => u.role === 'client').length;
  const totalEmployees = mockUsers.filter(u => u.role === 'employee').length;

  const cards = [
    { title: 'Total Restaurantes', value: restaurants.length, icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Clientes', value: totalCustomers, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Faturamento Hoje', value: `R$ ${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pedidos Hoje', value: stats.todayOrders, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-1">Visão geral completa do sistema</p>
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
              <LineChart data={salesData}>
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
              <BarChart data={salesData}>
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
    </div>
  );
};
