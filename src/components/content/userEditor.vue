<template>
    <div class="user-editor">
        <div class="form-group lineheight1rem">
            <label>账户名:</label><input class="form-ipt" type="text" v-model.trim="userInfo.user_name">
            <label v-if="!editUser">账户密码:</label><input class="form-ipt" v-if="!editUser" type="password" v-model.trim="userInfo.passwd">
            <label>用户姓名:</label><input type="text" class="form-ipt" v-model.trim="userInfo.user_real_name">
        </div>
        <div class="form-group h-flex lineheight1rem">
            <label>账户角色:</label>
            <ul class="h-list">
                <li class="h-item" v-for="(item, index) in authTree.roles_info" v-bind:key="index">
                    <input type="checkbox" class="checkbox" @click="roleItemClicked(item)" :checked="roles[item.name]" :data-url="item.name">{{item.name}}
                </li>
            </ul>
        </div>
        <div class="form-group h-flex">
            <label>用户额外权限:</label>
            <div style="flex: 1;">
                <ul class="tree-box">
                    <li class="tree-item" v-for="(item, index) in authTree.auth_info.auth_info" v-bind:key="index">
                        <a class="collapse" data-toggle="collapse" :aria-expanded="item.expand?'':'false'" @click="itemClicked(item)"></a>
                        <label>
                            <input type="checkbox" class="checkbox" :checked="rootAuths[item.name]" :data-url="item.name" @change="ckdChanged(item)">
                            {{item.name}}
                        </label>
                        <ul :class="'tree-box child' + (item.expand?'':' hide')">
                            <li class="tree-item" v-for="(childItem, index) in item.auth_detail" v-bind:key="index">
                                <a class="collapse" data-toggle="collapse" :aria-expanded="childItem.expand?'':'false'" @click="itemClicked(childItem)"></a>
                                <label>
                                    <input type="checkbox" class="checkbox" :checked="auths[childItem.name]" :data-url="childItem.name" @change="ckdChanged(childItem, item)">
                                    {{childItem.show_name}}
                                </label>
                                <ul :class="'tree-box child' + (childItem.expand?'':' hide')">
                                    <li class="tree-item" v-for="(childItem2, index) in childItem.auth_detail" v-bind:key="index">
                                        <a class="collapse" data-toggle="collapse" :aria-expanded="childItem2.expand?'':'false'"></a>
                                        <label>
                                            <input type="checkbox" class="checkbox" :checked="auths[childItem2.name]" :data-url="childItem2.name" @change="ckdChanged(childItem2, childItem, item)">
                                            {{childItem2.show_name}}
                                        </label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="actions">
                    <button value="保存" class="action" @click="saveUserInfo">保存</button>
                    <button value="取消" class="action" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import qs from 'qs'

export default {
    props: ['userInfo', 'editUser', "authInfo", 'authTree'],
    data: function(){
        return {
            roles: {},
            auths: {},
            rootAuths: {}
        }
    },
    created: function(){
        if(this.authInfo){
            for(const key in this.authInfo.user_roles_info){
                this.roles[this.authInfo.user_roles_info[key].item_name] = true
            }
            for(const key in this.authInfo.user_info.extra_permission){
                this.auths[this.authInfo.user_info.extra_permission[key]] = true
            }
        }
        this.roles = Object.assign({}, this.roles)
        this.auths = Object.assign({}, this.auths)
        for(const key in this.authTree.auth_info.auth_info){
            const item = this.authTree.auth_info.auth_info[key]
            if(this.auths[item.name] != undefined){
                delete this.auths[item.name]
            }
            this.rootAuths[item.name] = false
            if(item.auth_detail){
                for(const key1 in item.auth_detail){
                    const item1 = item.auth_detail[key1]
                    if(this.auths[item1.name]){
                        this.rootAuths[item.name] = true
                        break
                    }
                    if(item1.auth_detail){
                        for(const key2 in item1.auth_detail){
                            const item2 = item1.auth_detail[key2]
                            if(this.auths[item2.name]){
                                this.rootAuths[item.name] = true
                                break
                            }
                        }
                    }
                }
            }
        }
        this.rootAuths = Object.assign({}, this.rootAuths)
    },
    methods: {
        itemClicked: function(item){
            item.expand = !item.expand
        },
        roleItemClicked: function(item){
            const newRoles = {}
            newRoles[item.name] = !this.roles[item.name]
            this.roles = Object.assign({}, this.roles, newRoles)
        },
        saveUserInfo: function(){
            let url = ''
            const requestData = {
                'user_name': this.userInfo['user_name'],
                'user_real_name': this.userInfo['user_real_name'],
                roles: [],
                'extra_permission': []
            }
            if(this.editUser){
                requestData['user_id'] = this.userInfo['user_id']
                url = '/auth_user/edit_user'
            }else{
                requestData.password = this.userInfo.passwd
                url = '/auth_user/add_user'
            }

            for(const key in this.roles){
                if(this.roles[key]){
                    requestData.roles.push(key)
                }
            }
            for(const key in this.auths){
                if(this.auths[key]){
                    requestData['extra_permission'].push(key)
                }
            }
            console.log(this.auths)
            for(const key in this.rootAuths){
                if(this.rootAuths[key]){
                    requestData['extra_permission'].push(key)
                }
            }
            console.log(this.rootAuths)

            request({
                url: url,
                method: 'post',
                data: qs.stringify(requestData)
            }).then((response) => {
                console.log(response)
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        this.cancelEdit()
                        // 触发事件，重新加载列表
                        this.$emit('reloadUserList')
                    }else{
                        this.$parent.alert(result.message || '请求失败')
                    }
                }else{
                    console.log('error')
                }
            }).catch((error) => {
                console.log(error)
            })

        },
        cancelEdit: function(){
            this.$parent.showUserEditor = false
            this.$parent.currUserInfo = {}
            this.$parent.editUser = false
            this.$parent.$parent.subTitle2 = ''
            this.$parent.authInfo = null
            this.initAuthTree()
        },
        initAuthTree: function(){
            // 保存或者取消修改操作，将所有权限收起
            for(const key in this.authTree.auth_info.auth_info){
                const item = this.authTree.auth_info.auth_info[key]
                item.expand = false
                if(item.auth_detail){
                    for(const key1 in item.auth_detail){
                        const item1 = item.auth_detail[key1]
                        item1.expand = false
                    }
                }
            }
        },
        ckdChanged: function(item, pItem, gpItem){
            // 如果点击的是孙子节点，则修改父节点，以及根节点选中状态
            const url = item.name
            const newAuths = {}
            const newRootAuths = {}
            if(gpItem){
                newAuths[url] = !this.auths[url]
                if(newAuths[url]){
                    // 如果是选中,只需要将父节点以及根节点设置为选中状态
                    newAuths[pItem.name] = true
                    newRootAuths[gpItem.name] = true
                }else{
                    // 如果是取消选中
                    // 判断其兄弟节点是否都取消，如果是，则父节点取消，否则结束
                    // 父节点选中状态
                    let pStatus = false
                    for(const key in pItem.auth_detail){
                        const i = pItem.auth_detail[key]
                        if(this.auths[i.name] && newAuths[i.name] != false){
                            pStatus = true
                            break
                        }
                    }
                    newAuths[pItem.name] = pStatus
                    if(!pStatus){
                        // 判断其父节点的兄弟节点是否都取消，如果是，则根节点取消，否则结束
                        // 根节点选中状态
                        let gpStatus = false
                        for(const key in gpItem.auth_detail){
                            const i = gpItem.auth_detail[key]
                            if(this.auths[i.name] && newAuths[i.name] != false){
                                gpStatus = true
                                break
                            }
                        }
                        newRootAuths[gpItem.name] = gpStatus
                    }
                }
            }else if(pItem){
                newAuths[url] = !this.auths[url]
                if(newAuths[url]){
                    // 如果点击的是子节点，修改所有孙子节点为选中
                    newRootAuths[pItem.name] = true
                    for(const key in item.auth_detail){
                        const i = item.auth_detail[key]
                        newAuths[i.name] = true
                    }
                }else{
                    // 修改所有孙子节点状态
                    for(const key in item.auth_detail){
                        const i = item.auth_detail[key]
                        newAuths[i.name] = false
                    }
                    // 根据兄弟节点状态修改父节点状态
                    let pStatus = false
                    for(const key in pItem.auth_detail){
                        const i = pItem.auth_detail[key]
                        if(this.auths[i.name] && newAuths[i.name] != false){
                            pStatus = true
                            break
                        }
                    }
                    newRootAuths[pItem.name] = pStatus
                }
            }else{
                // 点击的是根节点
                newRootAuths[url] = !this.rootAuths[url]
                // 修改所有子节点以及孙子节点
                if(newRootAuths[url]){
                    for(const key in item.auth_detail){
                        const i = item.auth_detail[key]
                        newAuths[i.name] = true
                        for(const key1 in i.auth_detail){
                            const ii = i.auth_detail[key1]
                            newAuths[ii.name] = true
                        }
                    }
                }else{
                    for(const key in item.auth_detail){
                        const i = item.auth_detail[key]
                        newAuths[i.name] = false
                        for(const key1 in i.auth_detail){
                            const ii = i.auth_detail[key1]
                            newAuths[ii.name] = false
                        }
                    }
                }
            }
            this.auths = Object.assign({}, this.auths, newAuths)
            this.rootAuths = Object.assign({}, this.rootAuths, newRootAuths)
        }
    }
}
</script>
<style scoped>
.user-editor { color: #666; overflow: scroll; }
.checkbox { vertical-align: sub; position: relative; padding: 0; box-sizing: border-box; margin-right: .5rem; width: .625rem; height: .625rem; }
.checkbox:checked::after { background-image: url(../../assets/checked.png); }
.checkbox::after { background-color: #fff; background-image: url(../../assets/check.png); position: absolute; content: ' '; background-repeat: no-repeat; background-position: center center; background-size: 100% 100%; width: 0.625rem; height: 0.625rem; }
.tree-box { background: #fff url(../../assets/xu_line.png) .25rem center / 1px no-repeat repeat; }
.tree-box.child { padding-left: 2rem }
.tree-item { margin: .3rem 0; background-color: #fff; margin-top: 0; }
.tree-item>a[data-toggle="collapse"] { padding-left: 1rem; background: #fff url(../../assets/reduce_fff.png) no-repeat left center/auto; cursor: pointer; padding-left: 1.5rem; }
.tree-item>a[data-toggle="collapse"][aria-expanded="false"] { background: #fff url(../../assets/add_fff.png) no-repeat left center/auto; }
.tree-item>label { margin-bottom: .3rem; display: inline-block; }
.hide { display: none; }
.actions { margin-top: .5rem; width: 100%; }
.action { width: 2.5rem; height: 1.0625rem; color: white; text-align: center; font-size: 0.4375rem; cursor: pointer; background-color: rgb(16, 139, 235); border-radius: 0.125rem; }
.action:last-child { margin-left: 1rem; }
</style>