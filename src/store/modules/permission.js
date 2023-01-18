import { asyncRoutes, constantRoutes } from '@/router'
import { isInArray } from '@/utils'
import { getRoutes } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function _checkPermission(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i]
    }
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param permissions
 */
export function filterAsyncRoutes(routes, permissions, isChild) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    let p
    if (isChild) {
      p = isInArray(permissions, tmp.path)
    } else {
      p = _checkPermission(permissions, 'menu', tmp.path)
    }
    if (p) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, p.permissions, true)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function _dealRoutes(routers) {
  routers.map(router => {
    if (router.component === 'Layout') {
      router.component = Layout
    } else {
      router.component = () => import('@/views/' + router.component)
    }
    if (router.children && router.children.length > 0) {
      _dealRoutes(router.children)
    }
  })
}

const actions = {
  getRoutes({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRoutes({}).then(response => {
        const { data } = response

        console.debug('user routes ==>>>', data)
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        _dealRoutes(data.records)
        data.records = asyncRoutes  // 写新功能或测试的时候，去掉这里的注释
        commit('SET_ROUTES', data.records)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  generateRoutes({ commit }, params) {
    const { role, permissions } = params
    console.debug('generateRoutes ==> ', role, permissions)
    return new Promise(resolve => {
      let accessedRoutes
      if (role === 'admin') {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      }

      console.debug('generateRoutes accessedRoutes ==> ', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
