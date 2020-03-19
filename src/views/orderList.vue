<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>订单编号:</label>
                    <input type="text" placeholder="请输入" v-model="orderNo">
                </div>
                <div class="search-group">
                    <label>下单用户:</label>
                    <input type="text" placeholder="请输入" v-model="user">
                </div>
                <selector class="search-group" :value="orderStatus" :selectParams="statuSelectParams" @selectOptsClicked="statuSelectOptsClicked"></selector>
                <selector class="search-group" :value="platform" :selectParams="platSelectParams" @selectOptsClicked="platSelectOptsClicked"></selector>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                </div>
                <button class="search-btn" @click="loadTBData(1)">搜索</button>
            </header>
            <div class="table-container scrollable">
                <detail-table style="width: 100rem;" v-bind:tbType="tbType" v-bind:tbData="tbData" v-bind:tableHeader="tableHeader"></detail-table>
            </div>
            <div class="page-footer">
                <page v-bind:pageData="pageData" @loadList="loadTBData"></page>
            </div>
        </div>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import Selector from '@/components/common/select.vue'
import request from '@/axios'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'selector': Selector,
        'detail-table': DetailTable,
        'page': page
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            pageData: {
                'total': 0,
                'page': 1,
                'total_page': 0
            },
            tableHeader: setting.tableHeader.orderList,
            tbData: [],
            statuSelectParams: {
                label: '订单状态',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 10,
                    text: '待收货'
                }, {
                    value: 20,
                    text: '已收货'
                }, {
                    value: 30,
                    text: '已冻结(待结算)'
                }, {
                    value: 40,
                    text: '已结算'
                }, {
                    value: 90,
                    text: '已失效'
                }, {
                    value: 91,
                    text: '已退款(维权退款单)'
                }]
            },
            platSelectParams: {
                label: '订单平台',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 'pdd',
                    text: '拼多多'
                }, {
                    value: 'jd',
                    text: '京东'
                }, {
                    value: 'tm',
                    text: '天猫'
                }, {
                    value: 'jhs',
                    text: '聚划算'
                }, {
                    value: 'tb',
                    text: '淘宝'
                }, {
                    value: 'elm',
                    text: '饿了么'
                }]
            },
            orderNo: '',
            user: '',
            orderStatus: '',
            platform: '',
            createTimeBegin: '',
            createTimeEnd: '',
            tbType: 'orderList'
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            const fields = ['platOrderNo', 'goodsTitle', 'buyerName', 'buyerAvatar', 'orderAmount', 'platCommissionAmount', 'buyerCommissionAmount', 'orderStatus', 'tbType', 'oneProfit', 'twoProfit', 'leaderProfit', 'directorProfit', 'platCreateTime', 'lastUpdateTime', 'subOrderNo', 'goodsNum', 'goodsPrice', 'payAmount', 'platCommissionRate', 'commissionAmount', 'subsidyRate', 'subsidyAmount', 'subSideRate', 'technicalServiceRate', 'technicalServiceFee', 'paymentEstimateFee', 'settleEstimateFee', 'depositTime', 'tbDepositTime', 'depositAmount']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || (item[fields[idxx]] === 0 ? item[fields[idxx]] : '--'))
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: '/order/getAll',
                method: 'get',
                params: {
                    page: pageNum || 1,
                    orderNo: this.orderNo,
                    user: this.user,
                    orderStatus: this.orderStatus,
                    platform: this.platform,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载订单列表失败')
                    }
                }else{
                    this.alert('加载订单列表失败')
                }
            }).catch((error) => {
                this.alert('加载订单列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        statuSelectOptsClicked: function(status){
            this.orderStatus = status
        },
        platSelectOptsClicked: function(plat){
            this.platform = plat
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.table-container { overflow-x: scroll; }
</style>