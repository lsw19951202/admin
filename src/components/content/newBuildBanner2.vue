<template>
    <div class="detail-container">
        <div class="detail-data-box">
            <h5 style="margin-bottom: 20px;" v-show="!isLook && !isEdit">新建banner2</h5>
            <h5 style="margin-bottom: 20px;" v-show="isLook">查看banner2</h5>
            <h5 style="margin-bottom: 20px;" v-show="isEdit">编辑banner2</h5>
            <div class="search-group">
                <span class="totalS">所在页面</span>
                <input type="text" placeholder="请输入"  disabled :value="pageTb=='shopping'?'购物赚':pageTb=='live'?'生活赚':''">
            </div>
            <div class="search-group">
                <span class="totalS">页面位置</span>
                <input type="text" placeholder="请输入"  disabled :value="pageSite=='bannerUp'?'顶部':pageSite=='bannerDown'?'中部':'横幅'">
            </div>
            <div class="search-group">
                <span class="totalS bannerTips1">展示顺序</span>
                <input type="text" class="inputSort" placeholder="请输入"  v-model="sequence" :disabled='isLook'>
            </div>
            <div class="search-group">
                <span class="totalS">广告名称</span>
                <input type="text" placeholder="请输入" v-model="adsName" :disabled='isLook'>
            </div>
            <div class="other">
                <span>更新描述</span>
                <input type="text" :disabled='isLook' placeholder="请简要描述该banner本次更新情况，仅作为内部说明。将不会展示到APP界面。非必填项" v-model="textareaValue">
            </div>
            <div class="search-group">
                <span class="totalS">图片上传</span>
                <div class="upload">
                    <div v-show="!isLook">
                        <div class="imgSize">尺寸1065*210 圆角:30px</div>
                        <input class="action-btn" type="button" value="上传+" @click="selectImg">
                    </div>
                    <img style="width:100px; height: 40px;cursor: pointer;margin-left:20px;" :src="srcUrl" alt="" @click="previewImg(srcUrl)">
                </div>
                <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                    <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
                </form>
            </div>
            <div class="search-group">
                <span class="totalS">生效时间</span>
                <flat-picker class="search-time-picker" :disabled='isLook' :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
                <span class="to">至</span>
                <flat-picker class="search-time-picker" :disabled='isLook' :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
            </div>
            <div class="search-group">
                <span class="totalS">跳转链接</span>
                <div style="margin-left:20px;display: flex;justify-content: flex-start;align-items: center;" @change="changeRadio">
                    <label class="middlePage"><input  type="radio" name="radio1" value="1" :checked='isMiddlePage==1' :disabled='isLook'/>有中间页</label>
                    <label class="middlePage"><input  type="radio" name="radio1" value="2" :checked='isMiddlePage==2' :disabled='isLook'/>无中间页</label>
                    <input type="text" placeholder="请填写链接" class="linkUrl" v-if="isMiddlePage==2" v-model="jumpLink">
                </div>
            </div>
            <div class="configuration" v-if="isMiddlePage==1">
                <!-- 这里是中间页组件 -->
                <templete :editable='editable' :pageId="lookBannerMessge['page_id']"></templete>
            </div>
            <div class="search-group">
                <span class="totalS">当前状态</span>
                <div class="statusBtn">{{state=='0'?'待发布':state=='1'?'发布中':'已下架'}}</div>
            </div>
            <div class="footerBtn" v-show="!isLook">
                <button class="footerCancel" @click.prevent.stop="bannerCancel">取消</button>
                <button class="footerSave" @click.prevent.stop="preservation">保存</button>
            </div>
            <div v-show="isLook" style="display:flex;justify-content: center;">
                <button class="footerSave" @click.prevent.stop="bannerLookSure">确定</button>
            </div>
        </div>
        <!-- 提示框 -->
        <operation-tip :tipsText='tipsText' :showTips='showTips' @cancelEvent='cancelFn' @determineEvent='determineFn'></operation-tip>
        <!-- 图片预览 -->
        <div class="mask" v-if="showImg">
            <div class="alert-mark" @click="closeImg"></div>
            <img :src="maskImgUrl" alt="图片" class="imgBox">
        </div>
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
    props:['dataAddree','lookBannerMessge','isLook','isEdit'],
    components: {
        'templete':templete,
        'flat-picker': flatPicker,
        'operation-tip':operationTips
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
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i',
                enableTime: true,
                'time_24hr': true
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
                    text: '0'
                }, {
                    value: '1',
                    text: '1'
                }, {
                    value: '2',
                    text: '2'
                }]
            },
            isMiddlePage:'',//是否显示中间页，1有中间页  2无中间页
            id:'',//修改内容时的id
            pageTb:'',//所在页面
            pageSite:'',//页面位置
            sequence:'',//展示顺序
            adsName:'',//广告名称
            type:'',//生活赚类型
            textareaValue:'',//更新描述
            srcUrl:'',//图片地址
            pageId:0,//中间页id，0表示无中间页
            jumpLink:'',//跳转链接
            state:'0',//状态，0待发布 1发布中 2已下架
            editable:true,//中间页是否可编辑
            showImg:false,
            maskImgUrl:''
        }
    },
    created(){
        console.log(this.lookBannerMessge,this.dataAddree)
        this.pageTb = this.dataAddree.pageTable
        this.pageSite = this.dataAddree.pageLocation
        if(this.dataAddree.pageLocation == "singleImage"){
            this.type = 'singleImage'
        }else{
            this.type = 'banner'
        }
        this.lookMessge()
    },
    methods:{
        lookMessge(){
            if(this.lookBannerMessge){
                if(this.lookBannerMessge['page_id'] != '0' && this.lookBannerMessge['page_id'] != null){
                    this.isMiddlePage = 1
                }else{
                    this.isMiddlePage = 2
                }
                if(this.isLook){
                    this.editable = false
                }else{
                    this.editable = true
                }
                switch (this.lookBannerMessge['belong_prefecture']) {
                    case '生活赚':
                        this.pageTb = 'live'
                        break;
                    case '首页(购物赚)':
                        this.pageTb = 'shopping'
                        break;
                    default:
                        break;
                }
                switch (this.lookBannerMessge.typeIos) {
                    case '生活赚上方':
                        this.pageSite = 'bannerUp'
                        break;
                    case '购物赚中部':
                        this.pageSite = 'bannerDown'
                        break;
                    case '购物赚中部横幅':
                        this.pageSite = 'singleImage'
                        break;
                    default:
                        break;
                }
                this.sequence = this.lookBannerMessge.sort
                this.adsName = this.lookBannerMessge.name
                this.textareaValue = this.lookBannerMessge.desc
                this.srcUrl = this.lookBannerMessge.img
                this.createTimeBegin = this.lookBannerMessge['valid_time'].split('至')[0]
                this.createTimeEnd = this.lookBannerMessge['valid_time'].split('至')[1]
                this.jumpLink = this.lookBannerMessge.url
                switch (this.lookBannerMessge.status) {
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
                this.id = this.lookBannerMessge.id
            }
        },
        changeRadio(e){//选择是否有中间页
            this.isMiddlePage = e.target.value;
        },
        bannerCancel(){//取消按钮提示
            this.tipsText = '是否离开当前页面？您编辑的内容将不会保存!'
            this.showTips = true
        },
        bannerLookSure(){
            this.$emit('goBackPage')
        },
        cancelFn(){
            this.showTips = false
        },
        determineFn(e){
            this.showTips = false
            this.$emit('goBackPage')
        },
        preservation(){
            console.log(this.$children)
            const childNode = this.$children
            if(this.isMiddlePage==1){
                let returnDate
                for (let v = 0; v < childNode.length; v++) {
                    console.log(childNode[v].$el,"kzsdhckzshb")
                    if(childNode[v].$el.className == 'pageEditor'){
                        returnDate = childNode[v].getPageData()
                    }
                }
                console.log(returnDate,"返回参数")
                if(returnDate.then){
                    returnDate.then(res => {
                        this.pageId = res.pageId
                        this.jumpLink = res.pageUrl
                        this.newBuildRequest()
                    }).catch(e => {
                        // false
                        this.alert(e.message)
                    })
                }else{
                    this.pageId = returnDate.pageId
                    this.jumpLink = returnDate.pageUrl
                    this.newBuildRequest()
                }
            }else{
                this.newBuildRequest()
            }
        },
        newBuildRequest(){//新建修改方法
            const requestData = {
                'banner_id':this.id,
                sort:this.sequence,
                belong:this.pageTb,
                typeIos:this.pageSite,
                type:this.type,
                name:this.adsName,
                desc:this.textareaValue,
                img:this.srcUrl,
                status:this.state,
                'page_id':this.pageId,
                url:this.jumpLink,
                'start_time':this.createTimeBegin,
                'end_time':this.createTimeEnd
            }
            this.showLoading()
            request({
                url: setting.urls.layoutAdd,
                method: 'post',
                data:qs.stringify(requestData)
            }).then(res=>{
                console.log(res)
                if(res.status == 200 && res.data.code == 200){
                    this.$emit('goBackPage')
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
                    this.srcUrl = url
                }
            })
        },
        previewImg(img){//预览图片
            console.log(img,"图片地址")
            this.maskImgUrl = img
            this.showImg=true
        },
        closeImg(){
            this.showImg=false
        },
    }
}
</script>

<style scoped>
/* .detail-data-box,.detail-container{padding: 0;overflow-y: scroll;overflow:-Scroll;overflow-y:hidden;} */
.detail-container{padding: 0;overflow-y: scroll;}
.search-group{display: flex;justify-content: flex-start;align-items: center;margin: 10px 0;}
.totalS{color: #666666;font-size: .5375rem;line-height: 1rem;position: relative;}
.totalS::after{position: absolute;content: '*';color: red;top: 2px;right: -8px;width: 5px;height: 5px;}
.search-group>input{width: 15rem;margin-left: 20px;display: block;}
.select-ipt{margin-left: 20px;width: 15rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;appearance: menulist;}
.other>span{color: #666666;font-size: .5375rem;line-height: 1rem;position: relative;}
.other>input{width: 15rem;margin-left: 20px;border: 1px solid #D9D9D9;height: 2rem;border-radius: .125rem !important;vertical-align: top;}
.timer{width: 4rem!important;margin-left: 20px;border: 1px solid #D9D9D9;height: 1rem;border-radius: .125rem !important;vertical-align: top;}
.to{color: #666666;font-size: .5375rem;line-height: 1rem;margin-left: 15px;}
.middlePage{font-size: .537rem;margin-right: 10px;cursor: pointer;}
.linkUrl{margin-left: 5px;width: 15rem;height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;}
.statusBtn{font-size: .537rem;color: red;margin-left: 20px;}
.configuration{width: 100%;padding-left: 3rem;box-sizing: border-box;}
.search-time-picker{width: 5rem!important;}
.upload{margin-left: 20px;display: flex;align-items: center;}
.upload>label{font-size: 14px;color: #dd1010;width: 3rem;height: 1.3rem;line-height: 1.3rem;text-align: center;background-color: #4880EA;display: block;border-radius: 5px;cursor: pointer;}
.action-btn{height: 1.2rem;border: none;position: relative;}
.action-btn:focus{outline:0;} /*去掉按钮点击时的边框*/ 
.imgSize{font-size: 0.4rem;color: red;}
.bannerTips1::before{position: absolute;content: '若有重复顺序，将默认按照时间倒序再次排序(后建先展示)';color: red;top: -20px;right: -390px;width: 370px;font-size: 0.475rem;}

.footerBtn{display: flex;justify-content: space-around;padding: 20px 10rem;box-sizing: border-box;}
.footerCancel{width: 4rem;height: 1.3rem;background-color: #b4b3b3;text-align: center;line-height: 1.3rem;color: #333333;font-size: 14px;border-radius: 6px;cursor: pointer;}
.footerSave{width: 4rem;height: 1.3rem;background-color: #4880EA;text-align: center;line-height: 1.3rem;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;}


/* 图片预览 */
.alert-mark{width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 10001;}
.imgBox{width: 30%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%); z-index: 10002;}
</style>