<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>商品名称:</label>
                    <input type="text" placeholder="请输入" v-model="goodsTitle">
                </div>
                <div class="search-group">
                    <label>商品ID:</label>
                    <input type="text" placeholder="请输入" v-model="goodsId">
                </div>
                <selector class="search-group" :selectParams="selectParams" @selectOptsClicked="selectOptsClicked" :value="platform"></selector>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                </div>
                <button class="action-btn" @click="clearCheckedGoodsAndLoadData">搜索</button>
                <a class="action-btn" style="display: inline-block;" :href="downloadUrl" :download="createTimeBegin + '.xlsx'">导出全部</a>
                <a class="action-btn" style="display: inline-block;" @click.prevent.stop="selectExcel">导入</a>
                <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                    <input type="file" ref="excelIpt" @change="uploadExcel" accept=".xls, .xlsx" name="file">
                </form>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbData="tbData" :checkedArray="checkedGoods" :tbType="tbType" :tableHeader="tableHeader" @changeCheckStatus="changeCheckStatus"></detail-table>
            </div>
            <div class="page-footer" style="display: flex;">
                <div style="margin-top: .3rem; height: .875rem; line-height: .875rem;">
                    <input @click="changeAllGoodsCheckStatu($event)" type="checkbox" :checked="allGoodsChecked" style="margin-left: 1rem;" id="checkAllGoods">
                    <label for="checkAllGoods" style="font-size: .375rem; color: #666666; display: inline-block; height: 100%; line-height: 1rem; margin-left: .3125rem; vertical-align: top;">全选</label>
                    <button class="action-btn" @click="exportCheckedGoods">导出</button>
                    <a class="action-btn" style="display: none;" ref="exportXlsx">导出</a>
                </div>
                <page style="width: 0; flex: 1;" :pageData="pageData" @loadList="loadTBData"></page>
            </div>
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import setting from '@/setting'
import Selector from '@/components/common/select.vue'
import DetailTable from '@/components/content/table.vue'
import Page from '@/components/content/page.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'selector': Selector,
        'detail-table': DetailTable,
        'page': Page
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            goodsTitle: '',
            platform: '',
            goodsId: '',
            tbType: 'orderSalesList',
            tbData: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            selectParams: {
                label: '下单平台',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 'jd',
                    text: '京东'
                }, {
                    value: 'pdd',
                    text: '拼多多'
                }, {
                    value: 'tb',
                    text: '淘宝'
                }, {
                    value: 'elm',
                    text: '饿了么'
                }, {
                    value: 'mt',
                    text: '美团'
                }]
            },
            createTimeBegin: nStr,
            createTimeEnd: nStr,
            tableHeader: setting.tableHeader.orderSalesList,
            // 所有被选中的商品的ID
            checkedGoods: []
        }
    },
    created: function(){
        this.loadTBData()
    },
    computed: {
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.appSaleRank + '?goodsTitle=' + this.goodsTitle + '&goodsId=' + this.goodsId + '&platform=' + this.platform
                + '&page=' + this.pageData.page + '&createTimeBegin=' + this.createTimeBegin + '&is_excel=1&skey=' + this.$cookies.get('skey')
                + '&createTimeEnd=' + this.createTimeEnd
        },
        allGoodsChecked: function(){
            let flag = true
            for(let idx = 0; idx < this.tbData.length; idx++){
                if(this.tbData[idx][0] != '--' && this.checkedGoods.indexOf(this.tbData[idx][0]) == -1){
                    flag = false
                    break
                }
            }
            return flag
        }
    },
    methods: {
        selectExcel(){
            this.$refs.excelIpt.click()
        },
        uploadExcel: function(){
            this.showLoading()
            const formData = new FormData(this.$refs.fileForm)
            request({
                url: setting.urls.appSaleRank,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(resp => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        // do nothing
                        // this.alert('提现日志上传成功')
                        // this.createTBData(resp.data.data)
                        this.loadTBData(1)
                    }else{
                        this.alert(resp.data.message || '上传文件失败')
                    }
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
        exportCheckedGoods: function(){
            if(this.checkedGoods.length == 0){
                this.alert('请先选择要导出的商品')
                return
            }
            this.showLoading()
            request({
                url: setting.urls.appSaleRank,
                method: 'get',
                responseType: 'blob',
                params: {
                    goodsTitle: this.goodsTitle,
                    goodsId: this.goodsId,
                    platform: this.platform,
                    page: 1,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd,
                    'is_excel': 1,
                    'goods_arr': this.checkedGoods.join(',')
                }
            }).then(rst => {
                if(rst.status == 200){
                    const url = window.URL.createObjectURL(new Blob([rst.data]))
                    const link = this.$refs.exportXlsx
                    link.href = url
                    link.setAttribute('download', '商品列表.xlsx')
                    link.click()
                    this.checkedGoods = Object.assign([])
                }else{
                    this.alert('导出商品列表失败')
                }
            }).catch(e => {
                this.alert('导出商品列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        clearCheckedGoodsAndLoadData: function(){
            this.checkedGoods = Object.assign([])
            this.loadTBData(1)
        },
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: setting.urls.appSaleRank,
                method: 'get',
                params: {
                    page: pageNum || 1,
                    goodsTitle: this.goodsTitle,
                    goodsId: this.goodsId,
                    platform: this.platform,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载商品销量排行列表失败')
                    }
                }else{
                    this.alert('加载商品销量排行列表失败')
                }
            }).catch((error) => {
                this.alert('加载商品销量排行列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            // const plats = {'jd': '京东', 'pdd': '拼多多', 'tb': '淘宝', 'elm': '饿了么', 'mt': '美团'}
            const plats = {}
            const options = [{
                    value: '',
                    text: '请选择'
                }]
            for(let idx = 0; idx < dt.platArr.length; idx++){
                plats[dt.platArr[idx]['plat']] = dt.platArr[idx]['plat_name']
                options.push({
                    value: dt.platArr[idx]['plat'],
                    text: dt.platArr[idx]['plat_name']
                })
            }
            this.selectParams.options = Object.assign([], options)
            const fields = ['goods_id', 'goods_title', 'goods_price', 'sale_num', 'platform', 'plat_commission_amount', 'order_amount']
            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                tbData.push([])
                const item = dt.data[idx]
                for(let idxx = 0; idxx < fields.length; idxx++){
                    let tdText = item[fields[idxx]] || (item[fields[idxx]] == 0 ? item[fields[idxx]] : '--')
                    if(idxx == 4){
                        tdText = plats[tdText] || '--'
                    }
                    tbData[idx].push(tdText)
                }
            }
            console.log(tbData,"处理后的数据+++++++")
            this.tbData = Object.assign([], tbData)
        },
        selectOptsClicked: function(dt){
            this.platform = dt
        },
        changeAllGoodsCheckStatu: function(e){
            console.log(e,"全选")
            const checked = e.target.checked
            for(let idx = 0; idx < this.tbData.length; idx++){
                if(this.tbData[idx][0] != '--'){
                    if(checked){
                        if(this.checkedGoods.indexOf(this.tbData[idx][0]) == -1){
                            this.checkedGoods.push(this.tbData[idx][0])
                        }
                    }else{
                        if(this.checkedGoods.indexOf(this.tbData[idx][0]) >= 0){
                            this.checkedGoods.splice(this.checkedGoods.indexOf(this.tbData[idx][0]), 1)
                        }
                    }
                }
            }
        },
        changeCheckStatus: function(idx){
            if(this.tbData[idx][0] != '--'){
                if(this.checkedGoods.indexOf(this.tbData[idx][0]) >= 0){
                    this.checkedGoods.splice(this.checkedGoods.indexOf(this.tbData[idx][0]), 1)
                }else{
                    this.checkedGoods.push(this.tbData[idx][0])
                }
            }
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
input[type="checkbox"] { position: relative; width: 0.625rem; height: .625rem; }
input[type="checkbox"]::after { background-color: #fff; background-image: url(../assets/check.png); position: absolute; content: ' '; background-repeat: no-repeat; background-position: center center; background-size: 100% 100%; width: 0.625rem; height: 0.625rem; }
input[type="checkbox"]:checked::after { background-image: url(../assets/checked.png); }
</style>