<template>
  <!-- 行列布局 -->
  <el-row type="flex" justify="space-between" style="height: 40px; width: 100%" align="middle">
    <!-- 作用域插槽，slot-scope='obj' {node,data} node为当前节点的node对象，data为当前节点的数据 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 列内在加一个行，来使用flex布局 -->
    <!-- span设置为4 ，给4份分栏来控制列宽 -->
    <el-col :span="4">
      <!-- 两个内容 -->
      <el-row type="flex" justify="end">
        <el-col>
          {{ treeNode.manager }}
        </el-col>
        <!-- 下拉菜单 -->
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">
                添加子部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'
export default {
  // 设定props变量
  // 为了外部传进来一个对象，对象内包括name和manager
  props: {
    treeNode: {
      type: Object, // 传入类型必须为对象
      required: true // 使用该组件必须传入treeNode的值，不然报错
    },
    // 该变量用于判断下拉菜单内显示一个还是三个
    isRoot: {
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
    operateDepts(type) {
      if (type === 'add') {
        // 新增部门-->显示新增部门弹窗并且传递当前节点对象数据
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('您确定删除组织部门吗').then(() => { // 点击确认，会进入.then的回调函数
          return delDepartments(this.treeNode.id) // axios请求本身是一个promise对象
        }).then(() => { // 删除成功，会进入.then回调函数
          this.$emit('delDepts') // 子传父，通过$emit触发父内的自定义事件，来获取最新的组织部门数据，铺设到页面
          this.$message.success('已删除成功') // 提示用户删除成功
        })
      }
    }
  }
}
</script>
<style scoped>

</style>
