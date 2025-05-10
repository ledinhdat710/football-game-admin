import { http } from './Base/base.service'

export const kitchenService = {
    async getList(query) {
        return await http.get('/kitchens', {
            params: query
        })
    },

    async get(id) {
        return await http.get('/kitchens/' + id)
    },

    async create(data) {
        return await http.post('/kitchens', data)
    },

    async update(id, data) {
        return await http.patch('/kitchens/' + id, data)
    },

    async delete(id) {
        return await http.delete('/kitchens/' + id)
    }
}
