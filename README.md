
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
  │     │  └─ providers/         (reservado p/ providers globais futuros)
  │     ├─ features/
  │     │  ├─ auth/
  │     │  │  └─ Login.tsx
  │     │  ├─ client/
  │     │  │  ├─ ClientHome.tsx
  │     │  │  ├─ ProductsList.tsx
  │     │  │  ├─ ProductDetail.tsx
  │     │  │  ├─ Cart.tsx
  │     │  │  ├─ Checkout.tsx
  │     │  │  ├─ MyOrders.tsx
  │     │  │  ├─ ClientProfile.tsx
  │     │  │  └─ OrderTracking.tsx
  │     │  ├─ employee/
  │     │  │  ├─ EmployeeDashboard.tsx
  │     │  │  ├─ OrdersManagement.tsx
  │     │  │  ├─ ProductsManagement.tsx
  │     │  │  ├─ StockManagement.tsx
  │     │  │  ├─ CategoriesManagement.tsx
  │     │  │  └─ BusinessHoursManagement.tsx
  │     │  └─ admin/
  │     │     ├─ AdminDashboard.tsx
  │     │     ├─ RestaurantsManagement.tsx
  │     │     └─ CustomersManagement.tsx
  │     └─ shared/
  │        ├─ components/
  │        │  ├─ figma/
  │        │  │  └─ ImageWithFallback.tsx
  │        │  └─ legacy/   (telas antigas geradas pelo Figma, mantidas como referência)
  │        ├─ context/
  │        │  ├─ AuthContext.tsx
  │        │  └─ CartContext.tsx
  │        ├─ data/
  │        │  └─ mockData.ts
  │        ├─ styles/
  │        │  └─ globals.css
  │        ├─ types/
  │        │  └─ index.ts
  │        └─ ui/
  │           └─ ... componentes de UI (button, card, input, etc.)
  └─ .gitignore
  ```

  ### 1.1. Camada `app/`

  - `App.tsx`: é o "orquestrador" do frontend.
    - Lê o usuário logado via `AuthContext`.
    - Decide qual layout usar (`ClientLayout`, `EmployeeLayout`, `AdminLayout`) com base no papel do usuário (cliente, funcionário, admin).
    - Controla a "rota" atual com um `useState(currentPage)`, simulando um roteador.
  - `layouts/`: define o esqueleto visual das páginas (header, navegação, footer) para cada tipo de usuário.
    - Ex.: `ClientLayout` mostra logo, barra de busca, menu com Início/Cardápio/Pedidos/Carrinho/Perfil.
  - `navigation/`: pasta vazia por enquanto, pensada para centralizar regras de navegação (por exemplo, um mapa de rotas por perfil de usuário).
  - `providers/`: pasta vazia por enquanto, planejada para agrupar providers globais (por exemplo, um `AppProviders.tsx` que englobe `AuthProvider`, `CartProvider`, etc.).

  ### 1.2. Camada `features/`

  Organiza as telas por **área funcional**, o que facilita explicar o código por contexto de negócio:

  - `features/auth`:
    - `Login.tsx`: tela de login; usa `useAuth()` para autenticar e definir o usuário logado.

  - `features/client` (fluxo do cliente final):
    - `ClientHome.tsx`: home com promoções, categorias e produtos em destaque.
    - `ProductsList.tsx`: listagem de produtos do cardápio, filtros por categoria, etc.
    - `ProductDetail.tsx`: detalhe de um produto, seleção de variação, adicionais e quantidade.
    - `Cart.tsx`: resumo dos itens adicionados ao carrinho (integra com `CartContext`).
    - `Checkout.tsx`: finalização do pedido (método de pagamento, endereço, observações).
    - `MyOrders.tsx`: histórico de pedidos do cliente.
    - `OrderTracking.tsx`: acompanhamento do status de um pedido específico.
    - `ClientProfile.tsx`: dados do perfil do cliente, endereços, etc.

  - `features/employee` (fluxo do funcionário):
    - `EmployeeDashboard.tsx`: visão geral de pedidos, métricas, etc.
    - `OrdersManagement.tsx`: gerenciamento dos pedidos em andamento.
    - `ProductsManagement.tsx`: gerenciamento de produtos do cardápio.
    - `StockManagement.tsx`: controle de estoque.
    - `CategoriesManagement.tsx`: categorias de produtos.
    - `BusinessHoursManagement.tsx`: horários de funcionamento do restaurante.

  - `features/admin` (fluxo do administrador):
    - `AdminDashboard.tsx`: visão geral do sistema (usuários, restaurantes, estatísticas).
    - `RestaurantsManagement.tsx`: gerenciamento de restaurantes.
    - `CustomersManagement.tsx`: gerenciamento de clientes.

  ### 1.3. Camada `shared/`

  Tudo o que é **compartilhado** entre features ou layouts fica em `shared/`.

  - `shared/components/figma`:
    - `ImageWithFallback.tsx`: componente reutilizável para imagens do Figma (com fallback).

  - `shared/components/legacy`:
    - Telas e componentes originais gerados pelo Figma (por exemplo, `AuthScreen`, `BottomNav`, etc.).
    - Não são usados na versão atual, mas foram preservados como referência visual/histórica.

  - `shared/context`:
    - `AuthContext.tsx`:
      - Define o tipo `AuthContextType` (usuário atual, `login`, `logout`, `register`, flag `isAuthenticated`).
      - Usa dados mockados (`mockUsers`) para simular autenticação.
      - Exposta via `AuthProvider` e hook `useAuth()`.
    - `CartContext.tsx`:
      - Gerencia o estado do carrinho (`items`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`).
      - Calcula total (`getTotal`) e quantidade de itens (`getItemsCount`).
      - Exposta via `CartProvider` e hook `useCart()`.

  - `shared/data/mockData.ts`:
    - Contém dados mockados de usuários, restaurantes, produtos, pedidos, categorias, promoções, etc.
    - Também expõe funções utilitárias como:
      - `getOrdersByCustomer(customerId)`
      - `getFeaturedProducts(restaurantId)`
      - `getUserAddresses(userId)`
    - No futuro, esta camada será substituída por chamadas ao backend (Java + JDBC + MySQL).

  - `shared/styles/globals.css`:
    - Define variáveis de tema (background, foreground, cores de componentes, radius etc.).
    - Usa utilitários do Tailwind para aplicar estilos base de tipografia.

  - `shared/types/index.ts`:
    - Centraliza tipos TypeScript como `User`, `Product`, `Order`, `CartItem`, etc.
    - Esses tipos são usados em `context`, `features` e `data` para manter o código tipado e mais seguro.

  - `shared/ui/`:
    - Conjunto de componentes de interface generais (Button, Card, Input, Select, Modal, Tooltip, etc.), baseado em Radix UI + Tailwind (estilo shadcn).
    - São reutilizados em todas as features, evitando código duplicado.

  ### 1.4. Aliases de importação

  Para evitar caminhos relativos longos (`../../context/AuthContext`), foram criados aliases de importação em `tsconfig.json` e `vite.config.ts`:

  - `@app/*` → `src/app/*`
  - `@features/*` → `src/features/*`
  - `@shared/*` → `src/shared/*`

  Exemplos:

  ```ts
  // Antes
  import { useAuth } from '../../context/AuthContext';

  // Depois
  import { useAuth } from '@shared/context/AuthContext';

  // Uso de feature
  import { ClientHome } from '@features/client/ClientHome';

  // Uso de UI compartilhada
  import { Button } from '@shared/ui/button';
  ```

  Isso deixa o código mais legível e ajuda na explicação da arquitetura para o professor.

  ---

  ## 2. Fluxo de execução do frontend

  1. `main.tsx`
     - Importa os estilos globais (`globals.css` + `index.css`).
     - Renderiza o componente raiz `App` dentro da `div#root`.

  2. `App.tsx`
     - Envolve a árvore com `AuthProvider` e `CartProvider` para disponibilizar contexto em toda a aplicação.
     - Usa o hook `useAuth()` para descobrir o usuário atual e o papel (`role`).
     - Decide qual layout renderizar:
       - Cliente → `ClientLayout`
       - Funcionário → `EmployeeLayout`
       - Admin → `AdminLayout`
     - Controla a página atual (`currentPage`) com `useState` e passa `onNavigate` para as telas.

  3. Layouts
     - Cada layout:
       - Mostra cabeçalho (logo, informações do usuário logado, botão de logout).
       - Mostra navegação própria (menu de abas/botões conforme o perfil).
       - Renderiza o conteúdo da feature recebida via `children`.

  4. Features
     - Cada tela de `features/*` consome:
       - Dados do contexto (`useAuth`, `useCart`).
       - Dados mockados de `shared/data/mockData`.
       - Componentes visuais de `shared/ui`.

  ---

  ## 3. Como rodar o projeto

  Na raiz do projeto existe a pasta `frontend/`, que contém o app React com Vite.

  ### 3.1. Instalar dependências

  ```bash
  cd "sistema-delivery/frontend"
  npm install
  ```

  ### 3.2. Rodar em modo desenvolvimento

  ```bash
  cd "sistema-delivery/frontend"
  npm run dev
  ```

  O Vite iniciará o servidor (por padrão, porta 3000) e abrirá o navegador com o app.

  ---

  ## 4. Próximos passos (backend)

  Para atender completamente aos requisitos técnicos da disciplina (JDBC + MySQL, DAO/Service/Controller, integridade referencial, etc.), o próximo passo é criar um backend em Node.js e Express.js que substitua os mocks:

  - Mapear as entidades do `mockData.ts` para tabelas MySQL.
  - Implementar DAOs com JSON para realizar CRUD nas tabelas.
  - Implementar camada Service para regras de negócio.
  - Implementar Controllers (por exemplo, REST) para expor APIs ao frontend.
  - Trocar as chamadas mockadas no frontend por chamadas HTTP ao backend.

  Esta documentação explica a parte de frontend e como ela foi organizada para facilitar essa evolução futura.
  
