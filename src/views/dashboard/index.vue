<!-- 首页页面 -->

<template>
  <div class="dashboard-container">
    <page-tools />
    <div class="dashboard-text">name: {{ name }}</div>
    <upload-excel />
    <image-upload />
  </div>
</template>

<script>
// const obj = {
//   created() {
//     alert('minxi-one')
//   }
// }
// const obj1 = {
//   created() {
//     alert('minxi-two')
//   },
//   methods: {
//     test() {
//       alert('methods中的test()方法,可以在根节点里的调用')
//     }
//   }
// }
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  // 混入
  // mixins: [obj, obj1],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // alert('minxi的出现有先后顺序')
    // 调用obj1对象里的方法
    // this.test()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
