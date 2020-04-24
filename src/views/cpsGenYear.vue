<template>
    <div class="detail-container hideScrollBar">
        <div class="detail-data-box nopadding">
            <div class="detail-main">
                <header class="search-header">
                    <div class="search-group" style="margin-left: 0;">
                        <label>期间:</label>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" placeholder="期间"></flat-picker>
                    </div>
                    <button class="search-btn" @click="loadData">搜索</button>
                    <div style="flex: 1;"></div>
                    <a class="action-btn" style="display: inline-block;" :href="downloadUrl" download="年度推广费用.xlsx">导出</a>
                </header>
                <div class="table_title">四川云瞻{{start_time}}年CPS业务推广费汇统计表</div>
                <div class="table_sub_title flex">
                    <div class="text_left" style="width: 100px; white-space: nowrap;">
                        编制单位：四川云瞻
                    </div>
                    <div class="flex1 text-center">
                        期间：{{start_time}}年
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
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import LockedTable from '@/components/content/LockedTable.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData', 'strToNum', 'numToStr'],
    components: {
        'flat-picker': flatPicker,
        'locked-table': LockedTable
    },
    data: () =>{
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
            tbData: {
                tableHeader: setting.tableHeader.cpsgenYear,
                tbData: [],
                lockedRow: 1,
                lockedCol: 2
            },
            fields: [],
            tbStyle: {
                width: '100%'
            }
        }
    },
    computed: {
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsgenYear + '?statistics_year=' + this.start_time + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    created: function(){
        this.showLoading()
        return Promise.all([
            this.loadFields(setting.urls.cpsFields, {'order_type': 'generalizeyear'}),
            this.loadTBData(setting.urls.cpsgenYear, {'statistics_year': this.start_time}, 'get')
        ]).then(rst => {
            this.fields = rst[0].fields

            const tableHeader = rst[0].tableHeader
            tableHeader[0].splice(0, 0, {name: '序号'})
            this.tbData = {
                tableHeader: tableHeader,
                tbData: this.createTBData(rst[1]),
                lockedRow: rst[0].tableHeader.length,
                lockedCol: rst[0].lockedFields.length + 1
            }
        }).catch(e => {
            this.alert(e.message || '加载数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        loadData: function(){
            this.showLoading()
            this.loadTBData(setting.urls.cpsgenYear, {'statistics_month': this.start_time}, 'get')
                .then(rst => {
                    const tbData = this.createTBData(rst)
                    this.tbData = {
                        tbData: tbData,
                        tableHeader: this.tbData.tableHeader,
                        lockedRow: this.tbData.lockedRow,
                        lockedCol: this.tbData.lockedCol
                    }
                }).catch(e => {
                    this.alert(e.message || '加载数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        createTBData: function(dt){
            const tbData = []
            let sortIdx = 1
            for(let idx = 0; idx < dt.length; idx++){
                const row = dt[idx]
                const tmp = []
                tmp.push({
                    text: sortIdx++
                })
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tmp.push({
                        text: row[this.fields[idxx]] || (row[this.fields[idxx]] === 0 ? 0 : '--')
                    })
                }
                tbData.push(tmp)
            }
            return tbData
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>