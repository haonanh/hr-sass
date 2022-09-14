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
        // async修饰的函数，是一个异步函数，需要通过await来获取返回的值
        // 并且actions内的函数默认是Promise对象  调用这个对象 想要获取返回的值话 必须 加 await或者是then
        const { roles } = await store.dispatch('user/getUserInfo') // await是为了同步执行代码，获取完数据并保存在vuex内后，在放行
        // 当获取完用户信息后，根据menus数组筛选出用户对应的动态路由并加到路由表内
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)

        // 将404的路由规则放在动态路由规则的最后面，这样才能保证404路由页面在整个路由规则的最后
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // router.addRoutes()方法，将动态路由添加到路由表中。  这种方法是将想要的路由添加到现有路由表中
        // 此处必须用next(to.path)不能直接使用next()  这是一个已知的缺陷
        // next(to.path)相当于多跳转一次 原因：直接使用next()会报错，因为此时新添加的路由还没铺到路由表内，需要使用next(to.path)多跳转一次，跳转前路由才会铺设好
        next(to.path)
      } else {
        next()
      }
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
