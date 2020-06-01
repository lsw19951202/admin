<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showTagEditor">
            <header class="search-header">
                <button class="action-btn" @click="addTag" v-if="showAddTagBtn">新建</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @editTagClicked="editTag" @delTagClicked="changeTagStatus" @pubTagClicked="changeTagStatus"></detail-table>
            </div>
        </div>
        <tag-editor v-if="showTagEditor" :tag="tag" @saveTag="saveTag" @cancelEditTag="cancelEditTag"></tag-editor>
        <confirm @confirmClicked="confirmClicked" :isShow="showConfirm" :confirmParams="confirmParams"></confirm>
    </div>
</template>
<script>
import request from '@/axios'
import qs from 'qs'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import TagEditor from '@/components/content/tagEditor.vue'
import confirmVue from '../components/common/confirm.vue'

export default {
    inject: ['alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData', 'reload'],
    components: {
        'detail-table': DetailTable,
        'tag-editor': TagEditor,
        'confirm': confirmVue
    },
    data: () => {
        return {
            showAddTagBtn: false,
            showTagEditor: false,
            tbType: 'tagList',
            tbData: [],
            tableHeader: setting.tableHeader.sxyTag,
            tags: [],
            tag: {'dic_id': null, 'enum_item_name': null, 'enum_item_value': null, sort: null, status: null, 'dictionary_type': null, 'create_user_id': null, 'create_time': null, 'updater_user_id': null, 'update_time': null, 'dictionary_name': null, 'update_user_name': null, 'create_user_name': null, 'dictionary_status': null, 'label_edit': null, 'label_status': null, 'label_open_status': null, 'label_close_status': null},
            fields: [],
            confirmParams: {
                type: 'modifyStatus',
                header: '操作提示',
                text: '确定修改标签状态?',
                idx: 0
            },
            showConfirm: false
        }
    },
    created: function(){
        this.showLoading()
        return Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'labelList' }),
            this.loadTBData(setting.urls.collegeLabellist, {}, 'get')
        ]).then(rst => {
            const tableHeader = rst[0].tableHeader
            tableHeader[0].push({name: '操作'})

            this.tableHeader = rst[0].tableHeader
            this.fields = rst[0].fields

            this.createTBData(rst[1])
        }).catch(e => {
            this.alert('加载标签数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        /**
         * 编辑或者新增标签
         * 保存完成后更新列表显示
         * 更新tbData和tags中的数据
         */
        saveTag: function(dt){
            this.showLoading()
            let url = '', data = ''
            if(this.tag['dic_id']){
                url = setting.urls.collegeLabelEdit
                data = qs.stringify({
                    'label_id': this.tag.dic_id,
                    'label_name': dt.tagName,
                    'sort': dt.sort
                })
            }else{
                url = setting.urls.collegeLabelAdd
                data = qs.stringify({
                    'label_name': this.tag.enum_item_name,
                    'label_type': this.tag.dictionary_type,
                    'sort': this.tag.sort
                })
            }
            request({
                url,
                method: 'post',
                data
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.showTagEditor = false
                        this.loadTBData(setting.urls.collegeLabellist, {}, 'get').then(rst => {
                            this.createTBData(rst)
                            this.$parent.subTitle2 = ''
                        }).catch(e => {
                            this.alert('加载标签列表失败')
                        })
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
        createTBData: function(dt){
            this.showAddTagBtn = (dt.actions && dt.actions['label_add'] == 'T') || false

            this.tags = dt.data || []
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push(item[this.fields[idxx]] || '--')
                }
                tbData[idx].push({
                    'label_edit': item['label_edit'] || 'F',
                    'label_status': item['label_status'] || 'F',
                    'label_open_status': item['label_open_status'] || 'F',
                    'label_close_status': item['label_close_status'] || 'F'
                })
            }
            this.tbData = Object.assign([], tbData)
        },
        editTag: function(idx){
            this.tag = this.tags[idx]
            this.showTagEditor = true
            this.$parent.subTitle2 = '编辑标签'
        },
        addTag: function(){
            this.tag = {'dic_id': null, 'enum_item_name': null, 'enum_item_value': null, sort: null, status: null, 'dictionary_type': null, 'create_user_id': null, 'create_time': null, 'updater_user_id': null, 'update_time': null, 'dictionary_name': null, 'update_user_name': null, 'create_user_name': null, 'dictionary_status': null, 'label_edit': null, 'label_status': null, 'label_open_status': null, 'label_close_status': null}
            this.showTagEditor = true
            this.$parent.subTitle2 = '新增标签'
        },
        cancelEditTag: function(){
            this.showTagEditor = false
            this.$parent.subTitle2 = ''
        },
        confirmClicked: function(dt){
            this.showConfirm = false
            if(dt){
                this.showLoading()
                request({
                    url: setting.urls.collegeLabelStatus,
                    method: 'post',
                    data: qs.stringify({
                        'label_id': this.tags[dt.idx]['dic_id'],
                        'label_status': this.tags[dt.idx]['status'] == 1 ? 1 : 2
                    })
                }).then(rst => {
                    if(rst.status == 200){
                        if(rst.data.code == 200){
                            this.loadTBData(setting.urls.collegeLabellist, {}, 'get').then(rst => {
                                this.createTBData(rst)
                            }).catch(e => {
                                this.alert('加载标签列表失败')
                            })
                        }else{
                            this.alert(rst.data.message || '修改标签状态失败')
                        }
                    }else{
                        this.alert('修改标签状态失败')
                    }
                }).catch(e => {
                    this.alert('修改标签状态失败')
                }).then(() => {
                    this.hideLoading()
                })
            }
        },
        changeTagStatus: function(idx){
            this.confirmParams.idx = idx
            if(this.tags[idx]['status'] == 0){
                this.confirmParams.text = '是否确认禁用标签?'
            }else if(this.tags[idx]['status'] == 1){
                this.confirmParams.text = '是否确认启用标签?'
            }
            this.showConfirm = true
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>