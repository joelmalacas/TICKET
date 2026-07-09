const API_BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.84:8080'

/**
 * A API tem endpoints GET que esperam parâmetros associados ao pedido
 * (ex: /tickets/TICKET, /tickets/TICKETS, /Respostas/RESPOSTAS).
 * Os browsers descartam sempre o body em pedidos GET (isto aplica-se
 * tanto a fetch() como a XMLHttpRequest — é um comportamento definido
 * na especificação, não uma limitação de uma API em concreto), por
 * isso os parâmetros vão na query string e o PHP lê-os de $_GET.
 */
async function getWithBody(path, params = {}, token = null) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  ).toString()
  const url = query ? `${path}?${query}` : path
  return request(url, { method: 'GET', token })
}

/**
 * Pedidos normais (POST, PUT, DELETE) via fetch.
 */
async function request(path, { method = 'GET', body = null, token = null } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    data = text
  }

  if (!res.ok) {
    throw { status: res.status, data }
  }
  return data
}

export const api = {
  getWithBody,
  get: (path, token) => request(path, { method: 'GET', token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body, token }),
  del: (path, body, token) => request(path, { method: 'DELETE', body, token }),
}

export default API_BASE
