<template>
    <li :class="selected?'checked':''" @click="menuSubItemClicked">
        {{name}}
    </li>
</template>
<script>
export default {
    props:['name', 'url', 'selected', 'idx'],
    methods: {
        menuSubItemClicked: function(){
            // if(this.selected){
            //     return
            // }
            this.$emit('menuSubItemClicked', this.idx);
        }
    }
}
</script>