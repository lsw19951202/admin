<template>
    <div class="detail-container">
        <div v-show="isShow=='record'">
            <div class="listBox">
                <button @click="goTo" id='addBtn' :class="btnChecked==1?'btnChecked':'btnCheck'">新增用户</button>
                <button @click="goTo" id='activeBtn' :class="btnChecked==2?'btnChecked':'btnCheck'">活跃用户</button>
                <button @click="goTo" id='orderBtn' :class="btnChecked==3?'btnChecked':'btnCheck'">下单用户</button>
                <button @click="goTo" id='shareBtn' :class="btnChecked==4?'btnChecked':'btnCheck'">商品分享次数</button>
            </div>
            <BenchHeader v-bind:headerData='headerData'></BenchHeader>
            <div class="content">
                <BenchBody v-bind:bodyData='bodyData' @sleepData='lookType' ref="mychild"></BenchBody>
            </div>
        </div>
        <!-- 沉睡用户列表 -->
        <div v-if="isShow=='sleep'">
            <div class="sleepTopTips">
                <span class="sleepTitle">沉睡用户</span>
                <span class="goBack" @click="goBack">返回上一级</span>
            </div>
            <header class="search-header">
                <div class="search-group">
                    <label>用户ID:</label>
                    <input type="text" placeholder="请输入" v-model="id">
                </div>
                <div class="search-group">
                    <label>用户昵称:</label>
                    <input type="text" placeholder="请输入" v-model="nickName">
                </div>
                <div class="search-group">
                    <label>电话号码:</label>
                    <input type="text" placeholder="请输入" v-model="phone">
                </div>
                <div class="search-group">
                    <label>团队ID:</label>
                    <input type="text" placeholder="请输入" v-model="teamId">
                </div>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin"
                        placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd"
                        placeholder="结束时间"></flat-picker>
                </div>
                <Select :selectParams="selectData" @selectOptsClicked="chooseOption"></Select>
            </header>
            <button class="search-btn" @click="getSleepTable(1)">搜索</button>
            <table>
                <thead>
                    <tr>
                        <th v-for="(item,index) in tableHead" :key="index">{{item.name}}</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,key,index) in tableBody" :key="index">
                        <td v-for="(val,index) in tableHead" :key="index">
                            <div v-if="val.field=='avatar'" style="display: flex;align-items: center;justify-content: center;">
                                <img :src="item[val.field]" alt="头像" style="width: 1.375rem; height: 1.375rem; border-radius: 50%;">
                            </div>
                            <div v-else>{{item[val.field]}}</div>
                        </td>
                        <td class="myTeam">我的团队</td>
                    </tr>
                </tbody>
            </table>
            <Page :pageData="pageData" @loadList="getSleepTable"></Page>
        </div>
        
    </div>
</template>

<script>
    import request from '@/axios'
    import qs from 'qs'
    import setting from '@/setting'
    import benchHeader from "../components/content/benchHeader.vue"
    import benchBody from "../components/content/benchBody.vue"
    import flatPicker from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    import select from '../components/common/select.vue'
    import page from '../components/content/page.vue'
    import {
        Mandarin
    } from 'flatpickr/dist/l10n/zh.js'
    export default {
        inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
        components: {
            'BenchHeader':benchHeader,
            'BenchBody':benchBody,
            'flat-picker': flatPicker,
            'Select': select,
            'Page': page
        },
        data() {
            const now = new Date();
            let nStr = '';
            nStr += now.getFullYear() + '-'
            nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
            nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
            return {
                headerData:[],//顶部数据
                bodyData:[],
                dateConfig: {
                    'time_24hr': true,
                    maxDate: nStr,
                    locale: Mandarin
                },
                isShow: 'record', // record运营数据页面    sleep沉睡用户列表页面   share分享商品列表页面
                rank: '', //1会员 2团长 3总监 （沉睡用户列表只能传2或者3）
                id: '',
                nickName: '',
                phone: '',
                teamId: '',
                createTimeBegin: '',
                createTimeEnd: '',
                selectData: {
                    label: '职级',
                    // placeholder: '请选择',
                    options: [{
                        value: '',
                        text: '请选择'
                    }, {
                        value: '2',
                        text: '团长'
                    }, {
                        value: '3',
                        text: '总监'
                    }]
                },
                tableHead: [], //沉睡用户 表头
                tableBody: [], //沉睡用户列表
                pageData: {
                    total: 0,
                    page: 1,
                    'total_page': 0
                },
                shareTable: [], //分享商品列表
                shareData: {
                    total: 0,
                    page: 1,
                    'total_page': 0
                },
                platfrom: '', //平台   tb 淘宝 jd京东 pdd拼多多
                rateSort: 0, // 转换率排序  0全部 1升序 2降序
                numSort: 2, //	分享次数排序  0全部 1升序 2降序
                shareStartTime: '',
                shareEndTime: '',
                shareStatus: '', //今日  昨日  本月   上月
                btnChecked:1,//当前选择按钮 1新增 2活跃 3下单 4分享
                tabHeight:'',
            }
        },
        created() {
             this.getTotaluser();//获取新增用户总数
             this.getActiveUser();//获取活跃用户总数
             this.getOrderuser();//下单总数
             this.getGoodsShare();//商品分享数据
        },
        watch: {
            rank(e) {
                console.log(e, "点击了++++++")
                this.isShow = 'sleep'
                this.getSleepTable(1)
            },
        },
        methods: {
            compare(val){
                return function(a,b){
                    const value1 = a[val];
                    const value2 = b[val];
                    return value1 - value2;
                }
            },
            goBack() { //返回上一级
                this.isShow = 'record'
            },
            lookType(sleepType) { //区别团长、总监
                // console.log(sleepType)
                this.rank = sleepType;
            },
            chooseOption(e) { //选择职级
                console.log(e, "选择职级 2团长 3总监")
                this.rank = e;
            },
            getSleepTable(pageNum) { //沉睡用户表头
                this.showLoading()
                request({
                    url: setting.urls.sleepUserHeader,
                    method: 'get',
                    params: {}
                }).then(res => {
                    // console.log(res,"沉睡用户表头")
                    if (res.status == 200) {
                        if (res.data.code == 200) {
                            this.tableHead = res.data.data;
                            this.getSleepList(pageNum);
                        }
                    }
                }).catch((error) => {
                    this.alert('加载沉睡用户表头失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getSleepList(pageNum) { //沉睡用户列表
                this.showLoading()
                request({
                    url: setting.urls.userList,
                    method: 'get',
                    params: {
                        page: pageNum || 1,
                        rank: this.rank,
                        id: this.id,
                        nickName: this.nickName,
                        phone: this.phone,
                        teamId: this.teamId,
                        'is_sleep': 1,
                        createTimeBegin: this.createTimeBegin,
                        createTimeEnd: this.createTimeEnd,
                    }
                }).then(res => {
                    // console.log(res, "沉睡用户列表")
                    if (res.status == 200) {
                        const rest = res.data;
                        if (rest.code == 200) {
                            this.pageData.total = rest.data.total;
                            this.pageData.page = rest.data.page;
                            this.pageData['total_page'] = rest.data.pageCount;
                            this.tableBody = rest.data.data;
                        }
                    }
                }).catch((error) => {
                    this.alert('加载沉睡用户列表失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getTotaluser(){//获取新增用户总数
                this.showLoading()
                request({
                    url:setting.urls.totalUser,
                    method:'get',
                    params:{}
                }).then(res=>{
                    // console.log(res,"平台用户总数")
                    if(res.status == 200){
                    if(res.data.code == 200){
                        const rest = res.data.data;
                        this.headerData.push({
                            name:'today_user_num',
                            value:rest.today.user_num,
                            percentage:rest.rate.day_rate,
                            num:1//顺序
                        })
                        this.bodyData.push({
                            name:'addUser',
                            value:rest,
                            num:1//顺序
                        })
                        this.headerData.sort(this.compare('num'))
                        this.bodyData.sort(this.compare('num'))
                        // this.addUserData = Object.assign([], rest)
                    }else{
                        this.alert(res.data.message || '新增用户列表失败')
                    }
                    }else{
                        this.alert('新增用户列表失败')
                    }
                }).catch((e) => {
                    this.alert('新增用户列表失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getActiveUser(){//获取活跃用户总数
                this.showLoading()
                request({
                    url:setting.urls.activeUser,
                    method:'get',
                    params:{
                    }
                }).then(res=>{
                    if(res.status == 200){
                        // console.log(res,"活跃用户")
                        if(res.data.code == 200){
                            const rest = res.data.data;
                            this.headerData.push({
                                name:'today_total_user_num',
                                value:rest.today.total_user_num,
                                percentage:rest.rate.day_rate,
                                activeRate:rest.active_rate,
                                num:2,
                            })
                            this.bodyData.push({
                                name:'lifeUser',
                                value:rest,
                                num:2//顺序
                            })
                            this.headerData.sort(this.compare('num'))
                            this.bodyData.sort(this.compare('num'))
                        }else{
                            this.alert(res.data.message || '活跃用户统计失败')
                        }
                    }else{
                        this.alert('活跃用户统计失败')
                    }
                }).catch((e) => {
                    this.alert('活跃用户统计失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getOrderuser(){//下单总数
                this.showLoading()
                request({
                    url:setting.urls.orderUser,
                    method:'get',
                    params:{}
                }).then(res=>{
                    if(res.status == 200){
                        if(res.data.code == 200){
                            const rest = res.data.data;
                            this.headerData.push({
                                name:'today_order_total_user_num',
                                value:rest.today.total_user_num,
                                percentage:rest.rate.day_rate,
                                orderRate:rest.order_rate,
                                num:3,
                            })
                            this.bodyData.push({
                                name:'orderUser',
                                value:rest,
                                num:3//顺序
                            })
                            this.headerData.sort(this.compare('num'))
                            this.bodyData.sort(this.compare('num'))
                        }else{
                            this.alert(res.data.message || '下单总数失败')
                        }
                    }else{
                        this.alert('下单总数失败')
                    }
                }).catch((e) => {
                    this.alert('下单总数失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getGoodsShare(){//商品分享数据
                this.showLoading()
                request({
                    url:setting.urls.goodsShare,
                    method:'get',
                    params:{}
                }).then(res=>{
                    // console.log(res,"商品分享数据")
                    if(res.status == 200){
                        if(res.data.code == 200){
                            const rest = res.data.data;
                            this.headerData.push({
                                name:'today_share_num',
                                value:rest.today.share_num,
                                percentage:rest.rate.day_rate,
                                num:4,
                            })
                            this.bodyData.push({
                                name:'shareUser',
                                value:rest,
                                num:4//顺序
                            })
                            this.headerData.sort(this.compare('num'))
                            this.bodyData.sort(this.compare('num'))
                        }else{
                            this.alert(res.data.message || '商品分享数据失败')
                        }
                    }
                }).catch((e) => {
                    this.alert('商品分享数据失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            goTo(e){
                switch (e.target.id){
                    case 'addBtn':
                        this.btnChecked=1;
                        this.$refs.mychild.go("addUser");
                        break;
                    case 'activeBtn':
                        this.btnChecked=2;
                        this.$refs.mychild.go("lifeUser");
                        break;
                    case 'orderBtn':
                        this.btnChecked=3;
                        this.$refs.mychild.go("orderUser");
                        break;
                    case 'shareBtn':
                        this.btnChecked=4;
                        this.$refs.mychild.go("shareUser");
                        break;
                    default:
                        break;
                }
            }
        }
    }
</script>

<style scoped>
    .detail-container{
        /* margin-top: 0.8rem; */
        flex: 1;
        height: 0;
        overflow: hidden;
        overflow-y: auto;
        padding-top: 0;
    }
    .listBox {
        width: 49.7rem;
        display: flex;
        padding: 0.6rem 0;
        position: fixed;
        background-color: #fff;
        top: 4.25rem;
        z-index: 99;
    }
    .content{
        margin-top: 0.8rem;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    button{
        width: 3rem;
        height: 1rem;
        margin-right: 0.5rem;
        line-height: 1rem;
        border-radius: 0.15rem;
    }
    /* 沉睡列表 */
    .sleepTopTips {
        height: 50px;
        display: flex;
        align-items: center;
    }
    
    .sleepTitle {
        font-size: 18px;
        font-weight: bold;
        color: #52c7f2;
    }
    
    .goBack {
        font-size: 16px;
        font-weight: 600;
        color: #52c7f2;
        cursor: pointer;
        margin-left: 30px;
    }
    
    .myTeam {
        font-weight: bold;
        color: #52c7f2;
        cursor: pointer;
    }
    
    table {
        margin-top: 20px;
    }
    .btnChecked{
        background-color: #169bd5;
        color: #FFFFFF;
    }
    .btnCheck{
         background-color: #999999;
         color: #FFFFFF;
    }
    .selectOption {
        width: 5rem;
        height: 1rem;
        line-height: 1rem;
        border-radius: .125rem !important;
        border: 1px solid #D9D9D9;
        box-sizing: border-box;
        font-size: .4375rem;
        vertical-align: top;
        padding-left: .3125rem;
        padding-right: .3125rem;
        margin-left: .2rem;
        cursor: pointer;
    }
</style>
