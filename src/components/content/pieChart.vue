<template>
    <div class="all_Box">
        <div class="two_Pie">
            <div style="width: 8rem; height: 8rem;" ref="firstPie"></div>
            <div style="width: 8rem; height: 8rem;" ref="secondPie"></div>
            <div style="flex: 1;height: 100%;display: flex;align-items: flex-end;">
                <div style="width: 100%;display: flex;flex-direction: column">
                    <div v-for="(item,index) in noticeList" :key='index' class="notice_Box">
                        <div :style="{backgroundColor:colorList[index]}" style="width: 0.6rem;height: 0.4rem"></div>
                        <div>{{item}} </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="width:50%;padding-left: 2rem; padding-top: 0.5rem;;box-sizing: border-box;">
            <h1>各级拉新转化效果</h1>
            <div>
                <div class="progress">
                    <p>总监</p>
                    <div class="progress_Bar">
                        <div class="progress_Box">
                            <div style="margin-bottom: 0.05rem;height: 0.975rem;width: 100%;display: flex;align-items: center;">
                                <div :style="{width:directorWidth.now[0]}" style="background-color: #7ecf51;height: 100%;">{{directorWidth.now[0]}}</div>
                                <div :style="{width:directorWidth.now[1]}" style="background-color: #2fc7c9;height: 100%;">{{directorWidth.now[1]}}</div>
                                <div :style="{width:directorWidth.now[2]}" style="background-color: #61a5e8;height: 100%;"></div>
                            </div>
                            <span>{{rightTitle[0]}}</span>
                        </div>
                        <div class="progress_Box">
                            <div style="height: 0.975rem; width: 100%;display: flex;align-items: center;">
                                <div :style="{width:directorWidth.last[0]}" style="background-color: #7ecf51;height: 100%;">{{directorWidth.last[0]}}</div>
                                <div :style="{width:directorWidth.last[1]}" style="background-color: #2fc7c9;height: 100%;">{{directorWidth.last[1]}}</div>
                                <div :style="{width:directorWidth.last[2]}" style="background-color: #61a5e8;height: 100%;"></div>
                            </div>
                            <span>{{rightTitle[1]}}</span>
                        </div>
                    </div>
                </div>
                <div class="progress">
                    <p>团长</p>
                    <div class="progress_Bar">
                        <div class="progress_Box">
                            <div style="margin-bottom: 0.05rem;height: 0.975rem;width: 100%;display: flex;align-items: center;">
                                <div :style="{width:leaderWidth.now[0]}" style="background-color: #7ecf51;height: 100%;">{{leaderWidth.now[0]}}</div>
                                <div :style="{width:leaderWidth.now[1]}" style="background-color: #2fc7c9;height: 100%;">{{leaderWidth.now[1]}}</div>
                                <div :style="{width:leaderWidth.now[2]}" style="background-color: #61a5e8;height: 100%;"></div>
                            </div>
                            <span>{{rightTitle[0]}}</span>
                        </div>
                        <div class="progress_Box">
                            <div style="height: 0.975rem; width: 100%;display: flex;align-items: center;">
                                <div :style="{width:leaderWidth.last[0]}" style="background-color: #7ecf51;height: 100%;">{{leaderWidth.last[0]}}</div>
                                <div :style="{width:leaderWidth.last[1]}" style="background-color: #2fc7c9;height: 100%;">{{leaderWidth.last[1]}}</div>
                                <div :style="{width:leaderWidth.last[2]}" style="background-color: #61a5e8;height: 100%;"></div>
                            </div>
                            <span>{{rightTitle[1]}}</span>
                        </div>
                    </div>
                </div>
                <div class="progress">
                    <p>会员</p>
                    <div class="progress_Bar">
                        <div class="progress_Box">
                            <div style="margin-bottom: 0.05rem;height: 0.975rem;width: 100%;display: flex;align-items: center;">
                                <div :style="{width:memberWidth.now[0]}" style="background-color: #7ecf51;height: 100%;">{{memberWidth.now[0]}}</div>
                                <div :style="{width:memberWidth.now[1]}" style="background-color: #2fc7c9;height: 100%;">{{memberWidth.now[1]}}</div>
                                <div :style="{width:memberWidth.now[2]}" style="background-color: #61a5e8;height: 100%;"></div>
                            </div>
                            <span>{{rightTitle[0]}}</span>
                        </div>
                        <div class="progress_Box">
                            <div style="height: 0.975rem; width: 100%;display: flex;align-items: center;">
                                <div :style="{width:memberWidth.last[0]}" style="background-color: #7ecf51;height: 100%;">{{memberWidth.last[0]}}</div>
                                <div :style="{width:memberWidth.last[1]}" style="background-color: #2fc7c9;height: 100%;">{{memberWidth.last[1]}}</div>
                                <div :style="{width:memberWidth.last[2]}" style="background-color: #61a5e8;height: 100%;"></div>
                            </div>
                            <span>{{rightTitle[1]}}</span>
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
</template>

<script>
    import echarts from 'echarts'
    export default {
        props: ['pieData', 'name'],
        components: {},
        data() {
            return {
                firstData: [],
                colorList: ['#ff0000', '#f9ca1e', '#7ecf51'],
                firstName: '',
                secondName:'',
                secondData:[],
                noticeList:[],//饼状图注释
                memberWidth:{
                    now:['60%','10%','30%'],
                    last:['50%','20%','30%']
                },//会员 下载% 转化%
                leaderWidth:{
                    now:['20%','70%','10%'],
                    last:['30%','40%','30%']
                },//团长 下载% 转化%
                directorWidth:{
                    now:['80%','20%','0%'],
                    last:['40%','70%','0%']
                },//总监 下载% 转化%
                rightTitle:[],//右边标签
            }
        },
        watch: {
            pieData(e) {
                this.getPie(e);
            }
        },
        methods: {
            getPie(val) {
                console.log(val)
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
                        this.firstName = '今日新增类型'
                        this.secondName = '昨日新增类型'
                        this.noticeList=['美团H5注册未下载','美团H5下载','其它渠道下载']
                        this.rightTitle=['今日','昨日']
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
                        this.firstName = '本月新增类型'
                        this.secondName = '上月新增类型'
                        this.noticeList=['美团H5注册未下载','美团H5下载','其它渠道下载']
                        this.rightTitle=['本月','上月']
                        break;
                    default:
                        break;
                }
                this.getAddDate();
            },
            getAddDate(){
                const firstOptions = {
                    title: {
                        text: this.firstName,
                        x: 'center',
                        textStyle: {
                            fontSize: 18,
                        }
                    },
                    color: this.colorList,
                    series: [{
                        name: '访问来源',
                        type: 'pie', // 设置图表类型为饼图
                        radius: '55%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data: this.firstData,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{d}%'//多值的嵌套
                            }
                        }
                    }],
                };
                const secondOptions = {
                    title: {
                        text: this.secondName,
                        x: 'center',
                        textStyle: {
                            fontSize: 16,
                        }
                    },
                    color: this.colorList,
                    series: [{
                        name: '访问来源',
                        type: 'pie', // 设置图表类型为饼图
                        radius: '55%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data: this.secondData,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{d}%'//多值的嵌套
                            }
                        }
                    }],
                };
                echarts.init(this.$refs.firstPie).setOption(firstOptions)
                echarts.init(this.$refs.secondPie).setOption(secondOptions)
            }
        }
    }
</script>

<style scoped>
    .all_Box {
        width: 40rem;
        height: 10rem;
        background-color: #f4f4f4;
        display: flex;
    }
    .two_Pie{
        width: 50%;
        display: flex;
        border-right: 1px solid #cccccc;
        align-items: center;
    }
    .notice_Box{
        display: flex;
        font-size: 0.2rem;
        align-items: center;
        margin-bottom: 0.2rem;
    }
    h1{
        font-size: 0.6rem;
        margin-bottom: 0.4rem;
    }
    p{
        font-size: 0.5rem;
        margin-right: 0.1rem;
        white-space: nowrap;
    }
    .progress{
        width: 14rem;
        height: 2rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
    }
    .progress_Bar{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .progress_Box{
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 0.4rem;
        line-height: 0.975rem;
        text-align: center;
    }
    span{
        font-size: 0.4rem;
        white-space: nowrap;
        color: #0198ca;
        margin-left: 0.2rem;
    };
</style>
