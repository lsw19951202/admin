<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>用户ID:</label>
                    <input type="text" placeholder="请输入" v-model="id">
                </div>
                <div class="search-group">
                    <label>昵称:</label>
                    <input type="text" placeholder="请输入" v-model="nickName">
                </div>
                <div class="search-group">
                    <label>电话:</label>
                    <input type="text" placeholder="请输入" v-model="phone">
                </div>
                <selector class="search-group" :value="rank" :selectParams="rankSelectParams" @selectOptsClicked="rankSelectOptsClicked"></selector>
                <selector class="search-group" :value="sortType" :selectParams="sortTypeSelectParams" @selectOptsClicked="sortTypeSelectOptsClicked"></selector>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                </div>
                <button class="search-btn" @click="loadTBData(1)">搜索</button>
            </header>
            <div class="table-container">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
        </div>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import Selector from '@/components/common/select.vue'
import request from '@/axios'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'selector': Selector,
        'detail-table': DetailTable,
        'page': page
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            id: '',
            nickName: '',
            phone: '',
            rank: '',
            sortType: 1,
            createTimeBegin: '',
            createTimeEnd: '',
            tbData: [],
            tableHeader: setting.tableHeader.teamSortList,
            tbType: 'common',
            pageData: {
                'total': 0,
                'page': 1,
                'total_page': 0
            },
            rankSelectParams: {
                label: '职级',
                options: [{
                    value: '',
                    text: '请选择'
                },{
                    value: 1,
                    text: '会员'
                }, {
                    value: 2,
                    text: '团长'
                }, {
                    value: 3,
                    text: '总监'
                }]
            },
            sortTypeSelectParams: {
                label: '查询类型',
                options: [{
                    value: 1,
                    text: '用户佣金'
                }, {
                    value: 5,
                    text: '团长订单'
                }, {
                    value: 6,
                    text: '总监订单'
                }, {
                    value: 7,
                    text: '团长邀请数量'
                }, {
                    value: 8,
                    text: '总监邀请数量'
                }]
            }
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        rankSelectOptsClicked: function(dt){
            this.rank = dt
        },
        sortTypeSelectOptsClicked: function(dt){
            this.sortType = dt
        },
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: '/team/ranking',
                method: 'get',
                params: {
                    page: pageNum || 1,
                    id: this.id,
                    nickName: this.nickName,
                    phone: this.phone,
                    rank: this.rank,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd,
                    type: this.sortType
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载团队排行列表失败')
                    }
                }else{
                    this.alert('加载团队排行列表失败')
                }
            }).catch((error) => {
                this.alert('加载团队排行列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0
            this.pageData.page = dt.page
            const fields = ['userId', 'rank', 'mobile', 'nickName', 'wechat', 'amount', 'statistics_day']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || (item[fields[idxx]] === 0 ? item[fields[idxx]] : '--'))
                }
            }
            this.tbData = Object.assign([], tbData)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>