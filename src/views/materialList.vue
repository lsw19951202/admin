<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showMaterialEditor">
            <header class="search-header">
                <div class="search-group">
                    <label>ID:</label>
                    <input type="text" placeholder="请输入" v-model="material_id">
                </div>
                <selector class="search-group" :value="status" :selectParams="selectParams" @selectOptsClicked="selectOptsClicked"></selector>
                <selector class="search-group" :value="dic_id" :selectParams="labelSelectParams" @selectOptsClicked="labelSelectOptsClicked"></selector>
                <button class="action-btn" @click="loadMaterial(1)">搜索</button>
                <button class="action-btn" v-show="showAddBtn" @click="addMaterial">新增</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @delMaterialClicked="delMaterial" @editMaterialClicked="modifyMaterial" @previewBtnClicked="previewMaterial" @pubMaterialClicked="changeMaterialStatus"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadMaterial"></page>
        </div>
        <material-editor v-if="showMaterialEditor" :editable="editable" :materialLabelList="materialLabelList" :material="material" @saveMaterial="saveMaterial" @cancelEditMaterial="cancelEditMaterial"></material-editor>
    </div>
</template>
<script>
import Selector from '@/components/common/select.vue'
import request from '@/axios'
import qs from 'qs'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'
import materialEditorVue from '../components/content/materialEditor.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'selector': Selector,
        'detail-table': DetailTable,
        'page': page,
        'material-editor': materialEditorVue
    },
    data: () => {
        return {
            showAddBtn: false,
            showMaterialEditor: false,
            material: {},
            materials: [],
            'material_id': '',
            status: '',
            'dic_id': '',
            tbType: 'materialList',
            tbData: [],
            labelSelectParams: {
                label: '标签',
                options: [{
                    value: '',
                    text: '请选择'
                }]
            },
            selectParams: {
                label: '发布状态',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 1,
                    text: '可用'
                }, {
                    value: 2,
                    text: '停用'
                }]
            },
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            tableHeader: setting.tableHeader.materialList,
            fields: [],
            editable: false,
            materialLabelList: []
        }
    },
    created: function(){
        this.showLoading()
        return Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'materialList' }, 'get'),
            this.loadTBData(setting.urls.materialList, { page: 1 }, 'get'),
            this.loadTBData(setting.urls.materialLabelList, {}, 'get')
        ]).then(rst => {
            console.log(rst)
            this.fields = rst[0].fields
            const tableHeader = rst[0].tableHeader
            tableHeader[0].push({name: '操作'})
            this.tableHeader = tableHeader
            this.tbData = this.createTBData(rst[1])
            this.showAddBtn = rst[2]['actions']['material_label_add'] == 'T'
            const labelData = rst[2].data || []
            for(let idx = 0; idx < labelData.length; idx++){
                const item = labelData[idx]
                this.labelSelectParams.options.push({
                    value: item['enum_item_value'],
                    text: item['enum_item_name']
                })
                this.materialLabelList.push({
                    value: item['enum_item_value'],
                    text: item['enum_item_name']
                })
            }
        }).catch(e => {
            console.log(e)
        }).then(() => {
            this.hideLoading()
        })
    },
    provide: function(){
        return {
            removeCurrImage: this.removeImage,
            setImage: this.setImage
        }
    },
    methods: {
        loadMaterial(pageNo){
            this.showLoading()
            this.loadTBData(setting.urls.materialList, { page: pageNo || 1, 'material_id': this.$data['material_id'], 'item_value': this.$data['dic_id'], 'material_status': this.status })
                .then(rst => {
                    this.tbData = this.createTBData(rst)
                }).catch(e => {
                    console.log(e)
                }).then(() => {
                    this.hideLoading()
                })
        },
        /**
         * 编辑或者新增素材
         * 保存完成后更新列表显示
         * 更新tbData和materials中的数据
         */
        saveMaterial: function(){
            this.material['image_list'] = this.material['image_list'] || []
            for(let idx = this.material['image_list'].length - 1; idx >= 0; idx--){
                if(!this.material['image_list'][idx]){
                    this.material['image_list'].splice(idx, 1)
                }
            }
            console.log(this.material)
            this.showLoading()
            const requestParams = {
                'material_type': this.material['material_type'],
                'material_detail': this.material['material_detail'],
                'start_time': this.material['start_time'],
                'end_time': this.material['end_time']
            }
            if(this.material['id']){
                requestParams['material_id'] = this.material['id']
            }
            if(this.material['image_list']){
                for(let idx = 0; idx < this.material['image_list'].length; idx++){
                    requestParams['pic_' + (idx + 1)] = this.material['image_list'][idx]
                }
            }
            request({
                url: setting.urls.editMaterial,
                method: 'post',
                data: qs.stringify(requestParams)
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        return this.loadTBData(setting.urls.materialList, { 'material_id': this.$data['material_id'], 'page': this.pageData.page || 1, 'item_value': this.$data['dic_id'], 'material_status': this.status })
                            .then(rst => {
                                this.tbData = this.createTBData(rst)
                            })
                    }else{
                        this.alert(resp.data.message || '保存素材失败')
                    }
                }else{
                    this.alert('保存素材失败')
                }
            }).catch((e) => {
                this.alert('保存素材失败')
            }).then(() => {
                this.hideLoading()
                this.showMaterialEditor = false
            })
        },
        changeMaterialStatus: function(dt){
            console.log(dt)
            this.showLoading()
            request({
                url: setting.urls.changeMaterialStatu,
                params: {
                    'material_id': this.materials[dt].id,
                    'material_status': this.materials[dt]['material_status'] == 0 ? 1 : 2
                },
                method: 'get'
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.materials[dt]['material_status'] = this.materials[dt]['material_status'] == 0 ? 1: 0
                        this.tbData[dt][4] = this.materials[dt]['material_status'] == 0 ? '隐藏' : '显示'
                        this.tbData[dt][9]['material_close'] = this.materials[dt]['material_status'] == 0 ? 'F' : 'T'
                        this.tbData[dt][9]['material_open'] = this.materials[dt]['material_status'] == 0 ? 'T' : 'F'
                        this.tbData[dt][9]['material_status'] = this.materials[dt]['material_status']
                        this.tbData[dt][9]['material_edit'] = this.materials[dt]['material_status'] == 0 ? 'T' : 'F'
                    }else{
                        this.alert(rst.data.message || '修改素材发布状态失败')
                    }
                }else{
                    this.alert('修改素材发布状态失败')
                }
            }).catch(e => {
                this.alert('修改素材发布状态失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            this.materials = dt.data || []
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    if(this.fields[idxx] == 'material_detail'){
                        let detail = item[this.fields[idxx]] || '--'
                        while(detail.indexOf('&lt;') >= 0){
                            detail = detail.replace('&lt;', '<')
                        }
                        while(detail.indexOf('&gt;') >= 0){
                            detail = detail.replace('&gt;', '>')
                        }
                        tbData[idx].push(detail)
                    }else{
                        tbData[idx].push(item[this.fields[idxx]] || '--')
                    }
                }
                tbData[idx].push({
                    'material_edit': item['material_edit'],
                    'material_open': item['material_open'],
                    'material_close': item['material_close'],
                    'material_status': item['material_status']
                })
            }
            return tbData
        },
        selectOptsClicked: function(dt){
            this.status = dt
        },
        labelSelectOptsClicked: function(dt){
            this.$data['dic_id'] = dt
        },
        modifyMaterial: function(idx){
            console.log(idx)
            // 如果直接赋值，在编辑界面删除图片时会删除原数据
            const mat = JSON.parse(JSON.stringify(this.materials[idx]))
            this.material = Object.assign({}, mat)
            while(this.material && this.material.detail && this.material.detail.indexOf('&lt;') >= 0){
                this.material.detail = this.material.detail.replace('&lt;', '<')
            }
            while(this.material && this.material.detail && this.material.detail.indexOf('&gt;') >= 0){
                this.material.detail = this.material.detail.replace('&gt;', '>')
            }
            this.showMaterialEditor = true
            this.$parent.subTitle2 = '编辑素材'
            this.editable = true
        },
        previewMaterial(idx){
            console.log('preview : ' + idx)
            this.modifyMaterial(idx)
            this.editable = false
        },
        delMaterial: function(idx){
            console.log('del : ' + idx)
        },
        addMaterial: function(){
            console.log('add material')
            this.material = { 'material_type': null, 'material_detail': '', 'image_list': [] }
            this.showMaterialEditor = true
            this.$parent.subTitle2 = '新增素材'
            this.editable = true
        },
        cancelEditMaterial: function(){
            this.showMaterialEditor = false
        },
        /**
         * 删除对应图片，并显示空白
         */
        removeImage: function(idx){
            this.material['image_list'].splice(idx, 1, '')
        },
        /**
         * 上传图片成功之后调用，显示上传结果
         */
        setImage: function(dt){
            console.log(dt)
            const imgs = this.material['image_list'] || []
            imgs[dt.idx] = dt.imgUrl
            this.material['image_list'] = Object.assign([], imgs)
            console.log(this.material)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>