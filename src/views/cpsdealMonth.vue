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
                <button class="search-btn" @click="loadAllData">汇总</button>
                <div style="flex: 1;"></div>
                <a class="action-btn" style="display: inline-block;" :href="downloadUrl" :download="company[company_id] + start_time + '.xlsx'">导出</a>
            </header>
            <div class="table_title">云瞻信息CPS业务月交易汇总数据统计</div>
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
            <div class="table-container scrollable">
                <detail-table style="width: 100rem;" :tbData="tbData" :tableHeader="tableHeader" :tbType="tbType" :tableHeaderFixed="tableHeaderFixed"></detail-table>
            </div>
            <page v-bind:pageData="pageData" @loadList="loadData"></page>
        </div>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import DetailTable from '@/components/content/table.vue'
import Page from '@/components/content/page.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'createPageData', 'loadTBData'],
    components: {
        'flat-picker': flatPicker,
        'detail-table': DetailTable,
        'page': Page
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
                0: '汇总交易数据',
                1: '四川云瞻',
                2: '成都云瞻'
            },
            'tableHeader': setting.tableHeader.cpsDealMonth,
            'tbType': 'common',
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
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.cpsFields, {'order_type': 'financedeal'}),
            this.loadTBData(setting.urls.cpsDealMonth, {'company_id': this.company_id, page: 1, 'statistics_month': this.start_time}, 'get')
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
    computed: {
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsDealMonth + '?company_id=' + this.company_id + '&statistics_month=' + this.start_time + '&page=' + this.pageData.page + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    methods: {
        loadData: function(pageNum){
            this.showLoading()
            this.loadTBData(setting.urls.cpsDealMonth, {'company_id': this.company_id, page: pageNum || 1, 'statistics_month': this.start_time}, 'get').then(dt => {
                this.pageData = Object.assign({}, this.createPageData(dt))
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
.table-container { overflow-x: scroll; margin-top: 0; }
</style>