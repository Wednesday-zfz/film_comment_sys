import {ElMessage} from 'element-plus'
import router from '../router'
import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 30000  // 后台接口超时时间设置
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
request.interceptors.request.use(config => {
    // 如果有token,添加到请求头
    const token = JSON.parse(localStorage.getItem('tokens'));
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token.access
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        return response.data
    },
    async error => {
        if (error.response) {
            if (error.response.status === 401) {
                // 如果路径中含有/token/refresh/，说明是刷新token的请求失败，直接返回登陆页
                if (error.response.config.url.includes('/token/refresh/')) {
                    ElMessage({
                        type: 'error',
                        message: '登录过期，请重新登录',
                        duration: 3000
                    });
                    localStorage.removeItem('tokens');
                    router.replace('/login');
                    return Promise.reject(error)
                }

                // 如果是401错误，说明token过期，需要刷新token
                // 1. 判断是否有refresh token
                const token = JSON.parse(localStorage.getItem('tokens'));
                console.log(token)
                if (token && token.refresh) {
                    // 2. 有refresh token, 发送请求刷新token
                    const res = await request.post('/token/refresh/', {
                        refresh: token.refresh
                    });
                    if (res.status === "success") {
                        console.log('刷新token成功');
                        localStorage.setItem('tokens', JSON.stringify({
                            access: res.data.access,
                            refresh: token.refresh
                        }));
                        const res2 = await request.get('/user/');
                        localStorage.setItem('user', JSON.stringify(res2.data));
                        return request(error.config)
                    } else {
                        // 3. 刷新token失败，返回登陆页
                        ElMessage({
                            type: 'error',
                            message: '登录过期，请重新登录',
                            duration: 3000
                        });
                        localStorage.removeItem('tokens');
                        router.replace('/login');
                        return Promise.reject(error)
                    }
                } else {
                    // 6. 没有refresh token, 直接返回登陆页
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
    }
)


export default request
