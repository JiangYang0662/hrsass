<!-- 首页dashboard的工作日历组件-->
<template>
  <div>
    <el-row type="flex" justify="end">
      <!--年月选择-->
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}
        </el-option>
      </el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px;margin-left:10px"
        @change="dateChange"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}
        </el-option>
      </el-select>
    </el-row>

    <!--日历-->
    <el-calendar v-model="currentDate">
      <template slot="dateCell" slot-scope="{ date, data }" class="content">
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
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },
  created() {
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    this.currentDay = this.startDate.getDate()
    // Array(11)--快速生成一个只有长度的空数组
    // Array.from()--es6语法：将一个类数组对象或可遍历的对象转化位正真的数组
    // Array.from(Array(11))--元素位undefined的数组
    // Array.from(Array(11,(value,index) => index + 1) --可以位空数组赋值
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    this.dateChange()
  },
  methods: {
    // 1. 判断周末
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
    // 2. 年份变化
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      const day = this.currentDay
      this.currentDate = new Date(`${year}-${month}-${day}`)
    }
  }
}
</script>

<style  scoped>
 .el-calendar-day {
  height:  auto;
 }
 .el-calendar-table__row td,
 .el-calendar-table tr td:first-child,
 .el-calendar-table__row td.prev{
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
 .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 .el-calendar__header {
   display: none
 }
</style>
