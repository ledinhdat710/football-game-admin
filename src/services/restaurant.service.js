import { http } from "./Base/base.service";
export const restaurantService = {
    async getList(query) {
        return await http.get('/stores', {
            params: query
        })
    },
    async create(payload) {
        return await http.post('/stores', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async edit(id, payload) {
        return await http.post(`/stores/${id}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async getDetail(id) {
        return await http.get(`/stores/${id}`)
    },
    async delete(id) {
        return await http.delete(`/stores/${id}`)
    },
    async changePassword(id, data) {
        return await http.post(`/auth/change_user_password?user_id=${id}`, data);
    },

    async loginWithId(id) {
        return await http.get(`/auth/loginWithId/${id}`)
    },
    async resetCache(id) {
        return await http.post(`/reset_cache/${id}`)
    }
}