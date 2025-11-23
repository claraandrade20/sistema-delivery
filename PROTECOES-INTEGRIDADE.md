# 🛡️ Proteções de Integridade de Dados

## 📋 Visão Geral

O sistema possui **proteções automáticas** para evitar que exclusões quebrem o banco de dados ou causem inconsistências nos dados. Todas as validações são feitas **antes** de deletar qualquer registro.

## 🔒 Proteções Implementadas

### 1. Exclusão de Categorias

#### ✅ O que está protegido:
- **Não é possível deletar categorias que têm produtos associados**
- O sistema verifica quantos produtos estão vinculados à categoria
- Se houver produtos, a exclusão é **bloqueada**

#### 📝 Mensagem de erro:
```
"Não é possível deletar categoria que possui produtos associados"
```

#### 🔧 Implementação técnica:
```sql
-- Antes de deletar, o sistema executa:
SELECT COUNT(*) as total FROM produtos WHERE id_categoria = ?

-- Se total > 0, bloqueia a exclusão
```

**Arquivo:** `backend/src/controller/categoriasController.ts` (linha 253)

---

### 2. Exclusão de Produtos

#### ✅ O que está protegido:
- **Não é possível deletar produtos que estão em pedidos**
- O sistema verifica se o produto aparece em algum pedido (tabela `itens_pedido`)
- Se houver pedidos com esse produto, a exclusão é **bloqueada**

#### 📝 Mensagem de erro:
```
"Não é possível deletar produto que possui pedidos associados. 
Este produto está em X pedido(s)."
```

#### 🔧 Implementação técnica:
```sql
-- Antes de deletar, o sistema executa:
SELECT COUNT(*) as total FROM itens_pedido WHERE id_produto = ?

-- Se total > 0, bloqueia a exclusão e mostra quantos pedidos
```

**Arquivo:** `backend/src/service/produtosServiceDB.ts` (linha 340)

---

## 🎯 Produtos e Categorias de Teste

### ✅ PODEM ser deletados:

1. **🗑️ Produto Para Exclusão Teste**
   - ID: 9
   - Criado especificamente para demonstração
   - **NÃO está em nenhum pedido**
   - Pode ser deletado sem problemas

2. **🗑️ Categoria Para Exclusão Teste**
   - ID: 7
   - Criada especificamente para demonstração
   - **NÃO tem produtos associados**
   - Pode ser deletada sem problemas

### ⚠️ NÃO podem ser deletados (ou terão restrições):

1. **Produtos dos pedidos existentes**
   - Ex: Pizzas que já foram pedidas
   - Sistema bloqueia a exclusão
   - Motivo: Mantém histórico de pedidos íntegro

2. **Categorias com produtos**
   - Ex: "Pizzas" (tem vários produtos)
   - Sistema bloqueia a exclusão
   - Motivo: Produtos precisam ter categoria

---

## 🧪 Como Testar as Proteções

### Teste 1: Tentar deletar categoria com produtos

1. Acesse "Categorias"
2. Tente deletar "Pizzas" (tem produtos associados)
3. **Resultado esperado:** ❌ Bloqueado
4. **Mensagem:** "Não é possível deletar categoria que possui produtos associados"

### Teste 2: Tentar deletar produto em pedidos

1. Acesse "Produtos"
2. Tente deletar "Pizza Margherita" (está em pedidos)
3. **Resultado esperado:** ❌ Bloqueado
4. **Mensagem:** "Não é possível deletar produto que possui pedidos associados. Este produto está em X pedido(s)."

### Teste 3: Deletar produto de teste (SEM pedidos)

1. Acesse "Produtos"
2. Encontre "🗑️ Produto Para Exclusão Teste"
3. Clique em deletar
4. **Resultado esperado:** ✅ Deletado com sucesso
5. **Motivo:** Produto não está em nenhum pedido

### Teste 4: Deletar categoria de teste (SEM produtos)

1. Acesse "Categorias"
2. Encontre "🗑️ Categoria Para Exclusão Teste"
3. Clique em deletar
4. **Resultado esperado:** ✅ Deletada com sucesso
5. **Motivo:** Categoria não tem produtos associados

---

## 💾 Integridade Referencial no Banco

### Foreign Keys com CASCADE

Algumas exclusões são **automáticas** quando o pai é deletado:

```sql
-- Quando um PRODUTO é deletado:
- Suas VARIAÇÕES são deletadas automaticamente (ON DELETE CASCADE)
- Seus ADICIONAIS são deletados automaticamente (ON DELETE CASCADE)

-- Quando uma CATEGORIA é deletada:
- Produtos NÃO são deletados (proteção manual no código)

-- Quando um PEDIDO é deletado:
- ITENS_PEDIDO são deletados automaticamente (ON DELETE CASCADE)
```

**Arquivo:** `backend/src/scripts/initDatabase.ts`

---

## 🔍 Fluxo de Validação

### Exclusão de Produto:

```
1. Frontend: Usuário clica em "Deletar"
   ↓
2. Modal: Confirma a ação
   ↓
3. API: DELETE /api/produtos/:id
   ↓
4. Service: deletarProduto(id)
   ↓
5. Validação: Verifica se produto existe
   ↓
6. Validação: Verifica se tem pedidos associados
   ↓
   ├─ SIM → ❌ Retorna erro 409 (Conflict)
   │         "Não é possível deletar produto que possui pedidos associados"
   │
   └─ NÃO → ✅ DELETE FROM produtos WHERE id = ?
            ✅ Retorna sucesso 204 (No Content)
```

### Exclusão de Categoria:

```
1. Frontend: Usuário clica em "Deletar"
   ↓
2. Modal: Confirma a ação
   ↓
3. API: DELETE /api/categorias/:id
   ↓
4. Controller: deletarCategoria()
   ↓
5. Validação: Verifica se categoria existe
   ↓
6. Validação: Verifica se tem produtos associados
   ↓
   ├─ SIM → ❌ Retorna erro 409 (Conflict)
   │         "Não é possível deletar categoria que possui produtos associados"
   │
   └─ NÃO → ✅ DELETE FROM categorias WHERE id = ?
            ✅ Retorna sucesso com mensagem
```

---

## 🎓 Para Mostrar ao Professor

### Demonstração de Segurança:

1. **Mostrar que itens protegidos NÃO podem ser deletados:**
   ```
   - Tentar deletar categoria "Pizzas"
   - Tentar deletar produto em pedidos existentes
   - Sistema bloqueia e mostra mensagem clara
   ```

2. **Mostrar que itens de teste PODEM ser deletados:**
   ```
   - Deletar "🗑️ Produto Para Exclusão Teste"
   - Deletar "🗑️ Categoria Para Exclusão Teste"
   - Sistema permite e remove do banco
   ```

3. **Verificar persistência:**
   ```
   - Atualizar a página (F5)
   - Item deletado não aparece mais
   - Prova que foi removido do banco MySQL
   ```

### Pontos Técnicos para Destacar:

✅ **Validações server-side** (não apenas frontend)
✅ **Códigos HTTP corretos** (409 Conflict para violação de regra de negócio)
✅ **Mensagens claras** ao usuário sobre por que não pode deletar
✅ **Integridade referencial** mantida no banco de dados
✅ **Transações seguras** com pool de conexões MySQL
✅ **Logs de erro** para debugging
✅ **Feedback visual** com toasts informativos

---

## 📊 Resumo das Regras

| Entidade | Pode Deletar? | Condição |
|----------|--------------|----------|
| 🗑️ Produto Teste | ✅ SIM | Não está em pedidos |
| 🗑️ Categoria Teste | ✅ SIM | Não tem produtos |
| 🍕 Produto Normal | ⚠️ DEPENDE | Apenas se não estiver em pedidos |
| 📦 Categoria Normal | ⚠️ DEPENDE | Apenas se não tiver produtos |
| 📋 Pedido | ✅ SIM | Sempre pode (remove itens em cascata) |

---

## 🛠️ Arquivos Relacionados

**Backend:**
- `src/controller/categoriasController.ts` - Validação de categorias
- `src/service/produtosServiceDB.ts` - Validação de produtos
- `src/scripts/initDatabase.ts` - Definição de foreign keys

**Frontend:**
- `src/features/employee/CategoriesManagement.tsx` - Interface de categorias
- `src/features/employee/ProductsManagement.tsx` - Interface de produtos

---

## 🔐 Segurança Adicional

Para ainda mais segurança, você pode:

1. **Soft Delete** (marcar como deletado, não remover):
   ```sql
   UPDATE produtos SET deletado = true WHERE id = ?
   ```

2. **Logs de auditoria**:
   ```sql
   INSERT INTO logs_exclusao (usuario, entidade, id, data)
   VALUES (?, 'produto', ?, NOW())
   ```

3. **Permissões por usuário**:
   ```typescript
   if (user.role !== 'admin') {
     throw new Error('Apenas administradores podem deletar');
   }
   ```

Essas podem ser implementadas futuramente se necessário! 🚀
