<template>
  <el-container>
    <div class="wrap">
        <div>
          <span class="title">后台管理系统</span>
        </div>
        <div class="desc"></div>
        <el-form :model="ruleLogin" status-icon :rules="loginRules" ref="ruleLogin" class="demo-ruleForm">
          <el-form-item  prop="username">
            <el-input v-model="ruleLogin.username" prefix-icon="el-icon-user-solid" auto-complete="off" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="ruleLogin.password" prefix-icon="el-icon-lock" auto-complete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="submitForm('ruleLogin')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
  </el-container>
</template>
<script>
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if(this.$data.loginType === 'account'){
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
        callback()
      }else{
        callback()
      }
    }
    var checkPass = (rule, value, callback) => {
      if(this.$data.loginType === 'account'){
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleLogin.password !== '') {
            callback()
          }
        }
      }else{
        callback()
      }
    }
    
    return {
      activeName: 'account',
      loginType:'account',
      ruleLogin: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { validator: checkName, trigger: 'blur' }
        ],
        password: [
          { validator: checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 登录确认
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {}
          params.name = this.$data.ruleLogin.username
          params.password = this.$data.ruleLogin.password

          this.$axios.get('/sysAdmin/login',params).then((response) => {
            if(response && response.success){
              // 设置用户登录信息
              window.sessionStorage.setItem("admin", JSON.stringify(response.data))

              //跳转路由
              this.$router.push('/dashbord')
              this.$notify.success(response.message)

            }else{
              this.$notify.error(response.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
  .wrap {
    padding-top: 50px;
  }
  .title {
    font-size: 33px;
    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    vertical-align: middle;
  }
  .el-footer_links-item{
    margin-right: 40px;
    display: inline-block;
    color: rgba(0,0,0,.45);
    text-decoration: none;
    font-size: 12px;
  }
  .el-col{
    text-align: left;
  }
  .el-footer_copyright{
    padding-right: 45px;
    font-size: 12px;
    display: inline-block;
    color: rgba(0,0,0,.45);
    text-decoration: none;
  }
  .desc {
    margin-top: 12px;
    margin-bottom: 40px;
    color: rgba(0,0,0,.45);
  }
  .login-btn{
    width: 100%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .el-container{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right: 0;
    padding-bottom: 15%;
    display: flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
    background: #f0f2f5;
    background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
  }
  .origin-url{
    color:#40a9ff;
    text-decoration: none;
  }

</style>
