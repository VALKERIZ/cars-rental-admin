<template>
  <el-dialog
    :title="data.parkingName"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @close="close"
    @opened="opened"
    :close-on-click-modal="false"
  >
    <div style="height: 500px;"><AMap ref="aMap" /></div>
  </el-dialog>
</template>

<script>
// 组件
import AMap from "@/views/amap";
export default {
  name: "ShowMapLocation",
  components: { AMap },
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 弹窗显示/关闭标记
      dialogVisible: false,
    };
  },
  methods: {
    opened() {
      const splitLnglat = this.data.lnglat.split(",");
      const lnglat = {
        lng: splitLnglat[0],
        lat: splitLnglat[1],
      };
      this.$refs.aMap.mapCreate(splitLnglat);
      this.$nextTick(() => {
        this.$refs.aMap.setMarker(lnglat);
      });
    },
    close() {
      this.$refs.aMap.mapDestroy();
      this.$emit("update:flagVisible", false);
    },
  },
  watch: {
    flagVisible: {
      handler(newValue) {
        this.dialogVisible = newValue;
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
