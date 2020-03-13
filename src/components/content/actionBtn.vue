<template>
    <button class="action-btn" @click.prevent.stop="actionBtnClicked">{{name}}</button>
</template>
<script>
export default {
    props: ['name', 'url', 'idx'],
    methods: {
        actionBtnClicked: function(){
            console.log(this.name)
        }
    }
}
</script>