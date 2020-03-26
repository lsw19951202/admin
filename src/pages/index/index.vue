<template>
    <div style="width: 100%; height: 100%;">
        <cover :isShow="isShowCover"></cover>
        <loading :isShow="isShowLoading"></loading>
        <alert v-bind:isShow="showAlert" v-bind:alertParams="alertParams" @alertOkClicked="alertOkClicked"></alert>
        <div class="root-container">
            <div class="sidebar-wrapper">
                <div class="sidebar-logo">
                    <img :src="logo" />
                </div>
                <menu-container :items="menuData" @subItemClicked="loadContent"></menu-container>
            </div>
            <div class="root-right-container">
                <div class="right-header">
                    <div></div>
                    <div class="close-btn">
                        <a @click="logout">
                            <img src="@/assets/close.png">
                        </a>
                    </div>
                </div>
                <div class="right-body">
                    <right-content v-bind:isContentAlive="isContentAlive" v-bind:currentView="currentView" v-bind:title="title" v-bind:subTitle1="subTitle1"></right-content>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Cover from '../../components/common/cover.vue'
import Loading from '../../components/common/loading.vue'
import Menu from '../../components/menu/menuContainer.vue'
import request from '../../axios'
import Content from '../../components/content/content.vue'
import setting from '../../setting'
import Alert from '@/components/common/alert.vue'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
// require('@/mock')

Vue.use(VueCookies)

export default {
    data: () => {
        return {
            isShowCover: false,
            isShowLoading: false,
            currentView: '',
            menuData: [],
            itemIdx: 0,
            subItemIdx: 0,
            showAlert: false,
            alertParams: {header: '', content: ''},
            title: '',
            subTitle1: '',
            isContentAlive: true,
            requestNum: 0,
            logo: ''
        }
    },
    created: function(){
        this.getMenuInfo();
        // 设置logo
        this.logo = this.$cookies.get('adminType') == 1 ? setting.images.logo.cps : setting.images.logo.app
    },
    components:{
        cover: Cover,
        loading: Loading,
        'menu-container': Menu,
        'right-content': Content,
        alert: Alert
    },
    provide: function(){
        return {
            reload: this.reload,
            alert: this.alert,
            showLoading: this.showLoading,
            hideLoading: this.hideLoading
        }
    },
    methods: {
        reload: function(){
            console.log('reload')
            this.isContentAlive = false
            this.$nextTick(function(){
                this.isContentAlive = true
            })
        },
        showLoading: function(){
            if(this.requestNum == 0){
                this.isShowLoading = true
            }
            this.requestNum++
        },
        hideLoading: function(){
            if(this.requestNum == 1){
                this.isShowLoading = false
            }
            this.requestNum--
        },
        alertOkClicked: function(){
            this.showAlert = false
        },
        alert: function(str){
            this.alertParams.header = "提示信息"
            this.alertParams.content = str
            this.showAlert = true
        },
        logout: function(){
            console.log("logout");
            request({
                url: '/index/logout',
                method: 'get'
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        this.$cookies.remove('skey')
                        window.location.href = './login.html'
                    }else{
                        this.alert(result.message || '请求失败')
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        getMenuInfo: function(){
            this.isShowLoading = true;
            request({
                url: '/auth/index',
                method: 'get'
            })
                .then((response) => {
                    if(response.status == 200){
                        const result = response.data;
                        if(result.code == 200){
                            const rst = result.data
                            for(let idx = 0;idx < rst.length;idx++){
                                rst[idx].selected = idx == 0;
                                rst[idx].zkStatus = idx == 0;
                                for(let idxx = 0;idxx < rst[idx]['auth_detail'].length;idxx++){
                                    rst[idx]['auth_detail'][idxx].selected = (idx == 0 && idxx == 0);
                                }
                            }
                            this.menuData = Object.assign([], this.menuData, rst)
                            this.loadContent({itemIdx: this.itemIdx, subItemIdx: this.subItemIdx});
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                .then(() => {
                    this.isShowLoading = false;
                })
        },
        loadContent: function(data, pageNum){
            pageNum = pageNum || 1
            this.subItemIdx = data.subItemIdx
            this.itemIdx = data.itemIdx
            let url = this.menuData[data.itemIdx]['auth_detail'][data.subItemIdx].url;
            url = url.indexOf('/') == 0 ? url : ('/' + url)
            if(this.currentView == setting.views[url].name){
                this.$children[4].reload()
            }else{
                this.currentView = setting.views[url].name
                this.title = setting.views[url].title
                this.subTitle1 = setting.views[url].subTitle1
            }
            this.$children[4].subTitle2 = ''
        }
    }
}
</script>