// 公司设置-角色-公司信息的接口文档
import request from '@/utils/request'

// 1. 获取公司角色列表数据
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 2. 获取公司信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 3. 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 4. 获取角色数据
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 5. 修改角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 6. 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 7. 给用户分配角色
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}

