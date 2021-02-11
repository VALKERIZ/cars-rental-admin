<template>
  <div>
    <VueForm
      ref="vuForm"
      :formData="form_data"
      :formItme="form_item"
      :formHandler="form_handler"
      labelWidth="150px"
    ></VueForm>
  </div>
</template>
<script>
import VueForm from "@c/form";
// API
import { Detailed, Edit } from "@/api/member";
import { validate_phone, validate_idCard } from "@/utils/validate";
export default {
  name: "MemberInfo",
  data() {
    let validatePhone = (rule, value, callback) => {
      let regPhone = validate_phone(value);
      if (!value || value == "") {
        callback(new Error("请输入用户名"));
      } else if (!regPhone) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    let validateIdCard = (rule, value, callback) => {
      let regIdCard = validate_idCard(value);
      if (!value || value == "") {
        callback(new Error("请输入身份证"));
      } else if (!regIdCard) {
        callback(new Error("身份证格式有误"));
      } else if (regIdCard == -1) {
        callback(new Error("无效身份证"));
      } else {
        callback();
      }
    };

    return {
      // 表单数据配置
      id: this.$route.query.id,
      form_data: {
        // 指定对象里面的所以 key
        username: "",
        truename: "",
        cardId: "",
        gender: "",
        illegalAmount: "",
        cardPhotoFace: "",
        cardPhotoBack: "",
        cardPhotoBareheaded: "",
        carsPhotoFace: "",
        carsPhotoBack: "",
        blacklist: "",
      },
      // 表单配置
      form_item: [
        {
          type: "Input",
          label: "用户名",
          placeholder: "请输入用户名",
          prop: "username",
          width: "200px",
          validator: [
            { validator: validatePhone, trigger: "blur", required: true },
          ],
        },
        {
          type: "Input",
          label: "真实姓名",
          placeholder: "请输入真实姓名",
          prop: "truename",
          required: true,
          width: "200px",
        },
        {
          type: "Input",
          label: "身份证",
          placeholder: "请输入身份证",
          prop: "cardId",
          validator: [
            { validator: validateIdCard, trigger: "blur", required: true },
          ],
        },
        {
          type: "Radio",
          label: "性别",
          prop: "gender",
          options: this.$store.state.config.gender,
          required: true,
        },
        {
          type: "InputNumber",
          label: "违章预存金",
          prop: "illegalAmount",
          required: true,
        },
        {
          type: "Upload",
          label: "身份证（正面）",
          prop: "cardPhotoFace",
          // required: true,
        },
        {
          type: "Upload",
          label: "身份证（反面）",
          prop: "cardPhotoBack",
          // required: true,
        },
        {
          type: "Upload",
          label: "身份证（免冠）",
          prop: "cardPhotoBareheaded",
          // required: true,
        },
        {
          type: "Upload",
          label: "驾驶证（正面）",
          prop: "carsPhotoFace",
          // required: true,
        },
        {
          type: "Upload",
          label: "驾驶证（反面）",
          prop: "carsPhotoBack",
          // required: true,
        },
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.formValidate(),
        },
        // { label: "重置", key: "reset" },
      ],
      // 按钮加载
      button_loading: false,
    };
  },
  components: { VueForm },
  beforeMount() {
    this.id && this.detailed();
  },
  methods: {
    detailed() {
      Detailed({ id: this.id }).then((response) => {
        const data = response.data;
        //格式化请求数据的参数(过滤)
        const obj = {};
        for (let key in this.form_data) {
          if (Object.keys(data).includes(key)) {
            obj[key] = data[key];
          }
        }
        this.form_data = obj;
      });
    },
    /** 提交表单 */
    formValidate() {
      this.$refs.vuForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id && this.edit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑
    edit() {
      Edit({ ...this.form_data, id: this.id }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.$router.push({ path: "/memberList" });
      });
    },
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
  },
};
</script>
<style lass="scss" scoped>
.address-map {
  width: 100%;
  height: 500px;
}
</style>
