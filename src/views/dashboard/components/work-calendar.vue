<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="changeDate">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="changeDate">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{date,data}">
        <!-- 样式已经在下面安排好了 -->
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  filters: {
    // 过滤器，将日历内的时间2022-9-14，过滤成只有日（14）的形式，并且将0去掉（05），只保留数字（5）
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    // 使用该组件的人，传入想要的时间
    startDate: {
      type: Date,
      default: () => new Date() // 如果没有传入，就用当前时间
    }
  },
  data() {
    return {
      yearList: [], // 年份数组
      currentYear: null, // 当前年
      currentMonth: null, // 当前月
      currentDate: null // 当前时间
    }
  },

  computed: {
  },
  created() {
    // 初始化，获取到对应时间的年，月，和对应年的前后5年
    // 调用changeDate方法，来控制el-calendar组件跟随el-select组件变化
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (value, index) => index + this.currentYear - 5) // 第一个参数为想要转化成数组的伪数组对象或可迭代对象，第二个回调函数为新数组中的每个元素都会执行
    this.changeDate()
  },
  methods: {
    // change时间，当el-select发生改变时触发，从而让el-calendar变化
    changeDate() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)
    },
    // 判断是否为双休的方法，当index为0时为星期天，为6时为星期六
    // date是通过作用域插槽获取到的当前单元格的时间 类型为Date
    isWeek(date) {
      // 因为date是Date类型，所以可以直接使用Date方法api
      return date.getDay() === 0 || date.getDay() === 6
    }
  }
}
</script>
<style lang='scss' scoped>
 ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td, ::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
