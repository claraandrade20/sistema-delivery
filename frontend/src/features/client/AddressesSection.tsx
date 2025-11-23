import React, { useState, FormEvent } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@shared/ui/dialog';
import api from '@shared/services/api';
import { toast } from 'sonner';

type Address = {
  id: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  status?: 'principal' | 'secundario';
};

interface AddressesSectionProps {
  addresses: Address[];
  userId: string;
  onAddAddress: (address: Address) => void;
  onUpdateAddresses: (addresses: Address[]) => void;
}

export const AddressesSection: React.FC<AddressesSectionProps> = ({
  addresses,
  userId,
  onAddAddress,
  onUpdateAddresses,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    status: 'secundario' as 'principal' | 'secundario',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setErrors({});
    setForm({
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      status: 'secundario',
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      district: address.district,
      city: address.city,
      state: address.state,
      status: address.status || 'secundario',
    });
    setIsDialogOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.street.trim()) newErrors.street = 'Informe a rua/avenida';
    if (!form.number.trim()) newErrors.number = 'Informe o número';
    if (!form.district.trim()) newErrors.district = 'Informe o bairro';
    if (!form.city.trim()) newErrors.city = 'Informe a cidade';
    if (!form.state.trim()) newErrors.state = 'Informe o estado';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const addressData = {
        userId,
        street: form.street,
        number: form.number,
        complement: form.complement,
        district: form.district,
        city: form.city,
        state: form.state,
        status: form.status,
      };

      if (editingId) {
        // Atualizar endereço existente
        await api.enderecos.atualizar(editingId, addressData);
        const updatedAddresses = addresses.map((addr) =>
          addr.id === editingId
            ? { ...addr, ...form }
            : addr
        );
        onUpdateAddresses(updatedAddresses);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        // Criar novo endereço
        const response = await api.enderecos.criar(addressData);
        
        const newAddress: Address = {
          id: response.id || crypto.randomUUID(),
          ...form,
        };

        onAddAddress(newAddress);
        toast.success('Endereço adicionado com sucesso!');
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setForm({
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
        status: 'secundario' as 'principal' | 'secundario',
      });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar endereço');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este endereço?')) return;

    try {
      await api.enderecos.deletar(id);
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      onUpdateAddresses(updatedAddresses);
      toast.success('Endereço deletado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar endereço');
      console.error(error);
    }
  };

  return (
    <>
      <Card className="border border-gray-200">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-700" />
              <h2 className="font-semibold text-gray-900">Endereços</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleOpenAdd}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Nenhum endereço cadastrado
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {addr.street}, {addr.number}
                      {addr.complement && ` - ${addr.complement}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.district} - {addr.city}/{addr.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      addr.status === 'principal'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {addr.status === 'principal' ? 'Principal' : 'Entrega'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(addr)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(addr.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de novo/editar endereço */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar endereço' : 'Novo endereço'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr] gap-4">
              <div>
                <Label htmlFor="street">Endereço *</Label>
                <Input
                  id="street"
                  value={form.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  placeholder="Rua / Avenida"
                />
                {errors.street && (
                  <p className="text-xs text-red-500 mt-1">{errors.street}</p>
                )}
              </div>
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={form.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                  placeholder="Nº"
                />
                {errors.number && (
                  <p className="text-xs text-red-500 mt-1">{errors.number}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={form.complement}
                onChange={(e) => handleChange('complement', e.target.value)}
                placeholder="Apartamento, bloco, referência (opcional)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">Bairro *</Label>
                <Input
                  id="district"
                  value={form.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                />
                {errors.district && (
                  <p className="text-xs text-red-500 mt-1">{errors.district}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[120px] gap-4">
              <div>
                <Label htmlFor="state">Estado (UF) *</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="status">Tipo de endereço</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="secundario">Secundário</option>
                <option value="principal">Principal</option>
              </select>
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : editingId ? 'Atualizar endereço' : 'Salvar endereço'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
