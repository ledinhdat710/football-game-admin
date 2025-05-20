import { http } from "./Base/base.service";
export const codeService = {
    async getList(query) {
        return await http.get('/api/v1/admins/deposit', {
            params: query
        })
    },
    async create(payload) {
        return await http.post('/api/v1/admins/deposit', payload)
    },
    async update(id, payload) {
        return await http.put('/api/v1/admins/' + id, payload)
    },
    async getDetail(id) {
        return await http.get(`/api/v1/admins/${id}`)
    },
    async delete(id) {
        return await http.delete(`/top-managers/${id}`)
    },

    async loginStore(id) {
        return await http.get(`/store-login/${id}`)
    },

    async import(payload) {
        return await http.post('/api/v1/admins/import-code', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
}