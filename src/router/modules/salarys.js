import Layout from '@/layout'
// 员工工资路由

// export default {
//   path: '/salarys',
//   name: 'salarys', // 可以区分权限
//   component: Layout,
//   // 二级路由
//   children: [{
//     path: '', // 默认地址
//     component: () => import('@/views/salarys'),
//     meta: { title: '员工工资', icon: 'money' } // 路由的元信息，可以存储数据，title是左侧导航的读取的信息，区分路由导航
//   }]
// }
const salaryRouter = {
  path: '/salarys',
  component: Layout,
  name: 'salarys',
  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      name: 'salarys',
      meta: {
        title: '工资',
        icon: 'money'
      }
    },
    {
      path: 'setting',
      component: () => import('@/views/salarys/setting'),
      name: 'salarysSetting',
      hidden: true,
      meta: {
        title: '设置'
      }
    },
    {
      path: 'details/:yearMonth/:id',
      component: () => import('@/views/salarys/detail'),
      name: 'salarysDetails',
      hidden: true,
      meta: {
        title: '详情'
      }
    },
    {
      path: 'historicalArchiving',
      component: () => import('@/views/salarys/historical'),
      name: 'salarysHistorical',
      hidden: true,
      meta: {
        title: '历史归档'
      }
    },
    {
      path: 'monthStatement',
      component: () => import('@/views/salarys/month'),
      name: 'salarysMonthStatement',
      hidden: true,
      meta: {
        title: '月报表'
      }
    }
  ]
}
export default salaryRouter
