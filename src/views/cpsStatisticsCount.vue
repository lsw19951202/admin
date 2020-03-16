<template>
    <div class="detail-container">
        <div style="width: 100%; height: 100%;" ref="chart"></div>
    </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import tooltip from 'echarts/lib/component/tooltip'
import title from 'echarts/lib/component/title'
import line from 'echarts/lib/chart/line'
import legend from 'echarts/lib/component/legend'
import request from '@/axios'

// require('@/mock')

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    data: () => {
        return {
            echart: null
        }
    },
    created: function(){
        this.loadAllData()
    },
    methods: {
        loadAllData: function(){
            this.showLoading()
            request({
                url: '/api/statistics/all',
                method: 'get',
                params: {}
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createOptions(rst.data)
                    }else{
                        this.alert(rst.message || '加载统计数据失败')
                    }
                }else{
                    this.alert('加载统计数据失败')
                }
            }).catch((error) => {
                this.alert('加载统计数据失败')
            }).then( data => {
                this.hideLoading()
            })
        },
        createDateItems: function(from, to){
            const dateItems = []
            const fromDate = new Date(from), endDate = new Date(to)
            while(fromDate <= endDate){
                const month = fromDate.getMonth() + 1
                const date = fromDate.getDate()
                dateItems.push(month + '.' + date)
                fromDate.setDate(fromDate.getDate() + 1)
            }
            return dateItems
        },
        createTitle: function(){
            return [{
                text: '云瞻信息总业绩图标',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 24
                },
                left: 20,
                top: 10
            }, {
                text: '结算',
                top: 60,
                left: 20,
                textStyle: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 16
                }
            }, {
                text: '预估',
                top: 'middle',
                left: 20,
                textStyle: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 16
                }
            }]
        },
        createLegend: function(){
            return {
                left: 20,
                top: 40,
                data: ['淘宝', '京东', '拼多多', '总业绩'],
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333333'
                },
                itemGap: 50,
                itemWith: 30,
                itemHeight: 4,
                icon: 'rect'
            }
        },
        createGrid: function(){
            return [{
                x: 60, y: 110, width: (this.$refs.chart.clientWidth - 120) / this.$refs.chart.clientWidth * 100 + '%', bottom: '55%'
            }, {
                x: 60, top: '55%', width: (this.$refs.chart.clientWidth - 120) / this.$refs.chart.clientWidth * 100 + '%'
            }]
        },
        createXAxis: function(from, to){
            const dateItems = this.createDateItems(from, to)
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
                data: dateItems
            }, {
                type: 'category',
                gridIndex: 1,
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
                data: dateItems
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
                    formatter: function (value, index) {
                        if (value < 1000) {
                            return value;
                        } else if (value < 10000) {
                            return value / 1000 + 'K';
                        } else if (value < 10000000) {
                            return value / 10000 + 'W';
                        } else if (value < 10000 * 10000) {
                            return value / 10000000 + 'KW';
                        } else {
                            return value / 100000000 + 'E';
                        }
                    }
                }
            }, {
                position: 'left',
                gridIndex: 1,
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
                    formatter: function (value, index) {
                        if (value < 1000) {
                            return value;
                        } else if (value < 10000) {
                            return value / 1000 + 'K';
                        } else if (value < 10000000) {
                            return value / 10000 + 'W';
                        } else if (value < 10000 * 10000) {
                            return value / 10000000 + 'KW';
                        } else {
                            return value / 100000000 + 'E';
                        }
                    }
                }
            }]
        },
        createSeries: function(data){
            return [{
                symbol: 'none',
                lineStyle: {
                    color: '#4880EA',
                    width: 1
                },
                itemStyle: {
                    color: '#4880EA'
                },
                name: '淘宝',
                type: 'line',
                data: data.js.tb
            }, {
                lineStyle: {
                    color: '#FFB400',
                    width: 1
                },
                itemStyle: {
                    color: '#FFB400'
                },
                symbol: 'none',
                name: '京东',
                type: 'line',
                data: data.js.jd
            }, {
                lineStyle: {
                    color: '#FF5520',
                    width: 1
                },
                itemStyle: {
                    color: '#FF5520'
                },
                symbol: 'none',
                name: '拼多多',
                type: 'line',
                data: data.js.pdd
            }, {
                lineStyle: {
                    color: '#94D243',
                    width: 1
                },
                itemStyle: {
                    color: '#94D243'
                },
                symbol: 'none',
                name: '总业绩',
                type: 'line',
                data: data.js.tj
            }, {
                symbol: 'none',
                lineStyle: {
                    color: '#4880EA',
                    width: 1
                },
                itemStyle: {
                    color: '#4880EA'
                },
                name: '淘宝',
                type: 'line',
                data: data.yg.tb,
                xAxisIndex: 1,
                yAxisIndex: 1
            }, {
                lineStyle: {
                    color: '#FFB400',
                    width: 1
                },
                itemStyle: {
                    color: '#FFB400'
                },
                symbol: 'none',
                name: '京东',
                type: 'line',
                data: data.yg.jd,
                xAxisIndex: 1,
                yAxisIndex: 1
            }, {
                lineStyle: {
                    color: '#FF5520',
                    width: 1
                },
                itemStyle: {
                    color: '#FF5520'
                },
                symbol: 'none',
                name: '拼多多',
                type: 'line',
                data: data.yg.pdd,
                xAxisIndex: 1,
                yAxisIndex: 1
            }, {
                lineStyle: {
                    color: '#94D243',
                    width: 1
                },
                itemStyle: {
                    color: '#94D243'
                },
                symbol: 'none',
                name: '总业绩',
                type: 'line',
                data: data.yg.tj,
                xAxisIndex: 1,
                yAxisIndex: 1
            }]
        },
        createOptions: function(dt){
            let fromTime, endTime
            const js = {tb: [], jd: [], pdd: [], tj: []}, yg = {tb: [], jd: [], pdd: [], tj: []}
            for(let idx = 0; idx < dt.estimate_commission.length; idx++){
                if(idx == 0){
                    fromTime = dt.estimate_commission[idx].time
                }
                if(idx == dt.estimate_commission.length - 1){
                    endTime = dt.estimate_commission[idx].time
                }
                yg.tb.push(dt.estimate_commission[idx].value.tb || 0)
                yg.jd.push(dt.estimate_commission[idx].value.jd || 0)
                yg.pdd.push(dt.estimate_commission[idx].value.pdd || 0)
                yg.tj.push(dt.estimate_commission[idx].value.all || 0)
            }
            for(let idx = 0; idx < dt.settle_commission.length; idx++){
                js.tb.push(dt.settle_commission[idx].value.tb || 0);
                js.jd.push(dt.settle_commission[idx].value.jd || 0);
                js.pdd.push(dt.settle_commission[idx].value.pdd || 0);
                js.tj.push(dt.settle_commission[idx].value.all || 0);
            }
            const options = {
                title: this.createTitle(),
                legend: this.createLegend(),
                grid: this.createGrid(),
                backgroundColor: '#FFFFFF',
                xAxis: this.createXAxis(fromTime, endTime),
                yAxis: this.createYAxis(),
                series: this.createSeries({js: js, yg: yg}),
                tooltip: {
                    trigger: 'axis'
                }
            }
            if(!this.echart){
                this.echart = echarts.init(this.$refs.chart)
            }
            this.echart.setOption(options)
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; }
</style>