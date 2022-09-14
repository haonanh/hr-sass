import { setToken, getToken, removeToken, setTimestamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// vuex管理token，实现token的持久化
// vuex内token的值与本地存储同步更新
const state = {
  token: getToken(), // 初始化vuex时，从本地缓存获取token
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token // token发生变化时，修改state内token的值
    setToken(token) // 同步将token本地储存
  },
  removeToken(state) {
    state.token = null // 删除vuex的token值
    removeToken() // 同步移除本次储存内的token，实现vuex和本地缓存同步
  },
  // 设置用户信息的方法
  setUserInfo(state, result) {
    state.userInfo = result // 这是响应式
    // state.userInfo = { ...result } 浅拷贝的方式，这也是响应式
  },
  // 删除用户信息的方法
  removeUserInfo() {
    state.userInfo = {}
  }
}
const actions = {
  // 定义一个方法为login(){} 方法接收context默认参数和传入的data参数
  async login(context, data) {
    // 调用接口请求，传入请求体内需要的参数
    const result = await login(data)
    // if (result.data.success) // 不需要在判断是否成功，在响应拦截器内已经做了处理
    context.commit('setToken', result) // 就调用mutations内的方法来修改state内的token值并且缓存到本地
    // 登录成功后才获取了token，此时存入获取token时的时间戳
    setTimestamp()
  },
  // 定义一个方法为getUserInfo
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取用户基本信息
    const baseInfo = await getUserDetailById(result.userId) // 获取员工基本资料（包含头像等更多信息）
    // 将用户基本信息和员工资料合并保存到state内userInfo内   展开运算符重复的属性后面会重叠前面的
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 将用户基本信息设置到state内的userInfo
    return result // 后期需要使用  里面的menus
  },
  // 退出登录的方法
  logout(context) {
    context.commit('removeToken') // 清除state内token的值并且清除本地缓存
    context.commit('removeUserInfo') // 清除state内保存的用户个人信息
    resetRouter() // 重置路由规则为初始化状态，即只有静态路由规则
    // 退出登录后，还需要将vuex中permission模块内的routes变量初始化，因为虽然看不到菜单栏了，但是如果不初始化，菜单栏还是显示那些内容
    // 1.当模块之间没有加命名空间时，各个模块之间的mutations和actions可以随意访问，因为都挂载在全局上
    // 2.当模块之间有命名空间时，就需要第三个参数 {root:true} 表示调用根级的mutations或者actions
    context.commit('permission/setRoutes', [], { root: true }) // 第一个参数为对应模块下的mutations方法名  第二个参数为传入的值  第三个参数即调用根级的mutations或actions
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

