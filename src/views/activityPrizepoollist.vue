<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="showPoolList">
            <header class="search-header">
                <selector class="search-group" :value="is_new" :selectParams="selectParams" @selectOptsClicked="selectOptsClicked"></selector>
                <div class="search-group">
                    <label>用户ID:</label>
                    <input type="text" placeholder="请输入" v-model="user_id">
                </div>
                <div class="search-group">
                    <label>用户昵称:</label>
                    <input type="text" placeholder="请输入" v-model="nick_name">
                </div>
                <div class="search-group">
                    <label>电话号码:</label>
                    <input type="text" placeholder="请输入" v-model="mobile">
                </div>
                <div class="search-group">
                    <label>上级ID:</label>
                    <input type="text" placeholder="请输入" v-model="parent_id">
                </div>
                <button class="action-btn" @click="loadPoolList(1)">搜索</button>
                <a class="action-btn" style="display: inline-block;" download="奖金池活动列表.xlsx" :href="downloadUrl">导出</a>
            </header>
            <locked-table :tbData="poolListData" :tbStyle="tbStyle" :tbType="tbType" @rowClicked="rowClicked"></locked-table>
            <page :pageData="pageData" @loadList="loadPoolList"></page>
        </div>
        <div class="detail-data-box" v-show="showPoolDetail">
            <header class="search-header" style="display: flex;">
                <div class="search-group text-right">
                    <div class="item">
                        <label>奖金池剩余:</label>
                        <span>{{reward_amount}}元</span>
                    </div>
                    <div class="item">
                        <label>合计:</label>
                        <span>{{total_amount}}元</span>
                    </div>
                    <div class="item">
                        <label>有效好友:</label>
                        <span>{{valid_invite_num}}人</span>
                    </div>
                    <div class="item">
                        <label>伯乐奖:</label>
                        <span>共{{bole_num}}人,总金额{{bole_amount}}元</span>
                    </div>
                    <div class="item">
                        <label>孵化奖:</label>
                        <span>共{{hatch_num}}人,总金额{{hatch_amount}}元</span>
                    </div>
                    <div class="item">
                        <label>新人奖:</label>
                        <span>{{new_amount}}元</span>
                    </div>
                </div>
            </header>
            <locked-table :tbData="poolDetailData" :tbStyle="tbStyle" :tbType="tbType" @rowClicked="rowClicked"></locked-table>
            <div class="page-footer" style="display: flex;">
                <div style="margin-top: .3rem; height: .875rem; line-height: .875rem;">
                    <button class="action-btn" @click="loadUper">返回上级</button>
                </div>
                <page style="width: 0; flex: 1;" :pageData="poolDetailPageData" @loadList="loadPoolDetail"></page>
            </div>
        </div>
        <div class="detail-data-box" v-show="showOrderList">
            <locked-table :tbData="orderListData" :tbStyle="orderListStyle"></locked-table>
            <div class="page-footer" style="display: flex;">
                <div style="margin-top: .3rem; height: .875rem; line-height: .875rem;">
                    <button class="action-btn" @click="loadUper">返回上级</button>
                </div>
                <page style="width: 0; flex: 1;" :pageData="orderListPageData" @loadList="loadOrderList"></page>
            </div>
        </div>
    </div>
</template>
<script>
import Selector from '@/components/common/select.vue'
import request from '@/axios'
import LockedTable from '@/components/content/LockedTable.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'selector': Selector,
        'locked-table': LockedTable,
        'page': page
    },
    data: () => {
        return {
            showPoolList: true,
            showPoolDetail: false,
            showOrderList: false,
            'is_new': 0,
            selectParams: {
                label: '是否新人',
                placeholder: '请选择',
                options: [{
                    value: 0,
                    text: '全部'
                }, {
                    value: 1,
                    text: '老用户'
                }, {
                    value: 2,
                    text: '新用户'
                }]
            },
            poolListData: {
                tableHeader: [],
                tbData: [],
                lockedRow: 1,
                lockedCol: 1
            },
            tbStyle: {
                width: '100%'
            },
            orderListStyle: {
                width: '100rem'
            },
            tbType: 'poolList',
            pageData: {
                'total': 0,
                'page': 1,
                'total_page': 0
            },
            uperList: [],
            poolListFields: [],
            poolDetailFields: [],
            orderListFields: ['platOrderNo', 'goodsTitle', 'buyerName', 'goods_id', 'orderAmount', 'platCommissionAmount', 'buyerCommissionAmount', 'orderStatus', 'tbType', 'oneProfit', 'twoProfit', 'leaderProfit', 'directorProfit', 'platCreateTime', 'lastUpdateTime', 'subOrderNo', 'goodsNum', 'goodsPrice', 'payAmount', 'platCommissionRate', 'commissionAmount', 'subsidyRate', 'subsidyAmount', 'subSideRate', 'technicalServiceRate', 'technicalServiceFee', 'paymentEstimateFee', 'settleEstimateFee', 'depositTime', 'tbDepositTime', 'depositAmount'],
            'reward_amount': 0,
            'total_amount': 0,
            'valid_invite_num': 0,
            'bole_num': 0,
            'bole_amount': 0,
            'hatch_num': 0,
            'hatch_amount': 0,
            'new_amount': 0,
            poolDetailData: {
                tableHeader: [],
                tbData: [],
                lockedRow: 1,
                lockedCol: 2
            },
            poolDetailPageData: {
                page: 1,
                total: 0,
                'total_page': 0
            },
            orderListData: {
                tableHeader: setting.tableHeader.orderList1,
                tbData: [],
                lockedRow: 1,
                lockedCol: 3
            },
            orderListPageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            'user_id': '',
            'nick_name': '',
            'mobile': '',
            'parent_id': ''
        }
    },
    computed: {
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.prizepoollist + '?is_new=' + this.is_new + '&page=' + this.pageData.page + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    created: function(){
        this.showLoading()
        return Promise.all([
            this.loadFields(setting.urls.appFields, {'field_type': 'prizePoolList'}),
            this.loadFields(setting.urls.appFields, {'field_type': 'prizePoolInfo'}),
            this.loadTBData(setting.urls.prizepoollist, {'is_new': this.is_new, page: 1, 'user_id': this.user_id, 'nick_name': this.nick_name, mobile: this.mobile, 'parent_id': this.parent_id}, 'get')
        ]).then(rst => {
            this.poolListFields = rst[0].fields
            this.poolDetailFields = rst[1].fields

            const poolListTableHeader = rst[0].tableHeader
            poolListTableHeader[0].push({name: '操作'})
            const poolDetailTableHeader = rst[1].tableHeader
            poolDetailTableHeader[0].push({name: '操作'})

            this.poolListData = {
                tableHeader: poolListTableHeader,
                tbData: this.createTBData(rst[2], 0),
                lockedRow: this.poolListData.lockedRow,
                lockedCol: this.poolListData.lockedCol
            }

            this.poolDetailData = {
                tableHeader: poolDetailTableHeader,
                tbData: [],
                lockedRow: this.poolDetailData.lockedRow,
                lockedCol: this.poolDetailData.lockedCol
            }

            this.uperList.push({
                type: 'poolList',
                search: {
                    'is_new': this.is_new,
                    'user_id': this.user_id,
                    'nick_name': this.nick_name,
                    'mobile': this.mobile,
                    'parent_id': this.parent_id,
                    page: this.pageData.page
                },
                pageData: this.pageData,
                data: this.poolListData
            })
        }).catch(e => {
            this.alert(e.message || '加载数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        rowClicked: function(dt){
            if(dt.tp == 'prize'){
                this.uperList.push({
                    type: 'poolDetail',
                    search: {
                        'user_id': this.uperList.length == 1 ? dt.data[1].text : dt.data[0].text,
                        page: 1
                    }
                })
                this.loadPoolDetail(1).then(() => {
                    this.showPoolList = false
                    this.showOrderList = false
                    this.showPoolDetail = true
                })
            }else if(dt.tp == 'order'){
                this.uperList.push({
                    type: 'orderList',
                    search: {
                        'user_id': this.uperList.length == 1 ? dt.data[1].text : dt.data[0].text,
                        page: 1
                    }
                })
                this.loadOrderList(1).then(() => {
                    this.showPoolDetail = false
                    this.showPoolList = false
                    this.showOrderList = true
                })
            }
        },
        loadUper: function(){
            console.log('loadUper')
            this.uperList.splice(this.uperList.length - 1, 1)
            const tmpData = this.uperList[this.uperList.length - 1]
            if(tmpData.type == 'poolList'){
                this.pageData = tmpData.pageData
                this.poolListData = tmpData.data
                this.$data['is_new'] = tmpData.search['is_new']
                this.$data['user_id'] = tmpData.search['user_id']
                this.$data['nick_name'] = tmpData.search['nick_name']
                this.$data['mobile'] = tmpData.search['mobile']
                this.$data['parent_id'] = tmpData.search['parent_id']
                this.showPoolDetail = false
                this.showOrderList = false
                this.showPoolList = true
            }else if(tmpData.type == 'poolDetail'){
                this.poolDetailPageData = tmpData.pageData
                this.poolDetailData = tmpData.data
                this.showOrderList = false
                this.showPoolList = false
                this.showPoolDetail = true
            }
        },
        loadPoolList: function(pageNum){
            this.showLoading()
            return this.loadTBData(setting.urls.prizepoollist, {'is_new': this.is_new, 'page': pageNum || 1, 'user_id': this.user_id, 'nick_name': this.nick_name, mobile: this.mobile, 'parent_id': this.parent_id})
                .then(rst => {
                    this.poolListData = {
                        tableHeader: this.poolListData.tableHeader,
                        tbData: this.createTBData(rst, 0),
                        lockedRow: this.poolListData.lockedRow,
                        lockedCol: this.poolListData.lockedCol
                    }

                    this.uperList[0].search.page = pageNum || 1
                    this.uperList[0].search['user_id'] = this.user_id
                    this.uperList[0].search['nick_name'] = this.nick_name
                    this.uperList[0].search['mobile'] = this.mobile
                    this.uperList[0].search['parent_id'] = this.parent_id
                    this.uperList[0].pageData = this.pageData
                    this.uperList[0].data = this.poolListData
                }).catch(e => {
                    this.alert(e.message || '加载列表数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        selectOptsClicked: function(dt){
            this.$data['is_new'] = dt
            this.uperList[0].search['is_new'] = dt
        },
        loadPoolDetail: function(pageNum){
            this.showLoading()
            return this.loadTBData(setting.urls.prizepoolinfo, {'user_id': this.uperList[this.uperList.length - 1].search['user_id'], page: pageNum || 1})
                .then(rst => {
                    this.poolDetailData = {
                        tableHeader: this.poolDetailData.tableHeader,
                        tbData: this.createTBData(rst, 1),
                        lockedRow: this.poolDetailData.lockedRow,
                        lockedCol: this.poolDetailData.lockedCol
                    }

                    this.uperList[this.uperList.length - 1].search.page = pageNum || 1
                    this.uperList[this.uperList.length - 1].pageData = this.poolDetailPageData
                    this.uperList[this.uperList.length - 1].data = this.poolDetailData
                    this.uperList[this.uperList.length - 1]['reward_amount'] = this.reward_amount
                    this.uperList[this.uperList.length - 1]['total_amount'] = this.total_amount
                    this.uperList[this.uperList.length - 1]['valid_invite_num'] = this.valid_invite_num
                    this.uperList[this.uperList.length - 1]['bole_num'] = this.bole_num
                    this.uperList[this.uperList.length - 1]['bole_amount'] = this.bole_amount
                    this.uperList[this.uperList.length - 1]['hatch_num'] = this.hatch_num
                    this.uperList[this.uperList.length - 1]['hatch_amount'] = this.hatch_amount
                    this.uperList[this.uperList.length - 1]['new_amount'] = this.new_amount
                }).catch(e => {
                    this.alert(e.message || '加载详情数据失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        loadOrderList: function(pageNum){
            this.showLoading()
            return this.loadTBData(setting.urls.appOrderList, {page: pageNum || 1, 'user_id': this.uperList[this.uperList.length - 1].search['user_id']})
                .then(rst => {
                    this.orderListData = {
                        tableHeader: this.orderListData.tableHeader,
                        tbData: this.createTBData(rst, 2),
                        lockedRow: this.orderListData.lockedRow,
                        lockedCol: this.orderListData.lockedCol
                    }

                    this.uperList[this.uperList.length - 1].search.page = pageNum || 1
                    this.uperList[this.uperList.length - 1].pageData = this.orderListPageData
                    this.uperList[this.uperList.length - 1].data = this.orderListData
                }).catch(e => {
                    this.alert(e.message || '加载订单失败')
                }).then(() => {
                    this.hideLoading()
                })
        },
        createTBData: function(dt, tp){
            const pageData = {
                total: 0,
                page: 1,
                'total_page': 0
            }
            pageData.total = dt.total
            pageData.page = dt.page
            pageData['total_page'] = dt.total_page || dt.pageCount || 0

            const tbData = []
            const fields = tp == 0 ? this.poolListFields : (tp == 1 ? this.poolDetailFields : this.orderListFields)
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push({
                        text: item[fields[idxx]] || (item[fields[idxx]] === 0 ? item[fields[idxx]] : '--')
                    })
                }
            }
            if(tp == 0){
                this.pageData = pageData
            }else if(tp == 1){
                this.poolDetailPageData = pageData
                this.$data['reward_amount'] = dt['reward_amount'] || 0
                this.$data['total_amount'] = dt['total_amount'] || 0
                this.$data['valid_invite_num'] = dt['valid_invite_num'] || 0
                this.$data['bole_num'] = dt['bole_num'] || 0
                this.$data['bole_amount'] = dt['bole_amount'] || 0
                this.$data['hatch_num'] = dt['hatch_num'] || 0
                this.$data['hatch_amount'] = dt['hatch_amount'] || 0
                this.$data['new_amount'] = dt['new_amount'] || 0
            }else{
                this.orderListPageData = pageData
            }
            return tbData
        }
    },
    watch: {
        'showPoolList': function(nVal, oVal){
            if(nVal && !oVal){
                this.$nextTick(() => {
                    this.$children[1].resizeFixedHead()
                })
            }
        },
        'showPoolDetail': function(nVal, oVal){
            if(nVal && !oVal){
                this.$nextTick(() => {
                    this.$children[3].resizeFixedHead()
                })
            }
        },
        'showOrderList': function(nVal, oVal){
            if(nVal && !oVal){
                this.$nextTick(() => {
                    this.$children[5].resizeFixedHead()
                })
            }
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.search-header { display: block; }
.search-group { margin-bottom: .5rem; }
</style>