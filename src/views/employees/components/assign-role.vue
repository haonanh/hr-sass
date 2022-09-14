<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="rolesId"><!-- v-model绑定的是数组，数组内存储的是选中状态checkbox的label值，由于后台返回的是id，所以label也绑定角色id -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id"><!-- 如果checkbox标签无内容，那么label的值也充当按钮后的介绍 -->
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="4">
        <el-button size="small" type="primary" @click="btnOK">确认</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      rolesId: []
    }
  },
  computed: {
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 封装调用角色列表的接口方法
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    // 封装调用员工基本信息接口方法，为了获取rolesId数组，里面包含了对应员工的角色信息
    async getUserDetailById(id) { // 此处的id参数，是从父组件传过来的，父组件调用子组件内的方法    为了解决props中userId变量是异步渲染的，这边不能获取到
      const { roleIds } = await getUserDetailById(id)
      this.rolesId = roleIds
    },
    // 点击事件--确定按钮，给用户分配勾选的角色，并关闭弹层
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.rolesId })
      this.$emit('update:showRoleDialog', false)
    //   this.$parent.showRoleDialog = false
    },
    // 点击事件--取消按钮，关闭弹层
    btnCancel() {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style scoped>

</style>
