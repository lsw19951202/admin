<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showEditor">
            <header class="search-header">
                <div class="search-group">
                    <label>商品ID</label>
                    <input type="text" placeholder="请输入" v-model="goods_id">
                </div>
                <selector class="search-group" :value="module" :selectParams="moduleSelectParams" @selectOptsClicked="moduleOptsClicked"></selector>
                <selector class="search-group" :value="status" :selectParams="statusSelectParams" @selectOptsClicked="statusOptsClicked"></selector>
                <button class="action-btn" @click="loadGoods(1)">搜索</button>
                <button class="action-btn" v-show="showAddBtn" @click="addGood">新增</button>
                <button class="action-btn" v-show="showImportBtn" @click="importGoods">批量导入</button>
                <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                    <input type="file" ref="excelIpt" @change="uploadExcel" accept=".xls, .xlsx" name="file">
                </form>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @pubBtnClicked="changeDirectStatus" @editBtnClicked="editDirect"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadGoods"></page>
        </div>
        <confirm @confirmClicked="confirmClicked" :isShow="showConfirm" :confirmParams="confirmParams"></confirm>
        <direct-editor :direct="direct" v-if="showEditor" @saveDirect="saveDirect" @cancelEdit="cancelEdit"></direct-editor>
    </div>
</template>
<script>
import Setting from '@/setting'
import selectVue from '../components/common/select.vue'
import request from '../axios'
import qs from 'qs'
import tableVue from '../components/content/table.vue'
import confirmVue from '../components/common/confirm.vue'
import pageVue from '../components/content/page.vue'
import directEditorVue from './directEditor.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'selector': selectVue,
        'detail-table': tableVue,
        'confirm': confirmVue,
        'page': pageVue,
        'direct-editor': directEditorVue
    },
    data(){
        return {
            showAddBtn: false,
            showImportBtn: false,
            showConfirm: false,
            confirmParams: {
                type: 'modifyStatus',
                header: '操作提示',
                text: '确定修改商品状态?',
                idx: 0
            },
            tbType: 'directList',
            tbData: [],
            tableHeader: [],
            'goods_id': '',
            showEditor: false,
            module: '',
            status: '',
            moduleSelectParams: {
                label: '模块',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 1,
                    text: '搜索'
                }]
            },
            statusSelectParams: {
                label: '状态',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 0,
                    text: '待发布'
                }, {
                    value: 1,
                    text: '发布中'
                }, {
                    value: 2,
                    text: '已下架'
                }]
            },
            fields: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            directList: null,
            direct: null
        }
    },
    created(){
        this.showLoading()
        return Promise.all([
            this.loadFields(Setting.urls.appFields, { 'field_type': 'directedList' }),
            this.loadTBData(Setting.urls.directList, { page: 1 }, 'get')
        ]).then(rst => {
            console.log(rst)
            const tableHeader = rst[0].tableHeader
            tableHeader[0].push({name: '操作'})
            this.tableHeader = tableHeader
            this.fields = rst[0].fields
            this.tbData = this.createTBData(rst[1])
            this.showAddBtn = rst[1]['actions']['directed_add']
            this.showImportBtn = rst[1]['actions']['directed_import']
        }).catch(e => {
            console.log(e)
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        saveDirect(dt){
            console.log(dt)
            console.log(this.direct)
            this.showEditor = false
            this.showLoading()
            const requestParams = {
                'goods_id': dt.goods_id,
                module: dt.module,
                'directed_tkrates': dt.directed_tkrates,
                'coupon_url': dt.coupon_url,
                'directed_couponmoney': dt.directed_couponmoney,
                'receive_starttime': dt.receive_starttime,
                'receive_endtime': dt.receive_endtime,
                'use_starttime': dt.use_starttime,
                'use_endtime': dt.use_endtime
            }
            request({
                url: Setting.urls.editDirect,
                method: 'post',
                data: qs.stringify(requestParams)
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadGoods(this.pageData.page || 1)
                }else{
                    this.alert('保存定向商品失败')
                }
            }).catch(e => {
                this.alert('保存定向商品失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        cancelEdit(){
            this.showEditor = false
        },
        moduleOptsClicked(dt){
            this.module = dt
        },
        statusOptsClicked(dt){
            this.status = dt
        },
        addGood(){
            console.log('新增')
            this.direct = {}
            this.showEditor = true
        },
        importGoods(){
            console.log('导入')
            this.$refs.excelIpt.click()
        },
        uploadExcel(){
            this.showLoading()
            const formData = new FormData(this.$refs.fileForm)
            request({
                url: Setting.urls.importDirect,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.status = ''
                    this.module = ''
                    this.$data['goods_id'] = ''
                    this.loadGoods(1)
                }else{
                    this.alert('上传文件失败')
                }
            }).catch(e => {
                this.alert('上传文件失败')
            }).then(() => {
                this.hideLoading()
                this.$refs.excelIpt.value = ''
            })
        },
        changeDirectStatus(idx){
            console.log('修改状态:' + idx)
            this.confirmParams.idx = idx
            if(this.directList[idx].status == '发布中'){
                this.confirmParams.text = '是否确定要下架该商品?'
            }else if(this.directList[idx].status == '待发布'){
                this.confirmParams.text = '是否确定要发布该商品?'
            }
            this.showConfirm = true
        },
        editDirect(idx){
            console.log('编辑:' + idx)
            this.direct = this.directList[idx]
            this.showEditor = true
        },
        confirmClicked(dt){
            this.showConfirm = false
            if(dt){
                this.showLoading()
                request({
                    url: Setting.urls.directStatu,
                    method: 'post',
                    data: qs.stringify({
                        ids: this.directList[dt.idx].id,
                        type: this.directList[dt.idx].status == '发布中' ? 'off' : 'open'
                    })
                }).then(rst => {
                    if(rst.status == 200){
                        if(rst.data.code == 200){
                            this.loadGoods(this.pageData.page || 1)
                        }else{
                            this.alert(rst.data.message || '修改定向商品状态失败')
                        }
                    }else{
                        this.alert('修改定向商品状态失败')
                    }
                }).catch(e => {
                    this.alert('修改定向商品状态失败')
                }).then(() => {
                    this.hideLoading()
                })
            }
        },
        createTBData(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            this.directList = dt.data || []

            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    if(this.fields[idxx] == 'tkrates' || this.fields[idxx] == 'directed_tkrates'){
                        tbData[idx].push((item[this.fields[idxx]] || 0) + '%')
                    }else{
                        tbData[idx].push(item[this.fields[idxx]] || (item[this.fields[idxx]] == 0 ? 0 : '--'))
                    }
                }
                tbData[idx].push({
                    'directed_operate': item['directed_operate'] || 'F',
                    'directed_edit': item['directed_edit'] || 'F',
                    'status': item['status']
                })
            }
            return tbData
        },
        loadGoods(page){
            this.showLoading()
            this.loadTBData(Setting.urls.directList, { page: page || 1, 'goods_id': this.$data['goods_id'], module: this.module, status: this.status }, 'get')
                .then(rst => {
                    this.tbData = this.createTBData(rst)
                }).catch(e => {
                    console.log(e)
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