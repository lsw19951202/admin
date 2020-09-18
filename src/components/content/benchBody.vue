<template>
    <div>
        <div v-for="(item,index) in bodyData" :key='index'>
            <SlideChart v-bind:chartData='item'></SlideChart>
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

        }
    }
</script>

<style scoped>
    
</style>
