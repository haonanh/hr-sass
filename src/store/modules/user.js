import { setToken, getToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// vuex管理token，实现token的持久化
// vuex内token的值与本地存储同步更新
const state = {
  token: getToken() // 初始化vuex时，从本地缓存获取token
}
const mutations = {
  setToken(state, token) {
    state.token = token // token发生变化时，修改state内token的值
    setToken(token) // 同步将token本地储存
  },
  removeToken(state) {
    state.token = null // 删除vuex的token值
    removeToken() // 同步移除本次储存内的token，实现vuex和本地缓存同步
  }
}
const actions = {
  // 定义一个方法为login(){} 方法接收context默认参数和传入的data参数
  async login(context, data) {
    // 调用接口请求，传入请求体内需要的参数
    const result = await login(data)
    // if (result.data.success) // 不需要在判断是否成功，在响应拦截器内已经做了处理
    context.commit('setToken', result) // 就调用mutations内的方法来修改state内的token值并且缓存到本地
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

