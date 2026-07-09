import { api } from './client'

export const respostasApi = {
  list: (idTicket, token) =>
    api.getWithBody('/Respostas/RESPOSTAS', { ticket_id: idTicket }, token),

  create: (idTicket, mensagem, token) =>
    api.post('/Respostas/CREATERESPOSTA', { ticket_id: idTicket, mensagem }, token),
}
