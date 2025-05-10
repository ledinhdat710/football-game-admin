import { http } from './Base/base.service'

export const transactionService = {
  async getList(query) {
    return await http.get('/transactions', {
      params: query
    })
  }
}
