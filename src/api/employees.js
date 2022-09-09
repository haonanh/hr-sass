import request from '@/utils/request'

// 获取员工信息简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

// 获取员工列表接口
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

// 删除员工接口
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工接口
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
