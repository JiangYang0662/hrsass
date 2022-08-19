<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="8">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { assignRoles, getRoleList } from '@/api/setting' // 获取角色数据的接口
import { getUserDetailById } from '@/api/user'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    //   required: true
    }
  },
  data() {
    return {
      list: [],
      roleIds: [] // 存储当前员工所拥有的权限角色的id值
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 1. 获取所有的角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    // 2. 获取当前用户的拥有的角色
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    // 3. 提交角色修改
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
      //   this.$parent.showRoleDialog = false
      this.$message.success('分配角色成功')
    },
    // 4. 求取消
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
