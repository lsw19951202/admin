<template>
    <div class="detail-container">
        <div class="detail-header" v-if="!showUserEditor">
            <button class="action-btn" v-if="contentData.actions.user_add == 'T'" @click="showEditUserView">新增用户</button>
        </div>
        <div class="table-container" v-if="!showUserEditor">
            <detail-table v-bind:tableHeaderFixed="tableHeaderFixed" v-bind:tableBodyClick="tableBodyClick" v-bind:tbType="tbType" v-bind:tableHeader="tableHeader" v-bind:tbData="contentData.data" @editUserClicked="editUserInfo" @modifyPwdClicked="modifyPwd" @deleteUserClicked="deleteUser"></detail-table>
        </div>
        <div class="pages-container" v-if="!showUserEditor">
            共搜索到<span class="pages-rows">{{contentData.total}}</span>条数据
            <div class="pages-btns">
                <div :class="'pageBtn prev' + (contentData.page == 1?' disabled':'')" @click="loadPrevPage">&lt;</div>
                <div :class="'pageBtn' + ((n + fromPage - 1) == currPage?' checked':'')" v-for="n in (toPage - fromPage + 1)" v-bind:key="n" @click="loadUserList(n + fromPage - 1)">{{n + fromPage - 1}}</div>
                <div :class="'pageBtn next' + (contentData.page == contentData.total_page?' disabled':'')" @click="loadNextPage">&gt;</div>
            </div>
        </div>
        <user-editor @reloadUserList="loadUserList" v-else v-bind:userInfo="currUserInfo" v-bind:authInfo="authInfo" v-bind:authTree="authTree" v-bind:editUser="editUser"></user-editor>
        <confirm @confirmClicked="confirmClicked" v-bind:isShow="showConfirm" v-bind:confirmParams="confirmParams"></confirm>
    </div>
</template>
<script>
import DetailTable from '@/components/content/table.vue'
import setting from '../setting'
import UserEditor from '@/components/content/userEditor.vue'
import request from '@/axios'
import confirm from '@/components/common/confirm.vue'
import qs from 'qs'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components: {
        // 'action-btn': ActionBtn,
        'detail-table': DetailTable,
        'user-editor': UserEditor,
        'confirm': confirm
    },
    data: function(){
        return {
            tableHeader: setting.tableHeader.userManager,
            tbType: 'user',
            tableHeaderFixed: false,
            tableBodyClick: false,
            showUserEditor: false,
            currUserInfo: {
            },
            currPage: 1,
            authTree: null,
            editUser: false,
            showConfirm: false,
            confirmParams: {},
            authInfo: null,
            contentData: {actions: {}, data: {}, total: 1, page: 1, 'total_page': 1}
        }
    },
    created: function(){
        this.loadAuthTree()
        this.loadUserList(1)
    },
    methods: {
        confirmClicked: function(data){
            this.showConfirm = false
            if(!data){
                return
            }
            let url = '',method = 'get', queryStr = '', params = {}, successCallback = null, faileCallback = null;
            if(data.type == 'modifyPwd'){
                url = '/auth_user/edit_password'
                method = 'post'
                queryStr = qs.stringify({
                    'user_id': data.user_id,
                    password: data.pwd
                })
                successCallback = () => {
                    this.alert('修改密码成功')
                }
                faileCallback = (msg) => {
                    this.alert(msg || '修改密码失败')
                }
            }else if(data.type == 'del'){
                url = '/auth_user/delete'
                method = 'get'
                params = {
                    'user_id': data.user_id
                }
                successCallback = this.loadUserList
                faileCallback = (msg) => {
                    this.alert(msg || '删除用户失败')
                }
            }
            request({
                url: url,
                method: method,
                data: queryStr,
                params: params
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        successCallback()
                    }else{
                        faileCallback(result.message)
                    }
                }else{
                    faileCallback( "操作失败")
                }
            }).catch((error) => {
                console.log(error)
                faileCallback(error.message)
            })
        },
        loadPrevPage: function(){
            if(this.currPage == 1){
                this.alert("已经是第一页")
            }else{
                this.loadUserList(this.currPage - 1)
            }
        },
        loadNextPage: function(){
            if(this.currPage == this.contentData.total_page){
                this.alert("已经是最后一页")
            }else{
                this.loadUserList(this.currPage - 0 + 1)
            }
        },
        loadUserList: function(pageNum){
            this.showLoading()
            request({
                url: '/auth_user/index',
                method: 'get',
                params: {
                    page: pageNum || this.currPage
                }
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        this.contentData = Object.assign({}, result.data)
                    }else{
                        this.alert(result.message || '请求用户列表数据失败')
                    }
                }else{
                    this.alert('请求用户列表数据失败')
                }
            }).catch((error) => {
                console.log(error)
                this.alert('请求用户列表数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        showEditUserView: function(){
            this.editUser = false
            this.showUserEditor = true
            this.currUserInfo = {}
            this.$parent.subTitle2 = this.editUser?"编辑用户":"新增用户"
        },
        editUserInfo: function(idx){
            this.editUser = true
            this.$parent.subTitle2 = this.editUser?"编辑用户":"新增用户"
            this.loadAuthInfo(this.contentData.data[idx].user_id)
            this.currUserInfo = Object.assign({}, this.contentData.data[idx])
        },
        modifyPwd: function(idx){
            console.log(idx)
            const confirmParams = {
                type: 'modifyPwd',
                username: this.contentData.data[idx]['user_name'],
                header: '修改密码',
                'user_id': this.contentData.data[idx]['user_id']
            }
            this.confirmParams = Object.assign({}, confirmParams)
            this.showConfirm = true
        },
        deleteUser: function(idx){
            console.log(idx)
            const confirmParams = {
                type: 'del',
                header: '操作提示',
                'user_id': this.contentData.data[idx]['user_id']
            }
            this.confirmParams = Object.assign({}, confirmParams)
            this.showConfirm = true
        },
        loadAuthTree: function(){
            if(!this.authTree){
                return request.get('/auth_user/auth_tree')
                    .then((resp) => {
                        if(resp.status == 200){
                            const result = resp.data
                            if(result.code == 200){
                                const dt = result.data
                                for(const key in dt.auth_info.auth_info){
                                    const item = dt.auth_info.auth_info[key]
                                    item.expand = false
                                    if(item.auth_detail){
                                        for(const key1 in item.auth_detail){
                                            const item1 = item.auth_detail[key1]
                                            item1.expand = false
                                            if(item1.auth_detail){
                                                for(const key2 in item1.auth_detail){
                                                    const item2 = item1.auth_detail[key2]
                                                    item2.expand = true
                                                }
                                            }
                                        }
                                    }
                                }
                                this.authTree = Object.assign({}, dt)
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }else{
                return new Promise().resolve()
            }
        },
        loadAuthInfo: function(userId){
            return request({
                url: '/auth_user/auth_user',
                params: {
                    'user_id': userId
                }
            })
                .then((resp) => {
                    if(resp.status == 200){
                        const result = resp.data
                        if(result.code == 200){
                            this.authInfo = Object.assign({}, result.data)
                            this.showUserEditor = true
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    computed: {
        fromPage: function(){
            let page = 1;
            if(this.contentData.total_page > 9){
                if(this.contentData.page <= 5){
                    page = 1
                }else if(this.contentData.total_page - this.contentData.page <= 4){
                    page = this.contentData.total_page - 8
                }else{
                    page = this.contentData.page - 4
                }
            }else{
                page = 1
            }
            return page
        },
        toPage: function(){
            let page = 9
            if(this.contentData.total_page > 9){
                if(this.contentData.page <= 5){
                    page = 9
                }else if(this.contentData.total_page - this.contentData.page <= 4){
                    page = this.contentData.total_page - 0
                }else{
                    page = this.contentData.page - 0 + 4
                }
            }else{
                page = (this.contentData.total_page - 0) || 1
            }
            return page
        }
    }
}
</script>