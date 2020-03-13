<template>
    <div class="card-row">
        <card-item v-for="(item, index) in rowData" v-bind:key="index" v-bind="item"></card-item>
    </div>
</template>
<script>
import CardItem from './cardItem.vue'

export default {
    props: ['rowData'],
    components: {
        'card-item': CardItem
    },
    created: function(){
        console.log(this.rowData)
    }
}
</script>