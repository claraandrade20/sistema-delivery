# Sistema de Delivery - Documentação Técnica

## 📋 Visão Geral

Sistema completo de delivery com backend em Node.js + Express + TypeScript e frontend em React + TypeScript.

## 🚀 Como Executar

### Backend

1. Entre na pasta do backend:
```powershell
cd backend
```

2. Instale as dependências (se ainda não instalou):
```powershell
npm install
```

3. Execute o servidor em modo desenvolvimento:
```powershell
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Frontend

1. Abra um novo terminal e entre na pasta do frontend:
```powershell
cd frontend
```

2. Instale as dependências (se ainda não instalou):
```powershell
npm install
```

3. Execute o frontend:
```powershell
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🔑 Usuários de Teste

### Cliente
- Email: `joao@email.com`
- Senha: `123456`

### Funcionário
- Email: `carlos@restaurant.com`
- Senha: `123456`

### Administrador
- Email: `admin@deliverysystem.com`
- Senha: `123456`

## 📡 API Endpoints

### Autenticação (`/api/auth`)

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário logado (requer token)
- `GET /api/auth/users` - Listar todos os usuários

### Produtos (`/api/produtos`)

- `GET /api/produtos` - Listar todos os produtos
  - Query params: `?restaurantId=xxx` ou `?categoryId=xxx`
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Pedidos (`/api/pedidos`)

- `GET /api/pedidos` - Listar todos os pedidos
  - Query params: `?customerId=xxx` ou `?restaurantId=xxx`
- `GET /api/pedidos/:id` - Buscar pedido por ID
- `POST /api/pedidos` - Criar novo pedido
- `PATCH /api/pedidos/:id/status` - Atualizar status do pedido
- `PUT /api/pedidos/:id` - Atualizar pedido completo

## 🗂️ Estrutura do Projeto

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controller/          # Controllers das rotas
│   │   ├── autenticacaoController.ts
│   │   ├── pedidosController.ts
│   │   └── produtosController.ts
│   ├── service/             # Lógica de negócio
│   │   ├── autenticacaoService.ts
│   │   ├── pedidosService.ts
│   │   └── produtos.ts
│   ├── routes/              # Definição de rotas
│   │   ├── autenticacao.ts
│   │   ├── pedidos.ts
│   │   └── produtos.ts
│   ├── middleware/          # Middlewares
│   │   └── middlewareAutenticacao.ts
│   ├── data/                # Banco de dados JSON
│   │   ├── usuarios.json
│   │   ├── produtos.json
│   │   └── pedidos.json
│   ├── utils/               # Utilitários
│   │   └── fileUtils.ts
│   └── server.ts            # Ponto de entrada
├── package.json
└── tsconfig.json
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── app/                 # Componentes principais da aplicação
│   ├── features/            # Features por módulo
│   │   ├── admin/           # Páginas do admin
│   │   ├── auth/            # Autenticação
│   │   ├── client/          # Páginas do cliente
│   │   └── employee/        # Páginas do funcionário
│   ├── shared/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── context/         # Contextos React
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── services/        # Serviços de API
│   │   │   └── api.ts
│   │   ├── data/            # Dados mock
│   │   └── types/           # Tipos TypeScript
│   └── main.tsx             # Ponto de entrada
├── package.json
└── vite.config.ts
```

## 🔧 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas
- **CORS** - Controle de acesso entre origens

### Frontend
- **React** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. O usuário faz login com email e senha
2. O backend valida as credenciais e retorna um token JWT
3. O token é armazenado no localStorage do navegador
4. Todas as requisições autenticadas incluem o header: `Authorization: Bearer <token>`

## 💾 Armazenamento de Dados

Os dados são persistidos em arquivos JSON na pasta `/backend/src/data/`:
- `usuarios.json` - Usuários do sistema
- `produtos.json` - Catálogo de produtos
- `pedidos.json` - Histórico de pedidos

## 🛠️ Scripts Disponíveis

### Backend
- `npm run dev` - Inicia servidor em modo desenvolvimento com hot-reload
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor em modo produção

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção

## ⚠️ Notas Importantes

1. **Senhas**: Todas as senhas dos usuários de teste são hasheadas com bcrypt (senha: `123456`)
2. **CORS**: O backend está configurado para aceitar requisições do frontend em `localhost:5173`
3. **JWT Secret**: Em produção, altere a variável `JWT_SECRET` no arquivo `.env`
4. **Dados Mock**: Os dados iniciais são apenas para demonstração

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se a porta 3000 está livre
- Execute `npm install` novamente
- Verifique se o Node.js está instalado (`node --version`)

### Frontend não conecta ao backend
- Verifique se o backend está rodando em `http://localhost:3000`
- Verifique o arquivo `.env` no frontend
- Abra o console do navegador para ver erros

### Erro de CORS
- Certifique-se de que o frontend está rodando em `localhost:5173`
- Verifique as configurações de CORS no `server.ts`

## 📞 Suporte

Para problemas ou dúvidas, verifique:
1. Console do navegador (F12)
2. Terminal do backend para logs
3. Arquivo `README.md` para instruções detalhadas
