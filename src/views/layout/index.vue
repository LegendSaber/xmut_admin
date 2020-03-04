<template>
  <el-container class="home-container">
    <el-header>
      <div style="display: flex;align-items: center;">
        <img src="@/assets/images/header.png"/>
        <span style="margin-left: 15px;">后台管理系统</span>
      </div>
      <div>
        <span style="margin-right: 5px;">欢迎你，{{currentUser.name}}</span>
        <el-button type="primary" @click="home">主页</el-button>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <origin-menu @changeCollapse="newCollapse"></origin-menu>
      </el-aside>
      <el-main>
        <origin-main></origin-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import menu from "./module/menu";
import main from "./module/main";
export default {
  data() {
    return {
      isCollapse: true,
      currentUser: {}
    };
  },
  components: {
    "origin-menu": menu,
    "origin-main": main
  },
  methods:{
    logout() {
      this.$axios.post("/sysAdmin/logout").then(response => {
        if (response && response.success) {
          this.$notify.success(response.message)
          window.sessionStorage.removeItem("admin")
          this.$router.push("/")
        } 
      })
    },
    newCollapse(isCollapse) {
      this.$data.isCollapse = isCollapse
    },
    home() {
      if (this.$route.path != '/dashbord') this.$router.push("/dashbord")
    }
  },
  created() {
    let currentUser = JSON.parse(window.sessionStorage.getItem("admin")) 
    if (currentUser) {
      this.$data.currentUser = currentUser
    }else {
      this.$router.push('/')
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}
</style>