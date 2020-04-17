<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>期间:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" placeholder="期间"></flat-picker>
                </div>
                <button class="search-btn" @click="loadSCData">四川云瞻</button>
                <button class="search-btn" @click="loadCDData">成都云瞻</button>
                <button class="search-btn" @click="loadAllData">汇总暂估</button>
                <div style="flex: 1;"></div>
                <a class="action-btn" style="display: inline-block;" :href="downloadUrl" :download="company[company_id] + start_time + '.xlsx'">导出</a>
            </header>
            <div class="table_title">{{getTitle}}</div>
            <div class="table_sub_title flex">
                <div class="flex1 text_left">
                    编制单位：{{company[company_id]}}
                </div>
                <div class="flex1 flex">
                    <div class="text-left flex1">
                        期间：{{start_time}}
                    </div>
                    <div class="flex1 text-right">
                        单元：人民币元
                    </div>
                </div>
            </div>
            <div class="table-container hideScrollBar">
                <detail-table :tableHeader="tableHeader" :tbType="tbType" :tbData="tbData"></detail-table>
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
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'flat-picker': flatPicker,
        'detail-table': DetailTable
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
            'company_id': 0,
            'company': {
                0: '云瞻信息',
                1: '四川云瞻',
                2: '成都云瞻'
            },
            'tableHeader': setting.tableHeader.cpsestMonthAll,
            'tbType': 'tdSpan',
            tbData: [],
            fields: []
        }
    },
    computed: {
        getTitle: function(){
            return this.company[this.company_id] + this.start_time.split('-')[1] + '月CPS暂估收入明细表'
        },
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsestMonth + '?company_id=' + this.company_id + '&statistics_month=' + this.start_time + '&page=' + 1 + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    created: function(){
        this.loadData()
    },
    methods: {
        loadData: function(){
            this.showLoading()
            Promise.all([
                this.loadFields(setting.urls.cpsFields, {'order_type': (this.company_id == 1 || this.company_id == 2) ? 'estimatemonthacc' : 'estimatemonth'}),
                this.loadTBData(setting.urls.cpsestMonth, {'company_id': this.company_id, page: 1, 'statistics_month': this.start_time}, 'get')
            ]).then(rst => {
                const tableHeader = rst[0].tableHeader
                if(this.company_id != 0){
                    tableHeader[0].splice(0, 0, {name: '序号'})
                }
                this.tableHeader = tableHeader
                this.fields = rst[0].fields
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
            console.log('导出' + this.start_time + '数据')
        },
        createTBData: function(dt){
            const tbData = []
            if(this.company_id == 0){
                for(let index = 0; index < dt.length; index++){
                    for(let idx = 0; idx < dt[index]['statistics_list'].length; idx++){
                        const row = dt[index]['statistics_list'][idx]
                        const tmp = []
                        for(let idxx = 0; idxx < this.fields.length; idxx++){
                            if(idx == 0 && idxx == 0){
                                tmp.push({
                                    text: row[this.fields[idxx]] || (row[this.fields[idxx]] === 0 ? row[this.fields[idxx]] : '--'),
                                    rowspan: dt[index]['statistics_list'].length
                                })
                            }
                            if(idxx != 0){
                                tmp.push({
                                    text: row[this.fields[idxx]] || (row[this.fields[idxx]] === 0 ? row[this.fields[idxx]] : '--')
                                })
                            }
                        }
                        tbData.push(tmp)
                    }
                }
            }else{
                let sortIdx = 0
                for(let index = 0; index < dt.length; index++){
                    const spanData = dt[index]['statistics_data'] || {}
                    for(let idx = 0; ((index < dt.length - 1) && idx < dt[index]['statistics_list'].length) || ((index == dt.length - 1) && idx < 1); idx++){
                        const row = (index < dt.length - 1) ? dt[index]['statistics_list'][idx] : dt[index]['statistics_list']
                        const tmp = []
                        tmp.push({
                            text: index == dt.length - 1 ? dt[index][this.fields[0]] : ++sortIdx
                        });
                        for(let idxx = 0; idxx < this.fields.length; idxx++){
                            if(idx == 0){
                                if(idxx == 0){
                                    tmp.push({
                                        rowspan: dt[index]['statistics_list'].length,
                                        text: row[this.fields[0]] || (row[this.fields[0]] === 0 ? 0 : '--')
                                    })
                                }else if(Object.prototype.hasOwnProperty.call(spanData, this.fields[idxx])){
                                    tmp.push({
                                        rowspan: dt[index]['statistics_list'].length,
                                        text: spanData[this.fields[idxx]] || (spanData[this.fields[idxx]] === 0 ? 0 : '--')
                                    })
                                }
                            }
                            if(idxx != 0 && !Object.prototype.hasOwnProperty.call(spanData, this.fields[idxx])){
                                tmp.push({
                                    text: row[this.fields[idxx]] || (row[this.fields[idxx]] === 0 ? 0 : '--')
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
.table-container { margin-top: 0; }
</style>