import Layout from '@/layout' // 引入Layout组件

// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/permission', // 一级路由employees
  name: 'permissions', // 给路由规则命名employees，后期做权限管理需要用
  component: Layout, // 显示Layout布局
  children: [{ // 二级路由
    path: '', // 此处不用写任何路径，表示二级默认路由。当进入employees路径时，会显示Layout组件和员工主页组件
    name: 'permissions',
    component: () => import('@/views/permission'),
    meta: { // 元信息
      title: '权限管理', // 此处必须用title，因为侧边栏菜单的名称就是读取的meta对象内title的属性
      icon: 'lock'
    }
  }]
}
