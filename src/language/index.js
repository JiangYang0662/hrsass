//  多语言的实例化文件

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementEn from 'element-ui/lib/locale/lang/en' // 引入英文包
import elementZh from 'element-ui/lib/locale/lang/zh-CN' // 引入中文包
import elementJa from 'element-ui/lib/locale/lang/ja' // 日语
import customZH from './zh'
import customEn from './en'

Vue.use(VueI18n)
export default new VueI18n({
  // locale:指的是当前语言的类型，local随意定义
  locale: Cookie.get('language') || 'zh', // 从cookie中获取语言的类型，取不到采用中文
  // messages：指的是单前的语言包
  messages: {
    zh: { ...elementZh, ...customZH },
    en: { ...elementEn, ...customEn },
    ja: { ...elementJa }
  }
})
