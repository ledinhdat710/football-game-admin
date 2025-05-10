import { http } from './Base/base.service'

export const announcementService = {
    async getList() {
        return await http.get('/notifications')
    },

    async get(id) {
        return await http.get('/notifications/' + id)
    },

    async create(data) {
        return await http.post('/notifications', data)
    },

    async update(id, data) {
        return await http.patch('/notifications/' + id, data)
    },

    async delete(id) {
        return await http.delete('/notifications/' + id)
    }
}
