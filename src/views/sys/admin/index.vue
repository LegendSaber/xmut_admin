<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashbord' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理人员</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable @clear="getAdminList" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getAdminList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary">添加管理员</el-button>
        </el-col>
      </el-row>

      <el-table :data="adminList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isUsed" @change="adminStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row)" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="deleteAdmin(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>
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
          <el-button type="primary" @click="addAdmin">确 定</el-button>
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
      adminList: [],
      addDialogVisible: false,
      queryInfo: {
        query: "",
        currentPage: 1,
        pageSize: 4
      },
      total: 0,
      addForm: {
        username: "",
        password: "",
        cpassword: "",
        value: "管理员"
      },
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
      options: [
        {
          value: "超级管理员",
          label: "超级管理员"
        },
        {
          value: "管理员",
          label: "管理员"
        }
      ]
    };
  },
  created() {
    this.getAdminList();
  },
  methods: {
    getAdminList() {
      let params = {};

      params.currentPage = this.$data.queryInfo.currentPage;
      params.pageSize = this.$data.queryInfo.pageSize;
      params.query = this.$data.queryInfo.query;

      this.$axios.get("/sysAdmin/getForAdmin", params).then(response => {
        if (response && response.success) {
          this.$data.adminList = response.data.records;
          this.$data.total = response.data.total;
          let len = response.data.records.length;

          for (let i = 0; i < len; i++) {
            if (this.$data.adminList[i].isUsed == 1)
              this.$data.adminList[i].isUsed = true;
            else this.$data.adminList[i].isUsed = false;
          }
        }
      });
    },
    handleSizeChange(newSize) {
      this.$data.queryInfo.pageSize = newSize;
      this.getAdminList();
    },
    handleCurrentChange(newPage) {
      this.$data.queryInfo.currentPage = newPage;
      this.getAdminList();
    },
    adminStatusChange(row) {
      let params = {};

      params.id = row.id;
      if (row.isUsed) params.isUsed = 1;
      else params.isUsed = 0;

      this.$axios.post("/sysAdmin/status", params).then(response => {});
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addAdmin() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error("表单填写有误，请修改!");
          return false;
        } else {
          let params = {};
          params.name = this.$data.addForm.username;
          params.password = this.$md5(this.$data.addForm.password + "_XmUt");
          params.roleName = this.$data.addForm.value;

          this.$axios.post("/sysAdmin/register", params).then(response => {
            if (response && response.success) {
              this.$alert("添加用户成功", "提交结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.getAdminList();
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
    deleteAdmin(id) {
      let params = {};
      params.id = id;

      this.$axios.post("/sysAdmin/deleteAdmin", params).then(response => {
        if (response && response.success) {
          this.$alert("删除成功成功", "提交结果", {
            confirmButtonText: "确定",
            callback: action => {
              this.getAdminList();
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>