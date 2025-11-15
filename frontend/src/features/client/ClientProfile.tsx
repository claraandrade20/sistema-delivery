import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/ui/card';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Label } from '/ui/label';
import { useAuth } from '/context/AuthContext';
import { getUserAddresses } from '/data/mockData';
import { toast } from 'sonner@2.0.3';
import { User, MapPin, Phone, Mail, Plus } from 'lucide-react';

export const ClientProfile = () => {
  const { user } = useAuth();
  const addresses = user ? getUserAddresses(user.id) : [];
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleUpdateProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
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
          <Button onClick={handleUpdateProfile} className="bg-gradient-to-r from-orange-500 to-red-600">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum endereço cadastrado</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{address.street}, {address.number}</p>
                      {address.complement && <p className="text-sm text-gray-600">{address.complement}</p>}
                      <p className="text-sm text-gray-600">{address.neighborhood}</p>
                      <p className="text-sm text-gray-600">{address.city}, {address.state} - CEP: {address.zipCode}</p>
                    </div>
                    {address.isDefault && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Padrão</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
