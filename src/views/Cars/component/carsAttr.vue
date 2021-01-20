<template>
  <div>
    <CarsBasisAttr @getAttrList="getAttrList" />
    {{ countKm }}
    <el-row :gutter="15">
      <el-col :span="4" v-for="item in attr_data" :key="item.key">
        <span>{{ item.value }}</span>
        <el-input
          v-model="attr_item[attr_basis_data.key][item.key]"
          :placeholder="item.value"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CarsBasisAttr from "./carsBasisAttr";
export default {
  name: "CarsAttr",
  data() {
    return {
      attr_data: [], // 自定义属性数据
      attr_basis_data: {},
      // 数据集合
      attr_item: {},
      // 数据校验标准
      checked: false,
    };
  },
  components: { CarsBasisAttr },
  computed: {
    // 计算公里
    countKm() {
      let type = this.energyType;
      let electric = this.electric;
      let oil = this.oil;
      // 监听值变化时计算属性
      if (!this.checked) {
        this.$emit("update:countKm", 0);
        return "";
      }
      // 计算可行驶公里数
      let km = 0;
      // console.log(
      //   electric,
      //   this.attr_item.carsBody.battery_capacity,
      //   this.attr_item.basics.true_electric_consume
      // );
      switch (type) {
        case 1:
          km =
            (electric * this.attr_item.carsBody.battery_capacity) /
            this.attr_item.basics.true_electric_consume;
          break;
        case 2:
          km =
            (oil * this.attr_item.carsBody.tank_volume) /
            this.attr_item.basics.true_oil_consume;
          break;
        case 3:
          km =
            (oil * this.attr_item.carsBody.tank_volume) /
              this.attr_item.basics.true_oil_consume +
            (electric * this.attr_item.carsBody.battery_capacity) /
              this.attr_item.basics.true_electric_consume;
          break;
      }
      // console.log("km", km);
      // 返回值
      this.$emit("update:countKm", km.toFixed(2));
    },
  },
  // 在开发业务需求时，如果逻辑中需要 “多个对象同变化时” ，就可以用 computed 作监听
  // 只有一个对象变化，就可以用 watch
  beforeMount() {},
  methods: {
    getAttrList(data) {
      this.attr_basis_data = data.attr_basis_data;
      this.attr_data = data.attr_data;
      this.attrFormat();
    },
    // 数据格式化
    attrFormat() {
      // 自定义属性为空时，不执行
      if (this.attr_data.length == 0) {
        return false;
      }
      // 公用属性的 key
      const attrBasisKey = this.attr_basis_data.key;
      // 判断属性集合是否存在 公用属性的key，存在则不处理
      if (this.attr_item[attrBasisKey]) {
        return false;
      }
      // 处理自定义属性
      const attrJson = {};
      this.attr_data.forEach((item) => {
        attrJson[item.key] = "";
      });
      // 更新属性集合
      this.$set(this.attr_item, attrBasisKey, attrJson);
    },
    callbackValue() {
      this.$emit("update:value", JSON.stringify(this.attr_item));
    },
    // 字段符合校验
    validate() {
      switch (this.energyType) {
        case 1:
          if (
            this.attr_item.basics &&
            this.attr_item.basics.true_electric_consume &&
            this.attr_item.carsBody &&
            this.attr_item.carsBody.battery_capacity
          ) {
            this.checked = true;
          }
          break;
        case 2:
          if (
            this.attr_item.basics &&
            this.attr_item.basics.true_oil_consume &&
            this.attr_item.carsBody &&
            this.attr_item.carsBody.tank_volume
          ) {
            this.checked = true;
          }
          break;

        case 3:
          if (
            this.attr_item.basics &&
            this.attr_item.basics.true_electric_consume &&
            this.attr_item.basics.true_oil_consume &&
            this.attr_item.carsBody &&
            this.attr_item.carsBody.tank_volume &&
            this.attr_item.carsBody.battery_capacity
          ) {
            this.checked = true;
          }
          break;
      }
    },
  },
  props: {
    initValue: {
      type: String,
      default: "",
    },
    oil: {
      type: Number,
      default: 0,
    },
    electric: {
      type: Number,
      default: 0,
    },
    energyType: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    initValue: {
      handler(newValue) {
        console.log("init", newValue);
        if (newValue) {
          this.attr_item = JSON.parse(newValue);
          this.validate();
        }
      },
    },
    energyType() {
      this.validate();
    },
    oil() {
      this.validate();
    },
    electric() {
      this.validate();
    },
  },
};
</script>
<style lang="scss" scoped></style>
<!--
第一种情况：
实测油耗(L/100KM)  /   7.8L / 100KM
油箱容积 56L    
油量： 100 = 56L，50 = 28L，0 = 0L

总公里数：？  56 / 7.8 * 100KM = 717.94KM

56L

100 = 56L / 7.8 * 100KM = 717.94KM
50 = 28L / 7.8 * 100KM = 358.97KM
0 = 0 / 7.8 * 100KM = 358.97KM

油量100 * 油箱容积56L / 100 = 56L
油量50 * 油箱容积56L / 100 = 28L

100 = 56
-->
