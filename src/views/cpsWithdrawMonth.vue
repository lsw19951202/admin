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
                <div class="table_title">云瞻信息CPS业务提现统计表</div>
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

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadTBData', 'numToStr'],
    components: {
        'flat-picker': flatpicker,
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
                tableHeader: setting.tableHeader.cpswithdrawMonth,
                tbData: [],
                lockedRow: 3,
                lockedCol: 2
            },
            fields: ['statistics_day', 'new_reward_amount', 'sign_reward_amount', 'first_reward_amount', 'total_reward_amount', 'sc_rebate_amount', 'sc_total_amount', 'cd_rebate_amount', 'today_total_amount', 'apply_amount', 'is_withdraw_amount', 'not_withdraw_amount', 'end_not_withdraw', 'sc_this_provisional', 'cd_this_provisional', 'total_provisional_amount', 'user_balance_amount', 'paid_user_balance'],
            tbStyle: {
                width: '60rem'
            }
        }
    },
    created: function(){
        this.loadData()
    },
    methods: {
        createTBData: function(dt){
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const row = dt.data[idx]
                tbData.push((idx == 0 || idx == dt.data.length - 1) ? [] : [{text: idx}])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    if((idx == 0 || idx == dt.data.length - 1) && idxx == 0){
                        // 期初和合计
                        tbData[idx].push({text: row[this.fields[idxx]] || '--', colspan: 2})
                    }else{
                        tbData[idx].push({text: (idxx >= 1 ? this.numToStr(row[this.fields[idxx]] || 0) : row[this.fields[idxx]]) || '--'})
                    }
                }
                tbData[idx].push({text: '--'})
            }
            this.tbData = {
                tableHeader: this.tbData.tableHeader,
                tbData: tbData,
                lockedRow: this.tbData.lockedRow,
                lockedCol: this.tbData.lockedCol
            }
        },
        loadData: function(pageNum){
            this.showLoading()
            this.loadTBData(setting.urls.cpswithdrawMonth, {'statistics_month': this.start_time, page: pageNum || 1}, 'get')
                .then(rst => {
                    console.log(rst)
                    this.createTBData(rst)
                }).catch(e => {
                    console.log(e)
                    this.alert('加载CPS月提现数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>