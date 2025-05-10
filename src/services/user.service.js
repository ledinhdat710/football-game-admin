import { http } from './Base/base.service'

export const userService = {
  async getList(query) {
    return await http.get('/users', {
      params: query
    })
  },

  async get(id) {
    return await http.get('/users/' + id)
  },

  async create(data) {
    return await http.post('/users', data)
  },

  async update(id, data) {
    return await http.patch('/users/' + id, data)
  },

  async delete(id) {
    return await http.delete('/users/' + id)
  },

  async changePassword(payload) {
    return await http.post('/auth/change_user_password', payload);
  }
}
