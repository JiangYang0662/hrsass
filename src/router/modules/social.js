import Layout from '@/layout'
// 社保管理路由

export default {
  path: '/social',
  name: 'social_securitys', // 可以区分权限
  component: Layout,
  // 二级路由
  children: [{
    path: '', // 默认地址
    component: () => import('@/views/social'),
    name: 'social_securitys',
    meta: { title: '社保管理', icon: 'table' } // 路由的元信息，可以存储数据，title是左侧导航的读取的信息，区分路由导航
  }, {
    // 报表
    path: 'detail/:id',
    hidden: true,
    component: () => import('@/views/social/detail'),
    name: 'socialDetail',
    meta: {
      title: '社保'
    }
  },
  {
    // 历史归档
    path: 'historicalArchiving',
    hidden: true,
    component: () => import('@/views/social/historical'),
    name: 'socialHistorical',
    meta: {
      title: '历史归档'
    }
  },
  {
    // 月报表
    path: 'monthStatement',
    component: () => import('@/views/social/month'),
    name: 'socialMonthStatement',
    hidden: true,
    meta: {
      title: '当月报表'
    }
  }]
}
