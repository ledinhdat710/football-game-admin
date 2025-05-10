import {http} from "./Base/base.service";
export const categoryService = {
    async getList(query) {
        return await http.get('/categories', {
            params: query
        })
    },
    async create(payload) {
        return await http.post('/categories', payload)
    },
    async edit(id, payload) {
        return await http.patch(`/categories/${id}`, payload)
    },
    async getDetail(id) {
        return await http.get(`/categories/${id}`)
    }
}