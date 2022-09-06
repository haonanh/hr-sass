// 权限拦截 通过路由跳转中的导航守卫
import router from '@/router' // router相当于组件内this.$router
import store from '@/store' // store相当于组件内this.$store
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
// 全局前置守卫
// 参数是一个回调函数
// 回调函数内有三个参数为 to ，from ， next
// next 是导航守卫内必须执行的钩子。如果不调用默认为next（false）不跳转留在原地
// next（）放行
// next（false）不跳转
// next（地址）跳转到指定地址
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login') { // 有token 去往路径为登录页 则直接跳转到首页
      next('/')
    } else { // 有token 去往路径不为登录页 则直接跳转对应路径
      if (!store.getters.id) { // 当vuex内用户基本信息没有时，通过actions方法调用接口获取数据
        await store.dispatch('user/getUserInfo') // await是为了同步执行代码，获取完数据并保存在vuex内后，在放行
      }
      next()
    }
  } else { // 无token值
    // whiteList.some(item=>item===to.path)
    if (whiteList.indexOf(to.path) > -1) { // 无token 但是跳转路径在白名单内 则直接跳转到对应路径
      next()
    } else { // 无token 跳转路径不在白名单内 则直接跳转到登录页
      next('/login')
    }
  }
  nProgress.done() // 主动关闭进度条一次，防止手动修改路径跳转。不会进入后置守卫关闭进度条
})
// 全局后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
