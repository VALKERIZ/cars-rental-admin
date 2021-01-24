<template>
  <div>
    <!-- 表格数据 -->
    <TabalData ref="table" :config="table_config"> </TabalData>
    <AddCarsBrand
      :flagVisible.sync="dialog_show"
      :data="data_brand"
      @callbackComponent="callbackComponent"
    /><!--父组件往子组件传数据时，是一个单向数据流-->
  </div>
</template>
<script>
import TabalData from "@c/tableData";
import AddCarsBrand from "@c/dialog/addCarsBrand";
// API
import { BrandStatus } from "@/api/brand";
export default {
  name: "Parking",
  components: { AddCarsBrand, TabalData },
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          {
            label: "LOGO",
            prop: "imgUrl",
            type: "image",
            width: 150,
          },
          {
            label: "车辆品牌",
            prop: "nameCh",
            type: "function",
            callback: (row, prop) => `${row.nameCh}/${row.nameEn}`,
          },
          {
            label: "禁启用",
            prop: "status",
            type: "switch",
            handler: (value, data) => this.switchChange(value, data),
          },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
            },
            buttonGroup: [
              {
                label: "编辑",
                type: "danger",
                event: "button",
                handler: (data) => this.edit(data),
              },
            ],
          },
        ],
        url: "brandList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        form_item: [
          {
            label: "车辆品牌",
            prop: "brand",
            type: "Input",
            width: "150px",
            options: "parking_type",
            placeholder: "请输入车辆品牌",
          },
        ],
        form_handler: [
          {
            label: "新增车辆品牌",
            prop: "add",
            type: "success",
            element: "button",
            handler: () => {
              this.dialog_show = true;
            },
          },
        ],
        form_config: {
          searchButton: true,
        },
      },
      data_brand: {},
      // 禁启用开关
      switch_disabled: "",
      // 弹窗标记
      dialog_show: false,
      // 搜索栏表单
      form: {
        brand: "",
      },
    };
  },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function]();
      }
    },
    /** 搜索 */
    search() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1,
      };
      if (this.form.brand) {
        requestData.brand = this.form.brand;
      }
      // 调用子组件的方法
      this.$refs.table.requestData(requestData);
    },
    loadData() {
      this.$refs.table.requestData();
    },
    /** 编辑 */
    edit(data) {
      this.data_brand = Object.assign({}, data);
      this.dialog_show = true;
    },
    /** 禁启用 */
    switchChange(value, data) {
      const requestData = {
        id: data.id,
        status: data.status,
      };
      this.switch_disabled = data.id; // 第一种方式：组件本身的属性处理
      BrandStatus(requestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.switch_disabled = "";
        })
        .catch((error) => {
          this.switch_disabled = "";
          this.switchChange(data);
        });
    },
  },
};
</script>
<style lass="scss" scoped></style>
