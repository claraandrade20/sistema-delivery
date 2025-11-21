# 🔐 Credenciais de Teste

## Contas de Teste Disponíveis

### 👤 Cliente - João Silva
- **Email**: `joao@email.com`
- **Senha**: `joao123`
- **Role**: client

### 👤 Cliente - Maria Santos
- **Email**: `maria@email.com`
- **Senha**: `maria456`
- **Role**: client

### 👨‍💼 Funcionário - Carlos Souza
- **Email**: `carlos@restaurant.com`
- **Senha**: `carlos789`
- **Role**: employee
- **Restaurante**: rest-1

### 🔒 Administrador - Roberto Admin
- **Email**: `admin@deliverysystem.com`
- **Senha**: `admin123`
- **Role**: admin

---

## 📋 Informações Importantes

- Cada usuário tem uma **senha única e diferente**
- As senhas são armazenadas com hash **bcrypt** no banco de dados
- Você pode usar essas credenciais para testar o sistema localmente
- Em produção, altere obrigatoriamente as senhas!

## 🧪 Como Usar

### 1️⃣ Testar Conexão com Banco de Dados

Na pasta `backend/`, execute:
```powershell
node test-simple.js
```

Se retornar `Conexão bem-sucedida!`, o banco está funcionando.

### 2️⃣ Iniciar o Backend

Na pasta `backend/`:
```powershell
npm run dev
```

O servidor estará em `http://localhost:3000`

### 3️⃣ Iniciar o Frontend

Na pasta `frontend/`:
```powershell
npm run dev
```

O aplicativo estará em `http://localhost:5173`

### 4️⃣ Fazer Login

Acesse `http://localhost:5173` e faça login com uma das credenciais acima

### 5️⃣ Explorar o Sistema

Use o sistema de acordo com seu papel:
- **Cliente**: Visualizar produtos, adicionar ao carrinho, fazer pedidos
- **Funcionário**: Gerenciar produtos, estoque, pedidos do restaurante
- **Admin**: Gerenciar usuários, restaurantes, sistema geral

---

**Última atualização**: 18 de novembro de 2025
