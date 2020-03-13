<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="start_time" aria-placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="end_time" placeholder="结束时间"></flat-picker>
                </div>
                <div class="search-group">
                    <label>机器人名称:</label>
                    <input type="text" placeholder="请输入" v-model="robot_name">
                </div>
                <button class="search-btn" @click="loadTBData(1)">搜索</button>
                <button class="action-btn" @click="showPool">资金池</button>
                <div class="search-group text-right">
                    <div class="item">
                        <label>新增人数:</label>
                        <span>{{newUserNum}}</span>
                    </div>
                </div>
            </header>
            <div class="table-container">
                <detail-table @sortTBData="sortTBData" @tableBodyClicked="tableBodyClicked" v-bind:tableHeaderFixed="tableHeaderFixed" v-bind:tableBodyClick="tableBodyClick" v-bind:tbData="tbData" v-bind:reduceData="reduceData" v-bind:tableHeader="tableHeader" v-bind:tbType="tbType"></detail-table>
            </div>
        </div>
        <alert v-bind:isShow="showAlert" v-bind:alertParams="alertParams" @alertOkClicked="alertOkClicked"></alert>
        <pop-ups v-bind:isShow="showPop" v-bind:popParams="popParams"></pop-ups>
        <pop-chart v-bind:isShow="showPopChart" v-bind:popParams="popParams"></pop-chart>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import request from '@/axios'
import Alert from '@/components/common/alert.vue'
import PopUps from '@/components/common/popUps.vue'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import PopChart from '@/components/common/popChart.vue'

// require('@/mock')

export default {
    components: {
        'flat-picker': flatPicker,
        'alert': Alert,
        'pop-ups': PopUps,
        'detail-table': DetailTable,
        'pop-chart': PopChart
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 11) ? '0' : '') + (now.getDate() - 1)
        return {
            'start_time': nStr,
            'end_time': nStr,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr
            },
            tbData: [],
            reduceData: [],
            tbType: 'common',
            showAlert: false,
            tableHeader: setting.tableHeader.cpsRobot,
            tableHeaderFixed: true,
            tableBodyClick: true,
            alertParams: { header: '', content: '' },
            showPop: false,
            showPopChart: false,
            popParams: { style: 'width: 23.44rem; height: 17.81rem;', htmlContent: '', popType: 'echart', echartOption: {} },
            newUserNum: 0,
            'robot_name': '',
            currSortType: ''
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        tableBodyClicked: function(evt){
            // console.log(evt.target)
            let target = evt.target;
            // 获取微信名
            if(target.tagName.toLowerCase() == 'tbody'){
                return
            }
            if(target.tagName.toLowerCase() == 'td'){
                target = target.parentNode
            }
            if(target.tagName.toLowerCase() == 'tr'){
                const robotName = target.children[2].innerHTML
                this.$parent.$parent.isShowLoading = true
                // console.log(robotName)
                request({
                    url: '/api/statistics/robot-detail',
                    method: 'get',
                    params: {
                        'robot_name': robotName
                    }
                }).then((resp) => {
                    if(resp.status == 200){
                        const rst = resp.data
                        if(rst.code == 200){
                            this.createRobotOptions(rst.data)
                        }else{
                            this.alert(rst.message || '加载机器人统计数据失败')
                        }
                    }else{
                        this.alert('加载机器人统计数据失败')
                    }
                }).catch((error) => {
                    this.alert('加载机器人统计数据失败')
                }).then(() => {
                    this.$parent.$parent.isShowLoading = false
                })
            }
        },
        createRobotOptions: function(dt){
            const res = {
                newuser: [],
                ordernum: [],
                fromTime: dt[0]['statistics_day'],
                endTime: dt[dt.length - 1]['statistics_day']
            }
            for(let idx = 0; idx < dt.length; idx++){
                res.newuser.push(dt[idx]['new_people_number'] || 0)
                res.ordernum.push(dt[idx]['order_total_number'] || 0)
            }
            const options = {
                title: this.createOptionTitle(),
                legend: this.createOptionLegend(),
                xAxis: this.createOptionXAxis(res.fromTime, res.endTime),
                yAxis: this.createOptionYAxis(),
                series: this.createOptionSeries(res),
                tooltip: {
                    trigger: 'axis'
                }
            }
            // console.log(options)
            this.popParams = Object.assign({}, { style: 'width: 23.44rem; height: 17.81rem;', htmlContent: '', popType: 'echart', echartOption: options })
            this.showPopChart = true
        },
        createDateItems: function(fromTime, endTime){
            const dateItems = [];
            const fromDate = new Date(fromTime), endDate = new Date(endTime);
            while (fromDate <= endDate) {
                const month = fromDate.getMonth() + 1;
                const date = fromDate.getDate();
                dateItems.push(month + '.' + date);
                fromDate.setDate(fromDate.getDate() + 1);
            }
            return dateItems;
        },
        createOptionSeries: function(res){
            return [{
                symbol: 'none',
                lineStyle: {
                    color: '#4880EA',
                    width: 1
                },
                yAxisIndex: 0,
                itemStyle: {
                    color: '#4880EA'
                },
                name: '新增人数量',
                type: 'line',
                data: res.newuser
            }, {
                symbol: 'none',
                lineStyle: {
                    color: '#FFB400',
                    width: 1
                },
                yAxisIndex: 1,
                itemStyle: {
                    color: '#FFB400'
                },
                name: '订单总量',
                type: 'line',
                data: res.ordernum
            }]
        },
        createOptionYAxis: function(){
            return [
                {
                    position: 'left',
                    type: 'value',
                    name: '',
                    textStyle: {
                        color: '#333333',
                        fontSize: 14
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#E5E5E5'
                        }
                    },
                    axisTick: {
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
                        },
                        color: '#333333'
                    }
                },
                {
                    position: 'right',
                    type: 'value',
                    name: '',
                    textStyle: {
                        color: '#333333',
                        fontSize: 14
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
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
                }
            ]
        },
        createOptionXAxis: function(fromTime, endTime){
            return {
                type: 'category',
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
                data: this.createDateItems(fromTime, endTime)
            }
        },
        createOptionLegend: function(){
            return {
                data: ['新增人数量', '订单总量'],
                itemGap: 50,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333333'
                },
                itemWith: 30,
                itemHeight: 4,
                icon: 'rect',
                top: 30
            }
        },
        createOptionTitle: function(){
            return {
                textStyle: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 24
                },
                text: "统计量",
                left: 39,
                top: 28
            }
        },
        sortTBData: function(sortData){
            console.log(sortData)
            if(this.currSortType == sortData.sortType){
                return
            }
            if(!this.currSortType){
                const newTbData = this.tbData
                newTbData.sort(function(a, b){
                    if(sortData.sortType == 'desc'){
                        return b[9] - a[9]
                    }else{
                        return a[9] - b[9]
                    }
                })
                const newReduceData = []
                for(let idx = 0; idx < newTbData.length; idx++){
                    newReduceData.push(this.reduceData[newTbData[idx][0] - 1])
                    newTbData[idx][0] = idx < 9 ? ('0' + (idx + 1)) : (idx + 1)
                }
                this.tbData = newTbData
                this.reduceData = newReduceData
            }else{
                this.tbData.reverse()
                this.reduceData.reverse()
                for(let idx = 0; idx < this.tbData.length; idx++){
                    this.tbData[idx][0] = idx < 9 ? ('0' + (idx + 1)) : (idx + 1)
                }
            }
            this.currSortType = sortData.sortType
        },
        loadTBData: function(){
            console.log('load table data')
            this.$parent.$parent.isShowLoading = true
            request({
                url: '/api/statistics/robot',
                method: 'get',
                params: {
                    'start_time': this.start_time,
                    'end_time': this.end_time,
                    'robot_name': this.robot_name
                }
            }).then((resp) => {
                if(resp.status == 200){
                    const rst = resp.data
                    if(rst.code == 200){
                        this.createTBData(rst.data)
                    }else{
                        this.alert(rst.message || '加载机器人管理数据失败')
                    }
                }else{
                    this.alert('加载机器人管理数据失败')
                }
            }).catch((error) => {
                this.alert('加载机器人管理数据失败')
            }).then(() => {
                this.$parent.$parent.isShowLoading = false
            })
        },
        createTBData: function(dt){
            console.log(dt)
            // 设置表头前四天时间
            if(dt['list'] && dt['list'][0] && dt['list'][0]['detail_data'] && dt['list'][0]['detail_data'].length){
                for(let idx = 0; idx < dt['list'][0]['detail_data'].length; idx++){
                    for(let idxx = 0; idxx < this.tableHeader[0].length; idxx++){
                        if(this.tableHeader[0][idxx].name == 'time' + (idx + 1)){
                            this.tableHeader[0][idxx].name = dt['list'][0]['detail_data'][idx]['statistics_day']
                            break
                        }
                    }
                }
            }
            // 设置新增人数
            this.newUserNum = dt['total_people_number'] || 0
            // 设置表格数据
            const tbData = []
            // 设置表格中的提示数据
            const reduceData = []
            for(let idx = 0; idx < dt.list.length; idx++){
                tbData.push([])
                // 序号
                tbData[idx].push((idx + 1 < 10 ? '0' : '') + (idx + 1))
                tbData[idx].push(dt.list[idx]['statistics_day'] || 0)
                tbData[idx].push(dt.list[idx]['robot_name'] || 0)
                tbData[idx].push(dt.list[idx]['robot_alias_name'] || 0)
                tbData[idx].push(dt.list[idx]['detail_data'][0]['order_total_number'] || 0)
                tbData[idx].push(dt.list[idx]['detail_data'][1]['order_total_number'] || 0)
                tbData[idx].push(dt.list[idx]['detail_data'][2]['order_total_number'] || 0)
                tbData[idx].push(dt.list[idx]['detail_data'][3]['order_total_number'] || 0)
                tbData[idx].push(dt.list[idx]['new_people_number'] || 0)
                tbData[idx].push(dt.list[idx]['order_total_number'] || 0)
                tbData[idx].push(dt.list[idx]['tb_order_number'] || 0)
                tbData[idx].push(dt.list[idx]['jd_order_number'] || 0)
                tbData[idx].push(dt.list[idx]['pdd_order_number'] || 0)
                reduceData.push({
                    'reduce_proportion': dt.list[idx]['reduce_proportion'],
                    'special_reduce_show': dt.list[idx]['special_reduce_show'] || 'F'
                })
            }
            this.tbData = Object.assign([], tbData)
            this.reduceData = Object.assign([], reduceData)
            this.currSortType = ''
        },
        alertOkClicked: function(){
            this.showAlert = false
        },
        alert: function(str){
            this.alertParams.header = '提示信息'
            this.alertParams.content = str
            this.showAlert = true
        },
        showPool: function(){
            console.log('显示资金池')
            this.$parent.$parent.isShowLoading = true
            request({
                url: '/api/statistics/pool',
                method: 'get',
                params: {}
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        let str = '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">应收未确认待收款资金池:<span style="color: #ff2a2a;">' + (result.data['pool_one'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">已确认待收款资金池:<span style="color: #ff2a2a;">' + (result.data['pool_two'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">预估返利资金池:<span style="color: #ff2a2a;">' + (result.data['pool_three'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">结算返利资金池:<span style="color: #ff2a2a;">' + (result.data['pool_four'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">提现资金池:<span style="color: #ff2a2a;">' + (result.data['pool_five'] || 0) + '</span></div>'
                        str += '<div style="width: 49%; display: inline-block; height: 1.5rem; line-height: 1.5rem;">余额资金池:<span style="color: #ff2a2a;">' + (result.data['pool_six'] || 0) + '</span></div>'
                        this.popParams.htmlContent = str
                        this.popParams.style = {
                            'font-size': '0.5rem',
                            'width': '20rem',
                            'height': '8.21rem',
                            'padding': '1.25rem 0.625rem'
                        }
                        this.showPop = true
                    }else{
                        this.alert(result.message || '加载资金池数据失败')
                    }
                }else{
                    this.alert('加载资金池数据失败')
                }
            }).catch((error) => {
                this.alert('加载资金池数据失败')
            }).then(() => {
                this.$parent.$parent.isShowLoading = false
            })
        },
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.table-container { overflow: hidden; }
</style>