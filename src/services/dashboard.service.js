import {http} from "./Base/base.service";
export const dashBoardService = {
    async getList(query) {
        return await http.get('/super_admin/dashboard', {
            params: query
        })
    },
}