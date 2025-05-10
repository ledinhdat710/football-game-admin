import {http} from "./Base/base.service";

export const BankTerminalService = {
    async getList(query){
        return await http.get('/terminal_accounts', {
            params: query
        })
    },
    async create(payload){
        return await http.post('/terminal_accounts', payload)
    },
    async edit(id, payload){
        return await http.patch(`/terminal_accounts/${id}`, payload)
    },
    async getDetail(id) {
        return await http.get(`/terminal_accounts/${id}`);
    },
    async delete(id) {
        return await http.delete(`/terminal_accounts/${id}`);
    },
    async configTime(payload){
        return await http.post(`/reconsultation_time`, payload)
    },

    async getAll(query) {
        return await http.get('/terminals', {
            params: query
        })
    },

    async detailConfigTime(id, payload){
        return await http.post(`terminals/reconsultation/${id}`, payload)
    }
}