import { http } from "./Base/base.service";

export const authService = {
    async login(payload) {
        return await http.post('/api/v1/auth/email/login', payload)
    }
}