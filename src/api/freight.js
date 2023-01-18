import request from '@/utils/request'

export function freightList(params = {}) {
    return request({
        url: '/freight/list',
        method: 'get',
        params
    })
}

export function freightGetOne(params = {}) {
    return request({
        url: '/freight/getOne',
        method: 'get',
        params
    })
}

export function freightAdd(data = {}) {
    return request({
        url: '/freight/create',
        method: 'post',
        data
    })
}

export function freightUpdate(data = {}) {
    return request({
        url: '/freight/update',
        method: 'post',
        data
    })
}

export function freightDelete(data = {}) {
    return request({
        url: `/freight/delete`,
        method: 'put',
        data
    })
}
