import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@shared/ui/radio-group';
import { Textarea } from '@shared/ui/textarea';
import { useCart } from '@shared/context/CartContext';
import { useAuth } from '@shared/context/AuthContext';
import { toast } from 'sonner';
import { CreditCard, Smartphone, Ticket, Wallet, MapPin, Check, Loader2 } from 'lucide-react';
import type { PaymentMethod } from '@shared/types';
import { pedidosAPI, enderecosAPI } from '@shared/services/api';

interface CheckoutProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Address {
  id: string | number;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  status?: 'principal' | 'secundario';
}

export const Checkout = ({ onNavigate }: CheckoutProps) => {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [observations, setObservations] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = 10; // Valor padrão
  const discount = 0; // Implementar lógica de cupom
  const total = subtotal + deliveryFee - discount;

  // Carregar endereços do backend
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.email) return;
      try {
        setIsLoadingAddresses(true);
        const data = await enderecosAPI.listar({ userId: user.email });
        setAddresses(data || []);
        
        // Selecionar endereço principal por padrão
        const principalAddress = data?.find((a: Address) => a.status === 'principal');
        if (principalAddress) {
          setSelectedAddressId(principalAddress.id);
        } else if (data && data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar endereços:', error);
        toast.error('Erro ao carregar endereços');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user?.email]);

  const paymentMethods = [
    { id: 'pix', label: 'PIX', icon: Smartphone, description: 'Aprovação imediata' },
    { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, description: 'Débito ou crédito' },
    { id: 'meal_voucher', label: 'Vale Refeição', icon: Ticket, description: 'VR, Alelo, Sodexo' },
    { id: 'cash', label: 'Dinheiro', icon: Wallet, description: 'Pagamento na entrega' },
  ];

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Selecione um endereço de entrega');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsProcessing(true);

    try {
      const selectedAddr = addresses.find((a: Address) => a.id.toString() === selectedAddressId.toString());
      if (!selectedAddr) {
        throw new Error('Endereço não encontrado');
      }

      const addressStr = `${selectedAddr.street}, ${selectedAddr.number}${selectedAddr.complement ? ' - ' + selectedAddr.complement : ''} - ${selectedAddr.district}, ${selectedAddr.city}/${selectedAddr.state}`;

      // Criar pedido no backend
      const orderData = {
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        restaurantId: 1,
        restaurantName: 'Restaurante',
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        total: total,
        status: 'pending',
        deliveryAddress: addressStr,
        items: items.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.name,
          variationId: item.variationId || null,
          variationName: item.variationId ? 'Padrão' : null,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        observations: observations,
      };

      const response = await pedidosAPI.criar(orderData);
      const orderId = response.id || `order-${Date.now()}`;

      clearCart();
      toast.success('Pedido realizado com sucesso!');
      onNavigate('order-tracking', { orderId });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar pedido');
      console.error('Erro ao criar pedido:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

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
              {isLoadingAddresses ? (
                <p className="text-gray-500">Carregando endereços...</p>
              ) : addresses.length === 0 ? (
                <p className="text-gray-500">Nenhum endereço cadastrado. <Button variant="link" onClick={() => onNavigate('profile')}>Adicionar agora</Button></p>
              ) : (
                <RadioGroup value={selectedAddressId?.toString() || ''} onValueChange={setSelectedAddressId as any}>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                        <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">
                              {address.street}, {address.number}
                              {address.complement && ` - ${address.complement}`}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              address.status === 'principal'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {address.status === 'principal' ? 'Principal' : 'Entrega'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.district} - {address.city}, {address.state}
                          </p>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}>
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
                  Tempo estimado: 30-45 min
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
