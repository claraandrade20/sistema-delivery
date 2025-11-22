import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { useAuth } from '@shared/context/AuthContext';
import { toast } from 'sonner';
import { User, MapPin } from 'lucide-react';
import { AddressesSection } from './AddressesSection';
import api from '@shared/services/api';

export const ClientProfile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Carrega endereços do backend ao montar o componente
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      try {
        setIsLoadingAddresses(true);
        const data = await api.enderecos.listar({ userId: user.id });
        setAddresses(data || []);
      } catch (error) {
        console.error('Erro ao carregar endereços:', error);
        toast.error('Erro ao carregar endereços');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user?.id]);

  const handleUpdateProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  // Atualiza a lista local com o novo endereço
  const handleAddAddress = (newAddress: any) => {
    setAddresses((prev) => [...prev, newAddress]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email} disabled />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button
            onClick={handleUpdateProfile}
            className="bg-gradient-to-r from-orange-500 to-red-600"
          >
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Endereços */}
      {!isLoadingAddresses && (
        <AddressesSection
          addresses={addresses}
          userId={user?.id || ''}
          onAddAddress={handleAddAddress}
        />
      )}
    </div>
  );
};
