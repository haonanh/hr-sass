<template>
  <div>
    <!-- el-upload为上传组件 -->   <!-- action为上传地址 -->
    <el-upload
      list-type="picture-card"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :limit="1"
      :class="{disabled:fileComputed}"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    > <!-- file-list属性直接影响显示的图片，修改file-list属性就会直接修改显示什么图片，显示多少张图片 -->
      <i class="el-icon-plus" />
    </el-upload><!-- sync修饰符，因为showDialog是data变量，不是props变量，可以修改值 -->
    <el-progress v-if="showProgress" :percentage="percent" style="width:180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDylIZbNt99tNddT3PVLvFI5ctufAPO7an',
  SecretKey: 'zkFUVIp9D1ZrtfBRRAdplRt76qNegRwA'
})
export default {
  data() {
    return {
      // fileList是一个数组对象类型 [{name:  , url:'' },{} ]
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null,
      percent: 0,
      showProgress: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  created() {
  },
  methods: {
    // 点击预览图片时触发
    preview(file) { // 回调参数file是一个对象，包含status，uid，url三个属性
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 点击删除图片时触发
    handleRemove(file, fileList) {
      // this.fileList = fileList
      this.fileList = fileList.filter(item => item.uid !== file.uid) // filter会返回一个数组，没有满足的，就返回一个空数组
    },
    // 添加文件，上传成功，上传失败都会触发
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
      console.log(fileList)
      // if (!this.fileList.some(item => item.uid === file.url)) {
      //   this.fileList.push(file)
      // }
      // 此时由于action上传地址为#所以，change事件触发了添加文件和上传失败，所以第一次的fileList长度为1，第二次为0，当action有地址时，两次的fileList应该一样，就不会出现上传不显示图片的情况
    },
    // 已确认上传，上传文件之前触发，校验上传文件格式和大小是否符合要求
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showProgress = true
      return true
    },
    // 上传操作
    upload(argument) {
      // 执行上传操作 argument.file为文件对象
      // 上传到腾讯云步骤 ==> 上传到哪个存储桶   哪个地域的存储桶  文件 格式 名称  回调函数
      console.log(argument)
      cos.putObject({
        Bucket: 'richard-1313889748', // 存储桶名称
        Region: 'ap-nanjing', // 地域
        Key: argument.file.name, // 存储在桶里的文件名
        Body: argument.file, // 存储内容
        StorageClass: 'STANDARD', // 存储类型，固定格式
        onProgress: (params) => {
          // console.log(params)
          // params参数是一个对象，对象内有percent属性，表示文件上传的百分比，以小数形式呈现
          this.percent = params.percent * 100
        }
      }, (error, data) => { // 回调函数，失败或成功
        console.log(error || data)
        // 上传成功后返回一个data对象，data对象内statusCode为状态码，为200时表示上传成功
        if (!error && data.statusCode === 200) {
          // 上传成功
          this.fileList = this.fileList.map(item => {
            // 加一层判断，因为fileList数组内可能不止一个对象，所以对于fileList内对象的uid和上传的图片uid相比较，如果相同表示就是上传到腾讯云的，返回对应的url地址，否则返回item本身
            if (item.uid === this.currentFileUid) {
              return { url: 'http://' + data.Location, upLoad: true } // upLoad 属性是为了后期点击保存时做判断，确保已经上传完毕
            } else {
              return item
            }
            // el-upload组件是根据fileList去渲染的，fileList发生改变，那么el-upload也会改变
          })

          // 上传成功后将进度条隐藏并且百分比归零，由于头像体积太小了，进度条来不及显示，所以加个setTimeout延时器
          setTimeout(() => {
            this.showProgress = false
            this.percent = 0
          }, 1000) // 延迟1s关闭进度条和归零百分比
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
// 样式穿透 /deep/ 和 ::v-deep
::v-deep .disabled .el-upload--picture-card {
  display: none;
}
</style>
