<template>
  <!-- 新增部门的弹层dialog -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel"> <!-- 将visible绑定props变量showDialog来控制是否显示弹窗 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules"> <!-- label-width设置form表单的宽度 -->
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 循环people数组，铺设负责人选择框内的数据 v-model显示的值为el-option标签上value的值 -->
          <el-option v-for="item in people" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog组件设置了具名插槽footer，专门用来放置底部操作栏 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24，设置列宽为6 -->
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button> <!-- size尺寸，用来控制button大小 -->
        <el-button type="primary" size="small" @click="btnOk">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: { // 点击新增部门的节点对象
      type: Object,
      default: null
    }
  },
  data() {
    // 检查新增的部门名称与同级部门内是否存在部门名称重复
    const checkNameRepeat = async(rule, value, callback) => {
      // 必须获取组织架构的最新数据，来校验
      const { depts } = await getDepartments()
      // 通过数组filter方法，来筛选点击新增部门的节点对象的子节点内的所有同级部门
      let isRepeat = null
      if (this.formData.id) {
        // 编辑模式下的校验规则
        // 通过filter筛选出和自己同级的所有部门信息，并且将自己排除在外
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 新增模式下的校验规则
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门已存在${value}了`)) : callback()
    }
    // 检查新增的部门编码与整个模块部门编码是否存在重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = null
      if (this.formData.id) {
        // 编辑模式下code的校验规则
        // 通过filter筛选，把自己先排除在外
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式下code的校验规则
        isRepeat = depts.some(item => item.code === value && value) // 由于历史数据中，可能存在没有code，所以要保证value不为空
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      people: [],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '部门名称不能为空' }, {
          min: 1, max: 50, trigger: 'blur', message: '部门名称要求1-50个字符'
        }, {
          validator: checkNameRepeat, trigger: 'blur'
        }],
        code: [{ required: true, trigger: 'blur', message: '部门编码不能为空' }, {
          min: 1, max: 50, trigger: 'blur', message: '部门编码要求1-50个字符'
        }, {
          validator: checkCodeRepeat, trigger: 'blur'
        }],
        manager: [{ required: true, trigger: 'blur', message: '部门负责人不能为空' }],
        introduce: [{ required: true, trigger: 'blur', message: '部门介绍不能为空' }, {
          min: 1, max: 300, trigger: 'blur', message: '部门名称要求1-300个字符'
        }]
      }
    }
  },
  computed: {
    // 通过计算属性来控制显示编辑部门还是新增部门
    // 当formData对象内存在id属性值时为编辑部门反之为新增部门
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
  },
  methods: {
    // el-select聚焦时触发方法，调用获取员工简单信息接口。
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple() // 将员工信息保存到people变量内
    },
    // 点击确认按钮，调用新增部门接口
    btnOk() {
      // 主动校验表单内所有的规则
      this.$refs.deptForm.validate(async isOk => {
        // 如果通过，则根据对应模式调用接口
        if (isOk) {
          if (this.formData.id) {
            // 编辑模式
            await updateDepartments(this.formData) // 修改部门详情接口
          } else {
            // 新增模式
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 新增部门接口
          }
          // 并且需要通知父组件调用最新的部门数据，从而更新页面
          this.$emit('addDepts')
          // 关闭新增部门的弹窗，通过sync修饰符来传递控制弹层显示的值
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 点击取消按钮，关闭弹层，并且重置校验结果和表单内各项value的值
    btnCancel() {
      // 重置表单校验只能重置表单内的对象属性，不能重置后来新增的如id等，所以需要手动将formData对象赋值为初始状态
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 重置表单校验
      this.$refs.deptForm.resetFields()
    },
    // 封装一个调用部门详情接口的方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id) // 将获取的部门详情信息赋值给formData
    }
  }
}
</script>
<style scoped>

</style>
