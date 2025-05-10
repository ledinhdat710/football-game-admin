import { http } from './Base/base.service'

export const printerLogService = {
  async getList(query) {
    return await http.get('/printerLogs', {
      params: query
    })
  }
}
