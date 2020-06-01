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
                <div class="confirm-footer">
                    <button @click="confirm(1)" class="confirm-ok">确认</button>
                    <button @click="confirm(0)" class="confirm-cancel">取消</button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: ['isShow', 'confirmParams'],
    data: function(){
        return {
            pwd: '',
            confirmPwd: ''
        }
    },
    methods: {
        confirm: function(num){
            if(num  == 0){
                this.$emit('confirmClicked')
            }else{
                switch(this.confirmParams.type){
                    case 'modifyPwd': this.confirmModifyPwd(); break;
                    case 'del': this.confirmDel(); break;
                    case 'modifyStatus': this.confirmModifyStatus(); break;
                    default: return
                }
            }
        },
        confirmModifyStatus: function(){
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
.confirm { position: fixed; width: 100%; left: 0; top: 0; z-index: 9997; }
.confirm-mark { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 9998; }
.confirm-box { box-sizing: border-box; border-radius: .25rem; margin: auto; margin-top: 1rem; width: 18.75rem; background: #fff; position: relative; z-index: 9999; padding-bottom: .34rem; }
.confirm-header { box-sizing: border-box; padding: 0rem .5rem; border-bottom: 1px solid #e5e5e5; font-size: 0.5625rem; line-height: 1.75rem; height: 1.75rem; color: #676b6d; }
.confirm-body { position: relative; padding: .5rem; box-sizing: border-box; width: 100%; }
.confirm-form-line { height: 1.06rem; width: 100%; margin-bottom: .5rem; box-sizing: border-box; font-size: .4375rem; display: flex; color: #676b6d; }
.confirm-form-line label { width: 16%; text-align: right; font-size: .4375rem; padding: 0rem .5rem; height: 100%; line-height: 1.06rem; }
.confirm-form-line-right { flex: 1; height: 100%; line-height: 1.06rem; box-sizing: border-box; padding: 0 .5rem; }
.confirm-form-line-right input { box-sizing: border-box; width: 100%; display: block; height: 100%; padding: 0.2rem 0.375rem; font-size: .4375rem; color: #555; background-color: white; border: 1px solid #cccccc;border-radius: .125rem; }
.confirm-footer { width: 100%; border-top: 1px solid #e5e5e5; box-sizing: border-box; padding: 0 .5rem; height: 1.75rem; line-height: 1.75rem; text-align: right; }
.confirm-footer button { display: inline-block; box-sizing: border-box; font-size: .4375rem; }
.confirm-ok { padding: .2rem .375rem; border-radius: .125rem; border: 1px solid transparent; background-color: #26af95; color: #fff; width: 2.5rem; }
.confirm-cancel { padding: .2rem .375rem; border-radius: .125rem; border: 1px solid transparent; background-color: #fff; border-color: #ccc; color: #333; margin-left: 1rem; }
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