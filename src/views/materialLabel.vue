<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showMaterialLabelEditor">
            <header class="search-header" v-show="showHeader">
                <button class="action-btn" v-show="showAddBtn" @click="addMaterialLabel">新增</button>
            </header>
            <div :class="'table-container hideScrollBar marginBottom0' + (showHeader ? '' : ' marginTop0')">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader"></detail-table>
            </div>
        </div>
    </div>
</template>
<script>
import DetailTable from '@/components/content/table.vue'

export default {
    inject: ['reload', 'loadFields', 'loadTBData', 'showLoading', 'hideLoading', 'alert'],
    components: {
        'detail-table': DetailTable
    },
    created(){
        console.log('create')
    },
    data(){
        return {
            showAddBtn: false,
            showMaterialLabelEditor: false,
            tbType: 'materialLabel',
            tbData: [],
            tableHeader: []
        }
    },
    computed: {
        showHeader(){
            return this.showAddBtn
        }
    },
    methods: {
        addMaterialLabel(){
            console.log('add')
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
.table-container.marginTop0 { margin-top: 0; }
.table-container.marginBottom0 { margin-bottom: 0; }
</style>