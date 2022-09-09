<template>
  <div class="dashboard-container">
    <div v-loading="loading" class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <add-depts ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments()" /> <!-- 父传子，将showDialog的值传给子组件内props变量 -->
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDepts from './components/add-depts.vue'
import { getDepartments } from '@/api/departments'
import { changeListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDepts
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
      },
      showDialog: false,
      node: null,
      loading: false // 用于控制进度条的显示与隐藏
    }
  },
  created() {
    // 调用接口方法
    this.getDepartments()
  },
  methods: {
    // 接口方法
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      console.log(result)
      this.company = { name: result.companyName, manager: '负责人', id: '' } // 此处传入 id:'' 是为了点击新增部门时，校验部门名称是否重复，而校验前需要查找该节点对象的所有子节点。通过pid===id
      this.departs = changeListToTreeData(result.depts, '') // pid为''的都是一级节点
      this.loading = false
    },
    // 新增部门-->自定义事件
    addDepts(node) { // node为子组件传出来的Node对象数据，用于：调用新增部门接口时传递的data参数   pid:父级部门id
      this.showDialog = true
      this.node = node
    },
    // 编辑部门-->自定义事件
    editDepts(node) {
      this.showDialog = true // 打开弹出层
      this.node = node // 保存当前节点对象
      this.$refs.addDepts.getDepartDetail(node.id) // 通过this.$refs获取组件实例，从而调用组件内的任何方法和属性
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
