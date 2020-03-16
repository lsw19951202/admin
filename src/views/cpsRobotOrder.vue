<template>
    <div class="detail-container">
        <card-container class="width80per" v-bind:cardData="cardData"></card-container>
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" aria-placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="end_time" placeholder="结束时间"></flat-picker>
                </div>
                <selector class="search-group" v-bind:value="order_type" v-bind:selectParams="platSelectParams" @selectOptsClicked="platSelectOptsClicked"></selector>
                <selector class="search-group" v-bind:value="robot_name" v-bind:selectParams="robotSelectParams" @selectOptsClicked="robotSelectOptsClicked"></selector>
                <button class="search-btn" @click="searchBtnClicked">搜索</button>
            </header>
            <div class="table-container">
                <detail-table v-bind:tbData="tbData" v-bind:tableHeader="tableHeader" v-bind:tbType="tbType"></detail-table>
            </div>
            <page v-bind:pageData="pageData" @loadList="loadList"></page>
        </div>
    </div>
</template>
<script>
import CardContainer from '@/components/content/cardContainer.vue'
import Select from '@/components/common/select.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import request from '@/axios'
import Page from '@/components/content/page.vue'
import DetailTable from '@/components/content/table.vue'

// require('@/mock')

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'card-container': CardContainer,
        'selector': Select,
        'flat-picker': flatPicker,
        'page': Page,
        'detail-table': DetailTable
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 11) ? '0' : '') + (now.getDate() - 1)
        return {
            cardData: [],
            'start_time': '',
            'end_time': '',
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            platSelectParams: {
                label: '平台类型',
                placeholder: '请选择平台',
                options: [{
                    value: '0',
                    text: '全部'
                }, {
                    value: '1',
                    text: '京东'
                }, {
                    value: '2',
                    text: '天猫'
                }, {
                    value: '3',
                    text: '拼多多'
                }]
            },
            robotSelectParams: {
                label: '机器人名称',
                placeholder: '请选择机器人',
                options: []
            },
            pageData: {
                'total_page': 0,
                'page': 1,
                'total': 0
            },
            tbData: [],
            tbType: 'common',
            tableHeader: [],
            'order_type': null,
            'robot_name': '',
            'is_page': 'F',
            'company_list': {},
            fields: {
                0: {fields: [], tableHeader: []},
                1: {fields: [], tableHeader: []},
                2: {fields: [], tableHeader: []},
                3: {fields: [], tableHeader: []}
            }
        }
    },
    created: function(){
        this.loadConfigInfo()
            .then(() => {
                this.loadContentData()
            })
    },
    methods: {
        searchBtnClicked: function(){
            this.$data['is_page'] = 'F'
            this.loadContentData(1)
        },
        loadConfigInfo: function(){
            this.showLoading()
            return request({
                url: '/api/new/robot-default',
                method: 'get',
                params: {}
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createConfigData(rst.data)
                    }else{
                        this.alert(rst.message || '加载机器人列表失败')
                    }
                }else{
                    this.alert('加载机器人列表失败')
                }
            }).catch((error) => {
                this.alert('加载机器人列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createConfigData: function(dt){
            this.$data['start_time'] = dt.condition_config.start_time
            this.$data['end_time'] = dt.condition_config.end_time
            this.$data['order_type'] = dt.condition_config.order_type
            this.$data['robot_name'] = dt.condition_config.robot_name
            this.$data['company_list'] = dt.sys_config.company_list
            this.createRobotList(dt.sys_config.robot_list)
        },
        createRobotList: function(dt){
            const options = []
            for(let idx = 0; idx < dt.length; idx++){
                const item = dt[idx]
                options.push({
                    value: item.robot_wx_name,
                    text: item.robot_name
                })
            }
            this.robotSelectParams.options = options
        },
        platSelectOptsClicked: function(dt){
            console.log(dt)
            this.$data['order_type'] = dt
        },
        loadFields: function(orderType){
            if(this.fields[orderType].fields.length == 0){
                return request({
                    url: '/api/new/field',
                    method: 'get',
                    params: {
                        'order_type': (orderType == 0 ? '' : orderType)
                    }
                }).then((resp) => {
                    if(resp.status == 200){
                        const rst = resp.data
                        if(rst.code == 200){
                            const dt = rst.data
                            const fields = []
                            const tableHeader = []
                            for(let idx = 0; idx < dt.length; idx++){
                                fields.push(dt[idx].field)
                                tableHeader.push({
                                    name: dt[idx].name,
                                    colspan: 1
                                })
                            }
                            this.fields[orderType].fields = fields
                            this.fields[orderType].tableHeader.push(tableHeader)
                            return this.fields[orderType]
                        }
                    }
                    return {fields: [], tableHeader: []}
                })
            }else{
                return Promise.resolve(this.fields[orderType])
            }
        },
        robotSelectOptsClicked: function(dt){
            console.log(dt)
            this.$data['robot_name'] = dt
        },
        loadList: function(pageNum){
            this.$data['is_page'] = 'T'
            this.loadContentData(pageNum)
        },
        loadContentData: function(pageNum){
            console.log('load table data')
            this.showLoading()
            request({
                url: '/api/new/robot',
                method: 'get',
                params: {
                    'start_time': this.start_time,
                    'end_time': this.end_time,
                    'order_type': (this.order_type == 0 ? '' : this.order_type),
                    'robot_name': this.robot_name,
                    'page': pageNum || 1,
                    'is_page': this.is_page
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createContentData(rst.data)
                    }else{
                        this.alert(rst.message || '加载机器人订单数据失败')
                    }
                }else{
                    this.alert('加载机器人订单数据失败')
                }
            }).catch((error) => {
                this.alert('加载机器人订单数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createContentData: function(dt){
            // 分页数据
            this.pageData['total_page'] = dt.order_list.pageCount || dt.order_list.total_page || 0
            this.pageData.page = dt.order_list.page || 1
            this.pageData.total = dt.order_list.total || 0
            // card数据
            if(this.$data['is_page'] == 'F'){
                this.createCardData(dt.statistics_detail)
            }
            // 表单数据
            this.createTBData(dt.order_list.data)
        },
        createTBData: function(dt){
            this.loadFields(this.order_type || 0)
                .then((fields) => {
                    this.tableHeader = fields.tableHeader
                    return fields.fields
                }).then((fields) => {
                    const tbData = []
                    for(let idx = 0; idx < dt.length; idx++){
                        const item = dt[idx]
                        tbData.push([])
                        for(let idxx = 0; idxx < fields.length; idxx++){
                            tbData[idx].push(item[fields[idxx]] || '--')
                        }
                    }
                    this.tbData = Object.assign([], tbData)
                })
        },
        createCardData: function(dt){
            const cardData = [[],[],[]]
            cardData[0].push({text: '订单笔数(笔)', num: dt['order_total_number'] || 0, imgSrc: require('@/assets/icon_dingdanbishu.png')})
            cardData[0].push({text: '订单金额(元)', num: dt['order_total_paid_amount'] || 0, imgSrc: require('@/assets/icon_dingdanbishu.png')})
            cardData[0].push({text: '当日预估佣金(元)', num: dt['total_estimate_commission_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[0].push({text: '累计预估佣金(元)', num: dt['total_estimate_commission_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[0].push({text: '结算订单笔数(笔)', num: dt['settle_order_number'] || 0, imgSrc: require('@/assets/icon_dingdanbishu.png')})
            cardData[0].push({text: '结算佣金(元)', num: dt['settle_commission_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[0].push({text: '累计结算佣金(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})

            cardData[1].push({text: '预估返利(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[1].push({text: '累计预估返利(元)', num: dt['total_estimate_rebate_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[1].push({text: '结算返利(元)', num: dt['settle_rebate_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[1].push({text: '累计结算返利(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[1].push({text: '结算技术服务费(元)', num: dt['settle_tech_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[1].push({text: '累计结算技术服务费(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[1].push({text: '预估技术服务费(元)', num: dt['estimate_tech_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})

            cardData[2].push({text: '维权订单笔数(笔)', num: dt['legal_order_number'] || 0, imgSrc: require('@/assets/icon_dingdanbishu.png')})
            cardData[2].push({text: '维权订单佣金(元)', num: dt['legal_commission_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[2].push({text: '累计维权订单佣金(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[2].push({text: '维权订单返利(元)', num: dt['legal_rebate_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[2].push({text: '累计维权订单返利(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[2].push({text: '当日冻结返利金额(元)', num: dt['freeze_rebate_amount'] || 0, imgSrc: require('@/assets/icon_money.png')})
            cardData[2].push({text: '累计冻结返利金额(元)', num: 0, imgSrc: require('@/assets/icon_money.png')})

            this.cardData = Object.assign([], cardData)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>