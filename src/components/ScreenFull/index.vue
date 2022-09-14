<template>
  <div>
    <!-- svg-icon组件的使用 -->
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull/dist/screenfull' // 引入ScreenFull对象
export default {
  methods: {
    changeScreen() {
      // document.documentElement.requestFullscreen()
      // document.exitFullscreen()
      // 判断全屏功能是否可用，通过插件自带的属性ScreenFull.isEnabled  可用为true
      if (!ScreenFull.isEnabled) {
        // 当不可用时，提示用户
        this.$message.warning('全局功能不可用')
        return
      }
      // 这里表示全屏功能可用
      // ScreenFull.toggle()方法，可以来回切换全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style>

</style>
