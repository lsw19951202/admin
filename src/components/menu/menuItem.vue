<template>
    <div :class="'sidebar-menu-item'  + (zkStatus ? ' zk':'') + (selected ? ' checked':'')">
        <div class="sidebar-menu-item-title" @click="changeStatus">
            <div class="sidebar-menu-item-img">
                <img :src="imgSrc[0]">
                <img :src="imgSrc[1]">
            </div>
            <div class="sidebar-menu-item-txt">{{name}}</div>
            <div class="sidebar-menu-item-right">
                <img class="down" src="@/assets/more_down_checked.png">
                <img class="right" src="@/assets/more_right.png">
                <img class="down-unchecked" src="@/assets/more_down.png">
            </div>
        </div>
        <ul class="sidebar-menu-item-l">
            <menu-sub-item v-for="(item, index) in auth_detail" v-bind:key="index" v-bind:idx="index" v-bind="item" @menuSubItemClicked="subItemClicked"></menu-sub-item>
        </ul>
    </div>
</template>
<script>
import SubItem from '@/components/menu/menuSubItem.vue'
import Setting from '@/setting'

export default {
    props: ['name', 'auth_detail', 'selected', 'zkStatus', 'idx'],
    components: {
        'menu-sub-item': SubItem
    },
    created: function(){
        this.imgSrc = Setting.images.menu[this.name];
    },
    methods: {
        changeStatus: function(){
            this.$emit('menuItemClicked', { idx: this.idx, zkStatus: !this.zkStatus});
        },
        subItemClicked: function(idx){
            this.$emit('subItemClicked', {itemIdx: this.idx, subItemIdx: idx});
        }
    }
}
</script>