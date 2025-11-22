import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Separator } from '@shared/ui/separator';
import type { CartItem, Address, PaymentMethod } from '@shared/types';
import api from '@shared/services/api';
import { useAuth } from '@shared/context/AuthContext';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onCheckout: () => void;
}

export function CheckoutScreen({ cartItems, onBack, onCheckout }: CheckoutScreenProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'meal_voucher'>('credit_card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Carregar endereços ao montar
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.id) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const data = await api.enderecos.listar({ userId: user.id });
        setAddresses(data || []);
        // Selecionar endereço padrão
        const defaultAddress = (data || []).find((a: Address) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (err) {
        console.error('Erro ao carregar endereços:', err);
        setError('Erro ao carregar endereços');
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const deliveryFee = 8.90;
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { id: 'credit_card' as const, name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'pix' as const, name: 'Pix', icon: Smartphone },
    { id: 'meal_voucher' as const, name: 'Vale Refeição', icon: Wallet },
  ];

  const handleFinishOrder = async () => {
    if (!user || !selectedAddressId) {
      setError('Selecione um endereço de entrega');
      return;
    }

    if (!paymentMethod) {
      setError('Selecione um método de pagamento');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar dados do pedido
      const orderData = {
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        deliveryAddressId: selectedAddressId,
        items: cartItems.map(item => ({
          productId: item.productId,
          variationId: item.variationId,
          addons: item.addons,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        paymentMethod: paymentMethod as PaymentMethod,
        subtotal,
        deliveryFee,
        total,
        status: 'received' as const,
      };

      // Criar pedido no backend
      await api.pedidos.criar(orderData);

      setShowSuccess(true);
      setTimeout(() => {
        onCheckout();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao confirmar pedido');
      setLoading(false);
    }
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
                    <p className="text-sm text-gray-500">
                      Variação: {item.variation.name}
                    </p>
                    {item.addons.length > 0 && (
                      <p className="text-xs text-gray-400">
                        Adicionais: {item.addons.map((a: any) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-900">
                    R$ {item.subtotal.toFixed(2)}
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
            </div>
            
            {loadingAddresses ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="size-5 text-orange-600 animate-spin" />
              </div>
            ) : addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum endereço cadastrado</p>
            ) : (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedAddressId === address.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {address.street}, {address.number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {address.neighborhood} - {address.city}, {address.state}
                        </p>
                        <p className="text-sm text-gray-500">CEP: {address.zipCode}</p>
                        {address.complement && (
                          <p className="text-xs text-gray-400">Complemento: {address.complement}</p>
                        )}
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Padrão
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
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
            {paymentMethod === 'credit_card' && (
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
          disabled={loading || loadingAddresses || addresses.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 h-14 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="size-5 animate-spin" />
              Processando...
            </div>
          ) : (
            `Confirmar Pedido - R$ ${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}
