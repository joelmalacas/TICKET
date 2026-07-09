import { api } from './client'

export const authApi = {
  registerUser: (username, email, password) =>
    api.post('/users/CreateUser', { username, email, password }),

  registerAdmin: (username, email, password) =>
    api.post('/admin/CreateAdmin', { username, email, password }),

  loginUser: (username, password) =>
    api.post('/users/LoginUser', { username, password }),

  loginAdmin: (username, password) =>
    api.post('/admin/LoginAdmin', { username, password }),

  logout: (role, token) =>
    role === 'ADMIN'
      ? api.put('/admin/LogoutAdmin', {}, token)
      : api.put('/users/LogoutUser', {}, token),

  info: (role, token) =>
    role === 'ADMIN'
      ? api.get('/admin/InfoAdmin', token)
      : api.get('/users/InfoUser', token),

  update: (role, token, { username, email, password }) =>
    role === 'ADMIN'
      ? api.put('/admin/UpdateAdmin', { username, email, password }, token)
      : api.put('/users/UpdateUser', { username, email, password }, token),
}
