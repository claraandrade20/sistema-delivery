import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog';
import { Label } from '@shared/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Eye, EyeOff, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { categoriasAPI } from '@shared/services/api';

interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  imagem?: string;
  id_restaurantes: number;
  ativo: boolean;
  criado_em: string;
}

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  // NOVA CATEGORIA
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [savingNew, setSavingNew] = useState(false);

  // EDITAR CATEGORIA
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // DELETAR CATEGORIA
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Categoria | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriasAPI.listar({ restaurantId: '1' });
      if (response.success) {
        setCategories(response.data);
      } else {
        throw new Error(response.error || 'Erro ao carregar categorias');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar categorias');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (categoryId: number) => {
    try {
      const response = await categoriasAPI.alternarStatus(categoryId.toString());
      if (response.success) {
        setCategories(prev =>
          prev.map(cat =>
            cat.id === categoryId ? { ...cat, ativo: !cat.ativo } : cat
          )
        );
        toast.success(response.message || 'Status da categoria atualizado!');
      } else {
        throw new Error(response.error || 'Erro ao atualizar status');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar status da categoria');
      console.error(error);
    }
  };

  // ----------- NOVA CATEGORIA -----------
  const openNewModal = () => {
    setNewName('');
    setNewDescription('');
    setNewImageUrl('');
    setIsNewModalOpen(true);
  };

  const handleCreateCategory = async () => {
    if (!newName.trim()) {
      toast.error('Informe o nome da categoria.');
      return;
    }

    try {
      setSavingNew(true);
      const response = await categoriasAPI.criar({
        nome: newName.trim(),
        descricao: newDescription.trim() || null,
        imagem: newImageUrl.trim() || null,
        id_restaurantes: 1
      });

      if (response.success) {
        setCategories(prev => [...prev, response.data]);
        toast.success(response.message || 'Categoria criada com sucesso!');
        setIsNewModalOpen(false);
      } else {
        throw new Error(response.error || 'Erro ao criar categoria');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar categoria');
      console.error(error);
    } finally {
      setSavingNew(false);
    }
  };

  // ----------- EDITAR CATEGORIA -----------
  const openEditModal = (category: Categoria) => {
    setEditingCategory({ ...category });
    setIsEditModalOpen(true);
  };

  const handleSaveEditCategory = async () => {
    if (!editingCategory || !editingCategory.nome.trim()) {
      toast.error('O nome da categoria é obrigatório.');
      return;
    }

    try {
      setSavingEdit(true);
      const response = await categoriasAPI.atualizar(editingCategory.id.toString(), {
        nome: editingCategory.nome.trim(),
        descricao: editingCategory.descricao?.trim() || null,
        imagem: editingCategory.imagem?.trim() || null,
        ativo: editingCategory.ativo
      });

      if (response.success) {
        setCategories(prev =>
          prev.map(cat =>
            cat.id === editingCategory.id ? response.data : cat
          )
        );
        toast.success(response.message || 'Categoria atualizada com sucesso!');
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.error || 'Erro ao atualizar categoria');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar categoria');
      console.error(error);
    } finally {
      setSavingEdit(false);
    }
  };

  // ----------- DELETAR CATEGORIA -----------
  const openDeleteModal = (category: Categoria) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingCategory(true);
      const response = await categoriasAPI.deletar(categoryToDelete.id.toString());
      
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
        toast.success(response.message || 'Categoria removida com sucesso!');
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(response.error || 'Erro ao remover categoria');
      }
    } catch (error: any) {
      // Tentar extrair a mensagem de erro do servidor
      let errorMessage = 'Erro ao remover categoria';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Se o erro vem do servidor com uma estrutura específica
      if (error.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
      console.error('Erro ao deletar categoria:', error);
    } finally {
      setDeletingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={loadCategories}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          {/* MODAL NOVA CATEGORIA */}
          <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600" onClick={openNewModal}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Nome *</Label>
                  <Input
                    placeholder="Ex: Pizzas"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Descrição da categoria"
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Label>URL da Imagem</Label>
                  <Input
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                  />
                  {newImageUrl && (
                    <img
                      src={newImageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>



                <Button 
                  className="w-full" 
                  onClick={handleCreateCategory}
                  disabled={savingNew}
                >
                  {savingNew ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Categoria'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* LISTA DE CATEGORIAS */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">Nenhuma categoria encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Card key={category.id}>
              <CardContent className="p-4">
                {category.imagem ? (
                  <img
                    src={category.imagem}
                    alt={category.nome}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(category.nome.charAt(0))}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-blue-600">{category.nome.charAt(0)}</h3>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{category.nome}</h3>
                    <p className="text-sm text-gray-600">{category.descricao || 'Sem descrição'}</p>
                  </div>

                  {category.ativo ? (
                    <Badge className="bg-green-500">Ativa</Badge>
                  ) : (
                    <Badge variant="secondary">Inativa</Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {/* EDITAR */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>

                  {/* ATIVAR/INATIVAR */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCategoryStatus(category.id)}
                  >
                    {category.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>

                  {/* DELETAR */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => openDeleteModal(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL EDITAR CATEGORIA */}
      {editingCategory && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={editingCategory.nome}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, nome: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Descrição</Label>
                <Input
                  value={editingCategory.descricao || ''}
                  onChange={e =>
                    setEditingCategory({
                      ...editingCategory,
                      descricao: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>URL da Imagem</Label>
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={editingCategory.imagem || ''}
                  onChange={e =>
                    setEditingCategory({
                      ...editingCategory,
                      imagem: e.target.value,
                    })
                  }
                />
                {editingCategory.imagem && (
                  <img
                    src={editingCategory.imagem}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg mt-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveEditCategory}
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL DELETE */}
      {categoryToDelete && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Remover Categoria</DialogTitle>
            </DialogHeader>

            <div className="text-sm text-gray-600">
              <p className="mb-2">
                Tem certeza que deseja remover{' '}
                <strong>{categoryToDelete.nome}</strong>?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-xs">
                  <strong>⚠️ Atenção:</strong> Esta ação não pode ser desfeita.
                  Se houver produtos associados a esta categoria, a remoção será bloqueada.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deletingCategory}
              >
                Cancelar
              </Button>

              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDeleteCategory}
                disabled={deletingCategory}
              >
                {deletingCategory ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removendo...
                  </>
                ) : (
                  'Remover'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
