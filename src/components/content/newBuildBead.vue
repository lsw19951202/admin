<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <h5 style="margin-bottom: 20px;">新建豆腐块</h5>
            <div class="search-group">
                <span class="totalS">展示顺序</span>
                <input type="text" placeholder="请输入" v-model="sortNum" :disabled='isLook'>
            </div>
            <div class="search-group">
                <span class="totalS">生效时间</span>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间" :disabled='isLook'></flat-picker>
                <span class="to">至</span>
                <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间" :disabled='isLook'></flat-picker>
            </div>
            <div style="display:flex;width:100%;">
                <div class="tofoLeft">
                    <h6>左侧豆腐块</h6>
                    <div class="search-group">
                        <span class="totalS widthTofo">豆腐块名称</span>
                        <input type="text" placeholder="请输入" v-model="tofoNameL" :disabled='isLook'>
                    </div>
                    <div class="search-group">
                        <span class="totalS widthTofo">豆腐块背景色</span>
                        <input type="text" placeholder="请输入" v-model="leftBgcolor" :disabled='isLook'>
                    </div>
                    <div class="other">
                        <span class="widthTofo">更新描述</span>
                        <input type="text" placeholder="请简要描述该banner本次更新情况，仅作为内部说明。将不会展示到APP界面。非必填项" v-model="textValueL" :disabled='isLook'>
                    </div>
                    <div class="search-group">
                        <span class="totalS widthTofo">图片上传</span>
                        <div class="upload">
                            <div v-show="!isLook">
                                <div class="imgSize">尺寸:525*216  圆角:15px</div>
                                <input class="action-btn" type="button" value="上传+" @click="selectLeftImg">
                            </div>
                            <img style="width:100px; height: 40px;cursor: pointer;margin-left:20px;" :src="leftImg" alt="">
                        </div>
                        <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                            <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
                        </form>
                    </div>
                    <div class="search-group">
                        <span class="totalS widthTofo">跳转链接</span>
                        <div style="margin-left:20px;display: flex;justify-content: flex-start;align-items: center;" @change.prevent.stop="changeRadioL">
                            <label class="middlePage"><input  type="radio" name="radio1" value="1" :disabled='isLook' :checked='isMiddlePageL=="1"' />有中间页</label>
                            <label class="middlePage"><input  type="radio" name="radio1" value="2" :disabled='isLook' :checked='isMiddlePageL=="2"' />无中间页</label>
                            <input type="text" placeholder="请填写链接" class="linkUrl" v-if="isMiddlePageL=='2'"  v-model="leftJumpUrl">
                        </div>
                    </div>
                    <div class="configuration" v-if="isMiddlePageL=='1'">
                        <templete id="leftTem" :editable='leftEdit' :pageId="looktofoData['left_page_id']"></templete>
                    </div>
                </div>
                <div class="tofoRight">
                    <h6>右侧豆腐块</h6>
                    <div class="search-group">
                        <span class="totalS widthTofo">豆腐块名称</span>
                        <input type="text" placeholder="请输入" v-model="tofoNameR" :disabled='isLook'>
                    </div>
                    <div class="search-group">
                        <span class="totalS widthTofo">豆腐块背景色</span>
                        <input type="text" placeholder="请输入" v-model="rightBgcolor" :disabled='isLook'>
                    </div>
                    <div class="other">
                        <span class="widthTofo">更新描述</span>
                        <input type="text" placeholder="请简要描述该banner本次更新情况，仅作为内部说明。将不会展示到APP界面。非必填项" v-model="textValueR" :disabled='isLook'>
                    </div>
                    <div class="search-group">
                        <span class="totalS widthTofo">图片上传</span>
                        <div class="upload">
                            <div v-show="!isLook">
                                <div class="imgSize">尺寸:525*216  圆角:15px</div>
                                <input class="action-btn" type="button" value="上传+" @click="selectRightImg">
                            </div>
                            <img style="width:100px; height: 40px;cursor: pointer;margin-left:20px;" :src="rightImg" alt="">
                        </div>
                        <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                            <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
                        </form>
                    </div>
                    <div class="search-group">
                        <span class="totalS widthTofo">跳转链接</span>
                        <div style="margin-left:20px;display: flex;justify-content: flex-start;align-items: center;" @change.prevent.stop="changeRadioR">
                            <label class="middlePage"><input  type="radio" name="radio2" value="3" :disabled='isLook' :checked='isMiddlePageR=="3"' />有中间页</label>
                            <label class="middlePage"><input  type="radio" name="radio2" value="4" :disabled='isLook' :checked='isMiddlePageR=="4"' />无中间页</label>
                            <input type="text" placeholder="请填写链接" class="linkUrl" v-if="isMiddlePageR=='4'" v-model="rightJumpUrl">
                        </div>
                    </div>
                    <div class="configuration" v-if="isMiddlePageR=='3'">
                        <templete id="rightTem" :editable='rightEdit' :pageId="looktofoData['right_page_id']"></templete>
                    </div>
                </div>
            </div>
            <div class="search-group">
                <span class="totalS">当前状态</span>
                <input class="statusBtn" type="text" :disabled='isLook' :value="state=='0'?'待发布':state=='1'?'发布中':'已下架'">
            </div>
            <div class="footerBtn">
                <button class="footerCancel" @click.prevent.stop="bannerCancel">取消</button>
                <button class="footerSave" @click.prevent.stop="saveBtnFn">保存</button>
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
import operationTips from '@/components/content/operationTips.vue'
import templete from '@/components/content/templete.vue'
export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
    props:['looktofoData','isLook'],
    components: {
        'flat-picker': flatPicker,
        'operation-tip':operationTips,
        'templete':templete
    },
    data(){
        return{
            createTimeBegin: '',
            createTimeEnd: '',
            dateConfig: {
                dateFormat: 'Y-m-d H:i',
                enableTime: true,
                'time_24hr': true,
                locale: Mandarin
            },
            tipsText:'',
            showTips:false,
            showOrder: {
                label: '',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: '0',
                    text: '第一'
                }, {
                    value: '1',
                    text: '第二'
                }, {
                    value: '2',
                    text: '第三'
                }]
            },
            imgType:'left',
            sortNum:'',//展示顺序
            tofoNameL:'',//左侧豆腐块名称
            leftBgcolor:'',//左侧背景色
            textValueL:'',//左侧更新描述
            isMiddlePageL:'',//左侧豆腐块是否有中间页
            leftImg:'',//左侧图片地址
            leftEdit:true,//左侧中间页是否编辑
            leftId:'',//左侧Id，修改时传
            leftPageId:'0',//左侧中间页Id,0无中间页
            leftJumpUrl:'',//左侧是否有跳转链接，1是   0中间页
            tofoNameR:'',//右侧豆腐块名称
            rightBgcolor:'',//右侧背景色
            textValueR:'',//右侧豆腐块更新描述
            isMiddlePageR:'',//右侧豆腐块是否有中间页
            rightImg:'',//右侧图片地址
            rightEdit:true,//右侧中间页是否编辑
            rightId:'',//右侧id，修改时传
            rightPageId:0,//右侧中间页id,0无中间页
            rightJumpUrl:'',//右侧是否有跳转链接，1是   0中间页
            state:'0',//状态,0待发布 1发布中 2已下架
        }
    },
    created(){
        this.lookTofoData()
    },
    methods:{
        bannerCancel(){//取消按钮提示
            this.tipsText = '是否离开当前页面？您编辑的内容将不会保存!'
            this.showTips = true
        },
        changeRadioL(e){
            this.isMiddlePageL = e.target.value;
            console.log(this.isMiddlePageL)
        },
        changeRadioR(e){
            this.isMiddlePageR = e.target.value;
            console.log(this.isMiddlePageR)
        },
        cancelFn(){
            this.showTips = false
        },
        determineFn(){
            this.showTips = false
            this.$emit('goBackPage')
        },
        selectLeftImg(){//选择左侧图片
            this.imgType = 'left'
            this.$refs.files.click()
        },
        selectRightImg(){//选择右侧图片
            this.imgType = 'right'
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
                    if(this.imgType == 'left'){
                        this.leftImg = url
                    }else if(this.imgType == 'right'){
                        this.rightImg = url
                    }
                }
            })
        },
        saveBtnFn(){//保存按钮
            console.log(this.$children)
            const childNode = this.$children
            if(this.isMiddlePageL == '1'){
                let returnDateL
                for (let v = 0; v < childNode.length; v++) {
                    if(childNode[v].$el.id.indexOf('leftTem') >= 0 ){
                        returnDateL = childNode[v].getPageData()
                    }
                }
                console.log(returnDateL,"左侧")
                if(typeof returnDateL == 'string'){
                    this.leftPageId = returnDateL
                    this.newBuildBeadRequest()
                }else{
                    returnDateL.then(res=>{
                        this.leftPageId = res.pageId
                        this.leftJumpUrl = res.pageUrl
                        this.newBuildBeadRequest()
                    })
                }
            }else{
                this.newBuildBeadRequest()
            }
            if(this.isMiddlePageR == '3'){
                let returnDateR
                for (let v = 0; v < childNode.length; v++) {
                    if(childNode[v].$el.id.indexOf('rightTem') >= 0 ){
                        returnDateR = childNode[v].getPageData()
                    }
                }
                console.log(returnDateR,"右侧")
                if(typeof returnDateR == 'string'){
                    this.rightPageId = returnDateR
                    this.newBuildBeadRequest()
                }else{
                    returnDateR.then(res=>{
                        this.rightPageId = res.pageId
                        this.rightJumpUrl = res.pageUrl
                        this.newBuildBeadRequest()
                    })
                }

            }else{
                this.newBuildBeadRequest()
            }
            this.$emit('goBackPage')
        },
        newBuildBeadRequest(){//豆腐块添加修改
            const parmsaData = {
                sort:this.sortNum,
                type:'card',
                'start_time':this.createTimeBegin,
                'end_time':this.createTimeEnd,
                'left_tofu_id':this.leftId,
                'left_name':this.tofoNameL,
                'left_description':this.textValueL,
                'left_img':this.leftImg,
                'left_page_id':this.leftPageId,
                'left_url':this.leftJumpUrl,
                'left_backgroundColor':this.leftBgcolor,
                'right_tofu_id':this.rightId,
                'right_name':this.tofoNameR,
                'right_backgroundColor':this.rightBgcolor,
                'right_description':this.textValueR,
                'right_img':this.rightImg,
                'right_page_id':this.rightPageId,
                'right_url':this.rightJumpUrl
            }
            console.log(parmsaData,"传参数")
            this.showLoading()
            request({
                url: setting.urls.tofuAdd,
                method: 'post',
                data:qs.stringify(parmsaData)
            }).then(res=>{
                console.log(res,"豆腐块")
                if(res.status == 200 && res.data.code == 200){
                    this.alert(res.data.message)
                }else{
                    this.alert(res.data.message)
                }
            }).catch(res=>{
                this.alert("新建修改失败")
            }).then(res=>{
                this.hideLoading()
            })
        },
        lookTofoData(){//查看信息
            if(this.looktofoData){
                this.sortNum = this.looktofoData['sort_key']
                this.createTimeBegin = this.looktofoData['start_time']
                this.createTimeEnd = this.looktofoData['end_time']
                this.tofoNameL = this.looktofoData['left_name']
                this.leftBgcolor = this.looktofoData['left_backgroundColor']
                this.textValueL = this.looktofoData['left_description']
                this.leftImg = this.looktofoData['left_img']
                this.leftPageId = this.looktofoData['left_page_id']==null?'0':this.looktofoData['left_page_id']
                if(this.looktofoData['left_page_id'] != '0' && this.looktofoData['left_page_id'] != null){
                    this.isMiddlePageL = '1'
                }else{
                    this.isMiddlePageL = '2'
                }
                if(this.isLook){
                    this.leftEdit = false
                    this.rightEdit = false
                }else{
                    this.leftEdit = true
                    this.rightEdit = true
                }
                this.leftJumpUrl = this.looktofoData['left_target']
                this.leftId = this.looktofoData['left_id']
                this.tofoNameR = this.looktofoData['right_name']
                this.rightBgcolor = this.looktofoData['right_backgroundColor']
                this.textValueR = this.looktofoData['right_description']
                this.rightImg = this.looktofoData['right_img']
                this.rightPageId = this.looktofoData['right_page_id']==null?'0':this.looktofoData['right_page_id']
                if(this.looktofoData['right_page_id'] != '0' && this.looktofoData['right_page_id'] != null){
                    this.isMiddlePageR = '3'
                }else{
                    this.isMiddlePageR = '4'
                }
                this.rightJumpUrl = this.looktofoData['right_target']
                this.rightId = this.looktofoData['right_id']
                switch (this.looktofoData.status) {
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
        }
    }
}
</script>

<style scoped>
.detail-container{overflow-y: scroll;overflow:-Scroll;}
.search-group{display: flex;justify-content: flex-start;align-items: center;margin: 10px 0;}
.totalS{color: #666666;font-size: .475rem;line-height: 1rem;position: relative;}
.totalS::after{position: absolute;content: '*';color: red;top: 2px;right: -8px;width: 5px;height: 5px;}
.search-group>input{width: 15rem;margin-left: 20px;}
.select-ipt{margin-left: 20px;width: 15rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;appearance: menulist;}
.other{display: flex;}
.other>span{color: #666666;font-size: .475rem;line-height: 1rem;position: relative;}
.other>input{width: 15rem;margin-left: 20px;border: 1px solid #D9D9D9;height: 2rem;border-radius: .125rem !important;vertical-align: top;}
.timer{width: 4rem!important;margin-left: 20px;border: 1px solid #D9D9D9;height: 1rem;border-radius: .125rem !important;vertical-align: top;}
.to{color: #666666;font-size: .475rem;line-height: 1rem;margin-left: 15px;}
.middlePage{font-size: .47rem;margin-right: 10px;cursor: pointer;}
.linkUrl{margin-left: 5px;width: 10rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;}
.statusBtn{font-size: .47rem;color: red;margin-left: 20px;border: none;background-color: transparent;}
.configuration{width: 100%;padding-left: 3rem;box-sizing: border-box;}
.search-time-picker{width: 5rem!important;}
.upload{margin-left: 20px;display: flex;align-items: center;}
.upload>label{font-size: 14px;color: #dd1010;width: 3rem;height: 1.3rem;line-height: 1.3rem;text-align: center;background-color: #4880EA;display: block;border-radius: 5px;cursor: pointer;}
.action-btn{height: 1.2rem;border: none;position: relative;}
.action-btn:focus{outline:0;} /*去掉按钮点击时的边框*/ 
.imgSize{font-size: 0.4rem;color: red;}


.footerBtn{display: flex;justify-content: space-around;padding: 20px 10rem;box-sizing: border-box;}
.footerCancel{width: 5rem;height: 1.5rem;background-color: #b4b3b3;text-align: center;line-height: 1.5rem;color: #333333;font-size: 14px;border-radius: 6px;cursor: pointer;}
.footerSave{width: 5rem;height: 1.5rem;background-color: #4880EA;text-align: center;line-height: 1.5rem;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;}
/* 左右豆腐块模块样式 */
.tofoLeft,.tofoRight{width: 50%;padding: 20px;box-sizing: border-box;border: 1px solid #eeeeee;border-radius: 10px;}
.widthTofo{width: 100px;display: block;text-align: right;}
</style>