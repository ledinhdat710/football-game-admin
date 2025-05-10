import { http } from './Base/base.service'

export const openingHourService = {
  async getList(query) {
    return await http.get('/openingHours', {
      params: query
    })
  }
}
