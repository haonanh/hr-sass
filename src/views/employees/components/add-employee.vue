<template>
  <div>
    <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">  <!-- 给el-dialog绑定关闭事件，触发btnCancel方法 -->
      <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入姓名" style="width:50%" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入手机号" style="width:50%" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            placeholder="请选择入职时间"
            style="width:50%"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" placeholder="请选择聘用形式" style="width:50%">
            <el-option
              v-for="item in EmployeeEnum.hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            /> <!-- 此处label为选项显示的名字(若不设置则默认和value相同)，value为单元格的值 1或2 -->
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" placeholder="请输入工号" style="width:50%" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请选择部门" style="width:50%" @focus="getDepartments" />
          <el-tree
            v-if="showTree"
            v-loading="loading"
            :data="treeData"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="selectNode"
          />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="formData.correctionTime"
            placeholder="请选择转正时间"
            style="width:50%"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartments } from '@/api/departments' // 引入获取部门列表接口
import { changeListToTreeData } from '@/utils' // 引入将部门列表数据转化为树形结构的方法
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 储存employees的枚举对象
      // 定义表单数据对象
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: null,
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 定义表单各项的校验规则
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }], // 此处必须为change，因为如果为blur的话，值还没赋上去就失焦触发了导致校验不通过
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      // 接收转化后的树形数据  数组形式
      treeData: [],
      // 定义el-tree树形标签接收数据时的默认参数
      defaultProps: {
        label: 'name'
      },
      // 树形结构加载状态
      loading: false,
      // 树形结构是否显示
      showTree: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 选择部门框聚焦时触发，调用部门列表并转化为树形结构
    // 控制树形结构显示和加载状态的变更
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = changeListToTreeData(depts, '') // 传入两个参数，一个为正常的数组对象结构，另一个为根节点的pid属性 因为一级节点的pid属性为''，所以需要从一级节点开始找
      this.loading = false
    },
    // 点击树形节点，将值显示在输入框内
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 点击事件--点击确认按钮，调用新增员工接口
    async btnOk() {
      try { // 通过try，catch方法来捕获async和await可能出现的异常
        await this.$refs.addEmployee.validate() // 不传入回调函数，返回一个promise对象
        await addEmployee(this.formData) // 调用新增员工，更新后台数据
        // this.$parent 可以获取到父组件的实例，从而调用里面的属性和方法
        // 但是子组件不能被另一个组件包含着
        this.$parent.getEmployeeList() // 重新获取员工列表数据，更新前端页面
        this.$parent.showDialog = false // 关闭弹层
        // 由于点击确认关闭弹层触发了close事件从而触发btnCancel方法，这里就不要清空数据和重置校验了
      } catch (error) {
        console.log(error)
      }
    },
    // 点击事件--点击取消按钮。清空输入框，并且重置表单的所有校验结果，关闭弹层
    btnCancel() {
      // 清空输入框
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果，和清空对应数据
      this.showTree = false
      this.$emit('update:showDialog', false) // 关闭弹层
    }
  }
}
</script>
<style scoped>

</style>
