<template>
    <div class="capital-detail">
        <div class="capital-detail-title">
            {{title}}
        </div>
        <div class="detail-data-box">
            <div class="table-container hideScrollBar">
                <detail-table v-bind:tableHeader="tableHeader" v-bind:tbType="tbType" v-bind:tbData="tbData"></detail-table>
            </div>
            <div style="width: 100%; height: 1rem;">
                <button @click="hideDetailPage">返回</button>
            </div>
        </div>
    </div>
</template>
<script>
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'

export default {
    props: ['title', 'tbData'],
    data: () => {
        return {
            tableHeader: setting.tableHeader.cpsCapitalDetail,
            tbType: 'common'
        }
    },
    components: {
        'detail-table': DetailTable
    },
    methods: {
        hideDetailPage: function(){
            this.$parent.$parent.subTitle2 = ''
            this.$parent.showDetail = false
        }
    }
}
</script>
<style scoped>
.capital-detail { background-color: #f2f2f2; padding: 0; margin: 0; flex: 1; height: 0; overflow: hidden; display: flex; flex-direction: column; }
.capital-detail-title { box-sizing: border-box; text-align: left; padding-left: 1.25em; font-size: .5em; height: 3.5625em; line-height: 3.5625em; color: #999999; }
.table-container { margin-top: 0; }
button { cursor: pointer; width: 2.65624rem; height: 1rem; line-height: 1rem; background-color: #4880EA; border-radius: .125rem; color: white; vertical-align: top; }
</style>