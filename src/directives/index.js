// 所有的自定义指令都在这里进行管理
export const imgerror = {
  // inserted会在DOM插入到节点后执行
  inserted(el, options) { // el为DOM对象 options为指令中的变量的解释  其中有一个属性叫做 value
    // 监听dom对象的onerror事件 只要图片失效报错了就会触发
    el.onerror = function() {
      el.src = options.value // 当图片出现异常时，将自定义指令配置的默认图片地址设置给src
    }
  }
}
