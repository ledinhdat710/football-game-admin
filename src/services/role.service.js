import { http } from './Base/base.service'

export const roleService = {
  async getList(query) {
    return await http.get('/roles', {
      params: query
    })
  },

  async get(id) {
    return await http.get('/roles/' + id)
  },

  async create(data) {
    return await http.post('/roles', data)
  },

  async update(id, data) {
    return await http.patch('/roles/' + id, data)
  },

  async delete(id) {
    return await http.delete('/roles/' + id)
  }
}
