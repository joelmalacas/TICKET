import { api } from './client'

export const ticketsApi = {
  list: (token) => api.getWithBody('/tickets/TICKETS', {}, token),

  get: (idTicket, token) =>
    api.getWithBody('/tickets/TICKET', { id_ticket: idTicket }, token),

  create: (data, token) => api.post('/tickets/CREATETICKET', data, token),

  updateEstado: (idTicket, estado, token) =>
    api.put('/tickets/UPDATETICKET', { id_ticket: idTicket, estado }, token),

  remove: (idTicket, token) =>
    api.del('/tickets/DELETETICKET', { id_ticket: idTicket }, token),
}
