import axios from 'axios'
// 创建一个axios实例
const service = axios.create()
// axios请求拦截器
service.interceptors.request.use()
// axios响应拦截器
service.interceptors0.response.use()
export default service // 导出axios实例
