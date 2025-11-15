import { useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Product, CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
}

export function ProductDetailScreen({
  product,
  onBack,
  onAddToCart,
}: ProductDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : null
  );

  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    onAddToCart({
      product,
      quantity,
      selectedSize: selectedSize || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Back Button */}
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg"
        >
          <ArrowLeft className="size-6 text-gray-700" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6 -mt-6 bg-gray-50 rounded-t-3xl relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
          <Badge className="bg-green-600 ml-2 shrink-0">Disponível</Badge>
        </div>

        {/* Size Selection */}
        {product.sizes && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-gray-900 mb-3">Escolha o Tamanho</h3>
              <div className="space-y-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedSize?.name === size.name
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{size.name}</span>
                      <span className="text-orange-600">
                        R$ {size.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantity Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-gray-900 mb-3">Quantidade</h3>
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="size-12 rounded-full"
              >
                <Minus className="size-5" />
              </Button>
              <span className="text-2xl text-gray-900 w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="size-12 rounded-full"
              >
                <Plus className="size-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="mb-6 bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preço unitário</p>
                <p className="text-gray-900">R$ {currentPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl text-orange-600">
                  R$ {totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-green-600 hover:bg-green-700 h-14"
        >
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}
