<template>
<div class="detail-container">
    <div class="detail-data-box" v-show="!showOrderList">
        <header class="search-header">
            <div class="search-group">
                <label>时间</label>
                <flat-pickr class="search-time-picker" v-model="start_time" placeholder="开始时间" :config="dateConfig"></flat-pickr>
                <div class="split-line"><div></div></div>
                <flat-pickr class="search-time-picker" v-model="end_time" placeholder="结束时间" :config="dateConfig"></flat-pickr>
            </div>
            <button class="action-btn" @click.prevent.stop="loadRobotList(1)">搜索</button>
        </header>
        <div class="tj">
            <div class="tj-item">总订单量:{{all.order_num}}</div>
            <div class="tj-item">总销量:{{all.sale_num}}</div>
            <div class="tj-item">总付款金额:{{all.order_amount}}</div>
            <div class="tj-item">总付款预估收入:{{all.plat_commission_amount}}</div>
        </div>
        <div class="table-container">
            <table cellspacing="0">
                <thead>
                    <tr>
                        <td v-for="(headerItem, index) in tableHeader[0]" :key="index">
                            {{headerItem.name}}
                        </td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in robotList" :key="index">
                        <td v-for="(field, idx) in fields" :key="idx">
                            {{row[field]}}
                        </td>
                        <td>
                            <button class="action-btn" @click.prevent.stop="lookUpRobot(index)">查看</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <page :pageData="pageData" @loadList="loadRobotList"></page>
    </div>
    <div class="detail-data-box" v-show="showOrderList">
        <header class="search-header">
            <div class="search-group">
                <label>商品名称</label>
                <input type="text" v-model="goods_title">
            </div>
            <div class="search-group">
                <label>商品ID</label>
                <input type="text" v-model="goods_id">
            </div>
            <button class="action-btn" @click.prevent.stop="loadOrderList(1)">搜索</button>
            <a :href="downloadUrl" class="action-btn" :download="'商品销售数据_' + statistics_day + '.xlsx'">导出全部</a>
        </header>
        <div class="table-container" style="margin-top: .5rem;">
            <table cellspacing="0">
                <thead>
                    <tr>
                        <td v-for="(headerItem, index) in orderListTableHeader[0]" :key="index">
                            {{headerItem.name}}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in orderList" :key="index">
                        <td v-for="(field, idx) in orderListFields" :key="idx">
                            {{row[field]}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="width: 100%; display: flex;">
            <div class="action-btn" style="font-size: .4375rem;" @click.prevent.stop="prevClicked">返回上一级</div>
            <page :pageData="orderListPageData" style="flex: 1;" @loadList="loadOrderList"></page>
        </div>
    </div>
</div>
</template>
<script>
import flatpickrVue from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import pageVue from '@/components/content/page.vue'
import request from '@/axios'
import qs from 'qs'

export default {
    components: {
        'flat-pickr': flatpickrVue,
        page: pageVue
    },
    inject: ['reload', 'alert', 'loadFields', 'loadTBData', 'showLoading', 'hideLoading'],
    data() {
        return {
            'start_time': '',
            'end_time': '',
            dateConfig: {
                'time_24hr': true,
                locale: Mandarin,
                dateFormat: 'Y-m-d'
            },
            all: {
                'order_num': 0,
                'sale_num': 0,
                'order_amount': 0,
                'plat_commission_amount': 0
            },
            tableHeader: [],
            fields: [],
            robotList: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            'goods_id': '',
            'goods_title': '',
            orderListTableHeader: [],
            orderListFields: [],
            orderList: [],
            orderListPageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            showOrderList: false,
            'statistics_day': ''
        }
    },
    created() {
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.appFields, {'field_type': 'robotGoods'}, 'get'),
            this.loadFields(setting.urls.appFields, {'field_type': 'robotGoodsList'}, 'get'),
            this.loadTBData(setting.urls.robotGoods, {page: 1}, 'get')
        ]).then(rst => {
            this.tableHeader = rst[0].tableHeader
            this.fields = rst[0].fields
            this.orderListTableHeader = rst[1].tableHeader
            this.orderListFields = rst[1].fields
            this.all = rst[2].all && rst[2].all[0] || {'order_num': 0, 'sale_num': 0, 'order_amount': 0, 'plat_commission_amount': 0}
            this.robotList = rst[2].data
            this.pageData.total = rst[2].total || 0
            this.pageData.page = rst[2].page || 1
            this.pageData['total_page'] = rst[2].pageCount || rst[2].total_page || 0
        }).catch(e => {
            this.alert(e.message || '加载机器人商品数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    computed: {
        downloadUrl() {
            return setting.baseUrl + setting.urls.robotGoodsList + '?goods_id=' + this.goods_id + '&goods_title=' + this.goods_title + '&statistics_day=' + this.statistics_day + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    methods: {
        lookUpRobot(index) {
            this.$data['statistics_day'] = this.robotList[index].statistics_day
            this.showOrderList = true
            this.loadOrderList(1)
        },
        prevClicked() {
            this.showOrderList = false
        },
        loadRobotList(pageNo) {
            this.showLoading()
            return this.loadTBData(setting.urls.robotGoods, {
                page: pageNo || 1,
                'start_time': this.start_time,
                'end_time': this.end_time
            }).then(rst => {
                this.pageData.total = rst.total || 0
                this.pageData.page = rst.page || 1
                this.pageData['total_page'] = rst.pageCount || rst.total_page || 0
                this.all = rst.all && rst.all[0] || {'order_num': 0, 'sale_num': 0, 'order_amount': 0, 'plat_commission_amount': 0}
                this.robotList = rst.data
            }).catch(e => {
                this.alert(e.message || '加载机器人商品数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadOrderList(pageNo) {
            this.showLoading()
            return this.loadTBData(setting.urls.robotGoodsList, {
                page: pageNo || 1,
                'goods_id': this.goods_id,
                'goods_title': this.goods_title,
                'statistics_day': this.statistics_day
            }).then(rst => {
                this.orderListPageData.total = rst.total || 0
                this.orderListPageData.page = rst.page || 1
                this.orderListPageData['total_page'] = rst.pageCount || rst.total_page || 0
                this.orderList = rst.data
            }).catch(e => {
                this.alert(e.message || '加载机器人商品销售数量失败')
            }).then(() => {
                this.hideLoading()
            })
        }
    }
}
</script>
<style lang="less" scoped>
.detail-container {
    background-color: #f2f2f2;
    padding: 0;
    margin: 0;
    overflow: hidden;
    .detail-data-box {
        margin-top: 0;
        .tj {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            .tj-item {
                width: auto;
                margin-left: 1rem;
                display: inline-block;
                font-size: .4375rem;
                vertical-align: top;
            }
            .tj-item:first-child {
                margin-left: 0;
            }
        }
        .table-container {
            overflow: auto;
            margin-top: 0;
        }
    }
}
td {
    max-width: 7rem;
    word-break: break-all;
}
</style>