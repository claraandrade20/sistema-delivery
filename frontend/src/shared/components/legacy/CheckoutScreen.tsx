import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, MapPin, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { CartItem } from '../types';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onCheckout: () => void;
}

export function CheckoutScreen({ cartItems, onBack, onCheckout }: CheckoutScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | 'voucher'>('credit');
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.selectedSize ? item.selectedSize.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee = 8.90;
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { id: 'credit' as const, name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'pix' as const, name: 'Pix', icon: Smartphone },
    { id: 'voucher' as const, name: 'Vale Refeição', icon: Wallet },
  ];

  const handleFinishOrder = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onCheckout();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="size-24 text-green-600" />
            </div>
          </div>
          <h1 className="text-green-600 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600">
            Seu pedido foi realizado com sucesso
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-gray-900">Finalizar Pedido</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-gray-900 mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900">
                      {item.quantity}x {item.product.name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-500">
                        Tamanho: {item.selectedSize.name}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-900">
                    R${' '}
                    {(
                      (item.selectedSize?.price || item.product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-orange-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-900">Endereço de Entrega</h2>
              <button className="text-sm text-orange-600 hover:underline">
                Editar
              </button>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-gray-400 mt-1" />
              <div>
                <p className="text-gray-900">Rua das Flores, 123</p>
                <p className="text-sm text-gray-500">
                  Jardim Primavera - São Paulo, SP
                </p>
                <p className="text-sm text-gray-500">CEP: 01234-567</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-gray-900 mb-4">Método de Pagamento</h2>
            <div className="space-y-2 mb-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="size-6 text-gray-600" />
                    <span className="text-gray-900">{method.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'credit' && (
              <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <Input id="expiry" placeholder="MM/AA" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" maxLength={3} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input id="cardName" placeholder="Como está no cartão" />
                </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Smartphone className="size-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    O código Pix será gerado após confirmar o pedido
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finish Order Button */}
        <Button
          onClick={handleFinishOrder}
          className="w-full bg-green-600 hover:bg-green-700 h-14"
        >
          Finalizar Pedido - R$ {total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
