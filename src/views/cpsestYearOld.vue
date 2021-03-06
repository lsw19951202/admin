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
                <button class="search-btn" @click="loadAllData">年度暂估</button>
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
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadTBData', 'strToNum', 'numToStr', 'caculFloat'],
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
                0: '云瞻信息',
                1: '四川云瞻',
                2: '成都云瞻'
            },
            'tableHeader': setting.tableHeader.cpsestYearAll,
            'tbType': 'tdSpan',
            tbData: []
        }
    },
    computed: {
        getTitle: function(){
            return this.company[this.company_id] + this.start_time + '年CPS预估结算收入明细表'
        },
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsestYear + '?company_id=' + this.company_id + '&statistics_year=' + this.start_time + '&page=' + 1 + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    created: function(){
        this.loadData()
    },
    methods: {
        loadData: function(){
            this.showLoading()
            this.loadTBData(setting.urls.cpsestYear, {'company_id': this.company_id, page: 1, 'statistics_year': this.start_time}, 'get').then(rst => {
                this.createTBData(rst)
            }).catch(e => {
                this.alert(e.message || '加载数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadSCData: function(){
            this.$data['company_id'] = 1
            this.tableHeader = setting.tableHeader.cpsestYear
            this.loadData()
        },
        loadCDData: function(){
            this.$data['company_id'] = 2
            this.tableHeader = setting.tableHeader.cpsestYear
            this.loadData()
        },
        loadAllData: function(){
            this.$data['company_id'] = 0
            this.tableHeader = setting.tableHeader.cpsestYearAll
            this.loadData()
        },
        exportData: function(){
            console.log('导出' + this.start_time + '数据')
        },
        createTBData: function(dt){
            const tbData = []
            let sortIdx = 1
            // 云瞻信息，合计行
            const countAll = [{text: '合计'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}]
            // 分公司，合计行
            const companyCount = [{text: ''}, {text: '合计'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}]
            for(let index = 0; index < dt.length; index++){
                for(let idx = 0; idx < dt[index]['statistics_list'].length; idx++){
                    const row = dt[index]['statistics_list'][idx]
                    const tmp = []
                    // 序号
                    if(this.company_id != 0){
                        tmp.push({
                            text: sortIdx++
                        })
                    }
                    if(idx == 0){
                        // 公司
                        if(this.company_id == 0){
                            tmp.push({
                                rowspan: (index == dt.length - 1) ? (dt[index]['statistics_list'].length + 1) :  dt[index]['statistics_list'].length,
                                text: dt[index]['company_name']
                            })
                        }else{// 平台
                            tmp.push({
                                rowspan: dt[index]['statistics_list'].length,
                                text: dt[index]['plat_name']
                            })
                        }
                    }
                    if(this.company_id == 0){
                        // 平台
                        tmp.push({
                            text: row['plat_name']
                        })
                    }else{
                        // 营销账号
                        tmp.push({
                            text: row['accounts_name']
                        })
                        // 收款账户
                        tmp.push({
                            text: row['credited_accounts']
                        })
                    }
                    let count = 0
                    // 12个月
                    const monthArr = row['statistics_list'] || []
                    monthArr.sort((m1, m2) => {
                        return m1.month.split('月')[0] - m2.month.split('月')[0]
                    })
                    let monthIdx = 0
                    for(let idxx = 1; idxx < 13; idxx++){
                        if(idxx == monthArr[monthIdx].month.split('月')[0]){
                            count = this.numToStr(this.caculFloat(this.strToNum(count), this.strToNum(monthArr[monthIdx]['settle_commission_amount'])))
                            tmp.push({
                                text: monthArr[monthIdx]['settle_commission_amount']
                            })
                            if((index == dt.length - 1) && (this.company_id == 0)){
                                countAll[idxx]['text'] = this.numToStr(this.caculFloat(this.strToNum(countAll[idxx]['text'] == '--' ? 0 : countAll[idxx]['text']), this.strToNum(monthArr[monthIdx]['settle_commission_amount'])))
                                countAll[13]['text'] = this.numToStr(this.caculFloat(this.strToNum(countAll[13]['text'] == '--' ? 0 : countAll[13]['text']), this.strToNum(monthArr[monthIdx]['settle_commission_amount'])))
                            }
                            if(this.company_id == 1 || this.company_id == 2){
                                companyCount[idxx + 3]['text'] = this.numToStr(this.caculFloat(this.strToNum(companyCount[idxx + 3]['text'] == '--' ? 0 : companyCount[idxx + 3]['text']), this.strToNum(monthArr[monthIdx]['settle_commission_amount'])))
                                companyCount[companyCount.length - 1]['text'] = this.numToStr(this.caculFloat(this.strToNum(companyCount[companyCount.length - 1]['text'] == '--' ? 0 : companyCount[companyCount.length - 1]['text']), this.strToNum(monthArr[monthIdx]['settle_commission_amount'])))
                            }
                            monthIdx++
                        }else{
                            tmp.push({
                                text: '--'
                            })
                        }
                    }
                    tmp.push({
                        text: count
                    })
                    tbData.push(tmp)
                }
            }
            if(this.company_id == 0){
                tbData.push(countAll)
            }else{
                companyCount[0]['text'] = sortIdx
                tbData.push(companyCount)
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