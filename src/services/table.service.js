import { http } from './Base/base.service'

export const tableService = {
  async getList(query) {
    return await http.get('/tables', {
      params: query
    })
  },

  async get(id) {
    return await http.get('/tables/' + id)
  },

  async create(data) {
    return await http.post('/tables', data)
  },

  async update(id, data) {
    return await http.patch('/tables/' + id, data)
  },

  async delete(id) {
    return await http.delete('/tables/' + id)
  }
}
