<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>

          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" align="center" />
              <el-table-column label="角色" width="240" prop="name" align="center" />
              <el-table-column label="描述" prop="description" align="center" />
              <el-table-column label="操作">
                <template slot-scope="{row}"> <!-- 作用域插槽，可以获取row的数据 -->
                  <!-- row内的数据就是对应行中 {id,name,description} 的数据 -->
                  <el-button type="success" size="small">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteRole(row.id)">删除</el-button><!-- 从而通过row.id获取对应角色id -->
                </template>

              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" style="height:60px" align="middle">
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :current-page="page.page"
                :page-size="page.pagesize"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司信息">
            <el-alert type="info" title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" :closable="false" show-icon />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑角色" :visible="showDialog">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 通过el-dialog组件的footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 用作调用接口时传递的参数
      page: {
        page: 1, // 页码
        pagesize: 10, // 每页条数
        total: 0 // 总数
      },
      list: [], // 承接返回数据数组
      formData: {}, // 承接企业信息返回的对象数据
      showDialog: false, // 编辑角色弹层显示
      roleForm: { // 编辑角色弹层页面表单布局
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']) // vuex内getters快捷访问用户信息内companyId的方法
  },
  created() {
    this.getRoleList() // 调用获取角色列表
    this.getCompanyInfo() // 调用获取企业信息
  },

  methods: {
    // 封装调用角色列表的接口方法
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 分页组件中当前页码发生改变时触发，回调参数为当前页页码。通过重新调用接口数据，来更新页面数据
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 封装获取企业信息的接口方法
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 点击事件--删除对应角色
    async deleteRole(id) {
      try { // 通过try catch来捕获await的异常
        await this.$confirm('确认删除该角色吗?') // 弹出确认框
        await deleteRole(id) // 调用删除角色接口
        this.getRoleList() // 重新获取角色列表数据，从而改变前端页面数据
        this.$message.success('删除角色成功') // 提示用户删除成功
      } catch (error) {
        console.log(error)
      }
    },
    // 点击事件--编辑角色信息
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 点击事件--确认编辑角色信息，调用接口修改后台数据
    async btnOk() {
      try {
        // 表单的主动校验返回的是一个promise对象（不传入回调参数的情况下）
        await this.$refs.roleForm.validate()
        // 只有表单校验通过了才会执行await下方的代码，因为await下方的代码为成功的代码
        // 区分编辑角色信息还是新增角色信息，通过roleForm对象内是否存在id这个属性
        if (this.roleForm.id) {
          // 编辑模式
          await updateRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
