<template>
  <!--dialog 弹窗-->
  <el-dialog
    title="新增车辆品牌"
    :visible.sync="dialogVisible"
    @close="close"
    @opened="opened"
    :close-on-click-modal="false"
  >
    <VueForm
      ref="vueForm"
      :formData="form_data"
      :formItme="form_item"
      :formHandler="form_handler"
    >
      <template v-slot:logo>
        <div class="upload-img-wrap">
          <Upload :imgUrl.sync="form_data.imgUrl" />
          <!-- <div class="upload-img">
            <img v-show="logo_current" :src="logo_current" />
          </div> -->
          <ul class="img-list">
            <li
              v-for="item in logo"
              :key="item.id"
              @click="form_data.imgUrl = item.img"
            >
              <img :src="item.img" :alt="item.name" />
            </li>
          </ul>
        </div>
      </template>
    </VueForm>
  </el-dialog>
</template>

<script>
// 组件
import VueForm from "@c/form";
import Upload from "@c/upload";
// API
import { BrandLogo, BrandAdd, BrandEdit } from "@/api/brand";
export default {
  name: "AddCarsBrand",
  components: { VueForm, Upload },
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      defult: () => {},
    },
  },
  data() {
    let validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入品牌"));
      } else {
        callback();
      }
    };
    return {
      // 弹窗显示/关闭标记
      dialogVisible: false,
      // 表单数据
      form_data: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: true,
      },
      // 表单项
      form_item: [
        {
          type: "Input",
          label: "品牌中文",
          prop: "nameCh",
          placeholder: "请输入品牌中文",
          validator: [
            { validator: validateName, trigger: "blur", required: true },
          ],
        },
        {
          type: "Input",
          label: "品牌英文",
          prop: "nameEn",
          placeholder: "请输入品牌英文",
          validator: [
            { validator: validateName, trigger: "blur", required: true },
          ],
        },
        {
          type: "Slot",
          slotName: "logo",
          label: "LOGO",
          required: true,
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_disabled,
        },
      ],
      // 表单按钮
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "primary",
          handler: () => this.formValidate(),
        },
      ],
      // logo
      logo: [],
    };
  },
  methods: {
    opened() {
      this.getBrandLogo();
    },
    /** 获取LOGO */
    getBrandLogo() {
      // 存在数据时，不再请求接口
      if (this.logo.length != 0) {
        return false;
      }
      // 没有数据时
      BrandLogo()
        .then((response) => {
          const data = response.data;
          if (data) {
            this.logo = data;
          }
        })
        .catch((e) => {
          console.log("getBrandLogo error", e);
          this.getBrandLogo();
        });
    },
    /** 确定按钮->提交表单 */
    formValidate() {
      this.$refs.vueForm.$refs.form.validate((value) => {
        if (value) {
          this.data.id ? this.edit() : this.add();
        } else {
          console.log("error validate!!");
          return false;
        }
      });
    },
    /** 添加 */
    add() {
      BrandAdd(this.form_data).then((response) => {
        this.$message({
          type: "success",
          message: response.message,
        });
        this.reset();
      });
    },
    /** 修改 */
    edit() {
      BrandEdit(this.form_data).then((response) => {
        this.$message({
          type: "success",
          message: response.message,
        });
        this.close();
      });
    },
    /** 重置表单 */
    reset() {
      this.$refs.vueForm.resetForm();
    },
    close() {
      // 关闭窗口
      this.dialogVisible = false;
      // this.reset();
      this.form_data = {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: true,
      };
      this.$emit("update:flagVisible", false);
      // 方法一：回调->请求新数据
      this.$emit("callbackComponent", {
        function: "loadData",
      });
    },
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      },
    },
    data: {
      handler(newV) {
        console.log(newV);
        this.form_data = newV;
        // this.form_data.imgUrl = newV.imgUrl;
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
