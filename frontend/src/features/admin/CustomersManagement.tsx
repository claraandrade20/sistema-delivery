import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { toast } from 'sonner';
import { Search, User, Mail, Phone, Eye, EyeOff, Edit, Loader2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Label } from '@shared/ui/label';
import { clientesAPI } from '@shared/services/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  // Carregar clientes do banco
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesAPI.listar();
      setCustomers(data);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCustomerStatus = async (id: string) => {
    try {
      await clientesAPI.alternarStatus(id);
      toast.success('Status do cliente atualizado!');
      carregarClientes(); // Recarregar lista
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  };

  const startEdit = (customer: any) => {
    setEditingId(customer.id);
    setEditFormData({ ...customer });
  };

  const saveEdit = async () => {
    try {
      await clientesAPI.atualizar(editingId!, {
        name: editFormData.name,
        phone: editFormData.phone,
      });
      setEditingId(null);
      setEditFormData(null);
      toast.success('Cliente atualizado com sucesso!');
      carregarClientes(); // Recarregar lista
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente: ' + error.message);
    }
  };

  const deleteCliente = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cliente ${nome}?`)) {
      return;
    }

    try {
      // Verificar se o token existe
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      await clientesAPI.deletar(id);
      toast.success('Cliente excluído com sucesso!');
      carregarClientes(); // Recarregar lista
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else {
        toast.error('Erro ao excluir cliente: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar clientes por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cliente desde: {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={customer.isActive ? 'bg-green-500' : 'bg-gray-400'}>
                    {customer.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Dialog open={editingId === customer.id} onOpenChange={(open: boolean) => !open && setEditingId(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                      </DialogHeader>
                      {editFormData && (
                        <div className="space-y-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={editFormData.email}
                              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                              disabled
                            />
                          </div>
                          <div>
                            <Label>Telefone</Label>
                            <Input
                              value={editFormData.phone}
                              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            />
                          </div>
                          <Button className="w-full" onClick={saveEdit}>Salvar Alterações</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCustomerStatus(customer.id)}
                  >
                    {customer.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCliente(customer.id, customer.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
};
