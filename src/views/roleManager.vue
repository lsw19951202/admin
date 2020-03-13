<template>
    <div class="detail-container">
        <div class="detail-header" v-if="!showRoleEditor">
            <button class="action-btn" v-if="contentData.actions.role_add == 'T'" @click="showEditRoleView">新增角色</button>
        </div>
        <div class="table-container" v-if="!showRoleEditor">
            <detail-table v-bind:tbType="tbType" v-bind:tableHeader="tableHeader" v-bind:tbData="contentData.data" @editRoleClicked="editRoleInfo" @deleteRoleClicked="deleteRole"></detail-table>
        </div>
        <role-editor @reloadRoleList="loadRoleList" v-else v-bind:roleInfo="currentRoleInfo" v-bind:authInfo="authInfo" v-bind:authTree="authTree" v-bind:editRole="editRole" v-bind:old_name="currentRoleInfo.name"></role-editor>
        <confirm @confirmClicked="confirmClicked" v-bind:isShow="showConfirm" v-bind:confirmParams="confirmParams"></confirm>
        <alert v-bind:isShow="showAlert" v-bind:alertParams="alertParams" @alertOkClicked="alertOkClicked"></alert>
    </div>
</template>
<script>
import setting from '../setting'
import DetailTable from '@/components/content/table.vue'
import confirm from '@/components/common/confirm.vue'
import RoleEditor from '@/components/content/roleEditor.vue'
import request from '@/axios'
import Alert from '@/components/common/alert.vue'

export default {
    // props: ['contentData'],
    data: function(){
        return {
            tableHeader: setting.tableHeader.roleManager,
            showRoleEditor: false,
            currentRoleInfo: {},
            authTree: null,
            authInfo: null,
            editRole: false,
            showConfirm: false,
            confirmParams: {},
            tbType: 'role',
            alertParams: {header: '', content: ''},
            showAlert: false,
            contentData: {actions: [], data: {}}
        }
    },
    components:{
        'detail-table': DetailTable,
        'confirm': confirm,
        'role-editor': RoleEditor,
        'alert': Alert
    },
    created: function(){
        this.loadAuthTree()
        this.loadRoleList(1)
    },
    methods: {
         alertOkClicked: function(){
            this.showAlert = false
        },
        alert: function(str){
            console.log(str)
            this.alertParams.header = '操作提示'
            this.alertParams.content = str
            this.showAlert = true
        },
        confirmClicked: function(data){
            this.showConfirm = false
            if(!data){
                return
            }
            let url = '',method = 'get', params = {}, successCallback = null, faileCallback = null;
            if(data.type == 'del'){
                url = '/auth_role/delete'
                method = 'get'
                params = {
                    'name': data.name
                }
                successCallback = this.loadRoleList
                faileCallback = (msg) => {
                    this.alert(msg || '删除角色失败')
                }
            }
            request({
                url: url,
                method: method,
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
        showEditRoleView: function(){
            this.showRoleEditor = true
            this.currentRoleInfo = {}
            this.editRole = false
            this.$parent.subTitle2 = this.editRole?'编辑角色':'新增角色'
        },
        editRoleInfo: function(idx){
            this.editRole = true
            this.$parent.subTitle2 = this.editRole?'编辑角色':'新增角色'
            this.loadAuthInfo(this.contentData.data[idx].name)
            this.currentRoleInfo = Object.assign({}, this.contentData.data[idx])
        },
        deleteRole: function(idx){
            const confirmParams = {
                type: 'del',
                header: '操作提示',
                name: this.contentData.data[idx]['name']
            }
            this.confirmParams = Object.assign({}, confirmParams)
            this.showConfirm = true
        },
        loadRoleList: function(){
            // this.$emit('reloadList', 1)
            this.$parent.$parent.isShowLoading = true
            request({
                url: '/auth_role/index',
                method: 'get'
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        this.contentData = Object.assign({}, result.data)
                    }else{
                        this.alert(result.message || '请求角色列表失败')
                    }
                }else{
                    this.alert('请求角色列表失败')
                }
            }).catch((error) => {
                this.alert('请求角色列表失败')
            }).then(() => {
                this.$parent.$parent.isShowLoading = false
            })
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
        loadAuthInfo: function(roleName){
            return request({
                url: '/auth_role/auth_list',
                methods: 'get',
                params: {
                    'name': roleName
                }
            })
                .then((resp) => {
                    if(resp.status == 200){
                        const result = resp.data
                        if(result.code == 200){
                            this.authInfo = Object.assign({}, result.data)
                            this.showRoleEditor = true
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
}
</script>