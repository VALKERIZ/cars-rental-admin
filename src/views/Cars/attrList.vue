<template>
  <div>
    <TabalData ref="table" :config="table_config">
      <!--车辆公共属性-->
      <template v-slot:middle>
        <div class="margin-bottom-25">
          <el-button
            :type="cars_list_basis_type_id == item.id ? 'danger' : ''"
            size="small"
            v-for="item in cars_list_basis_item"
            :key="item.id"
            @click="getTypeList(item)"
          >
            {{ item.value }}
          </el-button>
        </div>
      </template>
    </TabalData>
    <AddCarsAttr
      :flagVisible.sync="dialog_show"
      :data="current_cars_type_data"
      @callbackComponent="callbackComponent"
    />
  </div>
</template>
<script>
// 组件
import TabalData from "@c/tableData";
import AddCarsAttr from "@c/dialog/addCarsAttr";
// API
import { GetCarsTypeBasis, GetCarsTypeList } from "@/api/carsAttr";
// common
import { address, yearCheckType, energyType } from "@/utils/common";
export default {
  name: "CarsAttrlist",
  data() {
    return {
      // 表格配置
      table_config: {
        // 不初始化请求
        isRequest: false,
        // 不分页
        pagination: false,
        thead: [
          { label: "属性", prop: "key" },
          { label: "描述", prop: "value" },
        ],
        url: "carsAttrList", // 真实URL请求地址
        data: {},
        form_item: [],
        form_handler: [
          {
            label: "新增车辆属性",
            prop: "add",
            type: "success",
            element: "button",
            handler: () => this.carsTypeAddDialog(),
          },
        ],
        form_config: {},
      },
      switch_disabled: "",
      // 车辆公用属性集合
      cars_list_basis_item: [],
      // 当前选中的车辆公用属性ID
      cars_list_basis_type_id: "",
      // 弹窗标记
      dialog_show: false,
      // 当前公用属性数据
      current_cars_type_data: {},
      // 上传请求的typeId
      last_type_id: "1",
    };
  },
  components: { TabalData, AddCarsAttr },
  created() {
    this.getCarsType();
  },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    // 获取车辆属性初始化
    async getCarsType() {
      const data = await this.getCarsTypeBasis();
      console.log(data);
      this.current_cars_type_data = data[0];
      this.cars_list_basis_type_id = data[0].id;
      //   默认表格加载列表第一项的数据
      this.getCarsTypeList();
    },
    // 获取车辆公用属性
    getCarsTypeBasis() {
      return GetCarsTypeBasis().then((response) => {
        const data = response.data.data;
        this.cars_list_basis_item = data;
        return data;
      });
    },
    // 点击按钮->请求对应属性数据
    getTypeList(data) {
      if (data.id == this.last_type_id) {
        return;
      }
      this.cars_list_basis_type_id = data.id;
      this.last_type_id = data.id;
      // 存储当前数据
      this.current_cars_type_data = data;
      this.getCarsTypeList();
    },
    // 获取车辆自定义属性的详细内容
    getCarsTypeList() {
      this.$refs.table.requestData({ typeId: this.current_cars_type_data.id });
    },
    // 弹窗
    carsTypeAddDialog() {
      if (!this.current_cars_type_data.id) {
        this.$message({
          message: "请选择车辆公共属性",
          type: "error",
        });
        return false;
      }
      this.dialog_show = true;
    },
  },
};
</script>
<style lass="scss" scoped></style>
