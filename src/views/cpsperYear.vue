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
                <button class="search-btn" @click="loadAllData">月度汇总</button>
                <div style="flex: 1;"></div>
                <!-- <button class="search-btn" @click="exportData">导出</button> -->
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
            <div class="table-container">
                <detail-table :tableHeader="tableHeader" :tbType="tbType" :tbData="tbData" :tableHeaderFixed="tableHeaderFixed"></detail-table>
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
        let nStr = ''
        nStr += now.getFullYear()
        return {
            'start_time': nStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin,
                dateFormat: 'Y'
            },
            'company_id': 0,
            'company': {
                0: '月度业绩汇总',
                1: '四川云瞻',
                2: '成都云瞻'
            },
            'tableHeader': setting.tableHeader.cpsperYear,
            'tbType': 'common',
            tbData: [],
            fields: [],
            tableHeaderFixed: true
        }
    },
    computed: {
        getTitle: function(){
            if(this.company_id){
                return this.company[this.company_id] + '业绩统计及毛利分析'
            }else{
                return '云瞻信息业绩统计及毛利分析'
            }
        }
    },
    created: function(){
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.cpsFields, {'order_type': 'performanceYear'}),
            this.loadTBData(setting.urls.cpsperYear, {'company_id': this.company_id, page: 1, 'statistics_year': this.start_time}, 'get')
        ]).then(rst => {
            this.tableHeader = rst[0].tableHeader
            this.fields = rst[0].fields
            this.createTBData(rst[1])
        }).catch(e => {
            this.alert(e.message || '加载数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        loadData: function(pageNum){
            this.showLoading()
            this.loadTBData(setting.urls.cpsperYear, {'company_id': this.company_id, page: pageNum || 1, 'statistics_year': this.start_time}, 'get').then(dt => {
                this.createTBData(dt)
            }).catch(e => {
                this.alert(e && e.message || '加载数据失败')
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
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push(item[this.fields[idxx]] || (item[this.fields[idxx]] === 0 ? item[this.fields[idxx]] : '--'))
                }
            }
            this.tbData = Object.assign([], tbData)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.table-container { overflow: hidden; margin-top: 0; }
</style>