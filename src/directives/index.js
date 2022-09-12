// 所有的自定义指令都在这里进行管理
export const imgerror = {
  // inserted会在DOM插入到节点后执行   只执行一次
  inserted(el, options) { // el为DOM对象 options为指令中的变量的解释  其中有一个属性叫做 value
    // 监听dom对象的onerror事件 只要图片失效报错了就会触发
    // 添加判断，el.src可能为null空值，此时不会触发图片错误事件
    el.src = el.src || options.value // 当el.src不为null时，直接使用el.src，否则使用默认图片地址
    el.onerror = function() {
      el.src = options.value // 当图片出现异常时，将自定义指令配置的默认图片地址设置给src
    }
  },
  // 更新的钩子函数，当标签发生改变时，触发此钩子函数   次数不受限制
  updated(el, options) {
    el.src = el.src || options.value // 当el.src不为null时，直接使用el.src，否则使用默认图片地址
  }
}
