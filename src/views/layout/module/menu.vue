<template>
  <div>
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <i class="el-icon-message-solid"></i>
        <span slot="title">签到系统</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-data"></i>
          <span>账户管理</span>
        </template>
        <el-menu-item index="2-1">
          <i class="el-icon-s-check"></i>
          <span slot="title">管理人员</span>
        </el-menu-item>
        <el-menu-item index="2-2">
          <i class="el-icon-user-solid"></i>
          <span slot="title">普通用户</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-share"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item index="3-1">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">经验管理</span>
        </el-menu-item>
        <el-menu-item index="3-2">
          <i class="el-icon-s-order"></i>
          <span slot="title">知识管理</span>
        </el-menu-item>
        <el-menu-item index="3-3">
          <i class="el-icon-upload"></i>
          <span slot="title">文件管理</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  methods: {
    toggleCollapse() {
      this.$data.isCollapse = !this.$data.isCollapse
      this.$emit("changeCollapse", this.$data.isCollapse)
    },
    handleSelect(index, indexPath) {
      if (index == "1") {
        
      } else if (index == "2-1") {
        
      } else if (index == "2-2") {
        if (this.$route.path != "/user") this.$router.push("/user")
      } else if (index == "3-1"){
        if (this.$route.path != "/experience") this.$router.push("/experience")
      } else if (index == "3-2"){
        if (this.$route.path != "/knowledge") this.$router.push("/knowledge")
      } else if (index == "3-3"){

      }
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