import { ElMessage } from 'element-plus'
import router from '../router'
import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 30000  // 后台接口超时时间设置
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // 如果有token,添加到请求头
    const token = JSON.parse(localStorage.getItem('tokens'));
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token.access
    }
    console.log(token)
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        console.log(response)

        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    async error => {
        if (error.response) {
            if (error.response.status === 401) {

                // 如果路径中含有/token/refresh/，说明是刷新token的请求失败，直接返回登陆页
                if (error.response.config.url.includes('/token/refresh/')) {
                    localStorage.removeItem('tokens');
                    router.replace('/login');
                    return Promise.reject(error)
                }


                ElMessage({
                    type: 'error',
                    message: '登录过期，请重新登录',
                    duration: 3000
                });
                localStorage.removeItem('tokens');
                router.replace('/login');
            }
        }

        return Promise.reject(error)

    }
)


export default request
