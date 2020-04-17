<template>
    <div class="detail-container hideScrollBar">
        <div class="detail-data-box nopadding">
            <ul class="tab-box">
                <li :class="'tab-item' + (company_id == 1 ? ' selected' : '')" @click="tabClicked(1)">四川云瞻</li>
                <li :class="'tab-item' + (company_id == 2 ? ' selected' : '')" style="left: 145px;" @click="tabClicked(2)">成都云瞻</li>
                <li :class="'tab-item' + (company_id == 0 ? ' selected' : '')" style="left: 290px;" @click="tabClicked(0)">业绩汇总</li>
            </ul>
            <div class="detail-main">
                <header class="search-header">
                    <div class="search-group" style="margin-left: 0;" v-show="company_id == 1">
                        <label>期间:</label>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time_sc" placeholder="期间"></flat-picker>
                    </div>
                    <div class="search-group" style="margin-left: 0;" v-show="company_id == 2">
                        <label>期间:</label>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time_cd" placeholder="期间"></flat-picker>
                    </div>
                    <div class="search-group" style="margin-left: 0;" v-show="company_id == 0">
                        <label>期间:</label>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time_all" placeholder="期间"></flat-picker>
                    </div>
                    <button class="search-btn" @click="loadData">搜索</button>
                    <div style="flex: 1;"></div>
                    <a class="action-btn" style="display: inline-block;" :href="downloadUrl" :download="company[company_id] + '.xlsx'">导出</a>
                </header>
                <div class="table_title">{{getTitle}}</div>
                <div class="table_sub_title flex">
                    <div class="text_left" style="width: 100px; white-space: nowrap;">
                        编制单位：{{company[company_id]}}
                    </div>
                    <div class="flex1 text-center">
                        期间：{{getTimeIn}}
                    </div>
                    <div class="text-right" style="width: 100px; white-space: nowrap;">
                        单元：人民币元
                    </div>
                </div>
                <locked-table v-show="company_id == 1" :tbData="scTBData" :tbStyle="tbStyle"></locked-table>
                <locked-table v-show="company_id == 2" :tbData="cdTBData" :tbStyle="tbStyle"></locked-table>
                <locked-table v-show="company_id == 0" :tbData="allTBData" :tbStyle="tbStyle"></locked-table>
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
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'flat-picker': flatPicker,
        'locked-table': LockedTable
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1)
        return {
            'start_time_sc': nStr,
            'start_time_cd': nStr,
            'start_time_all': nStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin,
                dateFormat: 'Y-m'
            },
            'company_id': 0,
            'company': {
                0: '业绩汇总',
                1: '四川云瞻',
                2: '成都云瞻'
            },
            scTBData: {
                tableHeader: [],
                tbData: [],
                lockedRow: 0,
                lockedCol: 0
            },
            cdTBData: {
                tableHeader: [],
                tbData: [],
                lockedRow: 0,
                lockedCol: 0
            },
            allTBData: {
                tableHeader: [],
                tbData: [],
                lockedRow: 0,
                lockedCol: 0
            },
            companyFields: [],
            fields: [],
            tbStyle: {
                width: '70rem'
            }
        }
    },
    computed: {
        getTitle: function(){
            if(this.company_id){
                return this.company[this.company_id] + '业绩统计及毛利分析'
            }else{
                return '云瞻信息业绩统计及毛利分析'
            }
        },
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsperMonth + '?company_id=' + this.company_id + '&statistics_month=' + (this.company_id == 1 ? this.start_time_sc : (this.company_id == 2 ? this.start_time_cd : this.start_time_all)) + '&page=' + 1 + '&is_excel=1&skey=' + this.$cookies.get('skey')
        },
        getTimeIn: function(){
            if(this.company_id == 1){
                return this.start_time_sc
            }else if(this.company_id == 2){
                return this.start_time_cd
            }else{
                return this.start_time_all
            }
        }
    },
    created: function(){
        this.showLoading()
        return Promise.all([
            this.loadFields(setting.urls.cpsFields, {'order_type': 'performanceYear'}),
            this.loadTBData(setting.urls.cpsperMonth, {'company_id': 1, page: 1, 'statistics_month': this.start_time_sc}, 'get'),
            this.loadTBData(setting.urls.cpsperMonth, {'company_id': 2, page: 1, 'statistics_month': this.start_time_cd}, 'get'),
            this.loadTBData(setting.urls.cpsperMonth, {'company_id': 0, page: 1, 'statistics_month': this.start_time_all}, 'get')
        ]).then(rst => {
            this.fields = rst[0].fields

            this.scTBData = {
                tableHeader: rst[0].tableHeader,
                tbData: this.createTBData(rst[1], 1),
                lockedRow: rst[0].tableHeader.length,
                lockedCol: rst[0].lockedFields.length
            }

            this.cdTBData = {
                tableHeader: rst[0].tableHeader,
                tbData: this.createTBData(rst[2], 2),
                lockedRow: rst[0].tableHeader.length,
                lockedCol: rst[0].lockedFields.length
            }

            this.allTBData = {
                tableHeader: rst[0].tableHeader,
                tbData: this.createTBData(rst[3], 0),
                lockedRow: rst[0].tableHeader.length,
                lockedCol: rst[0].lockedFields.length
            }
        }).catch(e => {
            this.alert(e.message || '加载数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        tabClicked: function(companyId){
            this.$data['company_id'] = companyId
        },
        loadData: function(){
            const queryParams = {
                'company_id': this.company_id,
                'page': 1,
                'statistics_month': this.company_id == 1 ? this.start_time_sc : (this.company_id == 2 ? this.start_time_cd : this.start_time_all)
            }
            this.showLoading()
            this.loadTBData(setting.urls.cpsperMonth, queryParams, 'get')
                .then((rst) => {
                    const tbData = this.createTBData(rst, this.company_id)
                    if(this.company_id == 1){
                        this.scTBData = {
                            tbData: tbData,
                            tableHeader: this.scTBData.tableHeader,
                            lockedRow: this.scTBData.lockedRow,
                            lockedCol: this.scTBData.lockedCol
                        }
                    }
                    if(this.company_id == 2){
                        this.cdTBData = {
                            tbData: tbData,
                            tableHeader: this.cdTBData.tableHeader,
                            lockedRow: this.cdTBData.lockedRow,
                            lockedCol: this.cdTBData.lockedCol
                        }
                    }
                    if(this.company_id == 0){
                        this.allTBData = {
                            tbData: tbData,
                            tableHeader: this.allTBData.tableHeader,
                            lockedRow: this.allTBData.lockedRow,
                            lockedCol: this.allTBData.lockedCol
                        }
                    }
                }).catch(e => {
                    this.alert(e.message || '加载数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        createTBData: function(dt, companyId){
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push({
                        text: item[this.fields[idxx]] || (item[this.fields[idxx]] === 0 ? item[this.fields[idxx]] : '--')
                    })
                }
            }
            return tbData
        }
    },
    watch: {
        'company_id': function(nVal, oVal){
            this.$nextTick(() => {
                if(nVal == 1){
                    this.$children[3].resizeFixedHead()
                }else if(nVal == 2){
                    this.$children[4].resizeFixedHead()
                }else{
                    this.$children[5].resizeFixedHead()
                }
            })
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
/* .table-container { overflow-x: scroll; margin-top: 0; } */
</style>