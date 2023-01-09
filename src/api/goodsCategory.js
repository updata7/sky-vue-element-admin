import request from '@/utils/request'

export function goodsCategoryList(params = {}) {
    return request({
        url: '/goodsCategory/list',
        method: 'get',
        params
    })
}

export function goodsCategoryAdd(data = {}) {
    return request({
        url: '/goodsCategory/create',
        method: 'post',
        data
    })
}

export function goodsCategoryUpdate(data = {}) {
    return request({
        url: '/goodsCategory/update',
        method: 'post',
        data
    })
}

export function goodsCategoryDelete(data = {}) {
    return request({
        url: `/goodsCategory/delete`,
        method: 'put',
        data
    })
}