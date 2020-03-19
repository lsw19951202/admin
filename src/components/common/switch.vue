<template>
    <div :class="'switch-box ' + (turnOn ? 'turn-on': 'turn-off')" @click="changeSwitchStatus">
        <div class="switch-progress">
            <div class="switch-ball"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['turnOn', 'statusData'],
    methods: {
        changeSwitchStatus: function(){
            this.$emit('changeSwitchStatus', {data: this.statusData, status: !this.turnOn})
        }
    }
}
</script>
<style scoped>
.switch-box { width: 1.75rem; height: .75rem; display: inline-block; border-radius: .4375rem; position: relative; background-color: #e2e2e2; cursor: pointer; }
.switch-progress { position: absolute; left: 0; top: 0; border-radius: .4375rem; height: 100%; width: 0; background-color: #40c537; }
.switch-ball { position: absolute; right: -.6875rem; top: .0625rem; width: .625rem; height: .625rem; border-radius: 50%; background-color: #ffffff; }
.switch-box.turn-on .switch-progress { width: 100%; }
.switch-box.turn-on .switch-ball { right: .0625rem; }
</style>