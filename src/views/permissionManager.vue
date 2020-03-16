<template>
    <div class="detail-container">
        <div class="detail-header" v-if="!showEditor">
            <button class="action-btn" v-if="contentData.actions.menu_add == 'T'" @click="showEditView('menu')">新增主菜单</button>
            <button class="action-btn" v-if="contentData.actions.effect_add == 'T'" @click="showEditView('effect')">新增权限</button>
            <button class="action-btn" v-if="contentData.actions.auth_add == 'T'" @click="showEditView('auth')">新增功能</button>
        </div>
        <div class="table-container" v-if="!showEditor">
            <detail-table v-bind:tableBodyClick="tableBodyClick" v-bind:tableHeaderFixed="tableHeaderFixed" v-bind:tbType="tbType" v-bind:tableHeader="tableHeader" v-bind:tbData="computeTBData" @deletePermissionClicked="deletePermission"></detail-table>
        </div>
        <permission-editor v-if="showEditor" v-bind:authTree="authTree" v-bind:editorType="editorType" @reloadPermissionList="loadPermissionList"></permission-editor>
        <confirm @confirmClicked="confirmClicked" v-bind:isShow="showConfirm" v-bind:confirmParams="confirmParams"></confirm>
    </div>
</template>
<script>
import DetailTable from '@/components/content/table.vue'
import confirm from '@/components/common/confirm.vue'
import PermissionEditor from '@/components/content/permissionEditor.vue'
import request from '@/axios'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    data: function(){
        return {
            tableHeader: [],
            showEditor: false,
            tbType: 'permission',
            tableBodyClick: false,
            tableHeaderFixed: false,
            confirmParams: {},
            showConfirm: false,
            editorType: 'menu',
            authTree: null,
            contentData: {actions: [], data: {}}
        }
    },
    components: {
        'detail-table': DetailTable,
        'confirm': confirm,
        'permission-editor': PermissionEditor
    },
    watch: {
        editorType: function(newValue, oldValue){
            if(newValue == 'effect' || newValue == 'auth'){
                this.loadAuthTree().then((dt) => {
                    this.authTree = dt
                    this.showEditor = true
                })
            }
        }
    },
    created: function(){
        this.loadPermissionList()
    },
    methods: {
        loadAuthTree: function(){
            if(this.editorType == 'effect'){
                return this.loadEffectAuthTree()
            }else if(this.editorType == 'auth'){
                return this.loadAuthAuthTree()
            }
        },
        loadEffectAuthTree: function(){
            return request({
                url: '/auth_auth/parent_menu',
                method: 'get'
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        return result.data
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        loadAuthAuthTree: function(){
            return request({
                url: '/auth_auth/full_menu',
                method: 'get'
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        const dt = result.data.auth_info
                        for(const key in dt){
                            const item = dt[key]
                            item.expand = false
                        }
                        return dt
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        deletePermission: function(idx){
            console.log('delete permission')
        },
        confirmClicked: function(){
            console.log('confirmClicked')
        },
        showEditView: function(tp){
            this.editorType = tp
            if(tp == 'menu'){
                this.$parent.subTitle2 = '新增主菜单'
                this.showEditor = true
            }else if (tp == 'effect'){
                this.$parent.subTitle2 = '新增权限'
                // this.loadEffectAuthTree()
                // this.authTree = this.effectAuthTree
            }else if (tp == 'auth'){
                this.$parent.subTitle2 = '新增功能'
                // this.loadAuthAuthTree()
                // this.authTree = this.authAuthTree
            }
        },
        loadPermissionList: function(){
            this.showLoading()
            request({
                url: '/auth_auth/index',
                method: 'get'
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        this.contentData = Object.assign({} , result.data)
                    }else{
                        this.alert(result.message || '加载权限列表失败')
                    }
                }else{
                    this.alert('加载权限列表失败')
                }
            }).catch((error) => {
                this.alert('加载权限列表失败')
            }).then(() => {
                this.hideLoading()
            })
        }
    },
    computed: {
        computeTBData: function(){
            const dt = []
            for(const key in this.contentData.data.auth_info){
                const item = this.contentData.data.auth_info[key]
                dt.push({
                    name: item.name,
                    tp: '主菜单',
                    url: item.name
                })
                if(item.auth_detail){
                    for(const key1 in item.auth_detail){
                        const item1 = item.auth_detail[key1]
                        dt.push({
                            name: item1.show_name,
                            tp: '权限菜单',
                            url: item1.name
                        })
                        if(item1.auth_detail){
                            for(const key2 in item1.auth_detail){
                                const item2 = item1.auth_detail[key2]
                                dt.push({
                                    name: item2.show_name,
                                    tp: '操作菜单',
                                    url: item2.name
                                })
                            }
                        }
                    }
                }
            }
            return dt
        }
    }
}
</script>