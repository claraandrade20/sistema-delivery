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
import { Plus, Edit, Eye, EyeOff, Search, Trash2, Loader2 } from 'lucide-react';
import { produtosAPI } from '@shared/services/api';

interface ProductsManagementProps {
  onNavigate: (page: string) => void;
}

export const ProductsManagement = ({ onNavigate }: ProductsManagementProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // ---------- Novo Produto ----------
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [savingNew, setSavingNew] = useState(false);

  // ---------- Editar Produto ----------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // ---------- Deletar Produto ----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await produtosAPI.listar();
      
      // Adaptar dados do banco para o formato do frontend
      const adaptedProducts = Array.isArray(data) ? data.map((p: any) => ({
        id: String(p.id),
        name: p.nome || p.name,
        description: p.descricao || p.description,
        image: p.imagem || p.image,
        categoryId: String(p.id_categoria || p.categoryId),
        restaurantId: String(p.id_restaurantes || p.restaurantId),
        stockQuantity: p.quantidade_estoque ?? p.stockQuantity ?? 0,
        isActive: p.ativo ?? p.isActive ?? true,
        isFeatured: p.destaque ?? p.isFeatured,
        rating: p.avaliacao ?? p.rating,
        reviewsCount: p.total_avaliacoes ?? p.reviewsCount,
        preparationTime: p.tempo_preparo ?? p.preparationTime,
        variations: (p.variacoes || p.variations || []).map((v: any) => ({
          id: String(v.id),
          name: v.nome || v.name,
          price: v.preco ?? v.price ?? 0,
        })),
        addons: (p.adicionais || p.addons || []).map((a: any) => ({
          id: String(a.id),
          name: a.nome || a.name,
          price: a.preco ?? a.price ?? 0,
        })),
      })) : [];

      setProducts(adaptedProducts);
      
      if (!data || data.length === 0) {
        console.warn('Nenhum produto retornado da API');
      }
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos: ' + (error.message || 'Tente novamente'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const saveNewProduct = async () => {
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

    const priceNumber = Number(newPrice);
    const stockNumber = Number(newStock);

    if (isNaN(priceNumber) || priceNumber < 0) {
      toast.error('O preço não pode ser negativo.');
      return;
    }
    if (isNaN(stockNumber) || stockNumber < 0) {
      toast.error('O estoque não pode ser negativo.');
      return;
    }

    try {
      setSavingNew(true);
      const newProduct = {
        nome: newName,
        descricao: newDescription,
        imagem: newImagePreview,
        id_categoria: 1, // Categoria padrão (Pizzas)
        id_restaurantes: 1, // Restaurante padrão
        quantidade_estoque: stockNumber,
        ativo: true,
        destaque: false,
        variacoes: [
          {
            nome: 'Padrão',
            preco: priceNumber,
          },
        ],
      };

      const created = await produtosAPI.criar(newProduct);
      
      // Adaptar resposta do banco
      const adaptedProduct = {
        id: String(created.id),
        name: created.nome,
        description: created.descricao,
        image: created.imagem,
        categoryId: String(created.id_categoria),
        restaurantId: String(created.id_restaurantes),
        stockQuantity: created.quantidade_estoque,
        isActive: created.ativo,
        variations: (created.variacoes || []).map((v: any) => ({
          id: String(v.id),
          name: v.nome,
          price: v.preco,
        })),
      };
      
      setProducts((prev) => [adaptedProduct, ...prev]);
      toast.success('Produto criado com sucesso!');
      setIsNewModalOpen(false);
    } catch (error) {
      toast.error('Erro ao criar produto');
      console.error(error);
    } finally {
      setSavingNew(false);
    }
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

  const saveEditProduct = async () => {
    if (!editingProduct.name.trim()) {
      toast.error('Nome obrigatório.');
      return;
    }

    try {
      setSavingEdit(true);
      
      // Converter para formato do banco
      const dataToUpdate = {
        nome: editingProduct.name,
        descricao: editingProduct.description,
        imagem: editImagePreview || editingProduct.image,
        quantidade_estoque: editingProduct.stockQuantity,
        ativo: editingProduct.isActive,
      };
      
      const updated = await produtosAPI.atualizar(editingProduct.id, dataToUpdate);
      
      // Adaptar resposta
      const adaptedProduct = {
        ...editingProduct,
        name: updated.nome || editingProduct.name,
        description: updated.descricao || editingProduct.description,
        image: updated.imagem || editingProduct.image,
        stockQuantity: updated.quantidade_estoque ?? editingProduct.stockQuantity,
        isActive: updated.ativo ?? editingProduct.isActive,
      };
      
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? adaptedProduct : p))
      );

      toast.success('Produto atualizado com sucesso!');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Erro ao atualizar produto');
      console.error(error);
    } finally {
      setSavingEdit(false);
    }
  };

  // -------- Modal: Deletar Produto --------
  const openDeleteModal = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeletingProduct(true);
      await produtosAPI.deletar(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success('Produto removido com sucesso!');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      // Extrair mensagem de erro mais amigável
      let errorMessage = 'Erro ao remover produto';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Mensagem especial para produto com pedidos
      if (errorMessage.includes('pedidos associados')) {
        toast.error(errorMessage, {
          duration: 5000,
        });
      } else {
        toast.error(errorMessage);
      }
      
      console.error('Erro ao deletar produto:', error);
    } finally {
      setDeletingProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>

        {/* Botão Novo Produto */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadProducts}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              'Atualizar'
            )}
          </Button>
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

                <Button 
                  className="w-full" 
                  onClick={saveNewProduct}
                  disabled={savingNew}
                >
                  {savingNew ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Produto'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      ) : (
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
                  A partir de R$ {Number(product.variations?.[0]?.price || 0).toFixed(2)}
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
      )}

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

              <Button 
                className="w-full" 
                onClick={saveEditProduct}
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

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {productToDelete && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Remover produto</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Tem certeza que deseja remover{' '}
                <span className="font-semibold">{productToDelete.name}</span>?
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-xs">
                  <strong>⚠️ Atenção:</strong> Esta ação não pode ser desfeita.
                  Se este produto estiver em pedidos existentes, a remoção será bloqueada para manter a integridade dos dados.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deletingProduct}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteProduct}
                disabled={deletingProduct}
              >
                {deletingProduct ? (
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
