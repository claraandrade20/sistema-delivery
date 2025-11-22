import React, { useState, FormEvent } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { MapPin, Plus } from 'lucide-react';
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
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
};

interface AddressesSectionProps {
  addresses: Address[];
  onAddAddress: (address: Address) => void; // aqui você pode chamar API no pai
}

export const AddressesSection: React.FC<AddressesSectionProps> = ({
  addresses,
  onAddAddress,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpenAdd = () => {
    setErrors({});
    setForm({
      cep: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    });
    setIsDialogOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.cep.trim()) newErrors.cep = 'Informe o CEP';
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
      const newAddress: Address = {
        id: crypto.randomUUID(),
        ...form,
      };

      // Envia o endereço para o backend
      await api.enderecos.criar(newAddress);
      
      onAddAddress(newAddress);
      setIsDialogOpen(false);
      toast.success('Endereço adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar endereço');
      console.error(error);
    } finally {
      setIsLoading(false);
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
                  className="border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {addr.street}, {addr.number}
                      {addr.complement && ` - ${addr.complement}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.district} - {addr.city}/{addr.state}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">CEP {addr.cep}</p>
                  </div>
                  <Badge className="self-start sm:self-auto bg-gray-100 text-gray-700">
                    Entrega
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de novo endereço */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo endereço</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,120px] gap-4">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={form.cep}
                  onChange={(e) => handleChange('cep', e.target.value)}
                  placeholder="00000-000"
                />
                {errors.cep && (
                  <p className="text-xs text-red-500 mt-1">{errors.cep}</p>
                )}
              </div>
            </div>

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

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar endereço'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
