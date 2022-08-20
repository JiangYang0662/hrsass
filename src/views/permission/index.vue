<template>
  <div class="dashboard-container">
    <div class="app-container">
      <template>
        <!-- 靠右的按钮 -->
        <page-tools>
          <template v-slot:after>
            <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
          </template>
        </page-tools>
        <!-- 表格 -->
        <el-table border :data="list" row-key="id">
          <el-table-column align="center" label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template slot-scope="{row}">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
              <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 弹层 -->
    <el-dialog :title="`${showText}权限`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 配置开关激活的值，1为激活，0为未激活 -->
          <!-- active-value: switch打开时的值，Boolean，string，number -->
          <!-- inactive-value: switch关闭时的值，Boolean，string，number -->
          <el-switch
            v-model="formData.enVisible"
            inactive-value="0"
            active-value="1"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permissison'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 1. 获取权限列表
    async getPermissionList() {
      // this.list = await getPermissionList()
      // console.log(this.list)
      // const arr = tranListToTreeData(this.list, '0')
      // console.log(arr)
      this.list = tranListToTreeData(await getPermissionList(), '0')
      console.log(this.list)
    },
    // 2. 根据id获取权限的具体形式
    // 3. 删除权限
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该权限吗?')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除权限操作成功!')
      } catch (error) {
        this.$message.success('取消删除权限操作!')
        console.log(error)
      }
    },
    // 4. 添加权限/添加--根据type的值不同来区分添加访问权(添加权限)和添加按钮的操作权(添加)
    // pid 判断是否是添加权限、添加按钮、编辑按钮
    addPermission(pid, type) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 5. btnOK
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.getPermissionList()
        this.showDialog = false
        this.$message.success(`${this.showText}成功`)
      })
    },
    // 6. 取消按钮
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 移除校验，关闭弹层
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 7.编辑权限
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
