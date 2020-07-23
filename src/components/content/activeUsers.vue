<template>
    <div class="newAddUser">
        <div class="userName">活跃用户</div>
        <div class="addList" v-if="activeData">
            <!-- 活跃用户今日表格数据 -->
            <div class="today">
                <div class="today_top">
                    <div class="today_num">
                        <span>今日活跃:{{activeData.today.total_user_num}}人</span>
                        <span>{{activeData.rate.day_rate}} 环比昨日</span>
                    </div>
                    <div>昨日活跃:{{activeData.yesterday.total_user_num}}人</div>
                </div>
                <table>
                    <thead>
                        <tr>
                        <th></th>
                        <th>会员</th>
                        <th>团长</th>
                        <th>总监</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>今日活跃用户</td>
                            <td>{{activeData.today.member_user_num?activeData.today.member_user_num:0}}</td>
                            <td>{{activeData.today.leader_user_num?activeData.today.leader_user_num:0}}</td>
                            <td>{{activeData.today.director_user_num?activeData.today.director_user_num:0}}</td>
                        </tr>
                        <tr>
                            <td>今日下单活跃用户 {{activeData.today.total_order_user_rate}}</td>
                            <td>{{activeData.today.member_order_user_rate}}</td>
                            <td>{{activeData.today.leader_order_user_rate}}</td>
                            <td>{{activeData.today.director_order_user_rate}}</td>
                        </tr>
                        <tr>
                            <td>今日活跃用户下单数 {{activeData.today.total_order_num}}</td>
                            <td>{{activeData.today.member_order_num?activeData.today.member_order_num:0}}</td>
                            <td>{{activeData.today.leader_order_num?activeData.today.leader_order_num:0}}</td>
                            <td>{{activeData.today.director_order_num?activeData.today.director_order_num:0}}</td>
                        </tr>
                        <tr>
                            <td>昨日活跃用户</td>
                            <td>{{activeData.yesterday.member_user_num?activeData.yesterday.member_user_num:0}}</td>
                            <td>{{activeData.yesterday.leader_user_num?activeData.yesterday.leader_user_num:0}}</td>
                            <td>{{activeData.yesterday.director_user_num?activeData.yesterday.director_user_num:0}}</td>
                        </tr>
                        <tr>
                            <td>昨日下单活跃用户 {{activeData.yesterday.total_order_user_rate}}</td>
                            <td>{{activeData.yesterday.member_order_user_rate}}</td>
                            <td>{{activeData.yesterday.leader_order_user_rate}}</td>
                            <td>{{activeData.yesterday.director_order_user_rate}}</td>
                        </tr>
                        <tr>
                            <td>昨日活跃用户下单数 {{activeData.yesterday.total_order_num}}</td>
                            <td>{{activeData.yesterday.member_order_num?activeData.yesterday.member_order_num:0}}</td>
                            <td>{{activeData.yesterday.leader_order_num?activeData.yesterday.leader_order_num:0}}</td>
                            <td>{{activeData.yesterday.director_order_num?activeData.yesterday.director_order_num:0}}</td>
                        </tr>
                        <tr>
                            <td>环比昨日下单数 {{activeData.rate.day_order_rate}}</td>
                            <td>{{activeData.rate.day_member_order_rate}}</td>
                            <td>{{activeData.rate.day_leader_order_rate}}</td>
                            <td>{{activeData.rate.day_director_order_rate}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 活跃用户本月表格数据 -->
            <div class="today">
                <div class="today_top_right">
                    <div class="time_quantum">
                        <span class="quantum_text" :class="type==1?'choosed':''" @click="chooseTimeSlot(1)">0~10天</span>
                        <span class="quantum_text" :class="type==2?'choosed':''" @click="chooseTimeSlot(2)">10~20天</span>
                        <span class="quantum_text" :class="type==3?'choosed':''" @click="chooseTimeSlot(3)">20天以上</span>
                    </div>
                    <div class="quantum_rate">
                        <div class="today_num">
                            <span>本月活跃:{{activeData.thisMonth.total_user_num}}人</span>
                            <span>{{activeData.rate.month_rate}} 环比上月</span>
                        </div>
                        <div>上月活跃:{{activeData.lastMonth.total_user_num}}人</div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>会员</th>
                            <th>团长</th>
                            <th>总监</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>本月活跃用户</td>
                            <td>{{activeData.thisMonth.member_user_num?activeData.thisMonth.member_user_num:0}}</td>
                            <td>{{activeData.thisMonth.leader_user_num?activeData.thisMonth.leader_user_num:0}}</td>
                            <td>{{activeData.thisMonth.director_user_num?activeData.thisMonth.director_user_num:0}}</td>
                        </tr>
                        <tr>
                            <td>本月下单活跃用户 {{activeData.thisMonth.total_order_user_rate}}</td>
                            <td>{{activeData.thisMonth.member_order_user_rate}}</td>
                            <td>{{activeData.thisMonth.leader_order_user_rate}}</td>
                            <td>{{activeData.thisMonth.director_order_user_rate}}</td>
                        </tr>
                        <tr>
                            <td>本月活跃用户下单数 {{activeData.thisMonth.total_order_num}}</td>
                            <td>{{activeData.thisMonth.member_order_num?activeData.thisMonth.member_order_num:0}}</td>
                            <td>{{activeData.thisMonth.leader_order_num?activeData.thisMonth.leader_order_num:0}}</td>
                            <td>{{activeData.thisMonth.director_order_num?activeData.thisMonth.director_order_num:0}}</td>
                        </tr>
                        <tr>
                            <td>上月活跃用户</td>
                            <td>{{activeData.lastMonth.member_user_num?activeData.lastMonth.member_user_num:0}}</td>
                            <td>{{activeData.lastMonth.leader_user_num?activeData.lastMonth.leader_user_num:0}}</td>
                            <td>{{activeData.lastMonth.director_user_num?activeData.lastMonth.director_user_num:0}}</td>
                        </tr>
                        <tr>
                            <td>上月下单活跃用户 {{activeData.lastMonth.total_order_user_rate}}</td>
                            <td>{{activeData.lastMonth.member_order_user_rate}}</td>
                            <td>{{activeData.lastMonth.leader_order_user_rate}}</td>
                            <td>{{activeData.lastMonth.director_order_user_rate}}</td>
                        </tr>
                        <tr>
                            <td>上月活跃用户下单数 {{activeData.lastMonth.total_order_num}}</td>
                            <td>{{activeData.lastMonth.member_order_num?activeData.lastMonth.member_order_num:0}}</td>
                            <td>{{activeData.lastMonth.leader_order_num?activeData.lastMonth.leader_order_num:0}}</td>
                            <td>{{activeData.lastMonth.director_order_num?activeData.lastMonth.director_order_num:0}}</td>
                        </tr>
                        <tr>
                            <td>环比上月下单数 {{activeData.rate.month_order_rate}}</td>
                            <td>{{activeData.rate.month_member_order_rate}}</td>
                            <td>{{activeData.rate.month_leader_order_rate}}</td>
                            <td>{{activeData.rate.month_director_order_rate}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 右侧沉睡用户表格 -->
            <div class="activeRight">
                <div class="activeRightTop">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>0~10天</th>
                                <th>10~20天</th>
                                <th>20天以上</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>本月活跃</td>
                                <td>{{activeData.thisMonth.one_active_user}}</td>
                                <td>{{activeData.thisMonth.two_active_user}}</td>
                                <td>{{activeData.thisMonth.three_active_user}}</td>
                            </tr>
                            <tr>
                                <td>上月活跃</td>
                                <td>{{activeData.lastMonth.one_active_user==null?0:activeData.lastMonth.one_active_user}}</td>
                                <td>{{activeData.lastMonth.two_active_user==null?0:activeData.lastMonth.two_active_user}}</td>
                                <td>{{activeData.lastMonth.three_active_user==null?0:activeData.lastMonth.three_active_user}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="activeRightBottom">
                    <div class="sleepText">沉睡会员 <span class="sleepTip">(48小时以上未商品分享的高级会员)</span></div>
                    <div class="sleepSort">
                        <span class="sleepUser">总监:{{sleepUserData.directorNum}}人</span>
                        <span class="sleepLook" @click="lookSleepData(3)">查看</span>
                    </div>
                    <div class="sleepSort">
                        <span class="sleepUser">团长:{{sleepUserData.leaderNum}}人</span>
                        <span class="sleepLook" @click="lookSleepData(2)">查看</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 活跃用户折线图 -->
        <div class="activeDataList">
            <div class="userChart">
                <div class='userText'>活跃用户趋势</div>
                <div class="userTop">
                <div class="userTop-left" @click="chooseRan">
                    <span :class='range==0?"range":"leftText"'>总体</span>
                    <span :class='range==1?"range":"leftText"'>会员</span>
                    <span :class='range==2?"range":"leftText"'>团长</span>
                    <span :class='range==3?"range":"leftText"'>总监</span>
                </div>
                <div class="userTop-right">
                    <span :class='text=="今日"?"select":"inSelect"' @click="limitsTime">今日</span>
                    <span :class='text=="本月"?"select":"inSelect"' @click="limitsTime">本月</span>
                    <div class="search-group">
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                        <div class="split-line">
                            <div></div>
                        </div>
                        <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                    </div>
                    <button class="action-btn" @click="queryData">查询</button>
                </div>
                </div>
                <div class="echarts-g">
                    <div style="width: 100%; height: 100%;" ref="chart"></div>
                </div>
            </div>
            <!-- 沉睡用户近七天折线图 -->
            <div class="echartsSleep">
                <div class="wed-tetx">近七天沉睡用户趋势</div>
                <sleep-echart></sleep-echart>
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
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'

import echarts from 'echarts/lib/echarts'
import tooltip from 'echarts/lib/component/tooltip'
import title from 'echarts/lib/component/title'
import line from 'echarts/lib/chart/line'
import legend from 'echarts/lib/component/legend'
import sleepEchart from '../content/echart.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'flat-picker': flatPicker,
        'sleep-echart': sleepEchart,
    },
    data(){
        const now = new Date();
        let nStr = '';
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return{
            createTimeBegin:'',
            createTimeEnd:'',
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            activeData:'',
            conditions:{
                'is_today':'T',
                'user_type':0,
                'start_time':'',
                'end_time':''
            },
            range:0,// 0全部用户类型   1会员   2团长   3总监,默认全部用户类型
            text:"今日", //默认查询今日
            echart:null,
            sleepUserData:{
                leaderNum:'',
                directorNum:''
            },
            type:1,//活跃用户时间段，1表示0~10天   2表示10~20天   3表示20天以上
        }
    },
    created(){
        this.getActiveUser();//获取活跃用户总数
        this.getActiveChart();//活跃用户折线图
        this.getSleepUser();//沉睡用户数据
    },
    methods:{
        lookSleepData(e){//查看沉睡列表
            console.log(e)
            this.$emit("sleepDataList",e)
        },
        getActiveUser(){//获取活跃用户总数
            this.showLoading()
            request({
                url:setting.urls.activeUser,
                method:'get',
                params:{
                    'type':this.type
                }
            }).then(res=>{
                if(res.status == 200){
                    console.log(res,"活跃用户")
                    if(res.data.code == 200){
                        const rest = res.data.data;
                        this.activeData = Object.assign([], rest)
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
        getActiveChart(){//活跃用户折线图
            request({
                url:setting.urls.activeChart,
                method:'get',
                params:this.conditions
            }).then(res=>{
                // console.log(res,"活跃用户折线图")
                if(res.data.data.length <= 0){
                    this.alert('活跃用户折线图无数据')
                }
                this.createOptions(res.data.data)
            }).catch((e) => {
                this.alert('加载用户折线图失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        chooseTimeSlot(e){//活跃用户筛选时间段
            this.type = e;
            this.getActiveUser()
        },
        getSleepUser(){//获取沉睡用户数据
            request({
                url:setting.urls.sleepUser,
                method:'get',
                params:{}
            }).then(res=>{
                // console.log(res,"沉睡用户数据")
                if(res.status == 200){
                    if(res.data.code == 200){
                        const rest = res.data.data;
                        this.sleepUserData.leaderNum = rest.leader_num;
                        this.sleepUserData.directorNum = rest.director_num;
                    }
                }
            }).catch((e) => {
                this.alert('加载沉睡用户数据失败')
            }).then(() => {
                // this.hideLoading()
            })
        },
        createTitle: function(){
            return [{
                text: '',
                textStyle: {
                color: '#333333',
                fontWeight: 'bold',
                fontSize: 24
                }
            }]
        },
        createLegend: function(){
            return {
                data: ['活跃用户', '活跃下单用户'],
            }
        },
        createGrid: function(){
            return [{
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }]
        },
        createXAxis: function(data){
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
        createYAxis: function(){
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
                axisLabel: {
                }
            }]
        },
        createSeries: function(data){
            return [{
                name: '活跃用户',
                type: 'line',
                data: data.newDataArr
            },{
                name: '活跃下单用户',
                type: 'line',
                data: data.converData
            }]
            
        },
        createOptions: function(allData){
            const seriesData = {newDataArr:[],converData:[]};
            const xData = [];
            for (let v = 0; v < allData.length; v++) {
                xData.push(allData[v].statistics_day);
                seriesData.newDataArr.push(allData[v].user_num);
                seriesData.converData.push(allData[v].user_order_num);
            }
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
            if(!this.echart){
                this.echart = echarts.init(this.$refs.chart)
            }
            this.echart.setOption(options)
        },
        getMonth(type, months) {// 获取时间段函数 ==> type为字符串类型，有两种选择，"s"代表开始,"e"代表结束。months为数字类型，不传或0代表本月，-1代表上月，1代表下月
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
            month = month < 10 ? "0" + month: month;
            const date = data.getDate();
            const firstday = year + "-" + month + "-" + "01";
            let lastday = "";
            if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
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
        chooseRan(e){//筛选会员
            switch (e.target.innerHTML) {
                case "总体":
                this.conditions['user_type'] = 0;
                this.range = 0;
                this.getActiveChart()
                break;
                case "会员":
                this.conditions['user_type'] = 1;
                this.range = 1;
                this.getActiveChart()
                break;
                case "团长":
                this.conditions['user_type'] = 2;
                this.range = 2;
                this.getActiveChart()
                break;
                case "总监":
                this.conditions['user_type'] = 3;
                this.range = 3;
                this.getActiveChart()
                break;
                default:
                break;
            }
        },
        limitsTime(e){//筛选时间段
            this.text = e.target.innerHTML;
            switch (e.target.innerHTML) {
                case '本月':
                this.conditions['is_today'] = 'F';
                this.conditions['start_time'] = this.getMonth("s",0);
                this.conditions['end_time'] = this.getMonth("e",0);
                this.getActiveChart()
                break;
                case '今日':
                this.conditions['is_today'] = 'T';
                this.conditions['start_time'] = '';
                this.conditions['end_time'] = '';
                this.getActiveChart()
                break;
                default:
                break;
            }
        },
        queryData(){//查询按钮
            this.conditions['start_time'] = this.createTimeBegin;
            this.conditions['end_time'] = this.createTimeEnd;
            this.conditions['is_today'] = 'F';
            this.text = '';
            this.getActiveChart()
        },
    }
}
</script>

<style scoped>
.today{width: 35%;height: 470px;padding: 0 10px;box-sizing: border-box;background-color: #ffffff;border-radius: 10px;}
.today_top{width: 100%;display: flex;justify-content: space-between;align-items: center;height: 80px;}
.today_top_right span ,.today_top_right div{font-size: 14px;font-weight: 600;color: #747770;font-family: "微软雅黑";}
.quantum_rate{display: flex;justify-content: space-between;height: 40px;}
.time_quantum{display: flex;height: 40px;align-items: center;}
.quantum_text{display: block;width: 85px;height: 26px;text-align: center;line-height: 26px;font-size: 14px;color: #666666;border: 1px solid #eeeeee;border-radius: 3px;cursor: pointer;}
.today_top span ,.today_top div{font-size: 14px;font-weight: 600;color: #747770;font-family: "微软雅黑";}
.today_num span:last-child{font-size: 14px;color: red;position: relative;bottom: -5px;left: 10px;font-weight: 400;}
.newAddUser{border: 1px solid #eeeeee;border-radius: 10px;padding: 20px;background-color: #f2f2f2;margin-bottom: 30px;}
.userName{font-size: 18px;font-weight: bold;color: #3f413f;height: 40px;}
.addList{display: flex;justify-content: space-between;}
.choosed{color: #52c7f2!important;border: 1px solid #52c7f2;}
/* 右侧沉睡用户表格 */
.activeRight{width: 25%;height: 470px;padding:10px;box-sizing: border-box;background-color: #ffffff;border-radius: 10px;}
.activeRightTop{border: 1px solid #eeeeee;border-radius: 3px;padding: 10px;box-sizing: border-box;margin: 20px 0 40px;}
.activeRightTop>table{text-align: center;}
.activeRightTop>table>tbody>tr td{text-align: center;color: #747770;}
.activeRightBottom{display: flex;flex-direction: column;align-items: center; height: 180px;border: 1px solid #eeeeee;border-radius: 3px;padding: 10px;box-sizing: border-box;}
.sleepText{font-size: 16px;color: #000000;font-weight: bold;height: 50px;line-height: 50px;}
.sleepTip{font-size: 14px;color: #000000;font-weight: bold;font-family: "微软雅黑";}
.sleepUser{font-size: 16px;color: #333333;font-weight: bold;}
.sleepLook{width: 60px;height: 28px;font-size: 14px;color: #ffffff;background-color: #52c7f2;display: block;text-align: center;line-height: 28px;border-radius: 5px;cursor: pointer;}
.sleepSort{width: 100%;height: 40px;line-height: 40px; display: flex;justify-content: space-between;align-items: center;padding: 0 20px;box-sizing: border-box;}

table{border-spacing:0;border: 0;text-align: left;font-size: 14px;}
tbody tr td{border: 0; border-top: 1px solid #E2E2E2;}
tbody>tr:nth-child(even){background-color: transparent;}
tbody tr:last-child>td{color: #52c7f2;}
/* .thisMonth{width: 40%;height: 400px;} */
.detail-container,.detail-data-box{padding: 0;}
.detail-data-box{overflow-y: auto;}
.detail-container{margin-left: 0;}

/* 新增用户趋势 头部 */
.activeDataList{width: 100%;height: 300px;background-color: #eeeeee;border-radius: 10px;margin-top: 10px;box-sizing: border-box;display: flex;justify-content: space-between;}
.userChart{width: 72.5%;background-color: #ffffff;border-radius: 5px;padding: 0 10px;box-sizing: border-box;}
.userText{font-size: 16px;font-weight: 600;color: #747770;font-family: "微软雅黑";height: 40px;line-height: 40px;}
.userTop{display: flex;justify-content: space-between;align-items: center;}
.userTop-left{display: flex;}
.leftText{display: block;width: 85px;height: 26px;text-align: center;line-height: 26px;font-size: 14px;color: #666666;border: 1px solid #eeeeee;border-radius: 3px;cursor: pointer;}
.userTop-right{display: flex;}
.inSelect{font-size: 14px;color: #666666;margin: 0 10px;display: block;position: relative;top: 5px;cursor: pointer;}
/* 新增用户趋势 折线图 */
.echarts-g{height: 220px;}
.range{display: block;width: 85px;height: 26px;text-align: center;line-height: 26px;font-size: 14px;color: #52c7f2;border: 1px solid #52c7f2;border-radius: 3px;cursor: pointer;}
.select{color: #52c7f2;font-size: 14px;margin: 0 10px;display: block;position: relative;top: 5px;cursor: pointer;}
/* 沉睡用户折线图 */
.echartsSleep{width: 25%;height: 100%;background-color: #ffffff;border-radius: 5px;}
.wed-tetx{font-size: 14px;color: #000000;font-weight: bold;margin: 10px 0 10px 10px;}
.imgIcon{width: 20px;height: 20px;position: relative;top: 3px;cursor: pointer;}
/* 模态框 */
#modal-box{width: 300px;position: fixed;display: none;z-index:1000;}
</style>