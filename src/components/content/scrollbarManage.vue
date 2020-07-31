<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>名称:</label>
                    <input type="text" placeholder="请输入" v-model="rollTitle">
                </div>
                <Select :selectParams="selectStatus" @selectOptsClicked="chooseStatus"></Select>
                <button class="actionAdd-btn" @click="searchBtn">搜索</button>
                <button class="actionAdd-btn" @click="newBuildBanner">新建</button>
            </header>
            <div class="table-container hideScrollBar">
                <advert-table :theadData='theadData' :tbodyData='tbodyData' @offShelfEvent='offShelfFn' @releaseEvent='releaseFn' @deleteEvent='deleteFn' 
                @lookUpEvent='lookUpFn' @editEvent='editEvFn'></advert-table>
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
            operateData:{
                ids:'',
                type:'',// del 删除   off 下架    open发布
            },
            rollTitle:'',//名称
            rollStatus:'',//发布状态 0待发布 1发布中 2已下架
            selectStatus: {//发布状态选择  0待发布 1发布中 2已下架
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
        }
    },
    created(){
        this.getTheader();
    },
    methods:{
        getTheader(){//表头
            this.showLoading()
            request({
                url:setting.urls.scrollBarThead,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"滚动条表头")
                if(res.status == 200){
                    if(res.data.code == 200){
                        this.theadData = res.data.data;
                        this.getTbody()
                    }
                }
            }).catch((e) => {
                this.alert('滚动条表头请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        getTbody(){//滚动条列表
            this.showLoading()
            request({
                url:setting.urls.scrollBarTbody,
                method:'get',
                params:{
                    name:this.rollTitle,
                    status:this.rollStatus
                }
            }).then(res=>{
                if(res.status == 200){
                    if(res.data.code == 200){
                        console.log(res,"滚动条列表")
                        this.tbodyData = res.data.data
                    }
                }
            }).catch((e) => {
                this.alert('滚动条列表请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        scrollBarOperate(){//发布/下架/删除
            this.showLoading()
            request({
                url:setting.urls.scrollBarOperate,
                method:'post',
                data:qs.stringify(this.operateData),
            }).then(res=>{
                console.log(res,"发布/下架/删除")
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
            this.tipsText = '是否要下架该滚动条?'
            this.showTips = true
            this.operationType = '下架'
        },
        releaseFn(id){//发布
            this.operateData.ids = id
            this.operateData.type = 'open'
            this.tipsText = '发布该滚动条后，已上架的滚动条将会自动下架。是否继续?'
            this.showTips = true
            this.operationType = '发布'
        },
        deleteFn(id){//删除
            this.operateData.ids = id
            this.operateData.type = 'del'
            this.tipsText = '是否要删除该滚动条?'
            this.showTips = true
            this.operationType = '删除'
        },
        cancelFn(e){//取消
            this.showTips = e
        },
        determineFn(e){//确定
            console.log(this.operateData)
            this.showTips = e
            this.scrollBarOperate()
        },
        chooseStatus(e){//发布状态
            this.rollStatus = e;
        },
        searchBtn(){//搜索按钮
            this.getTheader()
        },
        newBuildBanner(){//新建
            this.$emit('newBuildEvent')
        },
        lookUpFn(ite){//查看
            console.log(ite,"查看")
            this.$emit('lookMessge',ite)
        },
        editEvFn(item){//编辑
            console.log(item,'编辑')
            this.$emit('editMessge',item)
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

/* 展示规则 */
.rule{padding: 10px 20px;border: 1px solid #d6d6d6;border-radius: 10px;margin-left: 20px;}
.ruleCro{display: flex;align-items: center;margin: 15px 0;}
.lableText{color: #666666;font-size: .5375rem;position: relative;}
.grade{color: #666666;font-size: .5375rem;}
.lableText::after{position: absolute;content: '*';color: red;top: 2px;right: -8px;width: 5px;height: 5px;}
</style>