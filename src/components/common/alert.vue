<template>
    <div class="alert">
        <transition name="fade">
            <div v-if="isShow" class="alert-mark"></div>
        </transition>
        <transition name="ease">
            <div class="alert-box" v-if="isShow">
                <div class="alert-header">{{alertParams.header}}</div>
                <div class="alert-body">
                    <div class="alert-form-line">{{alertParams.content}}</div>
                </div>
                <div class="alert-footer" @click="btnClicked">
                    确 定
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: ['isShow', 'alertParams'],
    methods: {
        btnClicked: function(){
            this.$emit('alertOkClicked')
        }
    }
}
</script>
<style scoped>
.alert { position: fixed; width: 100%; left: 0; top: 0; z-index: 10000; }
.alert-mark { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 10001; }
.alert-box { box-sizing: border-box; border-radius: .25rem; margin: auto; margin-top: 2rem; width: 18.75rem; background: #fff; position: relative; z-index: 10002; padding-bottom: .34rem; }
.alert-header { text-align: center; box-sizing: border-box; padding: 0rem .5rem; border-bottom: 1px solid #e5e5e5; font-size: 0.5625rem; line-height: 1.75rem; height: 1.75rem; color: #676b6d; }
.alert-body { text-align: center; position: relative; padding: .5rem; box-sizing: border-box; width: 100%; }
.alert-form-line { text-align: center; height: 1.06rem; width: 100%; margin-bottom: .5rem; box-sizing: border-box; font-size: .4375rem; color: #676b6d; }
.alert-footer { width: 100%; border-top: 1px solid #e5e5e5; box-sizing: border-box; padding: 0 .5rem; height: 1.75rem; line-height: 1.75rem; text-align: center; color: #666; cursor: pointer; font-size: .6rem; }
.fade-enter-active { animation: fade-in .3s ease-in; }
.fade-leave-active { animation: fade-out .5s ease-out; }
.ease-enter-active { animation: easein .3s ease-in; }
.ease-leave-active { animation: easeout .3s ease-out; }
@keyframes easein {
    0% {
        margin-top: -3rem;
    }
    100% {
        margin-top: 2rem;
    }
}
@keyframes easeout {
    0% {
        margin-top: 2rem;
    }
    100% {
        margin-top: -3rem;
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