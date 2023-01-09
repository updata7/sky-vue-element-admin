import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: '/role/search',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/role/update`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/role/delete`,
    method: 'put',
    data
  })
}
