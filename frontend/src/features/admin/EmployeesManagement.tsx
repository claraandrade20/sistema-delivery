import React, { useState } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { mockUsers } from '@shared/data/mockData';
import { toast } from 'sonner';
import { Search, User, Mail, Phone, Eye, EyeOff, Plus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Label } from '@shared/ui/label';

export const EmployeesManagement = () => {
  const employees = mockUsers.filter(u => u.role === 'employee');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleEmployeeStatus = (id: string) => {
    toast.success('Status do funcionário atualizado!');
  };

  const startEdit = (employee: any) => {
    setEditingId(employee.id);
    setEditFormData({ ...employee });
  };

  const saveEdit = () => {
    setEditingId(null);
    setEditFormData(null);
    toast.success('Funcionário atualizado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Funcionários</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Funcionário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input placeholder="Nome completo" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input placeholder="(85) 98765-4321" />
              </div>
              <div>
                <Label>Restaurante</Label>
                <Input placeholder="Selecionar restaurante" />
              </div>
              <Button className="w-full">Adicionar Funcionário</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar funcionários por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={employee.isActive ? 'bg-green-500' : 'bg-gray-400'}>
                    {employee.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Dialog open={editingId === employee.id} onOpenChange={(open: boolean) => !open && setEditingId(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Funcionário</DialogTitle>
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
                    onClick={() => toggleEmployeeStatus(employee.id)}
                  >
                    {employee.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
