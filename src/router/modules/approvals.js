import Layout from '@/layout' // 引入Layout组件

// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/approvals', // 一级路由approvals
  name: 'approvals', // 给路由规则命名approvals，后期做权限管理需要用
  component: Layout, // 显示Layout布局
  children: [{ // 二级路由
    path: '', // 此处不用写任何路径，表示二级默认路由。当进入approvals路径时，会显示Layout组件和员工主页组件
    component: () => import('@/views/approvals'),
    meta: { // 元信息
      title: '审批', // 此处必须用title，因为侧边栏菜单的名称就是读取的meta对象内title的属性
      icon: 'tree-table'
    }
  }]
}
