<template>
    <div class="detail-data-box article-editor">
        <div class="editor-header">新增/修改文章</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>所属标签</label>
                <div>
                    <select v-model="article.tag">
                        <option v-for="(tag, idx) in tags" :key="idx" :value="tag">{{tag.tagName}}</option>
                    </select>
                </div>
            </div>
            <div class="editor-groups">
                <label>标题</label>
                <div>
                    <input type="text" placeholder="请输入文章标题" v-model="article.title">
                </div>
            </div>
            <div class="editor-groups" v-if="article.tag.type">
                <label>概述</label>
                <div>
                    <input type="text" placeholder="四十个字以内，多出的用省略号...">
                </div>
            </div>
            <div class="editor-groups" v-if="article.tag.type">
                <label>正文编辑</label>
                <div>
                    <html-editor :htmlText="article.content" :config="htmlEditorConfig"></html-editor>
                </div>
            </div>
            <div class="editor-groups" v-if="article.tag.type">
                <label>视频</label>
                <div>
                    <div class="video-ck-btn" v-if="!article.video"></div>
                    <form enctype="multipart/form-data" style="display: none;" ref="videoForm">
                        <input type="file" ref="videoIpt" @change="uploadVideo" accept=".mp4, .ogg, .mpeg, .3gp" name="files">
                    </form>
                    <video :src="article.video" v-if="article.video"></video>
                </div>
            </div>
            <div class="editor-groups" v-if="article.tag.type">
                <label>封面图片</label>
                <div>
                    <image-editor :config="imageConfig" :images="[article.img]"></image-editor>
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" @click="saveArticle">保存</button>
                    <button class="action-btn" @click="previewArticle">预览</button>
                    <button class="action-btn" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import htmlEditor from '@/components/common/htmlEditor.vue'
import imageEditor from '@/components/common/imageEditor.vue'
import request from '@/axios'
import setting from '../../setting'

export default {
    props: ['article', 'tags'],
    inject: ['showLoading', 'hideLoading', 'alert'],
    components: {
        'html-editor': htmlEditor,
        'image-editor': imageEditor
    },
    data(){
        return {
            htmlEditorConfig: {
                actions: {
                    bold: true,
                    italic: true,
                    alignLeft: true,
                    alignCenter: true,
                    alignRight: true,
                    strikethrough: true,
                    underline: true,
                    emoji: true,
                    image: true,
                    link: false,
                    video: false,
                    fontSize: true
                }
            },
            imageConfig: {
                maxImageNum: 1
            }
        }
    },
    methods: {
        saveArticle(){
            this.$parent.article.content = this.$children[0].getContent()
            this.$emit('saveArticle')
        },
        cancelEdit(){
            this.$emit('cancelEditArticle')
        },
        previewArticle(){
            console.log('preview')
            const screenWidth = window.screen.width, screenHeight = window.screen.height
            if(this.article.tag.type == 1){
                window.open('http://static.yunzhanxinxi.com/video.html?title=', null, 'height=568, width=320, top=' + ((screenHeight - 568) / 2) + ', left=' + ((screenWidth - 320) / 2) + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
            }else if(this.article.tag.type == 2){
                window.open('http://static.yunzhanxinxi.com/article.html?title=', null, 'height=568, width=320, top=' + ((screenHeight - 568) / 2) + ', left=' + ((screenWidth - 320) / 2) + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
            }
        },
        selectArticle(){
            console.log('selectArticle')
            this.$refs.videoIpt.click()
        },
        uploadArticle(){
            console.log('uploadArticle')
            this.showLoading()
            const formData = new FormData(this.$refs.videoForm)
            request({
                url: setting.urls.uploadImage,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        const videoUrl = rst.data.data.prxUrl + rst.data.data.fileName
                        this.article.video = videoUrl
                    }else{
                        this.alert(rst.data.message || '上传视频失败')
                    }
                }else{
                    this.alert('上传视频失败')
                }
            }).catch(e => {
                this.alert('上传视频失败')
            }).then(() => {
                this.hideLoading()
                this.$refs.videoIpt.value = ''
            })
        }
    }
}
</script>
<style scoped>
.article-editor { padding: 0; color: #333333; }
.editor-header { font-weight: bold; height: 2.34375rem; line-height: 2.34375rem; border-bottom: 1px solid #e6e6e6; font-size: .5625rem; padding-left: 1.125rem; }
.editor-body { height: 0; flex: 1; padding: .75rem 1.125rem; display: flex; flex-direction: column; overflow: hidden; overflow-y: scroll; }
.editor-groups { width: 100%; height: 1.25rem; line-height: 1.25rem; display: flex; margin-top: .625rem; font-size: .4375rem; }
.editor-groups:first-child { margin-top: 0; }
.editor-groups label { width: 3.0625rem; height: 100%; line-height: 1.25rem; }
.editor-groups>div { flex: 1; height: 100%; width: 0; }
.editor-groups input,.editor-groups select { font-size: .4375rem; width: 15.9375rem; height: 100%; line-height: 1.25rem; border: 1px solid #d9d9d9; border-radius: .125rem; padding: .3125rem; box-sizing: border-box; }
.editor-groups select { -webkit-appearance: menulist; }
</style>