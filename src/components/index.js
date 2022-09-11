import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImage from './UploadImage'
// 统一注册组件，导出
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImage', UploadImage)
  }
}
