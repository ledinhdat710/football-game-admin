import { http } from './Base/base.service'

export const customerService = {
  async getList(query) {
    return await http.get('/customers', {
      params: query
    })
  }
}
