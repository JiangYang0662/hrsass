<!-- 员工管理--查看员工详情页面组件 -->

<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 第一个面板：登录账号设置 -->
          <el-tab-pane label="登录账户设置">
            <el-form
              ref="userForm"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
              :model="userInfo"
              :rules="rules"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 第二个面板：个人详情 -->
          <el-tab-pane label="个人详情">
            <!-- 打印图标 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info /> -->
            <!-- 使用新方法引入组件：vuejs中内置了一个component组件，可以是任意一个组件 -->
            <component :is="UserComponent" />
          </el-tab-pane>

          <!-- 第三个面板：岗位信息 -->
          <el-tab-pane label="岗位信息">
            <!-- 打印图标 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent" />
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user' //  根据id查看员工的详情
import { saveUserDetailById } from '@/api/employees' // 保存员工的更新信息
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'

export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserComponent: 'UserInfo',
      JobComponent: 'JobInfo',
      userId: this.$route.params.id, // 通过路由传递员工id
      // 因为后端返回的密码是加密的，所以在页面显示的密码不是真正的密码
      // 需要用一个中间值来临时存储密码
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 1. 根据id获取员工信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    //   console.log(this.userInfo)
    },
    // 2. 保存员工更新数据--用户名-密码
    async saveUser() {
      try {
        await this.$refs.userForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存登录设置成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
