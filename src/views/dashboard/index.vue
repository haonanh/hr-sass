<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageTools :show-before="true">
      <!-- slot插槽的两种使用方式 -->
      <!-- 第一种直接使用slot属性 slot='名称' -->
      <!-- 第二种通过v-slot指令配合template标签   <template v-slot:名称> </template>  -->
      <span slot="before">确认信息</span>
      <template v-slot:after>
        <el-button type="primary">导出excel</el-button>
      </template>
    </PageTools>
    <upload-excel />
    <upload-image />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
