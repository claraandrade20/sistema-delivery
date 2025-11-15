import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Badge } from '/ui/badge';
import { Button } from '/ui/button';
import { mockDashboardStats } from '/data/mockData';
import { Package, DollarSign, Clock, Users, TrendingUp } from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export const EmployeeDashboard = ({ onNavigate }: EmployeeDashboardProps) => {
  const stats = mockDashboardStats;

  const cards = [
    { title: 'Pedidos Hoje', value: stats.todayOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Faturamento Hoje', value: `R$ ${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Pedidos Pendentes', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Clientes Ativos', value: stats.activeCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do restaurante</p>
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
                  <p className="font-semibold text-orange-600">R$ {order.total.toFixed(2)}</p>
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
