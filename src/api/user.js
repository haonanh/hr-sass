import request from '@/utils/request'

// 封装单独的登录接口
export function login(data) {
  // return 一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户基本资料接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取员工基本信息接口（为了获取用户头像）
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
export function logout() {

}
