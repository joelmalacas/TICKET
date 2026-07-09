# Balcão de Tickets — Front-end

Front-end em **React + Vite + Tailwind** para a tua API PHP de gestão de tickets.

## Como correr

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

O endereço da API está definido em `.env`:
```
VITE_API_BASE=http://192.168.1.84:8080
```
Muda se o teu `router.php` estiver noutro caminho (ex: `http://192.168.1.84:8080/api`).

## Estrutura

```
src/
  api/            → chamadas HTTP (client.js, auth.js, tickets.js, respostas.js)
  context/        → AuthContext (sessão, token, role)
  components/     → Layout, TicketStub, StatusStamp, PriorityTag, ProtectedRoute, Spinner
  pages/          → Login, Register, Dashboard, NewTicket, TicketDetail, Profile
```

## Decisões técnicas (resumo do que combinámos)

1. **Auth**: token enviado como `Authorization: Bearer <token>` em todos os pedidos autenticados.
2. **GET com body**: os endpoints `GET /tickets/TICKETS`, `GET /tickets/TICKET` e `GET /Respostas/RESPOSTAS`
   esperam dados no corpo do pedido. Como `fetch()` não permite body em GET, uso `XMLHttpRequest`
   nesses 3 casos específicos (ver `getWithBody` em `src/api/client.js`). Todo o resto usa `fetch`.
3. **Rotas assumidas**: `/users/...`, `/admin/...`, `/tickets/...`, `/Respostas/...`, conforme o
   `router.php` que enviaste (`str_contains` em `/admin`, `/users`, `/tickets`, `/Respostas`).
   Se o teu `.htaccess`/rewrite usar outro prefixo (ex: `/api/tickets/...`), ajusta os paths nos
   ficheiros dentro de `src/api/`.

## Coisas a verificar no backend

- **CORS**: confirma que `ENVCORS.php` permite o origin `http://localhost:5173` (ou o IP/porta
  de onde vais servir o front-end), os métodos `GET, POST, PUT, DELETE, OPTIONS`, e o header
  `Authorization`. Sem isto, o browser bloqueia os pedidos mesmo que a API esteja correta.
- **Pedidos OPTIONS (preflight)**: como usas `PUT`/`DELETE` com `Content-Type: application/json`,
  o browser envia um pedido `OPTIONS` antes. Confirma que o `router.php` responde 200 a `OPTIONS`
  sem exigir token.
- **`UpdateUser`/`UpdateAdmin`**: no PHP atual, a password é sempre re-hashed e gravada, mesmo que
  o campo venha vazio (`hash(ENCRYPT, '')`). No formulário de Perfil, se deixares a password em
  branco, isto vai **apagar a password atual**. Recomendo ajustar o PHP para só atualizar a
  password se o campo vier preenchido — digo-te se quiseres ajuda com isso.

## Design

Tema "balcão de despacho": cartões de ticket em forma de bilhete/stub com perfuração lateral,
carimbo rotacionado para o estado, e tags de prioridade por cor. Paleta escura verde-pinho com
acento âmbar. Fontes: Space Grotesk (títulos), Public Sans (corpo), IBM Plex Mono (códigos/dados).
