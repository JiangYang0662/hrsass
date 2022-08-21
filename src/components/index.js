// 负责调用所有的公共组件的全局注册 src/components
import PageTools from './PageTools' // 某些页面顶部的工具栏--子组件
import UploadExcel from './UploadExcel' // 员工设置页面的上传excel文件--子组件
import ImageUpload from './ImageUpload' // 员工设置页面的上传图片--子组件
import Print from 'vue-print-nb' // 打印
import ScreenFull from './ScreenFull' // 全屏
import ThemePicker from '../ThemePicker' // 自定义颜色
import LangSelect from './language/index.vue' // 语言包
import TagsView from './TagsView' // tab页面的视图标签
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('LangSelect', LangSelect)
    Vue.component('TagsView', TagsView)
  }
}
