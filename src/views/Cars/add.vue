<template>
  <div>
    <VueForm
      ref="vueForm"
      :formData="form_data"
      :formItme="form_item"
      :formHandler="form_handler"
    >
      <!-- 1.保养日期 -->
      <template v-slot:maintain>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-date-picker
              v-model="form_data.maintainDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-row>
      </template>
      <!-- 2.能源类型 -->
      <template v-slot:energy>
        <el-radio-group v-model="form_data.energyType" @change="energyReset">
          <el-radio
            v-for="item in energyType"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
        <div
          class="progress-bar-wrap"
          v-if="form_data.energyType == 3 || form_data.energyType == 1"
        >
          <span class="label-text">电量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <div
          class="progress-bar-wrap"
          v-if="form_data.energyType == 3 || form_data.energyType == 2"
        >
          <span class="label-text">油量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>
      <!-- 3.车辆属性 -->
      <template v-slot:carsAttr>
        <CarsAttr
          ref="carsAttr"
          :oil="form_data.oil"
          :electric="form_data.electric"
          :initValue="form_data.carsAttr"
          :energyType="form_data.energyType"
          :countKm.sync="form_data.countKm"
          :value.sync="form_data.carsAttr"
        />
      </template>
      <!-- 4.租赁价格 -->
      <template v-slot:lease>
        <el-row :gutter="20">
          <el-col
            :span="4"
            v-for="item in form_data.leasePrice"
            :key="item.carsLeaseTypeId"
          >
            <div>{{ item.carsLeaseTypeName }}</div>
            <el-input-number
              v-model="item.price"
              controls-position="right"
              :min="0"
              :max="10000"
              placeholder="请输入价格"
              style="width: 100%;"
            ></el-input-number>
          </el-col>
        </el-row>
      </template>
    </VueForm>
  </div>
</template>
<script>
// 组件
import VueForm from "@c/form";
import CarsAttr from "./component/carsAttr";

// API
import { GetCarsBrand, GetParking } from "@/api/common";
import { CarsInfoAdd, CarsInfoEdit, CarsInfoDetailed } from "@/api/cars";
import { LeaseList } from "@/api/lease";
export default {
  name: "CarsAdd",
  components: { VueForm, CarsAttr },
  data() {
    return {
      // id
      id: this.$route.query.id,
      // 富文本对象
      editor: null,
      // 能源类型
      energyType: this.$store.state.config.energyType,
      form_item: [
        {
          type: "Select",
          label: "车辆品牌",
          placeholder: "请选择车辆品牌",
          prop: "carsBrandId",
          select_value: "id",
          select_label: "nameCh",
          options: [],
          required: true,
        },
        {
          type: "Select",
          label: "停车场",
          placeholder: "请选择停车场",
          select_value: "id",
          select_label: "parkingName",
          prop: "parkingId",
          options: [],
          required: true,
        },
        {
          type: "Input",
          label: "车辆型号",
          placeholder: "请输入车辆型号",
          prop: "carsMode",
          required: true,
        },
        {
          type: "Input",
          label: "车牌号",
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          required: true,
        },
        {
          type: "Input",
          label: "车架号",
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          required: true,
        },
        {
          type: "Upload",
          label: "缩略图",
          prop: "carsImg",
        },
        {
          type: "Input",
          label: "发动机号",
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          required: true,
        },
        {
          type: "Radio",
          label: "年检",
          prop: "yearCheck",
          options: this.$store.state.config.year_check,
        },
        {
          type: "Slot",
          slotName: "maintain",
          prop: "maintainDate",
          label: "保养日期",
        },
        {
          type: "Radio",
          label: "档位",
          placeholder: "请选择档位",
          prop: "gear",
          options: this.$store.state.config.gear,
        },
        {
          type: "Slot",
          slotName: "energy",
          prop: "energyType",
          label: "能源类型",
        },

        {
          type: "Input",
          label: "可行驶公里",
          prop: "countKm",
          disabled: true,
        },
        {
          type: "Slot",
          slotName: "carsAttr",
          prop: "carsAttr",
          label: "车辆属性",
        },
        {
          type: "Slot",
          slotName: "lease",
          prop: "lease",
          label: "租赁价格",
        },
        {
          type: "Disabled",
          label: "禁启用",
          placeholder: "请选择禁启用",
          prop: "status",
        },
        {
          type: "Wangeditor",
          prop: "content",
          label: "车辆描述",
        },
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.formValidate(),
        },
        { label: "重置", key: "reset", handler: () => this.reset() },
      ],
      form_data: {
        parkingId: "",
        carsBrandId: "",
        carsMode: "",
        carsNumber: "",
        carsFrameNumber: "",
        engineNumber: "",
        carsImg: "",
        yearCheck: true,
        gear: 1,
        leasePrice: [],
        energyType: 1,
        electric: 0,
        oil: 0,
        carsAttr: "",
        countKm: "",
        content: "",
        maintainDate: "",
        status: true,
      },
      // 车辆品牌列表
      carsBrandList: [],
      // 上传文件配置
      uploadData: {
        token: "",
      },
    };
  },
  beforeMount() {
    this.getCarsBrandList();
    this.getParkingList();
    this.getLeaseList();
    if (this.id) {
      this.getDetailed();
    }
  },
  methods: {
    formValidate() {
      this.formatCarsAttr();
      console.log("223", this.form_data);
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.edit() : this.add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /** 车辆属性格式化 */
    formatCarsAttr() {
      this.$refs.carsAttr.callbackValue();
    },
    edit() {
      CarsInfoEdit({
        ...this.form_data,
        id: this.id,
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        this.$router.push({ path: "/carsIndex" });
      });
    },
    add() {
      CarsInfoAdd({ ...this.form_data }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        // this.$router.push({ path: "/carsIndex" });
        this.reset();
      });
    },
    // 重置
    reset() {
      //重置表单
      this.$refs.vueForm.$refs.form.resetFields();
      // 油量、电量重置
      this.energyReset();
      // 租赁价格还原
      this.form_data.leasePrice.forEach((i) => {
        i.price = 0;
      });
      // 车辆属性不重置
    },
    /** 获取详情 */
    getDetailed() {
      CarsInfoDetailed({ id: this.id })
        .then((response) => {
          const data = response.data;
          if (!data) {
            return false;
          }
          for (let key in data) {
            if (Object.keys(this.form_data).includes(key)) {
              this.form_data[key] = data[key];
            }
          }
          console.log(this.form_data);
        })
        .catch((e) => {
          console.log("getDetailed error", e);
        });
    },
    /** 获取租赁列表 */
    getLeaseList() {
      // id存在则不请求
      if (this.id) {
        return false;
      }
      LeaseList().then((response) => {
        const data = response.data.data;
        if (data) {
          this.form_data.leasePrice = data;
        }
      });
    },
    // 获取车辆品牌
    getCarsBrandList() {
      GetCarsBrand()
        .then((response) => {
          const data = response.data.data;
          if (data) {
            const carsBrand = this.form_item.filter(
              (item) => item.prop == "carsBrandId"
            );
            if (carsBrand.length > 0) {
              carsBrand[0].options = data;
            }
          }
        })
        .catch((e) => {
          console.log("getCarsBrandList error", e);
        });
    },
    // 获取停车场
    getParkingList() {
      GetParking()
        .then((response) => {
          const data = response.data.data;
          if (data) {
            const parking = this.form_item.filter(
              (item) => item.prop == "parkingId"
            );
            if (parking.length > 0) {
              parking[0].options = data;
            }
          }
        })
        .catch((e) => {
          console.log("getParkingList error", e);
        });
    },
    energyReset() {
      this.form_data.oil = 0;
      this.form_data.electric = 0;
    },
  },
};
</script>
<style lang="scss">
.cars-attr-list {
  margin-top: 15px;
  overflow: hidden;
}
</style>
