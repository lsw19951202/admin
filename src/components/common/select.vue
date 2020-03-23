<template>
    <div class="select" @blur="hideSelector">
        <label>{{selectParams.label}}:</label>
        <div class="select-box">
            <select class="select-ipt" @change="optClicked" :value="value">
                <option v-for="(opt, index) in selectParams.options" :value="opt.value" v-bind:key="index">{{opt.text}}</option>
            </select>
            <!-- <input type="text" :value="selectedText" class="select-ipt" :placeholder="selectParams.placeholder" @click="selectIptClicked">
            <div class="select-dropdown" @click="selectIptClicked"></div>
            <transition :before-enter="beforeEnter" :after-enter="afterEnter" :before-leave="beforeLeave" :after-leave="afterLeave">
                <div class="select-options" v-show="showOpts">
                    <div :class="'select-option' + (opt.value == value?' selected':'')" v-for="(opt, index) in selectParams.options" v-bind:key="index" :value="opt.value" @click.prevent.stop="optClicked($event)">{{opt.text}}</div>
                </div>
            </transition> -->
        </div>
    </div>
</template>
<script>
export default {
    props: ['selectParams', 'value'],
    data: () => {
        return {
            // value: '',
            // selectedText: '',
            showOpts: false
        }
    },
    methods: {
        hideSelector: function(){
            this.showOpts = false
        },
        selectIptClicked: function(){
            this.showOpts = !this.showOpts
        },
        optClicked: function(e){
            // this.value = e.target.value
            // this.selectedText = e.target.innerText
            // this.$emit('selectOptsClicked', this.value)
            this.$emit('selectOptsClicked', e.target.value)
            this.hideSelector()
        }// ,
        // beforeEnter: function(el){
        //     el.style.height = '0rem'
        // },
        // afterEnter: function(el){
        //     el.style.height = this.selectParams.options.length + 0.125 + 'rem'
        // },
        // beforeLeave: function(el){
        //     el.style.height = this.selectParams.options.length + 0.125 + 'rem'
        // },
        // afterLeave: function(el){
        //     el.style.height = '0rem'
        // }
    }
}
</script>
<style scoped>
.select-box { display: inline-block; box-sizing: border-box; width: 5rem; height: 1rem; line-height: 1rem; border: 1px solid #d9d9dd; border-radius: .125rem !important; font-size: .4375rem; }
.select-ipt { appearance: menulist; display: inline-block; box-sizing: border-box; width: 100%; height: 100%; padding-left: .34375rem; border: none; outline: none; vertical-align: top; border-radius: .125rem !important; font-size: .4375rem; cursor: pointer; }
.select-dropdown { width: .3125rem; height: .1875rem; background: url('../../assets/more_down.png') no-repeat; background-size: 100% 100%; display: inline-block; margin-left: .15625rem; vertical-align: middle; }
.select-options { overflow: hidden; position: absolute; background-color: #ffffff; opacity: 1; z-index: 8000; width: 5rem; box-sizing: border-box; height: auto; border-radius: .125rem; box-shadow: 0px 0px .1875rem rgba(154,154,154,0.5); max-height: 8.125rem; overflow-y: scroll; }
.select-option { box-sizing: border-box; padding-left: .34375rem; padding-right: .34375rem; height: 1rem; line-height: 1rem; font-size: .4375rem; white-space: nowrap; overflow-x: hidden; }
.select-option.selected { background-color: #4880ea; color: #ffffff; }
.ease-enter-active { animation: easein .2s ease-in; }
.ease-leave-active { animation: easeout .2s ease-out; }
@keyframes easein {
    0% {
        height: 0%;
    }
    100% {
        height: 100%;
    }
}
@keyframes easeout {
    0% {
        height: 0%;
    }
    100% {
        height: 0%;
    }
}
.pop-box .body .pop-groups.user-level-selector { width: 100%; height: 1.25rem; line-height: 1.25rem; font-size: .4375rem; margin-top: 1rem; }
.pop-box .body .pop-groups.user-level-selector label { width: 4.28125rem; text-align: right; height: 1.25rem; line-height: 1.25rem; }
.pop-box .body .pop-groups.user-level-selector .select-box { width: 9.375rem; height: 1.25rem; line-height: 1.25rem; color: #999999; font-size: .4375rem; margin-left: .25rem; }
</style>