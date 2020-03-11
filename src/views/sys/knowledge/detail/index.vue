<template>
  <div>
    <el-card class="box-card">
      <h1 style="fontSize:30px;">{{essay.title}}</h1>
    <div class="author-info">
      <el-button type="primary" style="fontSize:12px;">{{essay.author}}</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button type="success" style="fontSize:12px;">{{essay.category}}</el-button>
      <el-divider direction="vertical"></el-divider>
      <span>发表于: {{essay.createTime}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>收藏人数: {{essay.favorNum}}</span>
    </div>
    <el-divider />
    <div v-html="essay.content" style="fontSize:20px;"></div>
    <el-row v-if="images.length > 0">
      <el-divider />
      <el-col>
        <img
          v-for="(image, index) in images"
          :alt="image.name"
          :key="index"
          :src="image.img"
          width="304"
          height="228"
          style="margin-left: 24px;"
          @click="showImg(index)"
        />
        <el-dialog :visible.sync="bigImg.dialogVisible">
          <img width="100%" :src="bigImg.dialogImageUrl" alt />
        </el-dialog>
      </el-col>
    </el-row>
    <el-divider />
      <el-button @click="deteleKnowledge" icon="el-icon-delete" type="danger" plain>删除</el-button>
      <el-divider />
      <el-tabs type="card" v-model="cardForm.category" @tab-click="commentHandleClick">
        <el-tab-pane label="最新" name="new"></el-tab-pane>
        <el-tab-pane label="热门" name="hot"></el-tab-pane>
      </el-tabs>
      <div v-for="(comment, index) in commentData" :key="index">
      <el-row>
        <el-col :span="1" :offset="1">
          <el-avatar v-if="comment.img == null" shape="square" :size="50" :src="squareUrl"></el-avatar>
          <el-avatar v-else shape="square" :size="50" :src="comment.img"></el-avatar>
        </el-col>
        <el-col :span="19">
          <div style="fontSize: 16px;" v-html="comment.content"></div>
          <div class="comment">
            <span style="color:#3b5998;cursor: pointer;" type="primary">{{comment.author}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>发表于: {{comment.createTime}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>推荐人数: {{comment.favorNum}}</span>
          </div>
        </el-col>
      </el-row>
      <div v-for="(son, index) in comment.sonComment" :key="index">
        <el-row>
          <el-col :offset="2">
            <el-divider>
              <i class="el-icon-s-comment"></i>
            </el-divider>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2">
            <div style="fontSize: 16px;" v-html="son.content"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="5">
            <div style="margin-top:10px;fontSize: 14px;">
              <el-link type="success">{{son.author}}</el-link>
              <el-divider direction="vertical"></el-divider>
              <span>回复于: {{son.createTime}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-divider>
          <i class="el-icon-s-data"></i>
        </el-divider>
      </el-row>
    </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      essay: {},
      commentData: [],
      images: [],
      bigImg: {
        dialogImageUrl: "",
        dialogVisible: false
      },
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
    showImg(index) {
      this.$data.bigImg.dialogImageUrl = this.$data.images[index].img;
      this.$data.bigImg.dialogVisible = true;
    },
    getComment() {
      let params = {};
      params.currentPage = this.$data.queryComment.currentPage;
      params.pageSize = this.$data.queryComment.pageSize;
      params.id = this.$data.essay.id;
      params.flag = this.$data.queryComment.flag;

      this.$axios
        .get("/sysComment/getKnowledgeComment", params)
        .then(response => {
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
                this.$data.commentData[i].sonComment.sort(function sortFun(
                  x,
                  y
                ) {
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
    deteleKnowledge() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        let params = {};
        params.id = this.$data.essay.id;
        params.author = this.$data.essay.author

        this.$axios.post("/sysKnowledge/deleteByAdmin", params).then(response => {
          if (response && response.success) {
            this.$alert(response.message, "删除结果", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push("/knowledge");
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
    let essayParams = {};
    essayParams.id = this.$route.query.id;;

    this.$axios
      .post("/sysKnowledge/getKnowledgeById", essayParams)
      .then(response => {
        if (response && response.success) {
          this.$data.essay = response.data;
          this.$data.essay.createTime = this.$data.essay.createTime.slice(
            0,
            10
          );
          let params = {};
          params.id = this.$data.essay.id;

          this.getComment();
          this.$data.queryComment.currentPage =
            this.$data.queryComment.pageSize / 2 + 1;
          this.$data.queryComment.pageSize = 2;

          this.$axios.post("/sysFile/loadPicture", params).then(response => {
            if (response && response.success) {
              let data = response.data;
              let length = data.length;

              for (let i = 0; i < length; i++) {
                let picture = {};
                picture.name = data[i].name;
                picture.img = data[i].img;
                this.$data.images.push(picture);
              }
            }
          });
        } else {
          this.$notify.error(response.message);
          this.$router.push("/knowledge");
        }
      });
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
.comment {
  line-height: 1.6;
  margin-bottom: 6px;
  font-size: 14px;
  margin-top: 8px;
}
span {
  color: #767676;
}

img {
  margin: 5px;
  border: 1px solid #ccc;
}

img:hover {
  border: 1px solid #777;
}
</style>