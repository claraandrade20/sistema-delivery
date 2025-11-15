import { Search, Flame } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Product } from '../types';
import { products } from '/data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  onProductSelect: (product: Product) => void;
}

export function HomeScreen({ onProductSelect }: HomeScreenProps) {
  const pizzas = products.filter((p) => p.category === 'pizzas');
  const bebidas = products.filter((p) => p.category === 'bebidas');
  const sobremesas = products.filter((p) => p.category === 'sobremesas');

  const categories = [
    { name: 'Pizzas', icon: '🍕', count: pizzas.length },
    { name: 'Bebidas', icon: '🥤', count: bebidas.length },
    { name: 'Sobremesas', icon: '🍰', count: sobremesas.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-b-3xl">
        <h1 className="mb-4">Olá! 👋</h1>
        <p className="text-orange-100 mb-4">O que você vai pedir hoje?</p>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            placeholder="Buscar pizzas, bebidas..."
            className="pl-10 bg-white text-gray-900"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <Card key={category.name} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="text-sm">{category.name}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {category.count}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promo Banner */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="size-5 text-red-600" />
                <Badge className="bg-red-600">Promoção!</Badge>
              </div>
              <h3 className="text-white mb-1">2 Pizzas Grandes</h3>
              <p className="text-sm text-orange-100">Por apenas R$ 99,90</p>
            </div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1582162431507-ef8fa9ce25dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGJhbm5lciUyMHByb21vdGlvbnxlbnwxfHx8fDE3NjMwNDY5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Promoção"
              className="size-20 object-cover rounded-full"
            />
          </CardContent>
        </Card>

        {/* Featured Products - Pizzas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Pizzas em Destaque</h2>
            <button className="text-sm text-orange-600 hover:underline">
              Ver todas
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pizzas.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onProductSelect(product)}
              >
                <CardContent className="p-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="text-sm text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">a partir de</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bebidas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Bebidas</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {bebidas.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onProductSelect(product)}
              >
                <CardContent className="p-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="text-sm text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <span className="text-orange-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sobremesas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Sobremesas</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {sobremesas.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onProductSelect(product)}
              >
                <CardContent className="p-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="text-sm text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <span className="text-orange-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
