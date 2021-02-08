<template>
  <div>
    <TabalData ref="table" :config="table_config"></TabalData>
    <addLeaseType
      :flagVisible.sync="dialog_show"
      :data="current_cars_lease_data"
    />
  </div>
</template>
<script>
// 组件
import TabalData from "@c/tableData";
import addLeaseType from "@c/dialog/addLeaseType";
// API
import { LeaseStatus } from "@/api/lease";
export default {
  name: "Sale",
  data() {
    return {
      // 表格配置
      table_config: {
        checkbox: false,
        pagination: false,
        thead: [
          { label: "租车类型", prop: "carsLeaseTypeName", width: 200 },
          {
            label: "禁启状态",
            prop: "carsLeaseStatus",
            type: "switch",
            handler: (value, data) => this.leasrStatus(value, data),
          },
          { label: "描述", prop: "carsLeaseDesc" },
          // { label: "车辆列表", prop: "carsList", width: 500 },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              deleteKey: "carsLeaseTypeId",
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
        url: "leaseList", // 真实URL请求地址
        data: {},
        form_item: [],
        form_handler: [
          {
            label: "新增租车类型",
            prop: "add",
            type: "success",
            element: "button",
            handler: () => this.leaseTypeAddDialog(),
          },
        ],
        form_config: {},
      },
      current_cars_lease_data: {},
      // 弹窗标记
      dialog_show: false,
    };
  },
  components: { TabalData, addLeaseType },
  methods: {
    // callbackComponent(params) {
    //   if (params.function) {
    //     this[params.function](params.data);
    //   }
    // },
    loadData() {
      this.$refs.table.requestData();
    },
    // 禁启用
    leasrStatus(value, data) {
      LeaseStatus({ id: data.carsLeaseTypeId, status: value })
        .then((response) => {
          this.$message({
            message: response.message,
            type: "success",
          });
        })
        .catch((error) => {
          data.carsLeaseStatus = !value;
        });
    },
    edit(data) {
      // 获取的 data 是 JSON 对象
      const copyData = Object.assign({}, data);
      this.current_cars_lease_data = copyData; // 引用类型
      this.dialog_show = true;
    },
    // 弹窗
    leaseTypeAddDialog() {
      this.dialog_show = true;
    },
  },
};
</script>
<style lass="scss" scoped></style>
