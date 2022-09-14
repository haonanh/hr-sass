// 多语言实例化
import Vue from 'vue'
import Cookies from 'js-cookie'
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入中文语言包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入英文语言包
import customEN from './en' // 引入英文自定义语言包
import customZH from './zh' // 引入中文自定义语言包
import VueI18n from 'vue-i18n' // 引入VueI18n
Vue.use(VueI18n) // 全局注册VueI18n
export default new VueI18n({
  // 通过短路运算  不能从Cookies获取到语言包类型就默认为zh
  locale: Cookies.get('locale') || 'zh', // locale属性为随意定义的字符串，表示当前语言包的类型  中文/zh   英文/en  日文/ja 等等
  messages: {
    zh: {
      // 可以设置为 element语言包+自定义语言包
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }
  }
})

