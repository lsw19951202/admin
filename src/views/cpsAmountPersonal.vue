<template>
    <div class="detail-container hideScrollBar">
        <div class="detail-data-box nopadding">
            <div class="detail-main">
                <header class="search-header">
                    <div class="search-group">
                        <label>日期筛选:</label>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" placeholder="查询时间"></flat-picker>
                    </div>
                    <button class="search-btn" @click="loadData(1)">搜索</button>
                </header>
                <div class="table_title">{{getTitle}}</div>
                <div class="table_sub_title flex">
                    <div class="text_left" style="width: 100px; white-space: nowrap;">
                        编制单位：云瞻信息
                    </div>
                    <div class="flex1 text-center">
                        期间：{{start_time}}
                    </div>
                    <div class="text-right" style="width: 100px; white-space: nowrap;">
                        单元：人民币元
                    </div>
                </div>
                <locked-table :tbData="tbData" :tbStyle="tbStyle"></locked-table>
                <page :pageData="pageData" @loadList="loadData"></page>
            </div>
        </div>
    </div>
</template>
<script>
import request from "@/axios";
import flatpicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import LockedTable from '@/components/content/LockedTable.vue'
import setting from '@/setting'
import Page from '@/components/content/page.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadTBData', 'numToStr', 'strToNum', 'caculFloat'],
    components: {
        'flat-picker': flatpicker,
        'page': Page,
        'locked-table': LockedTable
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1)
        return {
            'start_time': nStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin,
                dateFormat: 'Y-m'
            },
            tbData: {
                tableHeader: setting.tableHeader.cpsamountPersonal,
                tbData: [],
                lockedRow: 3,
                lockedCol: 3
            },
            pageData: {
                'total_page': 0,
                page: 1,
                total: 0
            },
            fields: ['user_wx_name', 'user_real_name', 'first_not_withdraw', 'sc_provisional_amount', 'cd_provisional_amount', 'total_provisional_amount', 'first_balance_amount', 'used_balance_amount', 'new_reward_amount', 'sign_reward_amount', 'first_reward_amount', 'total_reward_amount', 'sc_rebate_amount', 'sc_total_amount', 'cd_rebate_amount', 'today_total_amount', 'apply_amount', 'is_withdraw_amount', 'not_withdraw_amount', 'end_not_withdraw', 'sc_this_provisional', 'cd_this_provisional', 'user_balance_amount', 'paid_user_balance'],
            tbStyle: {
                width: '90rem'
            }
        }
    },
    computed: {
        getTitle: function(){
            return '云瞻信息' + this.start_time.split('-')[0] + '年' + this.start_time.split('-')[1] + '月CPS业务用户余额-个人用户'
        }
    },
    created: function(){
        this.loadData()
    },
    methods: {
        createTBData: function(dt){
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0
            this.pageData.total = dt.total

            const tbData = []
            const count = [{text: '合计', colspan: 2}, {text: '--'}]
            for(let idx = 0; idx < dt.data.length; idx++){
                const row = dt.data[idx]
                tbData.push([{text: idx + 1}])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    if(idxx < 2){
                        tbData[idx].push({text: row[this.fields[idxx]] || '--'})
                    }else{
                        tbData[idx].push({text: this.numToStr(row[this.fields[idxx]] ? row[this.fields[idxx]] : 0) || '--'})
                        if(idxx <= 21){
                            count[idxx] = {text: this.numToStr(this.caculFloat(this.strToNum(count[idxx]&&count[idxx]['text']&&count[idxx]['text'] != '--' ? count[idxx]['text'] : 0), this.strToNum(row[this.fields[idxx]] || 0))) || '--'}
                        }else{
                            count[idxx + 1] = {text: this.numToStr(this.caculFloat(this.strToNum(count[idxx + 1]&&count[idxx + 1]['text']&&count[idxx + 1]['text'] != '--' ? count[idxx + 1]['text'] : 0), this.strToNum(row[this.fields[idxx]] || 0))) || '--'}
                        }
                        if(idxx == 21){
                            let estCount = 0
                            const scEstCount = row[this.fields[idxx - 1]] || 0, cdEstCount = row[this.fields[idxx]] || 0
                            estCount = this.caculFloat(scEstCount, cdEstCount)
                            tbData[idx].push({text: this.numToStr(estCount) || '--'})
                            count[idxx + 1] = {text: this.numToStr(this.caculFloat(this.strToNum(count[idxx + 1]&&count[idxx + 1]['text']&&count[idxx + 1]['text'] != '--' ? count[idxx + 1]['text'] : 0), this.strToNum(row[this.fields[idxx]] || 0))) || '--'}
                        }
                    }
                }
                tbData[idx].push({text: '--'})
            }
            count.push({text: '--'})
            tbData.push(count)
            this.tbData = {
                tableHeader: this.tbData.tableHeader,
                tbData: tbData,
                lockedRow: this.tbData.lockedRow,
                lockedCol: this.tbData.lockedCol
            }
        },
        loadData: function(pageNum){
            this.showLoading()
            let startTime = '', endTime = ''
            startTime = this.start_time + '-01'
            const time = new Date(this.start_time)
            time.setMonth(time.getMonth() + 1)
            time.setDate(0)
            endTime = this.start_time + '-' + time.getDate()
            this.loadTBData(setting.urls.cpsamountPersonal, {'start_time': startTime, 'end_time': endTime, page: pageNum || 1}, 'get')
                .then(rst => {
                    this.createTBData(rst)
                }).catch(e => {
                    this.alert('加载个人账号数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
/* .table-container { overflow-x: scroll; margin-top: 0; } */
</style>