<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统使用情况</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="80">
        <el-col :offset="2" :span="10">
            <ve-pie :data="userData"></ve-pie>
        </el-col>
        <el-col :span="10">
            <ve-histogram :data="chartData"></ve-histogram>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        chartData: {
            columns: ["日期", "新增经验贴", "新增知识贴", "新增文件数"],
            rows: []
        },
        userData: {
          columns: ['角色', '访问人数'],
          rows: []
        }
    };
  },
  created() {
      this.$axios.get("/sysAdmin/getUserData", {}).then(response => {
          if (response && response.success) {
            this.$data.userData.rows = response.data
          }
      })

      this.$axios.get("/sysAdmin/getChartData", {}).then(response => {
        if (response && response.success){
          this.$data.chartData.rows = response.data
        }
      })
  }
};
</script>

<style scoped>
</style>