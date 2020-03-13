<template>
    <div class="pop">
        <div class="pop-mark" v-if="isShow" @click="hidePop"></div>
        <div class="pop-box" v-if="isShow" :style="popParams.style" v-html="popParams.htmlContent">
        </div>
    </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import tooltip from 'echarts/lib/component/tooltip'
import title from 'echarts/lib/component/title'
import line from 'echarts/lib/chart/line'
import legend from 'echarts/lib/component/legend'

export default {
    props: ['isShow', 'popParams'],
    methods: {
        hidePop: function(){
            this.$parent.showPop = false
        }
    }
}
</script>
<style scoped>
.pop { position: fixed; width: 100%; left: 0; top: 0; z-index: 9997; }
.pop-mark { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 9998; }
.pop-box { box-sizing: border-box; border-radius: .25rem; position: fixed; transform: translate(-50%, -50%); left: 50%; top: 50%; z-index: 9999; background-color: #ffffff; }
</style>