<template>
  <el-cascader
    filterable
    class="width-300"
    :class="{ 'cascader-input': initValueFlag }"
    :placeholder="initValue"
    v-model="value"
    :options="cascader_options"
    :props="cascader_props"
    @change="changeValue"
  ></el-cascader>
</template>

<script>
// API
import { GetCity } from "@/api/common";
export default {
  name: "CityArea",
  data() {
    const _this = this;
    return {
      address: [],
      addressData: {},
      value: [],
      cascader_options: [],
      cascader_props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const level = node.level;
          // 请求参数
          const requestData = {};
          // 声明自定义配置
          const jsonType = {
            0: { type: "province" },
            1: { type: "city", code: "province" },
            2: { type: "area", code: "city" },
          };

          if (jsonType[level].code) {
            requestData[`${jsonType[level].code}_code`] = node.value;
          }
          // type
          requestData.type = jsonType[level].type;
          // 省市区的接口
          GetCity(requestData)
            .then((resonse) => {
              const data = resonse.data.data;
              // 类型
              const type = jsonType[level].type.toUpperCase();
              // 自定义value、label
              data.forEach((item) => {
                item.value = item[`${type}_CODE`];
                item.label = item[`${type}_NAME`];
                // 最后一层选择；leaf为true时则节点数据为叶子节点
                if (level === 2) {
                  item.leaf = level >= 2;
                }
              });
              // 存储省市区数据
              _this.addressData[jsonType[level].type] = data;
              // 返回节点数据
              resolve(data);
            })
            .catch((e) => {
              console.log("GetCity error", e);
              this.lazyLoad(node, resolve);
            });
          // 获取address
          if (node.level !== 0) {
            _this.getAddress(node);
          }
        },
      },
      initValue: "请选择省市区",
      initValueFlag: false,
    };
  },
  methods: {
    /** 初始化默认值  */
    initDefault(value) {
      if (value) {
        this.initValueFlag = true;
        // 利用placeholder来模仿级联选择框
        this.initValue = value.split(",").join(" / ");
      }
    },
    // 整个级联选择完成后触发
    changeValue(value) {
      this.$emit("update:cityAreaValue", value.join());
      // 匹配最后一项，区县
      const lastCode = value[value.length - 1];
      const area = this.addressData.area.filter(
        (item) => item.value == lastCode
      )[0];
      this.address[2] = area.label;
      this.getAddress();
    },
    /** 获取所选节点对应的中文 */
    getAddress(node) {
      if (node) {
        const index = node.level - 1;
        this.address[index] = node.label;
      }
      // 为 true 时，执行地图定位交互
      if (this.mapLocation) {
        this.$emit("callback", {
          function: "setMapCenter",
          data: {
            address: this.address.join(""),
          },
        });
      }
    },
    /** 清空，初始化 */
    clear() {
      this.initValueFlag = false;
      this.initValue = "请选择省市区";
      this.value = "";
      this.$emit("update:cityAreaValue", this.value);
    },
  },
  components: {},
  props: {
    // 配置
    mapLocation: {
      type: Boolean,
      default: false,
    },
    cityAreaValue: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped></style>
