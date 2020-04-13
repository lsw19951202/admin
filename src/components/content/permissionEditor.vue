<template>
    <div class="permission-editor hideScrollBar">
        <div class="form-group lineheight1rem" v-if="editorType != 'menu'">
            <label>url:</label><input class="form-ipt" type="text" v-model.trim="url">
        </div>
        <div class="form-group lineheight1rem">
            <label>名字:</label><input class="form-ipt" type="text" v-model.trim="name">
        </div>
        <div class="form-group lineheight1rem">
            <label>菜单排序:</label><input class="form-ipt" placeholder="请输入相应数字(1-100 排序从小到大)" type="number" max="100" min="1" v-model.trim="sort">
        </div>
        <div class="form-group lineheight1rem">
            <label>选中回显:</label><input class="form-ipt" type="text" v-model.trim="text">
        </div>
        <div v-if="editorType == 'effect'" class="form-group h-flex">
            <label>父节点:</label>
            <div style="flex: 1;">
                <ul class="radio-box">
                    <li class="radio-item" v-for="(item, index) in authTree" v-bind:key="index">
                        <input class="radio" type="radio" name="parentMenu" v-model="parentMenu" :value="item.name">
                        <label>{{item.name}}</label>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="editorType == 'auth'" class="form-group h-flex">
            <label>父节点:</label>
            <div style="flex: 1;">
                <ul class="tree-box">
                    <li class="tree-item" v-for="(item, index) in authTree" v-bind:key="index">
                        <a class="collapse" data-toggle="collapse" :aria-expanded="item.expand?'':'false'" @click="itemClicked(item)"></a>
                        <label>{{item.name}}</label>
                        <ul :class="'radio-box' + (item.expand?'':' hide')">
                            <li class="radio-item" v-for="(childItem, index) in item.auth_detail" v-bind:key="index">
                                <input class="radio" type="radio" name="parentMenu" v-model="parentMenu" :value="childItem.name">
                                <label>{{childItem.show_name}}</label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="form-group h-flex">
            <label></label>
            <div style="flex: 1;">
                <div class="actions">
                    <button value="保存" class="action" @click="saveInfo">保存</button>
                    <button value="取消" class="action" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'

export default {
    props: ['editorType', 'authTree'],
    data: function(){
        return {
            url: '',
            name: '',
            sort: '',
            text: '',
            parentMenu: ''
        }
    },
    methods: {
        itemClicked: function(item){
            item.expand = !item.expand
        },
        saveInfo: function(){
            let url = '', method = '', queryStr = ''
            if(this.editorType == 'menu'){
                url = setting.urls.authMenu
                method = 'post'
                queryStr = qs.stringify({
                    name: this.name,
                    sort: this.sort,
                    text: this.text
                })
                console.log('menu')
            }else if(this.editorType == 'effect'){
                url = setting.urls.authAdd
                method = 'post'
                queryStr = qs.stringify({
                    url: this.url,
                    name: this.name,
                    sort: this.sort,
                    text: this.text,
                    'parent_menu': this.parentMenu
                })
                console.log('effect')
            }else if(this.editorType == 'auth'){
                url = setting.urls.authEffect
                method = 'post'
                queryStr = qs.stringify({
                    url: this.url,
                    name: this.name,
                    sort: this.sort,
                    text: this.text,
                    'parent_menu': this.parentMenu
                })
                console.log('auth')
            }
            request({
                url: url,
                method: method,
                data: queryStr
            }).then((response) => {
                if(response.status == 200){
                    const result = response.data
                    if(result.code == 200){
                        this.cancelEdit()
                        this.$emit('reloadPermissionList')
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
            this.$parent.$parent.subTitle2 = ''
            this.$parent.showEditor = false
            this.initAuth()
        },
        initAuth: function () {
            console.log('initAuth')
            if(this.editorType == 'auth'){
                for(const key in this.authTree){
                    const item = this.authTree[key]
                    item.expand = false
                }
            }
        }
    }
}
</script>
<style scoped>
.permission-editor { color: #666; overflow: scroll; }
.checkbox { margin-top: .15rem; vertical-align: sub; position: relative; padding: 0; box-sizing: border-box; margin-right: .5rem; }
.checkbox:checked::after { background: #fff url(../../assets/checked.png) no-repeat left center/auto; }
.checkbox::after { content: " "; position: absolute; top: -1px; width: .7rem; height: .7rem; overflow: hidden; background: #fff url(../../assets/check.png) no-repeat left center/auto; }
.tree-box { background: #fff url(../../assets/xu_line.png) .25rem center / 1px no-repeat repeat; }
.tree-box.child { padding-left: 2rem }
.tree-item { margin: .3rem 0; background-color: #fff; margin-top: 0; }
.tree-item>a[data-toggle="collapse"] { padding-left: 1rem; background: #fff url(../../assets/reduce_fff.png) no-repeat left center/auto; cursor: pointer; padding-left: 1.5rem; }
.tree-item>a[data-toggle="collapse"][aria-expanded="false"] { background: #fff url(../../assets/add_fff.png) no-repeat left center/auto; }
.tree-item>label { margin-bottom: .3rem; display: inline-block; }
.hide { display: none; }
.radio { position: relative; vertical-align: text-top; z-index: 5000; width: 0; height: 0; }
.radio::before,.radio::after { z-index: 5000; content: ''; position: absolute; display: inline-block; width: .625rem; height: .625rem; border-radius: 50%; border: 1px solid #ccc; background-color: #fff; }
.radio:checked::before,.radio:checked::after { border-color: #00b050; }
.radio::after { width: .3rem; height: .3rem; background-color: #ddd; top: .1625rem; left: .1625rem; }
.radio:checked::after { background-color: #00b050; }
.actions { margin-top: .5rem; width: 100%; }
.action { width: 2.5rem; height: 1.0625rem; color: white; text-align: center; font-size: 0.4375rem; cursor: pointer; background-color: rgb(16, 139, 235); border-radius: 0.125rem; }
.action:last-child { margin-left: 1rem; }
.form-ipt { width: 15rem; }
.tree-item .radio-box { padding-left: 2rem; }
.radio-item { margin-bottom: .3rem; }
.radio-item label { margin-left: 1rem; }
</style>