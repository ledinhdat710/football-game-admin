import {http} from "./Base/base.service";

export const productService = {
    async getList(query) {
        return await http.get('/products', {
            params: query
        })
    }
}