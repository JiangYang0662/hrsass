import store from '@/store'

// 做一个的混入对象 -- 然后再main.js中全局引入
export default {
  methods: {
    // 检查权限
    checkPermission(key) {
      const { userInfo } = store.state.user // 得到store模块下user里的userInfo
      console.log(userInfo, '检查权限')
      if (userInfo && userInfo.roles && userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
