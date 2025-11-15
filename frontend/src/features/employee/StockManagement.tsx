import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Badge } from '/ui/badge';
import { mockProducts } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { Minus, Plus, AlertTriangle } from 'lucide-react';

export const StockManagement = () => {
  const [products] = useState(mockProducts);

  const updateStock = (productId: string, change: number) => {
    toast.success(`Estoque atualizado!`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Gestão de Estoque</h1>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => {
          const isLowStock = product.stockQuantity < 10;

          return (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">Estoque atual:</span>
                      {isLowStock && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      <Badge variant={isLowStock ? 'destructive' : 'default'}>
                        {product.stockQuantity} unidades
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStock(product.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={product.stockQuantity} 
                      className="w-20 text-center"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStock(product.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
