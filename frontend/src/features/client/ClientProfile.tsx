import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Label } from '/ui/label';
import { useAuth } from '/context/AuthContext';
import { getUserAddresses } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { User, MapPin } from 'lucide-react';
import { AddressesSection } from './AddressesSection'; // <-- IMPORTA O COMPONENTE

export const ClientProfile = () => {
  const { user } = useAuth();

  // 🔥 Carrega endereços do mock e permite adicionar novos
  const [addresses, setAddresses] = useState(
    user ? getUserAddresses(user.id) : []
  );

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleUpdateProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  // 🔥 Salva o novo endereço vindo do modal
  const handleAddAddress = (newAddress: any) => {
    setAddresses((prev) => [...prev, newAddress]);
    toast.success('Endereço adicionado com sucesso!');
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

      {/* Endereços (AGORA TOTALMENTE FUNCIONAL) */}
      <AddressesSection
        addresses={addresses}
        onAddAddress={handleAddAddress}
      />
    </div>
  );
};
