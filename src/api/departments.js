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

// 新增部门接口
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门详情接口
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

// 修改部门详情接口
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
