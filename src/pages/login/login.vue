<template>
    <div @keydown.enter="login">
        <div class="logo"></div>
        <div class="main">
        <div class="login-content">
            <div class="title"></div>
            <div class="username-box row">
            <div class="ipt-box">
                <input
                placeholder="请输入账号"
                v-model.trim="username"
                @change="change"
                :class="'username-ipt' + (usernameError?' error':'')"
                type="text"
                />
            </div>
            </div>
            <div class="passwd-box row">
            <div class="ipt-box">
                <input
                placeholder="请输入密码"
                v-model.trim="passwd"
                @change="change"
                :class="'passwd-ipt' + (passwdError?' error':'')"
                type="password"
                />
            </div>
            </div>
            <div class="vcode-box row">
            <div class="ipt-box">
                <input placeholder v-model.trim="vcode" :class="'vcode-ipt' + (vcodeError?' error':'')" @change="change" type="text" />
                <div class="vcode" @click="getVCode" alt="换一个" title="换一个">
                <!-- <img
                    id="captcha_img"
                    :src="vcodeSrc"
                    alt="换一个"
                    title="换一个"
                    @click="changeVcode"
                    style="cursor:pointer;vertical-align:middle;"
                /> -->
                {{vcodeSrc}}
                </div>
            </div>
            </div>
            <input type="button" class="login-btn" @click="login" value="登  陆" />
        </div>
        </div>
        <alert v-bind:isShow="showAlert" v-bind:alertParams="alertParams" @alertOkClicked="alertOkClicked"></alert>
    </div>
</template>
<script>
import MD5 from 'js-md5'
import request from '../../axios'
import Setting from '@/setting'
import qs from 'qs'
import VueCookies from 'vue-cookies'
import Alert from '@/components/common/alert.vue'
import Vue from 'vue'
import setting from '@/setting'

Vue.use(VueCookies)

// import axios from 'axios'

export default {
    data: () => {
        return {
            vcodeSrc: '',
            token: '',
            username: "",
            passwd: "",
            vcode: "",
            passwdError: false,
            usernameError: false,
            vcodeError: false,
            sign: 'STATISTICS',
            showAlert: false,
            alertParams: {header: '', content: ''}
        };
    },
    components: {
        alert: Alert
    },
    created: function(){
        this.getVCode()
    },
    methods: {
        alertOkClicked: function(){
            this.showAlert = false
        },
        alert: function(str){
            console.log(str)
            this.alertParams.header = '操作提示'
            this.alertParams.content = str
            this.showAlert = true
        },
        getVCode: function(){
            request({
                url: setting.urls.vcode,
                method: 'get',
                params: {}
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.token = rst.data.token
                        this.vcodeSrc = rst.data.code
                    }else{
                        this.alert(rst.message || '获取验证码失败')
                    }
                }else{
                    this.alert('获取验证码失败')
                }
            }).catch((error) => {
                console.log(error)
                this.alert('获取验证码失败')
            })
        },
        // changeVcode: function() {
        //     // console.log(123);
        //     // this.vcodeSrc = this.vcodeSrc.split("?")[0] + "?" + new Date().getTime();
        //     this.getVCode()
        // },
        login: function() {
            if (this.username == null || this.username == "" || this.username == undefined) {
                this.usernameError = true;
                return;
            }
            if(this.passwd == null || this.passwd == "" || this.passwd == undefined){
                this.passwdError = true;
                return;
            }
            if(this.vcode == null || this.vcode == "" || this.vcode == undefined){
                this.vcodeError = true;
                return;
            }
            
            request({
                url: setting.urls.login,
                method: 'post',
                data: qs.stringify({
                    username: this.username,
                    passwd: MD5(this.sign + "_" + this.passwd),
                    'verify_code': this.vcode,
                    token: this.token
                })
            })
                .then((response) => {
                    if(response.status == 200){
                        const resp = response.data;
                        console.log(resp)
                        if(resp.code == 200){
                            this.$cookies.set('skey', resp.data.skey)
                            this.$cookies.set('adminType', resp.data.log_show)
                            const date = new Date()
                            date.setHours(date.getHours() + 6)
                            // this.$cookies.set('PHPSESSID', resp.data.session_id, date, '/', setting.baseUrl, false)
                            // console.log(resp)
                            window.location.href = './index.html'
                        }else{
                            this.alert(resp.message);
                        }
                    }
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        change: function(){
            console.log(123);
        }
    },
    computed: {},
    watch: {
        vcode: function(){
            if(!this.vcode){
                this.vcodeError = true;
            }else{
                this.vcodeError = false;
            }
        },
        username: function(){
            this.usernameError = !this.username;
        },
        passwdError: function(){
            this.passwdError = !this.passwd;
        }
    }
};
</script>
<style>
/* ====== 登陆 ====== */
body.login {
    background: url(../../assets/bj.jpg) no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding-top: 2.09375em;
}
.login .logo {
    width: 5.25rem;
    height: 5.1587rem;
    background: url(../../assets/logo1.png) no-repeat;
    background-size: 100% 100%;
    margin-left: 2em;
}
.main {
    width: 15.1562rem;
    height: 16.2rem;
    background-color: #ffffff;
    text-align: center;
    border-radius: 0.3125rem;
    box-sizing: border-box;
    padding: 1.1875rem 1.1875rem 1rem;
    margin-left: 37.3125rem;
    margin-top: 2.8rem;
}
.main .title {
    background: url(../../assets/logo2.png) no-repeat;
    background-size: 100% 100%;
    width: 2.234375em;
    height: 2.0625em;
    margin: auto;
}
.row {
    display: flex;
    flex-direction: row;
    height: 1.875em;
    line-height: 1.875em;
    width: 100%;
    margin-top: 0.625em;
}
.row:first-child {
    margin-top: 1.25em;
}
.ipt-box {
    display: inline-block;
    text-align: left;
    box-sizing: border-box;
    width: 100%;
}
.ipt-box input {
    padding: 0em 0.5625rem;
    height: 100%;
    border: none;
    outline: none;
    width: 100%;
    background-color: #f0f1f6;
    box-sizing: border-box;
    font-size: 0.8125em;
    color: #3a4376;
    border-radius: 0.1875rem;
}
.ipt-box input.error {
    border-color: orangered;
    border-width: 1px;
    border-style: solid;
}
.vcode-box .ipt-box input {
    display: inline-block;
    width: 40%;
}
.login-btn {
    height: 1.875rem;
    line-height: 1.875rem;
    background-color: #4381e6;
    width: 100%;
    color: white;
    border-radius: 0.1875rem;
    border: none;
    margin: auto;
    margin-top: 1.9375rem;
    font-size: 0.6125rem;
    font-weight: bold;
}
.vcode {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    width: 54%;
    margin-left: 4%;
    background-color: #f0f1f6;
    vertical-align: middle;
}
</style>