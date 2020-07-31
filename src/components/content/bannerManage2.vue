<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>广告名称:</label>
                    <input type="text" placeholder="请输入" v-model="avdTitle">
                </div>
                <Select :selectParams="selectPage" @selectOptsClicked="chooseOption"></Select>
                <Select :selectParams="selectPosition" @selectOptsClicked="choosePosition"></Select>
                <Select :selectParams="selectStatus" @selectOptsClicked="chooseStatus"></Select>
                <button class="actionAdd-btn" @click="searchBtn">搜索</button>
                <button class="actionAdd-btn">新建</button>
            </header>
            <div class="table-container hideScrollBar">
                <advert-table :theadData='theadData' :tbodyData='tbodyData' @offShelfEvent='offShelfFn' @releaseEvent='releaseFn' @deleteEvent='deleteFn' @lookUpEvent='lookUpFn'></advert-table>
            </div>
            <!-- 提示框 -->
            <operation-tip :tipsText='tipsText' :showTips='showTips' @cancelEvent='cancelFn' @determineEvent='determineFn'></operation-tip>
        </div>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import advertTable from '@/components/content/advertTable.vue'
import operationTips from '@/components/content/operationTips.vue'
import select from '@/components/common/select.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'Select': select,
        'advert-table':advertTable,
        'operation-tip':operationTips,
    },
    data(){
        return{
            theadData:[],
            tbodyData:[],
            showTips:false,
            tipsText:'',//提示信息
            operationType:'',
            avdTitle:'',//广告名称
            pageTable:'',//所在页面
            pageLocation:'',//页面位置
            releaseStatus:'',//发布状态 0待发布 1发布中 2已下架
            selectPage: {//所在页面
                label: '所在页面',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 'shopping',
                    text: '首页(购物赚)'
                }, {
                    value: 'live',
                    text: '生活赚'
                }, {
                    value: 'my',
                    text: '我的页面'
                }, {
                    value: 'brandSpecial',
                    text: '品牌专场'
                }, {
                    value: 'brandHigh',
                    text: '高佣精品'
                }]
            },
            selectPosition: {//页面位置
                label: '页面位置',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 'Center',
                    text: '中部'
                }, {
                    value: 'Up',
                    text: '顶部'
                }, {
                    value: 'Down',
                    text: '底部'
                }]
            },
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
            operateData:{
                ids:'',
                type:'',// del 删除   off 下架    open发布
            },
        }
    },
    created(){
        this.getTheader();
    },
    methods:{
        getTheader(){//表头
            this.showLoading()
            request({
                url:setting.urls.bannerListTheader,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"banner2管理表头")
                if(res.status == 200){
                    if(res.data.code == 200){
                        this.theadData = res.data.data;
                        this.getTbody()
                    }
                }
            }).catch((e) => {
                this.alert('banner2管理表头请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        getTbody(){//banner2管理列表
            this.showLoading()
            request({
                url:setting.urls.layoutListTbody,
                method:'get',
                params:{
                    name:this.avdTitle,
                    'belong_prefecture':this.pageTable,
                    typeIos:this.pageLocation,
                    status:this.releaseStatus
                }
            }).then(res=>{
                if(res.status == 200){
                    if(res.data.code == 200){
                        console.log(res,"banner2管理列表")
                        this.tbodyData = res.data.data
                    }
                }
            }).catch((e) => {
                this.alert('banner2管理列表请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        bannerOperate(){//发布/下架/删除
            this.showLoading()
            request({
                url:setting.urls.layoutOperate,
                method:'post',
                data:qs.stringify(this.operateData),
            }).then(res=>{
                if(res.data.code == 200){
                    console.log(res,"操作成功!")
                    this.getTheader()
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
        offShelfFn(id){//下架
            this.operateData.ids = id
            this.operateData.type = 'off'
            this.tipsText = '是否要下架该banner?'
            this.showTips = true
            this.operationType = '下架'
        },
        releaseFn(id){//发布
            this.operateData.ids = id
            this.operateData.type = 'open'
            this.tipsText = '是否要发布该banner?'
            this.showTips = true
            this.operationType = '发布'
        },
        deleteFn(id){//删除
            this.operateData.ids = id
            this.operateData.type = 'del'
            this.tipsText = '是否要删除该banner?'
            this.showTips = true
            this.operationType = '删除'
        },
        cancelFn(e){//取消
            this.showTips = e
        },
        determineFn(e){//确定
            this.showTips = e
            this.bannerOperate()
        },
        chooseOption(e){//所在页面筛选
            this.pageTable = e;
        },
        choosePosition(e){//页面位置
            this.pageLocation = e;
        },
        chooseStatus(e){//发布状态
            this.releaseStatus = e;
        },
        searchBtn(){//搜索按钮
            this.getTheader()
        },
        lookUpFn(e){//查看的商品的信息
            console.log(e,"查看的商品的信息")
        }
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{margin: 0;}
.detail-data-box{padding-top: 0;}
.actionAdd-btn{appearance: menulist;cursor: pointer;padding: 0 1rem;width: 4rem;height: 1rem;line-height: 1rem;background-color: #4880EA;border-radius: .125rem;color: white;vertical-align: top;margin-left: 20px;}
.actionAdd-btn option{cursor: pointer;margin: 0 auto;height: 1.3rem;line-height: 1.3rem;background-color: rgb(243, 241, 241);border: none;border-radius: .5rem;color: #666666;}
.table-container{margin-top: .5rem;}

.issue{height: 30px;display: flex;justify-content: space-around;align-items: center;padding: 0 10px;box-sizing: border-box;}
.textValue{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 5px;}

</style>