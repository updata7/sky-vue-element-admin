import request from '@/utils/request'

export function getLists(params) {
    return request({
        url: '/advertisement/list',
        method: 'get',
        params
    })
}

export function addOne(data) {
    return request({
        url: '/advertisement/create',
        method: 'post',
        data
    })
}

export function updateData(data) {
    return request({
        url: `/advertisement/update`,
        method: 'post',
        data
    })
}

export function deleteData(data) {
    return request({
        url: `/advertisement/delete`,
        method: 'put',
        data
    })
}
