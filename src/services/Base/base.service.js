import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import router from "@/router/starter";

const { cookies } = useCookies()

const http = axios.create({
    baseURL: 'https://api.penmaster.pro',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
})

http.interceptors.request.use((config) => {
    const token = cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

http.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    let response = error.response?.data

    if (error.response?.status === 401) {
        response.code = error.response?.status
        cookies.remove('token')
        router.push('/auth/sign-in')
    }
    if (error.response?.status === 403) {
        response.code = error.response?.status
        router.push('/auth/sign-in')
    }
    if (!error?.response || error?.response?.status === 500) {
        response = { ...response, code: 500 }
    }
    return Promise.reject(response)
})

export {
    http
}