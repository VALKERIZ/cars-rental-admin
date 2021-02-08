<template>
  <el-dialog
    title="车辆自定义属性添加"
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
import { CarsTypeAdd } from "@/api/carsAttr";
export default {
  name: "AddCarsAttr",
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
        typeValue: "",
        key: "",
        value: "",
      },
      // 表单项
      form_item: [
        {
          type: "Input",
          label: "当前属性",
          prop: "typeValue",
          disabled: true,
          required: true,
        },
        { type: "Input", label: "属性(key)", prop: "key", required: true },
        { type: "Input", label: "描述(value)", prop: "value", required: true },
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
          this.add();
        } else {
          console.log("error validate!!");
          return false;
        }
      });
    },
    add() {
      const requestData = {
        typeId: this.data.id,
        key: this.form_data.key,
        value: this.form_data.value,
      };
      CarsTypeAdd(requestData).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.reset();
      });
    },
    /** 重置表单 */
    reset() {
      this.$refs.vueForm.resetForm();
    },
    close() {
      this.reset();
      // 关闭窗口
      this.dialogVisible = false;
      this.$emit("update:flagVisible", false);
      // 请求新数据
      this.$emit("callbackComponent", {
        function: "getCarsTypeList",
      });
    },
  },
  watch: {
    flagVisible: {
      handler(newValue) {
        this.dialogVisible = newValue;
      },
    },
    data: {
      handler(newValue) {
        this.form_data.typeValue = newValue.value;
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
