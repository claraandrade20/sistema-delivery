import React, { useState } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { mockRestaurants } from '@shared/data/mockData';
import { toast } from 'sonner';
import { Plus, Edit, Eye, EyeOff, Star } from 'lucide-react';

export const RestaurantsManagement = () => {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const toggleRestaurantStatus = (id: string) => {
    setRestaurants(restaurants.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
    toast.success('Status do restaurante atualizado!');
  };

  const startEdit = (restaurant: any) => {
    setEditingId(restaurant.id);
    setEditFormData({ ...restaurant });
  };

  const saveEdit = () => {
    setRestaurants(restaurants.map(r =>
      r.id === editingId ? editFormData : r
    ));
    setEditingId(null);
    setEditFormData(null);
    toast.success('Restaurante atualizado com sucesso!');
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
                  <Input placeholder="(85) 3456-7890" />
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
                    <Dialog open={editingId === restaurant.id} onOpenChange={(open: boolean) => !open && setEditingId(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => startEdit(restaurant)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Restaurante</DialogTitle>
                        </DialogHeader>
                        {editFormData && (
                          <div className="space-y-4">
                            <div>
                              <Label>Nome do Restaurante</Label>
                              <Input
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Descrição</Label>
                              <Input
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Telefone</Label>
                                <Input
                                  value={editFormData.phone}
                                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={editFormData.email}
                                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Endereço</Label>
                              <Input
                                value={editFormData.address}
                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Taxa de Entrega (R$)</Label>
                                <Input
                                  type="number"
                                  value={editFormData.deliveryFee}
                                  onChange={(e) => setEditFormData({ ...editFormData, deliveryFee: parseFloat(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>Pedido Mínimo (R$)</Label>
                                <Input
                                  type="number"
                                  value={editFormData.minimumOrder}
                                  onChange={(e) => setEditFormData({ ...editFormData, minimumOrder: parseFloat(e.target.value) })}
                                />
                              </div>
                            </div>
                            <Button className="w-full" onClick={saveEdit}>Salvar Alterações</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
