<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashbord' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>签到系统</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <ve-line :data="chartData"></ve-line>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: {
        columns: ["日期", "签到人数"],
        rows: []
      }
    };
  },
  created() {
      this.$axios.get("/sysSign/getSignNum").then(response => {
          if (response && response.success) {
              this.$data.chartData.rows = response.data
          }
      })
  }, 
  methods: {
  }
};
</script>

<style scoped>
</style>