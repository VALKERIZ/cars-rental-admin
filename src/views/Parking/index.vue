<template>
  <div>
    <TabalData ref="table" :config="table_config">
      <!--查看地图-->
      <template v-slot:lnglat="slotData">
        <el-button type="success" size="mini" @click="showMap(slotData.data)"
          >查看地图</el-button
        >
      </template>
    </TabalData>
    <MapLocation :flagVisible.sync="map_show" :data="parking_data" />
  </div>
</template>
<script>
// 组件
import MapLocation from "@c/dialog/showMapLocation";
import TabalData from "@c/tableData";
// API
import { ParkingStatus } from "@/api/parking";
// common
import { address, parkingType } from "@/utils/common";
export default {
  name: "Parking",
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "停车场名称", prop: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            callback: (row, prop) => parkingType(row[prop]),
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop]),
          },
          { label: "可停放车辆", prop: "carsNumber" },
          {
            label: "禁启用",
            prop: "status",
            type: "switch",
            handler: (value, data) => this.switchChange(value, data),
          },
          {
            label: "查看位置",
            prop: "lnglat",
            type: "slot",
            slotName: "lnglat",
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
                name: "ParkingAdd",
                key: "id",
                value: "id",
              },
            ],
          },
        ],
        url: "parkingList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        form_item: [
          { label: "城市", type: "City" },
          {
            label: "关键字",
            type: "Keyword",
            options: ["parkingName", "address"],
          },
        ],
        form_handler: [
          {
            label: "新增停车场",
            prop: "add",
            type: "success",
            element: "link",
            router: "/parkingAdd",
          },
        ],
        form_config: {
          searchButton: true,
          resetButton: true,
        },
      },
      switch_disabled: "",
      // 地图显示
      map_show: false,
      parking_data: {},
      table_loading: false,
    };
  },
  components: { MapLocation, TabalData },
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
      ParkingStatus(requestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.switch_disabled = "";
        })
        .catch((error) => {
          console.log("switchChange error", error);
          this.switch_disabled = "";
        });
    },
    /** 显示地图 */
    showMap(data) {
      this.map_show = true;
      this.parking_data = data;
    },
  },
};
</script>
<style lass="scss" scoped></style>
