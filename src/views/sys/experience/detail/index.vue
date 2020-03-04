<template>
  <div>
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <el-card class="box-card">
      <h1 style="fontSize:30px;">{{essay.title}}</h1>
      <div class="author-info">
        <el-button type="primary" plain style="fontSize:14px;">{{essay.author}}</el-button>
        <el-divider direction="vertical"></el-divider>
        <span style="fontSize:18px;">发表于: {{essay.createTime}}</span>
        <el-divider direction="vertical"></el-divider>
        <span>收藏人数: {{essay.favorNum}}</span>
      </div>
      <el-divider />
      <div v-html="essay.content" style="fontSize:20px;"></div>
      <el-divider />
      <el-button @click="deteleExperience" icon="el-icon-delete" type="danger" plain>删除</el-button>
      <el-divider />
      <el-tabs type="card" v-model="cardForm.category" @tab-click="commentHandleClick">
        <el-tab-pane label="最新" name="new"></el-tab-pane>
        <el-tab-pane label="热门" name="hot"></el-tab-pane>
      </el-tabs>
      <div v-for="(comment, index) in commentData" :key="index">
        <el-row>
          <el-col :span="1" :offset="1">
            <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
          </el-col>
          <el-col :span="19" :offset="1">
            <div style="fontSize: 20px;" v-html="comment.content"></div>
            <br />
            <div style="fontSize:10px;">
              <el-link type="primary">{{comment.author}}</el-link>
              <el-divider direction="vertical"></el-divider>
              <span>发表于: {{comment.createTime}}</span>
              <el-divider direction="vertical"></el-divider>
              <span>推荐人数: {{comment.favorNum}}</span>
              <el-divider direction="vertical"></el-divider>
              <el-link type="warning">推荐</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger">回复</el-link>
            </div>
          </el-col>
          <el-col>
            <el-divider />
          </el-col>
        </el-row>
        <div v-for="(son, index) in comment.sonComment" :key="index">
          <el-row>
            <el-col :span="1" :offset="2">
              <el-avatar :size="50" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="20" :offset="1">
              <div style="fontSize: 15px;" v-html="son.content"></div>
              <br />
              <div style="fontSize: 10px;">
                <el-link type="success">{{son.author}}</el-link>
                <el-divider direction="vertical"></el-divider>
                <span>回复于: {{son.createTime}}</span>
              </div>
            </el-col>
            <el-col>
              <el-divider />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      essay: {},
      commentData: [],
      cardForm: {
        category: "new",
        oldCategory: "new"
      },
      queryComment: {
        currentPage: 0,
        pageSize: 12,
        flag: 1,
        isScroll: false
      }
    };
  },
  methods: {
    goBack() {
        this.$router.push("/experience")
    },
    getComment() {
      let params = {};
      params.currentPage = this.$data.queryComment.currentPage;
      params.pageSize = this.$data.queryComment.pageSize;
      params.id = this.$data.essay.id;
      params.flag = this.$data.queryComment.flag;

      this.$axios.post("/sysComment/getAll", params).then(response => {
        if (response && response.success) {
          if (response.data == null) {
            window.removeEventListener("scroll", this.windowScroll);
            return;
          }
          if (!this.$data.queryComment.isScroll) {
            this.$data.commentData = response.data.records;
            let len = this.$data.commentData.length;
            for (let i = 0; i < len; i++) {
              this.$data.commentData[i].createTime = this.$data.commentData[
                i
              ].createTime.slice(0, 10);
              this.$data.commentData[i].sonComment.sort(function sortFun(x, y) {
                return Date.parse(y.createTime) - Date.parse(x.createTime);
              });
              let sonLen = this.$data.commentData[i].sonComment.length;
              for (let j = 0; j < sonLen; j++) {
                this.$data.commentData[i].sonComment[
                  j
                ].createTime = this.$data.commentData[i].sonComment[
                  j
                ].createTime.slice(0, 10);
              }
            }

            if (len < this.$data.queryComment.pageSize) {
              window.removeEventListener("scroll", this.windowScroll);
            }
          } else {
            let tmp = response.data.records;
            let len = tmp.length;
            if (len == 2) {
              tmp[0].createTime = tmp[0].createTime.slice(0, 10);
              tmp[1].createTime = tmp[1].createTime.slice(0, 10);
              this.$data.commentData.push(tmp[0]);
              this.$data.commentData.push(tmp[1]);
              this.$data.queryComment.currentPage++;
            } else {
              if (len == 1) {
                tmp[0].createTime = tmp[0].createTime.slice(0, 10);
                this.$data.commentData.push(tmp[0]);
              }
              this.$notify.error("没有更多数据了");
              window.removeEventListener("scroll", this.windowScroll);
            }
          }
        }
      });
    },
    commentHandleClick() {
      if (this.$data.cardForm.category != this.$data.cardForm.oldCategory) {
        if (this.$data.cardForm.category == "new")
          this.$data.queryComment.flag = 1;
        else this.$data.queryComment.flag = 2;
        this.$data.queryComment.currentPage = 0;
        this.$data.queryComment.pageSize = 12;
        this.$data.queryComment.isScroll = false;
        this.getComment();
        this.$data.cardForm.oldCategory = this.$data.cardForm.category;
        this.$data.queryComment.currentPage =
          this.$data.queryComment.pageSize / 2 + 1;
        this.$data.queryComment.pageSize = 2;
        window.addEventListener("scroll", this.windowScroll);
      }
    },
    deteleExperience() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        let params = {};
        params.id = this.$data.essay.id;
        params.author = this.$data.essay.author

        this.$axios
          .post("/sysExperience/deleteExperienceByAdmin", params)
          .then(response => {
            if (response && response.success) {
              this.$alert(response.message, "删除结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push("/experience");
                }
              });
            }
          });
      });
    },
    windowScroll() {
      //滚动条滚动时距离顶部的距离
      let scrollTop = document.documentElement.scrollTop;
      //可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //滚动条总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight == scrollHeight) {
        const loading = this.$loading({
          lock: true,
          text: "正在加载数据",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop - 10;
          this.$data.queryComment.isScroll = true;
          this.getComment();
          loading.close();
        }, 2000);
      }
    }
  },
  created() {
    if (this.$route.query.content.id == null) this.$router.push("/experience");
    this.$data.essay = this.$route.query.content;
    let params = {};
    params.id = this.$data.essay.id;

    this.getComment();
    this.$data.queryComment.currentPage =
      this.$data.queryComment.pageSize / 2 + 1;
    this.$data.queryComment.pageSize = 2;
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>

<style scoped>
</style>