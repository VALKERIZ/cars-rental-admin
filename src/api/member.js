import service from "../utils/request";
/** 会员详情 */
export function Detailed(data = {}) {
    return service.request({
        method: "post",
        url: "/member/detailed/",
        data,
    });
}

/** 会员信息修改 */
export function Edit(data = {}) {
    return service.request({
        method: "post",
        url: "/member/edit/",
        data,
    });
}

/** 会员认证状态修改 */
export function AuthChange(data = {}) {
    return service.request({
        method: "post",
        url: "/member/updateRealName/",
        data,
    });
}

/** 会员金额清空 */
export function AmountClear(data = {}) {
    return service.request({
        method: "post",
        url: "/member/amountClear/",
        data,
    });
}