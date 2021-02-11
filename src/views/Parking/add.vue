<template>
  <div>
    <VueForm
      ref="vueForm"
      :formData="form_data"
      :formItme="form_item"
      :formHandler="form_handler"
    >
      <template v-slot:city>
        <CityArea
          ref="cityArea"
          :mapLocation="true"
          :cityAreaValue.sync="form_data.area"
          @callback="callbackComponent"
        />
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <AMap
            ref="amap"
            :options="option_map"
            @callback="callbackComponent"
          />
        </div>
      </template>
    </VueForm>
  </div>
</template>
<script>
// AMAP
import AMap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
import VueForm from "@c/form";
// API
import { ParkingAdd, ParkingDetailed, ParkingEdit } from "@/api/parking";
export default {
  name: "ParkingAdd",
  data() {
    const validate = (rule, value, callback) => {
      if (!value || value == "") {
        callback(new Error("请输入省市区"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据配置
      form_data: {
        parkingName: "",
        area: "",
        address: "",
        type: "",
        carsNumber: "",
        status: true,
        lnglat: "",
      },
      // 表单组件配置
      form_item: [
        {
          type: "Input",
          label: "停车场名称",
          placeholder: "请输入停车场名称",
          prop: "parkingName",
          required: true,
        },
        {
          type: "Slot",
          slotName: "city",
          prop: "area",
          label: "区域",
          validator: [
            { validator: validate, trigger: "change", required: true },
          ],
        },
        {
          type: "Input",
          label: "详细地址",
          placeholder: "请输入详细地址",
          prop: "address",
          width: "30%",
          required: true,
        },
        {
          type: "Radio",
          label: "类型",
          prop: "type",
          options: this.$store.state.config.parking_type,
          required: true,
        },
        {
          type: "InputNumber",
          label: "可停放车辆",
          prop: "carsNumber",
          required: true,
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_disabled,
        },
        { type: "Slot", slotName: "amap", label: "位置" },
        {
          type: "Input",
          label: "经纬度",
          placeholder: "请在地图中进行地点选择",
          prop: "lnglat",
          disabled: true,
          validator: [
            {
              validator: validate,
              trigger: "change",
              required: true,
              message: "请选择地点",
            },
          ],
        },
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "primary",
          handler: () => this.formValidate(),
        },
        { label: "重置", key: "reset", handler: () => this.reset() },
      ],
      // id
      id: this.$route.query.id,
      // 地图配置
      option_map: {
        mapLoad: true,
      },
    };
  },
  components: { AMap, CityArea, VueForm },
  methods: {
    /** 确定按钮->提交表单 */
    formValidate() {
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.editParking() : this.addParking();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /** 重置 */
    reset() {
      //重置表单
      this.$refs.vueForm.$refs.form.resetFields();
      // 清除 cityAray 的值
      this.$refs.cityArea.clear();
      // 清除地图覆盖物
      this.$refs.amap.clearMarker();
    },
    /** 新增停车场API */
    addParking() {
      ParkingAdd(this.form_data)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          this.reset();
        })
        .catch((error) => {
          console.log("addParking error", error);
        });
    },
    /** 修改停车场API */
    editParking() {
      let requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.id;
      ParkingEdit(requestData)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          this.$router.push({
            name: "ParkingIndex",
          });
        })
        .catch((error) => {
          console.log("editParking error", error);
        });
    },
    /** 获取详情 */
    getDetaile() {
      if (!this.id) {
        return false;
      }
      ParkingDetailed({ id: this.id })
        .then((response) => {
          const data = response.data;
          // 还原数据
          for (let key in data) {
            // 接口请求出来的
            if (Object.keys(this.form_data).includes(key)) {
              this.form_data[key] = data[key];
            }
          }
          // 设置覆盖物(需要地图加载完成)
          const splitLnglat = data.lnglat.split(",");
          const lnglat = {
            lng: splitLnglat[0],
            lat: splitLnglat[1],
          };
          // 设置点覆盖物
          this.$refs.amap.setMarker(lnglat);
          // 初始化省市区
          this.$refs.cityArea.initDefault(data.region);
        })
        .catch((e) => {
          console.log("getDetaile error", e);
        });
    },
    // 回调函数
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    /** 1.获取并设置经纬度 */
    setLnglat(data) {
      this.form_data.lnglat = data.lnglat.value;
    },
    /** 2.根据区域设置地图的中心 */
    setMapCenter(data) {
      this.$refs.amap.setMapCenter(data.address);
    },
    /** 3.地图加载完成 */
    mapLoad() {
      this.getDetaile();
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
