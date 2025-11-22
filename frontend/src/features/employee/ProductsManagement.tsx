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
import { mockProducts } from '@shared/data/mockData';
import { toast } from 'sonner';
import { Plus, Edit, Eye, EyeOff, Search, Trash2 } from 'lucide-react';

interface ProductsManagementProps {
  onNavigate: (page: string) => void;
}

export const ProductsManagement = ({ onNavigate }: ProductsManagementProps) => {
  const [products, setProducts] = useState<any[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');

  // ---------- Novo Produto ----------
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  // ---------- Editar Produto ----------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // ---------- Deletar Produto ----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isActive: !p.isActive } : p
      )
    );
    toast.success('Status atualizado!');
  };

  // -------- Modal: Novo Produto --------
  const openNewModal = () => {
    setNewName('');
    setNewDescription('');
    setNewPrice('');
    setNewStock('');
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

  const saveNewProduct = () => {
    if (!newName.trim()) {
      toast.error('Informe o nome do produto.');
      return;
    }
    if (newPrice === '') {
      toast.error('Informe o preço base.');
      return;
    }
    if (newStock === '') {
      toast.error('Informe o estoque.');
      return;
    }
    if (!newImageFile) {
      toast.error('Envie uma imagem para o produto.');
      return;
    }

    const priceNumber = Number(newPrice);
    const stockNumber = Number(newStock);

    // 🔒 validação extra contra negativos
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast.error('O preço não pode ser negativo.');
      return;
    }
    if (isNaN(stockNumber) || stockNumber < 0) {
      toast.error('O estoque não pode ser negativo.');
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: newName,
      description: newDescription,
      image: newImagePreview,
      isActive: true,
      variations: [
        {
          id: crypto.randomUUID(),
          name: 'Padrão',
          price: priceNumber,
          stock: stockNumber,
        },
      ],
    };

    setProducts((prev) => [...prev, newProduct]);
    toast.success('Produto criado!');
    setIsNewModalOpen(false);
  };

  // -------- Modal: Editar Produto --------
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setEditImagePreview(product.image);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const saveEditProduct = () => {
    if (!editingProduct.name.trim()) {
      toast.error('Nome obrigatório.');
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...editingProduct,
              image: editImagePreview || p.image,
            }
          : p
      )
    );

    toast.success('Produto atualizado!');
    setIsEditModalOpen(false);
  };

  // -------- Modal: Deletar Produto --------
  const openDeleteModal = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;

    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    toast.success('Produto removido com sucesso!');
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>

        {/* Botão Novo Produto */}
        <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={openNewModal}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Label>Nome *</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <Label>Descrição</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <Label>Imagem *</Label>
              <div className="border rounded p-3 bg-gray-50">
                <Input type="file" accept="image/*" onChange={handleNewImage} />
                {newImagePreview && (
                  <img
                    src={newImagePreview}
                    className="w-32 h-32 rounded object-cover mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      // permite campo vazio ou número >= 0
                      if (value === '' || Number(value) > 0) {
                        setNewPrice(value);
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Estoque *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newStock}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || Number(value) > 0) {
                        setNewStock(value);
                      }
                    }}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={saveNewProduct}>
                Salvar Produto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campo de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 rounded object-cover mb-3"
              />

              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
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
                {/* Editar */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditModal(product)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>

                {/* Ativar/Inativar */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleProductStatus(product.id)}
                >
                  {product.isActive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>

                {/* Deletar */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => openDeleteModal(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editingProduct && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Label>Nome *</Label>
              <Input
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />

              <Label>Descrição</Label>
              <Input
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
              />

              <Label>Imagem</Label>
              <div className="border rounded p-3 bg-gray-50">
                <Input type="file" accept="image/*" onChange={handleEditImage} />
                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    className="w-32 h-32 rounded object-cover mt-2"
                  />
                )}
              </div>

              <Button className="w-full" onClick={saveEditProduct}>
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {productToDelete && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Remover produto</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover{' '}
              <span className="font-semibold">{productToDelete.name}</span>?
              <br />
              Essa ação não pode ser desfeita.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteProduct}
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
