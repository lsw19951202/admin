<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <header class="search-header">
                <div class="search-group">
                    <label>名称:</label>
                    <input type="text" placeholder="请输入" v-model="tofoTitle">
                </div>
                <Select :selectParams="selectStatus" @selectOptsClicked="chooseStatus"></Select>
                <button class="actionAdd-btn" @click="searchBtn">搜索</button>
                <button class="actionAdd-btn" @click="newBuildBanner">新建</button>
            </header>
            <div class="table-container hideScrollBar">
                <advert-table :theadData='theadData' :tbodyData='tbodyData' @offShelfEvent='offShelfFn' @releaseEvent='releaseFn' @deleteEvent='deleteFn'></advert-table>
                <!-- <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>展示顺序</th>
                            <th>豆腐块名称</th>
                            <th>图片</th>
                            <th>描述</th>
                            <th>创建时间</th>
                            <th>更新时间</th>
                            <th>生效时间</th>
                            <th>发布状态</th>
                            <th>创建人</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in tbodyData.data" :key="index">
                            <td>{{item.id}}</td>
                            <td rowspan="2" :style="index%2==0?'':'display:none;'">{{item['sort_key']}}</td>
                            <td>{{item.name}}</td>
                            <td><img :src="item.img" alt="图片" style="width: 5rem; height: 3rem; border-radius: 5px;"></td>
                            <td>{{item.description}}</td>
                            <td rowspan="2" :style="index%2==0?'':'display:none;'">{{item['create_time']}}</td>
                            <td rowspan="2" :style="index%2==0?'':'display:none;'">{{item['update_time']}}</td>
                            <td rowspan="2" :style="index%2==0?'':'display:none;'">{{item['valid_time']}}</td>
                            <td rowspan="2" :style="index%2==0?'':'display:none;'">{{item.status}}</td>
                            <td rowspan="2" :style="index%2==0?'':'display:none;'">{{item['create_user']}}</td>
                            <td style="padding: 0 10px;" :style="index%2==0?'':'display:none;'">
                                <div class="issue" v-if="item.status == '发布中'">
                                    <div class="textValue" @click.prevent.stop="offShelfFn(item)">下架</div>
                                    <div class="textValue">查看</div>
                                </div>
                                <div class="issue" v-else>
                                    <div class="textValue">发布</div>
                                    <div class="textValue">删除</div>
                                    <div class="textValue">编辑</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table> -->
            </div>
            <!-- 提示框 -->
            <operation-tip :tipsText='tipsText' :showTips='showTips' @cancelEvent='cancelFn' @determineEvent='determineFn'></operation-tip>
        </div>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import advertTable from '@/components/content/advertTable.vue'
import operationTips from '@/components/content/operationTips.vue'
import select from '@/components/common/select.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'Select': select,
        'advert-table':advertTable,
        'operation-tip':operationTips,
    },
    data(){
        return{
            theadData:[],
            tbodyData:[],
            showTips:false,
            tipsText:'',//提示信息
            operationType:'',
            operateData:{
                ids:'',
                type:'',// del 删除   off 下架    open发布
                "card_type":'card',
            },
            tofoTitle:'',//名称
            tofoStatus:'',//发布状态 0待发布 1发布中 2已下架
            selectStatus: {//发布状态  0待发布 1发布中 2已下架
                label: '发布状态',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: '0',
                    text: '待发布'
                }, {
                    value: '1',
                    text: '发布中'
                }, {
                    value: '2',
                    text: '已下架'
                }]
            },
        }
    },
    created(){
        this.getTheader();
    },
    methods:{
        getTheader(){//表头
            this.showLoading()
            request({
                url:setting.urls.tofuListTheader,
                method:'get',
                params:{}
            }).then(res=>{
                console.log(res,"豆腐块表头")
                if(res.status == 200){
                    if(res.data.code == 200){
                        this.theadData = res.data.data;
                        this.getTbody()
                    }
                }
            }).catch((e) => {
                this.alert('豆腐块表头请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        getTbody(){//豆腐块列表
            this.showLoading()
            request({
                url:setting.urls.tofoListTbody,
                method:'get',
                params:{
                    name:this.tofoTitle,
                    status:this.tofoStatus
                }
            }).then(res=>{
                if(res.status == 200){
                    if(res.data.code == 200){
                        console.log(res,"豆腐块列表")
                        this.tbodyData = res.data.data
                    }
                }
            }).catch((e) => {
                this.alert('豆腐块列表请求失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        beanOperate(){//发布/下架/删除
            this.showLoading()
            request({
                url:setting.urls.tofoOperate,
                method:'post',
                data:qs.stringify(this.operateData),
            }).then(res=>{
                console.log(res,"发布/下架/删除")
                if(res.data.code == 200){
                    console.log(res,"操作成功!")
                    this.getTheader()
                }else{
                    this.alert('操作失败')
                }
            }).catch((e) => {
                this.alert(this.operationType +'失败!')
            }).then(() => {
                this.hideLoading()
                this.alert(this.operationType + "成功!")
            })
        },
        offShelfFn(id){//下架
            console.log(id,"下架")
            // this.operateData.ids = id
            // this.operateData.type = 'off'
            // this.tipsText = '是否要下架该豆腐块?'
            // this.showTips = true
            // this.operationType = '下架'
        },
        releaseFn(id){//发布
            this.operateData.ids = id
            this.operateData.type = 'open'
            this.tipsText = '是否要发布该豆腐块?'
            this.showTips = true
            this.operationType = '发布'
        },
        deleteFn(id){//删除
            this.operateData.ids = id
            this.operateData.type = 'del'
            this.tipsText = '是否要删除该豆腐块?'
            this.showTips = true
            this.operationType = '删除'
        },
        cancelFn(e){//取消
            this.showTips = e
        },
        determineFn(e){//确定
            console.log(this.operateData)
            this.showTips = e
            this.beanOperate()
        },
        chooseStatus(e){//发布状态
            this.tofoStatus = e;
        },
        searchBtn(){//搜索按钮
            this.getTheader()
        },
        newBuildBanner(){//新建
            this.$emit('newBuildEvent')
        }
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{margin: 0;}
.detail-data-box{padding-top: 0;}
.actionAdd-btn{appearance: menulist;cursor: pointer;padding: 0 1rem;width: 4rem;height: 1rem;line-height: 1rem;background-color: #4880EA;border-radius: .125rem;color: white;vertical-align: top;margin-left: 20px;}
.actionAdd-btn option{cursor: pointer;margin: 0 auto;height: 1.3rem;line-height: 1.3rem;background-color: rgb(243, 241, 241);border: none;border-radius: .5rem;color: #666666;}
.table-container{margin-top: .5rem;}

/* table */
tbody tr td{padding: 4px;}
.issue{height: 30px;display: flex;justify-content: space-around;align-items: flex-end;padding: 0 10px;box-sizing: border-box;}
.textValue{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 5px;}

.alert-mark{width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 10001;}
.imgBox{width: 30%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%); z-index: 10002;}
</style>