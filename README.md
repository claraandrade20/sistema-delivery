# Sistema de Delivery 🍕

Projeto full-stack de um sistema de delivery para fins acadêmicos e de prototipação. Inclui frontend React + Vite e backend Node.js + Express com autenticação JWT, CRUD de produtos e pedidos.

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
| joao@email.com | joao123 | Cliente |
| maria@email.com | maria456 | Cliente |
| carlos@restaurant.com | carlos789 | Funcionário |
| admin@deliverysystem.com | admin123 | Administrador |

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
# Sistema de Delivery

Projeto full-stack para fins acadêmicos: frontend em React + Vite e backend em Node.js + Express (TypeScript). Fornece funcionalidades básicas de um sistema de delivery (autenticação, CRUD de produtos e pedidos, roles de usuário).

---

## 🧭 Visão rápida
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Autenticação: JWT + bcrypt
- Persistência: arquivos JSON (desenvolvimento)

---

## 📁 Estrutura principal

- `backend/` — API, lógica do servidor e dados de desenvolvimento
- `frontend/` — aplicação web (Vite + React)
- `README.md` — este arquivo

---

## Requisitos

- Node.js 16+ (recomenda-se 18+)
- npm

---

## Como rodar (rápido)

Abra dois terminais (um para backend, outro para frontend).

Backend (PowerShell):
```powershell
cd backend
npm install
npm run migrate   # (se existir) inicializa dados/migrations
npm run dev       # inicia em modo desenvolvimento
```

Frontend (PowerShell):
```powershell
cd frontend
npm install
npm run dev
```

URLs padrão:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173` (Vite)

---

## Scripts úteis

- Backend:
  - `npm run dev` — inicia servidor em modo dev (watch)
  - `npm run migrate` — migra/inicializa dados (conforme `backend/scripts`)
  - `npm test` — executa testes (se existir)

- Frontend:
  - `npm run dev` — inicia Vite
  - `npm run build` — gera build de produção
  - `npm run preview` — serve build localmente

---

## Testes e dados de desenvolvimento

- Dados de exemplo ficam em `backend/src/data/` (`usuarios.json`, `produtos.json`, `pedidos.json`, `cupons.json`).
- Para rodar testes do backend (se houver):
```powershell
cd backend
npm test
```

---

## Variáveis de ambiente

- Backend (`backend/.env`):
```
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

- Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000/api
```

---

## Endpoints principais (base)

Base: `http://localhost:3000/api`

- `POST /api/auth/register` — registrar
- `POST /api/auth/login` — login (retorna JWT)
- `GET /api/produtos` — listar produtos
- `POST /api/pedidos` — criar pedido

Consulte as rotas em `backend/src/routes` para a lista completa.

---

## Boas práticas / próximos passos sugeridos

- Mudar para banco relacional (Postgres/MySQL) em produção
- Adicionar validação de entrada (Zod/Joi)
- Documentar API com OpenAPI/Swagger
- Escrever testes automatizados (Jest + Supertest)

---

## Contribuição

1. Fork
2. `git checkout -b feat/minha-feature`
3. Commit e push
4. Abra Pull Request

---


---

**Detalhamento Técnico (comandos & exemplos)**

- **Scripts do backend** (conforme `backend/package.json`):
  - `npm run dev` — inicia em modo desenvolvimento com `ts-node-dev` (watch / hot reload)
  - `npm run build` — compila TypeScript (`tsc`) para `dist/`
  - `npm start` — executa `node dist/server.js` (após build)
  - `npm run lint` — roda `eslint` sobre os arquivos TypeScript
  - `npm run migrate` — executa `ts-node src/scripts/initDatabase.ts` (cria tabelas MySQL e popula a partir dos JSONs em `src/data/`)
  - `npm run add-test-product` — executa `src/scripts/addTestProduct.ts` (insere produto exemplo no MySQL)
  - `npm run add-test-category` — executa `src/scripts/addTestCategory.ts` (insere categoria exemplo)

- **Scripts do frontend** (conforme `frontend/package.json`):
  - `npm run dev` — inicia Vite (desenvolvimento)
  - `npm run build` — gera build de produção

- **Variáveis de ambiente recomendadas**
  - Backend (`backend/.env`):
    ```
    PORT=3000
    JWT_SECRET=sua_chave_secreta_aqui
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=1234
    DB_NAME=sistema_delivery
    ```
    > Observação: `DB_*` são lidas em `src/config/database.ts` — ajuste conforme seu MySQL.

  - Frontend (`frontend/.env`):
    ```
    VITE_API_URL=http://localhost:3000/api
    ```

- **Como inicializar banco (migração + seed)**
  1. Certifique-se de que o MySQL está rodando e as variáveis `DB_*` estão corretas.
  2. No PowerShell (pasta `backend`):
     ```powershell
     cd backend
     npm install
     npm run migrate
     ```
     - O script `migrate` cria todas as tabelas e popula dados a partir dos JSONs em `backend/src/data`.
  3. (Opcional) Adicionar produto/categoria de demonstração:
     ```powershell
     npm run add-test-product
     npm run add-test-category
     ```

- **Exemplos de requisições (curl)**
  - Registrar usuário:
    ```bash
    curl -X POST http://localhost:3000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"Ana Silva","email":"ana@example.com","password":"senha123","phone":"85990000000","role":"client"}'
    ```

  - Login (recebe token JWT):
    ```bash
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@deliverysystem.com","password":"qualquer valor"}'
    ```

  - Criar pedido (exemplo mínimo):
    ```bash
    curl -X POST http://localhost:3000/api/pedidos \
      -H "Content-Type: application/json" \
      -d '{
        "customerId":"1",
        "customerName":"João Silva",
        "customerPhone":"85988888888",
        "restaurantId":1,
        "restaurantName":"Pizzaria Bella Napoli",
        "items":[{"productId":"1","productName":"Pizza Margherita","quantity":1,"subtotal":29.9}],
        "deliveryAddress":"Rua Exemplo, 123",
        "paymentMethod":"card",
        "subtotal":29.9,
        "deliveryFee":8.9,
        "discount":0,
        "total":38.8
      }'
    ```

  - Atualizar status do pedido (API exige status válidos):
    ```bash
    curl -X PATCH http://localhost:3000/api/pedidos/1/status \
      -H "Content-Type: application/json" \
      -d '{"status":"preparing"}'
    ```

- **Debug / logs**
  - O backend imprime requisições no console (`console.log('${req.method} ${req.path}')`).
  - O script de migração e os scripts de seed escrevem mensagens detalhadas no console para acompanhamento.

- **Executando lint e testes**
  - Lint (backend):
    ```powershell
    cd backend
    npm run lint
    ```
  - Testes (se existirem):
    ```powershell
    cd backend
    npm test
    ```

---

Se quiser, eu posso:
- ajustar mais exemplos de payloads para endpoints específicos (produtos, categorias, clientes)
- criar um arquivo `backend/.env.example` e commitar
- commitar as mudanças no `README.md` e abrir um PR automaticamente


