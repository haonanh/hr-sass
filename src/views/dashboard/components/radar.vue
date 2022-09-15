<template>
  <!-- echarts图表，必须要设置宽高，不然不会显示 -->
  <div id="main" class="radar-echart" />
</template>
<script>
// 按需引入echarts模块--雷达图 减少打包的体积
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, LegendComponent, TooltipComponent, RadarChart, CanvasRenderer])
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
    const myChart = echarts.init(document.getElementById('main'))
    myChart.setOption({
      title: {
        text: '个人雷达图'
      },
      tooltip: {
        show: true
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: '张三'
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: '李四'
            }
          ]
        }
      ]
    })
  },
  created() {
  },
  methods: {
  }
}
</script>
<style scoped>
.radar-echart{
  width: 600px;
  height: 400px;
}
</style>
