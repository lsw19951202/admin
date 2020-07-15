<template>
    <div style="width: 100%; height: 260px;" ref="chart"></div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'

import echarts from 'echarts/lib/echarts'
import tooltip from 'echarts/lib/component/tooltip'
import title from 'echarts/lib/component/title'
import line from 'echarts/lib/chart/line'
import legend from 'echarts/lib/component/legend'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    data(){
        return{
            echart:null,
            startTimeWeek:'',
            endTimeWeek:''
        }
    },
    created(){
        this.getSleepChart();//沉睡用户折线图
        // this.getTime();
    },
    methods:{
        GMTToStr(time){
            const date = new Date(time)
            const Str=date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' + 
            date.getDate() + ' ' + 
            date.getHours() + ':' + 
            date.getMinutes() + ':' + 
            date.getSeconds()
            return Str
        },
        getTime(){// 近七天
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.startTimeWeek = this.GMTToStr(start);
            this.endTimeWeek = this.GMTToStr(end);
            console.log()
        },
        getSleepChart(){//获取沉睡用户折线图
            this.showLoading()
            request({
                url:setting.urls.sleepChart,
                method:'get',
                params:{
                    'order_type':'0',
                    'start_time':'2020-07-10',
                    'end_time':'2020-07-15'
                }
            }).then(res=>{
                // console.log(res,"沉睡用户折线图")
                if(res.status == 200){
                    if(res.data.data.length <= 0){
                        this.alert('沉睡用户折线图无数据')
                    }
                    this.createOptions(res.data.data)
                }
            }).catch((e) => {
                this.alert('加载沉睡用户折线图失败')
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
                data: ['沉睡团长', '沉睡总监'],
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
                name: '沉睡团长',
                type: 'line',
                data: data.leader
            },{
                name: '沉睡总监',
                type: 'line',
                data: data.director
            }]
            
        },
        createOptions: function(allData){
            const seriesData = {leader:[],director:[]};
            const xData = [];
            for (let v = 0; v < allData.length; v++) {
                xData.push(allData[v].statistics_day);
                seriesData.leader.push(allData[v].leader_num);
                seriesData.director.push(allData[v].director_num);
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
    }
}
</script>

<style scoped>

</style>