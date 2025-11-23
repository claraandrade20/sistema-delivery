import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { restaurantesAPI } from '@shared/services/api';
import { toast } from 'sonner';
import { Plus, Edit, Eye, EyeOff, Star, Loader2, Trash2 } from 'lucide-react';

interface Restaurant {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  email: string;
  telefone: string;
  endereco: string;
  taxa_entrega: number;
  pedido_minimo: number;
  avaliacao?: number;
  ativo: boolean;
}

export const RestaurantsManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Restaurant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    email: '',
    telefone: '',
    endereco: '',
    taxa_entrega: 0,
    pedido_minimo: 0,
  });

  // Carregar restaurantes
  useEffect(() => {
    carregarRestaurantes();
  }, []);

  const carregarRestaurantes = async () => {
    try {
      setLoading(true);
      const data = await restaurantesAPI.listar();
      setRestaurants(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async (id: number) => {
    try {
      await restaurantesAPI.alternarStatus(id.toString());
      setRestaurants(restaurants.map(r =>
        r.id === id ? { ...r, ativo: !r.ativo } : r
      ));
      toast.success('Status do restaurante atualizado!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar status');
    }
  };

  const startEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditFormData({ ...restaurant });
  };

  const saveEdit = async () => {
    if (!editFormData || !editingId) return;

    try {
      await restaurantesAPI.atualizar(editingId.toString(), editFormData);
      setRestaurants(restaurants.map(r =>
        r.id === editingId ? editFormData : r
      ));
      setEditingId(null);
      setEditFormData(null);
      toast.success('Restaurante atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar restaurante');
    }
  };

  const handleCreateRestaurant = async () => {
    try {
      const created = await restaurantesAPI.criar(newRestaurant);
      setRestaurants([...restaurants, created]);
      setIsCreateDialogOpen(false);
      setNewRestaurant({
        nome: '',
        descricao: '',
        imagem: '',
        email: '',
        telefone: '',
        endereco: '',
        taxa_entrega: 0,
        pedido_minimo: 0,
      });
      toast.success('Restaurante cadastrado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar restaurante');
    }
  };

  const handleDeleteRestaurant = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o restaurante "${nome}"?`)) {
      return;
    }

    try {
      await restaurantesAPI.deletar(id.toString());
      setRestaurants(restaurants.filter(r => r.id !== id));
      toast.success('Restaurante excluído com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir restaurante');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Restaurantes</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                <Input 
                  placeholder="Ex: Pizzaria Bella Napoli"
                  value={newRestaurant.nome}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, nome: e.target.value })}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input 
                  placeholder="Descrição do restaurante"
                  value={newRestaurant.descricao}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input 
                    placeholder="(85) 3456-7890"
                    value={newRestaurant.telefone}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, telefone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="contato@restaurante.com"
                    value={newRestaurant.email}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input 
                  placeholder="Rua, número - Bairro, Cidade"
                  value={newRestaurant.endereco}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, endereco: e.target.value })}
                />
              </div>
              <div>
                <Label>Imagem URL</Label>
                <Input 
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={newRestaurant.imagem}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, imagem: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Taxa de Entrega (R$)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="8.90"
                    value={newRestaurant.taxa_entrega}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, taxa_entrega: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Pedido Mínimo (R$)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="25.00"
                    value={newRestaurant.pedido_minimo}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, pedido_minimo: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateRestaurant}>Cadastrar Restaurante</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {restaurant.imagem && (
                  <img src={restaurant.imagem} alt={restaurant.nome} className="w-32 h-32 object-cover rounded-lg" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{restaurant.nome}</h3>
                      <p className="text-gray-600 mt-1">{restaurant.descricao}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={restaurant.ativo ? 'bg-green-500' : 'bg-gray-400'}>
                        {restaurant.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {restaurant.avaliacao && (
                        <Badge className="bg-orange-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {restaurant.avaliacao}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                      <p className="text-gray-500">Endereço</p>
                      <p className="text-gray-900">{restaurant.endereco}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contato</p>
                      <p className="text-gray-900">{restaurant.telefone}</p>
                      <p className="text-gray-900">{restaurant.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Taxa de Entrega</p>
                      <p className="text-gray-900">R$ {(typeof restaurant.taxa_entrega === 'number' ? restaurant.taxa_entrega : parseFloat(restaurant.taxa_entrega) || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pedido Mínimo</p>
                      <p className="text-gray-900">R$ {(typeof restaurant.pedido_minimo === 'number' ? restaurant.pedido_minimo : parseFloat(restaurant.pedido_minimo) || 0).toFixed(2)}</p>
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
                                value={editFormData.nome}
                                onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Descrição</Label>
                              <Input
                                value={editFormData.descricao}
                                onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Telefone</Label>
                                <Input
                                  value={editFormData.telefone}
                                  onChange={(e) => setEditFormData({ ...editFormData, telefone: e.target.value })}
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
                                value={editFormData.endereco}
                                onChange={(e) => setEditFormData({ ...editFormData, endereco: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Imagem URL</Label>
                              <Input
                                value={editFormData.imagem}
                                onChange={(e) => setEditFormData({ ...editFormData, imagem: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Taxa de Entrega (R$)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editFormData.taxa_entrega}
                                  onChange={(e) => setEditFormData({ ...editFormData, taxa_entrega: parseFloat(e.target.value) || 0 })}
                                />
                              </div>
                              <div>
                                <Label>Pedido Mínimo (R$)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editFormData.pedido_minimo}
                                  onChange={(e) => setEditFormData({ ...editFormData, pedido_minimo: parseFloat(e.target.value) || 0 })}
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
                      {restaurant.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteRestaurant(restaurant.id, restaurant.nome)}
                    >
                      <Trash2 className="h-4 w-4" />
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
