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
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>展示顺序</th>
                            <th>豆腐块名称</th>
                            <th>图片</th>
                            <th>描述</th>
                            <th>中间页</th>
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
                            <td>
                                <div class="rowspan">{{item['left_id']}}</div>
                                <div class="rowspan">{{item['right_id']}}</div>
                            </td>
                            <td>{{item['sort_key']}}</td>
                            <td>
                                <div class="rowspan">{{item['left_name']}}</div>
                                <div class="rowspan">{{item['right_name']}}</div>
                            </td>
                            <td>
                                <div class="rowspan">
                                    <img :src="item['left_img']" alt="图片" @click="choosePicture(item['left_img'])">
                                </div>
                                <div class="rowspan">
                                    <img :src="item['right_img']" alt="图片" @click="choosePicture(item['right_img'])">
                                </div>
                            </td>
                            <td>
                                <div class="rowspan">{{item['left_description']}}</div>
                                <div class="rowspan">{{item['right_description']}}</div>
                            </td>
                            <td>
                                <div class="rowspan">{{item['left_target']}}</div>
                                <div class="rowspan">{{item['right_target']}}</div>
                            </td>
                            <td class="norowspan">{{item['left_create_time']}}</td>
                            <td class="norowspan">{{item['left_update_time']}}</td>
                            <td class="norowspan" v-html="item['left_valid_time'].replace('至','<br/>至<br/>')"></td>
                            <td class="norowspan">{{item.status}}</td>
                            <td class="norowspan">{{item['create_user']}}</td>
                            <td style="padding: 0 10px;">
                                <div class="issue" v-if="item.status == '发布中'">
                                    <div class="textValue" @click.prevent.stop="offShelfFn(item)">下架</div>
                                    <div class="textValue" @click.prevent.stop="lookDataFn(item)">查看</div>
                                </div>
                                <div class="issue" v-else>
                                    <div class="textValue" @click.prevent.stop="releaseFn(item)">发布</div>
                                    <div class="textValue" @click.prevent.stop="deleteFn(item)">删除</div>
                                    <div class="textValue" @click.prevent.stop="esitDataFn(item)">编辑</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 提示框 -->
            <operation-tip :tipsText='tipsText' :showTips='showTips' @cancelEvent='cancelFn' @determineEvent='determineFn'></operation-tip>
        </div>
        <!-- 图片预览 -->
        <div class="mask" v-if="showImg">
            <div class="alert-mark" @click="closeImg"></div>
            <img :src="imgUrl" alt="图片" class="imgBox">
        </div>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import operationTips from '@/components/content/operationTips.vue'
import select from '@/components/common/select.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    components:{
        'Select': select,
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
                ids:'',//多个id使用英文逗号隔开
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
            imgUrl:'',//查看图片
            showImg:false,//是否显示查看图片
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
        offShelfFn(item){//下架
            console.log(item,"下架")
            const ids = [];
            ids.push(item['left_id'],item['right_id'])
            this.operateData.ids = ids.join(',')
            this.operateData.type = 'off'
            this.tipsText = '是否要下架该豆腐块?'
            this.showTips = true
            this.operationType = '下架'
        },
        releaseFn(item){//发布
            console.log(item,"发布")
            const ids = [];
            ids.push(item['left_id'],item['right_id'])
            this.operateData.ids = ids.join(',')
            this.operateData.type = 'open'
            this.tipsText = '是否要发布该豆腐块?'
            this.showTips = true
            this.operationType = '发布'
        },
        deleteFn(item){//删除
            const ids = [];
            ids.push(item['left_id'],item['right_id'])
            this.operateData.ids = ids.join(',')
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
        },
        esitDataFn(item){//编辑
            console.log(item,"编辑")
            this.$emit('editTofo',item)
        },
        lookDataFn(item){//查看
            this.$emit('lookDataList',item)
        },
        choosePicture(url){//查看图片 
            this.imgUrl = url;
            this.showImg = true;
        },
        closeImg(){
            this.showImg=false
        },
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
/* tbody tr td{padding: 4px;} */
.issue{height: 30px;display: flex;justify-content: space-around;align-items: flex-end;padding: 0 10px;box-sizing: border-box;}
.textValue{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 5px;}
tbody tr td>.rowspan:first-child{border-bottom: 1px solid #b8b8b8;}
.rowspan{height: 3rem;padding: 0 5px;box-sizing: border-box;margin: 0;display: flex;align-items: center;justify-content: center;}
.norowspan{padding: 4px;}
.rowspan>img{width: 5rem; height: 2.5rem; border-radius: 5px;cursor: pointer;}

/* 图片预览弹窗 */
.alert-mark{width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 10001;}
.imgBox{width: 30%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%); z-index: 10002;}
/*  */
</style>