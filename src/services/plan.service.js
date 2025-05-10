import {http} from "./Base/base.service";
export const planService = {
    async getList(query) {
        return await http.get('/plans', {
            params: query
        })
    },
    async create(payload) {
        return await http.post('/plans', payload)
    },
    async edit(id, payload) {
        return await http.patch(`/plans/${id}`, payload)
    },
    async getDetail(id) {
        return await http.get(`/plans/${id}`)
    }
}