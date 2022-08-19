<!--员工管理的页面-->

<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 全局注册的组件--顶部工具栏组件pageTools -->
      <page-tools :show-before="true">
        <!-- 具名插槽 slot="" 或者v-slot:***,但要在<template v-slot></template> -->
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="danger" @click="exportData2">导出2</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 表格数据和分页组件 -->
      <!-- sortable 可以排序 -->
      <!-- 在el-table元素中定义height属性就可以固定表头 height="50" -->
      <!-- 在el-table-column中可以使用fixed属性固定列，接收Boolean或者left,right -->
      <!-- formatter 用来格式化内容 -->
      <el-card v-loading="loading">
        <el-table border :data="list" class="table">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                align="center"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 80px; height: 80px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" label="聘用形式" sortable="" :formatter="formatEmployment" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template slot-scope="{row}">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 添加员工弹窗 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 二维码弹窗 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 导入聘用形式的枚举
import AddEmployee from './components/add-employee.vue'
import addEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: { addEmployee },
  data() {
    return {
      loading: false,
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false,
      showCodeDialog: false
    }
  },
  computed: {
    AddEmployee
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 1. 获取员工的综合数据
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 2.监听分页组件
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 3. 格式化聘用形式
    // row 是每一行的详细数据
    // column 列的属性
    // cellValue 每一行单元表格对应的值
    // index 索引？？
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 4. 根据id删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('你确定要删除该员工吗?')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 5. 导出员工的excel表格
    exportData() {
      // 表头对应关系,把数据的英文转换为excel文件的中文格式
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import ('@/vendor/Export2Excel').then(async excel => {
        // 测试导出功能
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'], // 导出数据的表头
        //   data: [['张三', 12000], ['李四', 5000]], // 导出的具体数据
        //   filename: '员工薪资表', // 文件名
        //   autoWidth: true, // 单元格是否自适应宽度
        //   bookType: 'xlsx' // 导出文件类型
        // })
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    // 6. 把数组转化为二位数组
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间格式
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 7. 导出复杂的excel表头--合并表头...
    // multiHeader 复杂表头的部分 Array [[]]  二位数组
    // merges 需要合并的部分 Array []
    exportData2() {
      // 表头对应关系,把数据的英文转换为excel文件的中文格式
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import ('@/vendor/Export2Excel').then(async excel => {
        // 测试导出功能
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'], // 导出数据的表头
        //   data: [['张三', 12000], ['李四', 5000]], // 导出的具体数据
        //   filename: '员工薪资表', // 文件名
        //   autoWidth: true, // 单元格是否自适应宽度
        //   bookType: 'xlsx' // 导出文件类型
        // })

        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 第一行的表头，会添加header作为第二行的表头
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 合并第一、第二行相同的表头
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          multiHeader,
          merges,
          filename: '员工信息表--合并表头',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    // 8. 点击头像生成二维码
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style scoped>
.el-table_2_colum_12 .cell {
  padding: 0 !important;
}
</style>
