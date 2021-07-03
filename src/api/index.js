import axios from "axios";
import {
  message
} from "ant-design-vue";
import _this from "../main.js";

export const $axios_qfy = axios.create({});
// 拦截器 全局处理ajax request
$axios_qfy.interceptors.request.use(
  function (config) {
    // todo 处理接口前面，添加v9.0
    config.url = '/v9.0' + config.url;
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    const params = config.params || {};
    let slimParams = {};
    for (const key in params) {
      if (params[key] !== "") {
        slimParams[key] = params[key];
      }
    }
    // console.log(config)
    if (config.method === "get") {
      config.params = {
        ...slimParams,
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//全局处理ajax Error
$axios_qfy.interceptors.response.use(function (response) {
  // console.log(response)
  if (response.status == 200) {
    if (response.data.status === false) {
      message.error(response.data.errorMsg);
      return Promise.reject(response);
    }else {
      return Promise.resolve(response.data);
    }
  } else {
    message.error(response.data.desc);
    return Promise.reject(response);
  }
}, function (error) {
  console.log(error, error.response, external)
  message.error(`接口地址：${error.response.config.url}，状态信息statusText：${error.response.statusText}`);
  if (external.call) {
    external.call("CppRefreshPage", {
      url: "0"
    }, (error, result) => {
      console.log(result)
    })
  }
  return Promise.reject(error);
});