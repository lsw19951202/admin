<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>商品名称:</label>
                    <input type="text" placeholder="请输入" v-model="goodsTitle">
                </div>
                <div class="search-group">
                    <label>商品ID:</label>
                    <input type="text" placeholder="请输入" v-model="goodsId">
                </div>
                <selector class="search-group" :selectParams="selectParams" @selectOptsClicked="selectOptsClicked" :value="platform"></selector>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                </div>
                <button class="action-btn" @click="loadTBData(1)">搜索</button>
            </header>
            <div class="table-container">
                <detail-table :tbData="tbData" :tbType="tbType" :tableHeader="tableHeader"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import setting from '@/setting'
import Selector from '@/components/common/select.vue'
import DetailTable from '@/components/content/table.vue'
import Page from '@/components/content/page.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'selector': Selector,
        'detail-table': DetailTable,
        'page': Page
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
            goodsTitle: '',
            platform: '',
            goodsId: '',
            tbType: 'common',
            tbData: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            selectParams: {
                label: '下单平台',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 'jd',
                    text: '京东'
                }, {
                    value: 'pdd',
                    text: '拼多多'
                }, {
                    value: 'tb',
                    text: '淘宝'
                }, {
                    value: 'elm',
                    text: '饿了么'
                }, {
                    value: 'mt',
                    text: '美团'
                }]
            },
            createTimeBegin: nStr,
            createTimeEnd: nStr,
            tableHeader: setting.tableHeader.orderSalesList
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: '/order/salesranking',
                method: 'get',
                params: {
                    page: pageNum || 1,
                    goodsTitle: this.goodsTitle,
                    goodsId: this.goodsId,
                    platform: this.platform,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载商品销量排行列表失败')
                    }
                }else{
                    this.alert('加载商品销量排行列表失败')
                }
            }).catch((error) => {
                this.alert('加载商品销量排行列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            const plats = {'jd': '京东', 'pdd': '拼多多', 'tb': '淘宝', 'elm': '饿了么', 'mt': '美团'}
            const fields = ['goods_id', 'goods_title', 'goods_price', 'sale_num', 'platform', 'plat_commission_amount', 'order_amount']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < fields.length; idxx++){
                    let tdText = item[fields[idxx]] || (item[fields[idxx]] == 0 ? item[fields[idxx]] : '--')
                    if(idxx == 4){
                        tdText = plats[tdText] || '--'
                    }
                    tbData[idx].push(tdText)
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        selectOptsClicked: function(dt){
            this.platform = dt
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
</style>