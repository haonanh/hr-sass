import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimestamp } from './auth'
const TimeOut = 3600 // 定义token的有效期
// 创建一个axios实例
const service = axios.create({
  // npm run dev ==> .env.development ==> VUE_APP_BASE_API = '/api'  开发环境
  // npm run build ==> .env.production ==> VUE_APP_BASE_API = '/prod-api'  生产环境
  baseURL: process.env.VUE_APP_BASE_API, // axios的基础地址
  timeout: 5000 // 超时时间
})
// axios请求拦截器
service.interceptors.request.use(config => {
  console.log(config)
  if (store.getters.token) { // 如果token存在，那么统一在请求头内携带Authorization参数
    // 检查token是否过期
    if (CheckTimestamp()) {
      store.dispatch('user/logout') // 登出操作
      router.push('/login')
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error) // 直接进入catch内
})
// axios响应拦截器
service.interceptors.response.use(response => {
  // axios返回的数据默认加一层data 所以response.data
  const { success, data, message } = response.data // 解构返回的数据
  if (success) { // 如果状态为true ，直接返回data数据
    return data
  } else { // 如果状态为false
    Message.error(message) // 提示错误信息（后台返回的错误信息）  并且已经发现了错误，不需要在执行后面的.then。跳出当前执行链，直接进入catch
    return Promise.reject(new Error(message)) // 由于没有error对象，new一个Error对象，并且赋入错误信息
  }
}, error => {
  // token过期的被动处理，根据后台返回的状态码和信息来处理
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/login') // 登出操作
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误 （响应异常后，error对象内message信息）
  }
  return Promise.reject(error) // 直接进入catch内
})

// 检查时间戳是否过期
function CheckTimestamp() {
  const currentTime = Date.now()
  const timestamp = getTimestamp()
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service // 导出axios实例
