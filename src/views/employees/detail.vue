<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form
              ref="userForm"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
              :model="userInfo"
              :rules="rules"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUse">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置内容 -->
            <!-- 打印按钮 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 动态组件： 使用内置的component标签 配合is属性 is属性绑定变量名，变量的值为注册组件名即可-->
            <component :is="UserComponent" />
            <!--  <user-info></user-info> 两者相同  -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置内容 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 用动态组件和直接使用注册组件都可以 -->
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user' // 获取员工基本信息接口
import { saveUserDetailById } from '@/api/employees' // 修改员工基本信息接口
import UserInfo from './components/user-info.vue' // 引入个人详情信息组件
import JobInfo from './components/job-info.vue' // 引入岗位信息组件
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id, // 通过动态路由传参获取id的值
      userInfo: { // 专门用来存放员工基本信息
        username: '',
        password2: '' // 由于后端返回的password是一串密文，所以需要声明另一个password2来绑定输入框值
      },
      // 校验规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: true }, {
          min: 2, max: 4, message: '姓名长度为2-4位', trigger: true
        }],
        password2: [{ required: true, message: '密码不能为空', trigger: true }, {
          min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur'
        }]
      },
      UserComponent: 'UserInfo'
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 调用员工基本信息接口方法
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 点击事件--保存用户修改的姓名和密码传给后端
    saveUse() {
      // 知识点：对象内，如果有相同的属性，那么后面的值会覆盖前面的
      // 主动调用表单验证 校验通过才会执行.then内的回调函数
      this.$refs.userForm.validate().then(async() => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 通过展开运算符将对象浅拷贝，并且将password属性值改为password2的值，password2的值和表单输入框相关联
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style>

</style>
