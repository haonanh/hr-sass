<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" />
        <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{data}" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>

  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { changeListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { },
      departs: [{
        name: '总裁办',
        manager: '曹操',
        children: [{
          name: '董事会',
          manager: '曹丕'
        }]
      }, {
        name: '行政部',
        manager: '刘备'
      }, {
        name: '人事部',
        manager: '孙权'
      }],
      defaultProps: {
        label: 'name'// label:''  根据这个属性显示内。不写默认为label
        // children:''  根据这个属性寻找子节点，不写默认为children
      }
    }
  },
  created() {
    // 调用接口方法
    this.getDepartments()
  },
  methods: {
    // 接口方法
    async getDepartments() {
      const result = await getDepartments()
      console.log(result)
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = changeListToTreeData(result.depts, '') // pid为''的都是一级节点
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
