import service from "../utils/request";
/** 获取汽车标志 */
export function BrandLogo(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/logo/",
        data,
    });
}

/** 添加 */
export function BrandAdd(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/add/",
        data,
    });
}

/** 禁启用 */
export function BrandStatus(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/status/",
        data,
    });
}

/** 修改 */
export function BrandEdit(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/edit/",
        data,
    });
}