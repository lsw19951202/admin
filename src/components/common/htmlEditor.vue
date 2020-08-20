<!-- 暂时只兼容chrome, edge, sofari, opera, ff 和ie高版本 -->
<!-- ie低版本未作测试，建议使用高版本或者其它浏览器 -->
<template>
    <div class="html-editor" tabindex="1" @blur="hideEditorBody">
        <div class="html-editor-header">
            <div class="html-editor-act-btns">
                <span :class="'editor-btn bold ' + (contentBold?'dark':'')" @click="changeTextWeight" v-if="!config || !config.actions || config.actions.bold || config.actions.bold == undefined"></span>
                <span :class="'editor-btn italic ' + (contentItalic?'dark':'')" @click="changeTextItalic" v-if="!config || !config.actions || config.actions.italic || config.actions.italic == undefined"></span>
                <span class="editor-btn fontSize" @click="changeFontSizeStatu" v-if="!config || !config.actions || config.actions.fontSize || config.actions.fontSize == undefined">
                    <div @click.stop="changeFontSize($event)" style="position: absolute; background-color: white; border: 1px solid #cccccc; z-index: 5000;" v-show="showFontSizeContainer">
                        <div>字号</div>
                        <hr>
                        <ul style="cursor: pointer;">
                            <li data-size='1' style="font-size: 12px;">12px</li>
                            <li data-size='2' style="font-size: 14px;">14px</li>
                            <li data-size='3' style="font-size: 16px;">16px</li>
                            <li data-size='4' style="font-size: 18px;">18px</li>
                            <li data-size='5' style="font-size: 24px;">24px</li>
                            <li data-size='6' style="font-size: 32px;">32px</li>
                            <li data-size='7' style="font-size: 48px;">48px</li>
                        </ul>
                    </div>
                </span>
                <span :class="'editor-btn alignLeft ' + (contentAlignLeft?'dark':'')" @click="changeTextAlign('left')" v-if="!config || !config.actions || config.actions.alignLeft || config.actions.alignLeft == undefined"></span>
                <span :class="'editor-btn alignCenter ' + (contentAlignCenter?'dark':'')" @click="changeTextAlign('center')" v-if="!config || !config.actions || config.actions.alignCenter || config.actions.alignCenter == undefined"></span>
                <span :class="'editor-btn alignRight ' + (contentAlignRight?'dark':'')" @click="changeTextAlign('right')" v-if="!config || !config.actions || config.actions.alignRight || config.actions.alignRight == undefined"></span>
                <span :class="'editor-btn strikethrough ' + (contentStrikethrough?'dark':'')" @click="changeTextStrike" v-if="!config || !config.actions || config.actions.strikethrough || config.actions.strikethrough == undefined"></span>
                <span :class="'editor-btn underline ' + (contentUnderline?'dark':'')" @click="changeTextUnderline" v-if="!config || !config.actions || config.actions.underline || config.actions.underline == undefined"></span>
                <span class="editor-btn emoji" @click="changeEmojiStatu" v-if="!config || !config.actions || config.actions.emoji || config.actions.emoji == undefined"></span>
                <span class="editor-btn image" @click="changeImageStatu" v-if="!config || !config.actions || config.actions.image || config.actions.image == undefined"></span>
                <span class="editor-btn link" @click="changeLinkStatu" v-if="!config || !config.actions || config.actions.link || config.actions.link == undefined"></span>
                <span class="editor-btn video" @click="changeVideoStatu" v-if="!config || !config.actions || config.actions.video || config.actions.video == undefined"></span>
            </div>
        </div>
        <div class="html-editor-body" ref="editorBody" v-if="showEmojiContainer || showImageContainer || showLinkContainer || showVideoContainer">
            <div class="emoji-container" ref="emojiContainer" v-if="showEmojiContainer">
                <div v-html="initEmoji" @click="emojiItemClicked"></div>
            </div>
            <div class="image-container" ref="imageContainer" v-if="showImageContainer" style="width: 100%; height: 100%; padding-top: 2rem; box-sizing: border-box;">
                <!-- <div> -->
                    <span class="upload-btn" @click="selectImage">点击上传本地图片</span>
                    <form enctype="multipart/form-data" style="display: none;" ref="imageForm">
                        <input type="file" ref="imageIpt" @change="uploadImage" accept=".jpeg, .jpg, .png, .gif" name="file">
                    </form>
                <!-- </div> -->
            </div>
            <div class="video-container" ref="videoContainer" v-if="showVideoContainer" style="width: 100%; height: 100%; padding-top: 2rem; box-sizing: border-box;">
                <!-- <div> -->
                    <span class="upload-btn" @click="selectVideo">点击上传视频</span>
                    <form enctype="multipart/form-data" style="display: none;" ref="videoForm">
                        <input type="file" ref="videoIpt" @change="uploadVideo" accept=".mp4, .ogg, .webm" name="file">
                    </form>
                <!-- </div> -->
            </div>
            <div class="link-container" ref="linkContainer" v-if="showLinkContainer" style="width: 100%; height: 100%;">
                <div>
                    <label>超链接地址:</label>
                    <input type="text" v-model="linkUrl" placeholder="超链接地址">
                </div>
                <div>
                    <label>显示文本:</label>
                    <input type="text" v-model="linkText" placeholder="页面显示内容">
                </div>
                <div>
                    <label>是否新页面打开:</label>
                    <input type="checkbox" v-model="linkOpenInBlank">
                </div>
            </div>
        </div>
        <div class="html-editor-content" ref="editorContent">
            <div :contenteditable="editable" v-html="htmlText" @input.prevent="editorInput" @focus="editorFocus" @blur="editorBlur" ref="editor"></div>
        </div>
    </div>
</template>
<script>
import 'font-awesome/css/font-awesome.min.css'
import request from '@/axios'
import setting from '@/setting'

export default {
    inject: ['showLoading', 'hideLoading', 'alert'],
    props: ['config', 'htmlText', 'editable'],
    data: () => {
        return {
            // 控制emoji,image,link,video的编辑界面的显示
            showEmojiContainer: false,
            showImageContainer: false,
            showLinkContainer: false,
            showVideoContainer: false,
            // 字体大小控制按钮
            showFontSizeContainer: false,
            // 控制或者显示文字粗体，斜体，对齐方式，下划线等按钮的选中效果
            contentBold: false,
            contentItalic: false,
            contentAlignLeft: false,
            contentAlignCenter: false,
            contentAlignRight: false,
            contentStrikethrough: false,
            contentUnderline: false,
            emojiArr: [
                ['\uD83C\uDD70', '\uD83C\uDD9A'], ['\uD83C\uDF00', '\uD83C\uDFFA'], ['\uD83C\uDE01'], ['\uD83C\uDE02'], ['\uD83C\uDE1A'], ['\uD83C\uDE2F'],
                ['\uD83C\uDE50'], ['\uD83C\uDE51'], ['\uD83C\uDE02\uFE0F'], ['\uD83C\uDE1A\uFE0F'],
                ['\uD83C\uDE2F\uFE0F'], ['\uD83C\uDE50\uFE0F'], ['\uD83C\uDE51\uFE0F'], ['\uD83C\uDC04\uFE0F'], ['\uD83C\uDCCF\uFE0F'],
                ['\uD83D\uDC00', '\uD83D\uDDFF'], ['\uD83E\uDD10', '\uD83E\uDD76'],['\uD83E\uDD80', '\uD83E\uDDA2'],
                ['\uD83E\uDDA5', '\uD83E\uDDAA'], ['\uD83E\uDDAE', '\uD83E\uDDCA'], ['\uD83E\uDDCD', '\uD83E\uDDFF'],
                ['\uD83D\uDE00', '\uD83D\uDE4F'], ['\uD83D\uDED2'], ['\uD83D\uDED5'],
                ['\uD83D\uDEE0', '\uD83D\uDEEC'], ['\uD83D\uDEF0', '\uD83D\uDEFA'],
                ['\u2600\uFE0F', '\u26FF\uFE0F'], ['\u2600', '\u26FF'], ['\u2700\uFE0F', '\u27BF\uFE0F'], ['\u2700', '\u27BF'],
                ['\u2194', '\u2199'], ['\u21A9', '\u21AA'], ['\u21A9\uFE0F', '\u21AA\uFE0F'], ['\u2B05', '\u2B07'],
                ['\u2B05\uFE0F', '\u2B07\uFE0F'], ['\uD83C\uDE32', '\uD83C\uDE3A'], ['\uD83C\uDE32', '\uD83C\uDE3A'], ['\u25FB', '\u25FE'],
                ['\u23E9', '\u23F3'], ['\u231A\uFE0F'], ['\u231B\uFE0F'], ['\u2328\uFE0F'],
                ['\u23CF\uFE0F'], ['\u24C2\uFE0F'], ['\u24C2'], ['\u2B1B'], ['\u2B1C'], ['\u2B50'], ['\u2B55'], ['\u2B1B\uFE0F'],
                ['\u2B1C\uFE0F'], ['\u2B50\uFE0F'], ['\u2B55\uFE0F'], ['\u2934'], ['\u2935\uFE0F'], ['\u2935'], ['\u2935\uFE0F'], ['\u3030'],
                ['\u3030\uFE0F'], ['\u303D'], ['\u303D\uFE0F'], ['\u3297'], ['\u3299'], ['\u3297\uFE0F'], ['\u3299\uFE0F'], ['\u203C\u2049'],
                ['\u203C\u2049\uFE0F'], ['\u25AA'], ['\u25AB'], ['\u25B6'], ['\u25C0'],  ['\u00A9'], ['\u00AE'],
                ['\u00A9\uFE0F'], ['\u00AE\uFE0F'], ['\u2122'], ['\u2139'], ['\u2122\uFE0F'], ['\u2139\uFE0F'], 
                ['\u231A'], ['\u231B'], ['\u2328'], ['\u23CF']
            ],
            cursorPos: null,
            range: null,
            editorPos: {
                left: 0,
                top: 0
            },
            linkUrl: '',
            linkText: '',
            linkOpenInBlank: false
        }
    },
    methods: {
        /**
         * 修改字体大小
         */
        changeFontSize: function(evt){
            const tar = evt.target
            console.log(tar)
            console.log(tar.dataset)
            if(tar.dataset.size){
                if(window.getSelection){
                    // 是否新创建的range -- 是否是光标第一次进入编辑器
                    const isNewRange = this.setRange()
                    document.execCommand('fontSize', false, tar.dataset.size)
                    this.showFontSizeContainer = false
                    // this.scrollToTarget(isNewRange)
                }else{
                    return
                }
            }
        },
        /**
         * emoji表情点击事件
         * 添加表情到光标位置
         * 如果有选中内容，则替换选中内容
         * 如果光标不在编辑器内，则添加到末尾
         * @param event 点击事件，用于获取emoji
         */
        emojiItemClicked: function(e){
            const target = e.target
            if(target.className == 'emoji-item'){
                this.insertText(target.innerText)
                this.showEmojiContainer = false
            }
        },
        /**
         * 插入文本内容
         * 主要是插入emoji表情
         * @param text 文本内容
         */
        insertText: function(text){
            // this.insertHTML('<span>' + text + '</span>')
            this.insertHTML(text)
        },
        /**
         * 编辑器滚动到光标所在位置
         * 如果编辑器第一次获取焦点
         * 滚动到编辑器末尾位置
         * 否则，滚动到编辑器之前的位置
         */
        scrollToTarget: function(isNewRange){
            if(isNewRange){
                this.editorPos.left = 0
                this.editorPos.top = this.$refs.editor.childNodes[this.$refs.editor.childNodes.length - 1].offsetTop
            }
            this.$refs.editor.scrollTo(this.editorPos.left, this.editorPos.top)
        },
        /**
         * 插入html
         * text转换成span插入
         * img，link
         * 编辑器需要重新获取焦点，设置焦点位置为之前离开编辑器时得位置
         * 如果在插入元素之前，编辑器未获得过焦点，则将焦点位置设置为编辑器末尾
         * @param html 要插入的html字符串
         */
        insertHTML: function(html){
            if(window.getSelection){
                // 是否新创建的range -- 是否是光标第一次进入编辑器
                const isNewRange = this.setRange()
                document.execCommand('insertHTML', false, html)
                this.scrollToTarget(isNewRange)
            }else{
                return
            }
        },
        /**
         * 换行
         */
        insertParagraph: function(){
            if(window.getSelection){
                // 是否新创建的range -- 是否是光标第一次进入编辑器
                const isNewRange = this.setRange()
                document.execCommand('InsertParagraph', false, null)
                this.scrollToTarget(isNewRange)
            }else{
                return
            }
        },
        /**
         * 设置焦点
         * 设置焦点为之前离开编辑器时的位置
         * 如果编辑器初次获得焦点，则this.range为空，设置焦点到编辑器末尾，并设置this.range为当前焦点位置
         * @returns 是否初次获得焦点
         */
        setRange: function(){
            this.$refs.editor.focus()
            if(window.getSelection){
                const sel = window.getSelection()
                sel.removeAllRanges()
                if(this.range){
                    sel.addRange(this.range)
                    return false
                }else{
                    sel.selectAllChildren(this.$refs.editor)
                    sel.collapseToEnd()
                    this.range = sel.getRangeAt(0)
                    return true
                }
            }else{
                return false
            }
        },
        createHtmlStr: function(htmlObj){
            let str = ''
            str += '<' + htmlObj.tagName
            if(htmlObj.style){
                str += ' style="'
                for(const key in htmlObj.style){
                    str += key + ':' + htmlObj.style[key] + ';'
                }
                str += '"'
            }
            if(htmlObj.props){
                for(const key in htmlObj.props){
                    str += ' ' + key + '=' + '"' + htmlObj.props[key] + '"'
                }
            }
            str += '>'
            str += htmlObj.innerHTML
            str += '</' + htmlObj.tagName + '>'
            return str
        },
        /**
         * 编辑器失去焦点
         * 保存焦点位置
         * 保存编辑器滚动参数
         */
        editorBlur: function(){
            this.range = this.getRange()
            this.editorPos = this.getEditorPos()
        },
        /**
         * 获取编辑器滚动参数
         */
        getEditorPos: function(){
            return {
                left: this.$refs.editor.scrollLeft,
                top: this.$refs.editor.scrollTop
            }
        },
        /**
         * 获取当前焦点对象
         */
        getRange: function(){
            if(window.getSelection){
                const sel = window.getSelection()
                return sel.getRangeAt(0)
            }else if(document.selection){
                return document.selection.createRange()
            }
            return null
        },
        /**
         * 修改选中文本的fontWeight
         */
        changeTextWeight: function(){
            this.setRange()
            document.execCommand('bold', false, null)
            this.scrollToTarget()
        },
        /**
         * 修改选中文本是否是斜体
         */
        changeTextItalic: function(){
            this.setRange()
            document.execCommand('italic', false, null)
            this.scrollToTarget()
        },
        /**
         * 修改选中文本的align
         */
        changeTextAlign: function(tp){
            this.setRange()
            document.execCommand(tp == 'left' ? 'justifyLeft' : (tp == 'center' ? 'justifyCenter' : 'justifyRight'))
            this.scrollToTarget()
        },
        /**
         * 修改选中文本是否加中横线
         */
        changeTextStrike: function(){
            this.setRange()
            document.execCommand('strikeThrough', false, null)
            this.scrollToTarget()
        },
        /**
         * 修改选中文本是否加下划线
         */
        changeTextUnderline: function(){
            this.setRange()
            document.execCommand('underline', false, null)
            this.scrollToTarget()
        },
        /**
         * 编辑器内容输入事件
         */
        editorInput: function(e){
            // this.changeContent(e.target.innerHTML)
            console.log(e)
        },
        /**
         * 编辑器内容改变触发
         */
        changeContent: function(htmlContent){
            console.log(htmlContent)
            this.$emit('changeContent', htmlContent)
        },
        /**
         * 显示或者隐藏超链接编辑界面
         */
        changeLinkStatu: function(){
            if(!this.showLinkContainer){
                this.showImageContainer = false
                this.showEmojiContainer = false
                this.showVideoContainer = false
                this.showFontSizeContainer = false
            }
            this.showLinkContainer = !this.showLinkContainer
        },
        /**
         * 显示或者隐藏图片编辑界面
         */
        changeImageStatu: function(evt){
            if(!this.showImageContainer){
                this.showEmojiContainer = false
                this.showLinkContainer = false
                this.showVideoContainer = false
                this.showFontSizeContainer = false
            }
            this.showImageContainer = !this.showImageContainer
            this.showImageContainer&&this.$nextTick(function(){
                if(this.$refs.editorBody){
                    let editorBodyHeight = 0
                    const baseFontSize = document.documentElement.style.fontSize.replace('px', '')
                    const editorContentHeight = window.getComputedStyle(this.$refs.editorContent).height.replace('px', '')
                    if(editorContentHeight > baseFontSize * 5){
                        editorBodyHeight = '5rem'
                    }else{
                        editorBodyHeight = editorContentHeight + 'px'
                    }
                    this.$refs.editorBody.style.height = editorBodyHeight
                }
            })
        },
        /**
         * 显示或者隐藏视频编辑区域
         */
        changeVideoStatu: function(evt){
            if(!this.showVideoContainer){
                this.showEmojiContainer = false
                this.showLinkContainer = false
                this.showImageContainer = false
                this.showFontSizeContainer = false
            }
            this.showVideoContainer = !this.showVideoContainer
            this.showVideoContainer&&this.$nextTick(function(){
                if(this.$refs.editorBody){
                    let editorBodyHeight = 0
                    const baseFontSize = document.documentElement.style.fontSize.replace('px', '')
                    const editorContentHeight = window.getComputedStyle(this.$refs.editorContent).height.replace('px', '')
                    if(editorContentHeight > baseFontSize * 5){
                        editorBodyHeight = '5rem'
                    }else{
                        editorBodyHeight = editorContentHeight + 'px'
                    }
                    this.$refs.editorBody.style.height = editorBodyHeight
                }
            })
        },
        /**
         * 显示或者隐藏emoji编辑界面
         */
        changeEmojiStatu: function(evt){
            if(!this.showEmojiContainer){
                this.showImageContainer = false
                this.showLinkContainer = false
                this.showVideoContainer = false
                this.showFontSizeContainer = false
            }
            this.showEmojiContainer = !this.showEmojiContainer
            this.showEmojiContainer&&this.$nextTick(function(){
                if(this.$refs.editorBody){
                    let editorBodyHeight = 0
                    const baseFontSize = document.documentElement.style.fontSize.replace('px', '')
                    const editorContentHeight = window.getComputedStyle(this.$refs.editorContent).height.replace('px', '')
                    if(editorContentHeight > baseFontSize * 5){
                        editorBodyHeight = '5rem'
                    }else{
                        editorBodyHeight = editorContentHeight + 'px'
                    }
                    this.$refs.editorBody.style.height = editorBodyHeight
                }
            })
        },
        /**
         * 显示或者隐藏字号设置
         */
        changeFontSizeStatu: function(evt){
            if(!this.showFontSizeContainer){
                this.showEmojiContainer = false
                this.showImageContainer = false
                this.showLinkContainer = false
                this.showVideoContainer = false
            }
            this.showFontSizeContainer = !this.showFontSizeContainer
        },
        /**
         * 编辑器获得焦点事件
         * 隐藏所有编辑界面
         * emoji，image，link
         */
        editorFocus: function(){
            // this.hideEditorBody()
            this.showEmojiContainer = false
            this.showImageContainer = false
            this.showLinkContainer = false
            this.showVideoContainer = false
        },
        /**
         * 隐藏编辑界面
         */
        hideEditorBody: function(){
            this.showEmojiContainer = false
            // this.showImageContainer = false
            // this.showLinkContainer = false
            this.showFontSizeContainer = false
        },
        /**
         * 获取编辑器内容
         * 提供给父级组件调用
         */
        getContent: function(){
            return this.$refs.editor.innerHTML
        },
        getContentText: function(){
            return this.$refs.editor.innerText
        },
        selectImage: function(){
            this.$refs.imageIpt.click()
        },
        uploadImage: function(){
            console.log(this.$refs.imageIpt.files)
            this.showLoading()
            const formData = new FormData(this.$refs.imageForm)
            request({
                url: setting.urls.uploadImage,
                method: 'post',
                data: formData,
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            }).then(resp => {
                console.log(resp)
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        const imgUrl = (resp.data.data.url.indexOf('http://') == -1 ? 'http://' : '') + resp.data.data.url
                        const imgDom = document.createElement('img')
                        imgDom.onload = () => {
                            const rat = imgDom.height/imgDom.width
                            // TODO
                            // this.insertParagraph()
                            this.insertHTML('<img data-size="' + rat + '" src="' + imgUrl + '"/>');
                            // this.insertParagraph()
                        }
                        imgDom.src = imgUrl
                    }else{
                        this.alert(resp.data.message || '上传图片失败')
                    }
                }else{
                    this.alert('上传图片失败')
                }
            }).catch(e => {
                console.log(e)
                this.alert('上传图片失败')
            }).then(() => {
                this.hideLoading()
                this.$refs.imageIpt.value = ''
                this.showImageContainer = false
            })
        },
        selectVideo: function(){
            this.$refs.videoIpt.click()
        },
        uploadVideo: function(){
            this.showLoading()
            console.log(this.$refs.videoIpt.files)
            const formData = new FormData(this.$refs.videoForm)
            request({
                url: setting.urls.uploadImage,
                method: 'post',
                data:formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(resp => {
                console.log(resp)
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        const videoUrl = (resp.data.data.url.indexOf('http://') == -1 ? 'http://' : '') + resp.data.data.url
                        this.insertHTML('<video src="' + videoUrl + '"></video>');
                    }else{
                        this.alert(resp.data.message || '上传视频失败')
                    }
                }else{
                    this.alert('上传视频失败')
                }
            }).catch(e => {
                this.alert('上传视频失败')
                console.log(e)
            }).then(() => {
                this.hideLoading()
                this.$refs.videoIpt.value = ''
                this.showVideoContainer = false
            })
        }
    },
    computed: {
        initEmoji: function(){
            let idx = 0, count = 0, str = ''
            for(idx = 0; idx < this.emojiArr.length; idx++){
                const item = this.emojiArr[idx]
                if(item.length == 2){
                    const tmp = item[0], tmp1 = item[1]
                    if(tmp.length == 1){
                        const charCode = tmp.charCodeAt(0), charCode1 = tmp1.charCodeAt(0)
                        for(let idxx = charCode; idxx <= charCode1; idxx++){
                            const emoji = String.fromCharCode(idxx)
                            count++
                            str += '<span class="emoji-item">' + emoji + '</span>'
                        }
                    }else if(tmp.length == 2){
                        for(let idxx = tmp.charCodeAt(0); idxx <= tmp1.charCodeAt(0); idxx++){
                            for(let idxxx = tmp.charCodeAt(1); idxxx <= tmp1.charCodeAt(1); idxxx++){
                                const emoji = String.fromCharCode(idxx) + String.fromCharCode(idxxx)
                                count++
                                str += '<span class="emoji-item">' + emoji + '</span>'
                            }
                        }
                    }else if(tmp.length == 3){
                        for(let idxx = tmp.charCodeAt(0); idxx <= tmp1.charCodeAt(0); idxx++){
                            for(let idxxx = tmp.charCodeAt(1); idxxx <= tmp1.charCodeAt(1); idxxx++){
                                for(let idxxxx = tmp.charCodeAt(2); idxxxx <= tmp1.charCodeAt(2); idxxxx++){
                                    const emoji = String.fromCharCode(idxx) + String.fromCharCode(idxxx) + String.fromCharCode(idxxxx)
                                    count++
                                    str += '<span class="emoji-item">' + emoji + '</span>'
                                }
                            }
                        }
                    }
                }else{
                    count++
                    str += '<span class="emoji-item">' + item[0] + '</span>'
                }
            }
            return str
        }
    },
    mounted(){
        // 默认插入一行
        // 否则会造成第一行如果时文本，不会被div包裹，造成显示的结果不正确
        // 当执行InsertParagraph操作时会插入2个空行
        // 所以插入之后再删除第二行
        const isNewRange = this.setRange()
        document.execCommand('InsertParagraph', false, null)
        document.execCommand('Delete', false, null)
        this.scrollToTarget(isNewRange)
    }
}
</script>
<style scoped>
.html-editor { display: flex; flex-direction: column; width: 100%; height: 100%; position: relative; outline: none; }
.html-editor-header { position: relative; left: 0; top: 0; height: 32px; margin: 0; border: 1px solid #d9d9d9; border-bottom: none; background-color: #efeded; box-sizing: border-box; }
.html-editor-act-btns { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; padding: 4.8px; }
.editor-btn { display: block; float: left; width: 22.4px; height: 22.4px; box-sizing: border-box; background-position: center center; background-repeat: no-repeat; background-size: 70% 70%; font: normal normal normal 14px/1 FontAwesome; margin-left: 4.8px; }
.editor-btn.dark { background-color: #999; }
.editor-btn:first-child { margin-left: 0; }
.editor-btn::before { width: 100%; height: 100%; position: relative; left: 0; top: 0; display: block; text-align: center; line-height: 22.4px; }
.editor-btn:hover { border: 1px solid #cccccc; }
.editor-btn:hover::before { line-height: 20.4px; }
.editor-btn.bold::before { content: '\f032'; }
.editor-btn.italic::before { content: '\f033'; }
.editor-btn.alignLeft::before { content: '\f036'; }
.editor-btn.alignCenter::before { content: '\f037'; }
.editor-btn.alignRight::before { content: '\f038'; }
.editor-btn.strikethrough::before { content: '\f0cc'; }
.editor-btn.underline::before { content: '\f0cd'; }
.editor-btn.emoji::before { content: '\f118'; }
.editor-btn.image::before { content: '\f1c5'; }
.editor-btn.link::before { content: '\f0c1'; }
.editor-btn.video::before { content: '\f030'; }
.editor-btn.fontSize::before { content: '\f034'; }
.html-editor-content { width: 100%; height: 0; flex: 1; box-sizing: border-box; border: 1px solid #d9d9d9; border-top: none; padding: 0.2rem; }
.html-editor-content>div { width: 100%; height: 100%; overflow-y: scroll; overflow-wrap: break-word; box-sizing: border-box; outline: none; word-break: break-all; }
.html-editor-body { width: 14.2rem; background-color: #efecec; position: absolute; left: 0; top: 1rem; border: 1px solid #d9d9d9; box-sizing: border-box; overflow: hidden; overflow-y: scroll; }
.emoji-container { width: 100%; }
.upload-btn { height: .75rem; cursor: pointer; line-height: .75rem; display: block; margin: auto; width: 4.5rem; text-align: center; padding: 0rem 0.5rem; background-color: #1414dc; color: white; border-radius: .125rem; }
</style>
<style>
.emoji-item { width: .7rem; height: .7rem; display: block; float: left; box-sizing: border-box; line-height: .7rem; text-align: center; margin-left: .3rem; margin-top: .3rem; cursor: pointer; }
.emoji-item:hover { border: 1px solid #d9d9d9; }
</style>