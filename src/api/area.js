import request from '@/utils/request'

export function getProvince(params = {}) {
  return request({
    url: '/area/province',
    method: 'get',
    params
  })
}