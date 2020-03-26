<!-- 暂时只兼容chrome, edge, sofari, opera, ff 和ie高版本 -->
<!-- ie低版本未作测试，建议使用高版本或者其它浏览器 -->
<template>
    <div class="html-editor" tabindex="1" @blur="hideEditorBody">
        <div class="html-editor-header">
            <div class="html-editor-act-btns">
                <span :class="'editor-btn bold ' + (contentBold?'dark':'')" @click="changeTextWeight" v-if="!config || !config.actions || config.actions.bold || config.actions.bold == undefined"></span>
                <span :class="'editor-btn italic ' + (contentItalic?'dark':'')" @click="changeTextItalic" v-if="!config || !config.actions || config.actions.italic || config.actions.italic == undefined"></span>
                <span :class="'editor-btn alignLeft ' + (contentAlignLeft?'dark':'')" @click="changeTextAlign('left')" v-if="!config || !config.actions || config.actions.alignLeft || config.actions.alignLeft == undefined"></span>
                <span :class="'editor-btn alignCenter ' + (contentAlignCenter?'dark':'')" @click="changeTextAlign('center')" v-if="!config || !config.actions || config.actions.alignCenter || config.actions.alignCenter == undefined"></span>
                <span :class="'editor-btn alignRight ' + (contentAlignRight?'dark':'')" @click="changeTextAlign('right')" v-if="!config || !config.actions || config.actions.alignRight || config.actions.alignRight == undefined"></span>
                <span :class="'editor-btn strikethrough ' + (contentStrikethrough?'dark':'')" @click="changeTextStrike" v-if="!config || !config.actions || config.actions.strikethrough || config.actions.strikethrough == undefined"></span>
                <span :class="'editor-btn underline ' + (contentUnderline?'dark':'')" @click="changeTextUnderline" v-if="!config || !config.actions || config.actions.underline || config.actions.underline == undefined"></span>
                <span class="editor-btn emoji" @click="changeEmojiStatu" v-if="!config || !config.actions || config.actions.emoji || config.actions.emoji == undefined"></span>
                <span class="editor-btn image" @click="changeImageStatu" v-if="!config || !config.actions || config.actions.image || config.actions.image == undefined"></span>
                <span class="editor-btn link" @click="changeLinkStatu" v-if="!config || !config.actions || config.actions.link || config.actions.link == undefined"></span>
            </div>
        </div>
        <div class="html-editor-body" ref="editorBody" v-if="showEmojiContainer || showImageContainer || showLinkContainer">
            <div class="emoji-container" ref="emojiContainer" v-if="showEmojiContainer">
                <div v-html="initEmoji" @click="emojiItemClicked"></div>
            </div>
            <div class="image-container" ref="imageContainer" v-if="showImageContainer">
                <div>
                    <label>选中本地图片:</label>
                    <input type="file" accept=".jpeg, .jpg, .png, .gif">
                </div>
            </div>
            <div class="link-container" ref="linkContainer" v-if="showLinkContainer">
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
                    <input type="checkbox" v-model="linkToBlank">
                </div>
            </div>
        </div>
        <div class="html-editor-content" ref="editorContent">
            <div contenteditable="" v-html="htmlText" @input.prevent="editorInput" @focus="editorFocus" @blur="editorBlur" ref="editor"></div>
        </div>
    </div>
</template>
<script>
import 'font-awesome/css/font-awesome.min.css'

export default {
    props: ['config', 'htmlText'],
    data: () => {
        return {
            // 控制emoji,image,link的编辑界面的显示
            showEmojiContainer: false,
            showImageContainer: false,
            showLinkContainer: false,
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
            linkToBlank: false
        }
    },
    created: function(){
        document.addEventListener('selectionchange', this.selectionChange)
    },
    destroyed: function(){
        document.removeEventListener('selectionchange', this.selectionChange)
    },
    methods: {
        /**
         * 当选中内容发生改变时
         * 根据选中内容修改编辑器头部样式按钮的选中状态
         */
        selectionChange: function(evt){
            const range = this.getRange()
            let srcElement = null
            let bold = true, italic = true, alignLeft = true, alignCenter = true, alignRight = true, strikethrough = true, underline = true
            if(window.getSelection){
                srcElement = range.commonAncestorContainer
            }else{
                srcElement = range.parentElement()
            }
            if(this.$refs.editor.contains(srcElement)){
                // 如果光标开始和结束是同一节点内
                if(range.startContainer == range.endContainer){
                    console.log('光标在一个节点内')
                    // 选中的是text元素，元素是编辑器的直接子元素
                    // 所以没有任何样式
                    if(range.startContainer.parentElement == this.$refs.editor){
                        bold = false
                        italic = false
                        alignLeft = true
                        alignCenter = false
                        alignRight = false
                        strikethrough = false
                        underline = false
                    }else{
                        // 光标所在的text元素不是编辑器的直接子元素
                        const rst = this.computeSingleNodeStyle(range.startContainer.parentElement)
                        bold = rst.bold
                        italic = rst.italic
                        alignLeft = rst.alignLeft
                        alignCenter = rst.alignCenter
                        alignRight = rst.alignRight
                        strikethrough = rst.strikethrough
                        underline = rst.underline
                    }
                }else{
                    console.log('光标在多个节点内')
                    const lines = this.getSelectedLines(range)
                    // 遍历所有选中的行
                    for(let idx = 0; idx < lines.length; idx++){
                        // 只有元素节点有样式
                        if(lines[idx].nodeType == 1){
                            const rst = this.computeSingleNodeStyle(lines[idx])
                            alignLeft = alignLeft && rst.alignLeft
                            alignCenter = alignCenter && rst.alignCenter
                            alignRight = alignRight && rst.alignRight
                        }else{
                            alignLeft = false
                            alignCenter = false
                            alignRight = false
                        }
                    }
                }
                console.log('--------------')
                console.log('bold:' + bold)
                console.log('italic:' + italic)
                console.log('textAlign:' + (alignLeft ? 'left' : (alignCenter ? 'center' : 'right')))
                console.log('strikethrough:' + strikethrough)
                console.log('underline:' + underline)
                this.contentBold = bold
                this.contentItalic = italic
                this.contentAlignLeft = alignLeft
                this.contentAlignCenter = alignCenter
                this.contentAlignRight = alignRight
                this.contentStrikethrough = strikethrough
                this.contentUnderline = underline
            }
        },
        /**
         * 获取选中的所有段落----光标所在的所有编辑器的直接子元素
         */
        getSelectedLines: function(range){
            // 编辑器的所有直接子节点
            const editorChildren = this.$refs.editor.childNodes
            const lines = []
            let node = range.startContainer
            let currIdx = 0
            for(let idx = 0; idx < editorChildren.length; idx++){
                if(editorChildren[idx].contains(node)){
                    currIdx = idx
                    node = editorChildren[currIdx]
                    lines.push(node)
                    break
                }
            }
            do{
                node = editorChildren[++currIdx]
                if(node.nodeType == 1 && node.tagName.toLowerCase() == 'br'){
                    console.log('换行')
                }else{
                    lines.push(node)
                }
            }while(node && !node.contains(range.endContainer))
            return lines
        },
        /**
         * 获取可编辑div中，指定节点的下一个节点
         * 1、如果当前节点是父节点的最后一个子节点
         * 1.1 返回父节点的下一个兄弟节点的第一个最深的子节点或者父节点
         * 2、否则直接返回当前节点的下一个兄弟节点的最深子节点或者兄弟节点本身
         * @param node
         * @returns nextNode
         */
        getNextNode: function(node){
            // if(node == this.$refs.editor){
            //     return
            // }
            const parent = node.nodeType == 3 ? node.parentElement : node
            for(let idx = 0; idx < parent.childNodes.length; idx++){
                if(parent.childNodes[idx] == node){
                    if(idx == parent.childNodes.length - 1){
                        return this.getNextNode(parent)
                    }else{
                        return this.getFirstSubNode(parent.childNodes[idx + 1])
                    }
                }
            }
        },
        /**
         * 获取节点的第一个子节点
         * 
         * 如果node有子节点，返回第一个子节点
         * 如果node没有子节点，返回node
         * 
         * @param node
         * @returns 第一个子节点或者node
         */
        getFirstSubNode: function(node){
            if(node.childNodes.length > 0){
                return this.getFirstSubNode(node.childNodes[0])
            }else{
                return node
            }
        },
        /**
         * 遍历parent的所有子节点
         * 
         * @param parent
         * @returns 
         */
        computedStyle: function(parent){
            const children = parent.children
            let rst = {
                bold: true,
                italic: true,
                alignLeft: true,
                alignCenter: true,
                alignRight: true,
                strikethrough: true,
                underline: true
            }
            if(children.length > 0){
                for(let idx = 0; idx < children.length; idx++){
                    const computedStyle = this.computedStyle(children[idx])
                    rst = this.mergeStyle(rst, computedStyle)
                }
            }else{
                const computedStyle = window.getComputedStyle(parent)
                rst = this.mergeStyle(rst, computedStyle)
            }
            console.log(parent)
            console.log(rst)
            return rst
        },
        /**
         * 获取当前节点的样式
         * 如果是编辑器的直接子节点，直接返回当前节点的样式
         * 否则，text-align以及text-decoration样式需要判断上级
         *      text-align的根据编辑器的直接子节点判断
         *      text-decoration如果有一个父节点有，则认为当前节点有
         */
        computeSingleNodeStyle: function(node){
            let computedStyle = window.getComputedStyle(node)
            const rst = {
                bold: computedStyle.fontWeight == 700,
                italic: computedStyle.fontStyle == 'italic',
                alignLeft: computedStyle.textAlign == 'left' || computedStyle.textAlign == 'start',
                alignCenter: computedStyle.textAlign == 'center',
                alignRight: computedStyle.textAlign == 'right',
                strikethrough: computedStyle.textDecorationLine == 'line-through',
                underline: computedStyle.textDecorationLine == 'underline'
            }
            let parentNode = node.parentElement
            while(parentNode != this.$refs.editor){
                computedStyle = window.getComputedStyle(parentNode)
                rst.alignLeft = computedStyle.textAlign == 'left' || computedStyle.textAlign == 'start'
                rst.alignCenter = computedStyle.textAlign == 'center'
                rst.alignRight = computedStyle.textAlign == 'right'
                rst.strikethrough = rst.strikethrough || (computedStyle.textDecorationLine == 'line-through')
                rst.underline = rst.underline || (computedStyle.textDecorationLine == 'underline')
                parentNode = parentNode.parentElement
            }
            return rst
        },
        mergeStyle: function(oldStyle, newStyle){
            return {
                bold: oldStyle.bold && (newStyle.bold || (newStyle.fontWeight == 700)),
                italic: oldStyle.italic && (newStyle.italic || (newStyle.fontSize == 'italic')),
                alignLeft: oldStyle.alignLeft && (newStyle.alignLeft || (newStyle.textAlign == 'left') || (newStyle.textAlign == 'start')),
                alignCenter: oldStyle.alignCenter && (newStyle.alignCenter || (newStyle.textAlign == 'center')),
                alignRight: oldStyle.alignRight && (newStyle.alignRight || (newStyle.textAlign == 'right')),
                strikethrough: oldStyle.strikethrough && (newStyle.strikethrough || (newStyle.textDecorationLine == 'line-through')),
                underline: oldStyle.underline && (newStyle.underline || (newStyle.textDecorationLine == 'underline'))
            }
        },
        emojiItemClicked: function(e){
            const target = e.target
            if(target.className == 'emoji-item'){
                this.addEmoji(target.innerText)
                this.showEmojiContainer = false
            }
        },
        addEmoji: function(emoji){
            this.$refs.editor.focus()
            this.insertHtmlAtCaret({
                tagName: 'span',
                innerHTML: emoji
            })
        },
        insertHtmlAtCaret: function(htmlObj){
            if(window.getSelection){
                const dom = this.createHtmlDom(htmlObj)
                const sel = window.getSelection()
                sel.removeAllRanges()
                if(this.range){
                    sel.addRange(this.range)
                    this.range.deleteContents()
                    this.range.insertNode(dom)
                }else{
                    sel.selectAllChildren(this.$refs.editor)
                    sel.collapseToEnd()
                    this.range = sel.getRangeAt(0)
                    this.range.insertNode(dom)
                    this.editorPos.left = 0
                    this.editorPos.top = dom.offsetTop
                }
                sel.collapseToEnd()
                // this.changeContent(this.$refs.editor.innerHTML)
            }//else if(document.selection && document.selection.type != "Control"){
                // const htmlStr = this.createHtmlStr(htmlObj)
                // if(!this.range){
                    //     this.range = document.selection.createRange()
                //     this.range.moveToElementText(this.$refs.editor)
                //     this.range.collapse(false)
                //     this.range.select()
                // }
                // this.range.pasteHTML(htmlStr)
            // }
            this.$refs.editor.scrollTo(this.editorPos.left, this.editorPos.top)
        },
        createHtmlDom: function(htmlObj){
            const dom = document.createElement(htmlObj.tagName)
            dom.innerHTML = htmlObj.innerHTML
            if(htmlObj.style){
                for(const key in htmlObj.style){
                    dom.style[key] = htmlObj.style[key]
                }
            }
            if(htmlObj.props){
                for(const key in htmlObj.props){
                    dom[key] = htmlObj.props[key]
                }
            }
            return dom
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
        setCaretPosition: function(pos){
            if(this.$refs.editor.setSelectionRange){
                this.$refs.editor.setSelectionRange(pos, pos)
            }else if(this.$refs.editor.createTextRange){
                console.log(123)
            }
        },
        editorBlur: function(){
            this.range = this.getRange()
            this.editorPos = this.getEditorPos()
        },
        getEditorPos: function(){
            return {
                left: this.$refs.editor.scrollLeft,
                top: this.$refs.editor.scrollTop
            }
        },
        getRange: function(){
            if(window.getSelection){
                const sel = window.getSelection()
                return sel.getRangeAt(0)
            }else if(document.selection){
                return document.selection.createRange()
            }
            return null
        },
        getCursorPos: function(){
            let cursorPos = 0
            if(document.selection){
                const range = document.selection.createRange()
                range.moveStart('character', -this.$refs.editor.innerHTML.length)
                cursorPos = range.text.length
            }else if(this.$refs.editor.selectionStart || this.$refs.editor.selectionStart == '0'){
                cursorPos = this.$refs.editor.selectionStart
            }
            this.cursorPos = cursorPos
            console.log(cursorPos)
        },
        changeTextWeight: function(){
            console.log('changeTextWeight')
        },
        changeTextItalic: function(){
            console.log('italic')
        },
        changeTextAlign: function(tp){
            console.log('align')
        },
        changeTextStrike: function(){
            console.log('strike')
        },
        changeTextUnderline: function(){
            console.log('underline')
        },
        editorInput: function(e){
            // this.changeContent(e.target.innerHTML)
            console.log(e)
        },
        changeContent: function(htmlContent){
            console.log(htmlContent)
            this.$emit('changeContent', htmlContent)
        },
        changeLinkStatu: function(){
            if(!this.showLinkContainer){
                this.showImageContainer = false
                this.showEmojiContainer = false
            }
            this.showLinkContainer = !this.showLinkContainer
        },
        changeImageStatu: function(evt){
            if(!this.showImageContainer){
                this.showEmojiContainer = false
                this.showLinkContainer = false
            }
            this.showImageContainer = !this.showImageContainer
            this.showImageContainer&&this.$nextTick(function(){
                if(this.$refs.editorBody){
                    // let editorBodyHeight = 0
                    const baseFontSize = document.documentElement.style.fontSize.replace('px', '')
                    // const editorContentHeight = window.getComputedStyle(this.$refs.editorContent).height.replace('px', '')
                    // console.log(evt)
                }
            })
        },
        changeEmojiStatu: function(evt){
            if(!this.showEmojiContainer){
                this.showImageContainer = false
                this.showLinkContainer = false
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
        editorFocus: function(){
            this.hideEditorBody()
        },
        hideEditorBody: function(){
            this.showEmojiContainer = false
            this.showImageContainer = false
            this.showLinkContainer = false
        },
        getContent: function(){
            return this.$refs.editor.innerHTML
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
.html-editor-content { width: 100%; height: 0; flex: 1; box-sizing: border-box; border: 1px solid #d9d9d9; border-top: none; padding: 0.2rem; }
.html-editor-content>div { width: 100%; height: 100%; overflow-y: scroll; overflow-wrap: break-word; box-sizing: border-box; outline: none; word-break: break-all; line-height: 1rem; }
.html-editor-body { width: 14.2rem; background-color: #efecec; position: absolute; left: 0; top: 1rem; border: 1px solid #d9d9d9; box-sizing: border-box; overflow: hidden; overflow-y: scroll; }
.emoji-container { width: 100%; }
</style>
<style>
.emoji-item { width: .7rem; height: .7rem; display: block; float: left; box-sizing: border-box; line-height: .7rem; text-align: center; margin-left: .3rem; margin-top: .3rem; cursor: pointer; }
.emoji-item:hover { border: 1px solid #d9d9d9; }
</style>