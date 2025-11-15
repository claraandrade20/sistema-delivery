import React from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Badge } from '/ui/badge';
import { useAuth } from '/context/AuthContext';
import { getOrdersByCustomer } from '/data/mockData';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import type { OrderStatus } from '/types';

interface MyOrdersProps {
  onNavigate: (page: string, data?: any) => void;
}

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  received: { label: 'Recebido', icon: Package, color: 'bg-blue-500' },
  preparing: { label: 'Em Preparo', icon: Clock, color: 'bg-yellow-500' },
  on_the_way: { label: 'A Caminho', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
};

export const MyOrders = ({ onNavigate }: MyOrdersProps) => {
  const { user } = useAuth();
  const orders = user ? getOrdersByCustomer(user.id) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500 mb-6">Faça seu primeiro pedido!</p>
            <Button onClick={() => onNavigate('home')} className="bg-gradient-to-r from-orange-500 to-red-600">
              Ver Cardápio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Pedido #{order.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Badge className={`${status.color} text-white`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.product.name} ({item.variation.name})
                        </span>
                        <span className="font-semibold">R$ {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold text-orange-600">R$ {order.total.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => onNavigate('order-tracking', { orderId: order.id })}
                      variant="outline"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
