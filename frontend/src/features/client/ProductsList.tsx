import React, { useState } from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Badge } from '/ui/badge';
import { Input } from '/ui/input';
import { ImageWithFallback } from '/components/figma/ImageWithFallback';
import { mockProducts, mockCategories, mockRestaurants } from '/data/mockData';
import { Star, Clock, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '/ui/select';

interface ProductsListProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategoryId?: string;
}

export const ProductsList = ({ onNavigate, initialCategoryId }: ProductsListProps) => {
  const restaurant = mockRestaurants[0];
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = mockCategories.filter(c => c.restaurantId === restaurant.id && c.isActive);
  
  let filteredProducts = mockProducts.filter(p => 
    p.restaurantId === restaurant.id && 
    p.isActive &&
    (selectedCategory === 'all' || p.categoryId === selectedCategory) &&
    (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sorting
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.variations[0].price - b.variations[0].price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.variations[0].price - a.variations[0].price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cardápio Completo</h1>
        <p className="text-gray-600">Explore todos os nossos produtos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome A-Z</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="rating">Mais avaliados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                {product.isFeatured && (
                  <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                    Destaque
                  </Badge>
                )}
                {product.rating && (
                  <Badge className="absolute top-3 right-3 bg-white text-gray-900">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {product.rating}
                  </Badge>
                )}
                {product.stockQuantity < 10 && (
                  <Badge className="absolute bottom-3 right-3 bg-red-600 text-white">
                    Últimas unidades
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-2">
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
                {product.reviewsCount && (
                  <p className="text-xs text-gray-500">
                    {product.reviewsCount} avaliações
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
