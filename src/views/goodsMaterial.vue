<template>
  <div class="detail-container">
    <div class="detail-data-box">
        <div class="newFreeHeader">
            <div class="headerNav" :class="isShow==0?'':'headerNavNo'" @click="chooseNav(0)" v-if="newFreeLimit">新人免单</div>
            <div class="headerNav" :class="isShow==1?'':'headerNavNo'" @click="chooseNav(1)">高佣商品</div>
            <div class="headerNav" :class="isShow==2?'':'headerNavNo'" @click="chooseNav(2)">集合商品</div>
        </div>
        <!-- 新人免单 -->
        <new-free v-if="isShow==0?true:false" @limitsFn='isShowNewFreeVue'></new-free>
        <high-servant v-if="isShow==1?true:false"></high-servant>
    </div>
  </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import newFree from '../views/newFree.vue'
import highServant from '../views/highServant.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'new-free':newFree,
        'high-servant':highServant
    },
    data(){
        return{
            isShow:0,//默认显示新人免单，0新人免单   1高佣商品     2集合商品 
            newFreeLimit:true,//新人免单权限
        }
    },
    methods:{
        chooseNav(e){//切换导航
            this.isShow = e;
        },
        isShowNewFreeVue(e){
            console.log(e,"新人免单权限")
            if(!e){
                this.isShow = 1
            }
            this.newFreeLimit = e;
        },
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{padding: 0;}
.newFreeHeader{width: 100%;display: flex;margin-bottom: 30px;}
.headerNav{width: 100px;height: 30px;font-size: 16px;font-family: '微软雅黑';color: #ffffff;background-color: #4880EA;line-height: 30px;text-align: center;margin-right: 30px;border-radius: 5px;cursor: pointer;}
.headerNavNo{background-color: #999999;}
</style>