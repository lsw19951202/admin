<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showMaterialEditor">
            <header class="search-header">
                <div class="search-group">
                    <label>关键字:</label>
                    <input type="text" placeholder="请输入" v-model="keyWord">
                </div>
                <selector class="search-group" :value="status" :selectParams="selectParams" @selectOptsClicked="selectOptsClicked"></selector>
                <button class="action-btn" @click="loadTBData(1)">搜索</button>
                <button class="action-btn" @click="addMaterial">新增</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @modifyMaterial="modifyMaterial" @delMaterial="delMaterial" @changeSwitchStatus="changeMaterialStatus"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
        </div>
        <material-editor v-if="showMaterialEditor" :material="material" @saveMaterial="saveMaterial" @cancelEditMaterial="cancelEditMaterial"></material-editor>
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
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'selector': Selector,
        'detail-table': DetailTable,
        'page': page,
        'material-editor': materialEditorVue
    },
    data: () => {
        return {
            showMaterialEditor: false,
            material: {id: null, type: null, keyWord: '', title: '', status: 1, detail: '', imgs: [], adderId: null, uperId: null, updateTime: '', createTime: '', adderName: '', uperName: ''},
            materials: [],
            keyWord: '',
            status: '',
            tbType: 'materialList',
            tbData: [],
            selectParams: {
                label: '素材状态',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 0,
                    text: '停用'
                }, {
                    value: 1,
                    text: '启用'
                }]
            },
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            tableHeader: setting.tableHeader.materialList
        }
    },
    created: function(){
        this.loadTBData()
    },
    provide: function(){
        return {
            removeCurrImage: this.removeImage,
            setImage: this.setImage
        }
    },
    methods: {
        /**
         * 编辑或者新增素材
         * 保存完成后更新列表显示
         * 更新tbData和materials中的数据
         */
        saveMaterial: function(){
            this.material.imgs = this.material.imgs || []
            for(let idx = this.material.imgs.length - 1; idx >= 0; idx--){
                if(!this.material.imgs[idx]){
                    this.material.imgs.splice(idx, 1)
                }
            }
            this.showLoading()
            request({
                url: setting.urls.editMaterial,
                method: 'post',
                data: qs.stringify(this.material)
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        if(this.material.id){
                            for(let idx = 0; idx < this.materials.length; idx++){
                                if(this.materials[idx]['id'] == this.material.id){
                                    this.materials[idx] = this.material
                                    const fields = ['type', 'keyWord', 'title', 'status', 'detail', 'imgs', 'adderName', 'uperName', 'createTime', 'updateTime']
                                    const material = []
                                    material.push((idx < 9 ? '0' : '') + (idx + 1))
                                    for(let idxx = 0; idxx < fields.length; idxx++){
                                        if(fields[idxx] == 'detail'){
                                            let detail = this.material[fields[idxx]] || '--'
                                            while(detail.indexOf('&lt;') >= 0){
                                                detail = detail.replace('&lt;', '<')
                                            }
                                            while(detail.indexOf('&gt;') >= 0){
                                                detail = detail.replace('&gt;', '>')
                                            }
                                            material[idx].push(detail)
                                        }else{
                                            material[idx].push(this.material[fields[idxx]] || '--')
                                        }
                                    }
                                    this.tbData[idx] = material
                                }
                            }
                        }
                        this.showMaterialEditor = false
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
            })
        },
        changeMaterialStatus: function(dt){
            console.log(dt)
            this.showLoading()
            // TODO
            Promise.resolve().then(() => {
                this.tbData[dt.data][4] = dt.status ? 1 : 0
                this.tbData = Object.assign([], this.tbData)
                this.materials[dt.data].status = dt.status ? 1 : 0
                this.hideLoading()
            })
        },
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: setting.urls.materialList,
                method: 'get',
                params: {
                    page: pageNum || 1,
                    status: this.status,
                    keyWord: this.keyWord
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载素材列表失败')
                    }
                }else{
                    this.alert('加载素材列表失败')
                }
            }).catch((error) => {
                this.alert('加载素材列表失败')
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
            const fields = ['type', 'keyWord', 'title', 'status', 'detail', 'imgs', 'adderName', 'uperName', 'createTime', 'updateTime']
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                tbData[idx].push((idx < 9 ? '0' : '') + (idx + 1))
                for(let idxx = 0; idxx < fields.length; idxx++){
                    if(fields[idxx] == 'detail'){
                        let detail = item[fields[idxx]] || '--'
                        while(detail.indexOf('&lt;') >= 0){
                            detail = detail.replace('&lt;', '<')
                        }
                        while(detail.indexOf('&gt;') >= 0){
                            detail = detail.replace('&gt;', '>')
                        }
                        tbData[idx].push(detail)
                    }else{
                        tbData[idx].push(item[fields[idxx]] || '--')
                    }
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        selectOptsClicked: function(dt){
            this.status = dt
        },
        modifyMaterial: function(idx){
            console.log(idx)
            // 如果直接赋值，在编辑界面删除图片时会删除原数据
            const mat = JSON.parse(JSON.stringify(this.materials[idx]))
            this.material = Object.assign({}, mat)
            while(this.material.detail.indexOf('&lt;') >= 0){
                this.material.detail = this.material.detail.replace('&lt;', '<')
            }
            while(this.material.detail.indexOf('&gt;') >= 0){
                this.material.detail = this.material.detail.replace('&gt;', '>')
            }
            this.showMaterialEditor = true
            this.$parent.subTitle2 = '编辑素材'
        },
        delMaterial: function(idx){
            console.log(idx)
            // TODO
            this.tbData.splice(idx , 1)
            this.materials.splice(idx, 1)
            for(let idx = 0; idx < this.tbData.length; idx++){
                this.tbData[idx][0] = (idx < 9 ? '0' : '') + (idx + 1)
            }
        },
        addMaterial: function(){
            console.log('add material')
            this.material = {id: null, type: null, keyWord: '', title: '', status: 1, detail: '', imgs: [], adderId: null, uperId: null, updateTime: '', createTime: '', adderName: '', uperName: ''}
            this.showMaterialEditor = true
            this.$parent.subTitle2 = '新增素材'
        },
        cancelEditMaterial: function(){
            this.showMaterialEditor = false
        },
        /**
         * 删除对应图片，并显示空白
         */
        removeImage: function(idx){
            this.material.imgs.splice(idx, 1, '')
        },
        /**
         * 上传图片成功之后调用，显示上传结果
         */
        setImage: function(dt){
            // this.material.imgs.splice(dt.idx, 1, dt.imgUrl)
            console.log(dt)
            const imgs = this.material.imgs || []
            imgs[dt.idx] = dt.imgUrl
            this.material.imgs = Object.assign([], imgs)
            console.log(this.material)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>