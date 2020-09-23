<template>
    <div style="paddingTop:2rem;">
        <div v-if="chartData.name=='addUser'">
            <h1>新增用户</h1>
            <div class="scrollBox">
                <div class="scrollBox_one">
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
                                    <td>{{chartData.value.today.download_num}}<span class="notice">环比昨日:{{chartData.value.rate.day_download_rate}}</span></td>
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
                                    <td>{{chartData.value.thisMonth.download_num}}<span class="notice">环比上月:{{chartData.value.rate.month_download_rate}}</span></td>
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
                <div class="scrollBox_one">
                    <div class="every_scroll">
                        <LineChart v-bind:name='chartData.name'></LineChart>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="chartData.name=='lifeUser'">
            <h1>活跃用户</h1>
            <div class="scrollBox">
                <div class="scrollBox_one">
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
                                    <td>{{chartData.value.userNum.today_user_num}}</td>
                                    <td>{{chartData.value.today.total_user_num}}</td>
                                    <td>{{chartData.value.today.total_order_user_num}}</td>
                                    <td>{{chartData.value.today.total_order_user_rate}}</td>
                                    <td>{{chartData.value.today.total_order_num}}</td>
                                    <td>{{chartData.value.rate.day_order_rate}}</td>
                                </tr>
                                <tr>
                                    <td>昨日</td>
                                    <td>{{chartData.value.userNum.yesterday_user_num}}</td>
                                    <td>{{chartData.value.yesterday.total_user_num}}</td>
                                    <td>{{chartData.value.yesterday.total_order_user_num}}</td>
                                    <td>{{chartData.value.yesterday.total_order_user_rate}}</td>
                                    <td>{{chartData.value.yesterday.total_order_num}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <pieChart v-bind:pieData='pieData' v-bind:name='name[2]'></pieChart>
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
                                    <td>{{chartData.value.userNum.this_month_num}}</td>
                                    <td>{{chartData.value.thisMonth.total_user_num}}</td>
                                    <td>{{chartData.value.thisMonth.total_order_user_num}}</td>
                                    <td>{{chartData.value.thisMonth.total_order_user_rate}}</td>
                                    <td>{{chartData.value.thisMonth.total_order_num}}</td>
                                    <td>{{chartData.value.rate.month_order_rate}}</td>
                                </tr>
                                <tr>
                                    <td>上月</td>
                                    <td>{{chartData.value.userNum.last_month_num}}</td>
                                    <td>{{chartData.value.lastMonth.total_user_num}}</td>
                                    <td>{{chartData.value.lastMonth.total_order_user_num}}</td>
                                    <td>{{chartData.value.lastMonth.total_order_user_rate}}</td>
                                    <td>{{chartData.value.lastMonth.total_order_num}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="display: flex;">
                            <pieChart v-bind:pieData='pieData' v-bind:name='name[3]'></pieChart>
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
                                        <tbody v-if="activeData">
                                            <tr>
                                                <td>本月活跃</td>
                                                <td>{{activeData.thisMonth.one_active_user==null?0:activeData.thisMonth.one_active_user}}</td>
                                                <td>{{activeData.thisMonth.two_active_user==null?0:activeData.thisMonth.two_active_user}}</td>
                                                <td>{{activeData.thisMonth.three_active_user==null?0:activeData.thisMonth.three_active_user}}</td>
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

                    </div>
                </div>
                <div class="scrollBox_one">
                    <div class="every_scroll">
                        <LineChart v-bind:name='chartData.name'></LineChart>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="chartData.name=='orderUser'">
            <h1>下单用户</h1>
            <div class="scrollBox">
                <div class="scrollBox_one">
                    <div class="every_scroll">
                        <table class="table">
                            <thead>
                                <td></td>
                                <td>总用户</td>
                                <td>下单用户</td>
                                <td>下单率</td>
                                <td>下单数</td>
                                <td>环比昨日下单数</td>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>今日</td>
                                    <td>{{chartData.value.userNum.today_user_num}}</td>
                                    <td>{{chartData.value.today.total_user_num}}</td>
                                    <td>{{chartData.value.today.order_rate}}</td>
                                    <td>{{chartData.value.today.total_order_num}}</td>
                                    <td>{{chartData.value.rate.day_order_rate}}</td>
                                </tr>
                                <tr>
                                    <td>昨日</td>
                                    <td>{{chartData.value.userNum.yesterday_user_num}}</td>
                                    <td>{{chartData.value.yesterday.total_user_num}}</td>
                                    <td>{{chartData.value.yesterday.order_rate}}</td>
                                    <td>{{chartData.value.yesterday.total_order_num}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <pieChart v-bind:pieData='pieData' v-bind:name='name[4]'></pieChart>
                        </div>
                    </div>
                    <div class="every_scroll">
                        <table class="table">
                            <thead>
                                <td></td>
                                <td>总用户</td>
                                <td>下单用户</td>
                                <td>下单率</td>
                                <td>下单数</td>
                                <td>环比上月下单数</td>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>本月</td>
                                    <td>{{chartData.value.userNum.this_month_num}}</td>
                                    <td>{{chartData.value.thisMonth.total_user_num}}</td>
                                    <td>{{chartData.value.thisMonth.order_rate}}</td>
                                    <td>{{chartData.value.thisMonth.total_order_num}}</td>
                                    <td>{{chartData.value.rate.month_order_rate}}</td>
                                </tr>
                                <tr>
                                    <td>上月</td>
                                    <td>{{chartData.value.userNum.last_month_num}}</td>
                                    <td>{{chartData.value.lastMonth.total_user_num}}</td>
                                    <td>{{chartData.value.lastMonth.order_rate}}</td>
                                    <td>{{chartData.value.lastMonth.total_order_num}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <pieChart v-bind:pieData='pieData' v-bind:name='name[5]'></pieChart>
                        </div>
                    </div>
                </div>
                <div class="scrollBox_one">
                    <div class="every_scroll">
                        <LineChart v-bind:name='chartData.name'></LineChart>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="chartData.name=='shareUser'">
            <h1>商品分享</h1>
            <div class="scrollBox">
                <div class="scrollBox_one">
                    <div class="every_scroll">
                        <table class="table">
                            <thead>
                                <td></td>
                                <td>分享次数</td>
                                <td>分享转化率</td>
                                <td>环比昨日转化率</td>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>今日</td>
                                    <td>{{chartData.value.today.share_num}}</td>
                                    <td>{{chartData.value.today.valid_change_rate}}</td>
                                    <td>{{chartData.value.rate.day_valid_change_rate}}</td>
                                </tr>
                                <tr>
                                    <td>昨日</td>
                                    <td>{{chartData.value.yesterday.share_num}}</td>
                                    <td>{{chartData.value.yesterday.valid_change_rate}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <pieChart v-bind:pieData='pieData' v-bind:name='name[6]'></pieChart>
                        </div>
                    </div>
                    <div class="every_scroll">
                        <table class="table">
                            <thead>
                                <td></td>
                                <td>分享次数</td>
                                <td>分享转化率</td>
                                <td>环比上月转化率</td>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>本月</td>
                                    <td>{{chartData.value.thisMonth.share_num}}</td>
                                    <td>{{chartData.value.thisMonth.valid_change_rate}}</td>
                                    <td>{{chartData.value.rate.day_valid_change_rate}}</td>
                                </tr>
                                <tr>
                                    <td>上月</td>
                                    <td>{{chartData.value.lastMonth.share_num}}</td>
                                    <td>{{chartData.value.lastMonth.valid_change_rate}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <pieChart v-bind:pieData='pieData' v-bind:name='name[7]'></pieChart>
                        </div>
                    </div>

                </div>
                <div class="scrollBox_one">
                    <div class="every_scroll">
                        <LineChart v-bind:name='chartData.name'></LineChart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '@/axios'
    import setting from '@/setting'
    import PieChart from "./pieChart.vue"
    import lineChart from "./lineChart.vue"
    export default {
        inject: ['alert', 'showLoading', 'hideLoading'],
        props: ['chartData'],
        components: {
            'pieChart': PieChart,
            'LineChart': lineChart,
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
                name: ['addDate', 'addMonth', 'activeDate', 'activeMonth', 'orderDate', 'orderMonth', 'shareDate',
                    'shareMonth'
                ],
                activeData: '',
                sleepUserData: {
                    leaderNum: '',
                    directorNum: ''
                },
            }
        },
        created() {
            if (this.chartData.name == 'lifeUser') {
                this.getActiveUser()
                this.getSleepUser()
            }
        },
        mounted() {
            if (this.chartData) {
                this.getChartData();
            }
        },
        methods: {
            lookSleepData(e) { //查看沉睡列表
                // console.log(e)
                this.$emit("sleepDataList", e)
            },
            getChartData() {
                this.pieData = Object.assign({}, this.chartData.value);
                // console.log(this.pieData);
            },
            getActiveUser() { //获取活跃用户总数
                this.showLoading()
                request({
                    url: setting.urls.activeUser,
                    method: 'get',
                    params: {
                        'type': this.type
                    }
                }).then(res => {
                    if (res.status == 200) {
                        // console.log(res,"活跃用户")
                        if (res.data.code == 200) {
                            const rest = res.data.data;
                            this.activeData = Object.assign([], rest)
                        } else {
                            this.alert(res.data.message || '活跃用户统计失败')
                        }
                    } else {
                        this.alert('活跃用户统计失败')
                    }
                }).catch((e) => {
                    this.alert('活跃用户统计失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getSleepUser() { //获取沉睡用户数据
                request({
                    url: setting.urls.sleepUser,
                    method: 'get',
                    params: {}
                }).then(res => {
                    // console.log(res,"沉睡用户数据")
                    if (res.status == 200) {
                        if (res.data.code == 200) {
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
        }
    }
</script>

<style scoped>
    .content {
        flex: 1;
        height: 0;
        overflow: hidden;
        overflow-y: auto;
    }

    .table {
        width: 48.6rem;
        font-size: 0.5rem;
    }

    h1 {
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
        /* height: 32rem; */
        /* overflow-x: scroll;
        overflow-y: hidden; */
        /* white-space: nowrap; */
        /* 不换行 */
        display: flex;
        flex-direction: column;
    }

    /* .scrollBox::-webkit-scrollbar {
        display: none;
    } */
    .every_scroll {
        width: 44rem;
        display: inline-table;
        margin-bottom: 1rem;
    }


    .activeRight {
        width: 8.8rem;
        padding: 0.2rem;
        box-sizing: border-box;
        background-color: #ffffff;
        display: inline-table;
    }

    .activeRightTop {
        border: 1px solid #eeeeee;
        border-radius: 3px;
        padding: 0.4rem 0.2rem;
        box-sizing: border-box;
        margin-bottom: 0.4rem;
    }

    .activeRightTop>table {
        text-align: center;
    }

    .activeRightTop>table>tbody>tr td {
        text-align: center;
        color: #747770;
    }

    .activeRightTop>table>tbody>tr td {
        background: #fff;
    }

    .activeRightBottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #eeeeee;
        border-radius: 3px;
        padding: 0.2rem;
        box-sizing: border-box;
    }

    .sleepText {
        font-size: 16px;
        color: #000000;
        font-weight: bold;
        height: 0.8rem;
        line-height: 0.8rem;
    }

    .sleepTip {
        font-size: 14px;
        color: #000000;
        font-weight: bold;
        font-family: "微软雅黑";
    }

    .sleepUser {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
    }

    .sleepLook {
        width: 60px;
        height: 28px;
        font-size: 14px;
        color: #ffffff;
        background-color: #52c7f2;
        display: block;
        text-align: center;
        line-height: 28px;
        border-radius: 5px;
        cursor: pointer;
    }

    .sleepSort {
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        margin-top: 1rem;
        box-sizing: border-box;
    }
</style>
