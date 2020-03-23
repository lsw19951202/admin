<template>
    <div class="pop" v-if="isShow" >
        <div class="pop-mark" @click="hidePop"></div>
        <div class="pop-box" ref="popBox" v-if="popParams.htmlContent" :style="popParams.style" v-html="popParams.htmlContent">
        </div>
        <div class="pop-box" ref="popBox" v-else-if="popParams.echartOption" :style="popParams.style"></div>
        <div class="pop-box" ref="popBox" v-else :style="popParams.style">
            <div class="header">
                <span>{{popParams.header || '提示信息'}}</span>
                <div class="close-btn" @click="popCancel">
                    <img src="../../assets/configclose.png">
                </div>
            </div>
            <div class="body" v-if="popParams.type == 'changeLevel'">
                <div class="pop-groups user-level">
                    <label>用户原级别:</label>
                    <div>{{popParams.data.oldLevel}}</div>
                </div>
                <selector class="pop-groups user-level-selector" :value="popParams.data.newLevel" :selectParams="popParams.data.selectOptions" @selectOptsClicked="userLevelSelectOptsClicked"></selector>
            </div>
            <div class="body" v-if="popParams.type == 'moveTeam'">
                <div class="pop-groups search-teamleader">
                    <div style="flex: 1;"></div>
                    <label>团长名称:</label>
                    <input type="text" placeholder="请输入团长名称" v-model="popParams.leaderName">
                    <a @click="searchLeader">搜索</a>
                    <div style="flex: 1;"></div>
                </div>
                <div class="pop-groups teamleader-container">
                    <div class="teamleader-box">
                        <div class="teamleader-info" v-for="(teamLeader, index) in popParams.leaders" :key="index">
                            <img class="teamleader-avator" :src="teamLeader.avatar">
                            <div class="teamleader-name">{{teamLeader.nickName}}</div>
                            <input type="checkbox" :checked="teamLeader.checked" @change="teamLeaderChecked(index)">
                        </div>
                    </div>
                </div>
            </div>
            <div class="body" v-if="popParams.type == 'withdraw'">
                <div class="pop-groups withdraw-amount" v-if="!popParams.reject">
                    <label>提现金额:</label>
                    <span>{{popParams.data.applyAmount}}</span>
                </div>
                <div v-else class="pop-groups withdraw-reject">
                    <div>拒绝原因:</div>
                    <textarea v-model="popParams.rejectReason"></textarea>
                </div>
            </div>
            <div class="footer" v-if="popParams.type == 'withdraw'">
                <button class="action-btn confirm-cancel" v-if="popParams.reject" @click="popCancel">取消</button>
                <button class="action-btn confirm-reject" v-else @click="popReject">拒绝</button>
                <button class="action-btn confirm-ok" @click="popSave">确定</button>
            </div>
            <div class="footer" v-else>
                <button class="action-btn confirm-cancel" @click="popCancel">取消</button>
                <button class="action-btn confirm-ok" @click="popSave">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import tooltip from 'echarts/lib/component/tooltip'
import title from 'echarts/lib/component/title'
import line from 'echarts/lib/chart/line'
import legend from 'echarts/lib/component/legend'
import selectVue from './select.vue'

export default {
    props: ['isShow', 'popParams'],
    components: {
        'selector': selectVue
    },
    methods: {
        hidePop: function(){
            // this.$parent.showPop = false
            this.$emit('hidePop')
        },
        userLevelSelectOptsClicked: function(dt){
            this.$emit('userLevelSelectOptsClicked', dt)
        },
        popSave: function(){
            this.$emit('popSave')
        },
        popCancel: function(){
            this.$emit('popCancel')
        },
        popReject: function(){
            this.$emit('popReject')
        },
        teamLeaderChecked: function(idx){
            this.$emit('teamLeaderChecked', idx)
        },
        searchLeader: function(){
            this.$emit('searchClicked')
        }
    },
    updated: function(){
        this.$refs.popBox&&this.popParams.echartOption&&this.$nextTick().then(() => {
            this.echart = echarts.init(this.$refs.popBox)
            this.echart.setOption(this.popParams.echartOption)
        })
    }
}
</script>
<style scoped>
.pop { position: fixed; width: 100%; left: 0; top: 0; z-index: 9997; }
.pop-mark { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 9998; }
.pop-box { box-sizing: border-box; border-radius: .25rem; position: fixed !important; transform: translate(-50%, -50%); left: 50%; top: 50%; z-index: 9999; background-color: #ffffff; }
.pop-box .header { width: 100%; height: 2.1875rem; border-bottom: 1px solid #e5e5e5; }
.pop-box .header span { display: block; width: 100%; height: 100%; line-height: 2.1875rem; text-align: center; font-size: .625rem; color: #333333; font-weight: bold; font-family: 'Microsoft YaHei'; }
.pop-box .header .close-btn { cursor: pointer; margin-top: -2.1875rem; float: right; width: 2.1875rem; height: 100%; line-height: 2.1875rem; text-align: center; padding: 0; }
.pop-box .header .close-btn img { vertical-align: middle; width: .4375rem; height: .4375rem; }
.pop-box .body { padding: 1rem 0; }
.pop-box .body .pop-groups { width: 100%; font-size: .4375rem; display: flex; }
.pop-box .body .pop-groups label { width: 4.28125rem; text-align: right; height: .625rem; line-height: .625rem; }
.pop-box .body .pop-groups.user-level>div { flex: 1; width: 0; margin-left: .25rem; height: .625rem; line-height: .625rem; }
.pop-box .footer { display: flex; width: 100%; height: 2.75rem; padding: .59375rem 3.03125rem .90625rem; box-sizing: border-box; }
.pop-box .footer .action-btn { vertical-align: top; width: 5.3125rem; height: 1.25rem; text-align: center; line-height: 1.25rem; font-size: .5rem; border-radius: .25rem; }
.pop-box .footer .confirm-cancel,.pop-box .footer .confirm-reject { background-color: #e5e5e5; color: #333333; }
.pop-groups.search-teamleader { height: 1.25rem; line-height: 1.25rem; text-align: center; }
.pop-groups.search-teamleader label { height: 1.25rem; line-height: 1.25rem; color: #333333; display: block; width: auto; }
.pop-groups.search-teamleader input { font-size: .4375rem; height: 1.25rem; line-height: 1.25rem; box-sizing: border-box; width: 9.375rem; padding: .34375rem .4375rem .3125rem; border: 1px solid #e5e5e5; color: #333333; border-radius: .125rem; margin-left: .25rem; }
.pop-groups.search-teamleader a { color: #4381E6; margin-left: .25rem; cursor: pointer; }
.teamleader-container { text-align: center; width: 100%; box-sizing: border-box; padding-top: 1rem; overflow-x: scroll; }
.teamleader-box { display: inline-flex; }
.teamleader-info { width: 5rem; overflow: hidden; }
.teamleader-avator { width: 3.125rem; height: 3.125rem; border-radius: 0.25rem; }
.teamleader-name { width: 100%; height: .75rem; line-height: .75rem; text-align: center; margin-top: .75rem; font-size: .5625rem; color: #333333; white-space: nowrap; overflow-x: scroll; }
.pop-box .body .pop-groups.withdraw-amount { box-sizing: border-box; text-align: center; padding-top: 1rem; padding-bottom: 1rem; color: #333333; display: block; }
.withdraw-amount span { font-size: .5625rem; font-weight: bold; }
.pop-box .body .pop-groups.withdraw-reject { display: block; }
.withdraw-reject { padding: 0 3rem; box-sizing: border-box; }
.withdraw-reject>div { height: 1.15625rem; line-height: 1.15625rem; color: #333333; }
.withdraw-reject>textarea { width: 100%; height: 3rem; color: #333333; resize: none; border: 1px solid #e5e5e5; }
</style>