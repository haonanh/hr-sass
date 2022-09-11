<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用工具栏 -->
      <page-tools :show-before="true">
        <template v-slot:before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">导入excel</el-button>
          <el-button size="small" type="danger" @click="exportData">导出excel</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格内容和分页 -->
      <el-card>
        <el-table border="" :data="list"><!-- table 通过data属性绑定list数组对象数据 -->
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="手机号" sortable="" prop="mobile" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" /><!-- formatter属性 值类型为函数，用来格式化内容 -->
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template> -->   <!-- 返回的接口内已经将时间格式化好了，不在需要用过滤器方法了，vue3中已弃用过滤器 -->
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <el-switch :v-model="false" />
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">                             <!-- 通过作用域插槽，获取到对应员工的id，并且通过动态路由传参过去，显示在url路径上 -->
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
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
      <add-employee :show-dialog.sync="showDialog" /> <!-- sync修饰符，之后在子组件内改变showDialog的值时，不需要特意传值通知父组件，自动同步 -->
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10, // 当前页码显示条数
        total: 0 // 总数
      },
      list: [], // 承接后台返回的员工列表的数据
      loading: false, // 加载状态，false为加载中
      showDialog: false // 控制新增员工弹层是否显示
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
      console.log(rows)
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
    },
    // 点击事件--删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确认删除该员工吗') // $confirm是提示框，返回的是一个promise对象可以用.then和.catch也可以用async和await来处理确认和取消
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击事件--导出员工列表数据为excel文件
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        // 复杂表头参数multiHeader 中的列数要和标准表达header中的列数相同，如果要跨列，可以将多余的空间设为空字符串
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 复杂表头格式为数组套数组，数组内有几个数组元素就代表有几行表头 [[]]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({ // vue-element-admin提供的导出excel方法中支持multiHeader和merges参数
          header: Object.keys(headers),
          data,
          filename: '人力资源表',
          multiHeader,
          merges
        })
        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['张三', 3000], ['李四', 5000]],
        //   filename: '员工工资表'
        // })
        // [{ username: '张三',mobile: 13112345678 }]  => [[]]
        // 要转化 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    // 格式化结构的方法，负责将后台返回数据[{}]转化为[[]]格式，并且在顺序上和header表头数组一一对应
    formatJson(headers, rows) {
      return rows.map(item => { // 将返回的新数组返回给方法本身，也就是将[[]]返给调用方法
        return Object.keys(headers).map(key => { // 再次返回一个新数组为数组套数组[[]]   [['13912345678','张三','行政部'.....],['13912345678','张五','人事部'.....].....]
          // key为中文标题  手机号，姓名，入职日期.....
          // headers[key]为中文对应的英文标题
          // 格式化时间格式
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 格式化时间，将时间格式化成yy-mm-dd  用filters内的方法
          } else if (headers[key] === 'formOfEmployment') { // 格式化聘用形式，将1/2格式化成正式/非正式/未知
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]] // map返回一个新数组['13912345678','张三','行政部'.....]
        })
      })
    }
  }
}
</script>

<style>

</style>
