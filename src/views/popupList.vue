<template>
    <div class="detail-container">
        <div class="detail-data-box" v-if="!isShowNew">
            <header class="search-header">
                <div class="search-group">
                    <label>ID:</label>
                    <input type="text" placeholder="请输入" v-model="popupId">
                </div>
                <div class="search-group">
                    <label>弹窗标题:</label>
                    <input type="text" placeholder="请输入" v-model="popupTitle">
                </div>
                <Select :selectParams="selectStatus" @selectOptsClicked="chooseStatus"></Select>
                <Select :selectParams="selectSort" @selectOptsClicked="chooseSort"></Select>
                <button class="actionAdd-btn" @click="searchBtn">搜索</button>
                <button class="actionAdd-btn" @click="newBuildBtn">新建</button>
            </header>
            <div class="table-container hideScrollBar">
                <advert-table :theadData='theadData' :tbodyData='tbodyData' @offShelfEvent='offShelfFn' @releaseEvent='releaseFn' @deleteEvent='deleteFn'
                @editEvent='editFn' @lookUpEvent='lookUpEFn'></advert-table>
            </div>
            <!-- 提示框 -->
            <operation-tip :tipsText='tipsText' :showTips='showTips' @cancelEvent='cancelFn' @determineEvent='determineFn'></operation-tip>
        </div>
        <!-- 新建组件 -->
        <newBuild-popup v-if="isShowNew" @goBackPage='goBackPageFn' :isLook='isLook' :lookMessge='lookMessge' :textValue='textValue'></newBuild-popup>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import select from '@/components/common/select.vue'
import advertTable from '@/components/content/advertTable.vue'
import operationTips from '@/components/content/operationTips.vue'
import newBuildPopup from '@/components/content/newBuildPopup.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'Select': select,
        'advert-table':advertTable,
        'operation-tip':operationTips,
        'newBuild-popup':newBuildPopup,
    },
    data(){
        return{
            popupId:'',
            popupTitle:'',
            releaseStatus:'',
            selectStatus: {//发布状态  0待发布 1发布中 2已下架
                label: '发布状态',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: '0',
                    text: '待发布'
                }, {
                    value: '1',
                    text: '发布中'
                }, {
                    value: '2',
                    text: '已下架'
                }]
            },
            selectSort: {//排序
                label: '排序',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: '0',
                    text: '0'
                }, {
                    value: '1',
                    text: '1'
                }, {
                    value: '2',
                    text: '2'
                }, {
                    value: '3',
                    text: '3'
                }]
            },
            sortNum:'',
            theadData:'',
            tbodyData:"",
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            showTips:false,
            tipsText:'',//提示信息
            operationType:'',
            operateData:{// 删除/下架/发布
                ids:'',
                type:'',// del 删除   off 下架    open发布
            },
            isShowNew:false,
            lookMessge:'',//查看的信息
            isLook:false,//是否是查看
            textValue:'新建'
        }
    },
    created(){
        this.getListThead()
    },
    methods:{
        chooseStatus(e){//发布状态选择
            this.releaseStatus = e;
        },
        chooseSort(e){//排序选择
            this.sortNum = e;
        },
        getListThead(){//头部
            this.showLoading()
            request({
                url:setting.urls.popupListThead,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"弹窗表头")
                if(res.status == 200 && res.data.code == 200){
                    this.theadData = res.data.data
                    this.getTbody()
                }
            }).catch((res) => {
                this.alert('弹窗表头请求失败')
            }).then((res) => {
                this.hideLoading()
            })
        },
        getTbody(){//弹窗列表
            this.showLoading()
            request({
                url:setting.urls.popupListTbody,
                method:'get',
                params:{
                    id:this.popupId,
                    name:this.popupTitle,
                    status:this.releaseStatus,
                    // sort:this.sortNum
                }
            }).then(res=>{
                console.log(res,"弹窗列表")
                if(res.status == 200 && res.data.code == 200){
                    if(res.data.data.data.length <= 0){
                        this.alert("暂无数据!")
                    }
                    this.tbodyData = res.data.data;
                }
            }).catch((res) => {
                this.alert('弹窗列表请求失败')
            }).then((res) => {
                this.hideLoading()
            })
        },
        searchBtn(){//搜索按钮
            this.getListThead()
        },
        newBuildBtn(){//新建按钮
            this.isShowNew = true
            this.$parent.subTitle2 = '新建弹窗'
            this.lookMessge = ''
            this.textValue = '新建'
        },
        popupOperate(){//弹窗发布/下架/删除
            this.showLoading()
            request({
                url:setting.urls.popupOperate,
                method:'post',
                data:qs.stringify(this.operateData),
            }).then(res=>{
                if(res.data.code == 200){
                    this.getListThead()
                }else{
                    this.alert('操作失败')
                }
            }).catch((e) => {
                this.alert(this.operationType +'失败!')
            }).then(() => {
                this.hideLoading()
                this.alert(this.operationType + "成功!")
            })
        },
        cancelFn(e){//提示框取消按钮
            this.showTips = e
        },
        determineFn(e){//提示框确定按钮
            this.showTips = e
            this.popupOperate()
        },
        offShelfFn(id){//下架
            this.operateData.ids = id
            this.operateData.type = 'off'
            this.tipsText = '是否要下架该弹窗?'
            this.showTips = true
            this.operationType = '下架'
        },
        releaseFn(id){//发布
            this.operateData.ids = id
            this.operateData.type = 'open'
            this.tipsText = '是否要发布该弹窗?'
            this.showTips = true
            this.operationType = '发布'
        },
        deleteFn(id){//删除
            this.operateData.ids = id
            this.operateData.type = 'del'
            this.tipsText = '是否要删除该弹窗?'
            this.showTips = true
            this.operationType = '删除'
        },
        goBackPageFn(e){//取消新建并且返回上一级
            this.$parent.subTitle2 = ''
            this.isShowNew = false
            this.getListThead()
        },
        editFn(item){//编辑
            console.log(item,"编辑")
            this.$parent.subTitle2 = '编辑弹窗'
            this.lookMessge = item
            this.isLook = false;//表明我在编辑信息
            this.isShowNew = true
            this.textValue = '编辑'
        },
        lookUpEFn(item){//查看
            console.log(item,"查看")
            this.$parent.subTitle2 = '查看弹窗'
            this.lookMessge = item
            this.isLook = true;//表明我在查看信息，信息不可编辑
            this.isShowNew = true
        }
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{padding: 0;}
.actionAdd-btn{appearance: menulist;cursor: pointer;padding: 0 1rem;width: 4rem;height: 1rem;background-color: #4880EA;border-radius: .125rem;color: white;vertical-align: top;margin-left: 20px;}
.table-container{margin-top: .5rem;}

</style>