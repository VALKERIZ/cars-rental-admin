<template>
  <div>
    <!-- 表格数据 -->
    <TabalData ref="table" :config="table_config">
      <!--操作-->
      <!-- <template v-slot:operation="slotData">
        <el-button type="danger" size="small" :disabled="!slotData.data.blacklist"
          >黑名单</el-button
        >
      </template> -->
    </TabalData>
  </div>
</template>
<script>
import TabalData from "@c/tableData";

export default {
  name: "Merber",
  components: { TabalData },
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          {
            label: "用户名",
            prop: "username",
            width: 150,
          },
          {
            label: "真实姓名",
            prop: "truename",
            width: 150,
          },
          {
            label: "租车订单",
            prop: "order",
            width: 150,
          },
          {
            label: "违章预存金",
            prop: "illegalAmount",
            width: 200,
          },
          {
            label: "实名认证",
            prop: "check_real_name",
            type: "function",
            callback: (row) => {
              return row.check_real_name ? "已认证" : "-";
            },
          },
          {
            label: "驾驶证",
            prop: "check_cars",
            type: "function",
            callback: (row) => {
              return row.check_cars ? "已认证" : "-";
            },
          },
          {
            label: "黑名单",
            prop: "blacklist",
            type: "function",
            callback: (row) => {
              return row.blacklist ? "是" : "-";
            },
          },
          {
            label: "操作",
            type: "operation",
            width: 200,
            buttonGroup: [
              {
                event: "link",
                label: "查看/编辑",
                type: "danger",
                name: "MemberInfo",
                key: "id",
                value: "memberId",
              },
            ],
            default: {
              deleteButton: true,
            },
            slotName: "operation",
          },
        ],
        url: "memberList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
        form_item: [
          {
            label: "关键字",
            type: "Keyword",
            options: ["username", "truename", "card_id"],
          },
        ],
        form_config: {
          searchButton: true,
          resetButton: true,
        },
      },
    };
  },
  methods: {},
};
</script>
<style lass="scss" scoped></style>
