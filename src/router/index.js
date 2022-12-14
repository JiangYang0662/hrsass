import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 1. 引入多个模块的规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
import userRouter from './modules/user'
// 1. 动态路由
export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]

// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页页面', icon: 'dashboard' }
    }]
  },

  // excel导入路由
  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [{
      path: '', // 二级路由path什么都不写 表示二级默认路由
      component: () => import('@/views/import')
    }]
  },
  userRouter
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true } // -- 转义到新路由的最后
]

// 左侧导航栏的显示
const createRouter = () => new Router({
  // 路由模式hasg：#后面是前端访问，#后面的变化不会经过服务器
  // 路由模式history: /访问，任意的地址变化都要经过服务器
  mode: 'history', // require service support,
  // base:'/...',配置项目的一个基础地址，类似代替了#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes // 静态路由+登陆时验证用户权限调取动态路由
  // routes: [...constantRoutes, ...asyncRoutes]  临时的静态路由+动态路由
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由--登出的时候调用，把路由回归到静态路由状态
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
