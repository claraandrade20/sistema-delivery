import React, { useState } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Label } from '@shared/ui/label';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  maxUses: number;
  currentUses: number;
  active: boolean;
  expiresAt: string;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'PROMO10',
    discount: 10,
    discountType: 'percentage',
    maxUses: 100,
    currentUses: 45,
    active: true,
    expiresAt: '2025-12-31',
  },
  {
    id: '2',
    code: 'DELIVERY5',
    discount: 5,
    discountType: 'fixed',
    maxUses: 50,
    currentUses: 32,
    active: true,
    expiresAt: '2025-11-30',
  },
];

export const CouponsManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    ));
    toast.success('Status do cupom atualizado!');
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Código "${code}" copiado para a área de transferência!`);
  };

  const startEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setEditFormData({ ...coupon });
  };

  const saveEdit = () => {
    setCoupons(coupons.map(c =>
      c.id === editingId ? editFormData : c
    ));
    setEditingId(null);
    setEditFormData(null);
    toast.success('Cupom atualizado com sucesso!');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast.success('Cupom removido!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cupons</h1>
        <Dialog>
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
                <Input placeholder="Ex: PROMO10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Desconto</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <select className="w-full border rounded px-2 py-1">
                    <option>Percentual (%)</option>
                    <option>Valor fixo (R$)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Máx. Utilizações</Label>
                  <Input type="number" placeholder="100" />
                </div>
                <div>
                  <Label>Data de Expiração</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="w-full">Criar Cupom</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <code className="bg-gray-100 px-3 py-1 rounded font-mono font-bold text-gray-900">
                      {coupon.code}
                    </code>
                    <Badge className={coupon.active ? 'bg-green-500' : 'bg-gray-400'}>
                      {coupon.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-gray-500">Desconto</p>
                      <p className="text-gray-900 font-semibold">
                        {coupon.discount}{coupon.discountType === 'percentage' ? '%' : ' R$'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Utilizações</p>
                      <p className="text-gray-900 font-semibold">
                        {coupon.currentUses} / {coupon.maxUses}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expira em</p>
                      <p className="text-gray-900">
                        {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => copyCouponCode(coupon.code)}>
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
                              value={editFormData.code}
                              onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Desconto</Label>
                              <Input
                                type="number"
                                value={editFormData.discount}
                                onChange={(e) => setEditFormData({ ...editFormData, discount: parseFloat(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Tipo</Label>
                              <select
                                className="w-full border rounded px-2 py-1"
                                value={editFormData.discountType}
                                onChange={(e) => setEditFormData({ ...editFormData, discountType: e.target.value })}
                              >
                                <option value="percentage">Percentual (%)</option>
                                <option value="fixed">Valor fixo (R$)</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Máx. Utilizações</Label>
                              <Input
                                type="number"
                                value={editFormData.maxUses}
                                onChange={(e) => setEditFormData({ ...editFormData, maxUses: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Data de Expiração</Label>
                              <Input
                                type="date"
                                value={editFormData.expiresAt}
                                onChange={(e) => setEditFormData({ ...editFormData, expiresAt: e.target.value })}
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
                    onClick={() => deleteCoupon(coupon.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
