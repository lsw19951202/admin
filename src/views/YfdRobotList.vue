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
                <button class="action-btn" v-if="showGlobalSetBtn" @click.prevent.stop="openGlobalSetting">H5设置</button>
                <button class="action-btn" @click.prevent.stop="changeOpenDeviceBoxStatu">开通账号</button>
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
        <div class="odConfirmBox" v-if="showOpenDeviceBox">
            <div class="main">
                <div class="header">开通账号</div>
                <div class="iptLine">
                    <label class="bt">输入账号</label>
                    <div class="iptRight">
                        <div class="tips">
                            请输入需要开通的用户手机号,一行一个,或者通过英文逗号隔开
                        </div>
                        <textarea v-model="phones"></textarea>
                        <div class="accountNum">本次开通账号数量:{{phonesNum}}个</div>
                    </div>
                </div>
                <div class="iptLine">
                    <label></label>
                    <div class="iptRight">
                        <button class="action-btn" @click.prevent.stop="openDevice">开通</button>
                        <button class="action-btn cancel" @click.prevent.stop="changeOpenDeviceBoxStatu">取消</button>
                    </div>
                </div>
            </div>
        </div>
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
            phonesNum: 0,
            phones: null,
            showOpenDeviceBox: false,
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
                htmlEditorConfig: {
                    actions: {
                        bold: true,
                        italic: true,
                        alignLeft: true,
                        alignCenter: true,
                        alignRight: true,
                        strikethrough: true,
                        underline: true,
                        emoji: true,
                        image: false,
                        link: false,
                        video: false,
                        fontSize: true
                    }
                },
                type: 'yfdRobot',
                header: '操作提示',
                text: '',
                ids: '',
                tp: 'outline',
                month: 1,
                groupStatu: false,
                friendStatu: false,
                maxGroup: 5,
                adminGroupSettings: null,
                tipsStringSettings: null,
                setGroupTwo: false
            },
            'rank_time': '',
            'time_type': '',
            globalSettings: {
                "max_group": '',
                "friend_status": '',
                "group_status": ''
            },
            maxGroupChanging: false,
            adminGroupSettings: null,
            tipsStringSettings: null
        }
    },
    created(){
        console.log('created')
        // 获取机器人列表
        this.loadTBData()
        // 获取全局配置
        this.loadGlobalSetting()
        // 获取管理员群配置
        this.loadAdminGroupSetting()
        // 获取前端顶部字符串和淘口令字符串配置和
        this.loadTipsStringSetting()
    },
    provide(){
        return {
            outlineRobotConfirm: this.outlineRobotConfirm,
            renewRobotConfirm: this.renewRobotConfirm,
            deleteRobotConfirm: this.deleteRobotConfirm
        }
    },
    watch: {
        phones(nval){
            if(nval == null || nval == ''){
                this.phonesNum = 0
                return
            }
            if(nval == ','){
                console.log('一个逗号')
                this.phones = ''
                return
            }
            if(nval.indexOf('，') > 0){
                console.log('中文逗号')
                this.phones = nval.replace('，', ',')
                return
            }
            if(/[^(\d|,|\n)]/.test(nval)){
                console.log('非数字逗号换行')
                this.phones = nval.replace(/[^(\d|,|\n)]/, '')
                return
            }
            if(/,{2,}/.test(nval)){
                console.log('多个逗号')
                this.phones = nval.replace(/,{2,}/, ',')
                return
            }
            if(/\n{2,}/.test(nval)){
                console.log('多个换行')
                this.phones = nval.replace(/\n{2,}/, '\n')
                return
            }
            const phonesArr = nval.split(/[,\n]/)
            console.log(phonesArr)
            let num = 0
            for(let idx = 0; idx < phonesArr.length; idx++){
                if(phonesArr[idx] != ''){
                    num++
                }
            }
            this.phonesNum = num
        }
    },
    methods: {
        refreshAdminGroupSettings(){
            this.loadAdminGroupSetting()
                .then(() => {
                    this.confirmParams.adminGroupSettings = JSON.parse(JSON.stringify(this.adminGroupSettings))
                })
        },
        changeGroupTwoSelect(idx){
            if(this.confirmParams.adminGroupSettings.select_group.indexOf(this.confirmParams.adminGroupSettings.group_two[idx].group_id) >= 0){
                const i = this.confirmParams.adminGroupSettings.select_group.indexOf(this.confirmParams.adminGroupSettings.group_two[idx].group_id)
                this.confirmParams.adminGroupSettings.select_group.splice(i, 1)
            }else{
                this.confirmParams.adminGroupSettings.select_group.push(this.confirmParams.adminGroupSettings.group_two[idx].group_id)
            }
        },
        changeGroupTwoStatu(){
            this.confirmParams.setGroupTwo = !this.confirmParams.setGroupTwo
        },
        openDevice(){
            const phoneReg = /^1[3456789]\d{9}$/
            const phonesArr = this.phones.split(/[,\n]/)
            const phonesArr2 = []
            for(let idx = 0; idx < phonesArr.length; idx++){
                if(phoneReg.test(phonesArr[idx])){
                    phonesArr2.push(phonesArr[idx])
                }else if(phonesArr[idx] != ''){
                    this.alert('手机号码' + phonesArr[idx] + '格式错误')
                    return
                }
            }
            if(phonesArr2.length == 0){
                return
            }
            return request({
                method: 'post',
                url: setting.urls.yfdOpenDevice,
                data: qs.stringify({
                    telephone: phonesArr2.join(',')
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.alert(rst.data.message || '开通账号成功')
                    this.loadTBData()
                    this.changeOpenDeviceBoxStatu()
                }else{
                    this.alert(rst.data && rst.data.message || '开通账号失败')
                }
            }).catch(e => {
                this.alert('开通账号失败')
            })
        },
        changeOpenDeviceBoxStatu(){
            this.phones = ''
            this.showOpenDeviceBox = !this.showOpenDeviceBox
        },
        /**
         * 修改单个用户的最大群数
         * @param {*} idx 列表下标 用来确定修改用户
         * @param {*} val 参数值 number 修改用户最高群数为val  reduce 用户最大群数减1  add 用户最大群数加1
         */
        changeMaxGroup(idx, val){
            console.log('修改用户最大群数===' + idx + '===' + val)
            console.log(this.robots[idx])
            if(this.maxGroupChanging){
                return
            }
            this.maxGroupChanging = true
            let maxGroup = this.robots[idx].max_group || 0
            if(val == 'reduce'){
                if(maxGroup <= 0){
                    this.maxGroupChanging = false
                    return
                }else{
                    maxGroup--
                }
            }else if(val == 'add'){
                maxGroup++
            }else if(/^\d+$/.test(val)){
                if(this.robots[idx].max_group == val){
                    this.maxGroupChanging = false
                    return
                }
                maxGroup = val
            }else{
                this.alert('请输入正确的数字,并回车确认')
                this.maxGroupChanging = false
                return
            }
            console.log('最大群数修改为' + maxGroup)
            return request({
                url: setting.urls.yfdMaxGroup,
                method: 'post',
                data: qs.stringify({
                    'user_id': this.robots[idx].user_id,
                    'group_num': maxGroup
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.robots[idx]['max_group'] = maxGroup
                    const tbData = this.tbData
                    tbData[idx][tbData[idx].length - 1]['max_group'] = maxGroup
                    this.tbData = Object.assign([], tbData)
                }else{
                    this.alert(rst.data && rst.data.message || '修改用户最大群数失败')
                }
            }).catch(e => {
                this.alert('修改用户最大群数失败')
            }).then(() => {
                this.maxGroupChanging = false
            })
        },
        loadTipsStringSetting(){
            return request({
                url: setting.urls.yfdTipsString,
                method: 'get'
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.tipsStringSettings = rst.data.data
                }else{
                    this.alert('加载H5提示和淘口令小尾巴失败')
                }
            }).catch(e => {
                this.alert('加载H5提示和淘口令小尾巴失败')
            })
        },
        loadAdminGroupSetting(){
            return request({
                url: setting.urls.yfdGetAdminGroup,
                method: 'get'
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.adminGroupSettings = rst.data.data
                }else{
                    this.alert('加载监控配置失败')
                }
            }).catch(e => {
                this.alert('加载监控配置失败')
            })
        },
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
        h5Setting(dt){
            console.log(dt)
            // this.globalSetting(dt)
            // this.tipsStringSetting(dt)
            if(dt.setGroupTwo){
                console.log('修改2群')
                this.adminGroupSetting(dt)
            }
        },
        tipsStringSetting(dt){
            request({
                url: setting.urls.yfdTipsString,
                method: 'post',
                data: qs.stringify({
                    'head_message': dt.tipsStringSettings.head_message,
                    'tk_code': dt.tipsStringSettings.tk_code
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadTipsStringSetting()
                }else{
                    this.alert('修改H5顶部提示和淘口令小尾巴失败')
                }
            }).catch(e => {
                this.alert('修改H5顶部提示和淘口令小尾巴失败')
            })
        },
        adminGroupSetting(dt){
            request({
                url: setting.urls.yfdAdminGroup,
                method: 'post',
                data: qs.stringify({
                    'admin_user_id': dt.adminGroupSettings.admin_user_id,
                    'admin_group': dt.adminGroupSettings.select_group.join(',')
                })
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.loadAdminGroupSetting()
                }else{
                    this.alert('修改2群失败')
                }
            }).catch(e => {
                this.alert('修改2群失败')
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
                    this.alert('修改H5权限配置或者最大同步群失败')
                }
            }).catch(e => {
                this.alert('修改H5权限配置或者最大同步群失败')
            })
        },
        openGlobalSetting(){
            this.confirmParams.header = '编辑H5配置'
            this.confirmParams.tp = 'globalSetting'
            this.confirmParams.groupStatu = this.globalSettings.group_status
            this.confirmParams.friendStatu = this.globalSettings.friend_status
            this.confirmParams.maxGroup = this.globalSettings.max_group
            this.confirmParams.adminGroupSettings = JSON.parse(JSON.stringify(this.adminGroupSettings))
            this.confirmParams.tipsStringSettings = JSON.parse(JSON.stringify(this.tipsStringSettings))
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
                    case 'globalSetting': this.h5Setting(dt);break;
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
            if(!/\d+/.test(month)){
                this.alert('续时月数格式错误')
                return
            }
            if(month <= 0){
                this.alert('续时月数必须大于0')
                return
            }
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
                tbData[idx][tbData[idx].length - 1]['max_group'] = tmp.max_group || 0
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
.odConfirmBox {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9900;
    background-color: rgba(0, 0, 0, .7);
    .main {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 10px;
        text-align: left;
        .header {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            font-size: .625rem;
            border-bottom: 1px solid #333333;
            padding: 0 0.5rem;
        }
        .iptLine {
            padding: 0.5rem;
            font-size: .5rem;
            display: flex;
            align-items: flex-start;
            label {
                height: 100%;
                display: inline-block;
                width: 2.5rem;
                text-align: right;
            }
            label.bt::after {
                content: '*';
                display: inline-block;
                color: red;
            }
            .iptRight {
                display: inline-block;
                padding-left: .5rem;
                .tips,.accountNum {
                    width: 100%;
                    font-size: .4125rem;
                    color: red;
                    white-space: nowrap;
                }
                textarea {
                    width: 100%;
                    resize: none;
                    height: 5rem;
                    padding: .3rem;
                    border: 1px solid #999999;
                    box-sizing: border-box;
                    margin-top: .3rem;
                }
                .action-btn.cancel {
                    color: #333333;
                    background-color: #cccccc;
                }
            }
        }
    }
}
</style>