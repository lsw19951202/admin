<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <h5 style="margin-bottom: 20px;" v-show="!isLook">{{textValue}}弹窗</h5>
            <h5 style="margin-bottom: 20px;" v-show="isLook">查看弹窗</h5>
            <div class="search-group">
                <span class="totalS">标题</span>
                <input type="text" placeholder="请输入" v-model="newBuildTitle" :disabled='isLook'>
            </div>
            <div class="search-group">
                <span class="desc">描述</span>
                <textarea cols="" rows="2" class="textarea" v-model="descText" :disabled='isLook' placeholder="描述该中间页面背景/用途，仅作为内部说明，不会展示到APP界面"></textarea>
            </div>
            <div class="search-group">
                <span class="totalS">生效时间</span>
                <flat-picker class="search-time-picker" :config="dateConfig" :disabled='isLook' v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                <span class="to">至</span>
                <flat-picker class="search-time-picker" :config="dateConfig" :disabled='isLook' v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
            </div>
            <div class="search-group">
                <span class="totalS">图片上传</span>
                <div class="upload">
                    <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;"  v-show="!isLook">
                        <div class="imgSize">限宽915px</div>
                        <input class="action-btn" type="button" value="上传+" @click="selectImg">
                    </div>
                    <img style="width:100px; height: 40px;cursor: pointer;margin-left:20px;" :src="imgUrl" alt="">
                </div>
                <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                    <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
                </form>
            </div>
            <div class="search-group">
                <span class="totalS">弹窗规则</span>
                <div style="padding:10px 15px;border: 1px solid #D9D9D9;">
                    <div class="search-group">
                        <span class="totalS isLogin">是否要求用户登录</span>
                        <div style="display: flex;justify-content: flex-start;align-items: center;" @change="chooseIsLogin">
                            <label class="middlePage"><input  type="radio" name="radio1" value="1" :checked='isLogin=="1"' :disabled='isLook' />是</label>
                            <label class="middlePage"><input  type="radio" name="radio1" value="0" :checked='isLogin=="0"' :disabled='isLook' />否</label>
                        </div>
                    </div>
                    <div class="search-group">
                        <span class="totalS isLogin">弹窗逻辑</span>
                        <div style="display: flex;justify-content: flex-start;align-items: center;" @change="PopUpLogic">
                            <label class="middlePage"><input  type="radio" name="radio2" value="0" :disabled='isLook' :checked="popupLj=='0'" />打开即弹</label>
                            <label class="middlePage"><input  type="radio" name="radio2" value="4" :disabled='isLook' :checked="popupLj=='4'"/>每隔四小时弹</label>
                            <label class="middlePage"><input  type="radio" name="radio2" value="-1" :disabled='isLook' :checked="popupLj=='-1'"/>点击后不弹</label>
                        </div>
                    </div>
                    <div class="search-group">
                        <span class="totalS isLogin">弹窗顺序</span>
                        <input type="text" class="search-time-picker" v-model="popupSort" :disabled='isLook'>
                        <span class="to">如果有两个以上弹窗手动填写的顺序一样，实际顺序将按照时间顺序排序。</span>
                    </div>
                    <div class="search-group">
                        <span class="totalS isLogin">弹窗对象</span>
                        <div style="background-color: #d6d6d6;padding:5px 15px;box-sizing: border-box;border-radius: 5px;">
                            <div style="display: flex;justify-content: flex-start;align-items: center;margin:10px 0;">
                                <span class="middlePage">购物等级</span>
                                <div style="display: flex;justify-content: flex-start;align-items: center;" @change="ShoppingGrade">
                                    <label class="middlePage"><input  type="checkbox" name="checkbox3" value="all" :disabled='isLook' />全部</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio3" value="1" :checked='shopping.value1=="1"' :disabled='isLook' />会员</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio3" value="2" :checked='shopping.value2=="2"' :disabled='isLook' />团长</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio3" value="3" :checked='shopping.value3=="3"' :disabled='isLook' />总监</label>
                                </div>
                            </div>
                            <div style="display: flex;justify-content: flex-start;align-items: center;margin:10px 0;">
                                <span class="middlePage">生活等级</span>
                                <div style="display: flex;justify-content: flex-start;align-items: center;" @change="LivingClass" >
                                    <label class="middlePage"><input  type="checkbox" name="checkbox4" value="all" :disabled='isLook' />全部</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio4" value="4" :checked='living.value4=="4"' :disabled='isLook' />中级达人</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio4" value="5" :checked='living.value5=="5"' :disabled='isLook' />高级达人</label>
                                    <label class="middlePage"><input  type="checkbox" name="radio4" value="6" :checked='living.value6=="6"' :disabled='isLook' />超级达人</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-group">
                <span class="totalS">是否有跳转链接</span>
                <div style="display: flex;justify-content: flex-start;align-items: center;" @change="changeIsJump">
                    <label class="middlePage"><input  type="radio" name="radio5" value="1" :checked='isJumpLink' :disabled='isLook' />是</label>
                    <label class="middlePage"><input  type="radio" name="radio5" value="2" :checked='!isJumpLink' :disabled='isLook' />否</label>
                </div>
            </div>
            <div class="search-group" v-if="isJumpLink">
                <span class="totalS">是否有中间页</span>
                <div style="display: flex;justify-content: flex-start;align-items: center;" @change="changeRadio">
                    <label class="middlePage"><input  type="radio" name="radio6" value="1" :checked='isMiddlePage=="1"' :disabled='isLook'/>有中间页</label>
                    <label class="middlePage"><input  type="radio" name="radio6" value="0" :checked='isMiddlePage=="0"' :disabled='isLook'/>无中间页</label>
                    <input type="text" placeholder="请填写链接" class="linkUrl" v-if="isMiddlePage=='0'" v-model="jumpLink">
                </div>
            </div>
            <div class="configuration" v-if="isMiddlePage=='1'">
                <!-- 这里是中间页组件 -->
                <templete :editable='editable' :pageId="lookMessge['page_id']"></templete>
            </div>
            <div class="search-group">
                <span class="desc">当前状态</span>
                <input type="text" class="statusBtn" disabled :value="state=='0'?'待发布':state=='1'?'发布中':'已下架'">
            </div>
            <div class="footerBtn" v-show="!isLook">
                <button class="footerCancel" @click="cancelBtnEvent">取消</button>
                <button class="footerSave" @click="saveBtnEvent">保存</button>
            </div>
            <div v-show="isLook" style="display:flex;justify-content: center;">
                <button class="footerSave" @click.prevent.stop="cancelBtnEvent">确定</button>
            </div>
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
import templete from '@/components/content/templete.vue'
import operationTips from '@/components/content/operationTips.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    props:['isLook','lookMessge','textValue'],
    components: {
        'flat-picker': flatPicker,
        'templete':templete,
        'operation-tip':operationTips,
    },
    data(){
        const now = new Date()
        let nStr = ''
        nStr += now.getFullYear() + '-'
        nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
        nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
        return{
            tipsText:'',
            showTips:false,
            dateConfig: {
                'time_24hr': true,
                maxDate: nStr,
                locale: Mandarin
            },
            createTimeBegin:'',
            createTimeEnd:'',
            popupId:'',//商品id，修改时传
            newBuildTitle:'',//标题
            descText:'',//描述
            imgUrl:'',//图片
            isLogin:'1',//是否要求登录，默认选择是，1 是 0否
            popupSort:'',//弹窗顺序
            popupLj:'',//弹窗逻辑
            popObj:[],//弹窗对象，1会员,2团长,3总监,4中级,5高级,6超级
            pageId:0,//中间页，0无中间页
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
            isJumpLink:false,//是否有跳转链接,默认选择否
            state:'0',//状态,0待发布 1发布中 2已下架
            isMiddlePage:'',
            jumpLink:'',//跳转链接
            editable:true,//中间页是否可编辑
        }
    },
    created(){
        this.lookMessgeFn()
    },
    methods:{
        lookMessgeFn(){//查看信息
            if(this.lookMessge){
                if(this.lookMessge['page_id'] != '0'){
                    this.isMiddlePage = 1
                }else{
                    this.isMiddlePage = 0
                }
                if(this.isLook){
                    this.editable = false
                }else{
                    this.editable = true
                }
                if(this.lookMessge.url){
                    this.isJumpLink = true
                    this.jumpLink = this.lookMessge.url
                }else{
                    this.isJumpLink = false
                }
                this.newBuildTitle = this.lookMessge.name
                this.descText = this.lookMessge.desc
                this.createTimeBegin = this.lookMessge['valid_time'].split('至')[0]
                this.createTimeEnd = this.lookMessge['valid_time'].split('至')[1]
                this.imgUrl = this.lookMessge.img
                this.isLogin = this.lookMessge['is_login']
                this.popupLj = this.lookMessge['time_lag']
                this.popupSort = this.lookMessge.sort
                this.popupId = this.lookMessge.id
                if(this.lookMessge['pop_obj']){
                    const popDataArr = this.lookMessge['pop_obj'].split(',')
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
                switch (this.lookMessge.status) {
                    case '发布中':
                        this.state = '1'
                        break;
                    case '已下架':
                        this.state = '2'
                        break;
                    default:
                        this.state = '0'
                        break;
                }
            }
        },
        selectImg(){//选择图片
            this.$refs.files.click()
        },
        uploadImage(){//上传图片
            return new Promise((resolve, reject) => {
                const tmpImg = document.createElement('img')
                tmpImg.onload = () => {
                    const formData = new FormData(this.$refs.fileForm)
                    request({
                        url: setting.urls.uploadImage,
                        method: 'post',
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(rst => {
                        console.log(rst,"上传图片")
                        if(rst.status == 200 && rst.data.code == 200){
                            const imgUrl = (rst.data.data.url.indexOf('http://') == -1 ? 'http://' : '') + rst.data.data.url
                            resolve(imgUrl)
                        }else{
                            this.alert('上传图片失败')
                            reject()
                        }
                    }).catch(e => {
                        this.alert('上传图片失败')
                        reject()
                    }).then(() => {
                        this.$refs.files.value = ''
                    })
                }
                // 独取图片文件
                const fr = new FileReader()
                fr.onload = (e) => {
                    tmpImg.src = e.target.result
                }
                fr.readAsDataURL(this.$refs.files.files[0])
            }).then(url => {
                if(url){
                    this.imgUrl = url
                }
            })
        },
        chooseIsLogin(e){//是否登录
            this.isLogin = e.target.value
        },
        PopUpLogic(e){//弹窗逻辑
            this.popupLj = e.target.value
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
                    console.log(this.popObj)
                }else{
                    const checkboxs = document.getElementsByName('radio3');
                    for (let i = 0; i < checkboxs.length; i++) {
                        checkboxs[i].checked = false;
                        this.popObj.splice(this.popObj.indexOf(checkboxs[i].value), 1)
                    }
                    console.log(this.popObj)
                }
            }else{
                if(e.target.checked){
                    if(this.popObj.indexOf(e.target.value) == -1){
                        this.popObj.push(e.target.value)
                    }
                    console.log(this.popObj)
                }else{
                    this.popObj.splice(this.popObj.indexOf(e.target.value), 1)
                    console.log(this.popObj)
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
                    console.log(this.popObj)
                }else{
                    const checkboxs = document.getElementsByName('radio4');
                    for (let i = 0; i < checkboxs.length; i++) {
                        checkboxs[i].checked = false;
                        this.popObj.splice(this.popObj.indexOf(checkboxs[i].value), 1)
                    }
                    console.log(this.popObj)
                }
            }else{
                if(e.target.checked){
                    if(this.popObj.indexOf(e.target.value) == -1){
                        this.popObj.push(e.target.value)
                        console.log(this.popObj)
                    }
                }else{
                    this.popObj.splice(this.popObj.indexOf(e.target.value), 1)
                    console.log(this.popObj)
                }
            }
        },
        changeIsJump(){//是否有跳转链接
            this.isJumpLink = !this.isJumpLink
        },
        changeRadio(e){//选择是否有中间页,0表示无中间页
            this.isMiddlePage = e.target.value;
        },
        cancelBtnEvent(){//取消按钮
            this.tipsText = '是否离开当前页面？您编辑的内容将不会保存!'
            this.showTips = true
        },
        saveBtnEvent(){//保存按钮
            console.log("点击了保存按钮")
            console.log(this.$children)
            const childNode = this.$children
            if(this.isMiddlePage==1){
                let returnDate
                for (let v = 0; v < childNode.length; v++) {
                    console.log(childNode[v].$el.className)
                    if(childNode[v].$el.className == 'pageEditor'){
                        returnDate = childNode[v].getPageData()
                    }
                }
                // if(this.isEdit){
                //     returnDate = this.$children[3].getPageData()
                // }else{
                //     returnDate = this.$children[2].getPageData()
                // }
                // // const returnDate = this.$children[3].getPageData()
                if(typeof returnDate == 'string'){
                    this.pageId = returnDate
                    this.popUpAdd()
                }else{
                    returnDate.then(res=>{
                        console.log(res,"新建的pageId",returnDate)
                        this.pageId = res.pageId
                        this.jumpLink = res.pageUrl
                        console.log(this.jumpLink)
                        this.popUpAdd()
                    })
                }
            }else{
                this.popUpAdd()
            }
            this.$emit('goBackPage')
        },
        cancelFn(){
            this.showTips = false
        },
        determineFn(){
            this.showTips = false
            this.$emit('goBackPage')
        },
        popUpAdd(){//新建修改
            const requestData = {
                'popup_id':this.popupId,
                name:this.newBuildTitle,
                img:this.imgUrl,
                sort:this.popupSort,
                desc:this.descText,
                'page_id':this.pageId,
                url:this.jumpLink,
                status:this.state,
                'start_time':this.createTimeBegin,
                'end_time':this.createTimeEnd,
                'is_login':this.isLogin,
                'pop_obj':this.popObj.join(','),
                'time_lag':this.popupLj
            }
            console.log(requestData)
            this.showLoading()
            request({
                url: setting.urls.popupAdd,
                method: 'post',
                data:qs.stringify(requestData)
            }).then(res=>{
                if(res.status == 200 && res.data.code == 200){
                    this.alert(res.data.message+'**')
                }else{
                    this.alert(res.data.message+'***')
                }
            }).catch(res=>{
                this.alert("添加修改失败")
            }).then(res=>{
                this.hideLoading()
            })
        }
    }
}
</script>

<style scoped>
.detail-data-box,.detail-container{overflow-y: scroll;margin: 0;}
.search-group{display: flex;margin: 10px 0;}
.search-group>input{width: 10rem;}
.totalS{color: #666666;font-size: .475rem;line-height: 1rem;position: relative;margin-right: 20px;display: block;width: 110px;text-align: right;}
.totalS::after{position: absolute;content: '*';color: red;top: 2px;right: -8px;width: 5px;height: 5px;}
.desc{color: #666666;font-size: .475rem;line-height: 1rem;margin-right: 20px;display: block;width: 115px;text-align: right;}
.textarea{width: 10rem;height: 1.5rem;border: 1px solid #D9D9D9;}
.search-time-picker{width: 5rem!important;}
.to{color: #666666;font-size: .475rem;line-height: 1rem;margin-left: 15px;}
.upload{margin-left: 20px;display: flex;align-items: center;}
.upload>label{font-size: 14px;color: #dd1010;width: 3rem;height: 1.3rem;line-height: 1.3rem;text-align: center;background-color: #4880EA;display: block;border-radius: 5px;cursor: pointer;}
.action-btn{height: 1.2rem;border: none;position: relative;}
.action-btn:focus{outline:0;} /*去掉按钮点击时的边框*/ 
.imgSize{font-size: 0.4rem;color: red;}
.isLogin{width: 130px;text-align: right;}
.middlePage{font-size: .47rem;margin-right: 10px;cursor: pointer;}
.linkUrl{margin-left: 5px;width: 15rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;}
.configuration{width: 100%;padding-left: 3rem;box-sizing: border-box;}
.statusBtn{border: none;background-color: transparent;font-size: .537rem;color: red;}
.footerBtn{display: flex;justify-content: space-around;padding: 20px 10rem;box-sizing: border-box;}
.footerCancel{width: 5rem;height: 1.5rem;background-color: #b4b3b3;text-align: center;line-height: 1.5rem;color: #333333;font-size: 14px;border-radius: 6px;cursor: pointer;}
.footerSave{width: 5rem;height: 1.5rem;background-color: #4880EA;text-align: center;line-height: 1.5rem;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;}

</style>