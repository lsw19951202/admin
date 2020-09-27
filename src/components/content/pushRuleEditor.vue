<template>
<div class="push-rule-editor">
    <div class="push-type">
        <input type="radio" id="t1" name="pushType" value="1" v-model="pushObj.push_type" :disabled="!editable">
        <label for="t1">定时推送</label>
        <input type="radio" id="t2" name="pushType" value="2" v-model="pushObj.push_type" :disabled="!editable" style="margin-left: 20px;">
        <label for="t2">立即推送</label>
    </div>
    <div class="timebox" v-if="pushObj.push_type == 1">
        <div class="necessary line">
            <label>生效时间</label>
            <div class="right">
                <flat-pickr class="search-time-picker" v-model="pushObj.start_time" :disabled="!editable" :config="dateConfig"></flat-pickr>
                至
                <flat-pickr class="search-time-picker" v-model="pushObj.end_time" :disabled="!editable" :config="dateConfig"></flat-pickr>
            </div>
        </div>
        <div class="line">
            <label>push间隔天数</label>
            <div class="right">
                <select :disabled="!editable" v-model="pushObj.push_interval_num">
                    <option value="1">1天</option>
                    <option value="2">2天</option>
                    <option value="3">3天</option>
                    <option value="4">4天</option>
                    <option value="5">5天</option>
                    <option value="6">6天</option>
                    <option value="7">7天</option>
                </select>
            </div>
        </div>
        <div class="line necessary">
            <label>当天push时间</label>
            <div class="right">
                <flat-pickr :disabled="!editable" v-model="pushObj.time" class="search-time-picker" :config="dateConfig2"></flat-pickr>
            </div>
        </div>
    </div>
    <div class="pushToBox">
        <label>push对象</label>
        <div class="right">
            <div>
                <input type="radio" id="t3" value="1" v-model="pushUserType" name="pushToType" :disabled="!editable">
                <label for="t3">全部用户</label>
                <input type="radio" id="t4" value="2" v-model="pushUserType" name="pushToType" :disabled="!editable" style="margin-left: 20px;">
                <label for="t4">按用户等级</label>
                <input type="radio" id="t5" value="3" v-model="pushUserType" name="pushToType" :disabled="!editable" style="margin-left: 20px;">
                <label for="t5">不活跃用户</label>
                <input type="radio" id="t25" value="4" v-model="pushUserType" name="pushToType" :disabled="!editable" style="margin-left: 20px;">
                <label for="t25">指定用户</label>
            </div>
            <div class="levelBox" v-if="pushUserType == 2">
                <div class="userLevel">
                    <label>购物等级</label>
                    <div class="levels">
                        <input type="checkbox" id="t6" :disabled="!editable" :checked="pushObj['push_obj'] && pushObj['push_obj'] == '1,2,3'" @change.prevent.stop="buyLevelClicked('all')">
                        <label for="t6">全部</label>
                        <input type="checkbox" id="t7" :disabled="!editable" value="1" :checked="pushObj['push_obj'] && pushObj['push_obj'].indexOf('1') >= 0" @change.prevent.stop="buyLevelClicked(1)">
                        <label for="t7">会员</label>
                        <input type="checkbox" id="t8" :disabled="!editable" value="2" :checked="pushObj['push_obj'] && pushObj['push_obj'].indexOf('2') >= 0" @change.prevent.stop="buyLevelClicked(2)">
                        <label for="t8">团长</label>
                        <input type="checkbox" id="t9" :disabled="!editable" value="3" :checked="pushObj['push_obj'] && pushObj['push_obj'].indexOf('3') >= 0" @change.prevent.stop="buyLevelClicked(3)">
                        <label for="t9">总监</label>
                    </div>
                </div>
                <div class="liveLevel">
                    <label>生活等级</label>
                    <div class="levels">
                        <input type="checkbox" id="t10" :disabled="!editable" :checked="pushObj['push_obj'] && pushObj['push_obj'] == '4,5,6'" @change.prevent.stop="liveLevelClicked('all')">
                        <label for="t10">全部</label>
                        <input type="checkbox" id="t11" :disabled="!editable" value="4" :checked="pushObj['push_obj'] && pushObj['push_obj'].indexOf('4') >= 0" @change.prevent.stop="liveLevelClicked(4)">
                        <label for="t11">中级达人</label>
                        <input type="checkbox" id="t12" :disabled="!editable" value="5" :checked="pushObj['push_obj'] && pushObj['push_obj'].indexOf('5') >= 0" @change.prevent.stop="liveLevelClicked(5)">
                        <label for="t12">高级达人</label>
                        <input type="checkbox" id="t13" :disabled="!editable" value="6" :checked="pushObj['push_obj'] && pushObj['push_obj'].indexOf('6') >= 0" @change.prevent.stop="liveLevelClicked(6)">
                        <label for="t13">超级达人</label>
                    </div>
                </div>
            </div>
            <div class="activeUser" v-if="pushUserType == 3">
                <input type="radio" id="t21" :disabled="!editable" value="3" v-model="pushObj.inactive_users">
                <label for="t21">3天未登陆</label>
                <input type="radio" id="t22" :disabled="!editable" value="7" v-model="pushObj.inactive_users">
                <label for="t22">7天未登陆</label>
                <input type="radio" id="t23" :disabled="!editable" value="15" v-model="pushObj.inactive_users">
                <label for="t23">15天未登陆</label>
                <input type="radio" id="t24" :disabled="!editable" value="30" v-model="pushObj.inactive_users">
                <label for="t24">一个月未登录</label>
            </div>
            <div class="userPhones" v-if="pushUserType == 4">
                <textarea placeholder="手机号码,多个号码使用英文逗号隔开" v-model="pushObj.phone"></textarea>
            </div>
        </div>
    </div>
    <div class="urlBox">
        <label>跳转页面</label>
        <div class="right">
            <div class="hasUrlBox">
                <input type="radio" name="hasUrl" value="1" v-model="hasUrl" id="t14" :disabled="!editable">
                <label for="t14">有</label>
                <input type="radio" name="hasUrl" value="2" v-model="hasUrl" id="t15" :disabled="!editable">
                <label for="t15">无</label>
            </div>
            <div class="urlEditBox" v-if="hasUrl == 1">
                <div class="appPage">
                    <label>
                        <input type="radio" name="urlType" value="1" v-model="urlType" id="t16" :disabled="!editable">
                        <label for="t16">跳转至APP页面</label>
                    </label>
                    <div class="pageEditBox">
                        <input type="text" placeholder="请填写页面名称" v-model="appPage.jump_desc" :disabled="!editable || urlType == 2" @focus.prevent.stop="showPushPageList">
                        <div class="tips">APP内菜单页（如发圈赚、生活赚）或者为某个专题页</div>
                        <div class="appPageList" v-show="showPushPage">
                            <slot v-for="(page, idx) in pushPageList">
                                <div class="option" :key="idx" data-idx="idx" v-if="page.jump_type != 2" @click.prevent.stop="pushPageSelected(idx)">
                                    {{page.jump_desc}}
                                </div>
                            </slot>
                        </div>
                    </div>
                </div>
                <div class="userDefinedPage">
                    <label>
                        <input type="radio" name="urlType" value="2" v-model="urlType" id="t17" :disabled="!editable">
                        <label for="t17">自定义页面</label>
                    </label>
                    <div class="pageEditBox">
                        <div class="pageName">
                            <label>页面名称</label>
                            <input type="text" placeholder="请填写跳转页面名称" :disabled="!editable || urlType == 1" v-model="userDefinedPage.jump_desc">
                        </div>
                        <div class="pageUrl">
                            <label>跳转链接</label>
                            <input type="text" placeholder="请填写跳转链接" :disabled="!editable || urlType == 1" v-model="userDefinedPage.url">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pushOs">
        <label>push系统</label>
        <div class="right">
            <input type="radio" id="t18" :disabled="!editable" value="all" v-model="pushObj.os">
            <label for="t18">全部</label>
            <input type="radio" id="t19" value="android" :disabled="!editable" v-model="pushObj.os">
            <label for="t19">安卓</label>
            <input type="radio" id="t20" value="ios" :disabled="!editable" v-model="pushObj.os">
            <label for="t20">IOS</label>
        </div>
    </div>
</div>
</template>
<script>
import flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'

export default {
    methods: {
        liveLevelClicked(level){
            const levelArr = this.pushObj['push_obj'] && this.pushObj['push_obj'].split(',') || []
            for(let idx = 1; idx <= 3; idx++){
                if(levelArr.indexOf('' + idx) >= 0){
                    levelArr.splice(levelArr.indexOf('' + idx), 1)
                }
            }
            if(level == 'all'){
                if(this.pushObj['push_obj'] == '4,5,6'){
                    this.pushObj['push_obj'] = ''
                }else{
                    this.pushObj['push_obj'] = '4,5,6'
                }
            }else if(level == 4){
                if(levelArr.indexOf('4') >= 0){
                    levelArr.splice(0, 1)
                }else{
                    levelArr.splice(0, 0, '4')
                }
                this.pushObj['push_obj'] = levelArr.join(',')
            }else if(level == 5){
                if(levelArr.indexOf('5') >= 0){
                    levelArr.splice(levelArr.indexOf('5'), 1)
                }else{
                    if(levelArr.indexOf('4') >= 0){
                        levelArr.splice(1, 0, '5')
                    }else{
                        levelArr.splice(0, 0, '5')
                    }
                }
                this.pushObj['push_obj'] = levelArr.join(',')
            }else if(level == 6){
                if(levelArr.indexOf('6') >= 0){
                    levelArr.splice(levelArr.indexOf('6'), 1)
                }else{
                    levelArr.push('6')
                }
                this.pushObj['push_obj'] = levelArr.join(',')
            }
        },
        buyLevelClicked(level){
            const levelArr = this.pushObj['push_obj'] && this.pushObj['push_obj'].split(',') || []
            for(let idx = 4; idx <= 6; idx++){
                if(levelArr.indexOf('' + idx) >= 0){
                    levelArr.splice(levelArr.indexOf('' + idx), 1)
                }
            }
            if(level == 'all'){
                if(this.pushObj['push_obj'] == '1,2,3'){
                    this.pushObj['push_obj'] = ''
                }else{
                    this.pushObj['push_obj'] = '1,2,3'
                }
            }else if(level == 1){
                if(levelArr.indexOf('1') >= 0){
                    levelArr.splice(0, 1)
                }else{
                    levelArr.splice(0, 0, '1')
                }
                this.pushObj['push_obj'] = levelArr.join(',')
            }else if(level == 2){
                if(levelArr.indexOf('2') >= 0){
                    levelArr.splice(levelArr.indexOf('2'), 1)
                }else{
                    if(levelArr.indexOf('1') >= 0){
                        levelArr.splice(1, 0, '2')
                    }else{
                        levelArr.splice(0, 0, '2')
                    }
                }
                this.pushObj['push_obj'] = levelArr.join(',')
            }else if(level == 3){
                if(levelArr.indexOf('3') >= 0){
                    levelArr.splice(levelArr.indexOf('3'), 1)
                }else{
                    levelArr.push('3')
                }
                this.pushObj['push_obj'] = levelArr.join(',')
            }
        },
        pushPageSelected(idx){
            const pushPage = this.pushPageList[idx]
            this.appPage['jump_type'] = pushPage['jump_type']
            this.appPage['jump_desc'] = pushPage['jump_desc']
            this.appPage.url = pushPage.url
            this.hidePushPageList()
        },
        showPushPageList(){
            this.showPushPage = true
        },
        hidePushPageList(){
            this.showPushPage = false
        },
        getPushRule(){
            return {
                pushUserType: this.pushUserType,
                hasUrl: this.hasUrl,
                urlType: this.urlType,
                userDefinedPage: this.userDefinedPage,
                appPage: this.appPage
            }
        }
    },
    props: ['editable', 'pushObj', 'pushPage'],
    components: {
        'flat-pickr': flatpickr
    },
    watch: {
        pushUserType(nVal){
            if(nVal == 1){
                this.pushObj['push_obj'] = ''
                this.pushObj['inactive_users'] = ''
                this.pushObj['phone'] = ''
            }else if(nVal == 2){
                this.pushObj['inactive_users'] = ''
                this.pushObj['phone'] = ''
            }else if(nVal == 3){
                this.pushObj['push_obj'] = ''
                this.pushObj['phone'] = ''
            }else if(nVal == 4){
                this.pushObj['push_obj'] = ''
                this.pushObj['inactive_users'] = ''
            }
        }
    },
    created(){
        this.pushPageList = this.pushPage
        if(this.pushObj['phone']){
            this.pushUserType = 4
        }else if(this.pushObj['push_obj'] == '1,2,3,4,5,6'){
            this.pushUserType = 1
            this.pushObj['push_obj'] = ''
        }else if(['3', '7', '15', '30'].indexOf(this.pushObj.inactive_users) >= 0){
            this.pushUserType = 3
        }else{
            this.pushUserType = 2
        }
        if(this.pushObj['push_type'] == '立即推送'){
            this.pushObj['push_type'] = 2
        }else{
            this.pushObj['push_type'] = 1
        }
        if(this.pushObj.url){
            this.hasUrl = 1
        }else{
            this.hasUrl = 2
        }
        if(this.pushObj.jump_type == 2){
            this.urlType = 2
            this.userDefinedPage['jump_desc'] = this.pushObj.jump_desc
            this.userDefinedPage['url'] = this.pushObj.url
        }else{
            this.urlType = 1
            this.appPage['jump_desc'] = this.pushObj.jump_desc
            this.appPage['jump_type'] = this.pushObj.jump_type
            this.appPage['url'] = this.pushObj.url
        }
    },
    data(){
        return {
            // 1 全部用户 2 按用户等级  3 不活跃用户
            pushUserType: 1,
            // 1 有跳转页面 2 无跳转页面
            hasUrl: 1,
            // 1 跳转至APP页面 2 跳转至自定义页面
            urlType: 1,
            // APP跳转页面
            appPage: {
                'jump_desc': '',
                'jump_type': '',
                url: ''
            },
            // 用户自定义跳转
            userDefinedPage: {
                'jump_desc': '',
                'jump_type': 2,
                url: ''
            },
            // 是否显示APP页面列表
            showPushPage: false,
            pushPageList: [],
            dateConfig: {
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i:S',
                enableTime: true,
                'time_24hr': true
            },
            dateConfig2: {
                locale: Mandarin,
                dateFormat: 'H:i:S',
                enableTime: true,
                enableSeconds: true,
                noCalendar: true,
                'time_24hr': true,
                altFormat: 'H:i:S'
            }
        }
    }
}
</script>
<style lang="less" scoped>
.push-rule-editor {
    background-color: #DDD;
    overflow: hidden;
    height: auto;
    width: 25rem;
    box-sizing: border-box;
    padding: .3125rem;
    .push-type {
        width: 100%;
        height: 1.25rem;
        line-height: 1.25rem;
    }
    .timebox {
        width: 100%;
        height: auto;
        background-color: white;
        border-radius: .125rem;
        box-sizing: border-box;
        padding: .3125rem .625rem;
        .line {
            width: 100%;
            height: 1.25rem;
            line-height: 1.24rem;
            display: flex;
            label {
                width: 3.1rem;
                height: 100%;
            }
            .right {
                width: 0;
                flex: 1;
                height: 100%;
                margin-top: 0;
                .search-time-picker {
                    vertical-align: middle;
                }
                select {
                    width: 5rem;
                    height: 1rem;
                    line-height: 1rem;
                    border-radius: .125rem;
                    border: 1px solid #D9D9D9;
                    box-sizing: border-box;
                    font-size: .4375rem;
                    vertical-align: middle;
                    padding-left: .3125rem;
                    padding-right: .3125rem;
                    margin-left: .2rem;
                    appearance: menulist;
                }
            }
        }
        .line.necessary {
            label::after {
                display: inline-block;
                content: '*';
                color: red;
                font-size: .375rem;
            }
        }
    }
    .pushToBox {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: .3125rem .625rem;
        display: flex;
        label {
            width: 3.1rem;
        }
        .right {
            margin-top: 0;
            width: 0;
            flex: 1;
            height: auto;
            .levelBox {
                width: 100%;
                height: auto;
                background-color: white;
                border-radius: .125rem;
                box-sizing: border-box;
                padding: .3125rem .625rem;
                .userLevel,.liveLevel {
                    width: 100%;
                    height: auto;
                    display: flex;
                    label {
                        width: 2rem;
                    }
                    .levels {
                        width: 0;
                        flex: 1;
                        height: 0;
                        input {
                            margin-left: .625rem;
                        }
                    }
                }
            }
            .activeUser {
                width: 100%;
                height: 1.5rem;
                line-height: .625rem;
                box-sizing: border-box;
                background-color: white;
                border-radius: .125rem;
                padding: .4375rem .625rem;
                input {
                    margin-left: .625rem;
                }
            }
            .userPhones {
                width: 100%;
                height: auto;
                textarea {
                    height: 3rem;
                    line-height: .625rem;
                    resize: none;
                    width: 100%;
                    box-sizing: border-box;
                    padding: .3rem;
                }
            }
        }
    }
    .pushToBox>label::after {
        content: '*';
        display: inline-block;
        font-size: .375rem;
        color: red;
    }
    .urlBox {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: .3125rem .625rem;
        display: flex;
        label {
            width: 3.1rem;
        }
        .right {
            height: auto;
            width: 100%;
            margin-top: 0;
            padding: .3125rem .625rem;
            .hasUrlBox {
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                input {
                    margin-left: 1rem;
                }
            }
            .hasUrlBox>input:first-child {
                margin-left: 0;
            }
            .urlEditBox {
                width: 100%;
                height: auto;
                background-color: white;
                border-radius: .125rem;
                padding: .3125rem .625rem;
                .appPage,.userDefinedPage {
                    width: 100%;
                    height: auto;
                    display: flex;
                    label {
                        width: 3.8rem;
                    }
                    .pageEditBox {
                        width: 0;
                        height: auto;
                        flex: 1;
                        position: relative;
                        line-height: 1rem;
                        input {
                            width: 8rem;
                            height: 1rem;
                            line-height: 1rem;
                            border-radius: .125rem;
                            border: 1px solid #D9D9D9;
                            padding: 0rem .25rem;
                            text-align: center;
                            box-sizing: border-box;
                        }
                        .tips {
                            width: 100%;
                            height: .625rem;
                            line-height: .625rem;
                            font-size: .3125rem;
                            color: turquoise;
                        }
                        .appPageList {
                            width: 8rem;
                            height: 5rem;
                            overflow: hidden;
                            overflow-y: scroll;
                            position: absolute;
                            left: 0;
                            box-sizing: border-box;
                            top: 1rem;
                            background-color: white;
                            text-align: center;
                            border: 1px solid #D9D9D9;
                            z-index: 10;
                            .option {
                                width: 100%;
                                height: 1rem;
                                line-height: 1rem;
                            }
                            .option:hover {
                                background-color: blue;
                            }
                        }
                    }
                }
                .userDefinedPage {
                    .pageEditBox {
                        box-sizing: border-box;
                        border: 1px solid #D9D9D9;
                        padding: .3125rem .625rem;
                        .pageName,.pageUrl {
                            width: 100%;
                            display: flex;
                            label {
                                width: 2.5rem;
                            }
                            input {
                                width: 0;
                                flex: 1;
                            }
                        }
                        .pageUrl {
                            margin-top: .3125rem;
                        }
                    }
                }
            }
        }
    }
    .urlBox>label::after {
        content: '*';
        display: inline-block;
        font-size: .375rem;
        color: red;
    }
    .pushOs {
        width: 100%;
        height: .625rem;
        line-height: .625rem;
        display: flex;
        padding: .3125rem .625rem;
        label {
            width: 3.1rem;
        }
        .right {
            width: 0;
            flex: 1;
            height: .625rem;
            line-height: .625rem;
            margin-top: 0;
            input {
                margin-left: .625rem;
            }
            input:first-child {
                margin-left: 0;
            }
        }
    }
}
</style>