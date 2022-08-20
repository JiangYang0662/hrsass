import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Component from '@/components' // 全局注册组件
import * as filters from '@/filters' // 导入过滤器工具

import '@/icons' // icon
import '@/permission' // permission control 权限
import * as directive from '@/directives' // 自定义指令 * as为导入所有的自定义指令
import checkPermission from '@/mixin/checkPermission'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Component) // 注册自己的插件
// 遍历指令
Object.keys(directive).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directive[key])
})
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册自定义指令
  Vue.filter(key, filters[key])
})
// 注册全局的混入对象
Vue.mixin(checkPermission) // 所有的组件都拥有检查权限的方法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
