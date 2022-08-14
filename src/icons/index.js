import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/) // 在该文件的上级读取.svg文件里所有的.svg后缀名的文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req) // 把所有读取到.svg后缀名的文件引入到项目中
