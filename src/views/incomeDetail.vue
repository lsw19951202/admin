<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <div class="chooseMenu">
                <span class="menuText" :class="showswich?'chooseSe':'inChoose'" @click="changeBtn(1)">用户收益详情</span>
                <span class="menuText" :class="showswich?'inChoose':'chooseSe'" @click="changeBtn(2)">团队常购商品</span>
                <span class="goBack" @click="goBack">返回上一级</span>
            </div>
            <div v-if="showswich">
                <div class="userIncome" v-if="incomeData.lastMonth">
                    <div class="lastMonth">
                        <div class="incomeTip">前一个月收益</div>
                        <div class="person">个人</div>
                        <div class="predict">预估收益:{{incomeData.lastMonth.estimate_profit}}元</div>
                        <div class="actually">实际收益:{{incomeData.lastMonth.settlement_profit}}元</div>
                        <div class="chain">环比前两个月实际收益百分比:{{incomeData.lastMonth.user_rate}}</div>
                        <div class="formula">(公式：前一个月实际收益➗前两个月实际收益)</div>
                        <div class="person">团队</div>
                        <div class="predict">预估收益:{{incomeData.lastMonth.team_estimate_profit}}元</div>
                        <div class="actually">实际收益:{{incomeData.lastMonth.team_settlement_profit}}元</div>
                        <div class="chain">环比前两个月实际收益百分比:{{incomeData.lastMonth.team_rate}}</div>
                        <div class="formula">(公式：前一个月实际收益➗前两个月实际收益)</div>
                    </div>
                    <div class="lastMonth lastTwoMonth">
                        <div class="incomeTip">前两个月收益</div>
                        <div class="person">个人</div>
                        <div class="predict">预估收益:{{incomeData.lastTwoMonth.estimate_profit}}元</div>
                        <div class="actually">实际收益:{{incomeData.lastTwoMonth.settlement_profit}}元</div>
                        <div class="chain">环比前3个月实际收益百分比:{{incomeData.lastTwoMonth.user_rate}}</div>
                        <div class="formula">(公式：前两个月实际收益➗前三个月实际收益)</div>
                        <div class="person">团队</div>
                        <div class="predict">预估收益:{{incomeData.lastTwoMonth.team_estimate_profit}}元</div>
                        <div class="actually">实际收益:{{incomeData.lastTwoMonth.team_settlement_profit}}元</div>
                        <div class="chain">环比前3个月实际收益百分比:{{incomeData.lastTwoMonth.team_rate}}</div>
                        <div class="formula">(公式：前两个月实际收益➗前三个月实际收益)</div>
                    </div>
                    <div class="lastMonth">
                        <div class="incomeTip">前三个月收益</div>
                        <div class="person">个人</div>
                        <div class="predict">预估收益:{{incomeData.lastThreeMonth.estimate_profit}}元</div>
                        <div class="actually">实际收益:{{incomeData.lastThreeMonth.settlement_profit}}元</div>
                        <div class="chain">环比前4个月实际收益百分比:{{incomeData.lastThreeMonth.user_rate}}</div>
                        <div class="formula">(公式：前三个月实际收益➗前四个月实际收益)</div>
                        <div class="person">团队</div>
                        <div class="predict">预估收益:{{incomeData.lastThreeMonth.team_estimate_profit}}元</div>
                        <div class="actually">实际收益:{{incomeData.lastThreeMonth.team_settlement_profit}}元</div>
                        <div class="chain">环比前4个月实际收益百分比:{{incomeData.lastThreeMonth.team_rate}}</div>
                        <div class="formula">(公式：前三个月实际收益➗前四个月实际收益)</div>
                    </div>
                </div>
                <div>
                    <div class="incomeBottTitle">本月预估收益：</div>
                    <span class="incomeBott">个人：{{incomeData.thisMonth.estimate_profit}}元</span>
                    <span class="incomeBott">团队：{{incomeData.thisMonth.team_estimate_profit}}元</span>
                </div>
                <div>
                    <div class="incomeBottTitle">本月实际收益：</div>
                    <span class="incomeBott">个人：{{incomeData.thisMonth.settlement_profit}}元</span>
                    <span class="incomeBott">团队：{{incomeData.thisMonth.team_settlement_profit}}元</span>
                </div>
            </div>
            <!-- 团队常购商品组件 -->
            <team-shop v-if="!showswich" :teamId='incomeDetailUserId'></team-shop>
        </div>
    </div>
</template>

<script>
import request from '@/axios'
import setting from '@/setting'
import teamShop from '../views/teamShops.vue'
export default {
    props: ['incomeDetailUserId'],
    inject: ['alert', 'showLoading', 'hideLoading'],
    components:{
        'team-shop':teamShop
    },
    data() {
        return {
            incomeData:{
                lastMonth:{},
                lastTwoMonth:{},
                lastThreeMonth:{},
                thisMonth:{}
            },
            showswich:true,
        }
    },
    created(){
        this.$nextTick(()=>{
            this.getUserProfitInfo();
        })
    },
    methods: {
        changeBtn(e){
            this.showswich = !this.showswich;
        },
        getUserProfitInfo(){
            this.showLoading()
            request({
                url: setting.urls.userProfitInfo,
                method: 'get',
                params:{
                    'user_id':this.incomeDetailUserId
                }
            }).then(res=>{
                console.log(res,"用户收益详情")
                if(res.status == 200){
                    if(res.data.code == 200){
                        const rest = res.data.data
                        this.incomeData = Object.assign({}, rest) 
                    }
                }
            }).catch((error) => {
                this.alert('加载用户收益详情失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        goBack(){//返回上一级
            this.$emit("returnOne")
        }
    },
}
</script>

<style scoped>
.detail-data-box{padding-top: 0;}
.chooseMenu{display: flex;margin: 20px 0;}
.menuText{display: block;width: 110px;height: 35px;text-align: center;line-height: 35px;color: #ffffff;border-radius: 7px;font-size: 16px;font-weight: bold;cursor: pointer;margin-right: 30px;}
.chooseSe{background-color: #52c7f2;}
.inChoose{background-color: #999999;}
.userIncome{width: 100%;height: 450px; display: flex;padding: 20px 0;box-sizing: border-box;border-bottom: 1px solid #666666;}
.lastMonth{width: 33%;display: flex;flex-direction: column;align-items: center;justify-content: space-around;position: relative;}
.incomeTip{font-size: 20px;font-weight: bold;}
.person{font-size: 18px;font-weight: bolder;font-family: "微软雅黑";margin-top: 10px;}
.predict{font-size: 18px;font-weight: bold;}
.actually{font-size: 18px;font-weight: bold;}
.chain{font-size: 14px;color: red;}
.formula{font-size: 14px;color: #666666;}
.lastTwoMonth::before,.lastTwoMonth::after{position: absolute;content: '';width: 7px;top: 20px; height: 300px;right: -30px;background-color: #eeeeee;}
.lastTwoMonth::before{left: -30px;}
.incomeBottTitle{font-size: 20px;font-weight: bolder;margin: 20px 0 20px 20px;}
.incomeBott{font-size: 16px;font-weight: bold;margin: 10px 20px 40px 100px;}
.goBack{font-size: 18px;color: #52c7f2;font-weight: 600;cursor: pointer;position: relative;top: 10px;}
</style>