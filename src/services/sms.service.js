import {http} from "./Base/base.service";

export const SMSService = {
    async getDetail(id){
        return await http.get(`/sms_configs/${id}`)
    },

    async post(payload){
        return await http.post(`/sms_configs`, payload)
    },

    async update(id, payload) {
        return await http.patch(`/sms_configs/${id}`, payload)
    }
}