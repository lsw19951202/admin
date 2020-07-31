<template>
  <div class="detail-container">
    <div class="detail-data-box">
        <header class="search-header">
            <div class="search-group">
                <label>ID:</label>
                <input type="text" placeholder="请输入" v-model="goodsid" class="selectOption">
            </div>
            <div class="search-group">
                <label>商品名称:</label>
                <input type="text" placeholder="请输入" v-model="goodstitle" class="selectOption">
            </div>
            <selector class="search-group" :selectParams="selectParams" @selectOptsClicked="choosePlatform" :value="platform"></selector>
            <selector class="search-group" :selectParams="statusrelease" @selectOptsClicked="chooseStatus" :value="platform"></selector>
            <div class="search-group">
                <label>更新时间:</label>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                <div class="split-line">
                    <div></div>
                </div>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
            </div>
            <button class="action-btn" @click="searchBtn">搜索</button>
            <button class="action-btn" @click="newly">新建</button>
        </header>
        <div class="operation">
            <div style="display:flex">
                <a class="leading operationText" style="display: inline-block;" @click.prevent.stop="selectExcel">批量导入</a>
                <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                    <input type="file" ref="excelIpt" @change="uploadExcel" accept=".xls, .xlsx" name="file">
                </form>
                <div class="undercar operationText" @click="batchShelf">批量下架</div>
                <div class="cutOff operationText" @click="batchDelete">批量删除</div>
            </div>
            <div style="copyAddre">
                <span class="urlAddre" v-cloak>页面地址:{{url}}</span>
                <button class="copyBtn" ref="copy" :data-clipboard-text="url" @click="copy" id="copy_text">复制</button>
            </div>
        </div>
        <!-- 商品列表 -->
        <div class="table-container hideScrollBar">
            <goods-table :tableType='tableType' :newFreeHeader='newFreeHeader' :newFreeTbody='newFreeTbody' :checkedId='checkedId' @offShelfEvent='offShelfFn' 
            @releaseEvent='releaseFn' @deleteEvent='deleteFn' @shooseStatusEvent='shooseStatusFn'></goods-table>
        </div>
        <!-- 翻页 -->
        <div class="page-footer" style="display: flex;">
            <page style="width: 0; flex: 1;" :pageData="pageData" @loadList="getNewFreeHeader"></page>
        </div>
        <!-- 弹窗提示 -->
        <operation-tips :showTips='showTips' :tipsText='tipsText' @cancelEvent="cancelEvent" @determineEvent='determineEvent'></operation-tips>
        <!-- 新建商品 -->
        <set-up v-if="showNewTable" :type='type' @callOff='callOffEvent' @preservationEvent='preservationFn'></set-up>
    </div>
  </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import Clipboard from 'clipboard';
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import Page from '@/components/content/page.vue'
import operationTips from '@/components/content/operationTips.vue'
import goodsTable from '@/components/content/goodsTable.vue'
import setUp from '@/components/content/newSetUp.vue'
import Selector from '@/components/common/select.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'page': Page,
        'operation-tips': operationTips,
        'goods-table': goodsTable,
        'set-up': setUp,
        'selector': Selector,
    },
    data(){
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return{
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            url:'',
            createTimeBegin: '',
            createTimeEnd: '',
            type:'',
            operationType:'',
            showNewTable:false,
            newFreeHeader:[],//表头信息
            newFreeTbody:[],//列表信息
            goodsid:'',//商品id
            platform:'',//平台
            inshow:'',//状态
            goodstitle:'',//商品名称
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            contentData:{
                ids:{},
                type:''
            },
            tipsText:'',
            showTips:false,
            checkedId:[],//所有选中的id
            selectParams: {
                label: '所属平台',
                options: [
                    {
                        value: '',
                        text: '请选择'
                    }, {
                        value: 'jd',
                        text: '京东'
                    }, {
                        value: 'pdd',
                        text: '拼多多'
                    }, {
                        value: 'tb',
                        text: '淘宝'
                    }
                ]
            },
            statusrelease:{
                label: '发布状态',
                options: [
                    {
                        value: '',
                        text: '请选择'
                    }, {
                        value: 0,
                        text: '待发布'
                    }, {
                        value: 1,
                        text: '发布中'
                    }, {
                        value: 2,
                        text: '已下架'
                    }
                ]
            },
            tableType:'newFree'
        }
    },
    created(){
        this.getNewFreeHeader()
    },
    methods:{
        getNewFreeHeader(pageNum){//表头请求
            this.showLoading()
            request({
                url:setting.urls.freeListHeader,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"新人免单表头")
                if(res.status == 200){
                    if(res.data.code == 200){
                        this.newFreeHeader = res.data.data;
                        this.getNewFreeTbody(pageNum)
                    }
                }
            }).catch((e) => {
                this.alert('新人免单表头请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        getNewFreeTbody(pageNum){//表格请求
            this.showLoading()
            request({
                url:setting.urls.newFreeList,
                method:'get',
                params:{
                    page:pageNum || 1,
                    'goods_id':this.goodsid,
                    platform:this.platform,
                    'in_show':this.inshow,
                    'goods_title':this.goodstitle,
                    'start_time':this.createTimeBegin,
                    'end_time':this.createTimeEnd
                }
            }).then(res=>{
                console.log(res,"新人免单列表")
                if(res.status == 200){
                    const rest = res.data;
                    if(rest.code == 100200001){
                        this.$emit("limitsFn",false)
                    }
                    if(rest.data.data.length <= 0 ){
                        this.alert('暂无数据')
                    }
                    this.url = rest.data.url
                    this.newFreeTbody = rest.data;
                    this.pageData.page = rest.data.page;
                    this.pageData.total = rest.data.total
                    this.pageData['total_page'] = rest.data.pageCount
                }
            }).catch((e) => {
                this.alert('新人免单列表请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        choosePlatform(e){//选择平台
            this.platform = e;
        },
        chooseStatus(e){//选择状态
            this.inshow = e;
        },
        searchBtn(){//搜索按钮
            this.getNewFreeTbody()
        },
        newly(){//新建按钮
            this.showNewTable = true
            this.type = 'newFree'
        },
        operateList(){//新人免单发布/下架
            this.showLoading()
            request({
                url:setting.urls.newFreeOperate,
                method:'post',
                data:qs.stringify(this.contentData),
            }).then(res=>{
                if(res.data.code == 200){
                    console.log(res,"操作成功!")
                    this.getNewFreeTbody()
                }else{
                    this.alert('操作失败')
                }
            }).catch((e) => {
                this.alert(this.operationType + '失败!')
            }).then(() => {
                this.hideLoading()
                this.alert(this.operationType + '成功!')
            })
        },
        shooseStatusFn(idx){//批量选择状态
            if(this.checkedId.indexOf(this.newFreeTbody.data[idx].id) >= 0){
                this.checkedId.splice(this.checkedId.indexOf(this.newFreeTbody.data[idx].id), 1)
            }else{
                this.checkedId.push(this.newFreeTbody.data[idx].id)
            }
            console.log(idx,this.checkedId)
        },
        selectExcel(){//批量导入按钮
            this.$refs.excelIpt.click()
        },
        uploadExcel: function(){//批量导入
            this.showLoading()
            const formData = new FormData(this.$refs.fileForm)
            request({
                url: setting.urls.newFreeImport,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(resp => {
                console.log(resp,"批量导入")
                if(resp.data.code == 200){
                    this.getNewFreeHeader()
                    this.alert(resp.data.data.msg || '导入成功!')
                }else{
                    this.alert('批量导入失败')
                }
            }).catch(e => {
                this.alert('批量导入失败')
            }).then(resp => {
                this.hideLoading()
                this.$refs.excelIpt.value = ''
            })
        },
        batchShelf(){//批量下架
            if(this.checkedId.length == 0){
                this.alert('请先选择需要下架的商品')
                return
            }
            this.tipsText = '确定要下架选中商品?'
            this.contentData.ids = this.checkedId.join(',')
            this.contentData.type = 'off'
            this.showTips = true
            this.operationType = '下架'
        },
        batchDelete(){//批量删除
            let flag = true;
            if(this.checkedId.length == 0){
                this.alert('请先选择需要删除的商品')
                return
            }
            for (let index = 0; index < this.checkedId.length; index++) {
                for (let v = 0; v < this.newFreeTbody.data.length; v++) {
                    if(this.checkedId[index] == this.newFreeTbody.data[v].id){
                        if(this.newFreeTbody.data[v]['in_show'] == '发布中'){
                            flag = false
                        }
                    }
                }
            }
            if(!flag){
                this.alert('商品中有未下架的商品!请重新选择！') 
            }else{
                this.tipsText = '确定要删除选中的商品?'
                this.contentData.ids = this.checkedId.join(',')
                this.contentData.type = 'del'
                this.showTips = true
                this.operationType = '删除'
            }
            
        },
        copy() {//复制按钮
            const clipboard = new Clipboard('#copy_text');
            clipboard.on('success', e => {
                this.alert("地址复制成功！")
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 释放内存
                clipboard.destroy()
            })
        },
        offShelfFn(ids){//单个下架
            this.tipsText = '确定要下架选中商品?'
            this.contentData.ids = ids
            this.contentData.type = 'off'
            this.showTips = true
            this.operationType = '下架'
        },
        releaseFn(ids){//单个发布
            this.tipsText = '确定要发布选中商品?'
            this.contentData.ids = ids
            this.contentData.type = 'open'
            this.showTips = true
            this.operationType = '发布'
        },
        deleteFn(ids){//单个删除
            this.tipsText = '确定要删除选中商品?'
            this.contentData.ids = ids
            this.contentData.type = 'del'
            this.showTips = true
            this.operationType = '删除'
        },
        cancelEvent(e){
            this.showTips = e;
        },
        determineEvent(e){
            this.showTips = e;
            this.operateList()
        },
        callOffEvent(){
            this.showNewTable = false
        },
        preservationFn(e){//新建商品
            this.showNewTable = false;
            this.showLoading()
            request({
                url:setting.urls.newFreeAdd,
                method:'post',
                data:qs.stringify(e),
            }).then(res=>{
                if(res.data.code == 200){
                    console.log(res,"新建成功!")
                    this.getNewFreeTbody()
                }else{
                    this.alert('新建失败!')
                }
            }).catch((e) => {
                this.alert('新建失败!')
            }).then(() => {
                this.hideLoading()
                this.alert('新建成功!重复商品自动覆盖!')
            })
        }
    }
}
</script>
<style scoped>
.detail-data-box,.detail-container{margin: 0;}
.operation{display: flex;margin-top: 20px;justify-content: space-between;}
.operationText{width: 100px;height: 30px;line-height: 30px;text-align: center;border-radius: 5px;background-color: #4880EA;color: #ffffff;font-size: 16px;margin-right: 30px;cursor: pointer;}
.table-container{margin: .22em 0 .875em;}
.urlAddre{font-size: 14px;color: red;}
.copyBtn{font-size: 16px;color: #4880EA;cursor: pointer;margin:0 40px 0 20px;background-color: transparent;}
.selectOption{width: 4rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;margin-left: .2rem;}

</style>