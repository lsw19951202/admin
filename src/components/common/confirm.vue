<template>
    <div class="confirm">
        <transition name="fade">
            <div v-if="isShow" class="confirm-mark"></div>
        </transition>
        <transition name="ease">
            <div v-if="isShow" class="confirm-box">
                <div class="confirm-header">{{confirmParams.header}}</div>
                <div v-if="confirmParams.type == 'modifyPwd'" class="confirm-body">
                    <div class="confirm-form-line">
                        <label>账户名:</label>
                        <div class="confirm-form-line-right">
                            {{confirmParams.username}}
                        </div>
                    </div>
                    <div class="confirm-form-line">
                        <label>密码:</label>
                        <div class="confirm-form-line-right">
                            <input type="password" v-model.trim="pwd">
                        </div>
                    </div>
                    <div class="confirm-form-line">
                        <label>确认密码:</label>
                        <div class="confirm-form-line-right">
                            <input type="password" v-model.trim="confirmPwd">
                        </div>
                    </div>
                </div>
                <div v-if="confirmParams.type == 'del'" class="confirm-body">
                    <div class="confirm-form-line">确定删除?</div>
                </div>
                <div v-if="confirmParams.type == 'modifyStatus'" class="confirm-body">
                    <div class="confirm-form-line">{{confirmParams.text}}</div>
                </div>
                <div v-if="confirmParams.type == 'yfdRobot'" class="confirm-body">
                    <div class="confirm-form-line" v-if="(confirmParams.tp == 'outline') || (confirmParams.tp == 'delete')">{{confirmParams.text}}</div>
                    <div class="confirm-form-line line2" v-else-if="confirmParams.tp == 'globalSetting'">
                        <div>
                            <label>H5全局权限</label>
                            <div>
                                <div class="line" style="margin-bottom: .5rem; display: inline-block;">
                                    微信群
                                    <switch-progress style="vertical-align: middle;" :turnOn="confirmParams.groupStatu" @changeSwitchStatus="changeGroupStatus"></switch-progress>
                                </div>
                                <div class="line" style="display: inline-block; margin-left: 1rem;">
                                    朋友圈
                                    <switch-progress style="vertical-align: middle;" :turnOn="confirmParams.friendStatu" @changeSwitchStatus="changeFriendStatus"></switch-progress>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>最大同步群数</label>
                            <div>
                                <div class="sub" @click.prevent.stop="subNumber">-</div>
                                <div class="num">{{confirmParams.maxGroup}}</div>
                                <div class="add" @click.prevent.stop="addNumber">+</div>
                                限10个以内
                            </div>
                        </div>
                        <div>
                            <label>监控设置</label>
                            <div>
                                <div class="group" style="display: flex; align-items: flex-start;" v-if="confirmParams.adminGroupSettings && confirmParams.adminGroupSettings.group_one">
                                    <div class="group_name" style="display: inline-block;">1群：</div>
                                    <div class="group_setting" style="display: inline-block; font-size: 0.375rem; color: red;">
                                        开启指令：{{confirmParams.adminGroupSettings.group_one.open_monitor}}
                                        <br>
                                        关闭指令：{{confirmParams.adminGroupSettings.group_one.close_monitor}}
                                    </div>
                                </div>
                                <div class="group" style="display: flex; align-items: flex-start; margin-top: 0.3rem;" v-if="confirmParams.adminGroupSettings && confirmParams.adminGroupSettings.group_two">
                                    <div class="group_name" style="display: inline-block;">2群：</div>
                                    <div class="group_setting" style="display: inline-block; flex: 1;">
                                        <div class="action-btn" :style="confirmParams.setGroupTwo ? 'background-color: #ccc; color: white; width: fit-content; display: inline-block;' : 'display: inline-block; width: fit-content;'" @click.prevent.stop="$parent.changeGroupTwoStatu">设置</div>
                                        <div class="action-btn" v-if="confirmParams.setGroupTwo" style="float: right; display: inline-block;" @click.prevent.stop="$parent.refreshAdminGroupSettings">刷新</div>
                                        <div class="table" style="width: 100%; height: 5rem; overflow: hidden; overflow-y: auto;" v-if="confirmParams.setGroupTwo">
                                            <table>
                                                <thead>
                                                    <tr style="height: 1rem;">
                                                        <td style="width: 1.5rem;">序号</td>
                                                        <td>群名</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr style="height: 1rem;" v-for="(group, idx) in confirmParams.adminGroupSettings.group_two" :key="idx">
                                                        <td style="width: 1.5rem;"><input type="checkbox" @change.prevent.stop="$parent.changeGroupTwoSelect(idx)" :checked="confirmParams.adminGroupSettings.select_group.indexOf(group.group_id) >= 0">{{idx + 1}}</td>
                                                        <td>{{group.group_name}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div v-if="confirmParams.setGroupTwo" style="font-size: .375rem; color: red;">已选中：{{selectedGroupName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 0.2rem;">
                            <label>H5顶部提示</label>
                            <div style="width: 100%; height: 3rem;">
                                <html-editor class="headerMsgEditor" :config="confirmParams.htmlEditorConfig" :htmlText="confirmParams.tipsStringSettings.head_message" :editable="true"></html-editor>
                            </div>
                        </div>
                        <div style="margin-top: 0.2rem;">
                            <label>淘口令小尾巴</label>
                            <div style="width: 100%; height: 3rem;">
                                <html-editor class="tkCodeEditor" :config="confirmParams.htmlEditorConfig" :htmlText="confirmParams.tipsStringSettings.tk_code" :editable="true"></html-editor>
                            </div>
                        </div>
                    </div>
                    <div class="confirm-form-line" v-else>
                        <label>选择续时时间</label>
                        <div class="monthBox">
                            <div class="sub" @click.prevent.stop="subNumber">-</div>
                            <!-- <div class="num">{{confirmParams.month}}</div> -->
                            <input type="text" class="num" v-model="confirmParams.month">
                            <div class="add" @click.prevent.stop="addNumber">+</div>
                        月
                        </div>
                    </div>
                </div>
                <div class="confirm-footer">
                    <button @click="confirm(1)" class="confirm-ok">确认</button>
                    <button @click="confirm(0)" class="confirm-cancel">取消</button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import switchVue from './switch.vue'
import htmlEditor from './htmlEditor.vue'

export default {
    props: ['isShow', 'confirmParams'],
    data: function(){
        return {
            pwd: '',
            confirmPwd: ''
        }
    },
    components: {
        'switch-progress': switchVue,
        'htmlEditor': htmlEditor
    },
    computed: {
        selectedGroupName(){
            const groupName = []
            for(let idx = 0; idx < this.confirmParams.adminGroupSettings.group_two.length; idx++){
                if(this.confirmParams.adminGroupSettings.select_group.indexOf(this.confirmParams.adminGroupSettings.group_two[idx].group_id) >= 0){
                    groupName.push(this.confirmParams.adminGroupSettings.group_two[idx].group_name)
                }
            }
            return groupName.join(',')
        }
    },
    methods: {
        changeGroupStatus(dt){
            console.log(dt)
            this.confirmParams.groupStatu = dt.status
        },
        changeFriendStatus(dt){
            console.log(dt)
            this.confirmParams.friendStatu = dt.status
        },
        subNumber(){
            if(this.confirmParams.tp == 'renew'){
                if(this.confirmParams.month > 1){
                    this.confirmParams.month -= 1
                }
            }else if(this.confirmParams.tp == 'globalSetting'){
                if(this.confirmParams.maxGroup > 1){
                    this.confirmParams.maxGroup -= 1
                }
            }
        },
        addNumber(){
            if(this.confirmParams.tp == 'renew'){
                this.confirmParams.month = this.confirmParams.month - 0 + 1
            }else if(this.confirmParams.tp == 'globalSetting'){
                if(this.confirmParams.maxGroup < 10){
                    this.confirmParams.maxGroup = this.confirmParams.maxGroup - 0 + 1
                }
            }
        },
        confirm: function(num){
            if(num  == 0){
                this.$emit('confirmClicked')
            }else{
                switch(this.confirmParams.type){
                    case 'modifyPwd': this.confirmModifyPwd(); break;
                    case 'del': this.confirmDel(); break;
                    case 'modifyStatus': this.confirmModifyStatus(); break;
                    case 'yfdRobot': this.confirmModifyStatus();break;
                    default: return
                }
            }
        },
        confirmModifyStatus: function(){
            if(this.confirmParams.tp && this.confirmParams.tp == 'globalSetting'){
                for(const idx in this.$children){
                    if(this.$children[idx].$el.className.indexOf('headerMsgEditor') >= 0){
                        this.confirmParams.tipsStringSettings['head_message'] = this.$children[idx].getContent()
                    }
                    if(this.$children[idx].$el.className.indexOf('tkCodeEditor') >= 0){
                        this.confirmParams.tipsStringSettings['tk_code'] = this.$children[idx].getContent()
                    }
                }
            }
            this.$emit('confirmClicked', this.confirmParams)
        },
        confirmDel: function(){
            this.$emit('confirmClicked', this.confirmParams)
        },
        confirmModifyPwd: function(){
            if(!this.pwd){
                this.$parent.alert('请输入新密码')
                return
            }
            if(!this.confirmPwd){
                this.$parent.alert('请再次输入新密码')
                return
            }
            if(this.confirmPwd != this.pwd){
                this.$parent.alert('两次输入的密码不一致')
                return
            }
            const confirmParams = this.confirmParams
            confirmParams.pwd = this.pwd
            this.$emit('confirmClicked', confirmParams)
            this.pwd = ''
            this.confirmPwd = ''
        }
    }
}
</script>
<style scoped>
.confirm { position: fixed; width: 100%; left: 0; top: 0; z-index: 9997; user-select: none; }
.confirm-mark { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 9998; }
.confirm-box { box-sizing: border-box; border-radius: .25rem; margin: auto; margin-top: 1rem; width: 18.75rem; background: #fff; position: relative; z-index: 9999; padding-bottom: .34rem; }
.confirm-header { box-sizing: border-box; padding: 0rem .5rem; border-bottom: 1px solid #e5e5e5; font-size: 0.5625rem; line-height: 1.75rem; height: 1.75rem; color: #676b6d; }
.confirm-body { position: relative; padding: .5rem; box-sizing: border-box; width: 100%; }
.confirm-form-line { height: 1.06rem; width: 100%; margin-bottom: .5rem; box-sizing: border-box; font-size: .4375rem; display: flex; color: #676b6d; }
.confirm-form-line.line2 { height: fit-content; display: block; }
.confirm-form-line.line2>div { width: 100%; height: fit-content; display: flex; margin-bottom: 0rem; }
.confirm-form-line.line2>div>label { display: inline-block; width: 3rem; text-align: right; }
.confirm-form-line.line2>div>div { display: inline-block; width: 0; flex: 1; }

.confirm-form-line label { width: 16%; text-align: right; font-size: .4375rem; padding: 0rem .5rem; height: 100%; line-height: 1.06rem; }
.confirm-form-line .monthBox { display: inline-block; padding-top: 0.15rem; }
.confirm-form-line .monthBox .sub,.confirm-form-line.line2>div>div .sub { display: inline-block; width: .7rem; height: .7rem; border: 1px solid #333333; text-align: center; border-right: none; cursor: pointer; }
.confirm-form-line .monthBox .add,.confirm-form-line.line2>div>div .add { display: inline-block; width: .7rem; height: .7rem; border: 1px solid #333333; text-align: center; border-left: none; margin-right: .2rem; cursor: pointer; }
.confirm-form-line .monthBox .num,.confirm-form-line.line2>div>div .num { vertical-align: top; display: inline-block; width: 1rem; height: .7rem; border: 1px solid #333333; text-align: center; outline: none; }
.confirm-form-line-right { flex: 1; height: 100%; line-height: 1.06rem; box-sizing: border-box; padding: 0 .5rem; }
.confirm-form-line-right input { box-sizing: border-box; width: 100%; display: block; height: 100%; padding: 0.2rem 0.375rem; font-size: .4375rem; color: #555; background-color: white; border: 1px solid #cccccc;border-radius: .125rem; }
.confirm-footer { width: 100%; border-top: 1px solid #e5e5e5; box-sizing: border-box; padding: 0 .5rem; height: 1.75rem; line-height: 1.75rem; text-align: right; }
.confirm-footer button { display: inline-block; box-sizing: border-box; font-size: .4375rem; }
.confirm-ok { padding: .2rem .375rem; border-radius: .125rem; border: 1px solid transparent; background-color: #26af95; color: #fff; width: 2.5rem; cursor: pointer; }
.confirm-cancel { padding: .2rem .375rem; border-radius: .125rem; border: 1px solid transparent; background-color: #fff; border-color: #ccc; color: #333; margin-left: 1rem; cursor: pointer; }
.fade-enter-active { animation: fade-in .3s ease-in; }
.fade-leave-active { animation: fade-out .5s ease-out; }
.ease-enter-active { animation: easein .3s ease-in; }
.ease-leave-active { animation: easeout .3s ease-out; }
@keyframes easein {
    0% {
        margin-top: -5rem;
    }
    100% {
        margin-top: 1rem;
    }
}
@keyframes easeout {
    0% {
        margin-top: 1rem;
    }
    100% {
        margin-top: -5rem;
    }
}
@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: .5;
    }
}
@keyframes fade-out {
    0% {
        opacity: .5;
    }
    100% {
        opacity: 0;
    }
}
</style>