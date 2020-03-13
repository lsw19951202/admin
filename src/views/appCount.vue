<template>
    <div class="detail-container">
        <header class="search-header">
            <div class="search-group">
                <label>日期筛选:</label>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" placeholder="起始时间"></flat-picker>
                <div class="split-line">
                    <div></div>
                </div>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="end_time" placeholder="结束时间"></flat-picker>
            </div>
            <button class="search-btn" @click="loadAppCountData">搜索</button>
        </header>
        <card-container v-bind:cardData="cardData"></card-container>
        <alert v-bind:isShow="showAlert" v-bind:alertParams="alertParams" @alertOkClicked="alertOkClicked"></alert>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import CardContainer from '@/components/content/cardContainer.vue'
import Alert from '@/components/common/alert.vue'

import request from '@/axios'

export default {
    components: {
        'flat-picker': flatPicker,
        'card-container': CardContainer,
        alert: Alert
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        now.setDate(now.getDate() - 15)
        let startTime = ''
        startTime = now.getFullYear() + '-' + (((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1)) + '-' + (((now.getDate() < 10) ? '0' : '') + now.getDate())
        return {
            'start_time': startTime,
            'end_time': nStr,
            cardData: [],
            showAlert: false,
            alertParams: { header: '', content: '' },
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr
            }
        }
    },
    created: function(){
        this.loadAppCountData()
    },
    methods: {
        alertOkClicked: function(){
            this.showAlert = false
        },
        alert: function(str){
            this.alertParams.header = '提示信息'
            this.alertParams.content = str
            this.showAlert = true
        },
        loadAppCountData: function(){
            // console.log(this.start_time)
            // console.log(this.end_time)
            if(new Date(this.start_time) > new Date(this.end_time)){
                this.alertParams("起始时间不能大于结束时间")
                return
            }
            this.$parent.$parent.isShowLoading = true
            const orderRequest = new Promise((resolve, reject) => {
                return request({
                    url: '/api/home/index-order',
                    method: 'get',
                    params: {
                        'start_time': this.start_time,
                        'end_time': this.end_time
                    }
                }).then((response) => {
                    if(response.status == 200){
                        const reuslt = response.data
                        if(reuslt.code == 200){
                            resolve(reuslt.data)
                            return
                        }
                    }
                    reject(response)
                }).catch((error) => {
                    reject(error)
                })
            })
            const userReqeust = new Promise((resolve, reject) => {
                return request({
                    url: '/api/home/index-user',
                    method: 'get',
                    params: {
                        'start_time': this.start_time,
                        'end_time': this.end_time
                    }
                }).then((response) => {
                    if(response.status == 200){
                        const reuslt = response.data
                        if(reuslt.code == 200){
                            resolve(reuslt.data)
                            return
                        }
                    }
                    reject(response)
                }).catch((error) => {
                    reject(error)
                })
            })
            Promise.all([orderRequest, userReqeust]).then((data) => {
                this.createCardData(data)
            }).catch((error) => {
                this.alert('加载APP首页数据失败')
            }).then(() => {
                this.$parent.$parent.isShowLoading = false
            })
        },
        createCardData: function(dt){
            const cardData = [
                [{text: '用户总数', num: 0, imgSrc: require('@/assets/blue_eq.png')}, {text: '新增用户', num: 0, imgSrc: require('@/assets/blue_eq.png')}, {text: '用户提现', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '用户余额', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '签到余额', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '用户冻结金额', num: 0, imgSrc: require('@/assets/blue_doller.png')}],
                [{text: '活跃用户', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '下单用户', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '活跃率', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '活跃用户下单率', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '付款订单数量', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '付款订单金额', num: 0, imgSrc: require('@/assets/red_doller.png')}],
                [{text: '淘宝预估收入', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '京东预估收入', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '拼多多预估收入', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '饿了么预估收入', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '淘宝结算收入', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '京东结算收入', num: 0, imgSrc: require('@/assets/blue_doller.png')}],
                [{text: '拼多多结算收入', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '饿了么结算收入', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '免单订单总数', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '免单总金额', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '预估毛利', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '结算毛利', num: 0, imgSrc: require('@/assets/red_doller.png')}],
                [{text: '拼多多预估毛利', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '京东预估毛利', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '淘宝预估毛利', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '饿了么预估毛利', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '拼多多结算毛利', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '京东结算毛利', num: 0, imgSrc: require('@/assets/blue_doller.png')}],
                [{text: '淘宝结算毛利', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '饿了么结算毛利', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '淘宝下单数量', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '京东下单数量', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '拼多多下单数量', num: 0, imgSrc: require('@/assets/red_eq.png')}, {text: '饿了么下单数量', num: 0, imgSrc: require('@/assets/red_eq.png')}],
                [{text: '淘宝预估返佣', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '京东预估返佣', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '拼多多预估返佣', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '饿了么预估返佣', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '淘宝结算返佣', num: 0, imgSrc: require('@/assets/blue_doller.png')}, {text: '京东结算返佣', num: 0, imgSrc: require('@/assets/blue_doller.png')}],
                [{text: '拼多多结算返佣', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '饿了么结算返佣', num: 0, imgSrc: require('@/assets/red_doller.png')}, {text: '淘宝技术服务费', num: 0, imgSrc: require('@/assets/red_doller.png')}]
            ]
            dt = Object.assign(dt[0], dt[1])
            const fields = [
                "userNum", "userDayNum", "userCashAmount", "userAmount", "signAmount", "lockedAmount",
                "activeNum", "buyerNum", "activitRate", "buyerRate", "orderNum", "totalAmount",
                "tbPredictAmount", "jdPredictAmount", "pddPredictAmount", "elmPredictAmount", "tbSettlementAmount", "jdSettlementAmount",
                "pddSettlementAmount", "elmSettlementAmount", "freeNum", "freeAmount", "predictGrossProfit", "settlementGrossProfit",
                "pddPredictGrossProfit", "jdPredictGrossProfit", "tbPredictGrossProfit", "elmPredictGrossProfit", "pddSettlementGrossProfit", "jdSettlementGrossProfit",
                "tbSettlementGrossProfit", "elmSettlementGrossProfit", "tbOrderNum", "jdOrderNum", "pddOrderNum", "elmOrderNum",
                "tbPredictRebateAmount", "jdPredictRebateAmount", "pddPredictRebateAmount", "elmPredictRebateAmount", "tbSettlementRebateAmount", "jdSettlementRebateAmount",
                "pddSettlementRebateAmount", "elmSettlementRebateAmount", "tbServiceFee"
            ];
            let count = 0
            for(let row = 0;row < cardData.length; row++){
                const item = cardData[row]
                for(let col = 0; col < item.length; col++){
                    item[col].num = dt[fields[count++]] || 0
                }
            }
            this.cardData = Object.assign({}, cardData)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>