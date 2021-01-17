<template>
  <div class="amap-wrap">
    <el-amap vid="amapContainer" :events="events" class="amap-demo"></el-amap>
  </div>
</template>
<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
// 方法
import { getLngLat } from "./common";
import { addressSetMapCenter } from "./location";
import { amapSetMarker, amapClearMarker } from "./marker";
export default {
  name: "Amap",
  data() {
    return {
      // 经纬度
      lnglat: {},
      map: null,
      zoom: 15,
      events: {},
    };
  },
  mounted() {
    console.log(lazyAMapApiLoaderInstance);
    // lazyAMapApiLoaderInstance 为了加载高德地图的API
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapCreate();
      this.map.on("click", (e) => {
        const lnglat = getLngLat(e);
        // 更新经纬度
        this.lnglat = lnglat;
        // 回调父组件方法
        this.$emit("callback", {
          function: "setLnglat",
          data: {
            lnglat,
          },
        });
        // 设置点覆盖物
        this.setMarker(lnglat);
      });
    });
  },
  methods: {
    // 创建地图
    mapCreate(params) {
      this.map = new AMap.Map("amapContainer", {
        center: params,
        zoom: this.zoom, //初始化地图层级
      });
      this.map.on("complete", () => {
        this.mapLoad();
      });
    },
    /**
     * 地图加载完成
     */
    mapLoad() {
      if (this.options.mapLoad) {
        this.$emit("callback", {
          function: "mapLoad",
        });
      }
    },
    // 销毁地图
    mapDestroy() {
      this.map && this.map.destroy();
    },
    // 设置地图中心
    setMapCenter(value) {
      addressSetMapCenter(value, this.map);
    },
    // 设置点覆盖物
    setMarker(lnglat) {
      amapSetMarker(lnglat || this.lnglat, this.map);
    },
    /** 清除点覆盖物 */
    clearMarker() {
      amapClearMarker(this.map);
    },
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          mapLoad: false,
        };
      },
    },
  },
};
</script>
<style lang="scss">
.amap-wrap {
  height: 100%;
}
</style>
