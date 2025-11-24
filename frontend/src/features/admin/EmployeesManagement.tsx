import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { toast } from 'sonner';
import { Search, User, Mail, Phone, Eye, EyeOff, Plus, Edit, Loader2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Label } from '@shared/ui/label';
import { funcionariosAPI } from '@shared/services/api';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  restaurantId: string;
  isActive: boolean;
  createdAt: string;
}

export const EmployeesManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    restaurantId: '1',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === MÁSCARA DE TELEFONE ===
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    const truncated = numbers.slice(0, 11);
    
    if (truncated.length <= 2) return truncated;
    if (truncated.length <= 7) return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
  };

  // === FILTRO DE NOME - Apenas letras ===
  const handleNameChange = (value: string) => {
    // Aceita apenas letras e espaços
    const apenasLetras = value.replace(/[^a-zA-Z\s]/g, '');
    
    // Formatar cada palavra com primeira letra maiúscula
    const nomeFormatado = apenasLetras
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
    
    setNewEmployeeData({ ...newEmployeeData, name: nomeFormatado });
  };

  // === FORMATADOR DE EMAIL - Primeira letra minúscula, permite números ===
  const handleEmailChange = (value: string) => {
    // Remove espaços e converte para minúsculas
    let emailLimpo = value.trim().toLowerCase();
    
    // Remove tudo que não é letra, número, @ ou ponto
    emailLimpo = emailLimpo.replace(/[^a-z0-9@.]/g, '');
    
    setNewEmployeeData({ ...newEmployeeData, email: emailLimpo });
  };

  // Carregar funcionários do banco
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await funcionariosAPI.listar();
      setEmployees(data);
    } catch (error: any) {
      console.error('Erro ao carregar funcionários:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else {
        toast.error('Erro ao carregar funcionários: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleEmployeeStatus = async (id: string) => {
    try {
      await funcionariosAPI.alternarStatus(id);
      toast.success('Status do funcionário atualizado!');
      carregarFuncionarios();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  };

  const startEdit = (employee: any) => {
    setEditingId(employee.id);
    setEditFormData({ ...employee });
  };

  const saveEdit = async () => {
    try {
      await funcionariosAPI.atualizar(editingId!, {
        name: editFormData.name,
        phone: editFormData.phone,
        restaurantId: editFormData.restaurantId,
      });
      setEditingId(null);
      setEditFormData(null);
      toast.success('Funcionário atualizado com sucesso!');
      carregarFuncionarios();
    } catch (error: any) {
      console.error('Erro ao atualizar funcionário:', error);
      toast.error('Erro ao atualizar funcionário: ' + error.message);
    }
  };

  const deleteEmployee = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o funcionário ${nome}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      await funcionariosAPI.deletar(id);
      toast.success('Funcionário excluído com sucesso!');
      carregarFuncionarios();
    } catch (error: any) {
      console.error('Erro ao excluir funcionário:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (error.message.includes('403')) {
        toast.error('Você não tem permissão para excluir funcionários.');
      } else {
        toast.error('Erro ao excluir funcionário: ' + error.message);
      }
    }
  };

  const addEmployee = async () => {
    // Validações semelhantes às usadas em Login.tsx
    try {
      // Campos obrigatórios
      if (!newEmployeeData.name || !newEmployeeData.email || !newEmployeeData.password || !newEmployeeData.restaurantId) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      // Nome completo
      if (newEmployeeData.name.trim().split(' ').length < 2) {
        toast.error('Digite o nome completo (Nome e Sobrenome)');
        return;
      }

      // Email válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmployeeData.email)) {
        toast.error('Digite um e-mail válido');
        return;
      }

      // Domínios permitidos (mesma lista do Login)
      const allowedDomains = [
        'gmail.com',
        'hotmail.com',
        'yahoo.com',
        'restaurant.com',
        'deliverysystem.com'
      ];
      const domain = newEmployeeData.email.split('@')[1]?.toLowerCase();
      if (!allowedDomains.includes(domain)) {
        toast.error('Use um e-mail pessoal válido (Gmail, Hotmail, Yahoo, etc).');
        return;
      }

      // Telefone (opcional) - se preenchido, validar 11 dígitos e começa com 9
      const cleanPhone = (newEmployeeData.phone || '').replace(/\D/g, '');
      if (cleanPhone) {
        if (cleanPhone.length !== 11) {
          toast.error('O telefone deve ter 11 dígitos (DDD + 9 números)');
          return;
        }
        if (cleanPhone[2] !== '9') {
          toast.error('O celular deve começar com o dígito 9. Ex: (85) 9...');
          return;
        }
      }

      // Senha: 6-8 caracteres e deve ter maiúscula e minúscula
      if (newEmployeeData.password.length < 6 || newEmployeeData.password.length > 8) {
        toast.error('A senha deve ter entre 6 e 8 caracteres');
        return;
      }

      const hasUpper = /[A-Z]/.test(newEmployeeData.password);
      const hasLower = /[a-z]/.test(newEmployeeData.password);
      if (!hasUpper || !hasLower) {
        toast.error('A senha deve conter letras maiúsculas e minúsculas');
        return;
      }

      setIsSubmitting(true);

      await funcionariosAPI.criar(newEmployeeData);
      toast.success('Funcionário adicionado com sucesso!');
      setIsAddDialogOpen(false);
      setNewEmployeeData({
        name: '',
        email: '',
        phone: '',
        password: '',
        restaurantId: '1',
      });
      carregarFuncionarios();
    } catch (error: any) {
      console.error('Erro ao adicionar funcionário:', error);

      const errMsg = (error?.message || error?.toString() || '').toLowerCase();

      if (errMsg.includes('401') || errMsg.includes('unauthorized')) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (
        errMsg.includes('já cadastrado') ||
        errMsg.includes('email already exists') ||
        errMsg.includes('already-in-use') ||
        errMsg.includes('duplicate') ||
        errMsg.includes('409')
      ) {
        toast.error('Este e-mail já possui cadastro. Utilize outro e-mail.');
      } else if (errMsg.includes('403')) {
        toast.error('Você não tem permissão para adicionar funcionários.');
      } else {
        toast.error('Erro ao adicionar funcionário. Verifique os dados.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Funcionários</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <Label>Nome *</Label>
                <Input 
                  placeholder="João Silva" 
                  value={newEmployeeData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={newEmployeeData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input 
                  placeholder="(85) 98765-4321" 
                  value={newEmployeeData.phone}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, phone: formatPhone(e.target.value) })}
                  maxLength={15}
                />
              </div>
              <div>
                <Label>Senha *</Label>
                <Input 
                  type="password" 
                  placeholder="********" 
                  value={newEmployeeData.password}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, password: e.target.value })}
                  maxLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  6-8 caracteres (maiúscula + minúscula)
                </p>
              </div>
              <div>
                <Label>ID do Restaurante *</Label>
                <Input 
                  placeholder="1" 
                  value={newEmployeeData.restaurantId}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, restaurantId: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={addEmployee} disabled={isSubmitting}>
                {isSubmitting ? 'Adicionando...' : 'Adicionar Funcionário'}
              </Button>
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

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
          </p>
        </div>
      ) : (
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
                          <div>
                            <Label>ID do Restaurante</Label>
                            <Input
                              value={editFormData.restaurantId}
                              onChange={(e) => setEditFormData({ ...editFormData, restaurantId: e.target.value })}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteEmployee(employee.id, employee.name)}
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
