import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { ImageWithFallback } from '/components/figma/ImageWithFallback';
import { useCart } from '/context/CartContext';
import { mockRestaurants } from '/data/mockData';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

interface CartProps {
  onNavigate: (page: string) => void;
}

export const Cart = ({ onNavigate }: CartProps) => {
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();
  const restaurant = mockRestaurants[0];

  const subtotal = getTotal();
  const deliveryFee = subtotal >= (restaurant.minimumOrder || 0) ? restaurant.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Carrinho vazio</h3>
          <p className="text-gray-500 mb-6">Adicione produtos para começar seu pedido</p>
          <Button onClick={() => onNavigate('products')} className="bg-gradient-to-r from-orange-500 to-red-600">
            Ver Cardápio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.variation.name}</p>
                    {item.addons.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        + {item.addons.map(a => a.name).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-600">
                          R$ {item.subtotal.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              {restaurant.minimumOrder && subtotal < restaurant.minimumOrder && (
                <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  Pedido mínimo: R$ {restaurant.minimumOrder.toFixed(2)}
                </p>
              )}
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-600">R$ {total.toFixed(2)}</span>
              </div>
              <Button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                size="lg"
                disabled={restaurant.minimumOrder !== undefined && subtotal < restaurant.minimumOrder}
              >
                Finalizar Pedido
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => onNavigate('products')}
                variant="outline"
                className="w-full"
              >
                Adicionar mais itens
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
