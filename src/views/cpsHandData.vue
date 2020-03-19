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
                <div class="search-group text-right">
                    <label>*只能导入今日数据</label>
                    <button class="action-btn" @click="selectFile">导入</button>
                    <input type="file" ref="file" hidden accept=".xls, .xlsx" @change="fileChange">
                    <a hidden ref="downloadFile" download="手工数据.xlsx"></a>
                    <a class="action-btn" style="display: inline-block;" :href="downloadUrl" :download="nextDay + '.xlsx'">模板下载</a>
                </div>
            </header>
            <div class="table-container">
                <detail-table v-bind:tbData="tbData" v-bind:tableHeader="tableHeader" v-bind:tbType="tbType" @loadHandDetail="loadHandDetail"></detail-table>
            </div>
            <page v-bind:pageData="pageData" @loadList="loadTBData"></page>
        </div>
        <cps-hand-detail v-bind:startTime="detailStartTime" v-if="showDetail"></cps-hand-detail>
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
import VueCookie from 'vue-cookies'
import CpsHandDetail from '@/components/content/cpsHandDetail.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 11) ? '0' : '') + (now.getDate() - 1)
        now.setDate(now.getDate() - 15)
        let startTime = ''
        startTime = now.getFullYear() + '-' + (((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1)) + '-' + (((now.getDate() < 10) ? '0' : '') + now.getDate())
        let nextDay = new Date()
        nextDay.setDate(nextDay.getDate() + 1)
        nextDay = nextDay.getFullYear() + '-' + (nextDay.getMonth() + 1) + '-' + nextDay.getDate()
        return {
            'start_time': startTime,
            'end_time': nStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            tbData:[],
            tableHeader: setting.tableHeader.cpsHandData,
            tbType: 'handdata',
            pageData: {
                'total_page': 0,
                page: 1,
                total: 0
            },
            showDetail: false,
            nextDay: nextDay,
            detailStartTime: null,
            downloadUrl: setting.baseUrl + '/getexcel?day=' + nextDay + '&skey=' + VueCookie.get('skey')
        }
    },
    components: {
        'flat-picker': flatpicker,
        'detail-table': DetailTable,
        'page': Page,
        'cps-hand-detail': CpsHandDetail
    },
    created: function(){
        this.loadTBData(1)
    },
    methods: {
        getFile: function(){
            const file = this.$refs.file
            if(file.files.length == 0){
                return null
            }
            return file.files[0]
        },
        fileChange: function(){
            const file = this.getFile()
            if(!file){
                return
            }
            this.uploadFile(file)
        },
        uploadFile: function(file){
            this.showLoading()
            const fd = new FormData()
            fd.append('file', file)
            request({
                url: '/importexcel',
                method: 'post',
                data: fd
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        console.log('上传成功')
                        this.$refs.downloadFile.href = setting.baseUrl + '/' + resp.data.data.url + '&skey=' + VueCookie.get('skey')
                        this.$refs.downloadFile.click()
                    }else{
                        this.alert(resp.data.message || '上传手工数据失败')
                    }
                }else{
                    this.alert('上传手工数据失败')
                }
            }).catch((error) => {
                this.alert('上传手工数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        selectFile: function(){
            this.$refs.file.click()
        },
        loadHandDetail: function(handData){
            this.detailStartTime = handData[0]
            this.showDetail = true
            this.$parent.subTitle2 = "手工数据详情"
        },
        createTBData: function(dt){
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0
            this.pageData.total = dt.total || 0
            this.pageData.page = dt.page || 1

            const fields = ['statistics_day', 'platform', 'lm_predict_amount', 'lm_settlement_amount', 'lm_settlement_amount', 'db_settlement_amount', 'diff_predict_amount', 'diff_settlement_amount']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]])
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        loadTBData: function(pageNum){
            console.log(pageNum)
            this.showLoading()
            request({
                url: '/api/excel/manuallist',
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
                        this.createTBData(rst.data)
                    }else{
                        this.alert(rst.message || '加载手工数据失败')
                    }
                }else{
                    this.alert('加载手工数据失败')
                }
            }).catch((error) => {
                this.alert('加载手工数据失败')
            }).then(() => {
                this.hideLoading()
            })
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.table-container { overflow: hidden; }
</style>