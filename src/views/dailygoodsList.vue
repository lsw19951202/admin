<template>
<div class="detail-container">
    <div class="detail-data-box" v-show="!showOrderList && !showEditPage">
        <header class="search-header">
            <div class="search-group">
                <label>商品ID</label>
                <input type="text" placeholder="请输入" v-model="goods_id">
            </div>
            <div class="search-group">
                <label>所属平台</label>
                <select v-model="platform">
                    <option value="">全部</option>
                    <option value="tb">淘宝</option>
                    <option value="jd">京东</option>
                    <option value="pdd">拼多多</option>
                </select>
            </div>
            <div class="search-group">
                <label>销量排序</label>
                <select v-model="sale_num">
                    <option value="">清选择</option>
                    <option value="1">升序</option>
                    <option value="2">降序</option>
                </select>
            </div>
            <div class="search-group">
                <label>更新时间</label>
                <flat-pickr class="search-time-picker" v-model="start_time" placeholder="开始时间" :config="dateConfig"></flat-pickr>
                <div class="split-line"><div></div></div>
                <flat-pickr class="search-time-picker" v-model="end_time" placeholder="结束时间" :config="dateConfig"></flat-pickr>
            </div>
            <button class="action-btn" @click.prevent.stop="loadGoodsList(1)">搜索</button>
            <button class="action-btn" v-if="goods_import == 'T'" @click.prevent.stop="checkFile">批量导入</button>
            <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                <input type="file" ref="excelIpt" @change="uploadExcel" accept=".csv, .xlsx" name="file">
            </form>
            <a class="action-btn" style="display: inline-block;" download="导出日常商品列表.xlsx" :href="downloadUrl">批量导出</a>
            <button class="action-btn" @click.prevent.stop="changeStatus">商品状态批量修改</button>
            <div class="search-group" style="position: relative;" v-show="showChangeStatusBox">
                <div class="status" style="position: absolute; top: -1rem; width: 3rem; background-color: #F2F2F2; text-align: center;">
                    <div class="line">
                        <input type="radio" id="status1" value="open" name="status" v-model="changedStatus">
                        <label for="status1">正在推广</label>
                    </div>
                    <div class="line" style="background: #F9F9F9;">
                        <input type="radio" name="status" id="status3" value="off" v-model="changedStatus">
                        <label for="status3">已完成</label>
                    </div>
                    <div class="btns">
                        <div class="action-btn" style="display: inline-block; padding-left: .3rem; padding-right: .3rem;" @click.prevent.stop="confirmChangeStatus">确定</div>
                    </div>
                </div>
            </div>
            <button class="action-btn" v-if="goods_add == 'T'" @click.prevent.stop="createNewChannel">新建</button>
        </header>
        <div class="tj">
            <div class="tj-item">商品数量：{{goodsNum}}</div>
            <div class="tj-item">商品销量：{{goodsSaleNum}}</div>
        </div>
        <div class="table-container">
            <table cellspacing="0" style="width: 80rem;">
                <thead>
                    <tr>
                        <td style="width: 2.5625rem; text-align: center;">
                            <input type="checkbox" :checked="allChecked" @click="checkAllChannel">
                        </td>
                        <td v-for="(headerItem, index) in tableHeader[0]" :key="index">
                            {{ headerItem.name }}
                        </td>
                        <td>
                            操作
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in goodsList" :key="index">
                        <td style="width: 2.5625rem; text-align: center;">
                            <input type="checkbox" :checked="checkedArr.indexOf(row['id']) >= 0" @click="checkChannel($event ,index)">
                        </td>
                        <td v-for="(field, idx) in fields" :key="idx">
                            {{ row[field] }}
                        </td>
                        <td>
                            <button class="action-btn" style="padding:0 .3rem;" @click.prevent.stop="lookUpGoods(index)">查看</button>
                            <button class="action-btn" style="padding:0 .3rem;" v-if="row['dailygoods_edit'] == 'T'" @click.prevent.stop="editGoods(index)">编辑</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <page :pageData="pageData" @loadList="loadGoodsList"></page>
    </div>
    <div class="detail-data-box" v-show="showOrderList">
        <header class="search-header">
            <div class="search-group">
                <label>订单编号</label>
                <input type="text" v-model="orderNo">
            </div>
            <div class="search-group">
                <label>下单用户</label>
                <input type="text" v-model="user">
            </div>
            <div class="search-group">
                <label>订单状态</label>
                <select v-model="orderStatus">
                    <option value="">全部</option>
                    <option v-for="(stat, index) in statusArr" :key="index" value="stat.status">{{stat.status_name}}</option>
                </select>
            </div>
            <div class="search-group">
                <label>订单平台</label>
                <select v-model="orderPlatform">
                    <option value="">全部</option>
                    <option v-for="(plat, index) in platArr" :key="index" value="plat.plat">{{plat.plat_name}}</option>
                </select>
            </div>
            <div class="search-group">
                <label>日期筛选</label>
                <flat-pickr class="search-time-picker" v-model="createTimeBegin" placeholder="开始时间" :config="dateConfig"></flat-pickr>
                <div class="split-line"><div></div></div>
                <flat-pickr class="search-time-picker" v-model="createTimeEnd" placeholder="结束时间" :config="dateConfig"></flat-pickr>
            </div>
            <button class="action-btn" @click.prevent.stop="loadOrderList">搜索</button>
        </header>
        <div class="table-container">
            <table cellspacing="0" style="width: 90rem;">
                <thead>
                    <tr>
                        <td v-for="(headerItem, index) in orderListTableHeader[0]" :key="index">
                            {{ headerItem.name }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in orderList" :key="index">
                        <td v-for="(field, idx) in orderListFields" :key="idx">
                            {{ row[field] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="width: 100%; display: flex;">
            <div class="action-btn" style="font-size: .4375rem;" @click.prevent.stop="prevClicked">返回上一级</div>
            <page :pageData="orderListPageData" style="flex: 1;" @loadList="loadOrderList"></page>
        </div>
    </div>
    <div class="detail-data-box" v-show="showEditPage">
        <div class="editor-header">{{goods.id === null ? '新建服务费商品' : '编辑服务费商品'}}</div>
        <div class="editor-body hideScrollBar goodsEdit">
            <div class="editor-groups">
                <h6>商品信息</h6>
                <div class="items">
                    <div class="item">
                        <label>商品链接</label>
                        <input type="text" @change="goodsUrlChanged" v-model="goods.goods_url">
                    </div>
                    <div class="item">
                        <label>商品名称</label>
                        <input type="text" v-model="newgoods_name" disabled>
                    </div>
                    <div class="item">
                        <label>商品ID</label>
                        <input type="text" v-model="newgoods_id" disabled>
                    </div>
                    <div class="item">
                        <label>所属平台</label>
                        <select v-model="newgoods_platform" disabled>
                            <option value="tb">淘宝</option>
                            <option value="jd">京东</option>
                            <option value="pdd">拼多多</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="editor-groups">
                <h6>店铺信息</h6>
                <div class="items">
                    <div class="item">
                        <label>店铺名称</label>
                        <input type="text" v-model="shop_name" disabled>
                    </div>
                    <div class="item">
                        <label>店铺类型</label>
                        <input type="text" v-model="shop_type" disabled>
                    </div>
                </div>
            </div>
            <div class="editor-groups">
                <h6>商品价格</h6>
                <div class="items">
                    <div class="item">
                        <label>商品券前价格</label>
                        <input type="text" v-model="goods_price" disabled>
                    </div>
                    <div class="item">
                        <label>商品券后价格</label>
                        <input type="text" v-model="goods_coupon_price" disabled>
                    </div>
                    <div class="item">
                        <label>商家佣金比例</label>
                        <input type="text" v-model="shop_commission_rate" disabled>
                    </div>
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" @click.prevent.stop="saveEditedGoods">保存</button>
                    <button class="action-btn" style="background-color: #ccc; color: #282828;" @click.prevent.stop="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
    <confirm :isShow="showConfirmParams" :confirmParams="confirmParams" @confirmClicked="confirmClicked"></confirm>
</div>
</template>
<script>
import flatpickrVue from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import pageVue from '@/components/content/page.vue'
import confirmVue from '@/components/common/confirm.vue'
import request from '@/axios'
import qs from 'qs'

export default {
    components: {
        'flat-pickr': flatpickrVue,
        page: pageVue,
        confirm: confirmVue
    },
    inject: ['reload', 'alert', 'loadFields', 'loadTBData', 'showLoading', 'hideLoading'],
    data(){
        return {
            'shop_commission_rate': 0,
            statusArr: [],
            platArr: [],
            orderPlatform: '',
            createTimeEnd: '',
            createTimeBegin: '',
            orderNo: '',
            user: '',
            orderStatus: '',
            editable: false,
            'goods_coupon_price': '',
            'goods_price': '',
            'shop_type': '',
            'shop_name': '',
            'newgoods_id': '',
            'newgoods_name': '',
            'newgoods_platform': '',
            goods: {id: '', 'goods_url': '', type: 3},
            showConfirmParams: false,
            'goods_import': 'F',
            'goods_add': 'F',
            showEditPage: false,
            showChangeStatusBox: false,
            showOrderList: false,
            'goods_id': '',
            platform: '',
            'channel_id': '',
            status: '',
            'start_time': '',
            'end_time': '',
            changedStatus: '',
            channelList: [],
            allChecked: false,
            checkedArr: [],
            dateConfig: {
                'time_24hr': true,
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i:S',
                enableTime: true,
            },
            fields: [],
            goodsList: [],
            orderList: [],
            orderListFields: ['platOrderNo', 'goodsTitle', 'buyerName', 'buyerAvatar', 'orderAmount', 'platCommissionAmount', 'buyerCommissionAmount', 'orderStatus', 'tbType', 'oneProfit', 'twoProfit', 'leaderProfit', 'directorProfit', 'platCreateTime', 'lastUpdateTime', 'subOrderNo', 'goodsNum', 'goodsPrice', 'payAmount', 'platCommissionRate', 'commissionAmount', 'subsidyRate', 'subsidyAmount', 'subSideRate', 'technicalServiceRate', 'technicalServiceFee', 'paymentEstimateFee', 'settleEstimateFee', 'depositTime', 'tbDepositTime', 'depositAmount'],
            tableHeader: [],
            orderListTableHeader: setting.tableHeader.orderList,
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            orderListPageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            goodsNum: 0,
            goodsSaleNum: 0,
            incomeAmount: 0,
            'sale_num': '',
            confirmParams: {
                header: '操作提示',
                type: 'modifyStatus',
                text: '请确定是否保存修改?',
                status: ''
            },
            timer: null
        }
    },
    created(){
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'dailyGoodsList' }, 'get'),
            this.loadTBData(setting.urls.dailyGoodsList, { page: 1 }, 'get'),
            this.loadTBData(setting.urls.channerList, { pageSize: 1 }, 'get')
        ]).then(rst => {
            this.tableHeader = rst[0].tableHeader
            this.fields = rst[0].fields
            this.makeData(rst[1])
            this.channelList = rst[2].data || []
        }).catch(e => {
            this.alert(e.message || '加载商品列表失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    computed: {
        downloadUrl(){
            return setting.baseUrl + setting.urls.dailyGoodsList + '?ids=' + this.checkedArr.join(',') + '&goods_id=' + this.goods_id + '&platform=' + this.platform + '&channel_id=' + this.channel_id + '&status=' + this.status + '&sale_num=' + this.sale_num + '&start_time=' + this.start_time + '&end_time=' + this.end_time + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    methods: {
        prevClicked(){
            this.showOrderList = false
        },
        loadOrderList(pageNo){
            this.loadTBData(setting.urls.appOrderList, {
                page: pageNo || 1,
                orderNo: this.orderNo,
                user: this.user,
                orderStatus: this.orderStatus,
                platform: this.orderPlatform,
                createTimeBegin: this.createTimeBegin,
                createTimeEnd: this.createTimeEnd,
                'goods_id': this.goods.id
            }).then(rst => {
                if(!this.platArr || this.platArr.length == 0){
                    this.platArr = rst.platArr || []
                }
                if(!this.statusArr || this.statusArr.length == 0){
                    this.statusArr = rst.statusArr || []
                }
                this.orderListPageData.total = rst.total || 0
                this.orderListPageData.page = rst.page || 1
                this.orderListPageData['total_page'] = rst.pageCount || rst.total_page || 0

                this.orderList = rst.data
            })
        },
        saveEditedGoods(){
            if(!this.goods.goods_url){
                this.alert('商品链接必填')
                return
            }
            return request({
                url: setting.urls.dailyGoodsAdd,
                method: 'post',
                data: qs.stringify(this.goods)
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.showEditPage = false
                    this.loadGoodsList(this.pageData.page)
                    this.alert('保存商品成功')
                }else{
                    this.alert(rst.data.message || '保存商品失败')
                }
            }).catch(e => {
                this.alert(e.message || '保存商品失败')
            })
        },
        cancelEdit(){
            this.showEditPage = false
        },
        goodsUrlChanged(){
            if(this.goods.goods_url){
                return request({
                    url: setting.urls.zsGoodsInfo,
                    method: 'post',
                    data: qs.stringify({
                        'goods_url': this.goods.goods_url
                    })
                }).then(rst => {
                    if(rst.status == 200 && rst.data.code == 200){
                        if(rst.data.data){
                            this.$data['goods_coupon_price'] = rst.data.data.coupon_end_price || 0
                            this.$data['goods_price'] = rst.data.data.price
                            this.$data['shop_type'] = rst.data.data.shop_type
                            this.$data['shop_name'] = rst.data.data.shop_name
                            this.$data['newgoods_id'] = rst.data.data.goods_id
                            this.$data['newgoods_name'] = rst.data.data.goods_name
                            this.$data['newgoods_platform'] = rst.data.data.platform
                            this.$data['shop_commission_rate'] = rst.data.data.shop_commission_rate
                        }else{
                            this.alert('商品未找到')
                        }
                    }else{
                        this.alert(rst.data.message || '加载商品信息失败')
                    }
                }).catch(e => {
                    this.alert(e.message || '加载商品信息失败')
                })
            }
        },
        lookUpGoods(index){
            this.goods = this.goodsList[index]
            this.orderNo = ''
            this.user = ''
            this.orderPlatform = ''
            this.orderStatus = ''
            this.createTimeEnd = ''
            this.createTimeBegin = ''
            this.loadOrderList()
            this.showOrderList = true
        },
        editGoods(index){
            this.editable = true
            this.goods = this.goodsList[index]
            this.$data['goods_coupon_price'] = this.goods.coupon_end_price || 0
            this.$data['goods_price'] = this.goods.price
            this.$data['shop_type'] = this.goods.shop_type
            this.$data['shop_name'] = this.goods.shop_name
            this.$data['newgoods_id'] = this.goods.goods_id
            this.$data['newgoods_name'] = this.goods.goods_name
            this.$data['newgoods_platform'] = this.goods.platform
            this.$data['shop_commission_rate'] = this.goods.shop_commission_rate
            this.showEditPage = true
        },
        createNewChannel(){
            this.editable = true
            this.goods = {id: '', 'goods_url': '', type: 3}
            this.$data['goods_coupon_price'] = ''
            this.$data['goods_price'] = ''
            this.$data['shop_type'] = ''
            this.$data['shop_name'] = ''
            this.$data['newgoods_id'] = ''
            this.$data['newgoods_name'] = ''
            this.$data['newgoods_platform'] = ''
            this.$data['shop_commission_rate'] = 0
            this.showEditPage = true
        },
        operateGoods(){
            return request({
                url: setting.urls.dailyGoodsOperate,
                method: 'post',
                data: qs.stringify({
                    ids: this.checkedArr.join(','),
                    type: this.changedStatus
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadGoodsList(this.pageData.page)
                    this.alert('修改成功')
                }else{
                    this.alert(rst.data.message || '修改失败')
                }
            }).catch(e => {
                this.alert(e.message || '修改失败')
            })
        },
        confirmClicked(dt){
            this.showConfirmParams = false
            console.log(dt)
            if(dt.status){
                this.operateGoods()
            }
        },
        confirmChangeStatus(){
            this.changeStatus()
            if(!this.changedStatus){
                return
            }
            this.confirmParams.status = this.changedStatus
            if(this.checkedArr.length == 0){
                this.alert('您还未选择要修改的商品')
                return
            }
            this.showConfirmParams = true
        },
        checkFile(){
            this.$refs.excelIpt.click()
        },
        uploadExcel(){
            this.checkedArr = []
            this.allChecked = false
            this.showLoading()
            const formData = new FormData(this.$refs.fileForm)
            request({
                url: setting.urls.dailygoodsImport,
                method: 'post',
                data:formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.alert('导入日常商品成功')
                    this.loadGoodsList()
                }else{
                    this.alert(rst.data.message || '导入日常商品失败')
                }
            }).catch(e =>{
                this.alert(e.message || '导入日常商品失败')
            }).then(() => {
                this.hideLoading()
                this.$refs.excelIpt.value = ''
            })
        },
        changeStatus(){
            this.showChangeStatusBox = !this.showChangeStatusBox
        },
        makeData(dt){
            this.pageData.total = dt.total || 0
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0
            this.pageData.page = dt.page || 1

            this.$data['goods_add'] = dt.actions.dailygoods_add || 'F'
            this.$data['goods_import'] = dt.actions.dailygoods_import || 'F'

            this.goodsNum = dt.goods_num || 0
            this.goodsSaleNum = dt.sale_num || 0
            this.incomeAmount = dt.total_profit || 0

            this.goodsList = dt.data
        },
        loadGoodsList(pageNo){
            this.checkedArr = []
            this.allChecked = false
            this.loadTBData(setting.urls.dailyGoodsList, {
                page: pageNo || 1,
                'goods_id': this.goods_id,
                platform: this.platform,
                'channel_id': this.channel_id,
                status: this.status,
                'sale_num': this.sale_num,
                'start_time': this.start_time,
                'end_time': this.end_time
            }, 'get').then(rst => {
                this.makeData(rst)
            })
        },
        loadTJData(){
            this.loadTBData(setting.urls.dailyGoodsList, {
                ids: this.checkedArr.join(','),
                'is_tj': 1
            }, 'get').then(rst => {
                this.goodsNum = rst.goods_num || 0
                this.goodsSaleNum = rst.sale_num || 0
                this.incomeAmount = rst.total_profit || 0
            })
        },
        checkChannel(e, index){
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            if(this.checkedArr.indexOf(this.goodsList[index].id) >= 0){
                this.checkedArr.splice(this.checkedArr.indexOf(this.goodsList[index].id), 1)
            }else{
                this.checkedArr.push(this.goodsList[index].id)
            }
            if(this.checkedArr.length == this.goodsList.length){
                this.allChecked = true
            }else{
                this.allChecked = false
            }
            this.timer = setTimeout(() => {
                this.loadTJData()
                this.timer = null
            }, 1000)
        },
        checkAllChannel(){
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            if(this.allChecked){
                this.checkedArr = []
            }else{
                for(let idx = 0; idx < this.goodsList.length; idx++){
                    this.checkedArr.push(this.goodsList[idx].id)
                }
            }
            this.allChecked = !this.allChecked
            this.timer = setTimeout(() => {
                this.loadTJData()
                this.timer = null
            }, 1000)
        }
    }
}
</script>
<style lang="less" scoped>
.detail-container {
    background-color: #f2f2f2;
    padding: 0;
    margin: 0;
    overflow: hidden;
    .detail-data-box {
        margin-top: 0;
        .search-header {
            display: block;
            .search-group {
                margin-bottom: .5rem;
            }
        }
        .tj {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            .tj-item {
                width: auto;
                margin-left: 1rem;
                display: inline-block;
                font-size: .4375rem;
                vertical-align: top;
            }
            .tj-item:first-child {
                margin-left: 0;
            }
        }
        .table-container {
            overflow: auto;
            margin-top: 0.5rem;
        }
        .editor-header {
            font-weight: bold;
            height: 2.34375rem;
            line-height: 2.34375rem;
            border-bottom: 1px solid #e6e6e6;
            font-size: .5625rem;
            padding-left: 1.125rem;
        }
        .editor-body {
            height: 0;
            flex: 1;
            padding: .75rem 1.125rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            overflow-y: auto;
            .editor-groups {
                width: 100%;
                height: 1.25rem;
                line-height: 1.25rem;
                display: flex;
                margin-top: .625rem;
                font-size: .4375rem;
                label {
                    width: 3.0625rem;
                    height: 100%;
                    line-height: 1.25rem;
                }
                div {
                    input {
                        font-size: .4375rem;
                        width: 15.9375rem;
                        height: 100%;
                        line-height: 1.25rem;
                        border: 1px solid #d9d9d9;
                        border-radius: .125rem;
                        padding: .3125rem;
                        box-sizing: border-box;
                    }
                    textarea {
                        resize: none;
                        height: 100%;
                        border: 1px solid #d9d9d9;
                        border-radius: .125rem;
                        padding: .3125rem;
                        box-sizing: border-box;
                    }
                    select {
                        appearance: menulist;
                        font-size: .4375rem;
                        width: 7rem;
                        height: 100%;
                        line-height: 1.25rem;
                        border: 1px solid #d9d9d9;
                        border-radius: .125rem;
                        padding: .3125rem;
                        box-sizing: border-box;
                        margin-left: .3rem;
                        margin-right: .3rem;
                    }
                }
            }
            .necessary>label {
                position: relative;
            }
            .necessary>label::after {
                content: '*';
                color: red;
                display: inline-block;
                position: absolute;
                font-size: .4375rem;
            }
            .editor-groups:first-child {
                margin-top: 0;
            }
        }
        .editor-body.goodsEdit {
            .editor-groups {
                display: block;
                height: auto;
                line-height: unset;
                h6 {
                    font-size: .5rem;
                    color: #333;
                    display: block;
                    margin-bottom: .5rem;
                }
                .items {
                    width: 100%;
                    height: auto;
                    .item {
                        display: inline-block;
                        margin-right: .5rem;
                        margin-bottom: .5rem;
                        label {
                            width: auto;
                            display: inline-block;
                            margin-right: .5rem;
                        }
                        input {
                            width: 10rem;
                        }
                        select {
                            margin-left: 0;
                        }
                        textarea {
                            vertical-align: top;
                            width: 0;
                            flex: 1;
                            height: 3rem;
                        }
                    }
                }
            }
        }
    }
}
td {
    max-width: 7rem;
    word-break: break-all;
}
</style>