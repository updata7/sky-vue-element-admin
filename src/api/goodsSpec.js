import request from '@/utils/request'

export function goodsSpecList(params = {}) {
    return request({
        url: '/goodsSpec/list',
        method: 'get',
        params
    })
}

export function goodsSpecAdd(data = {}) {
    return request({
        url: '/goodsSpec/create',
        method: 'post',
        data
    })
}

export function goodsSpecUpdate(data = {}) {
    return request({
        url: '/goodsSpec/update',
        method: 'post',
        data
    })
}

export function goodsSpecDelete(data = {}) {
    return request({
        url: `/goodsSpec/delete`,
        method: 'put',
        data
    })
}