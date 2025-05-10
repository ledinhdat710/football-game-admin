import { http } from './Base/base.service'

export const printerService = {
  async getList(query) {
    return await http.get('/printers', {
      params: query
    })
  },

  async get(id) {
    return await http.get('/printers/' + id)
  },

  async create(data) {
    return await http.post('/printers', data)
  },

  async update(id, data) {
    return await http.patch('/printers/' + id, data)
  },

  async delete(id) {
    return await http.delete('/printers/' + id)
  },

  async testPrint(id) {
    return await http.post('/printers/test-print/' + id, null)
  },

  async defaultPrint(id) {
    return await http.post('/printers/set_default/' + id, null)
  },

  async unsetDefaultPrint(id) {
    return await http.post('/printers/unset_default/' + id)
  }
}
