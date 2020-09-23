<template>
    <div class="newAddUser">
        <div class="left_Pie">
            <div style="width: 100%;height: 50%;border-bottom: 1px solid gray;">
                <div class="pie_Box">
                    <div style="font-size: 0.5rem;margin-left: 0.4rem;margin-top: 0.1rem;">
                        {{pietitle}}
                    </div>
                    <div style="display: flex;color: #009dd9;margin-left: 0.4rem;margin-top: 0.1rem;" v-if="name=='addUser'">
                        <div style="margin-right: 0.4rem;">
                            {{addNotice[0]}}
                        </div>
                        <div>
                            {{addNotice[1]}}
                        </div>
                    </div>
                    <div style="display: flex;color: #009dd9;margin-left: 0.4rem;margin-top: 0.1rem;" v-if="name!='addUser'">
                        <div>
                            {{otherNotice}}
                        </div>
                    </div>
                    <div style="width: 100%;display: flex;justify-content: center;">
                        <div style="width: 5rem; height: 5rem;" ref="leftPie"></div>
                    </div>
                </div>
            </div>
            <div style="width: 100%;height: 50%;">
                <table v-if="name=='addUser'">
                    <thead>
                        <th></th>
                        <th>会员</th>
                        <th>团长</th>
                        <th>总监</th>
                    </thead>
                    <tbody v-if="tableList.length>3">
                        <tr>
                            <td>拉新</td>
                            <td v-for="(item,index) in tableList[0].value" :key='index'>{{item}}</td>
                        </tr>
                        <tr>
                            <td>下载数</td>
                            <td v-for="(item,index) in tableList[1].value" :key='index'>{{item}}</td>
                        </tr>
                        <tr>
                            <td>转化数</td>
                            <td v-for="(item,index) in tableList[2].value" :key='index'>{{item}}</td>
                        </tr>
                        <tr>
                            <td>转化率</td>
                            <td v-for="(item,index) in tableList[3].value" :key='index'>{{item}}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="name!='addUser'">
                    <div style="font-size: 0.2rem;color: red;">{{treeTitle}}</div>
                    <div v-for='(item,index) in treeList' :key='index' class="tree">
                        <div style="width: 1.3rem;">{{item.name}}</div>
                        <div>
                            <div style="display: flex;justify-content: space-between;color: gray;">
                                <div >
                                    {{treeNotice[0]}}{{item.value[0]}}
                                </div>
                                <div v-if="treeNotice[1]" >
                                    {{treeNotice[1]}}{{item.value[1]}}
                                </div>
                            </div>
                            <div style="display: flex;width: 7rem;height: 1rem;line-height: 1rem;text-align: center;">
                                <div :style="{width:item.value[0]}" style="background-color: #7ecf51;height: 100%;" ></div>
                                <div  style="background-color: #2fc7c9;height: 100%;flex: 1;" ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="userChart">
            <div class='userText'>{{title}}</div>
            <div class="userTop">
                <div class="userTop-left" @click="chooseRan">
                    <span :class='range==index?"range":"leftText"' v-for="(item,index) in tabNameList" :key='index' :id='index'>{{item}}</span>
                </div>
                <div class="userTop-right">
                    <span :class='text=="今日"?"select":"inSelect"' @click="limitsTime" v-if="name!='shareUser'">今日</span>
                    <span :class='text=="本月"?"select":"inSelect"' @click="limitsTime">本月</span>
                    <div class="search-group">
                        <!-- <label>日期筛选:</label> -->
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin"
                            placeholder="起始时间"></flat-picker>
                        <div class="split-line">
                            <div></div>
                        </div>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd"
                            placeholder="结束时间"></flat-picker>
                    </div>
                    <button class="action-btn" @click="queryData">查询</button>
                </div>
            </div>
            <div class="echarts-g">
                <div style="width: 100%; height: 100%;" ref="chart"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '@/axios'
    import qs from 'qs'
    import setting from '@/setting'
    import flatPicker from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    import {
        Mandarin
    } from 'flatpickr/dist/l10n/zh.js'
    import echarts from 'echarts'
    export default {
        inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
        props: ['name'],
        components: {
            'flat-picker': flatPicker,
        },
        data() {
            const now = new Date();
            let nStr = '';
            nStr += now.getFullYear() + '-'
            nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
            nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
            return {
                createTimeBegin: '',
                createTimeEnd: '',
                dateConfig: {
                    'time_24hr': true,
                    maxDate: nStr,
                    locale: Mandarin
                },
                conditions: {
                    'is_today': 'T',
                    'user_type': 0,
                    'start_time': '',
                    'end_time': ''
                },
                sharEchartParam: {
                    'order_type': '0', //0全部 tb淘宝 jd京东 pdd拼多多
                    'start_time': '',
                    'end_time': ''
                },
                range: 0, // 0全部用户类型   1会员   2团长   3总监,默认全部用户类型
                text: "本月", //默认查询本月
                title: '', //标题
                tabNameList: [],
                tableList: [],
                colorList: ['#ff0000', '#f9ca1e', '#7ecf51'],
                pietitle: '',//Pie标题
                addNotice: [],//pie新增标题头注释
                otherNotice:'',//pie新增以外标题头注释
                treeList:[],//树状图
                treeNotice:[],//树状图注释
                treeTitle:'',//树状图标题
            }
        },
        created() {
            const start = this.getMonth("s", 0);
            const end = this.getMonth("e", 0);
            this.$data.conditions = {
                'is_today': 'F',
                'user_type': 0,
                'start_time': start,
                'end_time': end
            };
            this.$data.sharEchartParam = {
                'order_type': '0',
                'start_time': start,
                'end_time': end
            }
            this.getLineChart(this.name);
        },
        methods: {
            getLineChart(val) {
                switch (val) {
                    case 'addUser':
                        this.title = '新增用户趋势';
                        this.tabNameList = ['总体', '会员', '团长', '总监']
                        this.getAddData();
                        break;
                    case 'lifeUser':
                        this.title = '活跃用户趋势';
                        this.tabNameList = ['总体', '会员', '团长', '总监']
                        this.getActiveData();
                        break;
                    case 'orderUser':
                        this.title = '下单用户趋势';
                        this.tabNameList = ['总体', '会员', '团长', '总监']
                        this.getOrderData();
                        break;
                    case 'shareUser':
                        this.title = '商品用户趋势';
                        this.tabNameList = ['总体', '淘宝', '京东', '拼多多']
                        this.getShareData();
                        break;
                    default:
                        break;
                }
            },
            getPie(res) {
                this.showLoading()
                const options = {
                    color: this.colorList,
                    tooltip:{
                        formatter: '{b}:{c}人',//多值的嵌套
                        position:['60%','30%'],
                    },
                    series: [{
                        name: '访问来源',
                        type: 'pie', // 设置图表类型为饼图
                        radius: '55%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data: res,
                        // hoverAnimation: false,
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{d}%'//多值的嵌套
                            }
                        }
                    }],
                };
                echarts.init(this.$refs.leftPie).setOption(options)
                this.hideLoading()
            },
            getAddData() {
                this.showLoading()
                request({
                    url: setting.urls.totalUserChart,
                    method: 'get',
                    params: this.conditions
                }).then(res => {
                    // console.log(res, "新增用户折线图")
                    if (res.data.data.chart.length <= 0) {
                        this.alert('用户折线图无数据')
                    }
                    const result = res.data.data.data;
                    this.tableList = [{
                        name: 'add',
                        value: [result.member_num, result.leader_num, result.director_num]
                    }, {
                        name: 'download',
                        value: [result.member_download_num, result.leader_download_num, result.director_download_num]
                    }, {
                        name: 'order',
                        value: [result.member_have_order_num, result.leader_have_order_num, result.director_have_order_num]
                    }, {
                        name: 'rate',
                        value: [result.member_valid_change_rate, result.leader_valid_change_rate,
                            result.director_valid_change_rate
                        ]
                    }]
                    const pieData = [{
                        value: result.mt_new_num - result.mt_download_num,
                        name:'美团注册H5未下载'
                    }, {
                        value: result.mt_download_num,
                        name:'美团H5下载数'
                    }, {
                        value: result.other_download_num,
                        name:'其它渠道下载数'
                    }]
                    this.pietitle = '该时间段内总新增：' + result.user_num + '人'
                    this.addNotice = ['下载数：' + result.download_num, '转化数：' + result.have_order_num]
                    this.getPie(pieData)
                    this.createOptions(res.data.data.chart)
                }).catch((e) => {
                    this.alert('新增用户折线图失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getActiveData() {
                this.showLoading()
                request({
                    url: setting.urls.activeChart,
                    method: 'get',
                    params: this.conditions
                }).then(res => {
                    // console.log(res,"活跃用户折线图")
                    if (res.data.data.chart.length <= 0) {
                        this.alert('活跃用户折线图无数据')
                    }
                    const result = res.data.data.data;
                    const pieData = [{
                        value: result.member_num,
                        name:'会员'
                    }, {
                        value: result.leader_num,
                        name:'团长'
                    }, {
                        value: result.director_num,
                        name:'总监'
                    }]
                    this.pietitle = '该时间段内总活跃：' + result.active_user_num + '人'
                    this.otherNotice = '活跃率：' + result.active_rate
                    this.treeList=[{
                        name:'总监',
                        value:[result.director_active_rate,result.director_noactive_rate]
                    },{
                        name:'团长',
                        value:[result.leader_active_rate,result.leader_noactive_rate]
                    },{
                        name:'会员',
                        value:[result.member_active_rate,result.member_noactive_rate]
                    }],
                    this.treeTitle='各级活跃用户分层'
                    this.treeNotice=['活跃','不活跃']
                    this.getPie(pieData)
                    this.createOptions(res.data.data.chart)
                }).catch((e) => {
                    this.alert('加载用户折线图失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getOrderData() {
                this.showLoading()
                request({
                    url: setting.urls.orderUserChart,
                    method: 'get',
                    params: this.conditions
                }).then(res => {
                    // console.log(res,"下单折线图")
                    if (res.data.data.chart.length <= 0) {
                        this.alert('下单折线图无数据')
                    }
                    const result = res.data.data.data;
                    const pieData = [{
                        value: result.member_order_num,
                        name:'会员'
                    }, {
                        value: result.leader_order_num,
                        name:'团长'
                    }, {
                        value: result.director_order_num,
                        name:'总监'
                    }]
                    this.pietitle = '该时间段内总下单：' + result.total_user_num + '人'
                    this.otherNotice = '下单率：' + result.order_rate
                    this.treeList=[{
                        name:'总监',
                        value:[result.director_order_rate]
                    },{
                        name:'团长',
                        value:[result.leader_order_rate]
                    },{
                        name:'会员',
                        value:[result.member_order_rate]
                    }],
                    this.treeTitle='各级下单用户分层'
                    this.treeNotice=['下单','']
                    this.getPie(pieData)
                    this.createOptions(res.data.data.chart)
                }).catch((e) => {
                    this.alert('下单折线图失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getShareData() {
                this.showLoading()
                request({
                    url: setting.urls.sharEchart,
                    method: 'get',
                    params: this.sharEchartParam
                }).then(res => {
                    // console.log(res,"活跃用户折线图")
                    if (res.data.data.chart.length <= 0) {
                        this.alert('分享用户折线图无数据')
                    }
                    const result = res.data.data.data;
                    const pieData = [{
                        value: result.tb_share_num,
                        name:'淘宝'
                    }, {
                        value: result.jd_share_num,
                        name:'京东'
                    }, {
                        value: result.pdd_share_num,
                        name:'拼多多'
                    }]
                    this.pietitle = '该时间段内总分享：' + result.share_num + '次'
                    this.otherNotice = '转化率：' + result.valid_change_rate
                    this.treeList=[{
                        name:'淘宝',
                        value:[result.tb_valid_change_rate]
                    },{
                        name:'京东',
                        value:[result.jd_valid_change_rate]
                    },{
                        name:'拼多多',
                        value:[result.pdd_valid_change_rate]
                    }],
                    this.treeTitle='各渠道分享转化率'
                    this.treeNotice=['转化','']
                    this.getPie(pieData)
                    this.createOptions(res.data.data.chart)
                }).catch((e) => {
                    this.alert('加载用户折线图失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            createTitle: function() {
                return [{
                    text: '',
                    textStyle: {
                        color: '#333333',
                        fontWeight: 'bold',
                        fontSize: 24
                    }
                }]
            },
            createLegend: function() {
                if (this.name == 'addUser') {
                    return {
                        data: ['新增用户', '下载用户', '转化用户'],
                    }
                } else if (this.name == 'lifeUser') {
                    return {
                        data: ['活跃用户', '活跃下单用户'],
                    }
                } else if (this.name == 'orderUser') {
                    return {
                        data: ['下单用户', '下单数'],
                    }
                } else if (this.name == 'shareUser') {
                    return {
                        data: ['分享商品次数', '转化商品次数'],
                    }
                }
                // return {
                //     data: ['新增用户', '转化用户'],
                // }
            },
            createGrid: function() {
                return [{
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }]
            },
            createXAxis: function(data) {
                return [{
                    type: 'category',
                    gridIndex: 0,
                    boundaryGap: false,
                    name: '',
                    position: 'bottom',
                    textStyle: {
                        color: '#333333',
                        fontSize: 14
                    },
                    axisLine: {
                        show: false
                    },
                    data: data
                }]
            },
            createYAxis: function() {
                return [{
                    position: 'left',
                    gridIndex: 0,
                    type: 'value',
                    name: '',
                    textStyle: {
                        color: '#333333',
                        fontSize: 14
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#E5E5E5',
                            width: 1
                        }
                    },
                    axisLabel: {}
                }]
            },
            createSeries: function(data) {
                if (this.name == 'addUser') {
                    return [{
                        name: '新增用户',
                        type: 'line',
                        data: data.newDataArr
                    }, {
                        name: '转化用户',
                        type: 'line',
                        data: data.converData
                    }, {
                        name: '下载用户',
                        type: 'line',
                        data: data.downloadData
                    }]
                } else if (this.name == 'lifeUser') {
                    return [{
                        name: '活跃用户',
                        type: 'line',
                        data: data.newDataArr
                    }, {
                        name: '活跃下单用户',
                        type: 'line',
                        data: data.converData
                    }]
                } else if (this.name == 'orderUser') {
                    return [{
                        name: '下单用户',
                        type: 'line',
                        data: data.newDataArr
                    }, {
                        name: '下单数',
                        type: 'line',
                        data: data.converData
                    }]
                } else if (this.name == 'shareUser') {
                    return [{
                        name: '分享商品次数',
                        type: 'line',
                        data: data.shareNum
                    }, {
                        name: '转化商品次数',
                        type: 'line',
                        data: data.changeNum
                    }]
                }
            },
            createOptions: function(allData) {
                // console.log(allData)
                let seriesData = {};
                const xData = [];
                if (this.name == 'addUser') {
                    seriesData = {
                        newDataArr: [],
                        converData: [],
                        downloadData: []
                    };
                    for (let v = 0; v < allData.length; v++) {
                        xData.push(allData[v].statistics_day);
                        seriesData.newDataArr.push(allData[v].user_num);
                        seriesData.converData.push(allData[v].have_order_num);
                        seriesData.downloadData.push(allData[v].download_num);
                    }
                } else if (this.name == 'lifeUser') {
                    seriesData = {
                        newDataArr: [],
                        converData: []
                    };
                    for (let v = 0; v < allData.length; v++) {
                        xData.push(allData[v].statistics_day);
                        seriesData.newDataArr.push(allData[v].user_num);
                        seriesData.converData.push(allData[v].user_order_num);
                    }
                } else if (this.name == 'orderUser') {
                    seriesData = {
                        newDataArr: [],
                        converData: []
                    };
                    for (let v = 0; v < allData.length; v++) {
                        xData.push(allData[v].statistics_day);
                        seriesData.newDataArr.push(allData[v].user_number);
                        seriesData.converData.push(allData[v].order_number);
                    }
                } else if (this.name == 'shareUser') {
                    seriesData = {
                        shareNum: [],
                        changeNum: []
                    };
                    for (let v = 0; v < allData.length; v++) {
                        xData.push(allData[v].statistics_day);
                        seriesData.shareNum.push(allData[v].share_number);
                        seriesData.changeNum.push(allData[v].order_number);
                    }
                }
                // console.log(seriesData);
                const options = {
                    title: this.createTitle(),
                    legend: this.createLegend(),
                    grid: this.createGrid(),
                    backgroundColor: '#FFFFFF',
                    xAxis: this.createXAxis(xData),
                    yAxis: this.createYAxis(),
                    series: this.createSeries(seriesData),
                    tooltip: {
                        trigger: 'axis',
                    }
                }
                // console.log(options);
                if (!this.echart) {
                    this.echart = echarts.init(this.$refs.chart)
                }
                this.echart.setOption(options)
            },
            getMonth(type, months) { // 获取时间段函数 ==> type为字符串类型，有两种选择，"s"代表开始,"e"代表结束。months为数字类型，不传或0代表本月，-1代表上月，1代表下月
                const data = new Date();
                let year = data.getFullYear();
                let month = data.getMonth() + 1;
                if (Math.abs(months) > 12) {
                    months = months % 12;
                }
                if (months != 0) {
                    if (month + months > 12) {
                        year++;
                        month = (month + months) % 12;
                    } else if (month + months < 1) {
                        year--;
                        month = 12 + month + months;
                    } else {
                        month = month + months;
                    }
                }
                month = month < 10 ? "0" + month : month;
                const date = data.getDate();
                const firstday = year + "-" + month + "-" + "01";
                let lastday = "";
                if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" ||
                    month == "12") {
                    lastday = year + "-" + month + "-" + 31;
                } else if (month == "02") {
                    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
                        lastday = year + "-" + month + "-" + 29;
                    } else {
                        lastday = year + "-" + month + "-" + 28;
                    }
                } else {
                    lastday = year + "-" + month + "-" + 30;
                }
                let day = "";
                if (type == "s") {
                    day = firstday;
                } else {
                    day = lastday;
                }
                return day;
            },
            chooseRan(e) { //筛选会员
                switch (e.target.id) {
                    case '0':
                        this.conditions['user_type'] = 0;
                        this.sharEchartParam['order_type'] = 0;
                        this.range = 0;
                        this.getLineChart(this.name)
                        break;
                    case '1':
                        this.conditions['user_type'] = 1;
                        this.sharEchartParam['order_type'] = 'tb';
                        this.range = 1;
                        this.getLineChart(this.name)
                        break;
                    case '2':
                        this.conditions['user_type'] = 2;
                        this.sharEchartParam['order_type'] = 'jd';
                        this.range = 2;
                        this.getLineChart(this.name)
                        break;
                    case '3':
                        this.conditions['user_type'] = 2;
                        this.sharEchartParam['order_type'] = 'pdd';
                        this.range = 3;
                        this.getLineChart(this.name)
                        break;
                    default:
                        break;
                }
            },
            limitsTime(e) { //筛选时间段
                this.text = e.target.innerHTML;
                if (this.name == 'shareUser') {
                    this.sharEchartParam['start_time'] = this.getMonth("s", 0);
                    this.sharEchartParam['end_time'] = this.getMonth("e", 0);
                    this.getLineChart(this.name)
                } else {
                    switch (e.target.innerHTML) {
                        case '本月':
                            this.conditions['is_today'] = 'F';
                            this.conditions['start_time'] = this.getMonth("s", 0);
                            this.conditions['end_time'] = this.getMonth("e", 0);
                            this.getLineChart(this.name)
                            break;
                        case '今日':
                            this.conditions['is_today'] = 'T';
                            this.conditions['start_time'] = '';
                            this.conditions['end_time'] = '';
                            this.getLineChart(this.name)
                            break;
                        default:
                            break;
                    }
                }
            },
            queryData() { //查询按钮
                if (this.name == 'shareUser') {
                    this.sharEchartParam['start_time'] = this.createTimeBegin;
                    this.sharEchartParam['end_time'] = this.createTimeEnd;
                    this.text = '';
                } else {
                    this.conditions['start_time'] = this.createTimeBegin;
                    this.conditions['end_time'] = this.createTimeEnd;
                    this.conditions['is_today'] = 'F';
                    this.text = ''
                }
                this.getLineChart(this.name)
            },
        }
    }
</script>

<style scoped>
    .today_top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
    }

    .today_top span,
    .today_top div {
        font-size: 14px;
        font-weight: 600;
        color: #747770;
        font-family: "微软雅黑";
    }

    .today_num span:last-child {
        font-size: 14px;
        color: red;
        position: relative;
        bottom: -5px;
        left: 10px;
        font-weight: 400;
    }

    .newAddUser {
        width: 48.6rem;
        border: 1px solid #eeeeee;
        border-radius: 10px;
        padding: 20px;
        background-color: #f2f2f2;
        display: flex;
        box-sizing: border-box;
    }

    .userName {
        font-size: 18px;
        font-weight: bold;
        color: #3f413f;
        height: 40px;
    }

    .addList {
        display: flex;
        justify-content: space-between;
    }

    table {
        border-spacing: 0;
        border: 0;
        text-align: left;
        font-size: 14px;
    }

    tbody tr td {
        border: 0;
        border-top: 1px solid #E2E2E2;
    }

    tbody>tr:nth-child(even) {
        background-color: transparent;
    }

    tbody tr:last-child>td {
        color: #52c7f2;
    }

    .today {
        width: 45%;
        height: 370px;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 10px;
    }

    /* .thisMonth{width: 40%;height: 400px;} */
    .detail-container,
    .detail-data-box {
        padding: 0;
    }

    .detail-data-box {
        overflow-y: auto;
    }

    .detail-container {
        margin-left: 0;
    }

    .left_Pie {
        width: 12rem;
        background-color: #FFFFFF;
        border-radius: 10px;
    }

    .pie_Box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 0.4rem;
    }
    .notice_Box{
        display: flex;
        font-size: 0.1rem;
        align-items: center;
    }
    .tree{
        font-size: 0.4rem;
        height: 1rem;
        display: flex;
        align-items: center;
        margin: 0.8rem 0 0.6rem 0.2rem;
    }
    /* 新增用户趋势 头部 */
    .userChart {
        width: 100%;
        height: 13.2rem;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 0 10px;
        box-sizing: border-box;
        margin-left: 10px;
    }

    .userText {
        font-size: 16px;
        font-weight: 600;
        color: #747770;
        font-family: "微软雅黑";
        height: 40px;
        line-height: 40px;
    }

    .userTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .userTop-left {
        display: flex;
    }

    .leftText {
        display: block;
        width: 85px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        font-size: 14px;
        color: #666666;
        border: 1px solid #eeeeee;
        border-radius: 3px;
        cursor: pointer;
    }

    .userTop-right {
        display: flex;
    }

    .inSelect {
        font-size: 14px;
        color: #666666;
        margin: 0 10px;
        display: block;
        position: relative;
        top: 5px;
        cursor: pointer;
    }

    /* 新增用户趋势 折线图 */
    .echarts-g {
        height: 220px;
    }

    .range {
        display: block;
        width: 85px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        font-size: 14px;
        color: #52c7f2;
        border: 1px solid #52c7f2;
        border-radius: 3px;
        cursor: pointer;
    }

    .select {
        color: #52c7f2;
        font-size: 14px;
        margin: 0 10px;
        display: block;
        position: relative;
        top: 5px;
        cursor: pointer;
    }

    .imgIcon {
        width: 20px;
        height: 20px;
        position: relative;
        top: 3px;
        cursor: pointer;
    }

    /* 模态框 */
    #modal-box {
        width: 300px;
        position: fixed;
        display: none;
        z-index: 999;
    }
</style>
