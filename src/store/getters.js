const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // token的快捷获取
  name: state => state.user.userInfo.username, // 用户名字的快捷获取
  id: state => state.user.userInfo.userId, // 用户id的快捷获取
  staffPhoto: state => state.user.userInfo.staffPhoto, // 用户头像的快捷获取
  companyId: state => state.user.userInfo.companyId, // 企业id的快捷获取
  routes: state => state.permission.routes // 当前路由规则的快捷获取
}
export default getters
