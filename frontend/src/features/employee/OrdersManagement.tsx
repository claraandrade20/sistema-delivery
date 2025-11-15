import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { Badge } from '/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '/ui/select';
import { mockOrders } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';
import type { Order, OrderStatus } from '/types';

interface OrdersManagementProps {
  onNavigate: (page: string, data?: any) => void;
}

const statusOptions: { value: OrderStatus; label: string; icon: any }[] = [
  { value: 'received', label: 'Aceitar Pedido', icon: Package },
  { value: 'preparing', label: 'Em Preparo', icon: Clock },
  { value: 'on_the_way', label: 'A Caminho', icon: Truck },
  { value: 'delivered', label: 'Entregue', icon: CheckCircle },
];

export const OrdersManagement = ({ onNavigate }: OrdersManagementProps) => {
  const [orders] = useState<Order[]>(mockOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    toast.success(`Pedido #${orderId} atualizado para: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
          <p className="text-gray-600 mt-1">Acompanhe e atualize o status dos pedidos</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="received">Recebidos</SelectItem>
            <SelectItem value="preparing">Em Preparo</SelectItem>
            <SelectItem value="on_the_way">A Caminho</SelectItem>
            <SelectItem value="delivered">Entregues</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                <Badge className={
                  order.status === 'delivered' ? 'bg-green-500' :
                  order.status === 'on_the_way' ? 'bg-purple-500' :
                  order.status === 'preparing' ? 'bg-yellow-500' : 'bg-blue-500'
                }>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-gray-600">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Endereço</p>
                  <p className="font-semibold">{order.deliveryAddress.street}, {order.deliveryAddress.number}</p>
                  <p className="text-gray-600">{order.deliveryAddress.neighborhood}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold mb-2">Itens:</p>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name} ({item.variation.name})</span>
                      <span>R$ {item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">R$ {order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {statusOptions.map((status) => {
                  const Icon = status.icon;
                  return (
                    <Button
                      key={status.value}
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, status.value)}
                      className="flex-1"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {status.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
