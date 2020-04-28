<template>
    <div class="team-list">
        <card-container v-bind:cardData="cardData" style="width: 50%;"></card-container>
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>用户ID:</label>
                    <input type="text" v-model="id" placeholder="请输入">
                </div>
                <div class="search-group">
                    <label>用户昵称:</label>
                    <input type="text" v-model="nickName" placeholder="请输入">
                </div>
                <div class="search-group">
                    <label>电话号码:</label>
                    <input type="text" v-model="phone" placeholder="请输入">
                </div>
                <selector class="search-group" :value="rank" :selectParams="rankSelectParams" @selectOptsClicked="rankSelectOptsClicked"></selector>
                <selector class="search-group" :value="isDirect" :selectParams="isDirectSelectParams" @selectOptsClicked="isDirectSelectOptsClicked"></selector>
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
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
        </div>
    </div>
</template>
<script>
import CardContainer from '@/components/content/cardContainer.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import request from '@/axios'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'
import Selector from '@/components/common/select.vue'

export default {
    props: ['teamId'],
    inject: ['alert', 'showLoading', 'hideLoading'],
    data: () => {
        const now = new Date()
        now.setDate(now.getDate() - 1)
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            id: '',
            nickName: '',
            phone: '',
            createTimeBegin: '',
            createTimeEnd: '',
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            cardData: [],
            tableHeader: setting.tableHeader.teamList,
            tbData: [],
            tbType: 'teamList',
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            rank: '',
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
            isDirect: 0,
            isDirectSelectParams: {
                label: '是否直邀',
                options:[{
                    value: 0,
                    text: '直属团队'
                }, {
                    value: 1,
                    text: '直邀'
                }, {
                    value: 2,
                    text: '间邀'
                }]
            },
            sortType: 'total_profit',
            sortTypeSelectParams: {
                label: '排序',
                options: [{
                    value: 'total_profit',
                    text: '总返利'
                }, {
                    value: 'profit_amount',
                    text: '个人返利'
                }, {
                    value: 'team_profit_amount',
                    text: '团队返利'
                }]
            }
        }
    },
    components: {
        'card-container': CardContainer,
        'flat-picker': flatPicker,
        'detail-table': DetailTable,
        'page': page,
        'selector': Selector
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: setting.urls.teamAll,
                method: 'get',
                params: {
                    page: pageNum || 1,
                    id: this.id,
                    teamId: this.teamId,
                    nickName: this.nickName,
                    phone: this.phone,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd,
                    rank: this.rank,
                    'is_direct': this.isDirect,
                    'sort_type': this.sortType
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载团队列表失败')
                    }
                }else{
                    this.alert('加载团队列表失败')
                }
            }).catch((error) => {
                this.alert('加载团队列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0
            const cardData =  []
            cardData.push({
                text: '有效会员(个)',
                num: dt.validUser || 0,
                imgSrc: require('@/assets/blue_eq.png')
            })
            cardData.push({
                text: '一般会员人数(个)',
                num: dt.commonUser || 0,
                imgSrc: require('@/assets/blue_eq.png')
            })
            cardData.push({
                text: '团队人数(个)',
                num: dt.teamTotal || 0,
                imgSrc: require('@/assets/blue_eq.png')
            })
            this.cardData = Object.assign([], [cardData]) 
            const tbData = []
            const fields = ['userId', 'rank', 'avatar', 'nickName', 'wechat', 'mobile', 'gender', 'payOrderAmount', 'payOrderNumber', 'availableAmount', 'withdrawAmount', 'teamTotalNumber', 'directNumber', 'otherNumber', 'total_profit', 'profit_amount', 'team_profit_amount', 'createTime', 'lastLoginTime']
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || (item[fields[idxx]] === 0 ? item[fields[idxx]] : '--'))
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        rankSelectOptsClicked: function(dt){
            this.rank = dt
        },
        isDirectSelectOptsClicked: function(dt){
            this.isDirect = dt
        },
        sortTypeSelectOptsClicked: function(dt){
            this.sortType = dt
        }
    }
}
</script>
<style scoped>
.team-list { flex: 1; height: 0; box-sizing: border-box; display: flex; flex-direction: column; }
.search-header { display: block; }
.search-group { margin-bottom: .5rem; }
</style>