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

// Categorias padrão - dados simulados
const defaultCategories = [
  { id: '1', name: 'Pizzas', description: 'Deliciosas pizzas variadas', image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97', isActive: true },
  { id: '2', name: 'Bebidas', description: 'Bebidas frias e quentes', image: 'https://images.unsplash.com/photo-1732029543356-44fadaeeca51', isActive: true },
  { id: '3', name: 'Sobremesas', description: 'Doces para finalizar', image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344', isActive: true },
  { id: '4', name: 'Massas', description: 'Massas frescas e saborosas', image: 'https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d', isActive: true },
  { id: '5', name: 'Saladas', description: 'Saladas saudáveis', image: 'https://images.unsplash.com/photo-1692194741267-3df1119973ff', isActive: true },
  { id: '6', name: 'Hambúrgueres', description: 'Burgers gourmet', image: 'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de', isActive: true },
];

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // NOVA CATEGORIA
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [savingNew, setSavingNew] = useState(false);

  // EDITAR CATEGORIA
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // DELETAR CATEGORIA
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // Por enquanto usando dados padrão
      // Em produção, seria uma chamada à API
      setCategories(defaultCategories);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
      console.error(error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
    toast.success('Status da categoria atualizado!');
  };

  // ----------- NOVA CATEGORIA -----------
  const openNewModal = () => {
    setNewName('');
    setNewDescription('');
    setNewImageFile(null);
    setNewImagePreview(null);
    setIsNewModalOpen(true);
  };

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleCreateCategory = async () => {
    if (!newName.trim()) {
      toast.error('Informe o nome da categoria.');
      return;
    }

    try {
      setSavingNew(true);
      const newCategory = {
        id: crypto.randomUUID(),
        name: newName,
        description: newDescription,
        image: newImagePreview || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(newName),
        isActive: true,
      };

      setCategories(prev => [...prev, newCategory]);
      toast.success('Categoria criada com sucesso!');
      setIsNewModalOpen(false);
    } catch (error) {
      toast.error('Erro ao criar categoria');
      console.error(error);
    } finally {
      setSavingNew(false);
    }
  };

  // ----------- EDITAR CATEGORIA -----------
  const openEditModal = (category: any) => {
    setEditingCategory({ ...category });
    setEditImagePreview(category.image);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEditCategory = async () => {
    if (!editingCategory.name.trim()) {
      toast.error('O nome da categoria é obrigatório.');
      return;
    }

    try {
      setSavingEdit(true);
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? {
                ...editingCategory,
                image: editImagePreview || cat.image,
              }
            : cat
        )
      );

      toast.success('Categoria atualizada com sucesso!');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
      console.error(error);
    } finally {
      setSavingEdit(false);
    }
  };

  // ----------- DELETAR CATEGORIA -----------
  const openDeleteModal = (category: any) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      setDeletingCategory(true);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      toast.success('Categoria removida com sucesso!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Erro ao remover categoria');
      console.error(error);
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
                  <Label>Imagem</Label>
                  <Input type="file" accept="image/*" onChange={handleNewImage} />
                  {newImagePreview && (
                    <img
                      src={newImagePreview}
                      className="w-full h-32 object-cover rounded-lg mt-2"
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
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>

                  {category.isActive ? (
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
                    {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  value={editingCategory.name}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Descrição</Label>
                <Input
                  value={editingCategory.description}
                  onChange={e =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Imagem</Label>
                <Input type="file" accept="image/*" onChange={handleEditImage} />
                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    className="w-full h-32 object-cover rounded-lg mt-2"
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

            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover{' '}
              <strong>{categoryToDelete.name}</strong>?<br />
              Essa ação não pode ser desfeita.
            </p>

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
