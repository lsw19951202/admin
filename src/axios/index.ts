import axios from 'axios'
import Setting from '@/setting'
import VueCookies from 'vue-cookies'
import Vue from 'vue'

Vue.use(VueCookies)

// let lastReadirectTime = 0
let requestNum = 0

const instance = axios.create({
    baseURL: Setting.baseUrl,
    timeout: 6000
})

instance.defaults.responseType = 'json'

instance.interceptors.request.use(
    config => {
        // if((new Date().getTime() > lastReadirectTime) && (new Date().getTime() - lastReadirectTime) < 1000){
        //     return Promise.reject(config)
        // }
        requestNum++
        if(config.url != '/login/login' && config.url != '/login/captcha'){
            config.params = config.params || {}
            // console.log(VueCookies.get('skey'))
            config.params.skey = Vue.$cookies.get('skey')
            // config.params.id = 1
            // console.log(config)
        }
        // console.log(config)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(response => {
    // 如果用户未登录，或者session过期
    if(response.data.code == 100100001 && requestNum == 1){
        // if(new Date().getTime() - lastReadirectTime > 1000){
        //     lastReadirectTime = new Date().getTime()
            alert(response.data.message)
            requestNum = 0
            window.location.href = "./login.html"
        // }
    }else{
        requestNum--
    }
    return response
}, error => {
    return error
})

export default instance