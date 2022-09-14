import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/lang'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import PageTools from '@/components' // 将公共组件导入到入口文件内，使用Vue.use注册
import * as directives from '@/directives' // 将directives文件内所有的导出都导入，并保存在directives对象内 （directives名字可以随便写，不是固定的）

import checkPermission from '@/mixin/checkPermission' // 引入检查权限点方法的对象
Vue.mixin(checkPermission) // 全局混入检查对象 表示所有的组件都拥有了检查权限点的方法,可以随意使用

import Print from 'vue-print-nb'
Vue.use(Print)
// import * as filters from './filters'
console.log(directives)
// Object对象的静态方法  Object.keys() 返回对象内所有属性名的一个数组
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) // 通过forEach，给所有的自定义指令注册
})

// filters是一个包含所有过滤器方法的对象  （过滤器已弃用）
// 通过forEach遍历所有方法，将所有过滤器方法统统全局注册
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })

Vue.use(ElementUI,
  // element 本身支持i18n的处理
  // i18n会根据当前的locale属性，去配置对应的语言包  locale属性为zh 就是中文包  为en  就是英文包
  { i18n: (key, value) => i18n.t(key) }) // i18n.t()方法，是i18n自带的，会去对应的语言包找对应的内容  (这里是配置ElementUI的各个组件中的语言)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(PageTools)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
