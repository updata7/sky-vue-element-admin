import request from '@/utils/request'

export function goodsProductCheck(data) {
    return request({
        url: '/goodsProduct/check',
        method: 'post',
        data
    })
}

export function goodsProductDelete(data) {
    return request({
        url: '/goodsProduct/delete',
        method: 'put',
        data
    })
}

export function goodsProductUpdate(data) {
    return request({
        url: '/goodsProduct/update',
        method: 'post',
        data
    })
}
