import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Label } from '/ui/label';
import { RadioGroup, RadioGroupItem } from '/ui/radio-group';
import { Textarea } from '/ui/textarea';
import { useCart } from '/context/CartContext';
import { useAuth } from '/context/AuthContext';
import { mockRestaurants, getUserAddresses } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { CreditCard, Smartphone, Ticket, Wallet, MapPin, Check } from 'lucide-react';
import type { PaymentMethod } from '/types';

interface CheckoutProps {
  onNavigate: (page: string, data?: any) => void;
}

export const Checkout = ({ onNavigate }: CheckoutProps) => {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const addresses = user ? getUserAddresses(user.id) : [];
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const restaurant = mockRestaurants[0];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [observations, setObservations] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = restaurant.deliveryFee;
  const discount = 0; // Implementar lógica de cupom
  const total = subtotal + deliveryFee - discount;

  const paymentMethods = [
    { id: 'pix', label: 'PIX', icon: Smartphone, description: 'Aprovação imediata' },
    { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, description: 'Débito ou crédito' },
    { id: 'meal_voucher', label: 'Vale Refeição', icon: Ticket, description: 'VR, Alelo, Sodexo' },
    { id: 'cash', label: 'Dinheiro', icon: Wallet, description: 'Pagamento na entrega' },
  ];

  const handleConfirmOrder = async () => {
    if (!defaultAddress) {
      toast.error('Adicione um endereço de entrega');
      return;
    }

    setIsProcessing(true);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = `order-${Date.now()}`;
    
    clearCart();
    setIsProcessing(false);
    toast.success('Pedido realizado com sucesso!');
    onNavigate('order-tracking', { orderId });
  };

  if (items.length === 0) {
    onNavigate('cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              {defaultAddress ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{defaultAddress.street}, {defaultAddress.number}</p>
                  {defaultAddress.complement && <p className="text-sm text-gray-600">{defaultAddress.complement}</p>}
                  <p className="text-sm text-gray-600">{defaultAddress.neighborhood} - {defaultAddress.city}, {defaultAddress.state}</p>
                  <p className="text-sm text-gray-600">CEP: {defaultAddress.zipCode}</p>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum endereço cadastrado</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-semibold">{method.label}</p>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Coupon */}
          <Card>
            <CardHeader>
              <CardTitle>Cupom de Desconto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <Button variant="outline">Aplicar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle>Observações (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ex: Sem cebola, ponto da carne, etc..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-semibold">R$ {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-600">R$ {total.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  Tempo estimado: {restaurant.estimatedDeliveryTime}
                </p>
              </div>
              <Button
                onClick={handleConfirmOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
