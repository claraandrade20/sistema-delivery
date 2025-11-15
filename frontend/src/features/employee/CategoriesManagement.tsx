import React, { useState } from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Badge } from '/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '/ui/dialog';
import { Label } from '/ui/label';
import { mockCategories } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';

export const CategoriesManagement = () => {
  const [categories] = useState(mockCategories);

  const toggleCategoryStatus = (categoryId: string) => {
    toast.success('Status da categoria atualizado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input placeholder="Ex: Pizzas" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input placeholder="Descrição da categoria" />
              </div>
              <Button className="w-full">Criar Categoria</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-lg mb-3" />
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                {category.isActive ? (
                  <Badge className="bg-green-500">Ativa</Badge>
                ) : (
                  <Badge variant="secondary">Inativa</Badge>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategoryStatus(category.id)}
                >
                  {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
