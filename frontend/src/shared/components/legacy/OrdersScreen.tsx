import { ArrowLeft, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface OrdersScreenProps {
  onBack: () => void;
}

export function OrdersScreen({ onBack }: OrdersScreenProps) {
  const orders = [
    {
      id: '#12345',
      date: '13 de Nov, 14:30',
      status: 'delivering' as const,
      items: ['2x Pizza Calabresa (G)', '1x Coca-Cola 2L'],
      total: 119.70,
    },
    {
      id: '#12344',
      date: '10 de Nov, 19:15',
      status: 'delivered' as const,
      items: ['1x Pizza Margherita (M)', '1x Brownie'],
      total: 58.80,
    },
    {
      id: '#12343',
      date: '5 de Nov, 20:45',
      status: 'delivered' as const,
      items: ['1x Pizza Especial (F)', '2x Coca-Cola 2L'],
      total: 115.70,
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'preparing':
        return {
          label: 'Preparando',
          icon: Clock,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
        };
      case 'delivering':
        return {
          label: 'Em entrega',
          icon: Truck,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
        };
      case 'delivered':
        return {
          label: 'Entregue',
          icon: CheckCircle,
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
        };
      default:
        return {
          label: 'Pendente',
          icon: Package,
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h1 className="text-gray-900">Meus Pedidos</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <Badge
                    className={`${statusConfig.color} flex items-center gap-1`}
                  >
                    <StatusIcon className="size-3" />
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      • {item}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-orange-600">
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>

                {order.status === 'delivering' && (
                  <div className={`mt-3 p-3 rounded-lg ${statusConfig.bgColor}`}>
                    <p className={`text-sm ${statusConfig.textColor}`}>
                      🚴‍♂️ Seu pedido está a caminho! Previsão: 30-40 min
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
