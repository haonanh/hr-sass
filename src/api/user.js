import request from '@/utils/request'

// 封装单独的登录接口
export function login(data) {
  // return 一个promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export function getInfo(token) {

}

export function logout() {

}
