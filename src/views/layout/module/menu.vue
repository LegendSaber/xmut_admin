<template>
  <div>
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-share"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item index="1-1">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">经验管理</span>
        </el-menu-item>
        <el-menu-item index="1-2">
          <i class="el-icon-s-order"></i>
          <span slot="title">知识管理</span>
        </el-menu-item>
        <el-menu-item index="1-3">
          <i class="el-icon-upload"></i>
          <span slot="title">文件管理</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-user-solid"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-message-solid"></i>
        <span slot="title">签到系统</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    toggleCollapse() {
      this.$data.isCollapse = !this.$data.isCollapse
    }
  }
};
</script>

<style scoped>
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>