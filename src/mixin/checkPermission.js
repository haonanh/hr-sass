import store from '@/store'
export default { // 默认导出对象
  methods: { // 对象内设置一个检查权限点的方法
    checkPermission(key) {
      const { userInfo } = store.state.user // 获取到用户对应的权限点数组points
      if (userInfo.roles && userInfo.roles.points) { // 判断是否存在权限点数组
        return userInfo.roles.points.some(item => item === key) // 如果存在，那么检查用户的权限点points数组内是否拥有该功能的权限标识 有则返回true，没有则返回false
      }
      return false
    }
  }
}
