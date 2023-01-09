import request from '@/utils/request'

export function goodsList(params = {}) {
    return request({
        url: '/goods/list',
        method: 'get',
        params
    })
}

export function goodsAdd(data = {}) {
    return request({
        url: '/goods/create',
        method: 'post',
        data
    })
}

export function goodsUpdate(data = {}) {
    return request({
        url: '/goods/update',
        method: 'post',
        data
    })
}

export function goodsDelete(data = {}) {
    return request({
        url: `/goods/delete`,
        method: 'put',
        data
    })
}
