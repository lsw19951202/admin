<template>
    <div class="pageEditor">
        <div class="tempSelectBox" v-if="editable">
            <div class="header">
                选择模板
            </div>
            <div class="tempBox">
                <div class="tempList">
                    <div class="tempItem">
                        <div class="header">
                            <input id="temp0" type="radio" name="tempSelectRadio" value="0" v-model="templete">
                            <label for="temp0">模板1</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pageEditBody">
            <div class="header">
                中间页配置
                <div v-if="editable">
                    <input id="createNewRadio" type="radio" name="isCreateNew" value="1" v-model="isCreateNew">
                    <label for="createNewRadio">新建</label>
                </div>
                <div v-if="editable">
                    <input id="selectOldRadio" type="radio" name="isCreateNew" value="0" v-model="isCreateNew">
                    <label for="selectOldRadio">选择已有中间页</label>
                </div>
            </div>
            <div class="body">
                <div v-if="isCreateNew == 1 || !editable" class="pageEditBox">
                    <div class="edit-group need">
                        <label>中间页标题</label>
                        <input type="text" v-model="title" :disabled="!editable">
                    </div>
                    <div class="edit-group need">
                        <label>所属平台</label>
                        <select v-model="platform" :disabled="!editable">
                            <option value="tb">淘宝</option>
                            <option value="jd">京东</option>
                            <!-- <option value="pdd">拼多多</option> -->
                            <option value="wph">唯品会</option>
                        </select>
                    </div>
                    <div class="edit-group need">
                        <label>活动链接</label>
                        <input type="text" v-model="jump_url" :disabled="!editable">
                    </div>
                    <div class="edit-group need" v-if="platform == 'jd'">
                        <label>短链接</label>
                        <input type="text" v-model="short_url" :disabled="!editable">
                    </div>
                    <div class="edit-group need">
                        <label>文案</label>
                        <input type="text" v-model="copywriting" :disabled="!editable">
                    </div>
                    <div class="edit-group tips">
                        <label></label>
                        <div>文案格式:'好物天天购,复制{{}},打开tb,天猫超市每天抢'</div>
                    </div>
                    <div class="edit-group need">
                        <label>页面背景色</label>
                        <input type="text" v-model="bg_color" :disabled="!editable">
                    </div>
                    <div class="edit-group need">
                        <label>边框颜色</label>
                        <input type="text" v-model="border_color" :disabled="!editable">
                    </div>
                    <div class="edit-group" style="height: 50px;">
                        <label>描述</label>
                        <textarea v-model="desc" placeholder="描述该中间页面背景/用途，仅作为内部说明，不会展示到APP界面" cols="" rows="2" :disabled="!editable"></textarea>
                    </div>
                    <div class="edit-group need editImg">
                        <label>背景图片</label>
                        <div>
                            <input class="action-btn" type="button" value="上传" @click.prevent.stop="selectBgImg" v-if="!bg_img">
                            <img :src="bg_img" v-if="bg_img" :style="'width: 375px; height: auto;' + (editable ? ' cursor: pointer;' : '')" @click.prevent.stop="selectBgImg">
                        </div>
                    </div>
                    <div class="edit-group tips">
                        <label></label>
                        <div>
                            文件大小300k以下，尺寸 750*?
                        </div>
                    </div>
                    <div class="edit-group need editImg">
                        <label>按钮图片</label>
                        <div>
                            <input class="action-btn" type="button" value="上传" @click.prevent.stop="selectBtnImg" v-if="!button_img">
                            <img :src="button_img" :style="'width: 180px; height: auto;' + (editable ? ' cursor: pointer;' : '')" v-if="button_img" @click.prevent.stop="selectBtnImg">
                        </div>
                    </div>
                    <div class="edit-group tips">
                        <label></label>
                        <div>
                            文件大小35k以下，尺寸 ?*103
                        </div>
                    </div>
                    <div class="edit-group">
                        <label></label>
                        <div class="preview">
                            <input type="button" class="action-btn" value="预览" @click.prevent.stop="preview">
                        </div>
                    </div>
                </div>
                <div v-if="isCreateNew == 0 && editable" class="pageEditBox">
                    <div class="edit-group need">
                        <label>选择中间页</label>
                        <select v-model="page_id" @change="choosePageMidle">
                            <option v-for="(page, idx) in pageList" :key="idx" :value="page.id">{{page.title}}</option>
                        </select>
                    </div>
                </div>
                <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
                    <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
                </form>
            </div>
        </div>
        <div class="cover" v-if="showPreview" @click.prevent.stop="hidePreview"></div>
        <div class="previewBox" v-if="showPreview">
            <iframe :src="pageUrl" style="width: 100%; height: 100%;"></iframe>
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import Setting from '@/setting'
import qs from 'qs'
import setting from '@/setting'

export default {
    inject: ['alert', 'showLoading', 'hideLoading'],
    props: ['editable', 'pageId'],
    data(){
        return {
            showPreview: false,
            pagePrefix: ['http://static.yunzhanxinxi.com/templete2.html'],
            templete: 0,
            isCreateNew: 1,
            'page_id': '',
            title: '',
            platform: '',
            'jump_url': '',
            'short_url': '',
            copywriting: '',
            'bg_color': '',
            'border_color': '',
            desc: '',
            'bg_img': '',
            'button_img': '',
            imgType: 'bg',
            bgSize: 300 * 1024,
            btnSize: 35 * 1024,
            pageList: null,
            middlePageUrl:''
        }
    },
    computed: {
        pageUrl() {
            return this.pagePrefix[this.templete] + '?preview=1&title=' + encodeURIComponent(this.title)
                + '&platform=' + encodeURIComponent(this.platform) + '&jump_url=' + encodeURIComponent(this.jump_url)
                + '&short_url=' + encodeURIComponent(this.short_url) + '&copywriting=' + encodeURIComponent(this.copywriting)
                + '&bg_color=' + encodeURIComponent(this.bg_color) + '&border_color=' + encodeURIComponent(this.border_color)
                + '&bg_img=' + encodeURIComponent(this.bg_img) + '&button_img=' + encodeURIComponent(this.button_img)
        }
    },
    created(){
        this.getPageList()
            .then(() => {
                if(this.pageId){
                    this.$data['page_id'] = this.pageId
                    let page = null
                    for(let idx = 0; idx < (this.pageList || []).length; idx++){
                        if(this.pageList[idx].id == this.pageId){
                            page = this.pageList[idx]
                            break
                        }
                    }
                    if(page){
                        this.title = page.title
                        this.platform = page.platform
                        this.copywriting = page.copywriting
                        this.$data['jump_url'] = page.jump_url
                        this.$data['short_url'] = page.short_url
                        this.$data['bg_color'] = page.bg_color
                        this.$data['border_color'] = page.border_color
                        this.desc = page.desc
                        this.$data['bg_img'] = page.bg_img
                        this.$data['button_img'] = page.button_img
                    }
                }
            })
    },
    methods: {
        choosePageMidle(e){//选择已有中间页
            for (let v = 0; v < this.pageList.length; v++) {
                if(this.pageList[v].id == e.target.value){
                    console.log(this.pageList[v]['page_url'])
                    this.middlePageUrl = this.pageList[v]['page_url']
                }
            }
        },
        /**
         * 获取所有发布中的中间页
         */
        getPageList(){
            return request({
                url: setting.urls.pageList,
                method: 'get',
                params: {
                    status: 1
                }
            }).then(rst => {
                if(rst.status == 200 && rst.data.code == 200){
                    this.pageList = rst.data.data.data || []
                }else{
                    this.alert('加载中间页列表失败')
                }
            }).catch(e => {
                this.alert(e.message || '加载中间页列表失败')
            })
        },
        /**
         * 添加新的中间页
         * @param {*} newPage 新中间页配置数据
         */
        addNewPage(newPage){
            return request({
                method: 'post',
                url: setting.urls.addMiddle,
                data: qs.stringify(newPage)
            }).then(rst => {
                if(rst.status == 200 &&  rst.data.code == 200){
                    return rst.data.data
                }else{
                    throw new Error('添加中间页失败')
                }
            })
        },
        /**
         * 发布中间页
         * @param {*} id中间页唯一标识
         */
        pubNewPage(id){
            return request({
                url: setting.urls.changeMiddleStatus,
                method: 'post',
                data: qs.stringify({
                    ids: id,
                    type: 'open'
                })
            }).then(rst => {
                if(rst.status != 200 && rst.data.data != 200){
                    throw new Error('发布中间页失败')
                }
            })
        },
        /**
         * 素材保存时，通过该方法获取创建的中间页
         * 如果是新增 返回新增的中间页所有属性
         * 如果时选择已有中间页，返回中间页id
         */
        getPageData(){
            if(this.isCreateNew == 1){
                this.showLoading()
                const requestParams = {
                    'page_id':this.pageId,
                    'title': this.title,
                    'platform': this.platform,
                    'jump_url': this.jump_url,
                    'short_url': this.short_url,
                    'copywriting': this.copywriting,
                    'bg_color': this.bg_color,
                    'border_color': this.border_color,
                    'desc': this.desc,
                    'bg_img': this.bg_img,
                    'button_img': this.button_img
                }
                return this.addNewPage(requestParams)
                    .then(pageId => {
                        return this.pubNewPage(pageId)
                            .then(() => {
                                return pageId
                            })
                    }).catch(e => {
                        this.hideLoading()
                        this.alert(e.message || '添加中间页失败')
                        // throw new Error(e.message || '添加中间页失败')
                    }).then(pageId => {
                        this.hideLoading()
                        return {
                            pageContent: requestParams,
                            pageId,
                            pageUrl: this.pagePrefix[this.templete] + '?pageId=' + this.pageId
                        }
                    })
            }else{
                return {pageId:this.page_id,pageUrl:this.middlePageUrl}
            }
        },
        /**
         * 点击上传按钮，选择背景图片
         */
        selectBgImg(){
            if(this.editable){
                this.imgType = 'bg'
                this.$refs.files.click()
            }
        },
        /**
         * 点击上传按钮，上传按钮图片
         */
        selectBtnImg(){
            if(this.editable){
                this.imgType = 'btn'
                this.$refs.files.click()
            }
        },
        /**
         * 预览
         */
        preview(){
            console.log('preview')
            this.showPreview = true
        },
        hidePreview(){
            this.showPreview = false
        },
        /**
         * 上传图片
         * 根据上传图片类型，判断图片的大小以及宽高
         * 上传完成，返回图片地址
         */
        uploadImage(){
            return new Promise((resolve, reject) => {
                const fileSize = this.$refs.files.files[0].size
                // 判断图片的大小
                if(this.imgType == 'bg'){
                    if(fileSize > this.bgSize){
                        this.alert('背景图片大小不超过300K')
                        reject()
                    }
                }else if(this.imgType == 'btn'){
                    if(fileSize > this.btnSize){
                        this.alert('按钮图片大小不超过35K')
                        reject()
                    }
                }
                // 判断图片宽高
                const tmpImg = document.createElement('img')
                tmpImg.onload = () => {
                    console.log('宽高', tmpImg.width, tmpImg.height)
                    if(this.imgType == 'bg'){
                        if(tmpImg.width != 750){
                            this.alert('背景图片尺寸为750*?,所选图片尺寸错误')
                            reject()
                        }
                    }else if(this.imgType == 'btn'){
                        // if(tmpImg.width != 420 || tmpImg.height != 103){
                        //     this.alert('按钮图片尺寸为420*103,所选图片尺寸错误')
                        //     reject()
                        // }
                        if(tmpImg.height != 103){
                            this.alert('按钮图片尺寸为?*103,所选图片尺寸错误')
                            reject()
                        }
                    }
                    const formData = new FormData(this.$refs.fileForm)
                    request({
                        url: Setting.urls.uploadImage,
                        method: 'post',
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(rst => {
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
                    if(this.imgType == 'bg'){
                        this.$data['bg_img'] = url
                    }else if(this.imgType == 'btn'){
                        this.$data['button_img'] = url
                    }
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.pageEditor {
    background-color: white;
    width: 100%;
    height: fit-content;
    position: relative;
    .tempSelectBox {
        width: 100%;
        height: fit-content;
        overflow: hidden;
        background-color: #F4F4F4;
        .header {
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: left;
            font-size: 15px;
        }
        .tempBox {
            width: 100%;
            height: fit-content;
            overflow: hidden;
            overflow-x: scroll;
            .tempList {
                height: fit-content;
                .tempItem {
                    width: 64px;
                    height: 20px;
                    line-height: 20px;
                    margin-right: 10px;
                    display: inline-block;
                    .header {
                        width: 100%;
                        height: 20px;
                        line-height: 20px;
                        input {
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
        .tempBox::-webkit-scrollbar {
            display: none;
        }
    }
    .pageEditBody {
        width: 100%;
        padding-top: 10px;
        .header {
            width: 100%;
            text-align: left;
            font-size: 15px;
            div {
                display: inline-block;
                margin-left: 10px;
                input {
                    margin-right: 5px;
                }
            }
        }
        .body {
            width: 100%;
            .pageEditBox {
                width: 100%;
                margin-top: 10px;
                height: fit-content;
                .edit-group {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 13px;
                    display: flex;
                    box-sizing: border-box;
                    margin-bottom: 8px;
                    label {
                        width: 90px;
                        text-align: right;
                        margin-right: 8px;
                        overflow: hidden;
                        height: 40px;
                        line-height: 40px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        padding-right: 10px;
                        position: relative;
                    }
                    input, select, textarea {
                        width: 480px;
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid #DDDDDD;
                        box-sizing: border-box;
                        padding-left: 8px;
                        padding-right: 8px;
                    }
                    input.action-btn {
                        width: 80px;
                    }
                    textarea {
                        resize: none;
                        height: 50px;
                        line-height: 25px;
                    }
                    select {
                        appearance: menulist;
                    }
                    .preview {
                        width: 50%;
                        text-align: center;
                    }
                }
                .edit-group.need {
                    label::after {
                        content: '*';
                        color: red;
                        font-size: 15px;
                        display: block;
                        width: 10px;
                        text-align: center;
                        height: 40px;
                        line-height: 40px;
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                }
                .edit-group.tips {
                    height: 20px;
                    line-height: 20px;
                    text-align: left;
                    color: red;
                    font-size: 12px;
                }
                .edit-group.editImg {
                    height: auto;
                }
            }
        }
    }
    .previewBox {
        position: fixed;
        z-index: 10000;
        width: 400px;
        height: 568px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        iframe {
            margin: 0;
            padding: 0;
            background-color: white;
        }
    }
}
</style>