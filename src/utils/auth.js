import Cookies from 'js-cookie'

const TokenKey = 'hr-sass-token'
const timestamp = 'hr-sass-timestamp' // 设置保存时间戳的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 保存时间戳
export function setTimestamp() {
  Cookies.set(timestamp, Date.now())
}
// 获取时间戳
export function getTimestamp() {
  return Cookies.get(timestamp)
}
