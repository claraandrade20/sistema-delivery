import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Copy, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Label } from '@shared/ui/label';
import { cuponsAPI } from '@shared/services/api';

interface Coupon {
  id: string | number;
  codigo: string;
  descricao?: string;
  valor_desconto: number;
  tipo_desconto: 'percentual' | 'fixo';
  quantidade_total: number;
  quantidade_usada: number;
  ativo: boolean;
  data_fim: string;
  uso_minimo?: number;
  data_inicio?: string;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    codigo: 'PROMO10',
    descricao: '10% de desconto em toda a loja',
    valor_desconto: 10,
    tipo_desconto: 'percentual',
    quantidade_total: 100,
    quantidade_usada: 45,
    ativo: true,
    data_fim: '2025-12-30',
    uso_minimo: 0,
    data_inicio: '2025-11-22',
  },
  {
    id: '2',
    codigo: 'DELIVERY5',
    descricao: 'R$ 5 de desconto na entrega',
    valor_desconto: 5,
    tipo_desconto: 'fixo',
    quantidade_total: 50,
    quantidade_usada: 32,
    ativo: true,
    data_fim: '2025-11-29',
    uso_minimo: 20,
    data_inicio: '2025-11-22',
  },
  {
    id: '3',
    codigo: 'BLACKFRIDAY20',
    descricao: '20% off em pedidos acima de R$ 100',
    valor_desconto: 20,
    tipo_desconto: 'percentual',
    quantidade_total: 200,
    quantidade_usada: 0,
    ativo: true,
    data_fim: '2025-12-25',
    uso_minimo: 100,
    data_inicio: '2025-11-22',
  },
  {
    id: '4',
    codigo: 'WELCOME15',
    descricao: '15% de desconto para primeiro pedido',
    valor_desconto: 15,
    tipo_desconto: 'percentual',
    quantidade_total: 500,
    quantidade_usada: 0,
    ativo: true,
    data_fim: '2025-12-31',
    uso_minimo: 0,
    data_inicio: '2025-11-22',
  },
  {
    id: '5',
    codigo: 'FRETEGRATIS',
    descricao: 'Frete grátis em pedidos acima de R$ 50',
    valor_desconto: 0,
    tipo_desconto: 'fixo',
    quantidade_total: 150,
    quantidade_usada: 0,
    ativo: true,
    data_fim: '2025-12-31',
    uso_minimo: 50,
    data_inicio: '2025-11-22',
  },
];

export const CouponsManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    codigo: '',
    descricao: '',
    valor_desconto: '',
    tipo_desconto: 'percentual' as 'percentual' | 'fixo',
    quantidade_total: '',
    uso_minimo: '0',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
  });

  useEffect(() => {
    carregarCupons();
  }, []);

  const carregarCupons = async () => {
    try {
      setLoading(true);
      const resposta = await cuponsAPI.listar();
      if (resposta.sucesso && resposta.dados) {
        setCoupons(resposta.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
      // Usar dados mock se houver erro
      toast.error('Usando dados de exemplo');
    } finally {
      setLoading(false);
    }
  };

  const toggleCouponStatus = async (id: string | number) => {
    try {
      const coupon = coupons.find(c => c.id === id);
      if (!coupon) return;

      await cuponsAPI.atualizar(String(id), { ativo: !coupon.ativo });
      setCoupons(coupons.map(c =>
        c.id === id ? { ...c, ativo: !c.ativo } : c
      ));
      toast.success('Status do cupom atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar cupom');
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Código "${code}" copiado!`);
  };

  const startEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setEditFormData({ ...coupon });
  };

  const saveEdit = async () => {
    try {
      await cuponsAPI.atualizar(String(editingId), editFormData);
      setCoupons(coupons.map(c =>
        c.id === editingId ? editFormData : c
      ));
      setEditingId(null);
      setEditFormData(null);
      toast.success('Cupom atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar cupom');
    }
  };

  const deleteCoupon = async (id: string | number) => {
    try {
      await cuponsAPI.deletar(String(id));
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Cupom removido!');
    } catch (error) {
      toast.error('Erro ao remover cupom');
    }
  };

  const criarCupom = async () => {
    try {
      if (!createFormData.codigo || !createFormData.valor_desconto || !createFormData.quantidade_total || !createFormData.data_fim) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const novosCupons = {
        ...createFormData,
        valor_desconto: parseFloat(createFormData.valor_desconto),
        quantidade_total: parseInt(createFormData.quantidade_total),
        uso_minimo: parseFloat(createFormData.uso_minimo) || 0,
      };

      await cuponsAPI.criar(novosCupons);
      
      setCoupons([...coupons, {
        id: Date.now(),
        ...novosCupons,
        quantidade_usada: 0,
        ativo: true,
      }]);

      setCreateFormData({
        codigo: '',
        descricao: '',
        valor_desconto: '',
        tipo_desconto: 'percentual',
        quantidade_total: '',
        uso_minimo: '0',
        data_inicio: new Date().toISOString().split('T')[0],
        data_fim: '',
      });

      setIsCreateDialogOpen(false);
      toast.success('Cupom criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar cupom');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cupons</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Cupom</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Código do Cupom</Label>
                <Input
                  placeholder="Ex: PROMO10"
                  value={createFormData.codigo}
                  onChange={(e) => setCreateFormData({ ...createFormData, codigo: e.target.value })}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  placeholder="Descrição do cupom"
                  value={createFormData.descricao}
                  onChange={(e) => setCreateFormData({ ...createFormData, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Desconto</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={createFormData.valor_desconto}
                    onChange={(e) => setCreateFormData({ ...createFormData, valor_desconto: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={createFormData.tipo_desconto}
                    onChange={(e) => setCreateFormData({ ...createFormData, tipo_desconto: e.target.value as 'percentual' | 'fixo' })}
                  >
                    <option value="percentual">Percentual (%)</option>
                    <option value="fixo">Valor fixo (R$)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={createFormData.quantidade_total}
                    onChange={(e) => setCreateFormData({ ...createFormData, quantidade_total: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Uso Mínimo (R$)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={createFormData.uso_minimo}
                    onChange={(e) => setCreateFormData({ ...createFormData, uso_minimo: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={createFormData.data_inicio}
                    onChange={(e) => setCreateFormData({ ...createFormData, data_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data Expiração</Label>
                  <Input
                    type="date"
                    value={createFormData.data_fim}
                    onChange={(e) => setCreateFormData({ ...createFormData, data_fim: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={criarCupom}>
                Criar Cupom
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {coupons.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Nenhum cupom disponível. Crie um novo!
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="bg-gray-100 px-3 py-1 rounded font-mono font-bold text-gray-900">
                        {coupon.codigo}
                      </code>
                      <Badge className={coupon.ativo ? 'bg-green-500' : 'bg-gray-400'}>
                        {coupon.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    {coupon.descricao && (
                      <p className="text-gray-600 text-sm mb-3">{coupon.descricao}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-500">Desconto</p>
                        <p className="text-gray-900 font-semibold">
                          {coupon.valor_desconto}{coupon.tipo_desconto === 'percentual' ? '%' : ' R$'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Utilizações</p>
                        <p className="text-gray-900 font-semibold">
                          {coupon.quantidade_usada} / {coupon.quantidade_total}
                        </p>
                      </div>
                      {coupon.uso_minimo && coupon.uso_minimo > 0 && (
                        <div>
                          <p className="text-gray-500">Mínimo</p>
                          <p className="text-gray-900 font-semibold">R$ {coupon.uso_minimo}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Expira em</p>
                        <p className="text-gray-900">
                          {new Date(coupon.data_fim).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        toggleCouponStatus(coupon.id);
                      }}
                    >
                      {coupon.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => copyCouponCode(coupon.codigo)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Dialog open={editingId === coupon.id} onOpenChange={(open: boolean) => !open && setEditingId(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => startEdit(coupon)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Cupom</DialogTitle>
                        </DialogHeader>
                        {editFormData && (
                          <div className="space-y-4">
                            <div>
                              <Label>Código do Cupom</Label>
                              <Input
                                value={editFormData.codigo}
                                onChange={(e) => setEditFormData({ ...editFormData, codigo: e.target.value })}
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
                                <Label>Desconto</Label>
                                <Input
                                  type="number"
                                  value={editFormData.valor_desconto}
                                  onChange={(e) => setEditFormData({ ...editFormData, valor_desconto: parseFloat(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>Tipo</Label>
                                <select
                                  className="w-full border rounded px-2 py-1"
                                  value={editFormData.tipo_desconto}
                                  onChange={(e) => setEditFormData({ ...editFormData, tipo_desconto: e.target.value as 'percentual' | 'fixo' })}
                                >
                                  <option value="percentual">Percentual (%)</option>
                                  <option value="fixo">Valor fixo (R$)</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Quantidade</Label>
                                <Input
                                  type="number"
                                  value={editFormData.quantidade_total}
                                  onChange={(e) => setEditFormData({ ...editFormData, quantidade_total: parseInt(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>Uso Mínimo (R$)</Label>
                                <Input
                                  type="number"
                                  value={editFormData.uso_minimo}
                                  onChange={(e) => setEditFormData({ ...editFormData, uso_minimo: parseFloat(e.target.value) })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Data Início</Label>
                                <Input
                                  type="date"
                                  value={editFormData.data_inicio}
                                  onChange={(e) => setEditFormData({ ...editFormData, data_inicio: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Data Expiração</Label>
                                <Input
                                  type="date"
                                  value={editFormData.data_fim}
                                  onChange={(e) => setEditFormData({ ...editFormData, data_fim: e.target.value })}
                                />
                              </div>
                            </div>
                            <Button className="w-full" onClick={saveEdit}>
                              Salvar Alterações
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
