// 员工信息的接口文档
import request from '@/utils/request'

// 1. 获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
// 2. 获取员工的综合数据列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
// 3. 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
// 4. 新增员工
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
// 5. 批量导入员工数据--参数data是数组
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
// 6. 根据id查看员工的详情 -- 在src/api/user.js中
// 7. 保存员工的更新信息
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
// 8. 读取用户详情的基础信息+更新用户的基础信息
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
// 9. 读取用户的岗位信息+更新用户的岗位信息
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
