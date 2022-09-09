<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用工具栏 -->
      <page-tools :show-before="true">
        <template v-slot:before>
          <span>共16条数据</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="success">导入excel</el-button>
          <el-button size="small" type="danger">导出excel</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格内容和分页 -->
      <el-card>
        <el-table border="" :data="list"><!-- table 通过data属性绑定list数组对象数据 -->
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" /><!-- formatter属性 值类型为函数，用来格式化内容 -->
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template> -->   <!-- 返回的接口内已经将时间格式化好了，不在需要用过滤器方法了，vue3中已启用过滤器 -->
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <el-switch :v-model="false" />
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" style="height:60px" align="middle">
          <el-pagination
            layout="prev,pager,next"
            :total="page.total"
            :page-size="page.size"
            :current-page="page.page"
            @current-change="pageChange"
          /> <!--分页中layout设置不能错一个标点。不然什么都不会显示 -->
        </el-row>

      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10, // 当前页码显示条数
        total: 0 // 总数
      },
      list: [], // 承接后台返回的员工列表的数据
      loading: false // 加载状态，false为加载中
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 封装调用员工列表接口的方法
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 分页页码改变时触发
    pageChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 通过枚举文件内导出的对象格式化聘用形式的方法
    formatEmployment(row, column, cellValue, index) { // 回调函数含义 row为表格中对应行的数据，对象形式
    // column为列的属性对象  cellValue则是单元格的值，该单元格为1或2   index为索引
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue) // 如果可以找到匹配的会返回一个对象，如果未找到则返回undefined
      return obj ? obj.value : '未知'
    }
  }
}
</script>

<style>

</style>
