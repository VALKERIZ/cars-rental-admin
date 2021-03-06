import axios from "axios";
// cookies
import { getToken, getUsername } from "./cookies";
// ElementUI 单独引入
import { Message } from "element-ui";
// 创建实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API, // 请求地址
    timeout: 3000, // 超时
});

// 拦截器
// 添加请求拦截器
service.interceptors.request.use(
    function(config) {
        // 在发送请求之前做些什么
        config.headers["Token"] = getToken(); // 携带token
        config.headers["Username"] = getUsername(); // 携带token
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        console.log("Request error", error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    function(response) {
        const data = response.data;
        // 不为0，即接口相应异常时；如登录校验失败resCode=1004
        if (data.resCode !== 0) {
            Message.error(data.message);
            return Promise.reject(data);
        } else {
            return data; // return Promise.resolve(data);
        }
    },
    // 对响应错误做点什么
    function(error) {
        let message = error.message;
        // 请求超时处理
        if (error.message.indexOf("timeout") !== -1) {
            message = "请求接口超时，请重试！！";
        }
        Message.error(message);
        return Promise.reject(error);
    }
);
// 暴露service
export default service;