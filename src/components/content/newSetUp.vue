<template>
    <div class="mask">
        <div class="mask-mantle"></div>
        <div class="mask-messge" >
            <div class="mask-title" v-if="type=='newFree'">新建新人免单商品</div>
            <div class="mask-title" v-if="type=='highServant'">新建高佣商品</div>
            <div class="mask-title" v-if="type=='highServantEdit'">编辑高佣商品</div>
            <div class="search-group">
                <label>所属平台： </label>
                <input type="text" v-if="type=='highServantEdit'" :placeholder="selectMessge.plat_type" class="mask-put" :disabled="type=='highServantEdit'">
                <select name="" id="" class="mask-put" @change="choosePlatform" v-else>
                    <option :value="item.value" v-for="(item,index) in selectParams" :key="index">{{item.name}}</option>
                </select>
            </div>
            <div class="search-group" v-if="type == 'highServant' || type == 'highServantEdit'">
                <label>品类</label>
                <select v-model="fqcat">
                    <option value="0">全部</option>
                    <option value="1">女装</option>
                    <option value="2">男装</option>
                    <option value="3">内衣</option>
                    <option value="4">美妆</option>
                    <option value="5">配饰</option>
                    <option value="6">鞋品</option>
                    <option value="7">箱包</option>
                    <option value="8">儿童</option>
                    <option value="9">母婴</option>
                    <option value="10">居家</option>
                    <option value="11">美食</option>
                    <option value="12">数码</option>
                    <option value="13">家电</option>
                    <option value="14">其他</option>
                    <option value="15">车品</option>
                    <option value="16">文体</option>
                    <option value="17">宠物</option>
                </select>
            </div>
            <div class="search-group">
                <label>商品ID： </label>
                <input type="text" placeholder="请输入" class="mask-put" v-model="goodId" :disabled="type=='highServantEdit'">
            </div>
            <div class="search-group" v-if="type=='highServant' || type=='highServantEdit'">
                <label>佣金比： </label>
                <input type="text" placeholder="请输入" class="mask-put" v-model="commissionRate" :disabled="selectMessge.source != '手动添加'">
                <span style="position:relative;top:6px;">%</span>
            </div>
            <div class="search-group">
                <label>当前状态： </label>
                <span style="font-size:15px;color:red;">待发布</span>
            </div>
            <div class="mask-bottom">
                <div class="mask-cancel" @click="cancel">取消</div>
                <div class="mask-keep" @click="preservation">保存</div>
            </div>
        </div>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    props:['type','selectMessge'],
    data(){
        return{
            fqcat: '',
            selectParams:[
                {value:'',name:'请选择'},
                {value:'jd',name:'京东'},
                {value:'pdd',name:'拼多多'},
                {value:'tb',name:'淘宝'},
            ],
            platform:'',
            goodId:'',
            commissionRate:''
        }
    },
    mounted(){
        if(this.selectMessge){
            if(this.selectMessge.plat_type=='淘宝'){
                this.platform = 'tb';
            }
            if(this.selectMessge.plat_type=='京东'){
                this.platform = 'jd';
            }
            if(this.selectMessge.plat_type=='拼多多'){
                this.platform = 'pdd';
            }
            this.goodId = this.selectMessge.itemid;
            this.commissionRate = this.selectMessge.tkrates;
        }
    },
    methods:{
        choosePlatform(e){//选择平台
            const val = e.target.value
            this.platform = val;
        },
        cancel(){
            this.$emit('callOff')
        },
        preservation(){
            const type = this.type;
            if(type == 'newFree'){
                this.$emit('preservationEvent',{'goods_id':this.goodId,'platform':this.platform,})
            }
            if(type == 'highServant' || type == 'highServantEdit'){
                const data = {
                    'goods_id':this.goodId,
                    'platform':this.platform,
                    'commission_rate':this.commissionRate,
                    fqcat: this.fqcat
                }
                this.$emit('preservationEvent',data)
            }
        }
    }
}
</script>

<style scoped>
.mask { position: fixed; width: 100%; left: 0; top: 0; z-index: 10000; }
.mask-mantle { width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 10001; }
.mask-messge { box-sizing: border-box; border-radius: .25rem; margin: auto; margin-top: 2rem; width: 25rem; background: #fff; position: relative; z-index: 10002; padding: .34rem 1rem;display: flex;flex-direction: column; }
.mask-title{width: 100%;height: 40px;line-height: 40px;font-size: 18px;font-weight: bold;border-bottom: 1px solid #eeeeee;}
.search-group{font-size: 16px;margin: 20px 0;}
.mask-put{width: 6.5rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;margin-left: .2rem;}
.mask-bottom{display: flex;justify-content: space-around;padding: 10px 0;}
.mask-cancel{width: 100px;height: 28px;font-size: 15px;line-height: 28px;text-align: center;color: #666666;background-color: #c5c2c2;border-radius: 5px;cursor: pointer;}
.mask-keep{width: 100px;height: 28px;font-size: 15px;line-height: 28px;text-align: center;color: #ffffff;background-color: #4880EA;border-radius: 5px;cursor: pointer;}
/* .search-group::after{position: absolute;content: '';width: 0;height: 0;top: 10px;right: 5px;border: 0.3rem solid;border-color: #999999 transparent transparent transparent;} */
</style>