import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useAuth } from '@shared/context/AuthContext';
import { Clock, Package, Truck, CheckCircle, XCircle, Loader2, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { pedidosAPI } from '@shared/services/api';
import type { OrderStatus } from '@shared/types';

interface MyOrdersProps {
  onNavigate: (page: string, data?: any) => void;
}

interface OrderItem {
  productId: string;
  productName: string;
  variationId?: string;
  variationName?: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string | number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: number;
  restaurantName: string;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmado', icon: Package, color: 'bg-blue-500' },
  preparing: { label: 'Em Preparo', icon: Clock, color: 'bg-yellow-500' },
  ready: { label: 'Pronto', icon: Package, color: 'bg-green-500' },
  on_the_way: { label: 'A Caminho', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
  pendente: { label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
  confirmado: { label: 'Confirmado', icon: Package, color: 'bg-blue-500' },
  preparando: { label: 'Em Preparo', icon: Clock, color: 'bg-yellow-500' },
  pronto: { label: 'Pronto', icon: Package, color: 'bg-green-500' },
  a_caminho: { label: 'A Caminho', icon: Truck, color: 'bg-purple-500' },
  entregue: { label: 'Entregue', icon: CheckCircle, color: 'bg-green-500' },
  cancelado: { label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
};

export const MyOrders = ({ onNavigate }: MyOrdersProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user?.id, user?.email]);

  const loadOrders = async () => {
    if (!user?.id && !user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await pedidosAPI.listar({ customerId: user.id || user.email });
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
        <Card>
          <CardContent className="py-16 text-center flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            <p className="text-gray-500">Carregando pedidos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
        <Button
          onClick={loadOrders}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

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
            const statusKey = (order.status || 'pending').toLowerCase();
            const status = statusConfig[statusKey] || { label: order.status, icon: Package, color: 'bg-gray-500' };
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Pedido #{order.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Data não disponível'}
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
                          {item.quantity}x {item.productName} ({item.variationName || 'Padrão'})
                        </span>
                        <span className="font-semibold">R$ {(Number(item.subtotal) || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold text-orange-600">R$ {(Number(order.total) || 0).toFixed(2)}</p>
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
