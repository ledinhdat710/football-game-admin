import { http } from "./Base/base.service";
export const printerSlavesService = {
    async getListPrinter(query) {
        return await http.get('/printer_v2', {
            params: query
        })
    },
    async syncPrinter(payload) {
        return await http.post('/printer_v2/sync', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async testPrinter(id, payload) {
        return await http.post(`printer_v2/${id}/test`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    async attachStore(id, payload) {
        return await http.put(`/printer_v2/${id}/assign`, payload, {
            headers: {
                "Content-Type": "application/json", // Loại dữ liệu raw
            },
        })
    },
}