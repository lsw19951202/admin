<template>
    <div class="newAddUser">
        <div class="userName">新增用户</div>
        <div class="addList">
            <div class="today">
            <div class="today_top">
                <div class="today_num">
                <span>今日新增:{{addUserData.addTopData.todayAddNum}}人</span>
                <span>{{addUserData.addTopData.dayRate}} 环比昨日</span>
                </div>
                <div>昨日新增:{{addUserData.addTopData.yesTodayAddNum}}人</div>
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
                <tr v-for="(item,index) in this.addUserData.addDataList" :key="index">
                    <td>{{item.valid_change_rate==''?item.name:item.name+item.valid_change_rate}}</td>
                    <td>{{item.member_num}}</td>
                    <td>{{item.leader_num}}</td>
                    <td>{{item.director_num}}</td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="today">
            <div class="today_top">
                <div class="today_num">
                <span>本月新增:{{addUserMouth.addTopData.todayAddNum}}人</span>
                <span>{{addUserMouth.addTopData.dayRate}} 环比上月</span>
                </div>
                <div>上月新增:{{addUserMouth.addTopData.yesTodayAddNum}}人</div>
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
                <tr v-for="(item,index) in this.addUserMouth.addDataList" :key="index">
                    <td>{{item.valid_change_rate==''?item.name:item.name+item.valid_change_rate}}</td>
                    <td>{{item.member_num}}</td>
                    <td>{{item.leader_num}}</td>
                    <td>{{item.director_num}}</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        <div class="userChart">
            <div class='userText'>新增用户趋势</div>
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
                    <!-- <label>日期筛选:</label> -->
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
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'flat-picker': flatPicker
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
            addUserData:{//今日
                addTopData:{
                    todayAddNum:0,//今日新增
                    dayRate:'',//环比昨天百分比
                    yesTodayAddNum:0//昨日新增
                },
                addDataList:[]
            },
            addUserMouth:{//本月
                addTopData:{
                    todayAddNum:0,//本月新增
                    dayRate:'',//环比上月百分比
                    yesTodayAddNum:0//上月新增
                },
                addDataList:[]
            },
            conditions:{
                'is_today':'T',
                'user_type':0,
                'start_time':'',
                'end_time':''
            },
            range:0,// 0全部用户类型   1会员   2团长   3总监,默认全部用户类型
            text:"今日", //默认查询今日
        }
    },
    created(){
        this.getTotaluser();//获取新增用户总数
        this.getTotalUserChart();//新增用户折线图
    },
    methods:{
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
                    this.addUserData.addTopData.todayAddNum = rest.today.user_num;
                    this.addUserData.addTopData.dayRate = rest.rate.day_rate;
                    this.addUserData.addTopData.yesTodayAddNum = rest.yesterday.user_num;

                    this.addUserMouth.addTopData.todayAddNum = rest.thisMonth.user_num;
                    this.addUserMouth.addTopData.dayRate = rest.rate.month_rate;
                    this.addUserMouth.addTopData.yesTodayAddNum = rest.lastMonth.user_num;
                    this.addUserData.addDataList.push(
                    {
                        'name':"今日拉新",
                        'valid_change_rate':'',
                        'member_num':rest.today.member_num,
                        'leader_num':rest.today.leader_num,
                        'director_num':rest.today.director_num
                    },{
                        'name':"今日有效转化 ",
                        'valid_change_rate':rest.today.valid_change_rate,
                        'member_num':rest.today.member_valid_change_rate,
                        'leader_num':rest.today.leader_valid_change_rate,
                        'director_num':rest.today.director_valid_change_rate
                    },{
                        'name':"昨日拉新",
                        'valid_change_rate':'',
                        'member_num':rest.yesterday.member_num,
                        'leader_num':rest.yesterday.leader_num,
                        'director_num':rest.yesterday.director_num
                    },{
                        'name':"昨日有效转化 ",
                        'valid_change_rate':rest.yesterday.valid_change_rate,
                        'member_num':rest.yesterday.member_valid_change_rate,
                        'leader_num':rest.yesterday.leader_valid_change_rate,
                        'director_num':rest.yesterday.director_valid_change_rate
                    },{
                        'name':"环比昨日转化率 ",
                        'valid_change_rate':rest.rate.day_valid_change_rate,
                        'member_num':rest.rate.day_member_valid_change_rate,
                        'leader_num':rest.rate.day_leader_valid_change_rate,
                        'director_num':rest.rate.day_director_valid_change_rate
                    }
                    )
                    this.addUserMouth.addDataList.push(
                    {
                        'name':"本月拉新",
                        'valid_change_rate':'',
                        'member_num':rest.thisMonth.member_num,
                        'leader_num':rest.thisMonth.leader_num,
                        'director_num':rest.thisMonth.director_num
                    },{
                        'name':"本月有效转化 ",
                        'valid_change_rate':rest.thisMonth.valid_change_rate,
                        'member_num':rest.thisMonth.member_valid_change_rate,
                        'leader_num':rest.thisMonth.leader_valid_change_rate,
                        'director_num':rest.thisMonth.director_valid_change_rate
                    },{
                        'name':"上月拉新",
                        'valid_change_rate':'',
                        'member_num':rest.lastMonth.member_num,
                        'leader_num':rest.lastMonth.leader_num,
                        'director_num':rest.lastMonth.director_num
                    },{
                        'name':"上月有效转化 ",
                        'valid_change_rate':rest.lastMonth.valid_change_rate,
                        'member_num':rest.lastMonth.member_valid_change_rate,
                        'leader_num':rest.lastMonth.leader_valid_change_rate,
                        'director_num':rest.lastMonth.director_valid_change_rate
                    },{
                        'name':"环比上月转化率 ",
                        'valid_change_rate':rest.rate.month_valid_change_rate,
                        'member_num':rest.rate.month_member_valid_change_rate,
                        'leader_num':rest.rate.month_leader_valid_change_rate,
                        'director_num':rest.rate.month_director_valid_change_rate	
                    }
                    )
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
        getTotalUserChart(){//新增用户折线图
            request({
                url:setting.urls.totalUserChart,
                method:'get',
                params:this.conditions
            }).then(res=>{
                // console.log(res,"新增用户折线图")
                if(res.data.data.length <= 0){
                    this.alert('用户折线图无数据')
                }
                this.createOptions(res.data.data)
            }).catch((e) => {
                this.alert('新增用户折线图失败')
            }).then(() => {
                this.hideLoading()
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
                data: ['新增用户', '转化用户'],
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
                name: '新增用户',
                type: 'line',
                data: data.newDataArr
            },{
                name: '转化用户',
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
                seriesData.converData.push(allData[v].have_order_num);
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
            this.getTotalUserChart()
            break;
            case "会员":
            this.conditions['user_type'] = 1;
            this.range = 1;
            this.getTotalUserChart()
            break;
            case "团长":
            this.conditions['user_type'] = 2;
            this.range = 2;
            this.getTotalUserChart()
            break;
            case "总监":
            this.conditions['user_type'] = 3;
            this.range = 3;
            this.getTotalUserChart()
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
                this.getTotalUserChart()
                break;
                case '今日':
                this.conditions['is_today'] = 'T';
                this.conditions['start_time'] = '';
                this.conditions['end_time'] = '';
                this.getTotalUserChart()
                break;
                default:
                break;
            }
        },
        queryData(){//查询按钮
            this.conditions['start_time'] = this.createTimeBegin;
            this.conditions['end_time'] = this.createTimeEnd;
            this.getTotalUserChart()
        }
    }
}
</script>

<style scoped>
.today_top{width: 100%;display: flex;justify-content: space-between;align-items: center;height: 60px;}
.today_top span ,.today_top div{font-size: 14px;font-weight: 600;color: #747770;font-family: "微软雅黑";}
.today_num span:last-child{font-size: 14px;color: red;position: relative;bottom: -5px;left: 10px;font-weight: 400;}
.newAddUser{border: 1px solid #eeeeee;border-radius: 10px;padding: 20px;background-color: #f2f2f2;margin-bottom: 30px;}
.userName{font-size: 18px;font-weight: bold;color: #3f413f;height: 40px;}
.addList{display: flex;justify-content: space-between;}
table{border-spacing:0;border: 0;text-align: left;font-size: 14px;}
tbody tr td{border: 0; border-top: 1px solid #E2E2E2;}
tbody>tr:nth-child(even){background-color: transparent;}
tbody tr:last-child>td{color: #52c7f2;}
.today{width: 45%;height: 370px;padding: 0 10px;box-sizing: border-box;background-color: #ffffff;border-radius: 10px;}
/* .thisMonth{width: 40%;height: 400px;} */
.detail-container,.detail-data-box{padding: 0;}
.detail-data-box{overflow-y: auto;}
.detail-container{margin-left: 0;}

/* 新增用户趋势 头部 */
.userChart{width: 100%;height: 300px;background-color: #ffffff;border-radius: 10px;margin-top: 10px;padding: 0 10px;box-sizing: border-box;}
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
</style>