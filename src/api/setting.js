import request from '@/utils/request'

// 角色管理-获取角色列表接口
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

// 企业信息-根据企业ID获取企业信息接口
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'get'
  })
}

// 删除对应角色接口
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 获取角色详情接口
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

// 修改角色详情接口
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 新增角色接口
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
