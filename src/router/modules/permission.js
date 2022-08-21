import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions', // 可以区分权限
  component: Layout,
  // 二级路由
  children: [{
    path: '', // 默认地址
    component: () => import('@/views/permission'),
    name: 'permissions',
    meta: { title: '权限设置', icon: 'lock' } // 路由的元信息，可以存储数据，title是左侧导航的读取的信息，区分路由导航
  }]
}
