<template>
  <!-- upload组件 -->
  <!-- list-type: 文件列表的类型 可选值text/picture/picture-card -->
  <!-- limit: 最大允许上传个数 -->
  <!-- action: 必选参数,上传的地址,可以用#代替 -->
  <!-- on-preview: 钩子函数,预览图片 -->
  <!-- file-list: 上传的文件列表--数组 -->
  <!-- on-remove: 钩子函数,文件移除 -->
  <!-- on-change: 文件状态被改变时的钩子,添加文件\上传成功\失败都会被调用 -->
  <!-- on-progress: 文件上传时的钩子 -->
  <!-- before-upload: 上传文件之前的钩子,参数为上传文件,若返回false/promise,且不reject,则停止上传-->
  <!-- http-request: 覆盖默认的上传行为,可以自定义上传的实现 -->
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="preview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="changeFile"
      :on-success="success"
      :file-list="fileList"
      :class="{disabled: fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
    <el-dialog
      title="图片预览"
      :visible.sync="showDialog"
    ><img :src="imgUrl" style="width: 100%"></el-dialog>
  </div>
</template>

<script>
// 导入腾讯云的包
import COS from 'cos-js-sdk-v5'
// 实例化cos对象(这不是自己的存储桶地址)
const cos = new COS({
  SecretId: 'AKID0mqfEWqlUzIbeSkGRL6c7ML6c0B93To9',
  SecretKey: 'JFwNZdeRF2iOp03FFsGNDm44vWFitmNF'
})
export default {
  data() {
    return {
      showDialog: false,
      fileList: [], // 图片上传的列表
      imgUrl: '',
      showPercent: false,
      percent: 0
    }
  },
  computed: {
    // 设置一个计算属性来判断是否已经上传了一张图片
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  created() {

  },
  methods: {
    // 1. 图片预览--显示图片弹层
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },

    // 2. 删除图片--file是要删除(当前)的文件,fileList是上传文件的列表
    handleRemove(file) {
      // 把文件列表中包含正在被删除文件的id,清除该数组
      this.fileList = this.fileList.filter(item => {
        item.uid !== file.uid
      })
    },

    // 3. 上传图片
    changeFile(file, fileList) {
      console.log(file)
      console.log(fileList)
      if (fileList.length === 0) {
        this.showPercent = false
      }
      this.fileList = fileList.map(item => item)
    },

    // 4. 上传前检查文件--文件类型\文件大小
    beforeUpload(file) {
      console.log(file)
      const type = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.showPercent = true
      return true
    },

    // 5. 上传自定义事件
    upload(params) {
    //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'shuiruohanyu-106-1302806742', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        })
      }
    },

    // 6. 成功上传后返回的数据
    success(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      this.percent = 100
      setTimeout(() => {
        this.showPercent = false
        this.percent = 0
      }, 500)
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
