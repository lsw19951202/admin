<template>
    <div class="card-container">
        <card-row v-for="(rowData, index) in cardData" v-bind:rowData="rowData" v-bind:key="index"></card-row>
    </div>
</template>
<script>
import CardRow from './cardRow.vue'

export default {
    props: ['cardData'],
    components: {
        'card-row': CardRow
    }
}
</script>