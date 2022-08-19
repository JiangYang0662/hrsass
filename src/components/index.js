// 负责调用所有的公共组件的全局注册 src/components
import PageTools from './PageTools' // 某些页面顶部的工具栏--子组件
import UploadExcel from './UploadExcel' // 员工设置页面的上传excel文件--子组件
import ImageUpload from './ImageUpload' // 员工设置页面的上传图片--子组件
import Print from 'vue-print-nb' // 打印
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
  }
}
