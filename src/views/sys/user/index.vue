<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashbord' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      <el-breadcrumb-item>普通用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable @clear="getUserList" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="score" label="积分"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.isUsed" @change="userStatusChange(scope.row)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row)" type="primary" icon="el-icon-edit"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!--添加用户的对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="cpassword">
            <el-input type="password" v-model="addForm.cpassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addForm.value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户的对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%">
        <!--内容主体区域-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="用户ID:">
            <el-input v-model="editForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="积分:" prop="score">
            <el-input v-model="editForm.score"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editForm.roleName" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          value: "研友",
          label: "研友"
        },
        {
          value: "路人",
          label: "路人"
        }
      ],
      queryInfo: {
        query: "",
        currentPage: 1,
        pageSize: 4
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        cpassword: "",
        value: "研友"
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "用户名的长度在3~20个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        cpassword: [{ validator: validatePass, trigger: "blur" }]
      },
      editFormRules: {

      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      let params = {};

      params.currentPage = this.$data.queryInfo.currentPage;
      params.pageSize = this.$data.queryInfo.pageSize;
      params.query = this.$data.queryInfo.query;
      this.$axios.get("/sysUser/getAll", params).then(response => {
        if (response && response.success) {
          this.$data.userList = response.data.records;
          this.$data.total = response.data.total;
          let len = this.$data.userList.length

          for (let i = 0; i < len; i++) {
              if (this.$data.userList[i].isUsed == 0) {
                  this.$data.userList[i].isUsed = false
              } else {
                  this.$data.userList[i].isUsed = true
              }
          }
        }
      });
    },
    handleSizeChange(newSize) {
      this.$data.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.$data.queryInfo.currentPage = newPage;
      this.getUserList();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    userStatusChange(row) {
        let params = {}

        params.id = row.id
        if (row.isUsed) params.isUsed = 1
        else params.isUsed = 0

        this.$axios.post("/sysUser/changeStatus", params).then(response => {        
        })
    },
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error("表单填写有误，请修改!");
          return false;
        } else {
          let params = {};
          params.username = this.$data.addForm.username;
          params.password = this.$md5(this.$data.addForm.password + "_XmUt");
          params.roleName = this.$data.addForm.value;

          this.$axios.post("/sysUser/register", params).then(response => {
            if (response && response.success) {
              this.$alert("添加用户成功", "提交结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.getUserList()
                  this.$data.addDialogVisible = false;
                }
              });
            } else {
              this.$alert(response.message, "注册结果", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          });
        }
      });
    },
    showEditDialog(row) {
      this.$data.editForm = row 
      this.$data.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUser() {
      let params = {}

      params.id = this.$data.editForm.id
      params.score = this.$data.editForm.score
      params.roleName = this.$data.editForm.roleName

      this.$axios.post("/sysUser/editUser", params).then(response => {
        if (response && response.success) {
          this.$alert(response.message, "提交结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.getUserList()
                  this.$data.editDialogVisible = false;
                }
              });
        }
      })
    }
  }
};
</script>

<style scoped>
</style>