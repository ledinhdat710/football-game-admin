import { http } from './Base/base.service'

export const kiosikService = {
  async getList(query) {
    return await http.get('/kiosks', {
      params: query
    })
  },

  async get(id) {
    return await http.get('/kiosks/' + id)
  },

  async create(data) {
    return await http.post('/kiosks', data)
  },

  async update(id, data) {
    return await http.patch('/kiosks/' + id, data)
  },

  async delete(id) {
    return await http.delete('/kiosks/' + id)
  }
}
