<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色管理 start-->
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 表格数据 -->
            <el-table border="" :data="list">
              <el-table-column label="序号" align="center" type="index" width="80" />
              <el-table-column label="角色名称" align="center" prop="name" width="180" />
              <el-table-column label="描述" align="center" prop="description" />
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分业务组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                layout="prev, pager, next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 角色管理 end-->

          <!-- 公司信息 start-->
          <el-tab-pane label="公司信息">
            <!-- 提示信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 公司信息表 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司备注">
                <el-input v-model="formData.remarks" disabled style="width:400px" type="textarea" :rows="3" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 公司信息 end-->
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click.native="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配角色权限弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'

import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permissison'
export default {
  data() {
    return {
      list: [], // j接收角色数组
      // 分页数据
      page: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      formData: {}, // 公司信息
      showDialog: false, // 编辑角色弹层的显示/隐藏
      roleForm: {}, // 单个角色详情
      // 校验规则
      rules: { name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }] },
      showPermDialog: false, // 分配权限弹层的显隐
      defaultProps: { label: 'name', children: 'children' }, // 显示树形组件的名称
      permData: [], // 树形数据--权限数据
      selectCheck: [], // 接收已被选择权限的id
      roleId: null // 角色id
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    showTitle() {
      return this.roleForm.id ? '编辑角色弹框' : '新增角色弹框'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 1. 获取角色数据
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      // console.log(await getRoleList(this.page))
      this.page.total = total
      this.list = rows
    },
    // 2. 监听分页组件
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    // 3. 获取公司信息
    async getCompanyInfo() {
      // console.log(await getCompanyInfo(this.companyId))
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 4. 根据id删除角色
    async deleteRole(id) {
      console.log(this.list)
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id) // 调用删除接口
        if (this.list.length === 1) {
          this.page.page = this.page.page === 1 ? 1 : this.page.page - 1
          this.getRoleList() // 重新加载角色数据
        } else {
          this.getRoleList() // 重新加载角色数据
        }
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 5. 编辑角色
    async editRole(id) {
      // console.log(await getRoleDetail(id))
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 6. 提交新角色--新增角色/编辑角色
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑角色提交
          await updateRole(this.roleForm)
        } else {
          // alert('新增角色')
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 7. 取消/关闭弹窗
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 9. 根据id获取该角色的权限值
    async assignPermission(id) {
      // 先获取所有的权限数据--树形转化--显示
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      // 获取具体id角色的权限值
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    // 10. 提交分配权限按钮 --getCheckedKeys()获取树形结构被选择的节点
    async btnPermOK() {
      const arr = this.$refs.permTree.getCheckedKeys()
      await assignPerm({ id: this.roleId, permIds: arr })
      this.$message.success('分配权限成功!')
      this.showPermDialog = false
    },
    // 11. 取消按钮
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>
