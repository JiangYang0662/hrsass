<!-- excel导入员工的页面 -->

<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  data() {
    return {
      // type: this.$router.query.type // 用来判断是否导入员工
    }
  },
  methods: {
    // 1. 完成excel文件中文表头header转为英文状态--添加新员工信息
    async success({ header, results }) {
      // header中的数据是中文需要转换为英文格式
      // 建立中英对译
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // console.log(header)
      // console.log(results)
      const arr = []
      results.forEach(item => {
        const userInfo = {} // 存储excel的数据--对象
        Object.keys(item).forEach(key => {
          // Object遍历的key是中文
          // 通过userRelations[key]就能转换为英文状态
          // userInfo[mobile] = item[手机号] = mobile
          // 转化日期格式--后端接口要求不能是字符串，需要new Date()方法
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        // console.log(userInfo)
        arr.push(userInfo)
      })
      // 另一种遍历方法 map(有返回值),forEach(没有返回值),需要自己new一个数组在push返回值
      // var newArr = results.map(item => {
      //   var userInfo = {}
      //   Object.key(item).forEach(key => {
      //     userInfo[userRelations[key]] = item[key]
      //   })
      //   return userInfo
      // })
      // console.log(arr)
      await importEmployee(arr)
      this.$message.success('导入excel员工表成功')
      this.$router.back()
    },

    // 2. 解决excel表格日期格式1997-10-01格式转化为其他数据
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }
}
</script>

<style>

</style>
