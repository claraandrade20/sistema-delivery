import React, { useState } from 'react';
import { Card, CardContent } from '/ui/card';
import { Button } from '/ui/button';
import { Badge } from '/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '/ui/dialog';
import { Input } from '/ui/input';
import { Label } from '/ui/label';
import { mockRestaurants } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Eye, EyeOff, Star } from 'lucide-react';

export const RestaurantsManagement = () => {
  const [restaurants] = useState(mockRestaurants);

  const toggleRestaurantStatus = (id: string) => {
    toast.success('Status do restaurante atualizado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Restaurantes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Restaurante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Restaurante</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Restaurante</Label>
                <Input placeholder="Ex: Pizzaria Bella Napoli" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input placeholder="Descrição do restaurante" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input placeholder="(11) 3456-7890" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="contato@restaurante.com" />
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input placeholder="Rua, número - Bairro, Cidade" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Taxa de Entrega (R$)</Label>
                  <Input type="number" placeholder="8.90" />
                </div>
                <div>
                  <Label>Pedido Mínimo (R$)</Label>
                  <Input type="number" placeholder="25.00" />
                </div>
              </div>
              <Button className="w-full">Cadastrar Restaurante</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <img src={restaurant.image} alt={restaurant.name} className="w-32 h-32 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                      <p className="text-gray-600 mt-1">{restaurant.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={restaurant.isActive ? 'bg-green-500' : 'bg-gray-400'}>
                        {restaurant.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {restaurant.rating && (
                        <Badge className="bg-orange-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {restaurant.rating}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                      <p className="text-gray-500">Endereço</p>
                      <p className="text-gray-900">{restaurant.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contato</p>
                      <p className="text-gray-900">{restaurant.phone}</p>
                      <p className="text-gray-900">{restaurant.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Taxa de Entrega</p>
                      <p className="text-gray-900">R$ {restaurant.deliveryFee.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pedido Mínimo</p>
                      <p className="text-gray-900">R$ {restaurant.minimumOrder?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRestaurantStatus(restaurant.id)}
                    >
                      {restaurant.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
