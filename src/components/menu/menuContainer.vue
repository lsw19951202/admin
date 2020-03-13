<template>
    <div class="sidebar-menus">
        <div class="sidebar-menu-list">
            <menu-item v-for="(item, index) in items" v-bind:idx="index" v-bind="item" v-bind:key="index" @menuItemClicked="itemClicked" @subItemClicked="subItemClicked"></menu-item>
        </div>
    </div>
</template>
<script>
import MenuItem from '@/components/menu/menuItem.vue'

export default {
    props: ['items'],
    components: {
        'menu-item': MenuItem
    },
    methods: {
        itemClicked: function(data){
            for(let idx = 0;idx < this.items.length;idx++){
                if(idx == data.idx){
                    this.items[idx].selected = true;
                    this.items[idx].zkStatus = data.zkStatus;
                }else{
                    this.items[idx].selected = false;
                    this.items[idx].zkStatus = false;
                }
            }
        },
        subItemClicked: function(data){
            for(let idx = 0;idx < this.items.length;idx++){
                for(let idxx = 0;idxx < this.items[idx]['auth_detail'].length;idxx++){
                    this.items[idx]['auth_detail'][idxx].selected = (idx == data.itemIdx && idxx == data.subItemIdx)
                }
            }
            this.$emit('subItemClicked', data);
        }
    }
}
</script>