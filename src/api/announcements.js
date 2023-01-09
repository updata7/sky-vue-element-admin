import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/announcements/list',
    method: 'get',
    params
  })
}

export function addOne(data) {
  return request({
    url: '/announcements/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: `/announcements/update`,
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: `/announcements/delete`,
    method: 'put',
    data
  })
}
