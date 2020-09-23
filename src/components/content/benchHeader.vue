<template>
    <div class="AllHeader">
        <div v-for="(item, index) in headerData" :key="index" class="headerBox">
            <div v-if='item.name=="today_user_num"' class="today_user_num">
                <div class="addHeader"></div>
                <div class="dataBox">
                    <span style="font-size: 0.4rem;display: block;color: black;">今日新增用户</span>
                    <span style="font-size: 0.8rem;display: block;color: black;margin: 0.2rem;">{{item.value}}</span>
                    <span style="font-size: 0.4rem;display: block;color: #55db76;">{{item.percentage}}&nbsp;环比昨日</span>
                </div>
            </div>
            <div v-if='item.name=="today_total_user_num"' class="today_total_user_num">
                <div style="display: flex;flex-direction: column;align-items: center;margin-right: 0.8rem;">
                    <div style="width: 2.4rem; height: 2.4rem;" id="lifeChart"></div>
                    <span style="font-size: 0.4rem;display: block;color: #fff;">活跃率</span>
                </div>
                <div class="dataBox">
                    <span style="font-size: 0.4rem;display: block;">今日活跃</span>
                    <span style="font-size: 0.8rem;display: block;color: black;margin: 0.2rem;">{{item.value}}</span>
                    <span style="font-size: 0.4rem;display: block;">{{item.percentage}}&nbsp;环比昨日</span>
                </div>
            </div>
            <div v-if='item.name=="today_order_total_user_num"' class="today_order_total_user_num">
                <div style="display: flex;flex-direction: column;align-items: center;margin-right: 0.8rem;">
                    <div style="width: 2.4rem; height: 2.4rem;" id="orderChart"></div>
                    <span style="font-size: 0.4rem;display: block;color: #fff;">下单率</span>
                </div>
                <div class="dataBox">
                    <span style="font-size: 0.4rem;display: block;">今日下单用户</span>
                    <span style="font-size: 0.8rem;display: block;color: black;margin: 0.2rem;">{{item.value}}</span>
                    <span style="font-size: 0.4rem;display: block;">{{item.percentage}}&nbsp;环比昨日</span>
                </div>
            </div>
            <div v-if='item.name=="today_share_num"' class="today_share_num">
                <div class="shareHeader"></div>
                <div class="dataBox">
                    <span style="font-size: 0.4rem;display: block;">今日商品分享次数</span>
                    <span style="font-size: 0.8rem;display: block;margin: 0.2rem;">{{item.value}}</span>
                    <span style="font-size: 0.4rem;display: block;">{{item.percentage}}&nbsp;环比昨日</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        props: ['headerData'],
        components: {},
        data() {
            return {

            }
        },
        updated: function() {
            if (this.headerData.length == 4) {
                this.drawLifeChart();
                this.drawOrderChart();
            }
        },
        methods: {
            getPieNum(val) {
                const arr = val.split('%');
                return arr[0] / 100
            },
            drawLifeChart() {
                const text=this.headerData[1].activeRate;
                // console.log(this.headerData);
                const value = this.getPieNum(text);
                const options = {
                    title: {
                        text: text,
                        x: 'center',
                        y: 'center',
                        textStyle: {
                            color: '#fff',
                            fontSize: 18,
                        }
                    },
                    color:['#9cdd70','#2ea9e1'],
                    series: [{
                        type: 'pie',
                        radius: ['50%', '60%'],
                        silent: true,
                        label: {
                            normal: {
                                show: false,
                            }
                        },

                        data: [{ // 数据值
                                value: value,
                                //该数据项是否被选中
                                selected: false,

                            },
                            {
                                value: 100,
                            }
                        ],
                        animation: false
                    }]

                };
                echarts.init(document.getElementById('lifeChart')).setOption(options)
            },
            drawOrderChart() {
                const text=this.headerData[2].orderRate;
                const value = this.getPieNum(text);
                const options = {
                    title: {
                        text: text,
                        x: 'center',
                        y: 'center',
                        textStyle: {
                            color: '#fff',
                            fontSize: 18,
                        }
                    },
                    color:['#0099cc','#76b953'],
                    series: [{
                        type: 'pie',
                        radius: ['50%', '60%'],
                        silent: true,
                        label: {
                            normal: {
                                show: false,
                            }
                        },
            
                        data: [{ // 数据值
                                value: value,
                                //该数据项是否被选中
                                selected: false,
            
                            },
                            {
                                value: 100,
                            }
                        ],
                        animation: false
                    }]
            
                };
                echarts.init(document.getElementById('orderChart')).setOption(options)
            }

        },
    }
</script>

<style scoped>
    .AllHeader {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 2.5rem  0   0  0;
    }

    .headerBox {
        width: 8rem;
        height: 3.2rem;
        border: 1px solid #ebebeb;
        margin-right: 0.5rem;
    }

    .dataBox {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        color: white;
    }

    .addHeader {
        width: 2rem;
        height: 2rem;
        background: url(../../assets/menu_user_normal.png);
        margin-right: 0.5rem;
        background-size: 100% 100%;
    }
    .shareHeader {
        width: 2rem;
        height: 2rem;
        background: url(../../assets/menu_order_normal.png);
        margin-right: 0.5rem;
        background-size: 100% 100%;
    }
    
    .today_user_num {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .today_total_user_num {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #2db6f4;
        justify-content: center;
        align-items: center;
    }

    .today_order_total_user_num {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #7dc856;
        justify-content: center;
        align-items: center;
    }

    .today_share_num {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #666666;
        justify-content: center;
        align-items: center;
    }
</style>
