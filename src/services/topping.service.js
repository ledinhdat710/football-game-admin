import { http } from './Base/base.service'

export const toppingService = {
  async getList(query) {
    return await http.get('/toppings', {
      params: query
    })
  },

  async get(id) {
    return await http.get('/toppings/' + id)
  },

  async create(data) {
    return await http.post('/toppings', data)
  },

  async update(id, data) {
    return await http.patch('/toppings/' + id, data)
  },

  async delete(id) {
    return await http.delete('/toppings/' + id)
  }
}
