<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>用户ID</label>
                    <input type="text" v-model="user_id">
                </div>
                <div class="search-group">
                    <label>用户手机号</label>
                    <input type="text" v-model="telephone">
                </div>
                <div class="search-group">
                    <label>微信昵称</label>
                    <input type="text" v-model="nick_name">
                </div>
                <selector class="search-group" :value="login_status" :selectParams="selectParams" @selectOptsClicked="selectOptsClicked"></selector>
                <button class="action-btn" @click.prevent.stop="loadTBData(1)">搜索</button>
                <button class="action-btn" v-if="showGlobalSetBtn" @click.prevent.stop="openGlobalSetting">全局设置</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :allChecked="allChecked" @changeAllCheckStatus="changeAllCheckStatus" @changeCheckStatus="changeCheckStatus" :checkedArray="checkedArray" :tbType="tbType" :tbData="tbData" :tableHeader="tbHeader" :tableHeaderFixed="false" @changeTimeLineStatu="changeTimeLineStatu" @changeWechatStatu="changeWechatStatu" @sortTBData="sortTBData"></detail-table>
            </div>
            <div class="footer">
                <div class="settingbox">
                    <button class="action-btn" @click.prevent.stop="outlineRobots">批量下线</button>
                    <button class="action-btn" @click.prevent.stop="deleteRobots">批量删除</button>
                    <button class="action-btn" @click.prevent.stop="renewRobots">批量续时</button>
                </div>
                <page :pageData="pageData" @loadList="loadTBData"></page>
            </div>
        </div>
        <confirm @confirmClicked="confirmClicked" :isShow="showConfirm" :confirmParams="confirmParams"></confirm>
    </div>
</template>
<script>
import tableVue from '../components/content/table.vue'
import selectVue from '../components/common/select.vue'
import pageVue from '../components/content/page.vue'
import setting from '@/setting'
import request from '@/axios'
import qs from 'qs'
import confirmVue from '../components/common/confirm.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        'detail-table': tableVue,
        'selector': selectVue,
        'page': pageVue,
        'confirm': confirmVue
    },
    data(){
        return {
            showGlobalSetBtn: false,
            'user_id': '',
            'telephone': '',
            'nick_name': '',
            'login_status': '',
            tbType: 'yfdRobotList',
            tbData: [],
            tbHeader: setting.tableHeader.yfdRobotList,
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            robots: [],
            robot: {},
            selectParams: {
                label: '登陆状态',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 1,
                    text: '在线'
                }, {
                    value: 2,
                    text: '不在线'
                }]
            },
            checkedArray: [],
            allChecked: false,
            showConfirm: false,
            confirmParams: {
                type: 'yfdRobot',
                header: '操作提示',
                text: '',
                ids: '',
                tp: 'outline',
                month: 1,
                groupStatu: false,
                friendStatu: false,
                maxGroup: 5
            },
            'rank_time': '',
            'time_type': '',
            globalSettings: {
                "max_group": '',
                "friend_status": '',
                "group_status": ''
            }
        }
    },
    created(){
        console.log('created')
        // 获取机器人列表
        this.loadTBData()
        // 获取全局配置
        this.loadGlobalSetting()
    },
    provide(){
        return {
            outlineRobotConfirm: this.outlineRobotConfirm,
            renewRobotConfirm: this.renewRobotConfirm,
            deleteRobotConfirm: this.deleteRobotConfirm
        }
    },
    methods: {
        loadGlobalSetting(){
            request({
                url: setting.urls.yfdGetGlobalSetting,
                method: 'get'
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.globalSettings['max_group'] = rst.data.data.max_group
                    this.globalSettings['friend_status'] = rst.data.data.friend_status == 'T'
                    this.globalSettings['group_status'] = rst.data.data.group_status == 'T'
                }else{
                    this.alert('加载全局配置失败')
                }
            }).catch(e => {
                this.alert('加载全局配置失败')
            })
        },
        globalSetting(dt){
            request({
                url: setting.urls.yfdGlobalSetting,
                method: 'post',
                data: qs.stringify({
                    'friend_status': dt.friendStatu ? 'T' : 'F',
                    'group_status': dt.groupStatu ? 'T' : 'F',
                    'max_group': dt.maxGroup
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    // this.loadTBData(this.pageData.page || 1)
                    this.loadGlobalSetting()
                }else{
                    this.alert('修改全局配置失败')
                }
            }).catch(e => {
                this.alert('修改全局配置失败')
            })
        },
        openGlobalSetting(){
            this.confirmParams.header = '编辑全局配置'
            this.confirmParams.tp = 'globalSetting'
            this.confirmParams.groupStatu = this.globalSettings.group_status
            this.confirmParams.friendStatu = this.globalSettings.friend_status
            this.confirmParams.maxGroup = this.globalSettings.max_group
            this.showConfirm = true
        },
        confirmClicked(dt){
            this.showConfirm = false
            console.log(dt)
            if(dt){
                switch(dt.tp){
                    case 'outline': this.outlineRobot(dt.ids);break;
                    case 'delete': this.deleteRobot(dt.ids);break;
                    case 'renew': this.renewRobot(dt.ids, dt.month);break;
                    case 'globalSetting': this.globalSetting(dt);break;
                    default: return
                }
            }
        },
        outlineRobotConfirm(ids){
            this.confirmParams.header = '操作提示'
            this.confirmParams.text = '确定下线该用户?'
            this.confirmParams.ids = ids
            this.confirmParams.tp = 'outline'
            this.showConfirm = true
        },
        renewRobotConfirm(ids){
            this.confirmParams.header = '编辑续时时间'
            this.confirmParams.tp = 'renew'
            this.confirmParams.ids = ids
            this.confirmParams.month = 1
            this.showConfirm = true
        },
        deleteRobotConfirm(ids){
            this.confirmParams.header = '操作提示'
            this.confirmParams.text = '确定删除该用户?'
            this.confirmParams.ids = ids
            this.confirmParams.tp = 'delete'
            this.showConfirm = true
        },
        outlineRobots(){
            if(!this.checkedArray || this.checkedArray.length == 0){
                this.alert('先选中要下线的用户')
                return
            }else{
                this.outlineRobotConfirm(this.checkedArray.join(','))
            }
        },
        outlineRobot(ids){
            request({
                method: 'post',
                url: setting.urls.yfdLogout,
                data: qs.stringify({
                    'user_id': ids
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadTBData(this.pageData.page || 1)
                }else{
                    this.alert('修改用户登陆状态失败')
                }
            }).catch(e => {
                this.alert('修改用户登陆状态失败')
            })
        },
        renewRobots(){
            if(!this.checkedArray || this.checkedArray.length == 0){
                this.alert('先选中要续时的用户')
                return
            }else{
                this.renewRobotConfirm(this.checkedArray.join(','))
            }
        },
        renewRobot(ids, month){
            request({
                method: 'post',
                url: setting.urls.yfdAddTime,
                data: qs.stringify({
                    month: month,
                    'user_id': ids
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadTBData(this.pageData.page || 1)
                }else{
                    this.alert('用户续时失败')
                }
            }).catch(e => {
                this.alert('用户续时失败')
            })
        },
        deleteRobots(){
            if(!this.checkedArray || this.checkedArray.length == 0){
                this.alert('先选中要删除的用户')
                return
            }else{
                this.deleteRobotConfirm(this.checkedArray.join(','))
            }
        },
        deleteRobot(ids){
            console.log(ids)
            request({
                url: setting.urls.yfdDel,
                method: 'post',
                data: qs.stringify({
                    'user_id': ids
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadTBData(this.pageData.page || 1)
                }else{
                    this.alert('删除用户失败')
                }
            }).catch(e => {
                this.alert('删除用户失败')
            })
        },
        changeWechatStatu(dt){
            request({
                method: 'post',
                url: setting.urls.yfdWechatStatu,
                data: qs.stringify({
                    'user_id': dt.userId,
                    'group_status': dt.status ? 'T' : 'F'
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadTBData(this.pageData.page || 1)
                }else{
                    this.alert('同步微信群状态失败')
                }
            }).catch(e => {
                this.alert('同步微信群状态失败')
            })
        },
        changeTimeLineStatu(dt){
            request({
                method: 'post',
                url: setting.urls.yfdTimeLineStatu,
                data: qs.stringify({
                    'user_id': dt.userId,
                    'friend_status': dt.status ? 'T' : 'F'
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadTBData(this.pageData.page || 1)
                }else{
                    this.alert('同步朋友圈状态失败')
                }
            }).catch(e => {
                this.alert('同步朋友圈状态失败')
            })
        },
        loadTBData(pageNo){
            return request({
                method: 'post',
                url: setting.urls.yfdRobotList,
                data: qs.stringify({
                    'page': pageNo || 1,
                    'user_id': this.user_id,
                    'login_status': this.login_status,
                    'nick_name': this.nick_name,
                    'telephone': this.telephone,
                    'time_type': this.time_type,
                    'rank_time': this.rank_time
                })
            }).then(rst => {
                console.log(rst)
                if(rst.status == 200 && rst.data.code == 200){
                    this.createTBData(rst.data.data)
                }else{
                    this.alert('加载机器人列表失败')
                }
            }).catch(e => {
                console.log(e)
                this.alert('加载机器人列表失败')
            })
        },
        sortTBData(dt){
            this.$data['rank_time'] = dt.sortBy
            this.$data['time_type'] = dt.sortType
            this.loadTBData(this.pageData.page)
            // this.robots = this.robots || []
            // this.robots.sort((i1, i2) => {
            //     if(dt.sortType == 'asc'){
            //         return new Date(i1[dt.sortBy]).getTime() - new Date(i2[dt.sortBy]).getTime()
            //     }else{
            //         return new Date(i2[dt.sortBy]).getTime() - new Date(i1[dt.sortBy]).getTime()
            //     }
            // })
            // const tbData = []
            // const fields = ['user_id', 'telephone', 'nick_name', 'max_group', 'bind_group', 'login_status', 'first_login_time', 'activate_time', 'exp_time']
            // for(let idx = 0; idx < this.robots.length; idx++){
            //     const tmp = this.robots[idx]
            //     tbData.push([(idx + 1) < 10 ? ('0' + (idx + 1)) : (idx + 1)])
            //     for(let idxx = 0; idxx < fields.length; idxx++){
            //         tbData[idx].push(tmp[fields[idxx]] ? tmp[fields[idxx]] : (tmp[fields[idxx]] == 0 ? 0 : '--'))
            //     }
            //     tbData[idx].push(tmp['actions'] || {})
            //     tbData[idx][tbData[idx].length - 1]['group_syn'] = tmp.group_status
            //     tbData[idx][tbData[idx].length - 1]['friend_syn'] = tmp.friends_status
            //     tbData[idx][tbData[idx].length - 1]['online_status'] = tmp.online_status
            // }
            // this.tbData = tbData
        },
        createTBData(data){
            this.robots = data.data
            this.checkedArray = []
            this.showGlobalSetBtn = data.actions.config_status == 'T'

            this.pageData.page = data.page
            this.pageData.total = data.total
            this.pageData['total_page'] = data.total_page || data.pageCount

            const tbData = []
            const fields = ['user_id', 'app_user_id', 'telephone', 'app_nick_name', 'nick_name', 'max_group', 'bind_group', 'login_status', 'first_login_time', 'activate_time', 'exp_time']
            for(let idx = 0; idx < data.data.length; idx++){
                const tmp = data.data[idx]
                tbData.push([(idx + 1) < 10 ? ('0' + (idx + 1)) : (idx + 1)])
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(tmp[fields[idxx]] ? tmp[fields[idxx]] : (tmp[fields[idxx]] == 0 ? 0 : '--'))
                }
                tbData[idx].push(tmp['actions'] || {})
                tbData[idx][tbData[idx].length - 1]['group_syn'] = tmp.group_status
                tbData[idx][tbData[idx].length - 1]['friend_syn'] = tmp.friends_status
                tbData[idx][tbData[idx].length - 1]['online_status'] = tmp.online_status
            }
            this.tbData = tbData
        },
        selectOptsClicked(dt){
            this.$data['login_status'] = dt
        },
        changeCheckStatus(idx){
            const userId = this.robots[idx]['user_id']
            if(this.checkedArray.indexOf(userId) >= 0){
                this.checkedArray.splice(this.checkedArray.indexOf(userId), 1)
            }else{
                this.checkedArray.push(userId)
            }
            if(this.robots && this.checkedArray && this.checkedArray.length == this.robots.length){
                this.allChecked = true
            }else{
                this.allChecked = false
            }
        },
        changeAllCheckStatus(){
            if(this.checkedArray && this.robots && this.checkedArray.length == this.robots.length){
                this.checkedArray = []
                this.allChecked = false
            }else{
                const checkedArray = []
                for(let idx = 0; idx < (this.robots || []).length; idx++){
                    checkedArray.push(this.robots[idx]['user_id'])
                }
                this.checkedArray = checkedArray
                this.allChecked = true
            }
        }
    }
}
</script>
<style lang="less" scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
.footer {
    display: flex;
    .settingbox {
        width: fit-content;
    }
    .pages-container {
        width: 0;
        flex: 1;
    }
}
</style>