<template>
    <div class="detail-container">
        <card-container v-bind:cardData="cardData"></card-container>
    </div>
</template>
<script>
import CardContainer from '@/components/content/cardContainer.vue'

import request from '@/axios'
import setting from '../setting'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'card-container': CardContainer
    },
    data: () => {
        return {
            cardData: []
        }
    },
    created: function(){
        this.loadData()
    },
    methods: {
        loadData: function(){
            this.showLoading()
            const todayRequest = this.createRequest(setting.urls.cpsToday, 'get', {})
            const yesterdayRequest = this.createRequest(setting.urls.cpsYesterday, 'get', {})
            const monthRequest = this.createRequest(setting.urls.cpsMonth, 'get', {})
            const lastMonthRequest = this.createRequest(setting.urls.cpsLastMonth, 'get', {})
            Promise.all([todayRequest, yesterdayRequest, monthRequest, lastMonthRequest])
                .then((data) => {
                    this.createCardData(data)
                }).catch((error) => {
                    this.alert('加载CPS首页数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        createCardData: function(dt){
            const cardData = []
            const titlePrev = ['今日', '昨日', '本月', '上月']
            const imgPrev = ['today', 'yesterday', 'month', 'last_month']
            const titleSuff = {
                'total_order_amount': '订单成交金额(元)',
                'total_order_number': '订单数量(个)',
                'settle_commission_amount': '结算佣金金额(元)',
                'estimate_commission_amount': '订单预估佣金(元)',
                'rebate_amount': '应付返利金额(元)',
                'profit_amount': '毛利(元)',
                'profit_proportion': '毛利率'
            }
            const imgSuff = {
                'total_order_amount': 'chengjiaoe',
                'total_order_number': 'dingdan',
                'settle_commission_amount': 'fuwufei',
                'estimate_commission_amount': 'fenchengjine',
                'rebate_amount': 'dakuan',
                'profit_amount': 'maoli',
                'profit_proportion': 'maolilv'
            }
            for(let idx = 0;idx < 4;idx++){
                const rowData = dt[idx]
                cardData[idx] = []
                for(const key in rowData){
                    cardData[idx].push({
                        text: titlePrev[idx] + titleSuff[key],
                        num: rowData[key] || 0,
                        imgSrc: require('@/assets/' + imgPrev[idx] + '_' + imgSuff[key] + '.png')
                    })
                }
            }
            this.cardData = Object.assign({}, cardData)
        },
        createRequest: function(url, method, dts){
            return new Promise((resolve, reject) => {
                return request({
                    url: url,
                    method: method,
                    params: dts || {}
                }).then((response) => {
                    if(response.status == 200){
                        const result = response.data
                        if(result.code == 200){
                            resolve(result.data)
                            return
                        }
                    }
                    reject(response)
                }).catch((error) => {
                    reject(error)
                })
            });
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>