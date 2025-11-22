import React, { useState } from 'react';
import { Button } from '/ui/button';
import { Input } from '/ui/input';
import { Label } from '/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '/ui/tabs';
import { useAuth } from '/context/AuthContext';
import { toast } from 'sonner@2.0.3';
import { UtensilsCrossed, Mail, Lock, User, Phone } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

export const Login = ({ onSuccess }: LoginProps) => {
  const { login, register, logout } = useAuth();
  
  // Controle da Aba Ativa
  const [activeTab, setActiveTab] = useState('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // === MÁSCARA DE TELEFONE ===
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    const truncated = numbers.slice(0, 11);
    
    if (truncated.length <= 2) return truncated;
    if (truncated.length <= 7) return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    const success = await login(loginEmail, loginPassword);
    
    setIsLoading(false);
    
    if (success) {
      toast.success('Login realizado com sucesso!');
      onSuccess();
    } else {
      toast.error('Email ou senha incorretos');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // === 1. Validar Vazios ===
    if (!registerName || !registerEmail || !registerPhone || !registerPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    // === 2. Validar Nome ===
    if (/\d/.test(registerName)) {
      toast.error('O nome não pode conter números');
      return;
    }
    if (registerName.trim().split(' ').length < 2) {
      toast.error('Digite seu nome completo (Nome e Sobrenome)');
      return;
    }
    
    // === 3. Validar Email e Domínio ===
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      toast.error('Digite um e-mail válido');
      return;
    }

    // Lista de domínios permitidos
    const allowedDomains = [
      'gmail.com', 
      'hotmail.com', 'hotmail.com.br',
      'outlook.com', 'outlook.com.br',
      'yahoo.com', 'yahoo.com.br',
      'live.com',
      'icloud.com',
      'uol.com.br',
      'bol.com.br',
      'terra.com.br'
    ];

    const emailDomain = registerEmail.split('@')[1]?.toLowerCase();

    if (!allowedDomains.includes(emailDomain)) {
      toast.error('Use um e-mail pessoal válido (Gmail, Hotmail, Outlook, Yahoo, etc).');
      return;
    }

    // === 4. Validar Telefone ===
    const cleanPhone = registerPhone.replace(/\D/g, '');
    
    if (cleanPhone.length !== 11) {
      toast.error('O telefone deve ter 11 dígitos (DDD + 9 números)');
      return;
    }
    
    if (cleanPhone[2] !== '9') {
      toast.error('O celular deve começar com o dígito 9. Ex: (85) 9...');
      return;
    }
    
    // === 5. Validar Senhas ===
    if (registerPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (registerPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      // Tenta registrar
      const result = await register(registerName, registerEmail, registerPhone, registerPassword);
      
      // Fallback de segurança se o AuthContext não lançar erro
      if (result === false) throw new Error('Falha no registro');

      // === SUCESSO ===
      if (logout) await logout(); // Garante que não loga automático
      
      toast.success('Conta criada! Faça login para continuar.');
      
      setLoginEmail(registerEmail); // Preenche login
      setRegisterPassword('');
      setConfirmPassword('');
      setActiveTab('login'); // Muda aba
      
    } catch (error: any) {
      // === TRATAMENTO DE ERRO ===
      console.error("Erro capturado no registro:", error);
      const errorMessage = (error?.message || error?.toString() || '').toLowerCase();

      if (
        errorMessage.includes('já cadastrado') || 
        errorMessage.includes('email already exists') || 
        errorMessage.includes('already-in-use') ||
        errorMessage.includes('duplicate') ||
        errorMessage.includes('409')
      ) {
        toast.error('Este e-mail já possui cadastro. Faça login.');
        setLoginEmail(registerEmail);
        setActiveTab('login');
      } 
      else {
        toast.error('Erro ao criar conta. Verifique os dados.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error('Digite seu email');
      return;
    }
    toast.success('Instruções enviadas para seu email!');
    setShowRecovery(false);
    setRecoveryEmail('');
  };

  if (showRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>
              Digite seu email para receber instruções de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecovery} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  Enviar Instruções
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowRecovery(false)}
                >
                  Voltar ao Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Sistema de Delivery</CardTitle>
          <CardDescription>Faça login ou crie sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowRecovery(true)}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Esqueci minha senha
                </button>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">Contas de teste:</p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p>Cliente: joao@email.com</p>
                    <p>Funcionário: carlos@restaurant.com</p>
                    <p>Admin: admin@deliverysystem.com</p>
                    <p className="mt-2 italic">Senha: qualquer valor</p>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="João Silva"
                      className="pl-10"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@gmail.com"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="(85) 98765-4321"
                      className="pl-10"
                      value={registerPhone}
                      // MÁSCARA AUTOMÁTICA
                      onChange={(e) => setRegisterPhone(formatPhone(e.target.value))}
                      maxLength={15}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};