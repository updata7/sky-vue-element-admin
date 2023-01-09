import request from '@/utils/request'

export function getPermissionList(params) {
    return request({
        url: '/permission/list',
        method: 'get',
        params
    })
}