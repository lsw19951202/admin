<template>
<div class="detail-container">
    <div class="detail-data-box">
        <header class="search-header">
            <div class="search-group">
                <label>操作人ID</label>
                <input type="text" placeholder="请输入" v-model="admin_id">
            </div>
            <div class="search-group">
                <label>操作人姓名</label>
                <input type="text" placeholder="请输入" v-model="create_user">
            </div>
            <div class="search-group">
                <label>操作时间</label>
                <flat-pickr class="search-time-picker" v-model="create_time" placeholder="开始时间" :config="dateConfig"></flat-pickr>
            </div>
            <div class="search-group">
                <label>操作描述</label>
                <input type="text" placeholder="请输入" v-model="desc">
            </div>
            <button class="action-btn" @click.prevent.stop="loadLogList(1)">搜索</button>
        </header>
        <div class="table-container">
            <table cellspacing="0">
                <thead>
                    <tr>
                        <td v-for="(headerItem, index) in tableHeader[0]" :key="index">
                            {{ headerItem.name }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in logList" :key="index">
                        <td v-for="(field, idx) in fields" :key="idx">
                            {{ row[field] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <page :pageData="pageData" @loadList="loadLogList"></page>
    </div>
</div>
</template>
<script>
import flatpickrVue from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import pageVue from '@/components/content/page.vue'

export default {
    components: {
        'flat-pickr': flatpickrVue,
        page: pageVue
    },
    inject: ['reload', 'alert', 'loadFields', 'loadTBData', 'showLoading', 'hideLoading'],
    data(){
        return {
            'admin_id': '',
            'create_user': '',
            'create_time': '',
            desc: '',
            tableHeader: [],
            fields: [],
            logList: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            dateConfig: {
                'time_24hr': true,
                locale: Mandarin,
                dateFormat: 'Y-m-d'
            }
        }
    },
    created(){
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'zsLogList' }, 'get'),
            this.loadTBData(setting.urls.zsLogList, { page: 1 }, 'get')
        ]).then(rst => {
            this.tableHeader = rst[0].tableHeader
            this.fields = rst[0].fields
            this.pageData.page = rst[1].page || 1
            this.pageData.total = rst[1].total || 0
            this.pageData['total_page'] = rst[1].total_page || rst[1].pageCount || 0
            console.log(this.pageData)

            this.logList = rst[1].data
        }).catch(e => {
            this.alert(e.message || '加载操作日志列表失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        loadLogList(pageNo){
            this.loadTBData(setting.urls.zsLogList, {
                page: pageNo || 1,
                'admin_id': this.admin_id,
                'create_user': this.create_user,
                'create_time': this.create_time,
                desc: this.desc
            }).then(rst => {
                this.pageData.page = rst.page || 1
                this.pageData.total = rst.total || 0
                this.pageData['total_page'] = rst.total_page || rst.pageCount || 0

                this.logList = rst.data
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
        .search-header {
            display: block;
            .search-group {
                margin-bottom: .5rem;
            }
        }
        .table-container {
            overflow: auto;
            margin-top: 0.5rem;
        }
    }
}
td {
    max-width: 7rem;
    word-break: break-all;
}
</style>