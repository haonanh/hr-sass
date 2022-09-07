import request from '@/utils/request'

// 获取组织架构-部门列表接口
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

// 删除部门接口
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
