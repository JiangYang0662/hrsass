<!-- 树形菜单组件 -->
<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <!-- 下拉操作 -->
        <el-col>
          <!-- 不写trigger默认鼠标悬停触发下拉菜单，通过具名插槽来显示下拉菜单 -->
          <!-- :hide-on-click="false" 为鼠标点击后，下拉菜单依旧存在 -->
          <!-- 下拉菜单指令事件：点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 添加按钮点击权限 -->
              <el-dropdown-item command="add" :disable="!checkPermission('Add-Departments')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit" :disable="!checkPermission('POINT-USER-UPDATE')">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    // 判断是否添加多个下拉菜单
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(command) {
      if (command === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'edit') {
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('确定要删除该部门吗?').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 执行成功进入此处，前端页面更新--通知父组件
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功!')
        })
      }
    }
  }
}
</script>

<style>

</style>
