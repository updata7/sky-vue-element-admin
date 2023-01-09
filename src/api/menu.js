import request from '@/utils/request'

export function getMenus(data) {
  return request({
    url: '/menu/search',
    method: 'get',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function optionsMenu(data) {
  return request({
    url: '/menu/options',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: `/menu/update`,
    method: 'post',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: `/menu/delete`,
    method: 'put',
    data
  })
}
