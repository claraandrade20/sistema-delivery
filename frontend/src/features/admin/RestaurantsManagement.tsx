import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { restaurantesAPI } from '@shared/services/api';
import { toast } from 'sonner';
import { Edit, Eye, EyeOff, Star, Loader2, Trash2, Package, Tag, BarChart3 } from 'lucide-react';

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
  const [expandedRestaurantId, setExpandedRestaurantId] = useState<number | null>(null);
  const [restaurantDetails, setRestaurantDetails] = useState<{
    produtos: any[];
    categorias: any[];
    estatisticas: any;
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
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

  const toggleRestaurantDetails = async (id: number) => {
    if (expandedRestaurantId === id) {
      setExpandedRestaurantId(null);
      setRestaurantDetails(null);
      return;
    }

    setExpandedRestaurantId(id);
    setLoadingDetails(true);

    try {
      const [produtos, categorias, estatisticas] = await Promise.all([
        restaurantesAPI.listarProdutos(id.toString()),
        restaurantesAPI.listarCategorias(id.toString()),
        restaurantesAPI.obterEstatisticas(id.toString()),
      ]);

      setRestaurantDetails({ produtos, categorias, estatisticas });
    } catch (error: any) {
      toast.error('Erro ao carregar detalhes do restaurante');
      setExpandedRestaurantId(null);
    } finally {
      setLoadingDetails(false);
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
        {/* Botão de criação removido conforme solicitado */}
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
                    {/* Botão 'Detalhes' removido conforme solicitado */}
                  </div>
                </div>
              </div>

              {/* Seção Expandida com Produtos e Categorias */}
              {expandedRestaurantId === restaurant.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    </div>
                  ) : restaurantDetails ? (
                    <div className="space-y-6">
                      {/* Estatísticas */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                          Estatísticas
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-500">Categorias</p>
                              <p className="text-2xl font-bold text-purple-600">
                                {restaurantDetails.estatisticas.total_categorias}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-500">Produtos</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {restaurantDetails.estatisticas.total_produtos}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-500">Disponíveis</p>
                              <p className="text-2xl font-bold text-green-600">
                                {restaurantDetails.estatisticas.produtos_disponiveis}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-500">Pedidos</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {restaurantDetails.estatisticas.total_pedidos}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-500">Receita Total</p>
                              <p className="text-2xl font-bold text-emerald-600">
                                R$ {restaurantDetails.estatisticas.receita_total.toFixed(2)}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Categorias */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Tag className="h-5 w-5 text-purple-600" />
                          Categorias ({restaurantDetails.categorias.length})
                        </h4>
                        {restaurantDetails.categorias.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {restaurantDetails.categorias.map((categoria: any) => (
                              <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{categoria.nome}</p>
                                      <p className="text-sm text-gray-500">
                                        {categoria.total_produtos} produto(s)
                                      </p>
                                    </div>
                                    <Badge className={categoria.ativo ? 'bg-green-500' : 'bg-gray-400'}>
                                      {categoria.ativo ? 'Ativa' : 'Inativa'}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">Nenhuma categoria cadastrada</p>
                        )}
                      </div>

                      {/* Produtos */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-5 w-5 text-purple-600" />
                          Produtos ({restaurantDetails.produtos.length})
                        </h4>
                        {restaurantDetails.produtos.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {restaurantDetails.produtos.slice(0, 6).map((produto: any) => (
                              <Card key={produto.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex gap-3">
                                    {produto.imagem && (
                                      <img 
                                        src={produto.imagem} 
                                        alt={produto.nome} 
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <p className="font-medium text-gray-900">{produto.nome}</p>
                                          <p className="text-sm text-gray-500">{produto.categoria_nome}</p>
                                        </div>
                                        <Badge className={produto.disponivel ? 'bg-green-500' : 'bg-red-500'}>
                                          {produto.disponivel ? 'Disponível' : 'Indisponível'}
                                        </Badge>
                                      </div>
                                      <p className="text-lg font-bold text-purple-600 mt-1">
                                        R$ {produto.preco.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
                        )}
                        {restaurantDetails.produtos.length > 6 && (
                          <p className="text-center text-sm text-gray-500 mt-3">
                            ... e mais {restaurantDetails.produtos.length - 6} produto(s)
                          </p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
