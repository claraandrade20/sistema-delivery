# 📚 Documentação API - Sistema de Delivery

**Base URL:** `http://localhost:3000/api`

---

## 🔐 AUTENTICAÇÃO

### 1. Login
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "client-1",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(85) 98765-4321",
    "role": "client",
    "createdAt": "2024-01-15T10:30:00Z",
    "isActive": true
  }
}
```

**Contas de Teste:**
| Email | Senha | Tipo |
|-------|-------|------|
| joao@email.com | 123456 | Cliente |
| carlos@restaurant.com | 123456 | Funcionário |
| admin@deliverysystem.com | 123456 | Admin |

---

### 2. Register (Criar Conta)
**Endpoint:** `POST /api/auth/register`

```json
{
  "name": "Maria Silva",
  "email": "maria.silva@email.com",
  "phone": "(85) 98765-1234",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "id": "client-1234567890",
  "name": "Maria Silva",
  "email": "maria.silva@email.com",
  "phone": "(85) 98765-1234",
  "role": "client",
  "createdAt": "2024-11-18T10:30:00Z",
  "isActive": true
}
```

---

### 3. Get Me (Dados do Usuário Logado)
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "client-1",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(85) 98765-4321",
  "role": "client",
  "createdAt": "2024-01-15T10:30:00Z",
  "isActive": true
}
```

---

### 4. Get All Users
**Endpoint:** `GET /api/auth/users`

**Response (200):**
```json
[
  {
    "id": "client-1",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(85) 98765-4321",
    "role": "client",
    "createdAt": "2024-01-15T10:30:00Z",
    "isActive": true
  },
  ...
]
```

---

## 🍕 PRODUTOS

### 1. Listar Todos os Produtos
**Endpoint:** `GET /api/produtos`

**Query Parameters (opcionais):**
- `restaurantId` - Filtrar por restaurante
- `categoryId` - Filtrar por categoria

**Response (200):**
```json
[
  {
    "id": "prod-1",
    "name": "Pizza Margherita",
    "description": "Pizza clássica com mozzarella",
    "price": 35.90,
    "category": "Pizza",
    "restaurantId": "rest-1",
    "image": "pizza-margherita.jpg",
    "available": true
  },
  ...
]
```

---

### 2. Obter Produto por ID
**Endpoint:** `GET /api/produtos/:id`

**Exemplo:** `GET /api/produtos/prod-1`

**Response (200):**
```json
{
  "id": "prod-1",
  "name": "Pizza Margherita",
  "description": "Pizza clássica com mozzarella",
  "price": 35.90,
  "category": "Pizza",
  "restaurantId": "rest-1",
  "image": "pizza-margherita.jpg",
  "available": true
}
```

---

### 3. Criar Produto
**Endpoint:** `POST /api/produtos`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Hamburger Gourmet",
  "description": "Hambúrguer com carne premium",
  "price": 28.50,
  "category": "Hambúrgueres",
  "restaurantId": "rest-1",
  "image": "burger-gourmet.jpg",
  "available": true
}
```

**Response (201):**
```json
{
  "id": "prod-new-123",
  "name": "Hamburger Gourmet",
  "description": "Hambúrguer com carne premium",
  "price": 28.50,
  "category": "Hambúrgueres",
  "restaurantId": "rest-1",
  "image": "burger-gourmet.jpg",
  "available": true
}
```

---

### 4. Atualizar Produto
**Endpoint:** `PUT /api/produtos/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Pizza Calabresa",
  "description": "Pizza com calabresa e queijo",
  "price": 38.90,
  "available": true
}
```

**Response (200):** Produto atualizado

---

### 5. Deletar Produto
**Endpoint:** `DELETE /api/produtos/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204):** Sem conteúdo

---

## 📦 PEDIDOS

### 1. Listar Todos os Pedidos
**Endpoint:** `GET /api/pedidos`

**Query Parameters (opcionais):**
- `customerId` - Filtrar por cliente
- `restaurantId` - Filtrar por restaurante

**Response (200):**
```json
[
  {
    "id": "pedido-1",
    "customerId": "client-1",
    "restaurantId": "rest-1",
    "items": [
      {
        "productId": "prod-1",
        "quantity": 2,
        "price": 35.90
      }
    ],
    "total": 71.80,
    "status": "pending",
    "deliveryAddress": "Rua A, 123",
    "createdAt": "2024-11-18T10:30:00Z"
  },
  ...
]
```

---

### 2. Obter Pedido por ID
**Endpoint:** `GET /api/pedidos/:id`

**Exemplo:** `GET /api/pedidos/pedido-1`

**Response (200):** Dados completos do pedido

---

### 3. Criar Pedido
**Endpoint:** `POST /api/pedidos`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "customerId": "client-1",
  "restaurantId": "rest-1",
  "items": [
    {
      "productId": "prod-1",
      "quantity": 2,
      "price": 35.90
    }
  ],
  "total": 71.80,
  "deliveryAddress": "Rua B, 456"
}
```

**Response (201):** Pedido criado

---

### 4. Atualizar Status do Pedido
**Endpoint:** `PATCH /api/pedidos/:id/status`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "status": "confirmed"
}
```

**Status Válidos:**
- `pending` - Pendente
- `confirmed` - Confirmado
- `preparing` - Em Preparação
- `ready` - Pronto
- `out_for_delivery` - Em Entrega
- `delivered` - Entregue
- `cancelled` - Cancelado

**Response (200):** Pedido atualizado

---

### 5. Atualizar Pedido
**Endpoint:** `PUT /api/pedidos/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "deliveryAddress": "Rua C, 789",
  "status": "confirmed"
}
```

**Response (200):** Pedido atualizado

---

## 🏥 HEALTH CHECK

**Endpoint:** `GET /api/health`

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-11-18T10:30:00.000Z"
}
```

---

## 📋 RAIZ DA API

**Endpoint:** `GET /api`

**Response (200):**
```json
{
  "message": "API Delivery funcionando!",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "produtos": "/api/produtos",
    "pedidos": "/api/pedidos",
    "health": "/api/health"
  }
}
```

---

## ⚙️ CONFIGURAÇÃO DO POSTMAN

### 1. Criar Variáveis de Ambiente
No Postman, vá em **Environments** → **New** e crie:

| Variável | Valor |
|----------|-------|
| `base_url` | `http://localhost:3000/api` |
| `token` | (será preenchido após login) |

### 2. Usar a Variável Base URL
Em todas as requisições, substitua `http://localhost:3000/api` por `{{base_url}}`

**Exemplo:**
```
GET {{base_url}}/produtos
```

### 3. Salvar Token após Login
Na aba **Tests** da requisição de login, adicione:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### 4. Usar Token em Requisições Autenticadas
Em **Authorization**, selecione **Bearer Token** e coloque: `{{token}}`

---

## 🚀 Próximos Passos

1. Importe esta documentação no Postman
2. Configure as variáveis de ambiente
3. Teste os endpoints na seguinte ordem:
   - ✅ GET /api (verificar se API está rodando)
   - ✅ POST /api/auth/login (obter token)
   - ✅ GET /api/produtos (listar produtos)
   - ✅ POST /api/pedidos (criar pedido)

**Boa sorte! 🎯**
