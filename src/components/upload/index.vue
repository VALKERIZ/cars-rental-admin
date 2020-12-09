<template>
  <el-upload
    class="avatar-uploader"
    action="https://up-z2.qiniup.com"
    :data="uploadData"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { GetQiniuToken } from "@/api/common";
export default {
  name: "",
  components: {},
  data() {
    return {
      imageUrl: "",
      uploadData: {},
    };
  },
  beforeMount() {
    this.getQiniuToken();
  },
  methods: {
    getQiniuToken() {
      // 在工作中，
      const requestData = {
        ak: "a0SdM7v6vh2cQ_GacNqlz0qs5pdLw4ZxO3bSJ8Gj",
        sk: "Nb8TdqBXusTen2IB6VN9kDpbdYLIqS2emBlD_SyH",
        buckety: "cars-zsb",
      };
      GetQiniuToken(requestData)
        .then((response) => {
          const data = response.data;
          if (data.token) {
            this.uploadData.token = data.token;
          }
        })
        .catch((e) => {
          console.log("getQiniuToken error", e);
          this.getQiniuToken();
        });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = `http://ql1yue6tv.hn-bkt.clouddn.com/${res.key}`;
      this.$emit("update:value", this.imageUrl);
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      let fileName = file.name;
      let key = encodeURI(fileName);
      this.uploadData.key = key;
      return isJPG && isLt2M;
    },
  },
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
  },
  watch: {
    imgUrl(newV) {
      if (newV !== this.imageUrl) {
        this.imageUrl = newV;
      }
    },
  },
};
</script>
<style lang="scss"></style>
