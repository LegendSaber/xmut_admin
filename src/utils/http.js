import axiosIns from 'axios'
import { Notification } from 'element-ui'
import qs from 'qs'

//设置全局的请求参数，请求的间隙
axiosIns.defaults.baseURL = 'http://localhost:8888/xmut'
axiosIns.defaults.retry = 4
axiosIns.defaults.retryDelay = 1000
axiosIns.defaults.timeout = 10000
axiosIns.defaults.withCredentials = true //让ajax携带cookie

//添加请求拦截器
axiosIns.interceptors.request.use(config => {
    config.headers = Object.assign(config.headers, {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
    })

    let token = window.sessionStorage.getItem("token")

    if (token) {
        config.headers = Object.assign(config.headers, {
            'token': token
        })
    }
    config.data = qs.stringify(config.data)

    return config
}, err => {
    //对错误请求进行处理
    console.log("错误的传参")
    return Promise.reject(err)
})

//添加返回拦截器
axiosIns.interceptors.response.use(response => {
    return response
}, error => {
    // 请求错误时做些事
    // 请求超时的之后，抛出 error.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        Notification.error({
            title: '温馨提示',
            message: '网络连接超时',
            position: 'top-right'
        })
        return Promise.reject(error)
    } else {
        if (error.message === 'Network Error' || error.response.status === 504 || error.response.status === 500) {
            Notification.error({
                title: '温馨提示',
                message: '服务器连接异常',
                position: 'top-right'
            })
            return Promise.reject(error)
        } else {
            if (error.response.status === 400 || error.response.status === 401 || error.response.status === 404) {
                Notification.error({
                    title: '温馨提示',
                    message: error.response.message,
                    position: 'top-right'
                })
                return Promise.reject(error)
            } else {
                return Promise.resolve(error.response)
            }
        }
    }
})

export default {
    /**
     * Get方法
     * @param {*} url
     * @param {*} params
     */
    get: function(url, params = {}) {
        return new Promise(function(resolve, reject) {
            axiosIns.get(url, {
                params: params
            }).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    /**
     * Post方法
     * @param {*} url
     * @param {*} params
     */
    post: function(url, params = {}) {
        return new Promise(function(resolve, reject) {
            axiosIns.post(url, params).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    /**
     * put方法
     * @param {*} url
     * @param {*} params
     */
    put: function(url, params = {}) {
        return new Promise(function(resolve, reject) {
            axiosIns.put(url, params).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    /**
     * delete方法
     * @param {*} url
     * @param {*} params
     */
    delete: function(url, params = {}) {
        return new Promise(function(resolve, reject) {
            axiosIns.delete(url, params).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}