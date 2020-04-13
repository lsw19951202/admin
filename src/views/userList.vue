<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showTeamList">
            <header class="search-header">
                <div class="search-group">
                    <label>用户ID:</label>
                    <input type="text" placeholder="请输入" v-model="id">
                </div>
                <div class="search-group">
                    <label>用户昵称:</label>
                    <input type="text" placeholder="请输入" v-model="nickName">
                </div>
                <div class="search-group">
                    <label>电话号码:</label>
                    <input type="text" placeholder="请输入" v-model="phone">
                </div>
                <div class="search-group">
                    <label>团队ID:</label>
                    <input type="text" placeholder="请输入" v-model="teamId">
                </div>
                <div class="search-group">
                    <label>日期筛选:</label>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                    <div class="split-line">
                        <div></div>
                    </div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
                </div>
                <selector class="search-group" v-bind:value="rank" v-bind:selectParams="selectParams" @selectOptsClicked="selectOptsClicked"></selector>
                <button class="search-btn" @click="loadTBData(1)">搜索</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table v-bind:tbType="tbType" v-bind:tbData="tbData" v-bind:tableHeader="tableHeader" @showMyTeam="loadTeamList" @changeUserRank="changeUserRank" @checkUser="changeUserCheckStatu" v-bind:selectUserList="selectedUserList"></detail-table>
            </div>
            <div class="page-footer" style="display: flex;">
                <div style="margin-top: .3rem; height: .875rem; line-height: .875rem;">
                    <input @click="changeAllUserCheckStatu($event)" type="checkbox" :checked="allUserChecked" style="margin-left: 1rem;" id="checkAllUser">
                    <label for="checkAllUser" style="font-size: .375rem; color: #666666; display: inline-block; height: 100%; line-height: 1rem; margin-left: .3125rem; vertical-align: top;">全选</label>
                    <button class="action-btn" @click="moveTeam">团队迁移</button>
                </div>
                <page style="width: 0; flex: 1;" v-bind:pageData="pageData" @loadList="loadTBData"></page>
            </div>
        </div>
        <team-list v-if="showTeamList" :teamId="teamId"></team-list>
        <pop-ups :isShow="showChangeLevelPop" :popParams="changeLevelPopParams" @userLevelSelectOptsClicked="changeUserLevel" @popSave="saveNewUserLevel" @popCancel="cancelChangeUserLevel"></pop-ups>
        <pop-ups :isShow="showMoveTeamPop" :popParams="moveTeamPopParams" @searchClicked="searchTeamLeader" @popSave="saveMoveTeam" @popCancel="cancelMoveTeam" @teamLeaderChecked="teamLeaderChecked"></pop-ups>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import Selector from '@/components/common/select.vue'
import request from '@/axios'
import DetailTable from '@/components/content/table.vue'
import setting from '@/setting'
import page from '@/components/content/page.vue'
import TeamList from '@/components/content/teamList.vue'
import popUpsVue from '../components/common/popUps.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'flat-picker': flatPicker,
        'selector': Selector,
        'detail-table': DetailTable,
        'page': page,
        'team-list': TeamList,
        'pop-ups': popUpsVue
    },
    data: () => {
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return {
            showTeamList: false,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            id: '',
            nickName: '',
            phone: '',
            teamId: '',
            createTimeBegin: '',
            createTimeEnd: '',
            selectParams: {
                label: '职级',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '请选择'
                },{
                    value: 1,
                    text: '会员'
                }, {
                    value: 2,
                    text: '团长'
                }, {
                    value: 3,
                    text: '总监'
                }]
            },
            rank: '',
            tbData: [],
            tbType: 'userList',
            tableHeader: setting.tableHeader.userList,
            pageData: {
                'total': 0,
                'page': 1,
                'total_page': 0
            },
            selectedUserList: [],
            showChangeLevelPop: false,
            changeLevelPopParams: {
                style: 'width: 17.3125rem;',
                header: '用户调级',
                type: 'changeLevel',
                user: null,
                idx: -1,
                data: {
                    oldLevel: '',
                    newLevel: '',
                    selectOptions: {
                        label: '用户调级',
                        options: [{
                            value: '',
                            text: '请选择级别'
                        }, {
                            value: 1,
                            text: '会员'
                        }, {
                            value: 2,
                            text: '团长'
                        }, {
                            value: 3,
                            text: '总监'
                        }]
                    }
                }
            },
            userLevelObj: {
                1: '会员',
                2: '团长',
                3: '总监'
            },
            moveTeamPopParams: {
                type: 'moveTeam',
                header: '团队迁移',
                style: 'width: 17.3125rem;',
                leaderName: '',
                leaders: []
            },
            showMoveTeamPop: false
        }
    },
    created: function(){
        this.loadTBData()
    },
    methods: {
        cancelChangeUserLevel: function(){
            this.showChangeLevelPop = false
        },
        saveNewUserLevel: function(){
            let oldLevel = -1
            for(const key in this.userLevelObj){
                if(this.changeLevelPopParams.data.oldLevel == this.userLevelObj[key]){
                    oldLevel = key
                    break
                }
            }
            if(oldLevel == -1){
                this.alert('未知的用户当前级别')
                return
            }
            if(!this.changeLevelPopParams.data.newLevel){
                this.alert('请选择用户级别')
                return
            }
            if(this.changeLevelPopParams.data.newLevel == oldLevel){
                this.alert('不能和当前级别相同')
                return
            }
            this.showChangeLevelPop = false
            this.showLoading()
            Promise.resolve().then(() => {
                console.log(this.tbData)
                this.tbData[this.changeLevelPopParams.idx][1] = this.userLevelObj[this.changeLevelPopParams.data.newLevel]
                this.tbData = Object.assign([], this.tbData)
                this.hideLoading()
            })
        },
        changeUserLevel: function(dt){
            this.changeLevelPopParams.data.newLevel = dt
            console.log('用户等级调整：' + this.changeLevelPopParams.data.oldLevel + ' 改为 ' + this.changeLevelPopParams.data.newLevel)
        },
        changeInviteCode: function(idx, inviteCode){
            // return request({
            //     url: ''
            // })
            return Promise.resolve().then(() => {
                console.log(idx)
                console.log(inviteCode)
                console.log(this.tbData[idx])
                return true
            })
        },
        changeAllUserCheckStatu: function(e){
            const checked = e.target.checked
            for(let idx = 0; idx < this.selectedUserList.length; idx++){
                this.selectedUserList[idx].checked = checked
            }
        },
        changeUserCheckStatu: function(idx){
            this.selectedUserList[idx].checked = !this.selectedUserList[idx].checked
        },
        teamLeaderChecked: function(idx){
            for(let idxx = 0; idxx < this.moveTeamPopParams.leaders.length; idxx++){
                if(idxx == idx){
                    this.moveTeamPopParams.leaders[idxx].checked = !this.moveTeamPopParams.leaders[idxx].checked
                }else{
                    this.moveTeamPopParams.leaders[idxx].checked = false
                }
            }
        },
        searchTeamLeader: function(){
            console.log(this.moveTeamPopParams.leaderName)
            if(!this.moveTeamPopParams.leaderName){
                this.alert('请输入团长名称')
                return
            }
            // TODO
            const leaders = []
            for(let idx = 0; idx < this.tbData.length; idx++){
                leaders.push({
                    userId: this.tbData[idx][0],
                    avatar: this.tbData[idx][2],
                    nickName: this.tbData[idx][3],
                    checked: false
                })
            }
            this.moveTeamPopParams.leaders = leaders
        },
        cancelMoveTeam: function(){
            this.showMoveTeamPop = false
        },
        saveMoveTeam: function(){
            let leader = null
            for(let idx = 0; idx < this.moveTeamPopParams.leaders.length; idx++){
                if(this.moveTeamPopParams.leaders[idx].checked){
                    leader = this.moveTeamPopParams.leaders[idx]
                    break
                }
            }
            if(!leader){
                this.alert('请选择团长')
                return
            }
            this.showMoveTeamPop = false
            console.log(leader)
            this.showLoading()
            Promise.resolve().then(() => {
                this.hideLoading()
            })
        },
        moveTeam: function(){
            let flag = false
            for(let idx = 0; idx < this.selectedUserList.length; idx++){
                if(this.selectedUserList[idx].checked){
                    flag = true
                    break
                }
            }
            if(!flag){
                this.alert('请选择要迁移的团队成员')
                return
            }else{
                console.log(this.selectedUserList)
                this.moveTeamPopParams.leaderName = ''
                this.moveTeamPopParams.leaders = []
                this.showMoveTeamPop = true
            }
        },
        changeUserRank: function(dt){
            console.log(dt)
            this.changeLevelPopParams.data.oldLevel = dt.user[1]
            this.changeLevelPopParams.user = dt.user
            this.changeLevelPopParams.idx = dt.idx
            this.showChangeLevelPop = true
        },
        loadTeamList: function(user){
            this.showTeamList = true
            this.$parent.subTitle2 = '我的团队'
            this.teamId = user[0]
            console.log(this.teamId)
        },
        selectOptsClicked: function(dt){
            this.rank = dt
        },
        loadTBData: function(pageNum){
            this.showLoading()
            request({
                url: setting.urls.userList,
                method: 'get',
                params: {
                    page: pageNum || 1,
                    id: this.id,
                    nickName: this.nickName,
                    phone: this.phone,
                    teamId: this.teamId,
                    createTimeBegin: this.createTimeBegin,
                    createTimeEnd: this.createTimeEnd,
                    rank: this.rank
                }
            }).then((resp) => {
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        this.createTBData(resp.data.data)
                    }else{
                        this.alert(resp.data.message || '加载用户列表失败')
                    }
                }else{
                    this.alert('加载用户列表失败')
                }
            }).catch((error) => {
                this.alert('加载用户列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData: function(dt){
            this.pageData.total = dt.total
            this.pageData['total_page'] = dt.pageCount || dt.total_page || 0
            this.pageData.page = dt.page
            const fields = ['userId', 'rank', 'avatar', 'nickName', 'mobile', 'gender', 'wechat', 'inviteCode', 'availableAmount', 'withdrawAmount', 'createTime', 'lastLoginTime']
            const tbData = []
            const selectedUserList = []
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || (item[fields[idxx]] === 0 ? item[fields[idxx]] : '--'))
                }
                selectedUserList.push({
                    data: tbData[idx],
                    checked: false
                })
            }
            this.tbData = Object.assign([], tbData)
            this.selectedUserList = Object.assign([], selectedUserList)
        }
    },
    computed: {
        allUserChecked: function(){
            let flag = true
            for(let idx = 0; idx < this.selectedUserList.length; idx++){
                if(!this.selectedUserList[idx].checked){
                    flag = false
                    break
                }
            }
            return flag
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.search-header { display: block; }
.search-group { margin-bottom: .5rem; }
input[type="checkbox"] { position: relative; width: 0.625rem; height: .625rem; }
input[type="checkbox"]::after { background-color: #fff; background-image: url(../assets/check.png); position: absolute; content: ' '; background-repeat: no-repeat; background-position: center center; background-size: 100% 100%; width: 0.625rem; height: 0.625rem; }
input[type="checkbox"]:checked::after { background-image: url(../assets/checked.png); }
</style>