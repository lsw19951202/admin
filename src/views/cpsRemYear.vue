<template>
    <div class="detail-container hideScrollBar">
        <div class="detail-data-box nopadding">
            <ul class="tab-box">
                <li :class="'tab-item' + (company_id == 1 ? ' selected' : '')" @click="tabClicked(1)">四川云瞻</li>
                <li :class="'tab-item' + (company_id == 2 ? ' selected' : '')" style="left: 145px;" @click="tabClicked(2)">成都云瞻</li>
                <li :class="'tab-item' + (company_id == 0 ? ' selected' : '')" style="left: 290px;" @click="tabClicked(0)">酬金汇总</li>
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
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData', 'strToNum', 'numToStr', 'caculFloat'],
    components: {
        'flat-picker': flatPicker,
        'locked-table': LockedTable
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear()
        return {
            'start_time_sc': nStr,
            'start_time_cd': nStr,
            'start_time_all': nStr,
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
            scTBData: {
                tableHeader: setting.tableHeader.cpsremYear,
                tbData: [],
                lockedRow: 1,
                lockedCol: 3
            },
            cdTBData: {
                tableHeader: setting.tableHeader.cpsremYear,
                tbData: [],
                lockedRow: 1,
                lockedCol: 3
            },
            allTBData: {
                tableHeader: setting.tableHeader.cpsremYearAll,
                tbData: [],
                lockedRow: 1,
                lockedCol: 2
            },
            companyFields: [],
            fields: [],
            allFields: [],
            tbStyle: {
                width: '100%'
            }
        }
    },
    computed: {
        getTitle: function(){
            if(this.company_id == 0){
                return this.company[this.company_id] + this.start_time_all + "年CPS代理人酬金统计表"
            }else{
                return this.company[this.company_id] + (this.company_id == 1 ? this.start_time_sc : this.start_time_cd) + '年CPS代理人应付酬金结算表'
            }
        },
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.cpsremYear + '?company_id=' + this.company_id + '&statistics_year=' + (this.company_id == 1 ? this.start_time_sc : (this.company_id == 2 ? this.start_time_cd : this.start_time_all)) + '&page=' + 1 + '&is_excel=1&skey=' + this.$cookies.get('skey')
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
            this.loadTBData(setting.urls.cpsremYear, {'company_id': 1, page: 1, 'statistics_year': this.start_time_sc}, 'get'),
            this.loadTBData(setting.urls.cpsremYear, {'company_id': 2, page: 1, 'statistics_year': this.start_time_cd}, 'get'),
            this.loadTBData(setting.urls.cpsremYear, {'company_id': 0, page: 1, 'statistics_year': this.start_time_all}, 'get')
        ]).then(rst => {

            this.scTBData = {
                tableHeader: this.scTBData.tableHeader,
                tbData: this.createTBData(rst[0], 1),
                lockedRow: this.scTBData.lockedRow,
                lockedCol: this.scTBData.lockedCol
            }

            this.cdTBData = {
                tableHeader: this.cdTBData.tableHeader,
                tbData: this.createTBData(rst[1], 2),
                lockedRow: this.cdTBData.lockedRow,
                lockedCol: this.cdTBData.lockedCol
            }

            this.allTBData = {
                tableHeader: this.allTBData.tableHeader,
                tbData: this.createTBData(rst[2], 0),
                lockedRow: this.allTBData.lockedRow,
                lockedCol: this.allTBData.lockedCol
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
                'statistics_year': this.company_id == 1 ? this.start_time_sc : (this.company_id == 2 ? this.start_time_cd : this.start_time_all)
            }
            this.showLoading()
            this.loadTBData(setting.urls.cpsremYear, queryParams, 'get')
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
            let sortIdx = 1
            // 云瞻信息，合计行
            const countAll = [{text: '合计'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}]
            // 分公司，合计行
            const companyCount = [{text: ''}, {text: '合计'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}]
            for(let index = 0; index < dt.length; index++){
                const xiaoji = [{text: '小计'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}, {text: '--'}]
                for(let idx = 0; idx < dt[index]['statistics_list'].length; idx++){
                    const row = dt[index]['statistics_list'][idx]
                    const tmp = []
                    // 序号
                    if(companyId != 0){
                        tmp.push({
                            text: sortIdx++
                        })
                    }
                    if(idx == 0){
                        // 公司
                        if(companyId == 0){
                            tmp.push({
                                rowspan: dt[index]['statistics_list'].length + 1,
                                text: dt[index]['company_name']
                            })
                        }else{// 平台
                            tmp.push({
                                rowspan: dt[index]['statistics_list'].length,
                                text: dt[index]['plat_name']
                            })
                        }
                    }
                    if(companyId == 0){
                        // 平台
                        tmp.push({
                            text: row['plat_name']
                        })
                    }else{
                        // 账号
                        tmp.push({
                            text: row['accounts_name'] || '--'
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
                            count = this.numToStr(this.caculFloat(this.strToNum(count), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                            tmp.push({
                                text: monthArr[monthIdx]['real_remuneration_amount']
                            })
                            if((index == dt.length - 1) && (companyId == 0)){
                                countAll[idxx]['text'] = this.numToStr(this.caculFloat(this.strToNum(countAll[idxx]['text'] == '--' ? 0 : countAll[idxx]['text']), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                                countAll[13]['text'] = this.numToStr(this.caculFloat(this.strToNum(countAll[13]['text'] == '--' ? 0 : countAll[13]['text']), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                            }
                            if((index != dt.length - 1) && (companyId == 0)){
                                xiaoji[idxx]['text'] = this.numToStr(this.caculFloat(this.strToNum(xiaoji[idxx]['text'] == '--' ? 0 : xiaoji[idxx]['text']), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                                xiaoji[13]['text'] = this.numToStr(this.caculFloat(this.strToNum(xiaoji[13]['text'] == '--' ? 0 : xiaoji[13]['text']), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                            }
                            if(companyId == 1 || companyId == 2){
                                companyCount[idxx + 2]['text'] = this.numToStr(this.caculFloat(this.strToNum(companyCount[idxx + 2]['text'] == '--' ? 0 : companyCount[idxx + 2]['text']), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                                companyCount[companyCount.length - 2]['text'] = this.numToStr(this.caculFloat(this.strToNum(companyCount[companyCount.length - 2]['text'] == '--' ? 0 : companyCount[companyCount.length - 2]['text']), this.strToNum(monthArr[monthIdx]['real_remuneration_amount'])))
                            }
                            monthIdx++
                        }else{
                            tmp.push({
                                text: '--'
                            })
                        }
                    }
                    // 合计
                    tmp.push({
                        text: count
                    })
                    // 分公司 备注  汇总  上年数
                    tmp.push({
                        text: '--'
                    })
                    tbData.push(tmp)
                }
                if((index != dt.length - 1) && companyId == 0){
                    tbData.push(xiaoji)
                }
            }
            if(companyId == 0){
                tbData.push(countAll)
            }else{
                companyCount[0]['text'] = sortIdx
                tbData.push(companyCount)
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
</style>