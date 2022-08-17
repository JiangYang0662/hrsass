// 员工信息的接口文档
import request from '@/utils/request'

// 1. 获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
