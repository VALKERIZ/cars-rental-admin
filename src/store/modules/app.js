import {
    setToken,
    setUsername,
    getUsername,
    removeToken,
    removeUsername,
} from "@/utils/cookies";
import { Login } from "@/api/login";
const state = {
    collapse: JSON.parse(sessionStorage.getItem("collapse")) || false, //控制侧边栏收起和打开
    token: "",
    username: "" || getUsername(),
};
const getters = {};
const mutations = {
    SET_COLLAPSE(state) {
        state.collapse = !state.collapse;
        sessionStorage.setItem("collapse", String(state.collapse));
    },
    SET_TOKEN(state, value) {
        state.token = value;
    },
    SET_USERNAME(state, value) {
        state.username = value;
    },
};
const actions = {
    loginAction(content, requestData) {
        return new Promise((resolve, reject) => {
            Login(requestData).then((response) => {
                let data = response.data;
                // console.log("loginData", data);
                content.commit("SET_TOKEN", data.token);
                content.commit("SET_USERNAME", data.username);
                setToken(data.token);
                setUsername(data.username);
                resolve(response);
            });
        });
    },
    logoutAction({ commit }) {
        return new Promise((resolve, reject) => {
            removeToken();
            removeUsername();
            commit("SET_TOKEN", "");
            commit("SET_USERNAME", "");
            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};