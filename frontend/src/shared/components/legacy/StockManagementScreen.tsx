import { useState } from 'react';
import { Package, Minus, Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { stockItems as initialStockItems } from '/data/mockData';

interface StockManagementScreenProps {
  onBack: () => void;
}

export function StockManagementScreen({ onBack }: StockManagementScreenProps) {
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleUpdateStock = (id: string, change: number) => {
    setStockItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const handleStartEdit = (id: string, currentQuantity: number) => {
    setEditingId(id);
    setEditValue(currentQuantity.toString());
  };

  const handleSaveEdit = (id: string) => {
    const newQuantity = parseInt(editValue) || 0;
    setStockItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
    setEditingId(null);
  };

  const lowStockItems = stockItems.filter((item) => item.quantity <= 10);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-700 rounded-full"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex items-center gap-3">
            <Package className="size-8" />
            <h1>Gerenciamento de Estoque</h1>
          </div>
        </div>
        <p className="text-blue-100 ml-16">
          Modo Funcionário - Atualize os níveis de estoque
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="size-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{lowStockItems.length}</strong> {lowStockItems.length === 1 ? 'item com' : 'itens com'} estoque baixo
            </AlertDescription>
          </Alert>
        )}

        {/* Stock Items List */}
        <div className="space-y-3">
          {stockItems.map((item) => {
            const isLowStock = item.quantity <= 10;
            const isOutOfStock = item.quantity === 0;
            const isEditing = editingId === item.id;

            return (
              <Card key={item.id} className={isLowStock ? 'border-orange-200' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{item.name}</h3>
                        {isOutOfStock && (
                          <Badge variant="destructive">Esgotado</Badge>
                        )}
                        {isLowStock && !isOutOfStock && (
                          <Badge className="bg-orange-500">Estoque Baixo</Badge>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24"
                            autoFocus
                          />
                          <span className="text-sm text-gray-500">{item.unit}</span>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(item.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            onClick={() => handleStartEdit(item.id, item.quantity)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateStock(item.id, -1)}
                          disabled={item.quantity <= 0}
                          className="size-10"
                        >
                          <Minus className="size-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateStock(item.id, 1)}
                          className="size-10"
                        >
                          <Plus className="size-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Itens</p>
                <p className="text-2xl text-gray-900">{stockItems.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Itens com Estoque Baixo</p>
                <p className="text-2xl text-orange-600">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
