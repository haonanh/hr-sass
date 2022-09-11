<template>
  <upload-excel :on-success="success" /> <!-- 给UploadExcel组件传入方法函数给onsuccess变量 -->
</template>
<script>
import { importEmployee } from '@/api/employees' // 引入导入excel的方法
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    async  success({ header, results }) { // header和results回调参数  header是excel表格内中文的标题数组 results是数组对象，里面对象的键值对为 姓名：'高崂山' （中文：值）
      const userRelations = { // 中文key和英文的对应关系
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = results.map(item => { // 通过map返回一个新数组[{},{},{}]
        const userInfo = {}
        Object.keys(item).forEach(key => { // 获取中文key的数组，通过forEach遍历数组
        // 格式化时间
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '-')) // 通过格式化时间方法，将excel时间格式转化为后端可以接收的格式
          } else {
            userInfo[userRelations[key]] = item[key] // 将中文的key转换成英文key，并把值赋给英文key
          }
        })
        return userInfo // 将对象返回出去，返回到数组内
      })
      await importEmployee(arr) // 调用导入接口，传入数组
      this.$message.success('导入成功') // 提示导入成功
      this.$router.back() // 回到原来的路径页面
    },
    // 格式化时间方法，将excel独有的时间表示，转化为后端可以接收的时间格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
<style scoped>

</style>
