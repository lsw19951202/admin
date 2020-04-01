<template>
    <div class="detail-data-box">
        <header class="search-header">
            <div class="search-group">
                <label>手工数据详情</label>
            </div>
        </header>
        <div class="table-container">
            <detail-table v-bind:tbData="tbData" v-bind:tableHeader="tableHeader" v-bind:tbType="tbType"></detail-table>
        </div>
        <page v-bind:pageData="pageData" @loadList="loadDetailData"></page>
    </div>
</template>
<script>
import request from '@/axios'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import Page from '@/components/content/page.vue'

export default {
    inject: ['alert', 'showLoading', 'hideLoading'],
    components: {
        'detail-table': DetailTable,
        'page': Page
    },
    props: ['startTime'],
    data: () => {
        return {
            tbData: [],
            tableHeader: setting.tableHeader.cpsHandDetail,
            tbType: 'common',
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            }
        }
    },
    created: function(){
        this.loadDetailData()
    },
    methods: {
        /**
         * 加载手工数据详情
         */
        loadDetailData: function(pageNum){
            this.showLoading()
            pageNum = pageNum || 1
            request({
                url: setting.urls.cpsHandDetail,
                method: 'get',
                params: {
                    day: this.startTime,
                    page: pageNum
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createTBData(rst.data)
                    }else{
                        this.alert(rst.message || '加载' + this.startTime + '日详情数据失败')
                    }
                }else{
                    this.alert('加载' + this.startTime + '日详情数据失败')
                }
            }).catch((error) => {
                this.alert('加载' + this.startTime + '日详情数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0
            this.pageData.total = dt.total
            this.pageData.page = dt.page

            const fields = ['statistics_day', 'platform', 'cpsnick', 'cpsname', 'lm_predict_amount', 'lm_settlement_amount', 'db_predict_amount', 'db_settlement_amount', 'diff_predict_amount', 'diff_settlement_amount']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]])
                }
            }
            this.tbData = Object.assign([], tbData)
        }
    }
}
</script>