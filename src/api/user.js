import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function userAdd(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function userDelete(data) {
  return request({
    url: `/user/delete`,
    method: 'put',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}

export function getRoutes(params) {
  return request({
    url: '/user/routes',
    method: 'get',
    params
  })
}

export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function userUpdate(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
