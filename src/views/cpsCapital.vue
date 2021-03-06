<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showDetail">
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
                <div style="flex: 1; text-align: right;">
                    <button class="action-btn" @click="selectExcel">提现日志导入</button>
                    <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                        <input type="file" ref="excelIpt" @change="uploadExcel" accept=".csv, .xlsx" name="file">
                    </form>
                </div>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table v-bind:tbData="tbData" v-bind:tableHeader="tableHeader" v-bind:tbType="tbType" @loadCapitalDetail="loadCapitalDetail"></detail-table>
            </div>
            <page v-bind:pageData="pageData" @loadList="loadTBData"></page>
        </div>
        <capital-detail v-if="showDetail" v-bind:title="detailTime" v-bind:tbData="detailData"></capital-detail>
    </div>
</template>
<script>
import request from "@/axios";
import flatpicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import Page from '@/components/content/page.vue'
import CapitalDetail from '@/components/content/capitalDetail.vue'

// require('@/mock')

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    data: () => {
        const now = new Date()
        now.setDate(now.getDate() - 30)
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            'start_time': nStr,
            'end_time': '',
            dateConfig: {
                'time_24hr': true,
                locale: Mandarin
            },
            tbData: [],
            showDetail: false,
            tableHeader: [],
            pageData: {
                'total_page': 0,
                page: 1,
                total: 0
            },
            fields: [],
            tbType: 'capital',
            detailTime: '',
            detailData: []
        }
    },
    components: {
        'flat-picker': flatpicker,
        'detail-table': DetailTable,
        'page': Page,
        'capital-detail': CapitalDetail
    },
    created: function(){
        return Promise.all([this.loadFieldsAndTableHeader(), this.loadCapitalData()])
            .then((data) => {
                this.createFieldData(data[0])
                this.createTableHeader(data[0])
                this.createTBData(data[1])
                this.createPageData(data[1])
            }).catch((error) => {
                console.log(error)
            })
    },
    methods: {
        selectExcel: function(){
            this.$refs.excelIpt.click()
        },
        uploadExcel: function(){
            this.showLoading()
            const formData = new FormData(this.$refs.fileForm)
            request({
                url: setting.urls.cpsImportTx,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(resp => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        // do nothing
                        this.alert('提现日志上传成功')
                    }else{
                        this.alert(resp.data.message || '上传提现日志失败')
                    }
                }else{
                    this.alert('上传提现日志失败')
                }
            }).catch(e => {
                this.alert('上传提现日志失败')
            }).then(() => {
                this.hideLoading()
                this.$refs.excelIpt.value = ''
            })
        },
        loadCapitalDetail: function(capital){
            console.log(capital)
            this.showLoading()
            request({
                url: setting.urls.capitalDetail,
                method: 'get',
                params: {
                    time: capital[0]
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createDetailData(rst.data)
                        this.detailTime = capital[0]
                        this.showDetail = true
                        this.$parent.subTitle2 = '详情'
                    }else{
                        this.alert(rst.message || '加载详情数据失败')
                    }
                }else{
                    this.alert('加载详情数据失败')
                }
            }).catch((error) => {
                this.alert('加载详情数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createDetailData: function(dt){
            const fields = ['db_name', 'first_reward_amount', 'people_amount', 'sign_reward_amount', 'royalty_reward_amount', 'withdraw_deduct_amount', 'consume_amount', 'activist_amount', 'refund_amount', 'today_apply_payment', 'today_success_payment', 'today_refund_payment', 'today_confiscate_payment', 'un_withdraw_amount']
            const detailData = []
            for(let idx = 0; idx < dt.lists.length; idx++){
                const item = dt.lists[idx]
                detailData.push([])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    detailData[idx].push(item[fields[idxx]] || 0)
                }
            }
            this.detailData = Object.assign([], detailData)
            console.log(this.detailData)
        },
        loadTBData: function(pageNum){
            this.loadCapitalData(pageNum)
                .then((dt) => {
                    this.createPageData(dt)
                    this.createTBData(dt)
                })
        },
        createTBData: function(dt){
            dt = dt.data
            const tbData = []
            for(let idx = 0; idx < dt.length; idx++){
                tbData.push([])
                const item = dt[idx]
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push(item[this.fields[idxx]])
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        createPageData: function(dt){
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0
            this.pageData.total = dt.total
        },
        createTableHeader: function(dt){
            const tableHeader = []
            for(let idx = 0; idx < dt.length; idx++){
                tableHeader.push({
                    name: dt[idx].name,
                    colspan: 1
                })
            }
            tableHeader.push({
                name: '详情',
                colspan: 1
            })
            this.tableHeader.push(tableHeader)
        },
        createFieldData: function(dt){
            for(let idx = 0; idx < dt.length; idx++){
                this.fields.push(dt[idx].field)
            }
        },
        loadFieldsAndTableHeader: function(){
            return request({
                url: setting.urls.capitalField,
                method: 'get',
                params: {
                    'order_type': 'capital'
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        return rst.data
                    }
                }
                return []
            })
        },
        loadCapitalData: function(pageNum){
            this.showLoading()
            return request({
                url: setting.urls.capitalList,
                method: 'get',
                params: {
                    'start_time': this.start_time,
                    'end_time': this.end_time,
                    page: pageNum || 1
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.hideLoading()
                        return rst.data
                    }
                }
                this.hideLoading()
                return {
                    total: 0,
                    pageCount: 0,
                    page: 1,
                    data: []
                }
            })
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>