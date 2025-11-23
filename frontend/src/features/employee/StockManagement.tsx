import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { produtosAPI } from '@shared/services/api';
import { toast } from 'sonner';
import { Minus, Plus, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

export const StockManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await produtosAPI.listar();
      setProducts(Array.isArray(data) ? data : []);
      if (!data || data.length === 0) {
        console.warn('Nenhum produto com estoque retornado');
      }
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos: ' + (error.message || 'Tente novamente'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = (product.stockQuantity || 0) + change;
    
    if (newStock < 0) {
      toast.error('Estoque não pode ser negativo');
      return;
    }

    try {
      setUpdating(productId);
      const updated = await produtosAPI.atualizar(productId, {
        ...product,
        stockQuantity: newStock,
      });

      setProducts(prev =>
        prev.map(p => (p.id === productId ? updated : p))
      );
      toast.success(`Estoque atualizado!`);
    } catch (error) {
      toast.error('Erro ao atualizar estoque');
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Estoque</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadProducts}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => {
            const isLowStock = (product.stockQuantity || 0) < 10;

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
                          {product.stockQuantity || 0} unidades
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStock(product.id, -1)}
                        disabled={updating === product.id}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={product.stockQuantity || 0}
                        className="w-20 text-center"
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStock(product.id, 1)}
                        disabled={updating === product.id}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {updating === product.id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
