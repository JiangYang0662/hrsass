// 组织架构的接口文档
import request from '@/utils/request'

// 1. 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 2. 根据部门id删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 3. 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 4. 获取部门详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 5. 编辑部门信息-提交
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
