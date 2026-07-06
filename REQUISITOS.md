# Sistema de Tickets de Suporte — Requisitos do Projeto

---

## Descrição Geral

Plataforma web de suporte técnico onde utilizadores podem abrir tickets de ajuda e administradores podem gerir, responder e fechar esses tickets. O sistema distingue dois tipos de utilizadores com permissões diferentes.

---

## Roles

| Role | Descrição |
|------|-----------|
| `user` | Utilizador comum — abre e acompanha os seus tickets |
| `admin` | Administrador — gere todos os tickets do sistema |

---

## Funcionalidades

### Autenticação
- [ ] Registo de conta com username, email e password
- [ ] Login com username ou email
- [ ] Logout com invalidação do token
- [ ] Bearer Token em todos os endpoints protegidos
- [ ] Atribuição de role no registo (`user` por defeito)

---

### Tickets (Utilizador)
- [ ] Criar ticket com título, descrição, categoria e prioridade
- [ ] Listar os seus próprios tickets
- [ ] Ver detalhe de um ticket (incluindo respostas)
- [ ] Fechar um ticket aberto pelo próprio
- [ ] Não pode ver tickets de outros utilizadores

---

### Tickets (Admin)
- [ ] Listar todos os tickets do sistema
- [ ] Filtrar tickets por estado, prioridade e categoria
- [ ] Ver detalhe de qualquer ticket
- [ ] Alterar o estado de um ticket
- [ ] Eliminar um ticket

---

### Respostas
- [ ] Utilizador pode responder ao seu próprio ticket
- [ ] Admin pode responder a qualquer ticket
- [ ] Cada resposta tem autor, conteúdo e data
- [ ] As respostas aparecem ordenadas por data (mais antiga primeiro)

---

## Estados de um Ticket

| Estado | Descrição |
|--------|-----------|
| `aberto` | Ticket recém criado, aguarda resposta |
| `em análise` | Admin está a tratar do ticket |
| `aguarda resposta` | Admin respondeu, aguarda resposta do utilizador |
| `resolvido` | Problema resolvido, ticket fechado |
| `cancelado` | Ticket cancelado pelo utilizador ou admin |

---

## Prioridades

| Prioridade | Descrição |
|------------|-----------|
| `baixa` | Sem urgência |
| `média` | Urgência normal |
| `alta` | Urgente |
| `crítica` | Bloqueante, requer atenção imediata |

---

## Categorias (exemplo)
- Problema técnico
- Pedido de funcionalidade
- Dúvida
- Faturação
- Outro

---

## Base de Dados

### Tabela `users`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PK | Identificador |
| `username` | VARCHAR | Nome de utilizador único |
| `email` | VARCHAR | Email único |
| `password` | VARCHAR | Hash SHA-256 |
| `role` | ENUM | `user` ou `admin` |
| `estado` | VARCHAR | `Online` / `Offline` |
| `token` | VARCHAR | Bearer Token ativo |
| `created_at` | DATETIME | Data de registo |

### Tabela `tickets`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PK | Identificador |
| `user_id` | INT FK | Utilizador que abriu |
| `titulo` | VARCHAR | Título do ticket |
| `descricao` | TEXT | Descrição do problema |
| `categoria` | VARCHAR | Categoria do ticket |
| `prioridade` | ENUM | `baixa`, `média`, `alta`, `crítica` |
| `estado` | ENUM | Estado atual do ticket |
| `created_at` | DATETIME | Data de criação |
| `updated_at` | DATETIME | Última atualização |

### Tabela `respostas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PK | Identificador |
| `ticket_id` | INT FK | Ticket a que pertence |
| `user_id` | INT FK | Autor da resposta |
| `mensagem` | TEXT | Conteúdo da resposta |
| `created_at` | DATETIME | Data da resposta |

---

## Endpoints API (PHP)

### Auth (`UsersAPI.php`)
| Método | Endpoint | Descrição | Protegido |
|--------|----------|-----------|-----------|
| POST | `/CreateUser` | Registo | ❌ |
| POST | `/LoginUser` | Login | ❌ |
| PUT | `/LogoutUser` | Logout | ✅ |
| GET | `/InfoUser` | Info do utilizador | ✅ |
| PUT | `/UpdateUser` | Atualizar perfil | ✅ |

### Tickets (`TicketsAPI.php`)
| Método | Endpoint | Descrição | Role |
|--------|----------|-----------|------|
| GET | `/TICKETS` | Listar tickets | ✅ user (só os seus) / admin (todos) |
| GET | `/TICKET` | Detalhe de um ticket | ✅ user / admin |
| POST | `/CREATETICKET` | Criar ticket | ✅ user |
| PUT | `/UPDATETICKET` | Alterar estado | ✅ admin |
| DELETE | `/DELETETICKET` | Eliminar ticket | ✅ admin |

### Respostas (`RespostasAPI.php`)
| Método | Endpoint | Descrição | Role |
|--------|----------|-----------|------|
| GET | `/RESPOSTAS` | Listar respostas de um ticket | ✅ user / admin |
| POST | `/CREATERESPOSTA` | Adicionar resposta | ✅ user / admin |

---

## Segurança
- Todos os endpoints (exceto login e registo) requerem Bearer Token
- Validação de role em cada endpoint sensível — um `user` não pode aceder a rotas de `admin`
- Um utilizador só pode ver e responder aos seus próprios tickets

---

## Frontend (React)

### Ecrãs
- [ ] Login / Registo
- [ ] Dashboard do utilizador — lista dos seus tickets com filtro por estado
- [ ] Formulário de criação de ticket
- [ ] Detalhe do ticket com thread de respostas
- [ ] Painel de admin — lista de todos os tickets com filtros avançados
- [ ] Perfil do utilizador

### Componentes principais
- `TicketCard` — resumo do ticket (título, estado, prioridade, data)
- `TicketDetail` — detalhe completo com respostas
- `ReplyBox` — caixa de texto para responder
- `AdminPanel` — tabela de tickets com ações rápidas
- `PriorityBadge` — badge colorido por prioridade
- `StatusBadge` — badge colorido por estado