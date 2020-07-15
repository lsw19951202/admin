<template>
    <div class="detail-data-box direct-editor">
        <div class="editor-header">新增/修改定向商品</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>所属模块</label>
                <div>
                    <select v-model="module" :disabled="direct.id">
                        <option value="1">搜索</option>
                    </select>
                </div>
            </div>
            <div class="editor-groups">
                <label>商品ID</label>
                <div>
                    <input type="text" @keypress.enter="getGoodsInfo" placeholder="请输入商品ID,并按回车键" v-model="goods_id" :disabled="direct.id">
                </div>
            </div>
            <div class="editor-groups">
                <label>商品名称</label>
                <div>
                    <span>{{goods_name}}</span>
                </div>
            </div>
            <div class="editor-groups">
                <label>商家佣金比例</label>
                <div>
                    <span>{{tkrates}}</span>
                </div>
            </div>
            <div class="editor-groups">
                <label>优惠券使用时间</label>
                <div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="use_starttime"></flat-picker>
                    至
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="use_endtime"></flat-picker>
                </div>
            </div>
            <div class="editor-groups">
                <label>优惠券领取时间</label>
                <div>
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="receive_starttime"></flat-picker>
                    至
                    <flat-picker class="search-time-picker" :config="dateConfig" v-model="receive_endtime"></flat-picker>
                </div>
            </div>
            <div class="editor-groups">
                <label>平台佣金比例</label>
                <div>
                    <input type="text" v-model="directed_tkrates">
                </div>
            </div>
            <div class="editor-groups">
                <label>优惠券链接</label>
                <div>
                    <input type="text" v-model="coupon_url">
                </div>
            </div>
            <div class="editor-groups">
                <label>优惠券金额</label>
                <div>
                    <input type="text" v-model="directed_couponmoney">
                </div>
            </div>
            <div class="editor-groups" v-if="direct.id">
                <label>状态</label>
                <div>
                    <span>
                        {{direct.status}}
                    </span>
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" @click="saveDirect">保存</button>
                    <button class="action-btn" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import request from '@/axios'
import Setting from '@/setting'

export default {
    inject: ['alert'],
    props: ['direct'],
    components: {
        'flat-picker': flatPicker
    },
    data(){
        return {
            dateConfig: {
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i',
                enableTime: true,
                'time_24hr': true
            },
            'module': '',
            'goods_id': '',
            'goods_name': '',
            'tkrates': '',
            'directed_tkrates': '',
            'receive_starttime': '',
            'receive_endtime': '',
            'use_starttime': '',
            'use_endtime': '',
            'directed_couponmoney': '',
            'coupon_url': ''
        }
    },
    created(){
        this.module = this.direct.module == '搜索' ? 1 : 0
        this.$data['goods_id'] = this.direct.itemid
        this.tkrates = (this.direct.tkrates || 0) + '%'
        this.$data['directed_tkrates'] = (this.direct.directed_tkrates || 0) + '%'
        this.$data['goods_name'] = this.direct.itemtitle
        this.$data['use_starttime'] = this.direct.use_time ? this.direct.use_time.split('至')[0] : ''
        this.$data['use_endtime'] = this.direct.use_time ? this.direct.use_time.split('至')[1] : ''
        this.$data['receive_starttime'] = this.direct.receive_time ? this.direct.receive_time.split('至')[0] : ''
        this.$data['receive_endtime'] = this.direct.receive_time ? this.direct.receive_time.split('至')[1] : ''
        this.$data['coupon_url'] = this.direct.jump_link
        this.$data['directed_couponmoney'] = this.direct.directed_couponmoney
    },
    methods: {
        saveDirect(){
            if(!this.module){
                this.alert('所属模块为必填')
                return
            }
            if(!this.goods_id){
                this.alert('商品ID为必填')
                return
            }
            if(!this.use_starttime || !this.use_endtime){
                this.alert('优惠券使用时间必填')
                return
            }
            if(!this.receive_starttime || !this.receive_endtime){
                this.alert('优惠券领取时间必填')
                return
            }
            if(!/^\d+(\.?\d+)?%$/.test(this.directed_tkrates)){
                this.alert('平台佣金比例格式错误')
                return
            }
            if(this.directed_tkrates.replace('%', '') > this.tkrates){
                this.alert('平台佣金比例不能大于商家佣金比例')
                return
            }
            if(!this.coupon_url){
                this.alert('优惠券链接必填')
                return
            }
            if(!this.directed_couponmoney){
                this.alert('优惠券金额必填')
                return
            }
            this.$emit('saveDirect', {
                module: this.module,
                'goods_id': this.$data['goods_id'],
                'goods_name': this.$data['goods_name'],
                'directed_tkrates': this.$data['directed_tkrates'],
                'coupon_url': this.$data['coupon_url'],
                'directed_couponmoney': this.$data['directed_couponmoney'],
                'receive_starttime': this.$data['receive_starttime'],
                'receive_endtime': this.$data['receive_endtime'],
                'use_starttime': this.$data['use_starttime'],
                'use_endtime': this.$data['use_endtime']
            })
        },
        cancelEdit(){
            this.$emit('cancelEdit')
        },
        getGoodsInfo(){
            console.log(this.goods_id)
            if(!this.goods_id){
                return
            }
            request({
                url: Setting.urls.directGoodsInfo,
                method: 'get',
                params: {
                    platform: 'tb',
                    'goods_id': this.goods_id
                }
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 'success'){
                    this.$data['goods_name'] = rst.data.result.title
                    this.$data['tkrates'] = rst.data.result.tkrate + '%'
                }
            })
        }
    }
}
</script>
<style scoped>
.direct-editor { padding: 0; color: #333333; }
.editor-header { font-weight: bold; height: 2.34375rem; line-height: 2.34375rem; border-bottom: 1px solid #e6e6e6; font-size: .5625rem; padding-left: 1.125rem; }
.editor-body { height: 0; flex: 1; padding: .75rem 1.125rem; display: flex; flex-direction: column; overflow: hidden; overflow-y: scroll; }
.editor-groups { width: 100%; height: 1.25rem; line-height: 1.25rem; display: flex; margin-top: .625rem; font-size: .4375rem; }
.editor-groups:first-child { margin-top: 0; }
.editor-groups label { width: 3.0625rem; height: 100%; line-height: 1.25rem; }
.editor-groups>div { flex: 1; height: 100%; width: 0; }
.editor-groups input,.editor-groups select { font-size: .4375rem; width: 15.9375rem; height: 100%; line-height: 1.25rem; border: 1px solid #d9d9d9; border-radius: .125rem; padding: .3125rem; box-sizing: border-box; }
.editor-groups select { -webkit-appearance: menulist; }
.editor-groups input.search-time-picker { width: 7.5rem; }
</style>