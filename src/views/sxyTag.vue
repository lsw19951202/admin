<template>
    <div class="detial-container">
        <div class="detail-data-box" v-show="!showTagEditor">
            <header class="search-header">
                <button class="action-btn" @click="addTag">新建+</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @editTag="editTag" @delTag="delTag"></detail-table>
            </div>
        </div>
        <tag-editor v-if="showTagEditor" :tag="tag" @saveTag="saveTag" @cancelEditTag="cancelEditTag"></tag-editor>
    </div>
</template>
<script>
import request from '@/axios'
import qs from 'qs'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import TagEditor from '@/components/content/tagEditor.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'detail-table': DetailTable,
        'tag-editor': TagEditor
    },
    data: () => {
        return {
            showTagEditor: false,
            tbType: 'tagList',
            tbData: [],
            tableHeader: setting.tableHeader.sxyTag,
            tags: [],
            tag: {id: null, type: null, sort: 1, adderId: null, createTime: null, updateTime: null}
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        /**
         * 编辑或者新增标签
         * 保存完成后更新列表显示
         * 更新tbData和tags中的数据
         */
        saveTag: function(){
            this.showLoading()
            request({
                url: '',
                method: 'post',
                data: qs.stringify(this.tag)
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.reload()
                    }else{
                        this.alert(rst.data.message || '保存标签失败')
                    }
                }else{
                    this.alert('保存标签失败')
                }
            }).catch(e => {
                this.alert('保存标签失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadTBData: function(){
            this.showLoading()
            request({
                url: '',
                method: 'get',
                params: {}
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.createTBData(rst.data.data)
                    }else{
                        this.alert(rst.data.message || '加载标签列表失败')
                    }
                }else{
                    this.alert('加载标签列表失败')
                }
            }).catch(e => {
                this.alert('加载标签列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.tags = dt.data || []
            const tbData = []
            const fields = ['tagName', 'type', 'sort', 'adderId', 'createTime', 'updateTime']
            for(let dix = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || '--')
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        editTag: function(idx){
            this.tag = this.tags[idx]
            this.showTagEditor = true
            this.$parent.subTitle2 = '编辑标签'
        },
        addTag: function(){
            this.tag = {id: null, type: null, sort: 1, adderId: null, createTime: null, updateTime: null}
            this.showTagEditor = true
            this.$parent.subTitle2 = '新增标签'
        },
        cancelEditTag: function(){
            this.showTagEditor = false
        },
        delTag: function(idx){
            this.showLoading()
            request({
                url: '',
                method: 'get',
                params: {
                    tagId: this.tags[idx]['id']
                }
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.tbData.splice(idx, 1)
                        this.tags.splice(idx, 1)
                    }else{
                        this.alert(rst.data.message || '删除标签失败')
                    }
                }else{
                    this.alert('删除标签失败')
                }
            }).catch(e => {
                this.alert('删除标签失败')
            }).then(() => {
                this.hideLoading()
            })
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>