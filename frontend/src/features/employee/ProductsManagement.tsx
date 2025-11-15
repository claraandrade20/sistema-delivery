import React, { useState } from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Badge } from '/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '/ui/dialog';
import { Label } from '/ui/label';
import { mockProducts } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Eye, EyeOff, Search } from 'lucide-react';

interface ProductsManagementProps {
  onNavigate: (page: string) => void;
}

export const ProductsManagement = ({ onNavigate }: ProductsManagementProps) => {
  const [products] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProductStatus = (productId: string) => {
    toast.success('Status do produto atualizado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Produto</Label>
                <Input placeholder="Ex: Pizza Margherita" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input placeholder="Descrição detalhada" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço Base</Label>
                  <Input type="number" placeholder="29.90" />
                </div>
                <div>
                  <Label>Estoque</Label>
                  <Input type="number" placeholder="50" />
                </div>
              </div>
              <Button className="w-full">Salvar Produto</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                </div>
                {product.isActive ? (
                  <Badge className="bg-green-500">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Inativo</Badge>
                )}
              </div>
              <p className="font-bold text-orange-600 mb-3">
                A partir de R$ {product.variations[0].price.toFixed(2)}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleProductStatus(product.id)}
                >
                  {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
