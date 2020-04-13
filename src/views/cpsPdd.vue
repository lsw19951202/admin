<template>
    <div class="detail-container">
        <card-container v-bind:cardData="cardData"></card-container>
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="end_time" placeholder="结束时间"></flat-picker>
                </div>
                <button class="search-btn" @click="loadTBData(1)">搜索</button>
                <button class="action-btn" @click="showPool">资金池</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table v-bind:tbData="tbData" v-bind:tableHeader="tableHeader" v-bind:tbType="tbType"></detail-table>
            </div>
            <div class="mx-list">
                <div class="mx-item">
                    <label>订单成交金额:</label>
                    <span>{{mxData.total_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>结算佣金金额:</label>
                    <span>{{mxData.settle_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>订单预估佣金:</label>
                    <span>{{mxData.estimate_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>冻结佣金:</label>
                    <span>{{mxData.freeze_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>维权佣金:</label>
                    <span>{{mxData.legal_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>退款佣金:</label>
                    <span>{{mxData.refund_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>应付佣金:</label>
                    <span>{{mxData.rebate_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>毛利:</label>
                    <span>{{mxData.profit_amount || 0}}</span>
                </div>
                <div class="mx-item">
                    <label>毛利率:</label>
                    <span>{{mxData.profit_proportion || '0%'}}</span>
                </div>
            </div>
            <page v-bind:pageData="pageData" @loadList="loadTBData"></page>
        </div>
        <pop-ups v-bind:isShow="showPop" v-bind:popParams="popParams" @hidePop="hideMoneyPoolPop"></pop-ups>
    </div>
</template>
<script>
import CardContainer from '@/components/content/cardContainer.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import request from '@/axios'
import PopUps from '@/components/common/popUps.vue'
import Page from '@/components/content/page.vue'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'

// require('@/mock')

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'card-container': CardContainer,
        'flat-picker': flatPicker,
        'page': Page,
        'pop-ups': PopUps,
        'detail-table': DetailTable
    },
    data: () => {
        const now = new Date()
        now.setDate(now.getDate() - 1)
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        now.setDate(now.getDate() - 15)
        let startTime = ''
        startTime = now.getFullYear() + '-' + (((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1)) + '-' + (((now.getDate() < 10) ? '0' : '') + now.getDate())
        return {
            cardData: [],
            'start_time': startTime,
            'end_time': nStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            pageData: {
                'total_page': 0,
                page: 1,
                total: 0
            },
            tbData: [],
            mxData: {
                'total_amount': 0,
                'settle_amount': 0,
                'estimate_amount': 0,
                'freeze_amount': 0,
                'legal_amount': 0,
                'refund_amount': 0,
                'rebate_amount': 0,
                'profit_amount': 0,
                'tb_tech_fee': 0,
                'profit_proportion': '0%'
            },
            tbType: 'common',
            tableHeader: setting.tableHeader.cpsPdd,
            showPop: false,
            popParams: { style: '', htmlContent: '' },
            'order_type': 3
        }
    },
    created: function(){
        this.loadTBData()
        this.loadCardData()
    },
    methods: {
        hideMoneyPoolPop: function(){
            this.showPop = false
        },
        loadTBData: function(pageNum){
            console.log(pageNum)
            if(new Date(this.start_time) > new Date(this.end_time)){
                this.alert('开始时间不能大于结束时间')
                return
            }
            let now = new Date()
            now = new Date(now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate())
            if(new Date(this.start_time) > now || new Date(this.end_time) > now){
                this.alert('开始时间和结束时间不能大于昨天')
                return
            }
            this.showLoading()
            request({
                url: setting.urls.cpsCollect,
                method: 'get',
                params: {
                    page: pageNum || 1,
                    'start_time': this.start_time,
                    'end_time': this.end_time,
                    'order_type': this.order_type
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createTBData(rst.data)
                    }else{
                        this.alert(rst.message || '拼多多订单数据加载失败')
                    }
                }else{
                    this.alert('拼多多订单数据加载失败')
                }
            }).catch((error) => {
                this.alert('拼多多订单数据加载失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            // 分页数据
            this.pageData.total = dt.total || 0
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0
            this.pageData.page = dt.page || 1
            // 表格数据
            const tbData = []
            const fields = ['statistics_day', 'total_order_amount', 'total_order_number', 'settle_commission_amount', 'settle_order_number', 'estimate_commission_amount', 'estimate_order_number', 'freeze_commission_amount', 'freeze_order_number', 'legal_commission_amount', 'legal_order_number', 'refund_commission_amount', 'refund_order_number', 'paid_rebate_amount', 'rebate_amount', 'profit_amount', 'profit_proportion']
            for(let row = 0; row < dt.data.length; row++){
                const item = dt.data[row]
                tbData.push([])
                for(let col = 0; col < fields.length; col++){
                    tbData[row].push(item[fields[col]] || 0)
                }
            }
            this.tbData = Object.assign({}, tbData)
            // 明细数据
            this.mxData = dt.statistics
        },
        showPool: function(){
            console.log('显示资金池')
            this.showLoading()
            request({
                url: setting.urls.pool,
                method: 'get',
                params: {}
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        let str = '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">应收未确认待收款资金池:<span style="color: #ff2a2a;">' + (result.data['pool_one'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">已确认待收款资金池:<span style="color: #ff2a2a;">' + (result.data['pool_two'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">预估返利资金池:<span style="color: #ff2a2a;">' + (result.data['pool_three'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">结算返利资金池:<span style="color: #ff2a2a;">' + (result.data['pool_four'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">提现资金池:<span style="color: #ff2a2a;">' + (result.data['pool_five'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">余额资金池:<span style="color: #ff2a2a;">' + (result.data['pool_six'] || 0) + '</span></div>'
                        this.popParams.htmlContent = str
                        this.popParams.style = {
                            'font-size': '0.5rem',
                            'width': '20rem',
                            'height': '8.21rem',
                            'padding': '1.25rem 0.625rem'
                        }
                        this.showPop = true
                    }else{
                        this.alert(result.message || '加载资金池数据失败')
                    }
                }else{
                    this.alert('加载资金池数据失败')
                }
            }).catch((error) => {
                this.alert('加载资金池数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadCardData: function(){
            this.showLoading()
            request({
                url: setting.urls.cpsYesterday,
                method: 'get',
                params: {
                    'order_type': this.order_type
                }
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        const dt = result.data
                        this.createCardData(dt)
                    }else{
                        this.alert(result.message || '加载昨日数据失败')
                    }
                }else{
                    this.alert('加载昨日数据失败')
                }
            }).catch((error) => {
                console.log(error)
                this.alert('加载昨日数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createCardData: function(dt){
            const cardData = []
            cardData.push({
                text: '昨日订单成交金额',
                num: dt['total_order_amount'] || 0,
                imgSrc: require('@/assets/today_chengjiaoe.png')
            })
            cardData.push({
                text: '昨日订单数量',
                num: dt['total_order_number'] || 0,
                imgSrc: require('@/assets/today_dingdan.png')
            })
            cardData.push({
                text: '昨日结算佣金金额',
                num: dt['settle_commission_amount'] || 0,
                imgSrc: require('@/assets/today_fuwufei.png')
            })
            cardData.push({
                text: '昨日订单预估佣金',
                num: dt['estimate_commission_amount'] || 0,
                imgSrc: require('@/assets/today_fenchengjine.png')
            })
            cardData.push({
                text: '昨日应付返利金额',
                num: dt['rebate_amount'] || 0,
                imgSrc: require('@/assets/today_dakuan.png')
            })
            cardData.push({
                text: '昨日毛利',
                num: dt['profit_amount'] || 0,
                imgSrc: require('@/assets/today_maoli.png')
            })
            cardData.push({
                text: '昨日毛利率',
                num: dt['profit_proportion'] || 0,
                imgSrc: require('@/assets/today_maolilv.png')
            })
            this.cardData = Object.assign({}, [cardData])
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.mx-list { width: 100%; line-height: .6rem; }
.mx-item { float: left; font-size: .3125rem; margin-left: .5rem; }
.mx-item>span { color: #ff2a2a; }
</style>