import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
}

export function CartScreen({
  cartItems,
  onBack,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
}: CartScreenProps) {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.selectedSize ? item.selectedSize.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee = 8.90;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="size-6 text-gray-700" />
            </button>
            <h1 className="text-gray-900">Carrinho</h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <div className="bg-gray-100 p-8 rounded-full mb-4">
            <ShoppingBag className="size-16 text-gray-400" />
          </div>
          <h2 className="text-gray-900 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 text-center mb-6">
            Adicione itens deliciosos para começar seu pedido
          </p>
          <Button
            onClick={onBack}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Explorar Produtos
          </Button>
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
          <h1 className="text-gray-900">Carrinho</h1>
          <span className="text-gray-500">({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        {cartItems.map((item, index) => {
          const price = item.selectedSize
            ? item.selectedSize.price
            : item.product.price;
          const itemTotal = price * item.quantity;

          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="size-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900">{item.product.name}</h3>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-500">
                            {item.selectedSize.name}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="size-5 text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(index, Math.max(1, item.quantity - 1))
                          }
                          disabled={item.quantity <= 1}
                          className="size-8"
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="text-gray-900 w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="size-8"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <span className="text-orange-600">
                        R$ {itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Summary */}
        <Card className="sticky bottom-20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-orange-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full bg-green-600 hover:bg-green-700 h-12 mt-2"
              >
                Ir para Pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
