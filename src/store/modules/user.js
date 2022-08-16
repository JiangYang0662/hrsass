// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  // token: null
  token: getToken()
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token
    setToken(token) // 若数据token发生变化可以同步数据(vuex和缓存的数据)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  }
}
// 执行异步
const actions = {
  // 第一个login是自定义方法，第二个login是调用api/user.js里的login()
  async login(context, data) {
    // 调用api接口--返回的数据自带一层data包裹
    const result = await login(data)
    // if (result.data.success) {
    //   context.commit('setToken', result.data.data)
    // }
    // 通过响应拦截器，返回的数据已经是{data}的形式了
    context.commit('setToken', result)
    // 当拿到token说明登录成功
    setTimeStamp() // 设置时间戳
  },

  // 第二种写法
  // login(context, data) {
  //   return new Promise(function(resolve){
  //     login(data).then(result => {
  //       if(result.data.success) {
  //         context.commit('setToken', result.data.data)
  //         resolve() // 表示执行成功了
  //       }
  //     })
  //   })
  // }

  // 登出
  lgout({ commit }) {
    commit('removeToken')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
