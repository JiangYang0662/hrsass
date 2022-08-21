import Layout from '@/layout'
// 考勤管理路由

// export default {
//   path: '/attendances',
//   name: 'attendances', // 可以区分权限
//   component: Layout,
//   // 二级路由
//   children: [{
//     path: '', // 默认地址
//     component: () => import('@/views/attendances'),
//     // 路由的元信息，可以存储数据，title是左侧导航的读取的信息，区分路由导航
//     meta: { title: '考勤管理', icon: 'skill' }
//   }, {
//     path: 'archiving',
//     component: () => import('@/views/attendances/historical'),
//     name: 'archiving',
//     hidden: true,
//     meta: {
//       title: '归档'
//     }
//   }, {
//     path: 'report/:month',
//     component: () => import('@/views/attendances/report'),
//     name: 'reports',
//     hidden: true,
//     meta: {
//       title: '报表'
//     }
//   }]
// }

const attendRouter = {
  path: '/attendances',
  component: Layout,
  name: 'attendances',
  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      name: 'attendances',
      meta: {
        title: '考勤',
        icon: 'excel' }
    },
    {
      path: 'archiving',
      component: () => import('@/views/attendances/historical'),
      name: 'archiving',
      hidden: true,
      meta: {
        title: '归档'
      }
    },
    {
      path: 'report/:month',
      component: () => import('@/views/attendances/report'),
      name: 'reports',
      hidden: true,
      meta: {
        title: '报表'
      }
    }
  ]
}
export default attendRouter
