<template>
    <div class="goodsshare">
        <div class="shareTitle">商品分享</div>
        <div class="shareList" v-if="shareData">
            <div class="shareLable">
                <div class="lable_top">
                    <div class="lable_num">
                        <span class="share_num">今日分享:{{shareData.today.share_num}}次</span>
                        <span class="chain">{{shareData.rate.day_rate}} 环比昨日</span>
                        <span class="check" @click="shareListData('今日')">查看商品</span>
                    </div>
                    <div class="lable_row">
                        <span class="share_num">昨日分享：{{shareData.yesterday.share_num}}次 </span>
                        <span class="check" @click="shareListData('昨日')">查看商品</span>
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>淘宝</th>
                            <!-- <th>天猫</th> -->
                            <th>京东</th>
                            <th>拼多多</th>
                            <!-- <th>唯品会</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>今日分享次数</td>
                            <td>{{shareData.today.tb_share_num}}</td>
                            <td>{{shareData.today.jd_share_num}}</td>
                            <td>{{shareData.today.pdd_share_num}}</td>
                        </tr>
                        <tr>
                            <td>今日分享转化率 {{shareData.today.valid_change_rate}}</td>
                            <td>{{shareData.today.tb_valid_change_rate}}</td>
                            <td>{{shareData.today.jd_valid_change_rate}}</td>
                            <td>{{shareData.today.pdd_valid_change_rate}}</td>
                        </tr>
                        <tr>
                            <td>昨日分享次数</td>
                            <td>{{shareData.yesterday.tb_share_num}}</td>
                            <td>{{shareData.yesterday.jd_share_num}}</td>
                            <td>{{shareData.yesterday.pdd_share_num}}</td>
                        </tr>
                        <tr>
                            <td>昨日分享转化率 {{shareData.yesterday.valid_change_rate}}</td>
                            <td>{{shareData.yesterday.tb_valid_change_rate}}</td>
                            <td>{{shareData.yesterday.jd_valid_change_rate}}</td>
                            <td>{{shareData.yesterday.pdd_valid_change_rate}}</td>
                        </tr>
                        <tr>
                            <td>环比昨日转化率 {{shareData.rate.day_valid_change_rate}}</td>
                            <td>{{shareData.rate.day_tb_valid_change_rate}}</td>
                            <td>{{shareData.rate.day_jd_valid_change_rate}}</td>
                            <td>{{shareData.rate.day_pdd_valid_change_rate}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="shareLable">
                <div class="lable_top">
                    <div class="lable_num">
                        <span class="share_num">本月分享:{{shareData.thisMonth.share_num}}次</span>
                        <span class="chain">{{shareData.rate.month_rate}} 环比上月</span>
                        <span class="check" @click="shareListData('本月')">查看商品</span>
                    </div>
                    <div class="lable_row">
                        <span class="share_num">上月分享：{{shareData.lastMonth.share_num}}次 </span>
                        <span class="check" @click="shareListData('上月')">查看商品</span>
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>淘宝</th>
                            <th>京东</th>
                            <th>拼多多</th>
                            <!-- <th>天猫</th> -->
                            <!-- <th>唯品会</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>本月分享次数</td>
                            <td>{{shareData.thisMonth.tb_share_num}}</td>
                            <td>{{shareData.thisMonth.jd_share_num}}</td>
                            <td>{{shareData.thisMonth.pdd_share_num}}</td>
                        </tr>
                        <tr>
                            <td>本月分享转化率 {{shareData.thisMonth.valid_change_rate}}</td>
                            <td>{{shareData.thisMonth.tb_valid_change_rate}}</td>
                            <td>{{shareData.thisMonth.jd_valid_change_rate}}</td>
                            <td>{{shareData.thisMonth.pdd_valid_change_rate}}</td>
                        </tr>
                        <tr>
                            <td>上月分享次数</td>
                            <td>{{shareData.lastMonth.tb_share_num}}</td>
                            <td>{{shareData.lastMonth.jd_share_num}}</td>
                            <td>{{shareData.lastMonth.pdd_share_num}}</td>
                        </tr>
                        <tr>
                            <td>上月分享转化率 {{shareData.lastMonth.valid_change_rate}}</td>
                            <td>{{shareData.lastMonth.tb_valid_change_rate}}</td>
                            <td>{{shareData.lastMonth.jd_valid_change_rate}}</td>
                            <td>{{shareData.lastMonth.pdd_valid_change_rate}}</td>
                        </tr>
                        <tr>
                            <td>环比上月转化率 {{shareData.rate.month_valid_change_rate}}</td>
                            <td>{{shareData.rate.month_tb_valid_change_rate}}</td>
                            <td>{{shareData.rate.month_jd_valid_change_rate}}</td>
                            <td>{{shareData.rate.month_pdd_valid_change_rate}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="shareEcharts">
            <div class='shareTrend'>商品分享趋势</div>
            <div class="shareTop">
                <Select :selectParams="selectData" @selectOptsClicked="chooseOption"></Select>
                <div class="shareTop-right">
                    <span :class='text=="本月"?"selected":"inSelect"' @click="limitsTime">本月</span>
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
            <div class="echarts_share">
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
import select from '../common/select.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'flat-picker': flatPicker,
        'Select': select,
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
            shareData:'',
            selectData: {
                label: '平台选择',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '总体'
                }, {
                    value: 'tb',
                    text: '淘宝'
                }, {
                    value: 'jd',
                    text: '京东'
                }, {
                    value: 'pdd',
                    text: '拼多多'
                }]
            },
            text:'本月',
            sharEchartParam:{
                'order_type':'0',//0全部 tb淘宝 jd京东 pdd拼多多
                'start_time':'',
                'end_time':''
            },
            echart:null
        }
    },
    created(){
        this.getGoodsShare();//商品分享数据
        this.getSharEchart();//商品分享折线图
    },
    methods:{
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
                        this.shareData = Object.assign([], res.data.data)
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
        getSharEchart(){
            request({
                url:setting.urls.sharEchart,
                method:'get',
                params:this.sharEchartParam
            }).then(res=>{
                // console.log(res,"商品分享折线图")
                this.createOptions(res.data.data)
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
                data: ['分享商品次数', '转化商品次数'],
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
                name: '分享商品次数',
                type: 'line',
                data: data.shareNum
            },{
                name: '转化商品次数',
                type: 'line',
                data: data.changeNum
            }]
        },
        createOptions: function(allData){
            const seriesData = {shareNum:[],changeNum:[]};
            const xData = [];
            for (let v = 0; v < allData.length; v++) {
                xData.push(allData[v].statistics_day);
                seriesData.shareNum.push(allData[v].share_number);
                seriesData.changeNum.push(allData[v].order_number);
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
        limitsTime(e){//筛选时间段
            this.text = e.target.innerHTML;
            this.sharEchartParam['start_time'] = this.getMonth("s",0);
            this.sharEchartParam['end_time'] = this.getMonth("e",0);
            this.getSharEchart();
        },
        queryData(){//查询按钮
            this.sharEchartParam['start_time'] = this.createTimeBegin;
            this.sharEchartParam['end_time'] = this.createTimeEnd;
            this.text = '';
            console.log(this.sharEchartParam)
            this.getSharEchart();
        },
        chooseOption(e){//筛选平台
            if(e==''){
                this.sharEchartParam['order_type'] = '0';
                this.getSharEchart();
            }
            this.sharEchartParam['order_type'] = e;
            this.getSharEchart();
        },
        shareListData(time){//点击分享时间
            this.$emit("shareTime",time)
        }
    }
}
</script>

<style scoped>
.goodsshare{border: 1px solid #eeeeee;border-radius: 10px;padding: 20px;background-color: #f2f2f2;margin-bottom: 30px;}
.shareTitle{font-size: 18px;font-weight: bold;color: #3f413f;height: 40px;}
.shareList{display: flex;justify-content: space-between;}
.shareLable{width: 45%;height: 370px;padding: 0 10px;box-sizing: border-box;background-color: #ffffff;border-radius: 10px;}
.lable_top{width: 100%;display: flex;justify-content: space-between;align-items: center;height: 50px;}
.lable_num,.lable_row{height: 50px;}
.share_num,.check{font-size: 14px;font-weight: 600;color: #747770;font-family: "微软雅黑";}
.chain{font-size: 14px;color: red;position: relative;bottom: -8px;margin: 0 10px;}
.check{padding: 1px 3px; background-color: #52c7f2;color: #ffffff;border-radius: 5px;cursor: pointer;}
/* *************** */
.table{border-spacing:0;border: 0;text-align: left;font-size: 14px;}
.table>tbody>tr td{border-left: 0;}
tbody>tr:nth-child(even){background-color: transparent;}
.shareEcharts{width: 100%;height: 340px;background-color: #ffffff;border-radius: 10px;margin-top: 10px;padding: 0 10px;box-sizing: border-box;}
.shareTrend{font-size: 16px;font-weight: 600;color: #747770;font-family: "微软雅黑";height: 40px;line-height: 40px;}
.shareTop{display: flex;justify-content: space-between;align-items: center;}
.select[lable]{color: red;}

.select{font-size: 14px;}
.shareTop-right{display: flex;align-items: center;}
.selected{color: #52c7f2;font-size: 14px;margin: 0 10px;position: relative;top: -5px;cursor: pointer;}
.inSelect{font-size: 14px;color: #666666;margin: 0 10px;position: relative;top: -5px;cursor: pointer;}
.action-btn{position: relative;top: -5px;}
.echarts_share{height: 250px;}
</style>