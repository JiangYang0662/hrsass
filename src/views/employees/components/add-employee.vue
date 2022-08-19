<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          accordion
          :props="{ children: 'children',label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 在data中定义数据
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 1. 获取部门
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      console.log(depts)
      // 把部门的列表数据转换为树形结构数据
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 2. 选择部门节点
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 3. 提交数据
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData)
        // this.$emit('getgetEmployeeList')
        this.$parent.getEmployeeList() // 子组件调用父组件的函数
        this.$parent.showDialog = false
        this.$message.success('添加员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 4. 取消提交
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
