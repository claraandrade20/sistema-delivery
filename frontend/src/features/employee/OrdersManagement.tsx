import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { toast } from 'sonner';
import { Package, Clock, Truck, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import type { Order, OrderStatus } from '@shared/types';
import { pedidosAPI } from '@shared/services/api';

interface OrdersManagementProps {
  onNavigate: (page: string, data?: any) => void;
}

const statusOptions: { value: OrderStatus; label: string; icon: any }[] = [
  { value: 'confirmed', label: 'Aceitar Pedido', icon: Package },
  { value: 'preparing', label: 'Em Preparo', icon: Clock },
  { value: 'on_the_way', label: 'A Caminho', icon: Truck },
  { value: 'delivered', label: 'Entregue', icon: CheckCircle },
];

const statusLabels: Record<string, string> = {
  'pending': 'Pendente',
  'confirmed': 'Confirmado',
  'preparing': 'Em Preparo',
  'ready': 'Pronto',
  'on_the_way': 'A Caminho',
  'delivered': 'Entregue',
  'cancelled': 'Cancelado',
};

export const OrdersManagement = ({ onNavigate }: OrdersManagementProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await pedidosAPI.listar();
      // Filtrar apenas pedidos completos (com as propriedades necessárias)
      const validOrders = (data || []).filter((order: any) => 
        order.customerName && 
        order.total !== undefined && 
        order.items && 
        order.deliveryAddress
      );
      setOrders(validOrders);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const updateOrderStatus = async (orderId: string | number, newStatus: OrderStatus) => {
    try {
      console.log('📝 Enviando atualização de status:', { orderId, newStatus });
      setUpdating(String(orderId));
      
      const response = await pedidosAPI.atualizarStatus(String(orderId), newStatus);
      console.log('✅ Resposta do servidor:', response);
      
      // Atualizar a lista local com os dados retornados do servidor
      setOrders(orders.map(o => 
        String(o.id) === String(orderId) ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      ));
      
      toast.success(`Pedido #${orderId} atualizado para: ${statusLabels[newStatus]}`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao atualizar pedido';
      console.error('❌ Erro completo:', error);
      console.error('❌ Tentando atualizar pedido:', { orderId: String(orderId), newStatus });
      toast.error(errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
          <p className="text-gray-600 mt-1">Acompanhe e atualize o status dos pedidos</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={loadOrders}
            disabled={loading}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              'Atualizar'
            )}
          </Button>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos ({orders.length})</SelectItem>
              <SelectItem value="pending">Pendentes ({orders.filter(o => o.status === 'pending').length})</SelectItem>
              <SelectItem value="confirmed">Confirmados ({orders.filter(o => o.status === 'confirmed').length})</SelectItem>
              <SelectItem value="preparing">Em Preparo ({orders.filter(o => o.status === 'preparing').length})</SelectItem>
              <SelectItem value="on_the_way">A Caminho ({orders.filter(o => o.status === 'on_the_way').length})</SelectItem>
              <SelectItem value="delivered">Entregues ({orders.filter(o => o.status === 'delivered').length})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                  <Badge className={
                    order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'on_the_way' ? 'bg-purple-500' :
                    order.status === 'preparing' ? 'bg-yellow-500' :
                    order.status === 'confirmed' ? 'bg-blue-500' :
                    order.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'
                  }>
                    {statusLabels[order.status] || order.status}
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
                    {typeof order.deliveryAddress === 'string' ? (
                      <p className="font-semibold text-gray-700">{order.deliveryAddress}</p>
                    ) : (
                      <>
                        <p className="font-semibold">
                          {order.deliveryAddress.street}, {order.deliveryAddress.number}
                          {order.deliveryAddress.complement && ` - ${order.deliveryAddress.complement}`}
                        </p>
                        <p className="text-gray-600">
                          {order.deliveryAddress.neighborhood}
                          {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                          {order.deliveryAddress.state && `/${order.deliveryAddress.state}`}
                        </p>
                        {order.deliveryAddress.zipCode && (
                          <p className="text-gray-500 text-xs">{order.deliveryAddress.zipCode}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-semibold mb-2">Itens:</p>
                  <div className="space-y-1">
                    {(order.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>
                          {item.quantity || 1}x{' '}
                          {typeof item.product === 'object' 
                            ? item.product.name 
                            : (item.productName || 'Produto')} 
                          {' '}({typeof item.variation === 'object' 
                            ? item.variation.name 
                            : (item.variationName || 'Variação')})
                        </span>
                        <span>R$ {(typeof item.subtotal === 'number' ? item.subtotal : parseFloat(String(item.subtotal)) || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                    <span>Total</span>
                    <span className="text-orange-600">R$ {(typeof order.total === 'number' ? order.total : parseFloat(String(order.total)) || 0).toFixed(2)}</span>
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
                        disabled={updating === order.id}
                        className="flex-1"
                      >
                        {updating === order.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4 mr-2" />
                        )}
                        {status.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
