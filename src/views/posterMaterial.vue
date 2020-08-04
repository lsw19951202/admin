<template>
    <div class="detail-container">
        <div class="detail-data-box" v-if="!newBuild">
            <div class="newFreeHeader">
                <div class="headerNav" :class="show==1?'':'headerNavNo'" @click="chooseNav(1)">banner1管理</div>
                <div class="headerNav" :class="show==2?'':'headerNavNo'" @click="chooseNav(2)">banner2管理</div>
                <div class="headerNav" :class="show==3?'':'headerNavNo'" @click="chooseNav(3)">豆腐块管理</div>
                <div class="headerNav" :class="show==4?'':'headerNavNo'" @click="chooseNav(4)">滚动条管理</div>
            </div>
            <banner-manage v-if="show == 1" @newBuildEvent='newBuildFn' @lookBanner='lookBanFn' @editBanner='editBanFn'></banner-manage>
            <banner-manage-two v-if="show == 2" @newBuildEvent='newBuildTwoFn' @lookBanner='lookBanner2Fn' @editBanner='editBanner2Fn'></banner-manage-two>
            <beanCurd-manage v-if="show == 3" @newBuildEvent='newBuildBean' @lookDataList='lookDataFn' @editTofo='editTofoFn'></beanCurd-manage>
            <scrollbar-manage v-if="show == 4" @newBuildEvent='newBuildScroll' @lookMessge='lookMessFn' @editMessge='editFn'></scrollbar-manage>
        </div>
        <!-- 新建banner1组件 -->
        <newBuild-banner v-if="newBuild=='banner1'" @goBackPage='goBackPageFn' :dataAddree='dataAddree' :lookBannerMessge='lookBannerMessge' :isLook='isLook' :isEdit='isEdit'></newBuild-banner>
        <!-- 新建豆腐块组件 -->
        <newBuild-bean v-if="newBuild=='tofo'" @goBackPage='goBackPageFn' :isLook='isLook' :looktofoData='looktofoData' :editTofo='editTofo'></newBuild-bean>
        <!-- 新建滚动条组件 -->
        <newBuild-scroll v-if="newBuild=='scroll'" @goBackPage='goBackPageFn' @saveEvent='saveBtn' :lookMessgeData='lookMessgeData' :isLook='isLook' :editData='editData'></newBuild-scroll>
        <!-- 新建banner2组件 -->
        <newBuild-bannerTwo v-if="newBuild=='banner2'" @goBackPage='goBackPageFn' :dataAddree='dataAddree' :lookBannerMessge='lookBannerMessge' :isLook='isLook' :isEdit='isEdit'></newBuild-bannerTwo>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import bannerManage from '../components/content/bannermanage.vue'
import scrollbarManage from '../components/content/scrollbarManage.vue'
import beanCurdManage from '../components/content/beanCurdManage.vue'
import newBuildBanner from '../components/content/newBuildBanner.vue'
import newBuildBead from '../components/content/newBuildBead.vue'
import newBuildScroll from '../components/content/newBuildScroll.vue'
import bannerManage2 from '../components/content/bannerManage2.vue'
import newBuildBanner2 from '../components/content/newBuildBanner2.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'banner-manage':bannerManage,
        'scrollbar-manage':scrollbarManage,
        'beanCurd-manage':beanCurdManage,
        'newBuild-banner':newBuildBanner,
        'newBuild-bean':newBuildBead,
        'newBuild-scroll':newBuildScroll,
        'banner-manage-two':bannerManage2,
        'newBuild-bannerTwo':newBuildBanner2,
    },
    data(){
        return{
            show:1,// 1表示banner1管理  2表示banner2管理   3表示豆腐块管理   4表示滚动条管理
            newBuild:'',//是否显示新建组件
            lookMessgeData:'',//查看滚动条信息
            isLook:false,//是否查看
            editData:'',//编辑的信息
            dataAddree:'',//banner1新建信息
            lookBannerMessge:'',//查看banner
            isEdit:false,//banner1是否可编辑
            looktofoData:'',//查看豆腐块信息
            editTofo:false,//是否编辑豆腐块信息
        }
    },
    created(){
        this.show = 1
    },
    methods:{
        chooseNav(val){
            this.show = val;
        },
        newBuildFn(e){//显示新建banner1组件
            this.dataAddree = e
            this.newBuild = 'banner1';
            this.$parent.subTitle2 = '新建banner'
            this.isLook = false
            this.isEdit = false
        },
        newBuildTwoFn(e){//显示新建banner2组件
            this.dataAddree = e
            this.newBuild = 'banner2';
            this.$parent.subTitle2 = '新建banner2'
            this.isLook = false
            this.isEdit = false
        },
        goBackPageFn(e){//取消新建并且返回上一级
            this.newBuild = '';
            this.$parent.subTitle2 = ''
            this.editData = ''
            // this.show = 1
            this.lookBannerMessge = ''
            this.looktofoData = ''
            this.lookMessgeData = ''
            this.editTofo = false
            this.isEdit = false
            this.isLook = false
        },
        newBuildBean(){//新建豆腐块组件
            this.newBuild = 'tofo';
            this.$parent.subTitle2 = '新建豆腐块'
            this.isLook = false
        },
        newBuildScroll(){//新建滚动条
            this.newBuild = 'scroll';
            this.$parent.subTitle2 = '新建滚动条'
            this.isLook = false
        },
        saveBtn(){//保存事件
            this.newBuild = '';
            this.$parent.subTitle2 = ''
        },
        lookMessFn(e){
            this.isLook = true
            this.lookMessgeData = e;
            this.newBuild = 'scroll';
            this.$parent.subTitle2 = '查看滚动条'
        },
        editFn(item){
            this.editData = item
            this.newBuild = 'scroll';
            this.$parent.subTitle2 = '编辑滚动条'
        },
        lookBanFn(e){//查看banner
            this.isLook = true
            this.lookBannerMessge = e;
            this.newBuild = 'banner1';
            this.$parent.subTitle2 = '查看banner'
        },
        lookBanner2Fn(e){//查看banner2
            this.isLook = true
            this.lookBannerMessge = e;
            this.newBuild = 'banner2';
            this.$parent.subTitle2 = '查看banner2'
        },
        editBanFn(item){
            this.isLook = false
            this.lookBannerMessge = item
            this.newBuild = 'banner1';
            this.$parent.subTitle2 = '编辑banner'
            this.isEdit = true
        },
        editBanner2Fn(item){
            this.isLook = false
            this.lookBannerMessge = item
            this.newBuild = 'banner2';
            this.$parent.subTitle2 = '编辑banner2'
            this.isEdit = true
        },
        lookDataFn(item){//查看豆腐块
            this.isLook = true
            this.looktofoData = item
            this.newBuild = 'tofo';
            this.$parent.subTitle2 = '查看豆腐块'
        },
        editTofoFn(item){//编辑豆腐块
            this.isLook = false
            this.looktofoData = item
            this.newBuild = 'tofo';
            this.$parent.subTitle2 = '编辑豆腐块'
            this.editTofo = true
        }
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{padding: 0;}
.newFreeHeader{width: 100%;display: flex;margin-bottom: 30px;}
.headerNav{width: 120px;height: 30px;font-size: 16px;font-family: '微软雅黑';color: #ffffff;background-color: #4880EA;line-height: 30px;text-align: center;margin-right: 30px;border-radius: 5px;cursor: pointer;}
.headerNavNo{background-color: #999999;}
</style>