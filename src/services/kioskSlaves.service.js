import { http } from "./Base/base.service";
export const kioskSlavesService = {
    async getListDevice(query) {
        return await http.get('/devices', {
            params: query
        })
    },
    async createDevice(payload) {
        return await http.post('/devices/manual', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async updateDevice(id, payload) {
        return await http.post(`/devices/${id}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async getDetailDevice(id) {
        return await http.get(`/devices/${id}`)
    },
    async deleteDevice(id) {
        return await http.delete(`/devices/${id}`)
    },

    async getListMedia(query) {
        return await http.get('/medias', {
            params: query
        })
    },
    async createMedia(payload) {
        return await http.post('/medias', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async updateMedia(id, payload) {
        return await http.post(`/medias/${id}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async getDetailMedia(id) {
        return await http.get(`/medias/${id}`)
    },
    async deleteMedia(id) {
        return await http.delete(`/medias/${id}`)
    },
    async updateMediaActive(id) {
        return await http.post(`/medias/${id}/set-active`, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
}