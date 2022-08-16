const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token // 建立快捷访问store/modules/user.js中的token值
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
}
export default getters
