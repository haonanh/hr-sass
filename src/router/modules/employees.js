import Layout from '@/layout' // 引入Layout组件

// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default { // 员工管理页
  path: '/employees', // 一级路由employees
  name: 'employees', // 给路由规则命名employees，后期做权限管理需要用
  component: Layout, // 显示Layout布局
  children: [{ // 二级路由
    path: '', // 此处不用写任何路径，表示二级默认路由。当进入employees路径时，会显示Layout组件和员工主页组件
    name: 'employees',
    component: () => import('@/views/employees'),
    meta: { // 元信息
      title: '员工管理', // 此处必须用title，因为侧边栏菜单的名称就是读取的meta对象内title的属性
      icon: 'people'
    }
  }, { // 员工详情页
    path: 'detail/:id', // 动态路由传参，query传参。 可以加上? 表示可传可不传，不加的话表示必须要传，不传就跳转不到该路由页面，会到404
    hidden: true, // 不在左侧菜单中显示出来
    component: () => import('@/views/employees/detail'),
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  }, {
    path: 'print/:id', // 传递对应的用户id进去，加上? 表示可传可不传
    hidden: true,
    component: () => import('@/views/employees/print'),
    meta: {
      title: '员工打印'
    }
  }]
}
