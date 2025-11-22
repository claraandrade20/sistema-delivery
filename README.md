# Sistema de Delivery 🍕

Projeto full-stack de um sistema de delivery para fins acadêmicos e de prototipação. Inclui frontend React + Vite e backend Node.js + Express com autenticação JWT, CRUD de produtos e pedidos.

**Design original**: https://www.figma.com/design/oatGs6kVSQl45Sdo1r6Lcg/Food-Delivery-App-Design

---

## 📋 Sobre o Projeto

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Autenticação**: JWT + bcryptjs (hash de senhas)
- **Persistência**: JSON (desenvolvimento) → SQL (produção)
- **Perfis**: Cliente, Funcionário, Administrador

---

## 🏗️ Estrutura do Repositório

```text
sistema-delivery/
├─ backend/
│  ├─ src/
│  │  ├─ controller/              # Controladores das rotas
│  │  ├─ service/                 # Lógica de negócio
│  │  ├─ routes/                  # Definição de rotas
│  │  ├─ middleware/              # Middlewares (autenticação, etc)
│  │  ├─ data/                    # Arquivos JSON (usuários, produtos, pedidos)
│  │  ├─ config/                  # Configurações
│  │  ├─ server.ts                # Entrada principal
│  │  └─ scripts/
│  ├─ test/
│  ├─ package.json
│  └─ tsconfig.json
│
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ App.tsx               # Componente raiz
│  │  │  └─ layouts/              # Layouts por perfil (Admin, Client, Employee)
│  │  ├─ features/
│  │  │  ├─ admin/
│  │  │  ├─ auth/
│  │  │  ├─ client/
│  │  │  └─ employee/
│  │  ├─ shared/
│  │  │  ├─ services/
│  │  │  │  └─ api.ts             # Cliente HTTP para API
│  │  │  ├─ context/
│  │  │  │  ├─ AuthContext.tsx    # Contexto de autenticação
│  │  │  │  └─ CartContext.tsx    # Contexto do carrinho
│  │  │  ├─ components/
│  │  │  ├─ ui/                   # Componentes UI
│  │  │  └─ types/
│  │  ├─ main.tsx
│  │  └─ index.css
│  ├─ build/                      # Saída da build
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ tsconfig.json
│
└─ README.md
```

---

## 🚀 Como Rodar Localmente

Você precisará de **Node.js 16+** e dois terminais (um para backend e outro para frontend).

### Backend

1. Navegue até a pasta do backend:

```powershell
cd backend
```

2. Instale as dependências:

```powershell
npm install
```

3. Crie um arquivo `.env` (opcional):

```powershell
copy .env.example .env
```

4. Inicie o servidor em modo desenvolvimento (hot reload):

```powershell
npm run dev
```

O backend estará disponível em `http://localhost:3000`.

### Frontend

1. Em outro terminal, navegue até a pasta do frontend:

```powershell
cd frontend
```

2. Instale as dependências:

```powershell
npm install
```

3. Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## 👥 Usuários de Teste

Usuários cadastrados em `backend/src/data/usuarios.json` (senha: `123456`):

| Email | Senha | Perfil |
|-------|-------|--------|
| joao@email.com | 123456 | Cliente |
| maria@email.com | 123456 | Cliente |
| carlos@restaurant.com | 123456 | Funcionário |
| admin@deliverysystem.com | 123456 | Administrador |

> As senhas estão armazenadas como hash bcrypt.

---

## 📡 Endpoints da API

Base: `http://localhost:3000/api`

### Autenticação

- `POST /api/auth/register` — Registrar usuário
- `POST /api/auth/login` — Fazer login (retorna token JWT)
- `GET /api/auth/me` — Dados do usuário autenticado (requer Bearer token)
- `GET /api/auth/users` — Listar usuários (requer role admin)

### Produtos

- `GET /api/produtos` — Listar produtos (filtros: `restaurantId`, `categoryId`)
- `GET /api/produtos/:id` — Obter produto por ID
- `POST /api/produtos` — Criar produto
- `PUT /api/produtos/:id` — Atualizar produto
- `DELETE /api/produtos/:id` — Deletar produto

### Pedidos

- `GET /api/pedidos` — Listar pedidos (filtros: `customerId`, `restaurantId`)
- `GET /api/pedidos/:id` — Obter pedido por ID
- `POST /api/pedidos` — Criar pedido
- `PATCH /api/pedidos/:id/status` — Atualizar status do pedido
- `PUT /api/pedidos/:id` — Atualizar pedido

---

## 📊 Modelo de Dados

### User
```typescript
{
  id: string
  name: string
  email: string
  passwordHash: string
  role: "cliente" | "funcionario" | "admin"
  restaurantId?: string
}
```

### Product
```typescript
{
  id: string
  name: string
  description: string
  price: number
  categoryId?: string
  restaurantId: string
  stock?: number
  available: boolean
}
```

### Order
```typescript
{
  id: string
  customerId: string
  restaurantId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: "PENDENTE" | "EM_PREPARO" | "EM_TRANSPORTE" | "ENTREGUE" | "CANCELADO"
  createdAt: string
  updatedAt: string
}
```

---

## 🔐 Variáveis de Ambiente

### Backend (`.env`)
```
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3000/api
```

---

## 📝 Funcionalidades Implementadas

- ✅ Autenticação com JWT
- ✅ Hash de senhas com bcryptjs
- ✅ CRUD de produtos
- ✅ CRUD de pedidos
- ✅ Sistema de roles e permissões
- ✅ Middlewares de autenticação
- ✅ Integração frontend ↔ backend
- ✅ Persistência em JSON (desenvolvimento)
- ✅ Interface responsiva com Vite + React

---

## 🎯 Próximos Passos (Sugestões)

- [ ] Migrar para banco de dados SQL (MySQL/PostgreSQL)
- [ ] Adicionar validação de payloads com Zod/Joi
- [ ] Gerar documentação OpenAPI/Swagger
- [ ] Implementar testes automatizados (Jest + Supertest)
- [ ] Adicionar CI/CD com GitHub Actions
- [ ] Implementar WebSocket para atualizações em tempo real
- [ ] Integração com sistema de pagamentos

---

## 🛠️ Desenvolvimento

Instale dependências:
```powershell
cd backend; npm install
cd ../frontend; npm install
```

Rode os testes do backend (se existirem):
```powershell
cd backend
npm test
```

Rode o linter:
```powershell
npm run lint
```

---

## 📚 Notas Importantes

- Em desenvolvimento, os dados ficam em `backend/src/data/*.json`
- Em produção, migre para um banco relacional (MySQL, PostgreSQL, etc)
- Altere `JWT_SECRET` antes de usar em produção
- O backend permite requisições do frontend por CORS
- As senhas são sempre armazenadas como hash, nunca em texto plano

---

## 👨‍💻 Contribuição

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit suas mudanças: `git commit -am 'Add minha feature'`
4. Push para a branch: `git push origin feat/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de uso acadêmico.

