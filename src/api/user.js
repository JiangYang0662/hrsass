import request from '@/utils/request'

// 登录接口
export function login(data) {
// 通过return返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

// 获取用户信息的接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据id获取用户的基本信息--显示头像信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
export function logout() {

}
