<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>期间:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" placeholder="期间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="end_time" placeholder="结束时间"></flat-picker>
                </div>
                <button class="search-btn" @click="loadSCData">四川云瞻</button>
                <button class="search-btn" @click="loadCDData">成都云瞻</button>
                <button class="search-btn" @click="loadAllData">分平台汇总</button>
                <div style="flex: 1;"></div>
                <a class="action-btn" style="display: inline-block;" :href="downloadUrl" :download="company[company_id] + start_time + '-' + end_time + '.xlsx'">导出</a>
            </header>
            <div class="table_title">{{getTitle}}</div>
            <div class="table_sub_title flex">
                <div class="flex1 text_left">
                    编制单位：{{company[company_id]}}
                </div>
                <div class="flex1 flex">
                    <div class="text-left flex1">
                        期间：{{start_time}}到{{end_time}}
                    </div>
                    <div class="flex1 text-right">
                        单元：人民币元
                    </div>
                </div>
            </div>
            <div class="table-container scrollable">
                <detail-table style="width: 100rem;" :tbData="tbData" :tableHeader="tableHeader" :tbType="tbType"></detail-table>
            </div>
        </div>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import DetailTable from '@/components/content/table.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'createPageData', 'loadTBData'],
    components: {
        'flat-picker': flatPicker,
        'detail-table': DetailTable
    },
    data: () => {
        const now = new Date()
        let endStr = ''
        endStr += now.getFullYear() + '-'
        endStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        endStr += now.getDate()
        now.setDate(now.getDate() - 30)
        let startStr = ''
        startStr += now.getFullYear() + '-'
        startStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        startStr += now.getDate()
        now.setDate(now.getDate() + 30)
        return {
            'start_time': startStr,
            'end_time': endStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: now,
                locale: Mandarin,
                dateFormat: 'Y-m-d'
            },
            'company_id': 0,
            'company': {
                0: '分平台汇总',
                1: '四川云瞻',
                2: '成都云瞻'
            },
            'tableHeader': setting.tableHeader.cpsdealAccountsByPlat,
            'tbType': 'tdSpan',
            fields: [],
            pageData: {
                'total_page': 0,
                page: 1,
                total: 0
            },
            tbData: [],
            tableHeaderFixed: true
        }
    },
    created: function(){
        this.loadData(1)
    },
    computed: {
        getTitle: function(){
            if(this.company_id){
                return this.company[this.company_id] + 'CPS业务分账户交易数据统计表'
            }else{
                return '云瞻信息CPS业务分平台汇总交易数据'
            }
        },
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsdealAccounts + '?company_id=' + this.company_id + '&start_time=' + this.start_time + '&end_time=' + this.end_time + '&page=' + this.pageData.page + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    methods: {
        loadData: function(){
            this.showLoading()
            Promise.all([
                this.loadFields(setting.urls.cpsFields, {'order_type': (this.company_id == 1 || this.company_id == 2) ? 'financedealacc' : 'financedealall'}),
                this.loadTBData(setting.urls.cpsdealAccounts, {'company_id': this.company_id, page: 1, 'start_time': this.start_time, 'end_time': this.end_time}, 'get')
            ]).then(rst => {
                this.tableHeader = rst[0].tableHeader
                this.fields = rst[0].fields
                this.pageData = Object.assign({}, this.createPageData(rst[1]))
                this.createTBData(rst[1])
            }).catch(e => {
                this.alert(e.message || '加载数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadSCData: function(){
            this.$data['company_id'] = 1
            this.loadData()
        },
        loadCDData: function(){
            this.$data['company_id'] = 2
            this.loadData()
        },
        loadAllData: function(){
            this.$data['company_id'] = 0
            this.loadData()
        },
        exportData: function(){
            console.log('导出' + this.start_time + '-' + this.end_time + '数据')
        },
        createTBData: function(dt){
            const tbData = []
            if(this.company_id){
                for(const key in dt){
                    if(Object.prototype.hasOwnProperty.call(dt, key) && dt[key].statistics_list){
                        for(let idx = 0; idx < dt[key].statistics_list.length; idx++){
                            const tmp = []
                            const item = dt[key].statistics_list[idx]
                            for(let idxx = 0; idxx < this.fields.length; idxx++){
                                if(idx == 0 && idxx == 0){
                                    tmp.push({
                                        text: item[this.fields[idxx]] || (item[this.fields[idxx]] === 0 ? item[this.fields[idxx]] : '--'),
                                        rowspan: dt[key].statistics_list.length
                                    })
                                }
                                if(idxx != 0){
                                    tmp.push({
                                        text: item[this.fields[idxx]] || (item[this.fields[idxx]] === 0 ? item[this.fields[idxx]] : '--')
                                    })
                                }
                            }
                            tbData.push(tmp)
                        }
                    }
                }
            }else{
                for(let index = 0; index < dt.length; index++){
                    const comData = dt[index]
                    for(let idx = 0; idx < comData.statistics_list.length; idx++){
                        const tmp = []
                        const item = comData.statistics_list[idx]
                        for(let idxx = 0; idxx < this.fields.length; idxx++){
                            if(idx == 0 && idxx == 0){
                                tmp.push({
                                    text: comData[this.fields[idxx]],
                                    rowspan: comData.statistics_list.length
                                })
                            }
                            if(idxx != 0){
                                tmp.push({
                                    text: item[this.fields[idxx]] || (item[this.fields[idxx]] === 0 ? item[this.fields[idxx]] : '--')
                                })
                            }
                        }
                        tbData.push(tmp)
                    }
                }
            }
            this.tbData = Object.assign([], tbData)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.table-container { overflow-x: scroll; margin-top: 0; }
</style>