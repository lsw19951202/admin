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
                    <label>上级ID:</label>
                    <input type="text" placeholder="请输入" v-model="parent_id">
                </div>
                <div class="search-group">
                    <label>电话:</label>
                    <input type="text" placeholder="请输入" v-model="phone">
                </div>
                <selector class="search-group" :value="rank" :selectParams="rankSelectParams" @selectOptsClicked="rankSelectOptsClicked"></selector>
                <selector class="search-group" :value="sortType" :selectParams="sortTypeSelectParams" @selectOptsClicked="sortTypeSelectOptsClicked"></selector>
                <button class="action-btn" @click="loadTBData(1)">搜索</button>
            </header>
            <locked-table v-show="!showOrderList" :tbData="tbData" :tbType="lockedTBType" :tbStyle="tbStyle" @rowClicked="rowClicked"></locked-table>
            <div class="table-container hideScrollBar" v-show="showOrderList">
                <detail-table style="width: 100rem;" :tbType="tbType" :tbData="orderListTBData" :tableHeader="tableHeader"></detail-table>
                <!-- <locked-table :tbData="orderListTBData" :tbStyle="orderListTBStyle"></locked-table> -->
            </div>
            <page v-show="!showOrderList" :pageData="pageData" @loadList="loadTBData"></page>
            <page v-show="showOrderList" :pageData="orderListPageData" @loadList="loadOrderListTBData"></page>
        </div>
    </div>
</template>
<script>
import Selector from '@/components/common/select.vue'
import request from '@/axios'
import DetailTable from '@/components/content/table.vue'
import LockedTable from '@/components/content/LockedTable.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'selector': Selector,
        'detail-table': DetailTable,
        'locked-table': LockedTable,
        'page': page
    },
    data: () => {
        return {
            showOrderList: false,
            id: '',
            nickName: '',
            'parent_id': '',
            phone: '',
            rank: '',
            sortType: '',
            tbType: 'orderList',
            orderListTBData: [],
            tbData: {
                tableHeader: [],
                tbData: [],
                lockedRow: 1,
                lockedCol: 5
            },
            lockedTBType: 'userRankList',
            tbStyle: {
                width: '110rem',
                marginTop: '0.5rem'
            },
            tableHeader: setting.tableHeader.orderList,
            rankSelectParams: {
                label: '职级',
                placeholder: '请选择',
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
                label: '排序类型',
                options: []
            },
            fields: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            orderListPageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            userId: ''
        }
    },
    created: function(){
        this.loadTableHeaderAndSortData()
            .then(() => {
                this.loadTBData(1)
            }).catch((e) => {
                console.log(e)
            })
    },
    methods: {
        loadOrderListTBData: function(pageNum){
            this.showLoading()
            request({
                url: setting.urls.appOrderList,
                method: 'get',
                params: {
                    page: pageNum || 1,
                    'user_id': this.userId
                }
            }).then(resp => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        const orderData = resp.data.data

                        this.orderListPageData.total = orderData.total
                        this.orderListPageData.page = orderData.page
                        this.orderListPageData['total_page'] = orderData.total_page || orderData.pageCount || 0

                        const fields = ['platOrderNo', 'goodsTitle', 'buyerName', 'buyerAvatar', 'orderAmount', 'platCommissionAmount', 'buyerCommissionAmount', 'orderStatus', 'tbType', 'oneProfit', 'twoProfit', 'leaderProfit', 'directorProfit', 'platCreateTime', 'lastUpdateTime', 'subOrderNo', 'goodsNum', 'goodsPrice', 'payAmount', 'platCommissionRate', 'commissionAmount', 'subsidyRate', 'subsidyAmount', 'subSideRate', 'technicalServiceRate', 'technicalServiceFee', 'paymentEstimateFee', 'settleEstimateFee', 'depositTime', 'tbDepositTime', 'depositAmount']
                        const tbData = []

                        for(let idx = 0; idx < orderData.data.length; idx++){
                            tbData.push([])
                            const item = orderData.data[idx]
                            for(let idxx = 0; idxx < fields.length; idxx++){
                                tbData[idx].push(item[fields[idxx]] || (item[fields[idxx]] === 0 ? item[fields[idxx]] : '--'))
                            }
                        }
                        this.orderListTBData = Object.assign([], tbData)
                        this.showOrderList = true
                    }else{
                        this.alert(resp.data.message || '加载订单列表失败')
                    }
                }else{
                    this.alert('加载订单列表失败')
                }
            }).catch(e => {
                this.alert('加载订单列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        rowClicked: function(dt){
            this.userId = dt[0].text
            this.loadOrderListTBData(1)
        },
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: setting.urls.userRankList,
                method: 'get',
                params: {
                    id: this.id,
                    nickName: this.nickName,
                    'parent_id': this.parent_id,
                    phone: this.phone,
                    rank: this.rank,
                    'sort_type': this.sortType,
                    page: pageNum || 1
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                        this.showOrderList = false
                    }else{
                        this.alert(resp.data.message || '加载用户排行列表失败')
                    }
                }else{
                    this.alert('加载用户排行列表失败')
                }
            }).catch((e) => {
                this.alert('加载用户排行列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push({text: item[this.fields[idxx]] || (item[this.fields[idxx]] === 0 ? item[this.fields[idxx]] : '--')})
                }
            }
            // this.tbData = Object.assign([], tbData)
            // this.tbData.tbData = tbData
            this.tbData = {
                tbData: tbData,
                tableHeader: this.tbData.tableHeader,
                lockedRow: this.tbData.lockedRow,
                lockedCol: this.tbData.lockedCol
            }
            console.log(this.tbData)
        },
        loadTableHeaderAndSortData: function(){
            this.showLoading()
            return new Promise((resolve, reject) => {
                request({
                    url: setting.urls.userRankTableHeader,
                    method: 'get',
                    params: {
                        'field_type': 'userRanking'
                    }
                }).then((resp) => {
                    if(resp.status == 200){
                        if(resp.data.code == 200){
                            this.createTableHeader(resp.data.data.title)
                            this.createSortData(resp.data.data.sort)
                            this.hideLoading()
                            resolve()
                        }else{
                            this.alert(resp.data.message || '加载用户排行表头数据失败')
                            this.hideLoading()
                            reject()
                        }
                    }else{
                        this.alert('加载用户排行表头数据失败')
                        this.hideLoading()
                        reject()
                    }
                }).catch((e) => {
                    this.alert('加载用户排行表头数据失败')
                    this.hideLoading()
                    reject()
                })
            })
        },
        createTableHeader: function(dt){
            const tableHeader = [], fields = []
            for(let idx = 0; idx < dt.length; idx++){
                tableHeader.push({name: dt[idx]['name']})
                fields.push(dt[idx]['field'])
            }
            // this.tableHeader = Object.assign([], [tableHeader])
            this.fields = Object.assign([], fields)
            this.tbData = {
                tbData: this.tbData.tbData,
                tableHeader: [tableHeader],
                lockedRow: this.tbData.lockedRow,
                lockedCol: this.tbData.lockedCol
            }
            console.log(this.tbData)
        },
        createSortData: function(dt){
            const sortOptions = [{
                value: '',
                text: '清选择'
            }]
            for(let idx = 0; idx < dt.length; idx++){
                sortOptions.push({
                    value: dt[idx]['field'],
                    text: dt[idx]['name']
                })
            }
            this.sortTypeSelectParams.options = sortOptions
        },
        rankSelectOptsClicked: function(dt){
            this.rank = dt
        },
        sortTypeSelectOptsClicked: function(dt){
            this.sortType = dt
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>