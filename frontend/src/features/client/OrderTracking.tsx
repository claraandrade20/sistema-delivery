import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { mockOrders } from '/data/mockData';
import { Package, Clock, Truck, CheckCircle, MapPin, Phone } from 'lucide-react';
import type { OrderStatus } from '/types';

interface OrderTrackingProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

const orderSteps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'received', label: 'Pedido Recebido', icon: Package },
  { status: 'preparing', label: 'Em Preparo', icon: Clock },
  { status: 'on_the_way', label: 'A Caminho', icon: Truck },
  { status: 'delivered', label: 'Entregue', icon: CheckCircle },
];

export const OrderTracking = ({ orderId, onNavigate }: OrderTrackingProps) => {
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-gray-500">Pedido não encontrado</p>
          <Button onClick={() => onNavigate('orders')} className="mt-4">Voltar</Button>
        </CardContent>
      </Card>
    );
  }

  const currentStepIndex = orderSteps.findIndex(s => s.status === order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button onClick={() => onNavigate('orders')} variant="ghost">← Voltar</Button>

      <Card>
        <CardHeader>
          <CardTitle>Acompanhamento do Pedido #{order.id}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress */}
          <div className="relative py-8">
            {orderSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="flex items-center mb-8 last:mb-0">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    <StepIcon className={`h-6 w-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-semibold ${isCurrent ? 'text-green-600' : 'text-gray-700'}`}>
                      {step.label}
                    </p>
                    {isCurrent && <p className="text-sm text-gray-500 mt-1">Tempo estimado: {order.estimatedDeliveryTime}</p>}
                  </div>
                  {index < orderSteps.length - 1 && (
                    <div className={`absolute left-6 w-0.5 h-16 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} style={{ top: `${(index * 80) + 48}px` }} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.deliveryAddress.street}, {order.deliveryAddress.number}</p>
            {order.deliveryAddress.complement && <p className="text-sm text-gray-600">{order.deliveryAddress.complement}</p>}
            <p className="text-sm text-gray-600">{order.deliveryAddress.neighborhood}</p>
            <p className="text-sm text-gray-600">{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
            <p className="text-sm text-gray-600 mt-3">Restaurante: {order.restaurantName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{item.quantity}x {item.product.name} ({item.variation.name})</span>
              <span className="font-semibold">R$ {item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxa de entrega</span>
              <span>R$ {order.deliveryFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>- R$ {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-orange-600">R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
