<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showPushEditor">
            <header class="search-header">
                <div class="search-group">
                    <label>ID:</label>
                    <input type="text" placeholder="请输入" v-model="id">
                </div>
                <div class="search-group">
                    <label>push标题:</label>
                    <input type="text" placeholder="请输入" v-model="title">
                </div>
                <selector class="search-group" :value="os" :selectParams="osSelectParams" @selectOptsClicked="osSelectOptsClicked"></selector>
                <selector class="search-group" :value="pushTo" :selectParams="pushToSelectParams" @selectOptsClicked="pushToSelectOptsClicked"></selector>
                <selector class="search-group" :value="status" :selectParams="statusSelectParams" @selectOptsClicked="statusSelectOptsClicked"></selector>
                <div class="search-group">
                    <label>更新时间:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="startTime" placeholder="起始时间"></flat-picker>
                    <div class="split-line"><div></div></div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="endTime" placeholder="结束时间"></flat-picker>
                </div>
                <button class="action-btn" @click.prevent.stop="loadPushList(1)">搜索</button>
                <button class="action-btn" v-if="action_add == 'T'" @click.prevent.stop="createNewPush">新建</button>
            </header>
            <div class="table-container" style="margin-top: .5rem;">
                <detail-table style="width: 90rem;" :tbType="'pushList'" :tbData="tbData" :tableHeader="tableHeader"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadPushList"></page>
        </div>
        <confirm :isShow="showConfirm" :confirmParams="confirmParams" @confirmClicked="confirmClicked"></confirm>
        <div class="testPushConfirm" v-show="showTestBox">
            <div class="main">
                <div class="title">
                    请确认测试下发账号
                </div>
                <div class="accounts">
                    当前测试账号:{{testAccount}}
                    <div class="edit-btn" @click.prevent.stop="openAccountEditBox">编辑</div>
                </div>
                <div class="editAccountBox" v-show="showTestAccountEditBox">
                    <label>编辑账号</label>
                    <div class="ipt">
                        <input type="text" v-model="testAccount2">
                        <div class="tips">*请输入需要测试的手机号，以英文逗号隔开</div>
                    </div>
                    <div class="action-btn" @click.prevent.stop="setPushPhone">保存</div>
                </div>
                <div class="btns">
                    <div class="action-btn" style="background-color: #ccc; color: #333;" @click.prevent.stop="hideTestBox">取消</div>
                    <div class="action-btn" @click.prevent.stop="createPushTest">测试</div>
                </div>
            </div>
        </div>
        <div class="pushObjConfirm" v-show="showPushObjConfirm">
            <div class="main">
                <div class="title">
                    确认推送消息
                </div>
                <div class="line">
                    <label></label>
                    <div class="right">
                        <div class="action-btn" @click.prevent.stop="testPush2">测试</div>
                    </div>
                </div>
                <div class="line">
                    <label>push规则</label>
                    <div class="right rule">
                        <div class="pushType">{{newPushObj.push_type == 1 ? '定时推送' : '立即推送'}}</div>
                        <div class="pushTime" v-if="newPushObj.push_type == 1">
                            <div class="timeline">
                                <label>生效时间</label>
                                <div class="right">
                                    {{newPushObj.start_time + '到' + newPushObj.end_time}}
                                </div>
                            </div>
                            <div class="timeline">
                                <label>push间隔天数</label>
                                <div>
                                    {{newPushObj.push_interval_num + '天'}}
                                </div>
                            </div>
                            <div class="timeline">
                                <label>当天push时间</label>
                                <div>
                                    {{newPushObj.time}}
                                </div>
                            </div>
                        </div>
                        <div class="pushTo">
                            <label>push对象</label>
                            <div class="right">
                                {{getPushObjStr}}
                            </div>
                        </div>
                        <div class="pushPage">
                            <label>跳转页面</label>
                            <div class="right jump">
                                <label>{{newPushObj.hasUrl == 1 ? (newPushObj.urlType == 1 ? '跳转至APP页面' : '自定义页面') : '无'}}</label>
                                <div class="jump" v-if="newPushObj.hasUrl == 1">
                                    <div class="line">
                                        <label>页面名称</label>
                                        <div>{{newPushObj.jump_desc}}</div>
                                    </div>
                                    <div class="line">
                                        <label>跳转链接</label>
                                        <div :alt="newPushObj.url" :title="newPushObj.url">{{newPushObj.url}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pushOs">
                            <label>push机型</label>
                            <div class="right">{{newPushObj.os == 'all' ? '全部' : newPushObj.os == 'ios' ? 'IOS' : 'Android'}}</div>
                        </div>
                    </div>
                </div>
                <div class="line">
                    <label>push内容</label>
                    <div class="right content">
                        <div class="pushTem">
                            <div class="title">
                                <img src="../assets/push-logo.png">
                                洋皮卷
                            </div>
                            <div class="content">
                                <div class="title">{{newPushObj.title}}</div>
                                <div class="text">{{newPushObj.text}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line">
                    <label></label>
                    <div class="right">
                        <div class="action-btn" style="background-color: #ccc; color: #282828;" @click.prevent.stop="cancelConfirmBox">返回修改</div>
                        <div class="action-btn" @click.prevent.stop="saveNewPushObj">确认无误</div>
                    </div>
                </div>
            </div>
        </div>
        <push-editor v-if="showPushEditor" :pushPage="pushPage" :pushObj="pushObj" :editable="editable"></push-editor>
    </div>
</template>
<script>
import selectVue from '@/components/common/select.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import tableVue from '@/components/content/table.vue'
import pageVue from '@/components/content/page.vue'
import setting from '@/setting'
import request from '@/axios'
import qs from 'qs'
import confirmVue from '@/components/common/confirm.vue'
import pushEditorVue from '@/components/content/pushEditor.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadFields', 'loadTBData'],
    components: {
        'selector': selectVue,
        'flat-picker': flatPicker,
        'detail-table': tableVue,
        'page': pageVue,
        'confirm': confirmVue,
        'push-editor': pushEditorVue
    },
    data(){
        return {
            // 搜索条件
            id: null,
            title: null,
            os: '',
            pushTo: '',
            startTime: null,
            endTime: null,
            status: '',
            osSelectParams: {
                label: 'push系统',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '全部'
                }, {
                    value: 'ios',
                    text: 'IOS'
                }, {
                    value: 'android',
                    text: '安卓'
                }]
            },
            pushToSelectParams: {
                label: 'push对象',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '全部'
                }, {
                    value: 1,
                    text: '会员'
                }, {
                    value: 2,
                    text:' 团长'
                }, {
                    value: 3,
                    text: '总监'
                }, {
                    value: 4,
                    text: '中级'
                }, {
                    value: 5,
                    text: '高级'
                }, {
                    value: 6,
                    text: '超级'
                }]
            },
            statusSelectParams: {
                label: '发布状态',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '全部'
                }, {
                    value: 0,
                    text: '未生效'
                }, {
                    value: 1,
                    text: '生效中'
                }, {
                    value: 2,
                    text: '已下架'
                }]
            },
            dateConfig: {
                'time_24hr': true,
                locale: Mandarin
            },
            tbData: [],
            tableHeader: [],
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            // 是否有新建权限
            'action_add': 'F',
            // 列表fields
            fields: [],
            confirmParams: {
                header: '操作提示',
                text: '',
                type: 'modifyStatus',
                data: {
                    ids: null,
                    type: null
                }
            },
            showConfirm: false,
            pushList: [],
            pushObj: {id:null,title:null,text:null,time:null,'start_time':null,'end_time':null,'push_interval_num':null,'push_obj':null,'push_type':null,'jump_type':null,'jump_desc':null,url:null,os:null,'inactive_users':null,desc:null},
            showTestBox: false,
            showTestAccountEditBox: false,
            testPushObj: {
                title: '',
                text: '',
                url: ''
            },
            testAccount: '',
            testAccount2: '',
            showPushEditor: false,
            // 是否可以编辑
            editable: true,
            pushPage: [],
            newPushObj: {id:null,title:null,text:null,time:null,'start_time':null,'end_time':null,'push_interval_num':null,'push_obj':null,'push_type':null,'jump_type':null,hasUrl:null,urlType:null,'jump_desc':null,url:null,os:null,'inactive_users':null,desc:null},
            // 显示确认push对象弹窗
            showPushObjConfirm: false
        }
    },
    computed:{
        getPushObjStr(){
            if(this.newPushObj.pushUserType == 1){
                return '全部用户'
            }else if(this.newPushObj.pushUserType == 2){
                let str = ''
                if(this.newPushObj.push_obj.indexOf('1') >= 0){
                    str += '会员,'
                }
                if(this.newPushObj.push_obj.indexOf('2') >= 0){
                    str += '团长'
                }
                if(this.newPushObj.push_obj.indexOf('3') >= 0){
                    str += '总监'
                }
                if(this.newPushObj.push_obj.indexOf('4') >= 0){
                    str += '中级达人'
                }
                if(this.newPushObj.push_obj.indexOf('5') >= 0){
                    str += '高级达人'
                }
                if(this.newPushObj.push_obj.indexOf('6') >= 0){
                    str += '超级达人'
                }
                return str
            }else{
                return this.newPushObj.inactive_users + '天未登录'
            }
        }
    },
    created(){
        this.showLoading()
        Promise.all([
            this.loadFields(setting.urls.appFields, { 'field_type': 'pushList' }, 'get'),
            this.loadTBData(setting.urls.pushList, {}, 'get')
        ]).then(rst => {
            console.log(rst)
            this.fields = rst[0].fields
            const tableHeader = rst[0].tableHeader || []
            tableHeader[0].splice(0, 0, { name: '序号' })
            tableHeader[0].push({ name: '操作' })
            this.tableHeader = tableHeader
            this.$data['action_add'] = rst[1].actions.push_add
            this.createTBData(rst[1])
        }).catch(e => {
            this.alert('加载列表失败')
        }).then(() => {
            this.hideLoading()
        })
        this.getPushPhone()
    },
    methods: {
        cancelConfirmBox(){
            this.showPushObjConfirm = false
        },
        saveNewPushObj(){
            const requestParams = {
                title: this.newPushObj.title,
                text: this.newPushObj.text,
                os: this.newPushObj.os,
                desc: this.newPushObj.desc
            }
            if(this.newPushObj.id){
                requestParams.id = this.newPushObj.id
            }
            if(this.newPushObj.push_type == 1){
                requestParams['push_interval_num'] = this.newPushObj.push_interval_num
                requestParams['start_time'] = this.newPushObj.start_time
                requestParams['end_time'] = this.newPushObj.end_time
                requestParams['time'] = this.newPushObj.time
            }
            if(this.newPushObj.pushUserType == 2 || this.newPushObj.pushUserType == 1){
                requestParams['push_obj'] = this.newPushObj.push_obj
            }else if(this.newPushObj.push_type == 3){
                requestParams['inactive_users'] = this.newPushObj.inactive_users
            }
            if(this.newPushObj.hasUrl == 1){
                requestParams['jump_type'] = this.newPushObj.jump_type
                requestParams['jump_desc'] = this.newPushObj.jump_desc
                requestParams['url'] = this.newPushObj.url
            }
            return request({
                url: setting.urls.pushAdd,
                method: 'post',
                data: qs.stringify(requestParams)
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.cancelConfirmBox()
                    this.cancelEdit()
                    this.loadPushList(this.pageData.page)
                    this.alert('推送保存成功')
                }else{
                    this.alert(rst.data && rst.data.message || '推送保存失败')
                }
            }).catch(e => {
                this.alert(e.message || '推送保存失败')
            })
        },
        setPushPhone(){
            const phonesReg = /^(1[3-9]\d{9},)*(1[3-9]\d{9})$/
            if(!phonesReg.test(this.testAccount2)){
                this.alert('新测试号码格式错误')
                return
            }
            return request({
                url: setting.urls.pushPhone,
                method: 'post',
                data: qs.stringify({
                    phone: this.testAccount2
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.testAccount = rst.data.data.phone || ''
                    this.alert('修改测试手机号成功')
                }else{
                    this.alert('修改测试手机号失败')
                }
            }).catch(e => {
                this.alert(e.message || '修改测试手机号失败')
            })
        },
        getPushPhone(){
            return request({
                url: setting.urls.pushPhone,
                method: 'get',
                params: {}
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.testAccount = rst.data.data || ''
                    this.testAccount2 = rst.data.data || ''
                }
            })
        },
        cancelEdit(){
            this.showPushEditor = false
            this.$parent.subTitle2 = ''
        },
        savePushObj(){
            console.log('保存')
            if(!this.pushObj.title){
                this.alert('请填写推送标题')
                return
            }
            let pushText, pushRule
            for(let idx = 0; idx < this.$children.length; idx++){
                if(this.$children[idx].$el.className.indexOf('push-editor') >= 0){
                    pushText = this.$children[idx].getText()
                    pushRule = this.$children[idx].getPushRule()
                    break
                }
            }
            if(pushText){
                while(pushText.indexOf('&nbsp;') >= 0){
                    pushText = pushText.replace('&nbsp;', ' ')
                }
                while(pushText.indexOf('<div>') >= 0){
                    pushText = pushText.replace('<div>', '')
                }
                while(pushText.indexOf('</div>') >= 0){
                    pushText = pushText.replace('</div>', '\n')
                }
                while(pushText.indexOf('<br>') >= 0){
                    pushText = pushText.replace('<br>', '\n')
                }
                while(pushText.indexOf('\n\n') >= 0){
                    pushText = pushText.replace('\n\n', '\n')
                }
                if(pushText.startsWith('\n')){
                    pushText = pushText.replace('\n', '')
                }
                if(pushText.endsWith('\n')){
                    pushText = pushText.substring(0, pushText.length - 1)
                }
            }
            if(!pushText){
                this.alert('push文案必填')
                return
            }
            if(this.pushObj.push_type == 1){
                if(!this.pushObj.start_time){
                    this.alert('请设置开始生效时间')
                    return
                }
                if(!this.pushObj.end_time){
                    this.alert('请设置结束生效时间')
                    return
                }
                if(!this.pushObj.time){
                    this.alert('请设置当天push时间')
                    return
                }
            }
            if(pushRule.pushUserType == 1){
                // do nothing
            }else if(pushRule.pushUserType == 2){
                if(!this.pushObj.push_obj){
                    this.alert('请选择push对象用户等级')
                    return
                }
            }else if(pushRule.pushUserType == 3){
                if(!this.pushObj.inactive_users){
                    this.alert('请选择push对象不活跃天数')
                    return
                }
            }
            if(pushRule.hasUrl == 1){
                if(pushRule.urlType == 1){
                    if(!pushRule.appPage.jump_desc){
                        this.alert('请选择PUSH跳转到APP的页面')
                        return
                    }
                }else{
                    if(!pushRule.userDefinedPage.jump_desc){
                        this.alert('请填写自定义推送页面名称')
                        return
                    }
                    if(!pushRule.userDefinedPage.url){
                        this.alert('请填写自定义推送跳转链接')
                        return
                    }
                }
            }
            if(!this.pushObj.os){
                this.alert('请选择推送用户手机系统')
                return
            }
            this.newPushObj = {
                id: this.pushObj.id,
                title: this.pushObj.title,
                text: pushText,
                'push_type': this.pushObj.push_type,
                time: this.pushObj.time,
                'start_time': this.pushObj.start_time,
                'end_time': this.pushObj.end_time,
                'push_interval_num': this.pushObj.push_interval_num || 1,
                'push_obj': pushRule.pushUserType == 1 ? '1,2,3,4,5,6' : this.pushObj.push_obj,
                'inactive_users': pushRule.pushUserType == 3 ? this.pushObj.inactive_users : '',
                desc: this.pushObj.desc,
                os: this.pushObj.os,
                hasUrl: pushRule.hasUrl,
                urlType: pushRule.urlType,
                pushUserType: pushRule.pushUserType,
                'jump_type': pushRule.urlType == 1 ? pushRule.appPage.jump_type : pushRule.userDefinedPage.jump_type,
                'jump_desc': pushRule.urlType == 1 ? pushRule.appPage.jump_desc: pushRule.userDefinedPage.jump_desc,
                url: pushRule.urlType == 1 ? pushRule.appPage.url : pushRule.userDefinedPage.url
            }
            this.showPushObjConfirm = true
        },
        createNewPush(){
            this.pushObj = {id:null,title:null,text:null,time:null,'push_type':null,'start_time':null,'end_time':null,'push_interval_num':null,'push_obj':null,'jump_type':null,'jump_desc':null,url:null,os:null,'inactive_users':null,desc:null}
            this.showPushEditor = true
            this.$parent.subTitle2 = '新增PUSH'
        },
        statusSelectOptsClicked(dt){
            this.status = dt
        },
        osSelectOptsClicked(dt){
            this.os = dt
        },
        pushToSelectOptsClicked(dt){
            this.pushTo = dt
        },
        loadPushList(pageNo){
            console.log('加载第' + pageNo + '页推送数据')
            console.log(this.id + '::' + this.title + '::' + this.os + '::' + this.pushTo + '::' + this.status + '::' + this.startTime + '::' + this.endTime)
            return this.loadTBData(setting.urls.pushList, {
                id: this.id,
                title: this.title,
                os: this.os,
                'push_obj': this.pushTo,
                status: this.status,
                'start_time': this.startTime,
                'end_time': this.endTime
            }, 'get').then(rst => {
                this.createTBData(rst)
            })
        },
        createTBData(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0

            const tbData = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([(idx < 9 ? '0' : '') + (idx + 1)])
                for(let idxx = 0; idxx < this.fields.length; idxx++){
                    tbData[idx].push(item[this.fields[idxx]])
                }
                tbData[idx].push({
                    pushEdit: item['push_edit'] == 'T' && (item['status'] == 0 || item['status'] == 2),
                    pushDel: item['push_operate'] == 'T' && (item['status'] == 0 || item['status'] == 2),
                    pushPub: item['push_operate'] == 'T' && (item['status'] == 0 || item['status'] == 2),
                    pushDown: item['push_operate'] == 'T' && item['status'] == 1
                })
            }
            this.tbData = Object.assign([], tbData)
            this.pushList = dt.data || []

            this.pushPage = dt.pushPage || []
        },
        pubBtnClicked(idx){
            console.log('发布或者下架' + idx)
            if(this.pushList[idx].status == 1){
                this.confirmParams.text = '是否下架已选中push？'
                this.confirmParams.data = {
                    ids: this.pushList[idx].id,
                    type: 'off'
                }
            }else{
                this.confirmParams.text = '是否发布已选中push？'
                this.confirmParams.data = {
                    ids: this.pushList[idx].id,
                    type: 'open'
                }
            }
            this.showConfirm = true
        },
        delBtnClicked(idx){
            console.log('删除' + idx)
            this.confirmParams.text = '是否删除已选中push？'
            this.confirmParams.data = {
                ids: this.pushList[idx].id,
                type: 'del'
            }
            this.showConfirm = true
        },
        editBtnClicked(idx){
            console.log('编辑' + idx)
            this.pushObj = JSON.parse(JSON.stringify(this.pushList[idx]))
            this.pushObj['push_interval_num'] = this.pushObj.push_interval_num ? this.pushObj.push_interval_num.replace('天', '') : null
            this.showPushEditor = true
            this.$parent.subTitle2 = '修改PUSH'
        },
        testPush(idx){
            console.log('测试' + idx)
            this.showTestBox = true
            this.testPushObj = {
                title: this.pushList[idx].title,
                text: this.pushList[idx].text,
                url: this.pushList[idx].url
            }
        },
        testPush2(){
            this.showTestBox = true
            this.testPushObj = {
                title: this.newPushObj.title,
                text: this.newPushObj.text,
                url: this.newPushObj.url
            }
        },
        hideTestBox(){
            this.showTestBox = false
        },
        createPushTest(){
            console.log('开始推送')
            return request({
                url: setting.urls.pushTest,
                method: 'get',
                params: this.testPushObj
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.alert('测试推送成功')
                    this.hideTestBox()
                }else{
                    this.alert('测试推送失败')
                }
            }).catch(e => {
                this.alert(e.message || '测试推送失败')
            })
        },
        openAccountEditBox(){
            this.showTestAccountEditBox = !this.showTestAccountEditBox
        },
        confirmClicked(dt){
            console.log(dt)
            this.showConfirm = false
            if(dt){
                this.pushOperate(dt.data.ids, dt.data.type)
            }
        },
        /**
         * @param { string } ids 1到多个推送记录ID，多个用逗号分隔
         * @param { string } type 操作类型 del 删除  off 下架  open 发布
         */
        pushOperate(ids, type){
            this.showLoading()
            request({
                url: setting.urls.pushOperate,
                method: 'post',
                data: qs.stringify({
                    ids,
                    type
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    return this.loadPushList(this.pageData.page)
                }else{
                    this.alert(rst.data.message || '操作失败')
                }
            }).catch(e => {
                this.alert(e.message || '操作失败')
            }).then(() => {
                this.hideLoading()
            })
        }
    }
}
</script>
<style lang="less" scoped>
.detail-container {
    background-color: #f2f2f2;
    padding: 0;
    margin: 0;
    overflow-y: scroll;
    .detail-data-box {
        margin-top: 0;
        .search-header {
            display: block;
            .search-group {
                margin-bottom: .5rem;
            }
        }
    }
    .testPushConfirm {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .7);
        z-index: 100;
        .main {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 4px;
            width: 600px;
            height: auto;
            font-size: 14px;
            padding: 20px;
            .title {
                font-size: 16px;
                border-bottom: 1px solid #333;
                padding: 10px 0;
            }
            .accounts {
                margin-top: 10px;
                .edit-btn {
                    display: inline-block;
                    margin-left: 10px;
                    border: 1px solid rgb(96, 153, 10);
                    border-radius: 2px;
                    padding: 1px 5px;
                    font-size: 12px;
                    color: rgb(96, 153, 10);
                    cursor: pointer;
                }
            }
            .editAccountBox {
                width: 100%;
                height: 80px;
                margin-top: 10px;
                display: flex;
                border: 1px solid #666;
                box-sizing: border-box;
                padding: 10px 20px;
                label {
                    margin-right: 8px;
                }
                .ipt {
                    width: 0;
                    flex: 1;
                    height: 80px;
                    margin-right: 10px;
                    input {
                        width: 100%;
                        height: 30px;
                        outline: none;
                        border: 1px solid #666;
                        box-sizing: border-box;
                        padding-left: 10px;
                        padding-right: 10px;
                    }
                    .tips {
                        font-size: 12px;
                        color: #999;
                    }
                }
                .action-btn {
                    padding: 1px .15rem;
                }
            }
            .btns {
                width: 100%;
                display: flex;
                margin-top: 20px;
                justify-content: center;
            }
        }
    }
    .pushObjConfirm {
        z-index: 90;
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .7);
        .main {
            background-color: white;
            border-radius: .125rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 22rem;
            height: auto;
            max-height: 20rem;
            overflow: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            padding: .375rem;
            .title {
                width: 100%;
                height: 1.25rem;
                line-height: 1.25rem;
                font-size: .625rem;
                box-sizing: border-box;
                border-bottom: 1px solid #ccc;
                font-weight: 700;
                letter-spacing: 2px;
            }
            .line {
                width: 100%;
                height: auto;
                display: flex;
                font-size: .4375rem;
                margin-top: .1rem;
                label {
                    width: 2.5rem;
                }
                .right {
                    width: 0;
                    flex: 1;
                    height: auto;
                    margin-top: 0;
                    .action-btn {
                        display: inline-block;
                    }
                    .pushType {
                        width: 100%;
                        height: .625rem;
                        line-height: .625rem;
                    }
                    .pushTime {
                        width: 100%;
                        height: auto;
                        background-color: white;
                        box-sizing: border-box;
                        padding: .375rem;
                        margin-top: .1rem;
                        .timeline {
                            width: 100%;
                            height: 1rem;
                            line-height: 1rem;
                            display: flex;
                            label {
                                width: 3.5rem;
                            }
                            .right {
                                width: 0;
                                flex: 1;
                            }
                        }
                    }
                    .pushTo,.pushPage,.pushOs {
                        margin-top: .1rem;
                        width: 100%;
                        height: auto;
                        display: flex;
                        height: 1rem;
                        line-height: 1rem;
                        label {
                            width: 3.875rem;
                        }
                        .right {
                            width: 0;
                            flex: 1;
                        }
                        .right.jump {
                            background-color: white;
                            display: flex;
                            box-sizing: border-box;
                            padding: .375rem;
                            label {
                                width: 3.5rem;
                            }
                            .jump {
                                width: 0;
                                flex: 1;
                                height: auto;
                                .line {
                                    width: 100%;
                                    height: 1rem;
                                    line-height: 1rem;
                                    margin-top: 0;
                                    label {
                                        width: fit-content;
                                    }
                                    div {
                                        width: 0;
                                        flex: 1;
                                        overflow: hidden;
                                        margin-left: .25rem;
                                        overflow-x: scroll;
                                    }
                                    div::-webkit-scrollbar {
                                        display: none;
                                    }
                                }
                            }
                        }
                    }
                    .pushPage {
                        height: auto;
                    }
                }
                .right.rule {
                    box-sizing: border-box;
                    padding: .375rem;
                    background-color: #ccc;
                }
                .right.content {
                    width: 100%;
                    height: auto;
                    box-sizing: border-box;
                    padding-right: 5rem;
                    .pushTem {
                        border: 1px solid #ccc;
                        width: 100%;
                        height: auto;
                        .title {
                            box-sizing: border-box;
                            padding-left: .5rem;
                            padding-top: .125rem;
                            line-height: 1rem;
                            font-weight: 400;
                            font-size: .5rem;
                            img {
                                display: inline-block;
                                width: 1rem;
                                height: 1rem;
                                vertical-align: top;
                            }
                        }
                        .content {
                            width: 100%;
                            height: auto;
                            box-sizing: border-box;
                            padding: .3rem .5rem;
                            line-height: .75rem;
                            .title {
                                border: none;
                                padding: 0;
                                font-weight: 600;
                                height: .75rem;
                            }
                            .text {
                                line-height: .625rem;
                            }
                        }
                    }
                }
            }
        }
        .main::-webkit-scrollbar {
            display: none;
        }
    }
}
.table-container {
    overflow: auto;
}
</style>