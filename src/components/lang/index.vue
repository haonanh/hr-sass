<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <!-- 设置disabled属性，当前页面语言就是对应语言时，不可点击 -->
      <el-dropdown-item :disabled="$i18n.locale===&quot;zh&quot;" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="$i18n.locale===&quot;en&quot;" command="en">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 点击下拉菜单选项触发
    changeLanguage(type) {
      // 设置Cookie缓存，将locale需要的属性缓存到Cookie内，以备下次打开浏览器获取对应的语言包
      Cookie.set('language', type)
      this.$i18n.locale = type // 主动更换locale属性，让页面重新渲染，更换成切换的语言
      this.$message.success('切换语言成功') // 提示用户切换成功
    }
  }
}
</script>
<style scoped>

</style>
