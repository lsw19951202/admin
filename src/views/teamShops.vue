<template>
    <div class="detail-data-box">
        <header class="search-header">
            <div class="search-group arrow">
                <label>收入排序:</label>
                <select name="" id="" class="selectOption" :value='rankSort' @change="ranSortEvent">
                    <option value="0">全部</option>
                    <option value="1">升序</option>
                    <option value="2">降序</option>
                </select>
            </div>
            <div class="search-group arrow">
                <label>订单数排序:</label>
                <select name="" id="" class="selectOption" :value='numSort' @change="numSortEvent">
                    <option value="0">全部</option>
                    <option value="1">升序</option>
                    <option value="2">降序</option>
                </select>
            </div>
            <div class="search-group arrow">
                <label>下单平台:</label>
                <select name="" id="" class="selectOption" v-if="platFromArr" @change="platFromEvent">
                    <option value="0">全部</option>
                    <option :value="item.plat" v-for="(item,index) in platFromArr" :key="index">{{item.plat_name}}</option>
                </select>
            </div>
            <div class="search-group">
                <label>日期筛选:</label>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                <div class="split-line">
                    <div></div>
                </div>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
            </div>
            <button class="action-btn" @click="searchEvent">搜索</button>
        </header>
        <div class="table-container hideScrollBar">
            <table v-if="tableTbody">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="(item,index) in tableHead" :key="index">{{item.name}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,key,index) in tableTbody" :key="index">
                        <td style="width: 2.5625rem; text-align: center;">
                            <input type="checkbox" @click="singleStatus(key)" :checked="item.goods_id != '--' && chooseGoods.indexOf(item.goods_id) >= 0">
                        </td>
                        <td v-for="(val,index) in tableHead" :key="index">
                            <div v-if="item[val.field]=='tb'">淘宝</div>
                            <div v-else-if="item[val.field]=='pdd'">拼多多</div>
                            <div v-else-if="item[val.field]=='jd'">京东</div>
                            <div v-else-if="item[val.field]=='elm'">饿了么</div>
                            <div v-else-if="item[val.field]=='mt'">美团</div>
                            <div v-else-if="item[val.field]=='wph'">唯品会</div>
                            <div v-else-if="item[val.field]=='jy'">团油</div>
                            <div v-else-if="item[val.field]=='kdj'">肯德基</div>
                            <div v-else-if="item[val.field]=='mthb'">美团红包</div>
                            <div v-else>{{item[val.field]}}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-footer" style="display: flex;">
            <div style="margin-top: .3rem; height: .875rem; line-height: .875rem;">
                <input @click="chooseAllStatus($event)" type="checkbox" :checked="allGoodsChecked" style="margin-left: 1rem;" id="checkAllGoods">
                <label for="checkAllGoods" style="font-size: .375rem; color: #666666; display: inline-block; height: 100%; line-height: 1rem; margin-left: .3125rem; vertical-align: top;">全选</label>
                <button class="action-btn" @click="exportFile">导出</button>
                <a class="action-btn" style="display: none;" ref="exportXlsx">导出</a>
            </div>
            <page style="width: 0; flex: 1;" :pageData="pageData" @loadList="getTableHead"></page>
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import setting from '@/setting'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import page from '../components/content/page.vue'

export default {
    props:['teamId'],
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'page':page
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
            createTimeBegin: nStr,
            createTimeEnd: nStr,
            tableHead:[],
            tableTbody:[],
            platFromArr:[],//下单平台下拉选择
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            rankSort:2,// 收入排序  0全部 1升序 2降序
            numSort:0,// 单数排序  0全部 1升序 2降序
            platFromSe:'',
            chooseGoods:[],//所有被选中的商品ID
        }
    },
    created(){
        this.$nextTick(()=>{
            this.getTableHead();//表头请求
        })
    },
    computed:{
        allGoodsChecked: function(){
            let flag = true
            for(let idx = 0; idx < this.tableTbody.length; idx++){
                if(this.tableTbody[idx].goods_id != '--' && this.chooseGoods.indexOf(this.tableTbody[idx].goods_id) == -1){
                    flag = false
                    break
                }
            }
            return flag
        }
    },
    methods: {
        getTableHead(pageNum){//表头请求
            this.showLoading()
            request({
                url:setting.urls.teamHeader,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"表头")
                if(res.status == 200){
                    if(res.data.code == 200){
                        this.tableHead = res.data.data;
                        this.getTableTbody(pageNum)
                    }
                }
            }).catch((error) => {
                this.alert('加载表头失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        getTableTbody(pageNum){//团队商品列表
            this.showLoading()
            request({
                url:setting.urls.appSaleRank,
                method:'get',
                params:{
                    page: pageNum || 1,
                    platform:this.platFromSe,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd,
                    'team_id':this.teamId,
                    'num_sort':this.numSort,
                    'income_sort':this.rankSort,
                }
            }).then(res=>{
                console.log(res,"团队常购商品")
                if(res.status == 200){
                    if(res.data.code == 200){
                        const rest = res.data.data
                        if(rest.data.length <= 0){
                            this.alert('团购商品列表暂无数据')
                        }
                        this.pageData.total = rest.total;
                        this.pageData.page = rest.page;
                        this.pageData['total_page'] = rest.pageCount;
                        this.platFromArr = rest.platArr;
                        this.tableTbody = rest.data;
                    }
                }
            }).catch((error) => {
                this.alert('加载团购商品列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        ranSortEvent(e){//收入排序事件
            const val = e.target.value;
            if(val != 0){
                this.numSort = 0
            }
            this.rankSort = val;
        },
        numSortEvent(e){//订单数排序事件
            const val = e.target.value;
            if(val != 0){
                this.rankSort = 0
            }
            this.numSort = val;
        },
        platFromEvent(e){//下单平台筛选
            const val = e.target.value;
            this.platFromSe = val;
        },
        searchEvent(){//搜索按钮事件
            this.getTableHead()
        },
        chooseAllStatus(e){//是否全选商品
            const checked = e.target.checked
            console.log(checked,"是不是全选")
            for(let idx = 0; idx < this.tableTbody.length; idx++){
                if(this.tableTbody[idx].goods_id != '--'){
                    if(checked){
                        if(this.chooseGoods.indexOf(this.tableTbody[idx].goods_id) == -1){
                            this.chooseGoods.push(this.tableTbody[idx].goods_id)
                        }
                    }else{
                        if(this.chooseGoods.indexOf(this.tableTbody[idx].goods_id) >= 0){
                            this.chooseGoods.splice(this.chooseGoods.indexOf(this.tableTbody[idx].goods_id), 1)
                        }
                    }
                }
            }
        },
        singleStatus(idx){//单个商品选择
            console.log(idx)
            if(this.tableTbody[idx].goods_id != '--'){
                if(this.chooseGoods.indexOf(this.tableTbody[idx].goods_id) >= 0){
                    this.chooseGoods.splice(this.chooseGoods.indexOf(this.tableTbody[idx].goods_id), 1)
                }else{
                    this.chooseGoods.push(this.tableTbody[idx].goods_id)
                }
            }
        },
        exportFile(){//导出选中的商品表格
            if(this.chooseGoods.length == 0){
                this.alert('请先选择需要导出的商品')
                return
            }
            this.showLoading();
            request({
                url:setting.urls.appSaleRank,
                method:'get',
                responseType: 'blob',
                params:{
                    page: 1,
                    'is_excel': 1,
                    'goods_arr': this.chooseGoods.join(','),
                    platform:this.platFromSe,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd,
                    'num_sort':this.numSort,
                    'income_sort':this.rankSort,
                }
            }).then(res=>{
                console.log(res,"团队常购导出")
                if(res.status == 200){
                    const url = window.URL.createObjectURL(new Blob([res.data]))
                    const link = this.$refs.exportXlsx
                    link.href = url
                    link.setAttribute('download', '商品列表.xlsx')
                    link.click()
                    this.chooseGoods = Object.assign([])
                }
            }).catch((error) => {
                this.alert('导出列表失败')
            }).then(() => {
                this.hideLoading()
            })
        }
    }
}
</script>
<style scoped>
.table-container{flex: 1;box-sizing: border-box;margin: 1.22em 0 .875em;height: 600px;overflow-y: scroll;}
.hideScrollBar::-webkit-scrollbar {display: none;}
.selectOption{width: 135px; height: 30px;line-height: 30px;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;margin-left: .2rem;cursor: pointer;}
.arrow{position: relative;}
.arrow::after{position: absolute;content: '';width: 0;height: 0;top: 10px;right: 5px;border: 0.3rem solid;border-color: #999999 transparent transparent transparent;}
</style>