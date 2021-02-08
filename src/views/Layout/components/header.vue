<template>
  <el-row>
    <!-- 侧边栏缩放控制 -->
    <el-col :span="12">
      <span class="menu-btn" @click="switchAside">
        <svg-icon icon="menuBtn" className="icon-menu-btn"></svg-icon>
      </span>
    </el-col>

    <el-col :span="12">
      <!-- 退出登录 -->
      <span class="logout" @click="logout">
        <svg-icon icon="logout" className="icon-logout"></svg-icon>
      </span>
      <!-- 用户名称和头像 -->
      <div class="face-info">
        <img src="../../../assets/face.png" :alt="username" />
        <span class="name">{{ username }}</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
  name: "LayoutAsice",
  components: {},
  props: {},
  setup(props, { root }) {
    const switchAside = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };
    const username = computed(() => root.$store.state.app.username);
    const logout = () => {
      root
        .$confirm("确认退出管理后台", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          root.$store.dispatch("app/logoutAction").then(() => {
            root.$message({
              message: "退出登录成功，正在返回...",
              type: "success",
            });
            setTimeout(() => {
              root.$router.push({
                name: "Login",
              });
            }, 500);
          });
        });
    };
    return { switchAside, username, logout };
  },
};
</script>
<style lang="scss" scoped>
.menu-btn {
  display: inline-block;
  padding-top: 24px;
  cursor: pointer;
}
.logout {
  float: right;
  border-left: 1px solid #ededed;
  width: 75px;
  text-align: center;
  line-height: 75px;
  font-size: 25px;
  margin-right: -20px;
  cursor: pointer;
}
.face-info {
  float: right;
  padding: 18px 30px 0 0;
  img {
    display: inline-block;
    vertical-align: middle;
    border-radius: 100px;
    margin-right: 18px;
  }
}
</style>
