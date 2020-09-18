<template>
    <div class="detail-container">
        <BenchHeader v-bind:headerData='headerData'></BenchHeader>
        <div class="listBox">
            <button>新增用户</button>
            <button>活跃用户</button>
            <button>下单用户</button>
            <button>商品分享次数</button>
        </div>
        <div class="content">
            <BenchBody v-bind:bodyData='bodyData'></BenchBody>
        </div>
    </div>
</template>

<script>
    import request from '@/axios'
    import qs from 'qs'
    import setting from '@/setting'
    import benchHeader from "../components/content/benchHeader.vue"
    import benchBody from "../components/content/benchBody.vue"
    export default {
        inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
        components: {
            'BenchHeader':benchHeader,
            'BenchBody':benchBody
        },
        data() {
            return {
                headerData:[],//顶部数据
                bodyData:[],
            }
        },
        created() {
             this.getTotaluser();//获取新增用户总数
             this.getActiveUser();//获取活跃用户总数
             this.getOrderuser();//下单总数
             this.getGoodsShare();//商品分享数据
        },
        watch: {

        },
        methods: {
            compare(val){
                return function(a,b){
                    const value1 = a[val];
                    const value2 = b[val];
                    return value1 - value2;
                }
            },
            getTotaluser(){//获取新增用户总数
                this.showLoading()
                request({
                    url:setting.urls.totalUser,
                    method:'get',
                    params:{}
                }).then(res=>{
                    // console.log(res,"平台用户总数")
                    if(res.status == 200){
                    if(res.data.code == 200){
                        const rest = res.data.data;
                        this.headerData.push({
                            name:'today_user_num',
                            value:rest.today.user_num,
                            percentage:rest.rate.day_rate,
                            num:1//顺序
                        })
                        this.bodyData.push({
                            name:'addUser',
                            value:rest,
                            num:1//顺序
                        })
                        this.headerData.sort(this.compare('num'))
                        this.bodyData.sort(this.compare('num'))
                        // this.addUserData = Object.assign([], rest)
                    }else{
                        this.alert(res.data.message || '新增用户列表失败')
                    }
                    }else{
                        this.alert('新增用户列表失败')
                    }
                }).catch((e) => {
                    this.alert('新增用户列表失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getActiveUser(){//获取活跃用户总数
                this.showLoading()
                request({
                    url:setting.urls.activeUser,
                    method:'get',
                    params:{
                    }
                }).then(res=>{
                    if(res.status == 200){
                        // console.log(res,"活跃用户")
                        if(res.data.code == 200){
                            const rest = res.data.data;
                            this.headerData.push({
                                name:'today_total_user_num',
                                value:rest.today.total_user_num,
                                percentage:rest.rate.day_rate,
                                activeRate:rest.active_rate,
                                num:2,
                            })
                            this.bodyData.push({
                                name:'lifeUser',
                                value:rest,
                                num:2//顺序
                            })
                            this.headerData.sort(this.compare('num'))
                            this.bodyData.sort(this.compare('num'))
                        }else{
                            this.alert(res.data.message || '活跃用户统计失败')
                        }
                    }else{
                        this.alert('活跃用户统计失败')
                    }
                }).catch((e) => {
                    this.alert('活跃用户统计失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getOrderuser(){//下单总数
                this.showLoading()
                request({
                    url:setting.urls.orderUser,
                    method:'get',
                    params:{}
                }).then(res=>{
                    if(res.status == 200){
                        if(res.data.code == 200){
                            const rest = res.data.data;
                            this.headerData.push({
                                name:'today_order_total_user_num',
                                value:rest.today.total_user_num,
                                percentage:rest.rate.day_rate,
                                orderRate:rest.order_rate,
                                num:3,
                            })
                            this.bodyData.push({
                                name:'orderUser',
                                value:rest,
                                num:3//顺序
                            })
                            this.headerData.sort(this.compare('num'))
                            this.bodyData.sort(this.compare('num'))
                        }else{
                            this.alert(res.data.message || '下单总数失败')
                        }
                    }else{
                        this.alert('下单总数失败')
                    }
                }).catch((e) => {
                    this.alert('下单总数失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
            getGoodsShare(){//商品分享数据
                this.showLoading()
                request({
                    url:setting.urls.goodsShare,
                    method:'get',
                    params:{}
                }).then(res=>{
                    // console.log(res,"商品分享数据")
                    if(res.status == 200){
                        if(res.data.code == 200){
                            const rest = res.data.data;
                            this.headerData.push({
                                name:'today_share_num',
                                value:rest.today.share_num,
                                percentage:rest.rate.day_rate,
                                num:4,
                            })
                            this.bodyData.push({
                                name:'shareUser',
                                value:rest,
                                num:4//顺序
                            })
                            this.headerData.sort(this.compare('num'))
                            this.bodyData.sort(this.compare('num'))
                        }else{
                            this.alert(res.data.message || '商品分享数据失败')
                        }
                    }
                }).catch((e) => {
                    this.alert('商品分享数据失败')
                }).then(() => {
                    this.hideLoading()
                })
            },
        }
    }
</script>

<style scoped>
    .listBox {
        width: 100%;
        display: flex;
        /* position: fixed;
        top: 0; */
    }
    .content{
        margin-top: 0.8rem;
        flex: 1;
        height: 0;
        overflow: hidden;
        overflow-y: auto;
    }
    button{
        width: 3rem;
        height: 1rem;
        margin-right: 0.5rem;
        line-height: 1rem;
        border-radius: 0.15rem;
    }
</style>
