import React, { useState } from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Badge } from '/ui/badge';
import { RadioGroup, RadioGroupItem } from '/ui/radio-group';
import { Checkbox } from '/ui/checkbox';
import { Label } from '/ui/label';
import { ImageWithFallback } from '/components/figma/ImageWithFallback';
import { mockProducts } from '/data/mockData';
import { useCart } from '/context/CartContext';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, Star, Clock, Minus, Plus, ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

export const ProductDetail = ({ productId, onNavigate }: ProductDetailProps) => {
  const product = mockProducts.find(p => p.id === productId);
  const { addToCart } = useCart();

  const [selectedVariation, setSelectedVariation] = useState(product?.variations[0].id || '');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-gray-500">Produto não encontrado</p>
          <Button onClick={() => onNavigate('products')} className="mt-4">
            Voltar ao cardápio
          </Button>
        </CardContent>
      </Card>
    );
  }

  const variation = product.variations.find(v => v.id === selectedVariation);
  const addons = (product.addons || []).filter(a => selectedAddons.includes(a.id));
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = variation ? (variation.price + addonsTotal) * quantity : 0;

  const handleAddToCart = () => {
    if (!variation) return;

    addToCart(product, variation, addons, quantity);
    toast.success('Produto adicionado ao carrinho!');
    onNavigate('cart');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => onNavigate('products')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao cardápio
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-96 lg:h-full object-cover rounded-lg shadow-lg"
          />
          {product.isFeatured && (
            <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
              Destaque
            </Badge>
          )}
          {product.rating && (
            <Badge className="absolute top-4 right-4 bg-white text-gray-900">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              {product.rating} ({product.reviewsCount} avaliações)
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            {product.preparationTime && (
              <div className="flex items-center gap-2 mt-3 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Tempo de preparo: {product.preparationTime} minutos</span>
              </div>
            )}
          </div>

          {/* Variations */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-semibold mb-3 block">Escolha o tamanho *</Label>
              <RadioGroup value={selectedVariation} onValueChange={setSelectedVariation}>
                {product.variations.map((variation) => (
                  <div key={variation.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={variation.id} id={variation.id} />
                    <Label htmlFor={variation.id} className="flex-1 cursor-pointer flex justify-between">
                      <span>{variation.name}</span>
                      <span className="font-semibold text-orange-600">
                        R$ {variation.price.toFixed(2)}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Addons */}
          {product.addons && product.addons.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <Label className="text-base font-semibold mb-3 block">Adicionais (opcionais)</Label>
                <div className="space-y-3">
                  {product.addons.map((addon) => (
                    <div key={addon.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={addon.id}
                        checked={selectedAddons.includes(addon.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAddons([...selectedAddons, addon.id]);
                          } else {
                            setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                          }
                        }}
                      />
                      <Label htmlFor={addon.id} className="flex-1 cursor-pointer flex justify-between">
                        <span>{addon.name}</span>
                        <span className="font-semibold text-gray-700">
                          + R$ {addon.price.toFixed(2)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quantity */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-semibold mb-3 block">Quantidade</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <Card className="bg-gradient-to-r from-orange-500 to-red-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white mb-4">
                <span className="text-lg">Total:</span>
                <span className="text-2xl font-bold">R$ {totalPrice.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleAddToCart}
                className="w-full bg-white text-orange-600 hover:bg-gray-100"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
