<template>
  <el-dialog
    title="新增租车类型"
    width="30%"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @close="close"
    :close-on-click-modal="false"
  >
    <VueForm
      ref="vueForm"
      :formData="form_data"
      :formItme="form_item"
      :formHandler="form_handler"
    ></VueForm>
  </el-dialog>
</template>

<script>
// 组件
import VueForm from "@c/form";
// API
import { LeaseAdd, LeaseEdit } from "@/api/lease";
export default {
  name: "AddLeaseType",
  components: { VueForm },
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
    return {
      // 弹窗显示/关闭标记
      dialogVisible: false,
      // 表单数据
      form_data: {
        carsLeaseTypeName: "",
        carsLeaseStatus: true,
        carsLeaseDesc: "",
      },
      // 表单项
      form_item: [
        {
          type: "Input",
          label: "租车类型",
          prop: "carsLeaseTypeName",
          required: true,
        },
        {
          type: "Disabled",
          label: "禁/启状态",
          prop: "carsLeaseStatus",
          required: true,
        },
        { type: "Textarea", label: "描述", prop: "carsLeaseDesc" },
      ],
      // 表单按钮
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.formValidate(),
        },
      ],
    };
  },
  methods: {
    formValidate() {
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          this.form_data.carsLeaseTypeId ? this.edit() : this.add();
        } else {
          console.log("error validate!!");
          return false;
        }
      });
    },
    add() {
      LeaseAdd({ ...this.form_data }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.reset();
      });
    },
    edit() {
      LeaseEdit({ ...this.form_data }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.close();
      });
    },
    /** 重置表单 */
    reset() {
      this.$refs.vueForm.resetForm();
      this.form_data = {
        carsLeaseTypeName: "",
        carsLeaseStatus: true,
        carsLeaseDesc: "",
      };
    },
    close() {
      // 关闭窗口
      this.dialogVisible = false;
      this.reset();
      this.$emit("update:flagVisible", false);
      // 方法二：VUEx ->请求新数据
      this.$store.commit("common/SET_TABL_DATA_FLAG");
    },
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      },
    },
    data: {
      handler(newValue) {
        console.log(2222);
        this.form_data = newValue;
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
