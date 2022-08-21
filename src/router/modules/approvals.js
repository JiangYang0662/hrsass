import Layout from '@/layout'
// 审批管理路由
export default {
  path: '/approvals',
  name: 'approvals', // 可以区分权限
  component: Layout,
  // 二级路由
  children: [{
    path: '', // 默认地址
    component: () => import('@/views/approvals'),
    name: 'approvals',
    meta: { title: '审批管理', icon: 'tree-table' } // 路由的元信息，可以存储数据，title是左侧导航的读取的信息，区分路由导航
  }, {
    path: 'leaveApproval/:id',
    component: () => import('@/views/approvals/leave'),
    name: 'leaveApproval',
    hidden: true, // 不在左侧菜单栏中显示
    meta: {
      title: '申请请假',
      icon: 'approval', noCache: true }
  }, {
    path: 'quitApproval/:id',
    component: () => import('@/views/approvals/quit'),
    name: 'quitApproval',
    hidden: true,
    meta: {
      title: '申请离职',
      icon: 'approval', noCache: true }
  }, {
    path: 'overtimeApproval/:id',
    component: () => import('@/views/approvals/overtime'),
    name: 'overtimeApproval',
    hidden: true,
    meta: {
      title: '加班申请',
      icon: 'approval', noCache: true }
  }, {
    path: 'securitySetting',
    component: () => import('@/views/approvals/security'),
    name: 'securitySetting',
    hidden: true,
    meta: {
      title: '设置',
      icon: 'approval', noCache: true }
  }]
}
