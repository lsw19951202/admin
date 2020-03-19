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
                <button class="search-btn" @click="loadTBData(1)">搜索</button>
            </header>
            <div class="table-container">
                <detail-table :tbData="tbData" :tbType="tbType" :tableHeader="tableHeader" @checkWithdraw="checkWithdraw"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
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
            username: '',
            checkStatus: '',
            plat: '',
            createTimeBegin: '',
            createTimeEnd: '',
            tbData: [],
            tbType: 'withdrawList',
            tableHeader: setting.tableHeader.withdrawList,
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
            }
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: '/cash/query',
                method: 'get',
                params: {
                    page: pageNum || 1,
                    username: this.username,
                    checkStatus: this.checkStatus,
                    plat: this.plat,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载提现列表失败')
                    }
                }else{
                    this.alert('加载提现列表失败')
                }
            }).catch((error) => {
                this.alert('加载提现列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            const fields = ['username', 'applyAmount', 'auditStatus', 'applyPlat', 'createTime', 'dealTime']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                tbData[idx].push((idx < 9 ? '0' : '') + (idx + 1))
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || (item[fields[idxx]] == 0 ? item[fields[idxx]] : '--'))
                }
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
            console.log(dt)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>