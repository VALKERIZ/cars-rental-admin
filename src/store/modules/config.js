const state = {
    // 搜索or列表->停车场类型
    parking_type_json: {
        1: { label: "室内", value: "1" },
        2: { label: "室外", value: "2" },
    },
    // 新增or修改 ->停车场类型
    parking_type: [
        { label: "室内", value: 1 },
        { label: "室外", value: 2 },
    ],
    // 禁用、启用
    radio_disabled: [
        { label: "禁用", value: false },
        { label: "启用", value: true },
    ],
    // 年检
    year_check: [
        { label: "未年检", value: false },
        { label: "已年检", value: true },
    ],
    // 档位
    gear: [
        { label: "手动", value: 1 },
        { label: "自动", value: 2 },
        { label: "人工智能", value: 3 },
    ],
    // 能源类型
    energyType: [{
            label: "电",
            value: 1,
        },
        {
            label: "油",
            value: 2,
        },
        {
            label: "混合动力",
            value: 3,
        },
    ],
    // 公里数计算
    kmCalculate: {
        //   电
        1: {
            label: ["electric"],
            type: ["carsBody.battery_capacity"],
            consume: ["basics.true_electric_consume"],
        },
        // 油
        2: {
            label: ["oil"],
            type: ["carsBody.tank_volume"],
            consume: ["basics.true_oil_consume"],
        },
        // 混合动力
        3: {
            label: ["electric", "oil"],
            type: ["carsBody.battery_capacity", "carsBody.tank_volume"],
            consume: ["basics.true_electric_consume", "basics.true_oil_consume"],
        },
    },
    // 性别
    gender: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
    ],
    // 黑名单
    blacklist: [
        { label: "是", value: true },
        { label: "否", value: false },
    ],
    // 关键字搜索
    keyword_options: [
        { label: "停车场名称", value: "parkingName" },
        { label: "详细区域", value: "address" },
        { label: "属性", value: "key" },
        { label: "描述", value: "value" },
        { label: "用户名", value: "username" },
        { label: "真实姓名", value: "truename" },
        { label: "身份证", value: "card_id" },
        { label: "订单号", value: "order_no" },
        { label: "订单状态", value: "order_status" },
    ],
    // 订单状态
    order_status: {
        WAIT: {
            zh: "待取车",
        },
        OVERTIME: {
            zh: "超时",
        },
        OVER: {
            zh: "完成",
        },
        CANCEL: {
            zh: "取消",
        },
        RETURN: {
            zh: "待还车",
        },
    },
    // 车辆状态
    cars_status: {
        WAIT: {
            zh: "已预约",
        },
        DRIVING: {
            zh: "行驶中",
        },
        CHEDK: {
            zh: "年检",
        },
        MAINTAIN: {
            zh: "保养",
        },
        REPAIR: {
            zh: "维修",
        },
    },
};
export default {
    namespaced: true,
    state,
};