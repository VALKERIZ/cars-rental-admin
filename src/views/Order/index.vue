<template>
  <div>
    <TabalData ref="table" :config="table_config"> </TabalData>
  </div>
</template>
<script>
// 组件
import TabalData from "@c/tableData";
// API
import {
  OrderWait,
  OrderOvertime,
  OrderOver,
  OrderCancel,
  OrderReturn,
} from "@/api/order";

export default {
  name: "Order",
  components: { TabalData },
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "订单号", prop: "order_no" },
          {
            label: "状态",
            prop: "order_status",
            type: "function",
            width: 100,
            callback: (row) => {
              const orderStatus = this.$store.state.config.order_status;
              const status = orderStatus[row.order_status];
              return status ? status.zh : "";
            },
          },
          {
            label: "创建日期",
            prop: "create_date",
            type: "function",
            width: 180,
            callback: (row) => {
              return row.create_date ? row.create_date : "";
            },
          },
          {
            label: "金额",
            prop: "amount",
            width: 100,
          },

          {
            label: "操作",
            type: "operation",
            width: 550,
            default: {
              // deleteButton: true,
              editButton: true,
              editButtonLink: "CarsAdd",
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
                label: "待取车",
                type: "",
                event: "button",
                handler: (data) => this.orderWait(data),
              },
              {
                label: "超时",
                type: "",
                event: "button",
                handler: (data) => this.orderOvertime(data),
              },
              {
                label: "完成",
                type: "",
                event: "button",
                handler: (data) => this.orderOver(data),
              },
              {
                label: "取消",
                type: "",
                event: "button",
                handler: (data) => this.orderCancel(data),
              },
              {
                label: "待还车",
                type: "",
                event: "button",
                handler: (data) => this.ordrerReturn(data),
              },
            ],
          },
        ],
        url: "orderList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        // 查询接口没有实现
        // form_item: [
        //   {
        //     label: "关键字",
        //     type: "Keyword",
        //     options: ["order_no", "order_status"],
        //   },
        // ],
        // form_config: {
        //   searchButton: true,
        // },
      },
    };
  },

  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    orderWait(data) {
      OrderWait({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    orderOvertime(data) {
      OrderOvertime({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    orderOver(data) {
      OrderOver({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },

    orderCancel(data) {
      OrderCancel({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    ordrerReturn(data) {
      OrderReturn({
        order_no: data.order_no,
        cars_id: data.cars_id,
      }).then((response) => {
        this.loadData();
      });
    },
    loadData() {
      this.$refs.table.requestData();
    },
  },
};
</script>
<style lass="scss" scoped></style>
