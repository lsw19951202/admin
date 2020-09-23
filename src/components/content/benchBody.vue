<template>
    <div v-if="bodyData.length>3">
        <div v-for="(item,index) in bodyData" :key='index'>
            <SlideChart v-bind:chartData='item' @sleepDataList='lookType' :id='item.name'></SlideChart>
        </div>
    </div>
</template>

<script>
    import slideChart from "./slideChart.vue"
    export default {
        props: ['bodyData'],
        components: {
            'SlideChart':slideChart,
        },
        data() {
            return {
            }
        },
        methods: {
            lookType(e){
                this.$emit("sleepData",e)
            },
            go(e){
                const anchorElement = document.getElementById(e);
                      if (anchorElement) {
                        anchorElement.scrollIntoView({ behavior: 'smooth' });
                      }
            }
        }
    }
</script>

<style scoped>
    
</style>
