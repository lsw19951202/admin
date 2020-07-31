<template>
    <div class="detail-container">
        <div class="detail-data-box" v-if="!isLook">
            <h5 style="margin-bottom: 20px;">新建滚动条</h5>
            <div class="search-group">
                <span class="totalS">滚动条名称</span>
                <input type="text" placeholder="请输入" v-model="scrollNameL">
            </div>
            <div class="search-group">
                <span class="totalS">展示文案</span>
                <textarea v-model="textareaText" class="textarea"></textarea>
            </div>
            <div class="search-group">
                <span class="totalS">生效时间</span>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                <span class="to">至</span>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
            </div>
            <div class="search-group">
                <span class="totalS">展示规则</span>
                <div class="rule">
                    <div class="ruleCro">
                        <span class="lableText">是否要求用户登录</span>
                        <div style="margin-left:20px;display: flex;justify-content: flex-start;align-items: center;" @change="changLogin">
                            <label class="middlePage"><input  type="radio" name="radio1" value="1" :checked='isLogin=="1"' />是</label>
                            <label class="middlePage"><input  type="radio" name="radio1" value="2" :checked='isLogin=="0"'/>否</label>
                        </div>
                    </div>
                    <div class="ruleCro">
                        <span class="lableText">展示逻辑</span>
                        <div style="margin-left:20px;display: flex;justify-content: flex-start;align-items: center;" @change="showLogic">
                            <label class="middlePage"><input  type="radio" name="radio2" value="0" />打开即展示</label>
                            <label class="middlePage"><input  type="radio" name="radio2" value="4" />每隔四小时弹</label>
                            <label class="middlePage"><input  type="radio" name="radio2" value="-1" />点击后不弹</label>
                        </div>
                    </div>
                    <div class="ruleCro">
                        <span class="lableText">展示对象</span>
                        <div style="margin-left:20px;background-color: #d6d6d6;padding:5px 15px;box-sizing: border-box;border-radius: 5px;">
                            <div style="display: flex;justify-content: flex-start;align-items: center;margin:10px 0;">
                                <span class="grade">购物等级</span>
                                <div style="display: flex;justify-content: flex-start;align-items: center;" @change="ShoppingGrade">
                                    <label class="middlePage"><input  type="checkbox" name="checkbox3" value="all" />全部</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio3" value="1" :checked='shopping.value1=="1"'/>会员</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio3" value="2" :checked='shopping.value2=="2"'/>团长</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio3" value="3" :checked='shopping.value3=="3"'/>总监</label>
                                </div>
                            </div>
                            <div style="display: flex;justify-content: flex-start;align-items: center;margin:10px 0;">
                                <span class="grade">生活等级</span>
                                <div style="display: flex;justify-content: flex-start;align-items: center;" @change="LivingClass">
                                    <label class="middlePage"><input  type="checkbox" name="checkbox4" value="all" />全部</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio4" value="4" :checked='living.value4=="4"' />中级达人</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio4" value="5" :checked='living.value5=="5"' />高级达人</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio4" value="6" :checked='living.value6=="6"' />超级达人</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-group">
                <span class="totalS">当前状态</span>
                <!-- <div class="statusBtn">待发布</div> -->
                <input type="text" class="statusBtn" disabled='true' :value="state==0?'待发布':state==1?'发布中':'已下架'">
            </div>
            <div class="footerBtn">
                <button class="footerCancel" @click="bannerCancel">取消</button>
                <button class="footerSave" @click="preservationBtn">保存</button>
            </div>
        </div>
        <div class="detail-data-box" v-if="isLook">
            <h5 style="margin-bottom: 20px;">查看滚动条</h5>
            <div class="search-group">
                <span class="totalS">滚动条名称</span>
                <span class="information">{{lookMessgeData.name}}</span>
            </div>
            <div class="search-group">
                <span class="totalS">展示文案</span>
                <span class="information">{{lookMessgeData.data}}</span>
            </div>
            <div class="search-group">
                <span class="totalS">生效时间</span>
                <span class="to">{{lookMessgeData['valid_time']}}</span>
            </div>
            <div class="search-group">
                <span class="totalS">展示规则</span>
                <div class="rule">
                    <div class="ruleCro">
                        <span class="lableText">是否要求用户登录</span>
                        <span class="information">{{lookMessgeData['is_login']=='1'?'是':'否'}}</span>
                    </div>
                    <div class="ruleCro">
                        <span class="lableText">展示逻辑</span>
                        <span class="information">暂时没有数据</span>
                    </div>
                    <div class="ruleCro">
                        <span class="lableText">展示对象</span>
                        <div style="margin-left:20px;background-color: #d6d6d6;padding:5px 15px;box-sizing: border-box;border-radius: 5px;">
                            <div style="display: flex;justify-content: flex-start;align-items: center;margin:10px 0;">
                                <span class="grade">购物等级</span>
                                <span class="information" v-for="(item,index) in popData.shoppArr" :key="index">{{item}}</span>
                            </div>
                            <div style="display: flex;justify-content: flex-start;align-items: center;margin:10px 0;">
                                <span class="grade">生活等级</span>
                                <span class="information" v-for="(item,index) in popData.liveArr" :key="index">{{item}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-group">
                <span class="totalS">当前状态</span>
                <span class="information color">{{lookMessgeData.status}}</span>
            </div>
            <button class="sure" @click="sureBtn">确定</button>
        </div>
        <!-- 提示框 -->
        <operation-tip :tipsText='tipsText' :showTips='showTips' @cancelEvent='cancelFn' @determineEvent='determineFn'></operation-tip>
    </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import operationTips from '@/components/content/operationTips.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    props:['lookMessgeData','isLook','editData'],
    components: {
        'flat-picker': flatPicker,
        'operation-tip':operationTips,
    },
    data(){
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return{
            createTimeBegin: '',
            createTimeEnd: '',
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            tipsText:'',
            showTips:false,
            id:'',
            scrollNameL:'',//滚动条名称
            textareaText:'',//展示文案
            isLogin:'',//是否登录
            timeLag:"",//展示逻辑
            state:0,//状态,0待发布 1发布中 2已下架
            popObj:[],//滚动条
            popData:{
                shoppArr:[],
                liveArr:[]
            },
            shopping:{
                value1:'',
                value2:'',
                value3:''
            },
            living:{
                value4:'',
                value5:'',
                value6:''
            },
        }
    },
    mounted(){
        this.lookUpMessgeFn()
        this.editScroll()
        // console.log(this.isLook,this.editData)
    },
    methods:{
        bannerCancel(){//取消按钮提示
            this.tipsText = '是否离开当前页面？您编辑的内容将不会保存!'
            this.showTips = true
        },
        cancelFn(){
            this.showTips = false
        },
        determineFn(e){
            this.showTips = false
            this.$emit('goBackPage')
        },
        scrollPrompt(){//滚动条添加/修改
            console.log("保存按钮")
            const pramsData = {
                id:this.id,
                name:this.scrollNameL,
                data:this.textareaText,
                status:this.state,
                'is_login':this.isLogin,
                'pop_obj':this.popObj.join(','),
                'time_lag':this.timeLag,
                'start_time':this.createTimeBegin,
                'end_time':this.createTimeEnd
            }
            this.showLoading();
            request({
                url:setting.urls.scrollBarAdd,
                method:'post',
                data:qs.stringify(pramsData)
            }).then(res=>{
                if(res.status == 200){
                    console.log(res,"添加成功")
                }
            }).catch((res) => {
                this.alert('滚动条添加修改请求失败')
            }).then((res) => {
                this.hideLoading()
            })
        },
        preservationBtn(){//保存按钮
            // console.log("保存了",this.popObj)
            this.scrollPrompt()
            this.$emit('goBackPage')
        },
        changLogin(e){//选择是否登录,
            this.isLogin = e.target.value;
        },
        showLogic(e){//展示逻辑,0时，每次登陆就弹   -1点了就不弹  4 4小时弹
            this.timeLag = e.target.value;
        },
        ShoppingGrade(e){//购物等级,1会员,2团长,3总监
            if(e.target.value == 'all'){
                if(e.target.checked){
                    const checkboxs = document.getElementsByName('radio3');
                    for (let i = 0; i < checkboxs.length; i++) {
                        checkboxs[i].checked = true;
                        if(this.popObj.indexOf(checkboxs[i].value) == -1){
                            this.popObj.push(checkboxs[i].value)
                        }
                    }
                }else{
                    const checkboxs = document.getElementsByName('radio3');
                    for (let i = 0; i < checkboxs.length; i++) {
                        checkboxs[i].checked = false;
                        this.popObj.splice(this.popObj.indexOf(checkboxs[i].value), 1)
                    }
                }
            }else{
                if(e.target.checked){
                    if(this.popObj.indexOf(e.target.value) == -1){
                        this.popObj.push(e.target.value)
                    }
                }else{
                    this.popObj.splice(this.popObj.indexOf(e.target.value), 1)
                }
            }
        },
        LivingClass(e){//生活等级，4中级,5高级,6超级
            if(e.target.value == 'all'){
                if(e.target.checked){
                    const checkboxs = document.getElementsByName('radio4');
                    for (let i = 0; i < checkboxs.length; i++) {
                        checkboxs[i].checked = true;
                        if(this.popObj.indexOf(checkboxs[i].value) == -1){
                            this.popObj.push(checkboxs[i].value)
                        }
                    }
                }else{
                    const checkboxs = document.getElementsByName('radio4');
                    for (let i = 0; i < checkboxs.length; i++) {
                        checkboxs[i].checked = false;
                        this.popObj.splice(this.popObj.indexOf(checkboxs[i].value), 1)
                    }
                }
            }else{
                if(e.target.checked){
                    if(this.popObj.indexOf(e.target.value) == -1){
                        this.popObj.push(e.target.value)
                    }
                }else{
                    this.popObj.splice(this.popObj.indexOf(e.target.value), 1)
                }
            }
        },
        lookUpMessgeFn(){
            if(this.lookMessgeData){
                const dataArr = this.lookMessgeData['pop_obj'].split(',');
                const shoppArr = [];
                const liveArr = [];
                for (let v = 0; v < dataArr.length; v++) {
                    switch (dataArr[v]) {
                        case '1':
                            shoppArr.push('会员')
                            break;
                        case '2':
                            shoppArr.push('团长')
                            break;
                        case '3':
                            shoppArr.push('总监')
                            break;
                        case '4':
                            liveArr.push('中级')
                            break;
                        case '5':
                            liveArr.push('高级')
                            break;
                        case '6':
                            liveArr.push('超级')
                            break;
                        default:
                            break;
                    }  
                }
                this.popData.shoppArr = shoppArr;
                this.popData.liveArr = liveArr;
            }
        },
        sureBtn(){//查看信息点击确定按钮
            this.$emit('goBackPage',false)
        },
        editScroll(){//编辑信息
            console.log(this.editData)
            if(this.editData){
                this.scrollNameL = this.editData.name
                this.textareaText = this.editData.data
                switch (this.editData.status) {
                    case '待发布':
                        this.state = 0
                        break;
                    case '发布中':
                        this.state = 1
                        break;
                    case '已下架':
                        this.state = 2
                        break;
                    default:
                        break;
                }
                this.createTimeBegin = this.editData['valid_time'].split('至')[0]
                this.createTimeEnd = this.editData['valid_time'].split('至')[1]
                this.isLogin = this.editData['is_login']
                this.id = this.editData.id
                
                const popDataArr = this.editData['pop_obj'].split(',')
                for (let j = 0; j < popDataArr.length; j++) {
                    this.popObj.push(popDataArr[j])
                    switch (popDataArr[j]) {
                        case '1':
                            this.shopping.value1 = popDataArr[j]
                            break;
                        case '2':
                            this.shopping.value2 = popDataArr[j]
                            break;
                        case '3':
                            this.shopping.value3 = popDataArr[j]
                            break;
                        case '4':
                            this.living.value4 = popDataArr[j]
                            break;
                        case '5':
                            this.living.value5 = popDataArr[j]
                            break;
                        case '6':
                            this.living.value6 = popDataArr[j]
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
.detail-data-box,.detail-container{padding: 0;overflow-y: scroll;overflow:-Scroll;overflow-y:hidden}
.search-group{display: flex;justify-content: flex-start;align-items: center;margin: 10px 0;}
.totalS{color: #666666;font-size: .5375rem;line-height: 1rem;position: relative;}
.totalS::after{position: absolute;content: '*';color: red;top: 2px;right: -8px;width: 5px;height: 5px;}
.textarea{width: 20rem;height: 5rem;border: 1px solid #eeeeee;margin-left: 20px;display: block;padding: 3px 5px;color: #666666;font-size: .5375rem;}
.search-group>input{width: 15rem;margin-left: 20px;}
.search-time-picker{width: 5rem!important;}
.to{color: #666666;font-size: .5375rem;line-height: 1rem;margin-left: 15px;}
.statusBtn{font-size: .537rem;color: red;margin-left: 20px;border: none;background-color: transparent;}


.footerBtn{display: flex;justify-content: space-around;padding: 20px 10rem;box-sizing: border-box;}
.footerCancel{width: 5rem;height: 1.5rem;background-color: #b4b3b3;text-align: center;line-height: 1.5rem;color: #333333;font-size: 14px;border-radius: 6px;cursor: pointer;}
.footerSave{width: 5rem;height: 1.5rem;background-color: #4880EA;text-align: center;line-height: 1.5rem;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;}

/* 展示规则 */
.rule{padding: 10px 20px;border: 1px solid #d6d6d6;border-radius: 10px;margin-left: 20px;}
.ruleCro{display: flex;align-items: center;margin: 15px 0;}
.lableText{color: #666666;font-size: .5375rem;position: relative;}
.middlePage{color: #666666;font-size: .5375rem;margin: 0 10px;display: flex;align-items: center;cursor: pointer;}
.grade{color: #666666;font-size: .5375rem;}
.lableText::after{position: absolute;content: '*';color: red;top: 2px;right: -8px;width: 5px;height: 5px;}
/* 查看信息 */
.information{color: #666666;font-size: .5375rem;margin-left: 20px;}
.color{color: red}
.sure{width: 5rem;height: 1.5rem;background-color: #4880EA;text-align: center;line-height: 1.5rem;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;margin: 0 auto;display: block;margin-top: 40px;}
</style>