import Layout from '@/layout'

export default {
  path: '/settings',
  name: 'settings', // 可以区分权限
  component: Layout,
  // 二级路由
  children: [{
    path: '', // 默认地址
    component: () => import('@/views/setting'),
    name: 'settings',
    meta: { title: '公司设置', icon: 'setting' } // 路由的元信息，可以存储数据，title是左侧导航的读取的信息，区分路由导航
  }]
}
