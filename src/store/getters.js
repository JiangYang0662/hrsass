const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立快捷访问store/modules/user.js中的token值
  name: state => state.user.userInfo.username, // 建立用户名称的快捷访问(映射)
  userId: state => state.user.userInfo.userId, // 建立用户id的快捷访问(映射)
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  companyId: state => state.user.userInfo.companyId
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
}
export default getters
