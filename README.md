
  # Sistema de Delivery

  Projeto frontend de um sistema de delivery, gerado a partir de um design do Figma e reorganizado para atender a uma arquitetura mais próxima do que é cobrado em projetos acadêmicos (separação de camadas e responsabilidades).

  Link do design original: https://www.figma.com/design/oatGs6kVSQl45Sdo1r6Lcg/Food-Delivery-App-Design

  > Observação: neste repositório só está o **frontend**. O backend (Java + JDBC + MySQL) será implementado depois, consumindo os dados que hoje estão mockados.

  ---

  ## 1. Visão geral da arquitetura do frontend

  Estrutura principal após a refatoração:

  ```text
  sistema-delivery/
  ├─ frontend/
  │  ├─ index.html
  │  ├─ package.json
  │  ├─ tsconfig.json
  │  ├─ vite.config.ts
  │  └─ src/
  │     ├─ main.tsx
  │     ├─ index.css
  │     ├─ app/
  │     │  ├─ App.tsx
  │     │  ├─ layouts/
  │     │  │  ├─ ClientLayout.tsx
  │     │  │  ├─ EmployeeLayout.tsx
  │     │  │  └─ AdminLayout.tsx
  │     │  ├─ navigation/        (reservado p/ lógica de navegação futura)
   # Sistema de Delivery

   Projeto full-stack (frontend + backend) para um sistema de delivery. Este repositório contém:

   - `frontend/`: aplicação React + Vite (TypeScript)
   - `backend/`: API em Node.js + Express + TypeScript (persistência em arquivos JSON para desenvolvimento)

   O frontend foi inicialmente criado a partir de um design no Figma; o backend foi implementado posteriormente para integrar as telas com uma API REST.

   ---

   ## O que foi adicionado (resumo das novidades)

   - Backend em Node.js + Express com TypeScript
     - Autenticação JWT (login / register)
     - Hash de senhas com `bcryptjs`
     - Middlewares de autenticação
     - Endpoints para Produtos e Pedidos (CRUD)
     - Persistência simples em `backend/src/data/*.json` para desenvolvimento
   - Integração frontend ↔ backend
     - `frontend/src/shared/services/api.ts` implementado para consumir a API
     - `AuthContext` atualizado para usar a API real e persistir token no `localStorage`
   - Documentação e scripts para rodar localmente

   ---

   ## Estrutura do repositório

   ```text
   sistema-delivery/
   ├─ backend/
   │  ├─ src/
   │  │  ├─ controller/
   │  │  ├─ service/
   │  │  ├─ routes/
   │  │  ├─ middleware/
   │  │  ├─ data/            # arquivos JSON usados como DB de desenvolvimento
   │  │  └─ server.ts
   │  ├─ package.json
   │  └─ tsconfig.json
   ├─ frontend/
   │  ├─ src/
   │  │  ├─ features/
   │  │  ├─ shared/
   │  │  │  ├─ services/api.ts
   │  │  │  └─ context/AuthContext.tsx
   │  └─ package.json
   └─ DOCS.md
   ```

   ---

   ## Como rodar localmente

   Siga os passos abaixo em dois terminais separados (um para backend e outro para frontend).

   ### Backend

   1. Entre na pasta do backend:

   ```powershell
   cd backend
   ```

   2. Instale dependências (se ainda não fez):

   ```powershell
   npm install
   ```

   3. Crie um arquivo `.env` baseado no `.env.example` (opcional):

   ```powershell
   copy .env.example .env
   # editar .env se quiser alterar JWT_SECRET ou PORT
   ```

   4. Inicie o servidor em modo desenvolvimento (hot reload):

   ```powershell
   npm run dev
   ```

   O servidor irá escutar por padrão em `http://localhost:3000` e expor a API em `/api/*`.

   ---

   ### Frontend

   1. Abra outro terminal e entre na pasta do frontend:

   ```powershell
   cd frontend
   ```

   2. Instale dependências (se ainda não fez):

   ```powershell
   npm install
   ```

   3. Ajuste a variável de ambiente se necessário (arquivo `.env` no frontend):

   ```text
   VITE_API_URL=http://localhost:3000/api
   ```

   4. Inicie o frontend:

   ```powershell
   npm run dev
   ```

   O frontend normalmente abre em `http://localhost:5173`.

   ---

   ## Usuários de teste

   Para facilitar testes locais, há usuários de teste já cadastrados em `backend/src/data/usuarios.json`.

   - Cliente (João)
     - Email: `joao@email.com`
     - Senha: `123456`

   - Cliente (Maria)
     - Email: `maria@email.com`
     - Senha: `123456`

   - Funcionário (Carlos)
     - Email: `carlos@restaurant.com`
     - Senha: `123456`

   - Administrador
     - Email: `admin@deliverysystem.com`
     - Senha: `123456`

   Observação: as senhas estão armazenadas como hash (`bcrypt`) no arquivo de desenvolvimento.

   ---

   ## Endpoints principais da API

   Base: `http://localhost:3000/api`

   - Autenticação
     - `POST /api/auth/register` — Registrar usuário
     - `POST /api/auth/login` — Login (retorna `{ token, user }`)
     - `GET /api/auth/me` — Dados do usuário logado (requer `Authorization: Bearer <token>`)
     - `GET /api/auth/users` — Listar usuários

   - Produtos
     - `GET /api/produtos` — Listar produtos (opcionais query: `restaurantId`, `categoryId`)
     - `GET /api/produtos/:id` — Obter produto por id
     - `POST /api/produtos` — Criar produto
     - `PUT /api/produtos/:id` — Atualizar produto
     - `DELETE /api/produtos/:id` — Deletar produto

   - Pedidos
     - `GET /api/pedidos` — Listar pedidos (opcionais query: `customerId`, `restaurantId`)
     - `GET /api/pedidos/:id` — Obter pedido por id
     - `POST /api/pedidos` — Criar pedido
     - `PATCH /api/pedidos/:id/status` — Atualizar status do pedido
     - `PUT /api/pedidos/:id` — Atualizar pedido completo

   ---

   ## Notas importantes

   - Persistência: em desenvolvimento os dados ficam em `backend/src/data/*.json`. Em produção recomenda-se migrar para um banco (MySQL, Postgres etc.).
   - Segurança: altere `JWT_SECRET` em `.env` antes de qualquer uso em produção.
   - CORS: o backend permite requisições vindas do frontend (`localhost:5173`) por padrão.

   ---

   ## Ajuda e próximos passos

   Se quiser, eu posso:

   - Gerar migrations/estrutura SQL para migrar os JSONs para um banco relacional
   - Adicionar validação de payload com `zod` ou `joi`
   - Proteger endpoints administrativos com roles
   - Criar testes automatizados para as rotas

   Diga qual próximo passo prefere e eu continuo.

  ---

  ## Documentação Completa (Frontend + Backend)

  **Objetivo do projeto**

  Este repositório implementa um sistema de delivery completo para fins acadêmicos e de prototipação. Ele contém:

  - `frontend/`: aplicação React + Vite (TypeScript) — interface do usuário (clientes, funcionários, administradores).
  - `backend/`: API em Node.js + Express + TypeScript — autenticação, gerenciamento de produtos e pedidos; persistência simples em arquivos JSON durante o desenvolvimento.

  O objetivo é ter um fluxo de ponta a ponta que possa ser trocado por uma camada persistente real (MySQL) posteriormente.

  **Visão geral das responsabilidades**

  - Frontend: UI, gerenciamento de estado (autenticação, carrinho), integração com API REST.
  - Backend: autenticação JWT, validação básica, regras de negócio, endpoints REST, persistência simples em `backend/src/data/*.json`.

  ---

  **Principais funcionalidades implementadas**

  - Registo e login de usuários com senha hasheada (`bcryptjs`) e geração de token JWT.
  - Perfis: cliente, funcionário, administrador.
  - CRUD de produtos (criar, listar, atualizar, remover).
  - Criação e gestão de pedidos (status do pedido: Pendente → Em preparo → Em trânsito → Entregue → Cancelado).
  - Middleware de autenticação e autorização por roles.
  - Integração do frontend com `frontend/src/shared/services/api.ts`.

  ---

  **Regras de negócio (resumo)**

  1. Perfis e permissões
     - `cliente`: pode ver produtos, criar pedidos, ver seus próprios pedidos, acompanhar status e gerenciar o carrinho.
     - `funcionario`: pode ver pedidos do restaurante associado, alterar status (por exemplo, de Pendente para Em preparo), e gerenciar produtos relacionados ao restaurante.
     - `admin`: pode listar/gerenciar todos usuários, produtos e pedidos.

  2. Ciclo de vida do pedido
     - Estados previsíveis: `PENDENTE`, `EM_PREPARO`, `EM_TRANSPORTE`, `ENTREGUE`, `CANCELADO`.
     - Apenas `funcionario` ou `admin` podem mover pedidos entre certos estados (ex.: marcar como `EM_PREPARO` ou `EM_TRANSPORTE`).
     - Clientes podem cancelar pedidos apenas quando o pedido estiver em `PENDENTE`.

  3. Estoque e disponibilidade
     - Cada produto tem um `stock` (estoque) opcional. Ao criar um pedido, validar disponibilidade e decrementar o estoque localmente.
     - Produtos com `available: false` não aparecem na listagem pública.

  4. Preço e descontos
     - O preço final do item do pedido é calculado a partir do `price` do produto no momento do pedido (para evitar inconsistências em alterações futuras).
     - Cupom/Desconto não implementado por padrão — pode ser adicionado como uma camada na criação do pedido.

  5. Regras de consistência
     - Todas as alterações de escrita (criar/atualizar/deletar) atualizam os arquivos JSON em `backend/src/data/` via utilitários (`lerJSON`, `salvarJSON`).
     - Em ambiente real essas operações devem ser transacionais em BD relacional.

  ---

  ## Modelo de dados (simplificado)

  - `User`
    - `id`: string
    - `name`: string
    - `email`: string
    - `passwordHash`: string
    - `role`: `cliente` | `funcionario` | `admin`
    - `restaurantId?`: string (para funcionários)

  - `Product`
    - `id`: string
    - `name`: string
    - `description`: string
    - `price`: number
    - `categoryId?`: string
    - `restaurantId`: string
    - `stock?`: number
    - `available`: boolean

  - `Order` (Pedido)
    - `id`: string
    - `customerId`: string
    - `restaurantId`: string
    - `items`: Array<{ productId, name, price, quantity }>
    - `total`: number
    - `status`: enum (`PENDENTE`, `EM_PREPARO`, `EM_TRANSPORTE`, `ENTREGUE`, `CANCELADO`)
    - `createdAt`, `updatedAt`

  ---

  ## Endpoints principais da API (resumo)

  Base: `http://localhost:3000/api`

  - Autenticação
    - `POST /api/auth/register` — registrar usuário: `{ name, email, password }` → retorna usuário (sem senha) e token JWT.
    - `POST /api/auth/login` — `{ email, password }` → retorna `{ token, user }`.
    - `GET /api/auth/me` — retorna dados do usuário autenticado (bearer token requerido).
    - `GET /api/auth/users` — listar usuários (requer role `admin`).

  - Produtos
    - `GET /api/produtos` — listar produtos (suporta filtros `restaurantId`, `categoryId`).
    - `GET /api/produtos/:id` — obter produto por id.
    - `POST /api/produtos` — criar produto (requer auth e role adequada).
    - `PUT /api/produtos/:id` — atualizar produto.
    - `DELETE /api/produtos/:id` — remover produto.

  - Pedidos
    - `GET /api/pedidos` — listar pedidos (filtros: `customerId`, `restaurantId`).
    - `GET /api/pedidos/:id` — obter pedido.
    - `POST /api/pedidos` — criar pedido `{ customerId, restaurantId, items: [{ productId, quantity }] }`.
    - `PATCH /api/pedidos/:id/status` — atualizar status do pedido `{ status }`.
    - `PUT /api/pedidos/:id` — atualizar pedido completo (uso restrito).

  Para payloads e respostas completas, confira os controladores em `backend/src/controller/`.

  ---

  ## Variáveis de ambiente

  - Backend (`backend/.env`)
    - `PORT` (opcional, default 3000)
    - `JWT_SECRET` (muito importante: altere em produção)

  - Frontend (`frontend/.env`)
    - `VITE_API_URL` — URL base da API, ex.: `http://localhost:3000/api`

  ---

  ## Como rodar localmente (PowerShell)

  Abra dois terminais: um para o backend e outro para o frontend.

  Backend:

  ```powershell
  cd "c:\Users\maria\OneDrive\Área de Trabalho\Semestre 4\Ambiente de dados\sistema-delivery\backend"
  npm install
  copy .env.example .env
  # (opcional) editar .env para ajustar JWT_SECRET ou PORT
  npm run dev
  ```

  Frontend:

  ```powershell
  cd "c:\Users\maria\OneDrive\Área de Trabalho\Semestre 4\Ambiente de dados\sistema-delivery\frontend"
  npm install
  # ajustar VITE_API_URL no .env se necessário
  npm run dev
  ```

  O backend geralmente escuta em `http://localhost:3000` e o frontend em `http://localhost:5173`.

  ---

  ## Usuários de teste (seed)

  Os usuários de teste estão em `backend/src/data/usuarios.json` e têm senhas `123456` (armazenadas como hash bcrypt). Exemplos:

  - Cliente: `joao@email.com` / `123456`
  - Funcionário: `carlos@restaurant.com` / `123456`
  - Admin: `admin@deliverysystem.com` / `123456`

  ---

  ## Notas de desenvolvimento

  - O backend utiliza leitura/escrita simples em JSON para facilitar testes. Em produção, mover para um banco relacional é necessário.
  - As senhas devem ser sempre armazenadas como hash. Use `bcryptjs` para criação/validação.
  - Proteja `JWT_SECRET` e configure CORS apenas para origens confiáveis.
  - Adicionar `zod`/`joi` para validação de payloads melhora a segurança.

  ---

  ## Possíveis próximos passos (sugestões)

  1. Migrar para MySQL: gerar scripts/DDL e implementar DAOs com transações.
  2. Adicionar testes automatizados (Jest + Supertest) para endpoints críticos.
  3. Adicionar integração contínua (GitHub Actions) para rodar lint/testes.
  4. Implementar mecanismos de filas/notifications para atualização de status (ex.: WebSocket para notificar frontend quando pedido muda de status).
  5. Implementar pagamentos simulados (ex.: integração com Stripe sandbox) e processo de confirmação.

  ---

  ## Contribuição

  Se quiser contribuir:

  1. Faça um fork e crie uma branch com `feat/<descrição>`.
  2. Garanta que `npm run lint` e `npm run test` (se houver) rodem sem erros.
  3. Abra um PR descrevendo a mudança e o motivo.

  ---

  Se quiser, eu posso:

  - Gerar endpoints documentados no formato OpenAPI/Swagger.
  - Gerar scripts de migração SQL para MySQL com base no modelo de dados.
  - Criar testes básicos (Jest + Supertest) para as rotas principais.

  Diga qual desses itens você prefere que eu implemente agora.
  ### 3.1. Instalar dependências

