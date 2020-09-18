<template>
    <div >
        <div v-if="chartData.name=='addUser'" >
            <h1>新增用户</h1>
            <div class="scrollBox">
                <div class="every_scroll">
                    <table class="table">
                        <thead>
                            <td></td>
                            <td>总新增</td>
                            <td>总下载</td>
                            <td>总转化</td>
                            <td>美团H5注册</td>
                            <td>美团H5下载</td>
                            <td>其他渠道下载</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>今日</td>
                                <td>{{chartData.value.today.user_num}}<span class="notice">环比昨日:{{chartData.value.rate.day_rate}}</span></td>
                                <td>{{chartData.value.today.download_num}}<span class="notice">环比昨日:{{chartData.value.rate.day_rate}}</span></td>
                                <td>{{chartData.value.today.have_order_num}}<span class="notice">环比昨日:{{chartData.value.rate.day_valid_change_rate}}</span></td>
                                <td>{{chartData.value.today.mt_new_num}}</td>
                                <td>{{chartData.value.today.mt_download_num}}</td>
                                <td>{{chartData.value.today.other_download_num}}</td>
                            </tr>
                            <tr>
                                <td>昨日</td>
                                <td>{{chartData.value.yesterday.user_num}}</td>
                                <td>{{chartData.value.yesterday.download_num}}</td>
                                <td>{{chartData.value.yesterday.have_order_num}}</td>
                                <td>{{chartData.value.yesterday.mt_new_num}}</td>
                                <td>{{chartData.value.yesterday.mt_download_num}}</td>
                                <td>{{chartData.value.yesterday.other_download_num}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <pieChart v-bind:pieData='pieData' v-bind:name='name[0]'></pieChart>
                    </div>
                </div>
                <div class="every_scroll">
                    <table class="table">
                        <thead>
                            <td></td>
                            <td>总新增</td>
                            <td>总下载</td>
                            <td>总转化</td>
                            <td>美团H5注册</td>
                            <td>美团H5下载</td>
                            <td>其他渠道下载</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>本月</td>
                                <td>{{chartData.value.thisMonth.user_num}}<span class="notice">环比上月:{{chartData.value.rate.month_rate}}</span></td>
                                <td>{{chartData.value.thisMonth.download_num}}<span class="notice">环比上月:{{chartData.value.rate.day_rate}}</span></td>
                                <td>{{chartData.value.thisMonth.have_order_num}}<span class="notice">环比上月:{{chartData.value.rate.month_valid_change_rate}}</span></td>
                                <td>{{chartData.value.thisMonth.mt_new_num}}</td>
                                <td>{{chartData.value.thisMonth.mt_download_num}}</td>
                                <td>{{chartData.value.thisMonth.other_download_num}}</td>
                            </tr>
                            <tr>
                                <td>上月</td>
                                <td>{{chartData.value.lastMonth.user_num}}</td>
                                <td>{{chartData.value.lastMonth.download_num}}</td>
                                <td>{{chartData.value.lastMonth.have_order_num}}</td>
                                <td>{{chartData.value.lastMonth.mt_new_num}}</td>
                                <td>{{chartData.value.lastMonth.mt_download_num}}</td>
                                <td>{{chartData.value.lastMonth.other_download_num}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <pieChart v-bind:pieData='pieData' v-bind:name='name[1]'></pieChart>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="chartData.name=='lifeUser'"  >
            <h1>活跃用户</h1>
            <div class="scrollBox">
                <div class="every_scroll">
                    <table class="table">
                        <thead>
                            <td></td>
                            <td>总用户</td>
                            <td>活跃用户</td>
                            <td>下单活跃用户</td>
                            <td>活跃用户下单率</td>
                            <td>下单数</td>
                            <td>环比昨日下单数</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>今日</td>
                                <td>{{chartData.value.today.total_user_num}}</td>
                                <td>{{chartData.value.today.total_user_num}}</td>
                                <td>{{chartData.value.today.total_order_user_num}}</td>
                                <td>{{chartData.value.today.mt_new_num}}</td>
                                <td>{{chartData.value.today.total_order_num}}</td>
                                <td>{{chartData.value.rate.day_order_rate}}</td>
                            </tr>
                            <tr>
                                <td>昨日</td>
                                <td>{{chartData.value.yesterday.user_num}}</td>
                                <td>{{chartData.value.yesterday.download_num}}</td>
                                <td>{{chartData.value.yesterday.have_order_num}}</td>
                                <td>{{chartData.value.yesterday.mt_new_num}}</td>
                                <td>{{chartData.value.yesterday.mt_download_num}}</td>
                                <td>{{chartData.value.yesterday.other_download_num}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <pieChart v-bind:pieData='pieData' v-bind:name='name[0]'></pieChart>
                    </div>
                </div>
                <div class="every_scroll">
                    <table class="table">
                        <thead>
                            <td></td>
                            <td>总用户</td>
                            <td>活跃用户</td>
                            <td>下单活跃用户</td>
                            <td>活跃用户下单率</td>
                            <td>下单数</td>
                            <td>环比上月下单数</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>本月</td>
                                <td>{{chartData.value.thisMonth.user_num}}</td>
                                <td>{{chartData.value.thisMonth.download_num}}</td>
                                <td>{{chartData.value.thisMonth.have_order_num}}</td>
                                <td>{{chartData.value.thisMonth.mt_new_num}}</td>
                                <td>{{chartData.value.thisMonth.mt_download_num}}</td>
                                <td>{{chartData.value.thisMonth.other_download_num}}</td>
                            </tr>
                            <tr>
                                <td>上月</td>
                                <td>{{chartData.value.lastMonth.user_num}}</td>
                                <td>{{chartData.value.lastMonth.download_num}}</td>
                                <td>{{chartData.value.lastMonth.have_order_num}}</td>
                                <td>{{chartData.value.lastMonth.mt_new_num}}</td>
                                <td>{{chartData.value.lastMonth.mt_download_num}}</td>
                                <td>{{chartData.value.lastMonth.other_download_num}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <pieChart v-bind:pieData='pieData' v-bind:name='name[1]'></pieChart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PieChart from "./pieChart.vue"
    export default {
        props: ['chartData'],
        components: {
            'pieChart': PieChart,
        },
        data() {
            return {
                ops: {
                    vuescroll: {},
                    scrollPanel: {},
                    rail: {},
                    bar: {}
                },
                pieData: {},
                name: ['addDate','addMonth']
            }
        },
        mounted() {
            if (this.chartData) {
                this.getChartData();
            }
        },
        methods: {
            getChartData() {
                this.pieData = Object.assign({}, this.chartData.value);
                // console.log(this.chartData);
            }
        }
    }
</script>

<style scoped>
    .content{
        flex: 1;
        height: 0;
        overflow: hidden;
        overflow-y: auto;
    }
    .table {
        width: 40rem;
        font-size: 0.5rem;
    }
    h1{
        margin-top: 0.1rem;
        font-size: 0.8rem;
    }
    td {
        background-color: white;
    }

    thead>td {
        background-color: #61a5e8;
        color: white;
        /* font-size: 0.5rem; */
    }

    tr td:nth-child(1) {
        background-color: #61a5e8;
        color: white;
    }

    .notice {
        color: red;
        font-size: 0.2rem;
        display: block;
    }
    .scrollBox {
        height: 15rem;
        overflow-x: scroll;
        /* 内容会被裁剪，会以滚动条显示 */
        overflow-y: hidden;  /* 超出内容不可见 */
        white-space: nowrap;  /* 不换行 */
        /* 文本不会换行，会在同一行上继续，直到遇到<br>为止 */
      }
      .every_scroll{
          width: 40rem;
          display: inline-table;
          margin-bottom: 1rem;
      }
      .every_scroll:first-child{
          margin-right: 2rem;
      }
</style>
