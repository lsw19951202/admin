<template>
  <div class="detail-container">
    <div style="width: 100%; display: flex;">
        <div class="copyAddre" style="width: 0; flex: 1; overflow: hidden;">
            <span class="urlAddre" v-cloak>页面地址:{{url}}</span>
            <button class="copyBtn" ref="copy" :data-clipboard-text="url" @click="copy" id="copy_text">复制</button>
        </div>
        <div class="action-btn" style="display: inline-block; font-size: .4375rem;" @click.prevent.stop="refreshGoodsList">刷新</div>
    </div>
    <div class="detail-data-box">
        <div class="goodsContainer">
            <div class="hdkGoods">
                <div class="goodsSrc">
                    <label class="left">商品来源</label>
                    <div class="platforms">
                        <span class="platform">
                            <input type="radio" id="goodsSrcHDK" value="HDK" name="goodsSrc" v-model="goodsSrc">
                            <label for="goodsSrcHDK">好单库</label>
                        </span>
                    </div>
                </div>
                <div class="title">{{goodsSrc == 'HDK' ? '好单库' : ''}}商品</div>
                <header class="search-header" style="display: block;">
                    <div class="search-group">
                        <label>品类</label>
                        <select v-model="fqcat">
                            <option value="0">全部</option>
                            <option value="1">女装</option>
                            <option value="2">男装</option>
                            <option value="3">内衣</option>
                            <option value="4">美妆</option>
                            <option value="5">配饰</option>
                            <option value="6">鞋品</option>
                            <option value="7">箱包</option>
                            <option value="8">儿童</option>
                            <option value="9">母婴</option>
                            <option value="10">居家</option>
                            <option value="11">美食</option>
                            <option value="12">数码</option>
                            <option value="13">家电</option>
                            <option value="14">其他</option>
                            <option value="15">车品</option>
                            <option value="16">文体</option>
                            <option value="17">宠物</option>
                        </select>
                    </div>
                    <div class="search-group">
                        <label>月销量>=</label>
                        <input type="text" style="width: 2rem;" v-model="minSale">笔
                    </div>
                    <div class="search-group" style="position: relative;">
                        <label>券后价</label>
                        <div class="money" style="margin-left: .2rem;">
                            <input type="text" style="width: 2.5rem;" v-model="minItemEndPrice" @focus.prevent.stop="showPriceBox">
                        </div>
                        -
                        <div class="money">
                            <input type="text" style="width: 2.5rem;" v-model="maxItemEndPrice" @focus.prevent.stop="showPriceBox">
                        </div>
                        <div class="priceSelectBox" v-show="showPriceSelectBox">
                            <div class="arrow">
                                <div></div>
                            </div>
                            <div class="prices">
                                <div class="price" @click.prevent.stop="priceSelect(0, 9)">
                                    0-9元
                                </div>
                                <div class="price" @click.prevent.stop="priceSelect(10, 15)">
                                    10-15元
                                </div>
                                <div class="price" @click.prevent.stop="priceSelect(51, 100)">
                                    51-100元
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="search-group">
                        <label>店铺</label>
                        <select v-model="shopType">
                            <option value="">全部</option>
                            <option value="B">天猫</option>
                            <option value="C">淘宝</option>
                        </select>
                    </div>
                    <div class="search-group">
                        <label :class="'sort box' + (saleSort == 1 ? ' curr' : '')" @click.prevent.stop="changeSort('saleSort')">全天销量</label>
                    </div>
                    <div class="search-group">
                        <label :class="'sort box' + (generalSort == 1 ? ' curr' : '')" @click.prevent.stop="changeSort('generalSort')">好单指数</label>
                    </div>
                    <div class="search-group">
                        <label>优惠券结束时间>=</label>
                        <flat-picker class="search-time-picker" v-model="couponEndTime" :config="couponDateConfig"></flat-picker>
                    </div>
                    <button class="action-btn" @click.prevent.stop="loadHDKGoods(1)">搜索</button>
                    <button class="action-btn" @click.prevent.stop="pubHDKGoods">批量发布</button>
                </header>
                <div style="width: 100%; height: 1rem; line-height: 1rem; color: red; font-size: .4375rem;">
                    本次勾选商品: {{hdkGoodsIds.length}}
                </div>
                <div class="table-container">
                    <table cellspacing="0">
                        <thead>
                            <tr>
                                <td style="width: 2.5rem; text-align: center;">
                                    <input type="checkbox" :checked="hdkGoodsAllChecked" @click="checkAllHDKGoods">
                                </td>
                                <td v-for="(tt, index) in hdkTableHeader[0]" :key="index">{{tt.name}}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(goods, index) in hdkGoodsList" :key="index">
                                <td style="width: 2.5rem; text-align: center;">
                                    <input type="checkbox" :checked="hdkGoodsIds.indexOf(goods.productId) >= 0" @click="checkHDKGoods(index)">
                                </td>
                                <td v-for="(field, idx) in hdkFields" :key="idx">
                                    {{goods[field]}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer" style="width: 100%; height: 1rem; line-height: 1rem; text-align: right;">
                    <div class="prevPageBtn" @click.prevent.stop="nextPage('prev')" style="cursor: pointer; display: inline-block; width: 1rem; height: 1rem; text-align: center; line-height: 1rem; border: 1px solid #ccc; box-sizing: border-box; font-size: .4375rem; border-radius: .125rem; vertical-align: top;">&lt;</div>
                    <div class="nextPageBtn" @click.prevent.stop="nextPage('next')" style="cursor: pointer; display: inline-block; width: 1rem; height: 1rem; text-align: center; line-height: 1rem; border: 1px solid #ccc; box-sizing: border-box; font-size: .4375rem; border-radius: .125rem; margin-left: 10px; vertical-align: top;">&gt;</div>
                </div>
            </div>
            <div class="ypjGoods">
                <div class="title">洋皮卷新人免单商品</div>
                <header class="search-header">
                    <div class="search-group">
                        <label>ID:</label>
                        <input type="text" placeholder="请输入" v-model="goodsid" class="selectOption">
                    </div>
                    <div class="search-group">
                        <label>商品名称:</label>
                        <input type="text" placeholder="请输入" v-model="goodstitle" class="selectOption">
                    </div>
                    <div class="search-group">
                        <label>销量</label>
                        <select v-model="ypj_sales">
                            <option value="">请选择</option>
                            <option value="1">升序</option>
                            <option value="2">降序</option>
                        </select>
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
                    <div class="search-group">
                        <label>商品来源</label>
                        <select v-model="source">
                            <option value="">请选择</option>
                            <option value="1">手动</option>
                            <option value="2">好单库</option>
                        </select>
                    </div>
                    <div class="search-group">
                        <label>优惠券结束时间>=</label>
                        <flat-picker class="search-time-picker" :config="couponDateConfig" v-model="valid_endtime"></flat-picker>
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
                        <div class="undercar operationText" @click="batchRelease">批量发布</div>
                        <div class="cutOff operationText" @click="batchDelete">批量删除</div>
                        <a class="action-btn" style="font-size: .5rem;" download="高佣商品列表.xlsx" :href="downloadUrl">导出</a>
                    </div>
                </div>
                <!-- 商品列表 -->
                <div class="table-container">
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
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
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
            pageArr: [],
            source: '',
            'valid_endtime': '',
            'ypj_sales': '',
            hdkGoodsAllChecked: false,
            hdkTableHeader: [],
            hdkFields: [],
            showPriceSelectBox: false,
            goodsSrc: 'HDK',
            fqcat: '',
            minSale: '',
            minItemEndPrice: '',
            maxItemEndPrice: '',
            shopType: '',
            saleSort: 0,
            generalSort: 0,
            couponEndTime: '',
            pageBegin: 0,
            nextPageNo: 0,
            hdkGoodsArr: [],
            hdkGoodsIds: [],
            hdkGoodsList: [],
            couponDateConfig: {
                'time_24hr': true,
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i:S',
                enableTime: true,
            },
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
                        text: '全部'
                    }, {
                        value: 'jd',
                        text: '京东'
                    }, {
                        value: 'pdd',
                        text: '拼多多'
                    }, {
                        value: 'tb',
                        text: '淘宝'
                    }, {
                        value: 'tm',
                        text: '天猫'
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
        this.loadFields(setting.urls.appFields, { 'field_type': 'hdkFreeList' }, 'get')
            .then(rst => {
                this.hdkTableHeader = rst.tableHeader
                this.hdkFields = rst.fields
            })
    },
    computed: {
        downloadUrl() {
            return setting.baseUrl + setting.urls.higServantList + '?page=' + (this.pageData.page || 1) + '&goods_id=' + this.goodsid
                + '&platform=' + this.platform + '&in_show=' + this.inshow + '&goods_title=' + this.goodstitle
                + '&start_time=' + this.createTimeBegin + '&end_time=' + this.createTimeEnd
                + '&source=' + this.source + '&valid_endtime=' + this.valid_endtime
                + '&ypj_sales=' + this.ypj_sales + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    methods:{
        refreshGoodsList(){
            this.goodsid = ''
            this.platform = ''
            this.inshow = ''
            this.goodstitle = ''
            this.createTimeBegin = ''
            this.createTimeEnd = ''
            this.source = ''
            this.$data['valid_endtime'] = ''
            this.$data['ypj_sales'] = ''
            this.getNewFreeTbody(1)
        },
        checkHDKGoods(idx){
            const index = this.hdkGoodsIds.indexOf(this.hdkGoodsList[idx].productId)
            if(index >= 0){
                this.hdkGoodsIds.splice(index, 1)
                this.hdkGoodsArr.splice(index, 1)
                this.hdkGoodsAllChecked = false
            }else{
                this.hdkGoodsIds.push(this.hdkGoodsList[idx].productId)
                this.hdkGoodsArr.push(this.hdkGoodsList[idx])
                for(let idxx = 0; idxx < this.hdkGoodsList.length; idxx++){
                    if(this.hdkGoodsIds.indexOf(this.hdkGoodsList[idxx].productId) >= 0){
                        continue
                    }else{
                        this.hdkGoodsAllChecked = false
                        return
                    }
                }
                this.hdkGoodsAllChecked = true
            }
        },
        checkAllHDKGoods(){
            if(this.hdkGoodsAllChecked){
                for(let idx = 0; idx < this.hdkGoodsList.length; idx++){
                    const index = this.hdkGoodsIds.indexOf(this.hdkGoodsList[idx].productId)
                    if(index >= 0){
                        this.hdkGoodsArr.splice(index, 1)
                        this.hdkGoodsIds.splice(index, 1)
                    }
                }
            }else{
                for(let idx = 0; idx < this.hdkGoodsList.length; idx++){
                    if(this.hdkGoodsIds.indexOf(this.hdkGoodsList[idx].productId) >= 0){
                        continue
                    }else{
                        this.hdkGoodsIds.push(this.hdkGoodsList[idx].productId)
                        this.hdkGoodsArr.push(this.hdkGoodsList[idx])
                    }
                }
            }
            this.hdkGoodsAllChecked = !this.hdkGoodsAllChecked
        },
        changeSort(type){
            if(type == 'saleSort'){
                if(this.saleSort == 1){
                    this.saleSort = 0
                }else{
                    this.saleSort = 1
                    this.generalSort = 0
                }
            }else if(type == 'generalSort'){
                if(this.generalSort == 1){
                    this.generalSort = 0
                }else{
                    this.generalSort = 1
                    this.saleSort = 0
                }
            }
        },
        priceSelect(p1, p2){
            this.minItemEndPrice = p1
            this.maxItemEndPrice = p2
            this.showPriceSelectBox = false
        },
        showPriceBox(){
            this.showPriceSelectBox = true
        },
        pubHDKGoods(){
            if(this.hdkGoodsIds.length == 0){
                this.alert('请选择要发布的商品')
                return
            }
            request({
                url: setting.urls.hdkGoodsAdd,
                method: 'post',
                data: qs.stringify({
                    goods: JSON.stringify(this.hdkGoodsArr)
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.alert('发布成功')
                    this.hdkGoodsIds = []
                    this.hdkGoodsArr = []
                    this.hdkGoodsAllChecked = false
                }else{
                    this.alert(rst.data.message || '发布失败')
                }
            }).catch(e => {
                this.alert(e.message || '发布失败')
            })
        },
        nextPage(type){
            // if(type == 'prev') {
            //     if(this.pageBegin <= 1) {
            //         this.alert('已经是第一页')
            //         return
            //     }else{
            //         this.pageBegin = this.pageBegin - 1
            //         this.loadHDKGoods(this.pageBegin)
            //     }
            // }else{
            //     this.pageBegin = this.pageBegin - 0 + 1
            //     this.loadHDKGoods(this.pageBegin)
            // }
            this.loadHDKGoods(type)
        },
        loadHDKGoods(type) {
            this.showPriceSelectBox = false
            // this.hdkGoodsAllChecked = false
            let pageNo = 0
            if(type == 1){
                pageNo = 1
                this.pageArr = []
                this.hdkGoodsAllChecked = false
                this.hdkGoodsIds = []
                this.hdkGoodsArr = []
            }else if(type == 'next'){
                if(this.pageBegin === 0){
                    return
                }
                if(!this.nextPageNo){
                    this.alert('没有下一页了')
                    return
                }
                pageNo = this.nextPageNo
            }else if(type == 'prev'){
                if(this.pageBegin === 0){
                    return
                }
                if(this.pageBegin == 1){
                    this.alert('已经是第一页了')
                    return
                }
                pageNo = this.pageArr.pop()
            }
            this.showLoading()
            this.loadTBData(setting.urls.hdkGoodsList, {
                fqcat: this.fqcat,
                minSale: this.minSale,
                minItemEndPrice: this.minItemEndPrice,
                maxItemEndPrice: this.maxItemEndPrice,
                couponEndTime: this.couponEndTime,
                saleSort: this.saleSort,
                generalSort: this.generalSort,
                shopType: this.shopType,
                pageBegin: pageNo || 1
            }, 'get').then(rst => {
                if(!rst.data || rst.data.length == 0){
                    this.hdkGoodsList = []
                    this.hdkGoodsAllChecked = false
                    this.alert('当前页无数据')
                }else{
                    this.hdkGoodsList = rst.data
                    let allChecked = true;
                    for(let idx = 0; idx < rst.data.length; idx ++) {
                        if(this.hdkGoodsIds.indexOf(rst.data[idx].productId) == -1){
                            allChecked = false
                            break
                        }
                    }
                    this.hdkGoodsAllChecked = allChecked
                }
                if(type == 'next' && this.pageBegin){
                    this.pageArr.push(this.pageBegin)
                }
                this.pageBegin = pageNo
                this.nextPageNo = rst.nextPage
            }).catch(e => {
                console.log(e)
            }).then(() => {
                this.hideLoading()
            })
        },
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
                    'end_time':this.createTimeEnd,
                    source: this.source,
                    'valid_endtime': this.valid_endtime,
                    'ypj_sales': this.ypj_sales
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
                console.log(resp,"批量导入了数据")
                const reslt = resp.data.data
                if(resp.data.code == 200){
                    if(reslt.data.length > 0){
                        let thead = ['商品ID','平台']
                        for (let v = 0; v < reslt.data.length; v++) {
                            thead.push('\r' + reslt.data[v]['goods_id'] + ',' + reslt.data[v].platform)
                        }
                        thead = thead.join(',')
                        this.excel(thead);//js写成csv文件
                    }
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
            let flag = true
            if(this.checkedId.length == 0){
                this.alert('请先选择需要下架的商品')
                return
            }
            for (let index = 0; index < this.checkedId.length; index++) {
                for (let v = 0; v < this.newFreeTbody.data.length; v++) {
                    if(this.checkedId[index] == this.newFreeTbody.data[v].id){
                        if(this.newFreeTbody.data[v]['in_show'] != '发布中'){
                            flag = false
                        }
                    }
                }
            }
            if(!flag){
                this.alert('商品中有未发布的商品!请重新选择！') 
            }else{
                this.tipsText = '确定要下架选中商品?'
                this.contentData.ids = this.checkedId.join(',')
                this.contentData.type = 'off'
                this.showTips = true
                this.operationType = '下架'
            }
        },
        batchRelease(){//批量发布
            let flag = true
            if(this.checkedId.length == 0){
                this.alert('请先选择需要发布的商品')
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
                this.tipsText = '确定要发布选中商品?'
                this.contentData.ids = this.checkedId.join(',')
                this.contentData.type = 'open'
                this.showTips = true
                this.operationType = '发布'
            }
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
                console.log(res)
                if(res.data.code == 200){
                    this.getNewFreeTbody()
                    this.alert(res.data.message)
                }else{
                    this.alert(res.data.message || '新建失败')
                }
            }).catch((e) => {
                this.alert('新建失败!')
            }).then((e) => {
                this.hideLoading()
            })
        },
        excel(data){
            const blob = new Blob([data])       
            const a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(blob, {
                type: "text/plain"
            });
            a.download = "免单商品.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
</script>
<style scoped>
.detail-data-box,.detail-container{margin: 0; padding: 0;}
.operation{display: flex;justify-content: space-between;}
.operationText{width: 100px;height: 30px;line-height: 30px;text-align: center;border-radius: 5px;background-color: #4880EA;color: #ffffff;font-size: 16px;margin-right: 30px;cursor: pointer;}
.table-container{margin: .22em 0 .875em;}
.urlAddre{font-size: 0.475rem;color: red;vertical-align: top; height: 30px; line-height: 30px;display: inline-block;}
.copyBtn{font-size: 0.575rem;color: #4880EA;cursor: pointer;margin:0 40px 0 20px;background-color: transparent; vertical-align: top;}
.selectOption{width: 4rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;margin-left: .2rem;}
.detail-data-box {
    overflow-x: auto;
}
.copyAddre {
    height: 30px;
    line-height: 30px;
}
.goodsContainer {
    width: 200%;
    height: 100%;
    display: flex;
    flex-direction: row;
}
.hdkGoods, .ypjGoods {
    width: 0;
    flex: 1;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 5px;
}
.hdkGoods .title, .ypjGoods .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: .5rem;
    font-weight: bold;
}
</style>
<style lang="less" scoped>
.ypjGoods {
    .search-header {
        display: block;
        .search-group {
            margin-bottom: .3rem;
        }
    }
}
.hdkGoods {
    .goodsSrc {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: .4375rem;
        display: flex;
        background-color: #F4F4F4;
        .left {
            width: auto;
        }
        .platforms {
            width: 0;
            flex: 1;
            overflow: hidden;
            margin-left: 10px;
            .platform {
                width: auto;
                margin-right: 8px;
                label {
                    margin-left: 3px;
                }
            }
        }
    }
    .search-header {
        .search-group {
            .priceSelectBox {
                z-index: 999;
                position: absolute;
                right: .5rem;
                top: 1rem;
                width: 3rem;
                .arrow {
                    width: 100%;
                    height: .3125rem;
                    text-align: center;
                    overflow: hidden;
                    position: relative;
                    z-index: 1001;
                    div {
                        width: .375rem;
                        height: .375rem;
                        box-sizing: border-box;
                        border: 1px solid #999;
                        transform: rotate(45deg);
                        display: inline-block;
                        position: absolute;
                        top: 0.125rem;
                        left: 1.3rem;
                    }
                }
                .prices {
                    z-index: 1000;
                    width: 100%;
                    height: auto;
                    box-sizing: border-box;
                    box-shadow: 1px 3px 5px 3px #eee;
                    background-color: white;
                    .price {
                        padding-left: .25rem;
                        padding-right: .25rem;
                        width: 100%;
                        height: 1rem;
                        line-height: 1rem;
                        box-sizing: border-box;
                    }
                    .price:hover {
                        background-color: rgb(97, 97, 228);
                        color: white;
                    }
                }
            }
        }
        .search-group>label.sort {
            display: inline-block;
            padding-left: 10px;
            height: 100%;
            line-height: 1rem;
            cursor: pointer;
            position: relative;
        }
        .search-group>label.sort::before {
            width: 10px;
            display: inline-block;
            height: 100%;
            line-height: 1rem;
            content: '↓';
            color: gray;
            font-size: .625rem;
            font-weight: bold;
            position: absolute;
            left: 0px;
        }
        .search-group>label.sort.box {
            border: 1px solid #CCC;
            box-sizing: border-box;
            padding-left: .4rem;
            padding-right: .4rem;
            border-radius: .125rem;
        }
        .search-group>label.sort.box.curr {
            background-color: rgb(119, 119, 243);
            color: white;
        }
        .search-group>label.sort.box.curr::before {
            color: white;
        }
        .search-group>label.sort.curr::before {
            color: rgb(12, 12, 236);
        }
        .search-group>.money {
            width: 2.5rem;
            display: inline-block;
            position: relative;
            input {
                width: 100%;
                height: 1rem;
                height: 1rem;
                border-radius: .125rem !important;
                border: 1px solid #D9D9D9;
                box-sizing: border-box;
                font-size: .4375rem;
                vertical-align: top;
                padding-left: .8125rem;
                padding-right: .3125rem;
            }
        }
        .search-group>.money::before {
            position: absolute;
            width: 1rem;
            left: 0;
            text-align: center;
            content: '￥';
            font-size: .4375rem;
            color: #282828;
        }
    }
}
td {
    max-width: 5rem;
}
</style>