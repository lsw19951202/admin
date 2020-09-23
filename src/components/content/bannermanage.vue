<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <div class="banner1TopTips">
                <span class="banner-tips-list">当前banner列表可管理banner位置：</span>
                <span class="banner-tips-row">首页顶部banner,高佣商品顶部banner,品牌专场顶部banner,我的页面中部banner</span>
            </div>
            <header class="search-header">
                <div class="search-group">
                    <label>广告名称:</label>
                    <input type="text" placeholder="请输入" v-model="avdTitle">
                </div>
                <Select :selectParams="selectPage" @selectOptsClicked="chooseOption"></Select>
                <Select :selectParams="selectPosition" @selectOptsClicked="choosePosition"></Select>
                <Select :selectParams="selectStatus" @selectOptsClicked="chooseStatus"></Select>
                <button class="actionAdd-btn" @click="searchBtn">搜索</button>
                <!-- <button class="actionAdd-btn" @click="newBuildBanner">新建</button> -->
                <select name="" id="select" class="actionAdd-btnSelect" @change="selectOption($event)">
                    <option :value="item.value" v-for="(item,index) in newAddoptions" :key="index">{{item.text}}</option>
                </select>
            </header>
            <div class="table-container hideScrollBar">
                <advert-table :theadData='theadData' :tbodyData='tbodyData' @offShelfEvent='offShelfFn' @releaseEvent='releaseFn' @deleteEvent='deleteFn' 
                @lookUpEvent='lookUpEvFn' @editEvent='editEvetFn'></advert-table>
            </div>
            <page :pageData='pageData' @loadList="getTheader"></page>
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
import page from '@/components/content/page.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'Select': select,
        'advert-table':advertTable,
        'operation-tip':operationTips,
        'page':page
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
            newAddoptions: [//新建下拉选择框
                {
                    value: '',
                    text: '新建'
                }, {
                    value: 'my_Center',
                    text: '我的页面,中部'
                }, {
                    value: 'shopping_Up',
                    text: '首页(购物赚),顶部'
                }, {
                    value: 'brandHigh_Up',
                    text: '高佣精品,顶部'
                }, {
                    value: 'brandSpecial_Up',
                    text: '品牌专场,顶部'
                }
            ],
            operateData:{// 删除/下架/发布
                ids:'',
                type:'',// del 删除   off 下架    open发布
            },
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            }
        }
    },
    created(){
        this.getTheader(1);
    },
    methods:{
        getTheader(pageNum){//表头
            this.showLoading()
            request({
                url:setting.urls.bannerListTheader,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"banner管理表头")
                if(res.status == 200){
                    if(res.data.code == 200){
                        this.theadData = res.data.data;
                        this.getTbody(pageNum)
                    }
                }
            }).catch((e) => {
                this.alert('banner管理表头请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        getTbody(pageNum){//banner管理列表
            this.showLoading()
            request({
                url:setting.urls.bannerList,
                method:'get',
                params:{
                    page:pageNum || 1,
                    name:this.avdTitle,
                    'belong_prefecture':this.pageTable,
                    typeIos:this.pageLocation,
                    status:this.releaseStatus
                }
            }).then(res=>{
                if(res.status == 200){
                    if(res.data.code == 200){
                        console.log(res,"banner管理列表")
                        this.pageData.total = res.data.data.total
                        this.pageData.page = res.data.data.page
                        this.pageData['total_page'] = res.data.data.pageCount
                        this.tbodyData = res.data.data
                    }
                }
            }).catch((e) => {
                this.alert('banner管理列表请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        bannerOperate(){//发布/下架/删除
            this.showLoading()
            request({
                url:setting.urls.bannerOperate,
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
        selectOption(e){//新建banner所在页面和位置
            const selectIndex = e.target.selectedIndex;
            const myselect = document.getElementById('select');
            const texts = myselect.options[selectIndex].text
            const values = myselect.options[selectIndex].value
            const address = {
                pageTable:'',
                pageLocation:''
            }
            address.pageTable = values.split('_')[0]
            address.pageLocation = values.split('_')[1]
            this.$emit('newBuildEvent',address)
        },
        lookUpEvFn(e){//查看
            console.log(e,"查看")
            this.$emit('lookBanner',e)
        },
        editEvetFn(item){//编辑
            this.$emit('editBanner',item)
        }
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{margin: 0;}
.detail-data-box{padding-top: 0;}
.banner1TopTips{width: 100%;padding: 0 10px 10px 10px;box-sizing: border-box;border: 1px solid #999999;margin-bottom: 15px;}
.banner-tips-list{font-size: 0.475rem;color: #4880EA;}
.banner-tips-row{font-size: 0.475rem;color: #666666;}
.actionAdd-btn{appearance: menulist;cursor: pointer;padding: 0 1rem;width: 4rem;height: 1rem;background-color: #4880EA;border-radius: .125rem;color: white;vertical-align: top;margin-left: 20px;}
.actionAdd-btnSelect{appearance: menulist;cursor: pointer;padding: 0 1rem;width: 5rem;height: 1rem;background-color: #4880EA;border-radius: .125rem;color: white;vertical-align: top;margin-left: 20px;}
.actionAdd-btnSelect option{cursor: pointer;margin: 0 auto;height: 1.3rem;line-height: 1.3rem;background-color: rgb(243, 241, 241);border: none;border-radius: .5rem;color: #666666;}
.table-container{margin-top: .5rem;}

.issue{height: 30px;display: flex;justify-content: space-around;align-items: center;padding: 0 10px;box-sizing: border-box;}
.textValue{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 5px;}

</style>