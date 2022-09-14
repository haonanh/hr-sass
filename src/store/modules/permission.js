import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 每个用户一开始就拥有静态路由
  routes: constantRoutes
}
const mutations = {
  // 定义修改state内routes的方法
  setRoutes(state, newRoutes) {
    // newRoutes为用户拥有的动态路由，根据他的权限来添加
    // 将静态路由和新加的动态权限路由合并
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选路由权限
  filterRoutes(context, menus) {
    // menus是一个路由权限点数组 在调用获取用户资料接口返回的数据中 ['setting','employees',...]
    // asyncRoutes是动态路由规则 [ { path:'',name:'',component:()=>import('') },{ path:'',name:'',component:()=>import(''),children:[{}] } ]
    const routes = [] // routes就是当前用户可访问的动态路由
    menus.forEach(key => {
      // asyncRoutes.filter(item => item.name === key) 返回的是一个数组，没有匹配到就是空数组，满足匹配条件的item会返回到一个数组内   （item为对象）
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes) // 将过滤完的动态路由和原来的静态路由合并到一起
    return routes // 此处return 是为了addRoutes  因为state内routes的值是用来循环显示菜单的，而真正的路由访问权限需要通过addRoutes方法  给对应的用户添加上可访问的动态路由
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
