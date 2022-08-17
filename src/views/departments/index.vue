<template>
  <div class="dashboard-container">
    <div v-loading="loading" class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card1">
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col>
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <!-- 下拉操作 -->
              <el-col>
                <!-- 不写trigger默认鼠标悬停触发下拉菜单，通过具名插槽来显示下拉菜单 -->
                <!-- :hide-on-click="false" 为鼠标点击后，下拉菜单依旧存在 -->
                <el-dropdown trigger="click">
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <!-- 树形结构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all="true"
        >
          <el-row
            slot-scope="{data}"
            type="flex"
            justify="space-between"
            align="middle"
            style="height: 40px;  width: 100%"
          >
            <el-col>
              <span>{{ data.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <el-col>{{ data.manager }}</el-col>
                <el-col>
                  <el-dropdown>
                    <span>操作<i class="el-icon-arrow-down" /></span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                      <el-dropdown-item>编辑部门</el-dropdown-item>
                      <el-dropdown-item>删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tree>
      </el-card>

      <!-- 组织架构--采用组件 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <TreeTools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>

    <!-- 弹层 -->
    <!-- ref可以获取dom实例，即子组件的this -->
    <!-- .async修饰符，可以省略父组件的监听和方法，直接将赋值传给props数据 子组件采用update:props名称 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />

  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index' // 导入列表转树形数据方法
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      // departs: [{ name: '一年级', manager: '张三', children: [{ name: '1班', manager: '张三' }, { name: '2班', manager: '张三' }, { name: '3班', manager: '张三' }] },
      //   { name: '二年级', manager: '李四' },
      //   { name: '三年级', manager: '王五' }],
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
      company: {},
      showDialog: false, // 新增子部门的弹层
      node: null, // 记录当前点击新增部门的根节点
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 1. 获取组织架构数据
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      console.log(result)
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // this.departs = result.depts
      // 没有树形结构需转换
      // result.depts是列表型数据，''是id为空的根节点
      this.departs = tranListToTreeData(result.depts, '')
      this.loading = false
    },

    // 2. 新增子部门弹层
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },

    // 3. 编辑子部门
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 父组件调用子组件的方法
      // 避免props传值的异步导致获取数据不及时
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
.tree-card1 {
  padding: 30px  140px;
  font-size:14px;
  display: none;
}
</style>
