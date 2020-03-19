<template>
    <div class="pop" v-if="isShow">
        <div class="pop-mark" @click="hidePop"></div>
        <div class="pop-box" :style="popParams.style" ref="popBox">
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
    data:() => {
        return {
            echart: null
        }
    },
    methods: {
        hidePop: function(){
            this.$parent.showPopChart = false
        }
    },
    updated: function(){
        this.$refs.popBox&&this.$nextTick().then(() => {
            // if(!this.echart){
            this.echart = echarts.init(this.$refs.popBox)
            // }
            this.echart.setOption(this.popParams.echartOption)
        })
    }
}
</script>
<style scoped>
.pop { position: fixed; width: 100%; left: 0; top: 0; z-index: 9997; }
.pop-mark { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 9998; }
.pop-box { box-sizing: border-box; border-radius: .25rem; position: fixed !important; transform: translate(-50%, -50%); left: 50%; top: 50%; z-index: 9999; background-color: #ffffff; }
</style>