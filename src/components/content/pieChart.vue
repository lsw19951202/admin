<template>
    <div :class="name=='activeMonth'?'active_Box':'all_Box'">
        <div class="two_Pie">
            <div :class="name=='activeMonth'?'active_Pie':'all_Pie'"  ref="firstPie"></div>
            <div :class="name=='activeMonth'?'active_Pie':'all_Pie'" ref="secondPie"></div>
            <div style="flex: 1;height: 100%;display: flex;align-items: flex-end;">
                <div style="width: 100%;display: flex;flex-direction: column;align-items: flex-end;">
                    <div v-for="(item,index) in noticeList" :key='index' class="notice_Box">
                        <div>{{item}} </div>
                        <div :style="{backgroundColor:colorList[index]}" style="width: 0.6rem;height: 0.4rem"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right_Box" v-if="name=='addDate'||name=='addMonth'">
            <div>
                <h1>各级拉新转化效果</h1>
                    <div>
                        <div class="progress">
                            <p>总监</p>
                            <div class="progress_Bar">
                                <div class="progress_Box">
                                    <div style="display: flex;justify-content: space-between;width: 100%;">
                                        <div>
                                            下载：{{directorWidth.now[0]}}
                                        </div>
                                        <div>
                                            转化：{{directorWidth.now[1]}}
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 0.05rem;height: 0.6rem;width: 100%;display: flex;align-items: center;">
                                        <div :style="{width:directorWidth.now[0]}" style="background-color: #7ecf51;height: 100%;"></div>
                                        <div :style="{width:directorWidth.now[1]}" style="background-color: #2fc7c9;height: 100%;"></div>
                                        <div style="background-color: #61a5e8;height: 100%;flex: 1;"></div>
                                        <span>{{rightTitle[0]}}</span>
                                    </div>
                                </div>
                                <div class="progress_Box">
                                    <div style="height: 0.6rem; width: 100%;display: flex;align-items: center;">
                                        <div :style="{width:directorWidth.last[0]}" style="background-color: #7ecf51;height: 100%;"></div>
                                        <div :style="{width:directorWidth.last[1]}" style="background-color: #2fc7c9;height: 100%;"></div>
                                        <div style="background-color: #61a5e8;height: 100%;flex: 1;"></div>
                                        <span>{{rightTitle[1]}}</span>
                                    </div>
                                    <div style="display: flex;justify-content: space-between;width: 100%;">
                                        <div>
                                            下载：{{directorWidth.last[0]}}
                                        </div>
                                        <div>
                                            转化：{{directorWidth.last[1]}}
                                        </div>
                                    </div>
                                </div>
                
                            </div>
                        </div>
                        <div class="progress">
                            <p>团长</p>
                            <div class="progress_Bar">
                                <div class="progress_Box">
                                    <div style="display: flex;justify-content: space-between;width: 100%;">
                                        <div>
                                            下载：{{leaderWidth.now[0]}}
                                        </div>
                                        <div>
                                            转化：{{leaderWidth.now[1]}}
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 0.05rem;height: 0.6rem;width: 100%;display: flex;align-items: center;">
                                        <div :style="{width:leaderWidth.now[0]}" style="background-color: #7ecf51;height: 100%;"></div>
                                        <div :style="{width:leaderWidth.now[1]}" style="background-color: #2fc7c9;height: 100%;"></div>
                                        <div style="background-color: #61a5e8;height: 100%;flex: 1;"></div>
                                        <span>{{rightTitle[0]}}</span>
                                    </div>
                                </div>
                                <div class="progress_Box">
                                    <div style="height: 0.6rem; width: 100%;display: flex;align-items: center;">
                                        <div :style="{width:leaderWidth.last[0]}" style="background-color: #7ecf51;height: 100%;"></div>
                                        <div :style="{width:leaderWidth.last[1]}" style="background-color: #2fc7c9;height: 100%;"></div>
                                        <div style="background-color: #61a5e8;height: 100%;flex: 1;"></div>
                                        <span>{{rightTitle[1]}}</span>
                                    </div>
                                    <div style="display: flex;justify-content: space-between;width: 100%;">
                                        <div>
                                            下载：{{leaderWidth.last[0]}}
                                        </div>
                                        <div>
                                            转化：{{leaderWidth.last[1]}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="progress">
                            <p>会员</p>
                            <div class="progress_Bar">
                                <div class="progress_Box">
                                    <div style="display: flex;justify-content: space-between;width: 100%;">
                                        <div>
                                            下载：{{memberWidth.now[0]}}
                                        </div>
                                        <div>
                                            转化：{{memberWidth.now[1]}}
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 0.05rem;height: 0.6rem;width: 100%;display: flex;align-items: center;">
                                        <div :style="{width:memberWidth.now[0]}" style="background-color: #7ecf51;height: 100%;"></div>
                                        <div :style="{width:memberWidth.now[1]}" style="background-color: #2fc7c9;height: 100%;"></div>
                                        <div style="background-color: #61a5e8;height: 100%;flex: 1;"></div>
                                        <span>{{rightTitle[0]}}</span>
                                    </div>
                                </div>
                                <div class="progress_Box">
                                    <div style="height: 0.6rem; width: 100%;display: flex;align-items: center;">
                                        <div :style="{width:memberWidth.last[0]}" style="background-color: #7ecf51;height: 100%;"></div>
                                        <div :style="{width:memberWidth.last[1]}" style="background-color: #2fc7c9;height: 100%;"></div>
                                        <div style="background-color: #61a5e8;height: 100%;flex:1"></div>
                                        <span>{{rightTitle[1]}}</span>
                                    </div>
                                    <div style="display: flex;justify-content: space-between;width: 100%;">
                                        <div>
                                            下载：{{memberWidth.last[0]}}
                                        </div>
                                        <div>
                                            转化：{{memberWidth.last[1]}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 14rem;margin-top: 0.8rem;">
                        <div class="notice_Box" style="margin-right: 2rem;">
                            <div style="width: 0.6rem;height: 0.4rem;background-color: #7ecf51;"></div>
                            <div>下载</div>
                        </div>
                        <div class="notice_Box">
                            <div style="width: 0.6rem;height: 0.4rem;background-color: #2fc7c9;"></div>
                            <div>转化</div>
                        </div>
                    </div>
            </div>
        </div>
        <div class="right_Box" v-if="name!='addDate'&&name!='addMonth'">
            <div>
                <div class="tabType_Box">
                    <div :class="tabType==1?'tabChecked':'tabCheck'" @click="changeTabType(1)">{{rightTitle[0]}}</div>
                    <div :class="tabType==2?'tabChecked':'tabCheck'" @click="changeTabType(2)">{{rightTitle[1]}}</div>
                </div>
                <div class="today_top_right">
                    <div class="time_quantum" v-if="name=='activeMonth'">
                        <span class="quantum_text" :class="type==1?'choosed':'choose'" @click="chooseTimeSlot(1)">0~10天</span>
                        <span class="quantum_text" :class="type==2?'choosed':'choose'" @click="chooseTimeSlot(2)">10~20天</span>
                        <span class="quantum_text" :class="type==3?'choosed':'choose'" @click="chooseTimeSlot(3)">20天以上</span>
                    </div>
                    <div class="quantum_rate">
                        <div v-if="tabType==1" style="display: flex;justify-content: space-between;width: 100%;">
                            <div class="today_num">
                                <span style="color: black;">{{rightTitle[0]}}:{{allBody[0]}}人</span>
                                <span style="color: red;">{{allBody[1]}}环比{{allBody[3]}}</span>
                            </div>
                            <div><span style="color: black;">{{rightTitle[1]}}:{{allBody[2]}}人</span></div>
                        </div>
                        <div class="today_num" v-if="tabType==2">
                            <span style="color: black;">{{rightTitle[0]}}:{{allBodyNext[0]}}人</span>
                        </div>
                    </div>
                    <table class="right_table">
                        <thead>
                            <th></th>
                            <th v-for="(item,index) in noticeList" :key='index'>
                                {{item}}
                            </th>
                        </thead>
                        <tbody v-if="tabType==1">
                            <tr v-for="(item,index) in rightBoby" :key='index'>
                                <td>{{item.name}}</td>
                                <td>{{item.value[0]}}</td>
                                <td>{{item.value[1]}}</td>
                                <td>{{item.value[2]}}</td>
                            </tr>
                        </tbody>
                        <tbody v-if="tabType==2">
                            <tr v-for="(item,index) in rightBobyNext" :key='index'>
                                <td>{{item.name}}</td>
                                <td>{{item.value[0]}}</td>
                                <td>{{item.value[1]}}</td>
                                <td>{{item.value[2]}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                        
            </div>
        </div>
    </div>
</template>

<script>
    import request from '@/axios'
    import setting from '@/setting'
    import echarts from 'echarts'
    export default {
        inject: ['alert', 'showLoading', 'hideLoading'],
        props: ['pieData', 'name'],
        components: {},
        data() {
            return {
                firstData: [],
                colorList: ['#ff0000', '#f9ca1e', '#7ecf51'],
                firstName: '',
                secondName: '',
                secondData: [],
                noticeList: [], //饼状图注释
                memberWidth: {
                    now: [],
                    last: []
                }, //会员 下载% 转化%
                leaderWidth: {
                    now: [],
                    last: []
                }, //团长 下载% 转化%
                directorWidth: {
                    now: [],
                    last: []
                }, //总监 下载% 转化%
                rightTitle: [], //右边标签
                type: 1, //活跃用户时间段，1表示0~10天   2表示10~20天   3表示20天以上
                rightBoby: [], //当天或当月右侧数据
                rightBobyNext: [], //昨天或上月右侧数据
                tabType: 1, //1本月 2上月
                allBody: [], //本月或当天右侧总数据统计 本 环比 上
                allBodyNext: [], //上月或昨天右侧总数据统计 本
            }
        },
        watch: {
            pieData(e) {
                this.getPie(e);
            }
        },
        methods: {
            getPie(val) {
                // console.log(val,this.name)
                switch (this.name) {
                    case 'addDate':
                        this.firstData = [{
                            value: val.today.mt_new_num - val.today.mt_download_num
                        }, {
                            value: val.today.mt_download_num
                        }, {
                            value: val.today.other_download_num
                        }]
                        this.secondData = [{
                            value: val.yesterday.mt_new_num - val.yesterday.mt_download_num
                        }, {
                            value: val.yesterday.mt_download_num
                        }, {
                            value: val.yesterday.other_download_num
                        }]
                        this.memberWidth = {
                                now: [val.today.member_download_rate, val.today.member_valid_change_rate],
                                last: [val.yesterday.member_download_rate, val.yesterday.member_valid_change_rate]
                            }, //会员 下载% 转化%
                            this.leaderWidth = {
                                now: [val.today.leader_download_rate, val.today.leader_valid_change_rate],
                                last: [val.yesterday.leader_download_rate, val.yesterday.leader_valid_change_rate]
                            }, //团长 下载% 转化%
                            this.directorWidth = {
                                now: [val.today.director_download_rate, val.today.director_valid_change_rate],
                                last: [val.yesterday.director_download_rate, val.yesterday.director_valid_change_rate]
                            }, //总监 下载% 转化%
                            this.firstName = '今日新增类型'
                        this.secondName = '昨日新增类型'
                        this.noticeList = ['美团H5注册未下载', '美团H5下载', '其它渠道下载']
                        this.rightTitle = ['今日', '昨日']
                        break;
                    case 'addMonth':
                        this.firstData = [{
                            value: val.thisMonth.mt_new_num - val.thisMonth.mt_download_num
                        }, {
                            value: val.thisMonth.mt_download_num
                        }, {
                            value: val.thisMonth.other_download_num
                        }]
                        this.secondData = [{
                            value: val.lastMonth.mt_new_num - val.lastMonth.mt_download_num
                        }, {
                            value: val.lastMonth.mt_download_num
                        }, {
                            value: val.lastMonth.other_download_num
                        }]
                        this.memberWidth = {
                                now: [val.thisMonth.member_download_rate, val.thisMonth.member_valid_change_rate],
                                last: [val.lastMonth.member_download_rate, val.lastMonth.member_valid_change_rate]
                            }, //会员 下载% 转化%
                            this.leaderWidth = {
                                now: [val.thisMonth.leader_download_rate, val.thisMonth.leader_valid_change_rate],
                                last: [val.lastMonth.leader_download_rate, val.lastMonth.leader_valid_change_rate]
                            }, //团长 下载% 转化%
                            this.directorWidth = {
                                now: [val.thisMonth.director_download_rate, val.thisMonth.director_valid_change_rate],
                                last: [val.lastMonth.director_download_rate, val.lastMonth.director_valid_change_rate]
                            }, //总监 下载% 转化%
                            this.firstName = '本月新增类型'
                        this.secondName = '上月新增类型'
                        this.noticeList = ['美团H5注册未下载', '美团H5下载', '其它渠道下载']
                        this.rightTitle = ['本月', '上月']
                        break;
                    case 'activeDate':
                        this.firstData = [{
                            value: val.today.member_user_num
                        }, {
                            value: val.today.leader_user_num
                        }, {
                            value: val.today.director_user_num
                        }]
                        this.secondData = [{
                            value: val.yesterday.member_user_num
                        }, {
                            value: val.yesterday.leader_user_num
                        }, {
                            value: val.yesterday.director_user_num
                        }]
                        this.firstName = '今日活跃类型'
                        this.secondName = '昨日活跃类型'
                        this.noticeList = ['会员', '团长', '总监']
                        this.rightTitle = ['今日活跃', '昨日活跃']
                        this.rightBoby = [{
                            name: '今日活跃用户',
                            value: [val.today.member_user_num, val.today.leader_user_num, val.today.director_user_num]
                        }, {
                            name: '今日活跃用户下单率',
                            value: [val.today.member_order_user_rate, val.today.leader_order_user_rate, val.today
                                .director_order_user_rate
                            ]
                        }, {
                            name: '今日活跃用户下单数',
                            value: [val.today.member_order_user_num, val.today.leader_order_user_num, val.today
                                .director_order_user_num
                            ]
                        }, {
                            name: '环比昨日下单数',
                            value: [val.rate.day_member_order_rate, val.rate.day_leader_order_rate, val.rate.day_director_order_rate]
                        }]
                        this.allBody = [val.today.total_user_num, val.rate.day_rate, val.yesterday.total_user_num, '昨日'];
                        this.rightBobyNext = [{
                            name: '昨日活跃用户',
                            value: [val.yesterday.member_user_num, val.yesterday.leader_user_num, val.yesterday
                                .director_user_num
                            ]
                        }, {
                            name: '昨日活跃用户下单率',
                            value: [val.yesterday.member_order_user_rate, val.yesterday.leader_order_user_rate,
                                val.yesterday.director_order_user_rate
                            ]
                        }, {
                            name: '昨日活跃用户下单数',
                            value: [val.yesterday.member_order_user_num, val.yesterday.leader_order_user_num,
                                val.yesterday.director_order_user_num
                            ]
                        }]
                        this.allBodyNext = [val.yesterday.total_user_num];
                        break;
                    case 'activeMonth':
                        this.firstData = [{
                            value: val.thisMonth.member_user_num
                        }, {
                            value: val.thisMonth.leader_user_num
                        }, {
                            value: val.thisMonth.director_user_num
                        }]
                        this.secondData = [{
                            value: val.lastMonth.member_user_num
                        }, {
                            value: val.lastMonth.leader_user_num
                        }, {
                            value: val.lastMonth.director_user_num
                        }]
                        this.firstName = '本月活跃类型'
                        this.secondName = '上月活跃类型'
                        this.noticeList = ['会员', '团长', '总监']
                        this.rightTitle = ['本月活跃', '上月活跃']
                        this.getActiveUser()
                        break;
                    case 'orderDate':
                        this.firstData = [{
                            value: val.today.member_user_num
                        }, {
                            value: val.today.leader_user_num
                        }, {
                            value: val.today.director_user_num
                        }]
                        this.secondData = [{
                            value: val.yesterday.member_user_num
                        }, {
                            value: val.yesterday.leader_user_num
                        }, {
                            value: val.yesterday.director_user_num
                        }]
                        this.firstName = '今日下单用户类型'
                        this.secondName = '昨日下单用户类型'
                        this.noticeList = ['会员', '团长', '总监']
                        this.rightTitle = ['今日下单', '昨日下单']
                        this.rightBoby = [{
                            name: '今日下单用户',
                            value: [val.today.member_user_num, val.today.leader_user_num, val.today.director_user_num]
                        }, {
                            name: '今日下单率',
                            value: [val.today.member_user_num, val.today.leader_user_num, val.today.director_user_num]
                        }, {
                            name: '今日下单数',
                            value: [val.today.member_order_num, val.today.leader_order_num, val.today.director_order_num]
                        }, {
                            name: '环比昨日下单数',
                            value: [val.rate.day_member_order_rate, val.rate.day_leader_order_rate, val.rate.day_director_order_rate]
                        }]
                        this.allBody = [val.today.total_order_num, val.rate.day_order_rate, val.yesterday.total_order_num,
                            '昨日'
                        ];
                        this.rightBobyNext = [{
                            name: '昨日下单用户',
                            value: [val.yesterday.member_user_num, val.yesterday.leader_user_num, val.yesterday
                                .director_user_num
                            ]
                        }, {
                            name: '昨日下单率',
                            value: [val.yesterday.member_user_num, val.yesterday.leader_user_num, val.yesterday
                                .director_user_num
                            ]
                        }, {
                            name: '昨日下单数',
                            value: [val.yesterday.member_order_num, val.yesterday.leader_order_num, val.yesterday
                                .director_order_num
                            ]
                        }]
                        this.allBodyNext = [val.yesterday.total_order_num];
                        break;
                    case 'orderMonth':
                        this.firstData = [{
                            value: val.thisMonth.member_user_num
                        }, {
                            value: val.thisMonth.leader_user_num
                        }, {
                            value: val.thisMonth.director_user_num
                        }]
                        this.secondData = [{
                            value: val.lastMonth.member_user_num
                        }, {
                            value: val.lastMonth.leader_user_num
                        }, {
                            value: val.lastMonth.director_user_num
                        }]
                        this.firstName = '本月下单用户类型'
                        this.secondName = '上月下单用户类型'
                        this.noticeList = ['会员', '团长', '总监']
                        this.rightTitle = ['本月下单', '上月下单']
                        this.rightBoby = [{
                            name: '本月下单用户',
                            value: [val.thisMonth.member_user_num, val.thisMonth.leader_user_num, val.thisMonth
                                .director_user_num
                            ]
                        }, {
                            name: '本月下单率',
                            value: [val.thisMonth.member_user_num, val.thisMonth.leader_user_num, val.thisMonth
                                .director_user_num
                            ]
                        }, {
                            name: '本月下单数',
                            value: [val.thisMonth.member_order_num, val.thisMonth.leader_order_num, val.thisMonth
                                .director_order_num
                            ]
                        }, {
                            name: '环比上月下单数',
                            value: [val.rate.day_member_order_rate, val.rate.day_leader_order_rate, val.rate.day_director_order_rate]
                        }]
                        this.allBody = [val.thisMonth.total_order_num, val.rate.month_order_rate, val.lastMonth.total_order_num,
                            '上月'
                        ];
                        this.rightBobyNext = [{
                            name: '上月下单用户',
                            value: [val.yesterday.member_user_num, val.lastMonth.leader_user_num, val.lastMonth
                                .director_user_num
                            ]
                        }, {
                            name: '上月下单率',
                            value: [val.lastMonth.member_user_num, val.lastMonth.leader_user_num, val.lastMonth
                                .director_user_num
                            ]
                        }, {
                            name: '上月下单数',
                            value: [val.lastMonth.member_order_num, val.lastMonth.leader_order_num, val.lastMonth
                                .director_order_num
                            ]
                        }]
                        this.allBodyNext = [val.lastMonth.total_order_num];
                        break;
                    case 'shareDate':
                        this.firstData = [{
                            value: val.today.tb_share_num
                        }, {
                            value: val.today.jd_share_num
                        }, {
                            value: val.today.pdd_share_num
                        }]
                        this.secondData = [{
                            value: val.yesterday.tb_share_num
                        }, {
                            value: val.yesterday.jd_share_num
                        }, {
                            value: val.yesterday.pdd_share_num
                        }]
                        this.firstName = '今日分享平台类型'
                        this.secondName = '昨日分享平台类型'
                        this.noticeList = ['淘宝', '京东', '拼多多']
                        this.rightTitle = ['今日分享', '昨日分享']
                        this.rightBoby = [{
                            name: '今日分享次数',
                            value: [val.today.tb_share_num, val.today.jd_share_num, val.today.pdd_share_num]
                        }, {
                            name: '今日分享转化率',
                            value: [val.today.tb_valid_change_rate, val.today.jd_valid_change_rate, val.today.pdd_valid_change_rate]
                        }, {
                            name: '环比昨日转化率',
                            value: [val.rate.day_tb_valid_change_rate, val.rate.day_jd_valid_change_rate, val.rate
                                .day_pdd_valid_change_rate
                            ]
                        }]
                        this.allBody = [val.today.share_num, val.rate.day_rate, val.yesterday.share_num, '昨日'];
                        this.rightBobyNext = [{
                            name: '昨日分享次数',
                            value: [val.yesterday.tb_share_num, val.yesterday.jd_share_num, val.yesterday.pdd_share_num]
                        }, {
                            name: '昨日分享转化率',
                            value: [val.yesterday.tb_valid_change_rate, val.yesterday.jd_valid_change_rate, val
                                .yesterday.pdd_valid_change_rate
                            ]
                        }]
                        this.allBodyNext = [val.yesterday.share_num];
                        break;
                    case 'shareMonth':
                        this.firstData = [{
                            value: val.thisMonth.tb_share_num
                        }, {
                            value: val.thisMonth.jd_share_num
                        }, {
                            value: val.thisMonth.pdd_share_num
                        }]
                        this.secondData = [{
                            value: val.lastMonth.tb_share_num
                        }, {
                            value: val.lastMonth.jd_share_num
                        }, {
                            value: val.lastMonth.pdd_share_num
                        }]
                        this.firstName = '本月分享平台类型'
                        this.secondName = '上月分享平台类型'
                        this.noticeList = ['淘宝', '京东', '拼多多']
                        this.rightTitle = ['本月分享', '上月分享']
                        this.rightBoby = [{
                            name: '本月分享次数',
                            value: [val.thisMonth.tb_share_num, val.thisMonth.jd_share_num, val.thisMonth.pdd_share_num]
                        }, {
                            name: '本月分享转化率',
                            value: [val.thisMonth.tb_valid_change_rate, val.thisMonth.jd_valid_change_rate, val
                                .thisMonth.pdd_valid_change_rate
                            ]
                        }, {
                            name: '环比上月转化率',
                            value: [val.rate.month_tb_valid_change_rate, val.rate.month_jd_valid_change_rate,
                                val.rate.month_pdd_valid_change_rate
                            ]
                        }]
                        this.allBody = [val.thisMonth.share_num, val.rate.month_rate, val.lastMonth.share_num, '上月'];
                        this.rightBobyNext = [{
                            name: '上月分享次数',
                            value: [val.yesterday.tb_share_num, val.lastMonth.jd_share_num, val.lastMonth.pdd_share_num]
                        }, {
                            name: '上月分享转化率',
                            value: [val.lastMonth.tb_valid_change_rate, val.lastMonth.jd_valid_change_rate, val
                                .lastMonth.pdd_valid_change_rate
                            ]
                        }]
                        this.allBodyNext = [val.lastMonth.share_num];
                        break;
                    default:
                        break;
                }
                this.getAddDate();
            },
            getAddDate() {
                this.showLoading()
                const firstOptions = {
                    title: {
                        text: this.firstName,
                        x: 'center',
                        textStyle: {
                            fontSize: 24,
                        }
                    },
                    color: this.colorList,
                    series: [{
                        name: '访问来源',
                        type: 'pie', // 设置图表类型为饼图
                        radius: '50%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data: this.firstData,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                // position: 'inner',
                                formatter: '{d}%' //多值的嵌套
                            }
                        }
                    }],
                };
                const secondOptions = {
                    title: {
                        text: this.secondName,
                        x: 'center',
                        textStyle: {
                            fontSize: 24,
                        }
                    },
                    color: this.colorList,
                    series: [{
                        name: '访问来源',
                        type: 'pie', // 设置图表类型为饼图
                        radius: '50%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data: this.secondData,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                // position: 'inner',
                                formatter: '{d}%' //多值的嵌套
                            }
                        }
                    }],
                };
                echarts.init(this.$refs.firstPie).setOption(firstOptions)
                echarts.init(this.$refs.secondPie).setOption(secondOptions)
                this.hideLoading()
            },
            changeTabType(e) { //切换本月上月
                this.tabType = e;
                switch (this.name) {
                    case 'activeMonth':
                        this.getActiveUser()
                        break;
                    default:
                        break;
                }
            },
            chooseTimeSlot(e) { //活跃用户筛选时间段
                this.type = e;
                this.getActiveUser()
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
                            this.rightBoby = [{
                                name: '本月活跃用户',
                                value: [rest.thisMonth.member_user_num, rest.thisMonth.leader_user_num,
                                    rest.thisMonth.director_user_num
                                ]
                            }, {
                                name: '本月活跃用户下单率',
                                value: [rest.thisMonth.member_order_user_rate, rest.thisMonth.leader_order_user_rate,
                                    rest.thisMonth.director_order_user_rate
                                ]
                            }, {
                                name: '本月活跃用户下单数',
                                value: [rest.thisMonth.member_order_user_num, rest.thisMonth.leader_order_user_num,
                                    rest.thisMonth.director_order_user_num
                                ]
                            }, {
                                name: '环比上月下单数',
                                value: [rest.rate.month_member_order_rate, rest.rate.month_leader_order_rate,
                                    rest.rate.month_director_order_rate
                                ]
                            }]
                            this.allBody = [rest.thisMonth.total_user_num, rest.rate.month_rate, rest.lastMonth
                                .total_user_num, '上月'
                            ];
                            this.rightBobyNext = [{
                                name: '本月活跃用户',
                                value: [rest.lastMonth.member_user_num, rest.lastMonth.leader_user_num,
                                    rest.lastMonth.director_user_num
                                ]
                            }, {
                                name: '本月活跃用户下单率',
                                value: [rest.lastMonth.member_order_user_rate, rest.lastMonth.leader_order_user_rate,
                                    rest.lastMonth.director_order_user_rate
                                ]
                            }, {
                                name: '本月活跃用户下单数',
                                value: [rest.lastMonth.member_order_user_num, rest.lastMonth.leader_order_user_num,
                                    rest.lastMonth.director_order_user_num
                                ]
                            }]
                            this.allBodyNext = [rest.lastMonth.total_user_num];
                        } else {
                            this.alert(res.data.message || '活跃用户统计失败')
                        }
                    } else {
                        this.alert('活跃用户统计失败')
                    }
                }).catch((e) => {
                    console.log(e)
                    this.alert('活跃用户统计失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
        }
    }
</script>

<style scoped>
    .all_Box {
        width: 48.6rem;
        height: 12rem;
        background-color: #f4f4f4;
        display: flex;
    }
    .active_Box{
        width: 40rem;
        height: 12rem;
        background-color: #f4f4f4;
        display: flex;
    }
    .two_Pie {
        width: 50%;
        display: flex;
        border-right: 1px solid #cccccc;
        align-items: center;
    }

    .notice_Box {
        display: flex;
        font-size: 0.2rem;
        align-items: center;
        margin-bottom: 0.2rem;
        margin-right: 1rem;
    }
    .right_Box{
        width:50%;
       /* padding-left: 2rem;
        padding-top: 0.5rem; */
        box-sizing: border-box;
       display: flex;
        justify-content: center;
        align-items: center;
    }
    h1 {
        font-size: 0.6rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 0.5rem;
        margin-right: 0.1rem;
        white-space: nowrap;
    }

    .progress {
        width: 14rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
    }
    .all_Pie{
        width: 9.5rem; 
        height: 9.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .active_Pie{
        width: 8rem; 
        height: 8rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .progress_Bar {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .progress_Box {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.4rem;
        line-height: 0.6rem;
        text-align: center;
    }

    span {
        font-size: 0.4rem;
        white-space: nowrap;
        color: #0198ca;
        margin-left: 0.2rem;
    }

    .tabType_Box {
        display: flex;
        font-size: 0.5rem;
    }

    .today_top_right {
        background-color: #fff;
        margin-top: 0.4rem;
        border: 1px solid gray;
        flex-direction: column;
        width: 16rem;
        height: 9.5rem;
    }

    .time_quantum {
        display: flex;
        justify-content: center;
    }

    .choosed {
        color: #52c7f2 !important;
        border: 1px solid #52c7f2;
    }

    .choose {
        color: #000 !important;
        border: 1px solid gainsboro;
    }

    .tabChecked {
        color: #fff !important;
        border: 1px solid gainsboro;
        background-color: #ff6600;
        padding: 0.15rem 0.4rem;
    }

    .tabCheck {
        color: #000 !important;
        border: 1px solid gainsboro;
        background-color: #fff;
        padding: 0.15rem 0.4rem;
    }

    .quantum_rate {
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
        box-sizing: border-box;
        align-items: center;
    }
</style>
