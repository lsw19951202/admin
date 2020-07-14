<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showMaterialLabelEditor">
            <header class="search-header" v-show="showHeader">
                <button class="action-btn" v-show="showAddBtn" @click="addMaterialLabel">新增</button>
            </header>
            <div :class="'table-container hideScrollBar marginBottom0' + (showHeader ? '' : ' marginTop0')">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @editMaterialLabelClicked="editLabel" @delMaterialLabelClicked="changeLabelStatus" @pubMaterialLabelClicked="changeLabelStatus"></detail-table>
            </div>
        </div>
        <confirm :isShow="showConfirm" :confirmParams="confirmParams" @confirmClicked="confirmClicked"></confirm>
        <div :class="'change-result' + (changeResult ? ' succ' : ' fail')" v-if="showChangeResult">
            <div class="img">
                <img :src="changeResult ? require('@/assets/result_fail.png') : require('@/assets/result_succ.png')">
            </div>
            <div class="txt">{{changeResultTxt}}</div>
        </div>
        <material-label-editor :editable="editable" :materialLabel="materialLabel" @cancelEdit="cancelEdit" @saveMaterialLabel="saveMaterialLabel" v-show="showMaterialLabelEditor"></material-label-editor>
    </div>
</template>
<script>
import Setting from '../setting'
import DetailTable from '@/components/content/table.vue'
import confirmVue from '../components/common/confirm.vue'
import request from '@/axios'
import qs from 'qs'
import materialLabelEditorVue from '../components/content/materialLabelEditor.vue'

export default {
    inject: ['reload', 'loadFields', 'loadTBData', 'showLoading', 'hideLoading', 'alert'],
    components: {
        'detail-table': DetailTable,
        'confirm': confirmVue,
        'material-label-editor': materialLabelEditorVue
    },
    created(){
        this.showLoading()
        return Promise.all([
            this.loadFields(Setting.urls.appFields, { 'field_type': 'labelList' }),
            this.loadTBData(Setting.urls.materialLabelList, {})
        ]).then(rst => {
            const tableHeader = rst[0].tableHeader
            tableHeader[0].splice(0, 0, { name: '序号' })
            tableHeader[0].push({ name: '操作' })
            this.tableHeader = tableHeader
            this.fields = rst[0].fields
            this.showAddBtn = rst[1].actions['material_label_add'] == 'T'
            this.tbData = this.createTBData(rst[1].data || [])
            this.materials = rst[1].data || []
        }).catch(e => {
            this.alert('加载标签数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    data(){
        return {
            showAddBtn: false,
            showMaterialLabelEditor: false,
            tbType: 'materialLabel',
            tbData: [],
            tableHeader: [],
            fields: [],
            materials: [],
            materialLabel: {},
            confirmParams: {
                type: 'modifyStatus',
                header: '操作提示',
                text: '',
                idx: 0
            },
            showConfirm: false,
            showChangeResult: false,
            changeResult: true,
            changeResultTxt: '启用成功',
            editable: true
        }
    },
    computed: {
        showHeader(){
            return this.showAddBtn
        }
    },
    methods: {
        saveMaterialLabel(dt){
            console.log('save')
            console.log(dt)
            console.log(this.materialLabel)
            let url = ''
            const requestParams = {}
            if(dt){
                // 编辑
                url = Setting.urls.materialLabelEdit
                requestParams['label_id'] = dt['dic_id']
                requestParams['label_name'] = dt['label_name'] || this.materialLabel['enum_item_name']
                requestParams['sort'] = dt['sort'] || this.materialLabel['sort']
            }else{
                // 新增
                url = Setting.urls.materialLabelAdd
                requestParams['label_name'] = this.materialLabel['enum_item_name']
                requestParams['sort'] = this.materialLabel['sort']
            }
            return request({
                url,
                method: 'post',
                data: qs.stringify(requestParams)
            }).then(rst => {
                if(rst.status == '200'){
                    if(rst.data.code == 200){
                        this.changeResult = true
                        this.showChangeResult = true
                        this.changeResultTxt = dt ? '修改标签成功' : '添加标签成功'
                        setTimeout(() => {
                            this.showChangeResult = false
                        }, 2990)
                        this.loadTBData(Setting.urls.materialLabelList, {}, 'get')
                            .then(rst => {
                                this.materials = rst.data || []
                                this.tbData = Object.assign([], this.createTBData(rst.data || []))
                                this.showMaterialLabelEditor = false
                            }).catch(e => {
                                this.alert('加载标签列表失败')
                                console.log(e)
                            })
                    }else{
                        this.changeResult = false
                        this.showChangeResult = true
                        this.changeResultTxt = dt ? '修改标签失败' : '添加标签失败'
                        setTimeout(() => {
                            this.showChangeResult = false
                        }, 2990)
                    }
                }else{
                    this.changeResult = false
                    this.showChangeResult = true
                    this.changeResultTxt = dt ? '修改标签失败' : '添加标签失败'
                    setTimeout(() => {
                        this.showChangeResult = false
                    }, 2990)
                }
            }).catch(e => {
                this.changeResult = false
                this.showChangeResult = true
                this.changeResultTxt = dt ? '修改标签失败' : '添加标签失败'
                setTimeout(() => {
                    this.showChangeResult = false
                }, 2990)
            })
        },
        cancelEdit(){
            this.showMaterialLabelEditor = false
        },
        addMaterialLabel(){
            console.log('add')
            this.materialLabel = {}
            this.showMaterialLabelEditor = true
        },
        createTBData(data){
            const tbData = []
            for(let idx = 0; idx < data.length; idx++){
                const item = data[idx]
                tbData.push([(idx < 9 ? '0' : '') + (idx + 1)])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push(item[this.fields[idxx]] || '--')
                }
                tbData[idx].push({
                    'material_label_edit': item['material_label_edit'] || 'F',
                    'material_label_status': item['material_label_status'] || 'F',
                    'label_open_status': item['label_open_status'] || 'F',
                    'label_close_status': item['label_close_status'] || 'F'
                })
            }
            return tbData
        },
        changeLabelStatus(idx){
            console.log(idx)
            console.log(this.materials[idx])
            console.log('修改状态为' + (this.materials[idx]['status'] == 0 ? '禁用' : '启用'))
            this.confirmParams.idx = idx
            if(this.materials[idx]['status'] == 0){
                this.confirmParams.text = '是否要隐藏该标签'
            }else if(this.materials[idx]['status'] == 1){
                this.confirmParams.text = '是否要启用该标签'
            }
            this.showConfirm = true
        },
        editLabel(idx){
            console.log('编辑' + idx)
            this.materialLabel = this.materials[idx]
            this.showMaterialLabelEditor = true
        },
        confirmClicked(dt){
            this.showConfirm = false
            if(dt){
                const originStatu = this.materials[dt.idx]['status']
                request({
                    url: Setting.urls.materialLabelStatu,
                    method: 'post',
                    data: qs.stringify({
                        'label_id': this.materials[dt.idx]['dic_id'],
                        'label_status': this.materials[dt.idx]['status'] == 1 ? 1 : 2
                    })
                }).then(rst => {
                    if(rst.status == 200){
                        if(rst.data.code == 200){
                            this.changeResult = true
                            this.showChangeResult = true
                            this.changeResultTxt = originStatu == 0 ? '隐藏成功' : '启用成功'
                            setTimeout(() => {
                                this.showChangeResult = false
                            }, 2990)
                            return this.loadTBData(Setting.urls.materialLabelList, {}, 'get').then(rst => {
                                this.materials = rst.data || []
                                this.tbData = Object.assign([], this.createTBData(rst.data || []))
                            }).catch(e => {
                                this.alert('加载标签列表失败')
                                console.log(e)
                            })
                        }else{
                            // this.alert(rst.data.message || '修改标签状态失败')
                            this.changeResult = false
                            this.showChangeResult = true
                            this.changeResultTxt = originStatu == 0 ? '隐藏失败' : '启用失败'
                            setTimeout(() => {
                                this.showChangeResult = false
                            }, 2990)
                        }
                    }else{
                        // this.alert('修改标签状态失败')
                        this.changeResult = false
                        this.showChangeResult = true
                        this.changeResultTxt = originStatu == 0 ? '隐藏失败' : '启用失败'
                        setTimeout(() => {
                            this.showChangeResult = false
                        }, 2990)
                    }
                }).catch(e => {
                    // this.alert('修改标签状态失败')
                    this.changeResult = false
                    this.showChangeResult = true
                    this.changeResultTxt = originStatu == 0 ? '隐藏失败' : '启用失败'
                    setTimeout(() => {
                        this.showChangeResult = false
                    }, 2990)
                })
            }
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
.table-container.marginTop0 { margin-top: 0; }
.table-container.marginBottom0 { margin-bottom: 0; }
.change-result { width: 200px; height: 46px; line-height: 46px; display: flex; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); box-sizing: border-box; font-size: 20px; padding-left: 20px; animation: changeResult 3s; }
.change-result.succ { border: 1px solid #1296db; color: #1296db; }
.change-result.fail { border: 1px solid #d81e06; color: #d81e06; }
.change-result .img { width: 24px; height: 44px; box-sizing: border-box; padding-top: 4px; margin-right: 12px; }
.change-result .img img { width: 24px; height: 24px; }
@keyframes changeResult {
    0% { opacity: 1; }
    50% { opacity: 1; }
    100% { opacity: .3; }
}
</style>