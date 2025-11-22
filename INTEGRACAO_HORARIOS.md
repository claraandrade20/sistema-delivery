# Integração da Tabela horario_funcionamento

## Resumo das Mudanças

Foram criados novos endpoints na API backend para gerenciar os horários de funcionamento do restaurante, e o componente `BusinessHoursManagement` foi atualizado para consumir dados do banco de dados em tempo real.

## Arquivos Criados

### Backend

#### 1. **`backend/src/service/horarioFuncionamentoService.ts`**
- Service responsável pela comunicação com o banco de dados
- Funções principais:
  - `buscarHorariosRestaurante()` - Busca todos os horários de um restaurante
  - `atualizarHorariosFuncionamento()` - Atualiza os horários no banco
  - `converterParaBusinessHours()` - Converte dados do banco para formato da API
  - `buscarHorariosFormatados()` - Retorna horários já formatados

#### 2. **`backend/src/controller/horarioFuncionamentoController.ts`**
- Controller com os endpoints da API
- Endpoints:
  - `GET /horarios?restaurantId=1` - Busca horários de um restaurante
  - `GET /horarios/:restaurantId` - Busca horários com ID na URL
  - `PUT /horarios/:restaurantId` - Atualiza os horários

#### 3. **`backend/src/routes/horarios.ts`**
- Define as rotas para horários
- Registra todos os endpoints do controller

### Frontend

#### 4. **`frontend/src/shared/services/api.ts` (modificado)**
- Adicionado objeto `horariosAPI` com duas funções:
  - `buscar(restaurantId)` - Busca os horários do banco
  - `atualizar(restaurantId, horarios)` - Envia alterações para o servidor

#### 5. **`frontend/src/features/employee/BusinessHoursManagement.tsx` (modificado)**
- Componente totalmente reformulado para consumir dados do backend
- Novos features:
  - Carrega horários do banco ao montar
  - Estados de loading e saving
  - Tratamento de erros com toast
  - Salva alterações no banco em tempo real

### Backend Server (modificado)

#### 6. **`backend/src/server.ts` (modificado)**
- Adicionado import da rota de horários
- Registrada nova rota `/api/horarios`
- Endpoint atualizado na documentação da API

## Fluxo de Funcionamento

### Ao Carregar a Página
1. Componente monta com `loading = true`
2. Executa `fetchHorarios()` que chama `horariosAPI.buscar(1)`
3. Backend busca os dados da tabela `horario_funcionamento`
4. Dados são formatados e retornados
5. Estado `hours` é atualizado com os dados
6. Loading muda para `false` e componente renderiza

### Ao Alterar Horários
1. Usuário modifica o estado local (toggle aberto/fechado, hora)
2. Usuário clica em "Salvar Alterações"
3. Componente chama `horariosAPI.atualizar(restaurantId, hours)`
4. Backend atualiza a tabela `horario_funcionamento`
5. Toast de sucesso é exibido

## Estrutura de Dados

### Input (Frontend → Backend)
```typescript
{
  dayOfWeek: 0,        // 0-6 (domingo a sábado)
  isOpen: true,        // restaurante aberto?
  openTime: "11:00",   // horário de abertura
  closeTime: "23:00"   // horário de fechamento
}[]
```

### Output (Backend → Frontend)
```typescript
{
  id: 1,
  id_restaurante: 1,
  dia_semana: 0,
  nome_dia: "Domingo",
  hora_inicio: "11:00",
  hora_fim: "23:00",
  fechado_em: null,
  criado_em: "2025-11-22T10:30:00Z",
  atualizado_em: "2025-11-22T14:20:00Z"
}[]
```

## Como Usar

### Para o Funcionário
1. Acesse a seção "Horários" no painel
2. Toggle para abrir/fechar o restaurante em cada dia
3. Se aberto, defina os horários de início e fim
4. Clique em "Salvar Alterações"

### Para o Desenvolvedor
1. Os horários são persistidos no banco MySQL
2. A API está disponível em `http://localhost:3000/api/horarios`
3. Pode ser consumida em outros componentes usando `horariosAPI`

## Próximas Melhorias (Sugestões)

1. **Contexto de Autenticação**: Passar `restaurantId` do contexto em vez de hardcoded
2. **Validação**: Adicionar validações de hora de início < hora de fim
3. **Histórico**: Manter log das alterações de horários
4. **Feriados**: Adicionar suporte para dias especiais/feriados
5. **Notificações**: Enviar notificação aos clientes quando horários mudam
