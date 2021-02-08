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
      // 触发更新
      let type = this.energyType;
      let electric = this.electric;
      let oil = this.oil;
      // 监听值变化时计算属性
      if (!this.checked) {
        this.$emit("update:countKm", "参数有误或缺失，无法计算");
        return "";
      }
      // 计算可行驶公里数
      let km = 0;
      let obj = this.$store.state.config.kmCalculate[type];
      let rs;
      for (let i in obj.type) {
        let preCondition = `this.attr_item.carsBody && this.attr_item.basics && this.attr_item.${obj.type[i]}&&this.attr_item.${obj.consume[i]}`;
        if (eval(preCondition)) {
          let expression = `${obj.label[i]} * this.attr_item.${obj.type[i]} / this.attr_item.${obj.consume[i]}`;
          rs = eval(expression);
          km += rs;
        }
      }
      // 返回值
      this.$emit("update:countKm", km.toFixed(2));
    },
  },
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
      let obj = this.$store.state.config.kmCalculate[this.energyType];
      let rs = false;
      for (let i in obj.type) {
        let condition = `this.attr_item.${obj.type[i]}&&this.attr_item.${obj.consume[i]}`;
        if (Object.keys(this.attr_item).length > 0 && condition) {
          rs = true;
        } else {
          rs = false;
        }
      }
      this.checked = rs;
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
