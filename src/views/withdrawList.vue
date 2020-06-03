<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>提现用户:</label>
                    <input type="text" placeholder="请输入" v-model="username">
                </div>
                <selector class="search-group" v-bind:value="checkStatus" v-bind:selectParams="checkStatuSelectParams" @selectOptsClicked="checkStatuSelectOptsClicked"></selector>
                <selector class="search-group" v-bind:value="plat" v-bind:selectParams="platSelectParams" @selectOptsClicked="platSelectOptsClicked"></selector>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                </div>
                <button class="search-btn" @click="loadData(1)">搜索</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbData="tbData" :tbType="tbType" :tableHeader="tableHeader" @checkWithdraw="checkWithdraw"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadData"></page>
        </div>
        <pop-ups :isShow="showPopUps" :popParams="popParams" @popSave="saveWithdraw" @popCancel="cancelWithdraw" @popReject="rejectWithdraw"></pop-ups>
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
import popUpsVue from '../components/common/popUps.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'flat-picker': flatPicker,
        'selector': Selector,
        'detail-table': DetailTable,
        'page': page,
        'pop-ups': popUpsVue
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            popParams: {
                header: '提现审核',
                type: 'withdraw',
                style: 'width: 17.3125rem;',
                reject: false,
                rejectReason: '',
                data: null
            },
            withdrawList: [],
            showPopUps: false,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            username: '',
            checkStatus: '',
            plat: '',
            createTimeBegin: '',
            createTimeEnd: '',
            tbData: [],
            tbType: 'withdrawList',
            tableHeader: [],
            pageData: {
                'total': 0,
                'page': 1,
                'total_page': 0
            },
            checkStatuSelectParams: {
                label: '提现状态',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 20,
                    text: '等待审核'
                }, {
                    value: 30,
                    text: '正在审核'
                }, {
                    value: 0,
                    text: '审核通过'
                }, {
                    value: 90,
                    text: '拒绝'
                }]
            },
            platSelectParams: {
                label: '提现平台',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 0,
                    text: '微信提现'
                }, {
                    value: 1,
                    text: '支付宝提现'
                }]
            },
            fields: []
        }
    },
    created: function(){
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'cashList' }, 'get'),
            this.loadTBData(setting.urls.withdrawList, { page: 1, username: this.username, checkStatus: this.checkStatus, plat: this.plat, createTimeBegin: this.createTimeBegin, createTimeEnd: this.createTimeEnd }, 'get')
        ]).then(rst => {
            this.fields = rst[0].fields
            const tableHeader = rst[0].tableHeader
            tableHeader[0].unshift({name: '序号'})
            tableHeader[0].push({name: '操作'})
            this.tableHeader = tableHeader
            this.createTBData(rst[1])
        }).catch(e => {
            this.alert('加载数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        saveWithdraw: function(){
            console.log(this.popParams)
            this.showPopUps = false
            // TODO
            let queryParams = null
            if(this.popParams.reject){
                console.log('拒绝提现,原因是:' + this.popParams.rejectReason)
                queryParams = {
                    id: this.popParams.data.applyId,
                    'audit_status': 90,
                    remark: this.popParams.rejectReason || ''
                }
            }else{
                console.log('同意提现')
                queryParams = {
                    id: this.popParams.data.applyId,
                    'audit_status': 0
                }
            }
            this.showLoading()
            request({
                url: setting.urls.cashCheck,
                method: 'get',
                params: queryParams
            }).then((rst) => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.loadData(this.pageData.page || 1)
                    }else{
                        this.alert(rst.data.message || '提现审核失败')
                    }
                }else{
                    this.alert('提现审核失败')
                }
            }).catch(e => {
                this.alert('提现审核失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        cancelWithdraw: function(){
            this.showPopUps = false
        },
        rejectWithdraw: function(){
            this.popParams.reject = true
        },
        loadData(pageNum){
            this.showLoading()
            this.loadTBData(setting.urls.withdrawList, { page: pageNum || 1, username: this.username, checkStatus: this.checkStatus, plat: this.plat, createTimeBegin: this.createTimeBegin, createTimeEnd: this.createTimeEnd }, 'get')
                .then(rst => {
                    this.createTBData(rst || [])
                }).catch(e => {
                    this.alert('加载提现列表失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                tbData[idx].push((idx < 9 ? '0' : '') + (idx + 1))
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push(item[this.fields[idxx]] || (item[this.fields[idxx]] == 0 ? item[this.fields[idxx]] : '--'))
                }
                tbData[idx].push({auditStatus: item['auditStatus'] || '--', 'cash_check': item['cash_check'] || 'F'})
            }
            this.withdrawList = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                if(item.applyPlat == '微信'){
                    item.applyPlat = 0
                }else if(item.applyPlat == '支付宝'){
                    item.applyPlat = 1
                }
                this.withdrawList.push(item)
            }
            this.tbData = Object.assign([], tbData)
        },
        checkStatuSelectOptsClicked: function(dt){
            this.checkStatus = dt
        },
        platSelectOptsClicked: function(dt){
            this.plat = dt
        },
        checkWithdraw: function(dt){
            this.popParams.data = this.withdrawList[dt.idx]
            this.popParams.reject = false
            this.popParams.rejectReason = ''
            this.showPopUps = true
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>