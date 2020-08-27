<template>
<div class="detail-container">
    <div class="detail-data-box" v-show="!showChannelGoodsList && !showEditPage">
        <header class="search-header">
            <div class="search-group">
                <label>联盟名称</label>
                <input type="text" placeholder="请输入" v-model="name">
            </div>
            <div class="search-group">
                <label>渠道等级</label>
                <select v-model="rank">
                    <option value="">全部</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
            <div class="search-group">
                <label>城市</label>
                <input type="text" placeholder="请输入" v-model="city">
            </div>
            <div class="search-group">
                <label>更新时间</label>
                <flat-pickr class="search-time-picker" v-model="start_time" placeholder="开始时间" :config="dateConfig"></flat-pickr>
                <div class="split-line"><div></div></div>
                <flat-pickr class="search-time-picker" v-model="end_time" placeholder="结束时间" :config="dateConfig"></flat-pickr>
            </div>
            <button class="action-btn" @click.prevent.stop="loadChannelList(1)">搜索</button>
            <button class="action-btn">批量导入</button>
            <a class="action-btn" style="display: inline-block;" download="导出渠道列表.xlsx" :href="downloadUrl">批量导出</a>
            <button class="action-btn" v-if="channer_add == 'T'">新建</button>
        </header>
        <div class="tj">
            <div class="tj-item">渠道数量：{{channerNum}}</div>
            <div class="tj-item">商品数量：{{goodsNum}}</div>
            <div class="tj-item">商品销量：{{goodsSaleNum}}</div>
            <div class="tj-item">收入合计：{{incomeAmount}}</div>
        </div>
        <div class="table-container">
            <table cellspacing="0">
                <thead>
                    <tr>
                        <td style="width: 2.5625rem; text-align: center;">
                            <input type="checkbox" v-model="allChecked">
                        </td>
                        <td v-for="(headerItem, index) in tableHeader[0]" :key="index">
                            {{ headerItem.name }}
                        </td>
                        <td>
                            操作
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in channelList" :key="index">
                        <td style="width: 2.5625rem; text-align: center;">
                            <input type="checkbox" :checked="checkedArr.indexOf(row['id']) >= 0" @click.prevent.stop="checkChannel(index)">
                        </td>
                        <td v-for="(field, idx) in fields" :key="idx">
                            {{ row[field] }}
                        </td>
                        <td>
                            <button class="action-btn" style="padding:0 .3rem;">查看</button>
                            <button class="action-btn" style="padding:0 .3rem;" v-if="row['channel_edit'] == 'T'">编辑</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <page :pageData="pageData" @loadList="loadChannelList"></page>
    </div>
    <div class="detail-data-box" v-show="showChannelGoodsList">

    </div>
    <div class="detail-data-box" v-show="showEditPage">
        <div class="editor-header">{{channel.id === null ? '新建渠道' : '编辑渠道'}}</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups necessary">
                <label>渠道名称</label>
                <div>
                    <input type="text" v-model="channel.name">
                </div>
            </div>
            <div class="editor-groups">
                <label>手机号</label>
                <div>
                    <input type="text" v-model="channel.phone">
                </div>
            </div>
            <div class="editor-groups">
                <label>微信号</label>
                <div>
                    <input type="text" v-model="channel.wechat">
                </div>
            </div>
            <div class="editor-groups">
                <label>QQ号</label>
                <div>
                    <input type="text" v-model="channel.qq_number">
                </div>
            </div>
            <div class="editor-groups">
                <label>合作等级</label>
                <div>
                    <input type="text" v-model="channel.rank" disabled>
                </div>
            </div>
            <div class="editor-groups necessary">
                <label>所在城市</label>
                <div>
                    <label>省份</label>
                    <select v-model="currProvince">
                        <option value="">请选择省份</option>
                        <option :value="item.province" v-for="(item, idx) in cityData" :key="idx">
                            {{item.name}}
                        </option>
                    </select>
                    <label>城市</label>
                    <select v-model="currCity">
                        <option value="">请选择城市</option>
                        <option :value="item.city" v-for="(item, idx) in citys" :key="idx">
                            {{item.name}}
                        </option>
                    </select>
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" style="background-color: #ccc; color: #282828;">取消</button>
                    <button class="action-btn">保存</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import pageVue from '@/components/content/page.vue'
import flatpickrVue from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import setting from '@/setting'
import { province, city } from 'province-city-china/data'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'page': pageVue,
        'flat-pickr': flatpickrVue
    },
    data() {
        return {
            allChecked: false,
            checkedArr: [],
            // 搜索条件
            name: '',
            rank: '',
            city: '',
            'start_time': '',
            'end_time': '',
            // 时间空间配置
            dateConfig: {
                'time_24hr': true,
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i:S',
                enableTime: true,
            },
            // 渠道列表
            // 列表元数据
            channelList: [],
            // fields
            fields: [],
            // 表头
            tableHeader: [],
            // 页码
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            // 新建权限
            'channer_add': 'F',
            // 选中渠道统计
            // 渠道数量
            channerNum: 0,
            // 商品数量
            goodsNum: 0,
            // 商品销量
            goodsSaleNum: 0,
            // 收入合计
            incomeAmount: 0,
            // 显示渠道商品列表
            showChannelGoodsList: false,
            // 显示编辑页面
            showEditPage: true,
            goodsList: [],
            // 编辑对象
            channel: {id:null,name:'',province:'',country:'',city:'',phone:'','qq_number':'',wechat:'',rank:''},
            cityData: {},
            currProvince: '',
            currCity: '',
            citys: []
        }
    },
    watch: {
        allChecked(nVal) {
            if (nVal) {
                this.checkedArr = []
                for(let idx = 0; idx < this.channelList.length; idx++){
                    this.checkedArr.push(this.channelList[idx].id)
                }
            } else {
                this.checkedArr = []
            }
        },
        currProvince(nVal) {
            if(!nVal) {
                this.citys = []
            } else {
                if(!this.cityData[nVal].city){
                    this.citys = this.cityData[nVal]
                }else{
                    this.citys = this.cityData[nVal].city
                }
            }
        }
    },
    computed: {
        downloadUrl: function(){
            return setting.baseUrl + setting.urls.channerList + '?name=' + this.name + '&rank=' + this.rank + '&city=' + this.city + '&start_time=' + this.start_time + '&end_time=' + this.end_time + '&page=' + this.pageData.page + '&is_excel=1&skey=' + this.$cookies.get('skey')
        }
    },
    created() {
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'channelList' }, 'get'),
            this.loadTBData(setting.urls.channerList, {page: 1}, 'get')
        ]).then(rst => {
            this.tableHeader = rst[0].tableHeader
            this.fields = rst[0].fields
            this.makeData(rst[1])
        }).catch(e => {
            this.alert(e.message || '加载渠道列表失败')
        }).then(() => {
            this.hideLoading()
        })
        for(let idx = 0; idx < province.length; idx++){
            this.cityData[province[idx].province] = JSON.parse(JSON.stringify(province[idx]))
        }
        for(let idx = 0; idx < city.length; idx++){
            if(!this.cityData[city[idx].province].city){
                this.cityData[city[idx].province].city = []
            }
            this.cityData[city[idx].province].city.push(city[idx])
        }
        console.log(this.cityData)
    },
    methods: {
        loadChannelList(pageNo){
            this.loadTBData(setting.urls.channerList, {
                page: pageNo || 1,
                name: this.name,
                rank: this.rank,
                city: this.city,
                'start_time': this.start_time,
                'end_time': this.end_time
            }, 'get').then(rst => {
                this.makeData(rst)
            })
        },
        checkChannel(index){
            if(this.checkedArr.indexOf(this.channelList[index].id) >= 0){
                this.checkedArr.splice(this.checkedArr.indexOf(this.channelList[index].id), 1)
            }else{
                this.checkedArr.push(this.channelList[index].id)
            }
        },
        makeData(dt){
            this.pageData.total = dt.total || 0
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0
            this.pageData.page = dt.page || 1

            this.$data['channer_add'] = dt.actions.channel_add || 'F'

            this.channerNum = dt.channel_num || 0
            this.goodsNum = dt.goods_num || 0
            this.goodsSaleNum = dt.sale_num || 0
            this.incomeAmount = dt.total_profit || 0

            this.channelList = dt.data
        }
    }
}
</script>
<style lang="less" scoped>
.detail-container {
    background-color: #f2f2f2;
    padding: 0;
    margin: 0;
    overflow: hidden;
    .detail-data-box {
        margin-top: 0;
        .search-header {
            display: block;
            .search-group {
                margin-bottom: .5rem;
            }
        }
        .tj {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            .tj-item {
                width: auto;
                margin-left: 1rem;
                display: inline-block;
                font-size: .4375rem;
                vertical-align: top;
            }
            .tj-item:first-child {
                margin-left: 0;
            }
        }
        .table-container {
            overflow: auto;
            margin-top: 0.5rem;
        }
        .editor-header {
            font-weight: bold;
            height: 2.34375rem;
            line-height: 2.34375rem;
            border-bottom: 1px solid #e6e6e6;
            font-size: .5625rem;
            padding-left: 1.125rem;
        }
        .editor-body {
            height: 0;
            flex: 1;
            padding: .75rem 1.125rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            overflow-y: auto;
            .editor-groups {
                width: 100%;
                height: 1.25rem;
                line-height: 1.25rem;
                display: flex;
                margin-top: .625rem;
                font-size: .4375rem;
                label {
                    width: 3.0625rem;
                    height: 100%;
                    line-height: 1.25rem;
                }
                div {
                    input {
                        font-size: .4375rem;
                        width: 15.9375rem;
                        height: 100%;
                        line-height: 1.25rem;
                        border: 1px solid #d9d9d9;
                        border-radius: .125rem;
                        padding: .3125rem;
                        box-sizing: border-box;
                    }
                    textarea {
                        resize: none;
                        height: 100%;
                        border: 1px solid #d9d9d9;
                        border-radius: .125rem;
                        padding: .3125rem;
                        box-sizing: border-box;
                    }
                    select {
                        appearance: menulist;
                        font-size: .4375rem;
                        width: 7rem;
                        height: 100%;
                        line-height: 1.25rem;
                        border: 1px solid #d9d9d9;
                        border-radius: .125rem;
                        padding: .3125rem;
                        box-sizing: border-box;
                        margin-left: .3rem;
                        margin-right: .3rem;
                    }
                }
            }
            .editor-groups>div {
                width: 0;
                flex: 1;
                height: 100%;
            }
            .necessary>label {
                position: relative;
            }
            .necessary>label::after {
                content: '*';
                color: red;
                display: inline-block;
                position: absolute;
                font-size: .4375rem;
            }
            .editor-groups:first-child {
                margin-top: 0;
            }
        }
    }
}
</style>