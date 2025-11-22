import React, { useState } from 'react';
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
import { mockCategories } from '@shared/data/mockData';
import { toast } from 'sonner';
import { Plus, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<any[]>(mockCategories);

  // NOVA CATEGORIA
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  // EDITAR CATEGORIA
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // DELETAR CATEGORIA
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);

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

  const handleCreateCategory = () => {
    if (!newName.trim()) {
      toast.error('Informe o nome da categoria.');
      return;
    }
    if (!newImageFile) {
      toast.error('Envie uma imagem para a categoria.');
      return;
    }

    const newCategory = {
      id: crypto.randomUUID(),
      name: newName,
      description: newDescription,
      image: newImagePreview, // em produção isso vira URL real da API
      isActive: true,
    };

    setCategories(prev => [...prev, newCategory]);
    toast.success('Categoria criada com sucesso!');
    setIsNewModalOpen(false);
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

  const handleSaveEditCategory = () => {
    if (!editingCategory.name.trim()) {
      toast.error('O nome da categoria é obrigatório.');
      return;
    }

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
  };

  // ----------- DELETAR CATEGORIA -----------
  const openDeleteModal = (category: any) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
    toast.success('Categoria removida com sucesso!');
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>

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
                <Label>Imagem *</Label>
                <Input type="file" accept="image/*" onChange={handleNewImage} />
                {newImagePreview && (
                  <img
                    src={newImagePreview}
                    className="w-full h-32 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <Button className="w-full" onClick={handleCreateCategory}>
                Criar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTA DE CATEGORIAS */}
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

              <Button className="w-full" onClick={handleSaveEditCategory}>
                Salvar Alterações
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
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>

              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDeleteCategory}
              >
                Remover
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
