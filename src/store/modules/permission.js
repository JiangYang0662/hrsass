// vuex的权限路由
import { asyncRoutes, constantRoutes } from '@/router' // 导入静态路由

// 在state中储存一个路由表routes，存储静态路由数据
const state = { routes: constantRoutes }
const mutations = {
  // 存储路由函数--登录后获取动态路由权限--加上静态路由的权限就是当前用户能操作的页面
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
    console.log('setRoutes')
  }
}
const actions = {
  // 筛选路由
  // 参数2:user模块store里的userInfo-roles-menus--路由权限
  filterRoutes(context, menus) {
    console.log('调用了store-modules-permission的筛选路由方法')
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes)
    console.log(routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
