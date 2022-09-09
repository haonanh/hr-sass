<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 通过showBefore来控制i标签和插槽内容是否显示 -->
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <!-- 定义通用工具栏左侧插槽 -->
          <slot name="before" />
        </div>

      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义通用工具栏右侧插槽  -->
          <slot name="after" />
        </el-row>

      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>

