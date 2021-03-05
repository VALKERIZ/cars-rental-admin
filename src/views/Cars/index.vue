<template>
  <div>
    <TabalData ref="table" :config="table_config"> </TabalData>
  </div>
</template>
<script>
// 组件
import TabalData from "@c/tableData";
// API
import { CarsStatus, CarsRelease } from "@/api/cars";
// common
import { address, yearCheckType, energyType } from "@/utils/common";
export default {
  name: "Cars",
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "车辆品牌", prop: "nameCh", width: 120 },
          { label: "车辆型号", prop: "carsMode", width: 120 },
          {
            label: "车辆LOGO",
            prop: "imgUrl",
            type: "image",
            width: 90,
          },
          {
            label: "车辆图片",
            prop: "carsImg",
            type: "image",
          },
          {
            label: "年检",
            prop: "yearCheck",
            type: "function",
            callback: (row, prop) => yearCheckType(row[prop]),
            width: 80,
          },
          {
            label: "能源类型",
            prop: "energyType",
            type: "function",
            callback: (row, prop) => energyType(row[prop]),
            width: "80px",
          },
          {
            label: "禁启用",
            prop: "status",
            type: "switch",
            handler: (value, data) => this.switchChange(value, data),
            width: 80,
          },
          {
            label: "车辆状态",
            prop: "cars_status",
            type: "function",
            callback: (row) => {
              const carsStatus = this.$store.state.config.cars_status;
              const status = carsStatus[row.carsStatus];
              return status ? status.zh : "";
            },
            width: 80,
          },
          { label: "停车场", prop: "parkingName" },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop]),
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
                event: "link",
                name: "CarsAdd",
                key: "id",
                value: "id",
              },
              {
                label: "车辆释放",
                event: "button",
                handler: (data) => this.release(data),
              },
            ],
          },
        ],
        url: "carsList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        form_item: [
          { label: "城市", type: "City" },
          {
            label: "关键字",
            type: "Keyword",
            options: ["carsMode", "carsBrand", "parkingName", "address"],
          },
        ],
        form_handler: [
          {
            label: "新增车辆",
            prop: "add",
            type: "success",
            element: "link",
            router: "/carsAdd",
          },
        ],
        form_config: {
          searchButton: true,
          resetButton: true,
        },
      },
      switch_disabled: "",
      parking_data: {},
      table_loading: false,
    };
  },
  components: { TabalData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    /** 禁启用 */
    switchChange(value, data) {
      const requestData = {
        id: data.id,
        status: data.status,
      };
      this.switch_disabled = data.id;
      CarsStatus(requestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.switch_disabled = "";
        })
        .catch((error) => {
          this.switch_disabled = "";
          console.log("CarsStatus error", error);
        });
    },
    release(data) {
      CarsRelease({ id: data.id }).then((response) => {
        this.$message({
          type: "success",
          message: response.message,
        });
      });
    },
  },
};
</script>
<style lass="scss" scoped></style>
