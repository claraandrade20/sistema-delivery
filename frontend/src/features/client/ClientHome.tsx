import React from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Badge } from '/ui/badge';
import { ImageWithFallback } from '/components/figma/ImageWithFallback';
import { mockCategories, mockPromotions, getFeaturedProducts, mockRestaurants } from '/data/mockData';
import { Star, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '/ui/carousel';

interface ClientHomeProps {
  onNavigate: (page: string, data?: any) => void;
}

export const ClientHome = ({ onNavigate }: ClientHomeProps) => {
  const restaurant = mockRestaurants[0]; // Restaurante principal
  const categories = mockCategories.filter(c => c.restaurantId === restaurant.id);
  const featuredProducts = getFeaturedProducts(restaurant.id);
  const promotions = mockPromotions.filter(p => p.restaurantId === restaurant.id && p.isActive);

  return (
    <div className="space-y-8">
      {/* Restaurant Info Banner */}
      <Card className="overflow-hidden border-2 border-orange-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <ImageWithFallback
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full md:w-48 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
                  <p className="text-gray-600 mt-1">{restaurant.description}</p>
                </div>
                <Badge className="bg-orange-500 text-white">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {restaurant.rating}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {restaurant.estimatedDeliveryTime}
                </div>
                <div>Taxa de entrega: R$ {restaurant.deliveryFee.toFixed(2)}</div>
                <div>Pedido mínimo: R$ {restaurant.minimumOrder?.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotions Carousel */}
      {promotions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Promoções Especiais</h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {promotions.map((promo) => (
                <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-48 object-cover"
                      />
                      {promo.discountPercentage && (
                        <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                          {promo.discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900">{promo.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      )}

      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => onNavigate('products', { categoryId: category.id })}
            >
              <CardContent className="p-4">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
                <h3 className="text-center font-medium text-gray-900">{category.name}</h3>
                <p className="text-xs text-center text-gray-500 mt-1">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Produtos em Destaque</h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => onNavigate('products')}
            className="text-orange-600 hover:text-orange-700"
          >
            Ver tudo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => onNavigate('product-detail', { productId: product.id })}
            >
              <div className="relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.rating && (
                  <Badge className="absolute top-3 right-3 bg-white text-gray-900">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {product.rating}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-600">
                    A partir de R$ {product.variations[0].price.toFixed(2)}
                  </span>
                  {product.preparationTime && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {product.preparationTime}min
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
