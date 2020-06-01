<template>
    <div class="detail-data-box article-editor">
        <div class="editor-header">新增/修改文章</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>所属标签</label>
                <div>
                    <select v-model="article.dic_id">
                        <option v-for="(tag, idx) in tags" :key="idx" :value="tag.dic_id">{{tag.enum_item_name}}</option>
                    </select>
                </div>
            </div>
            <div class="editor-groups">
                <label>标题</label>
                <div>
                    <input type="text" placeholder="请输入文章标题" v-model="article.con_title">
                </div>
            </div>
            <div class="editor-groups" v-if="article.dictionary_type == 1">
                <label>概述</label>
                <div>
                    <input type="text" placeholder="四十个字以内，多出的用省略号..." v-model="article.con_prefix">
                </div>
            </div>
            <div class="editor-groups" style="flex: 1; height: 0;" v-if="article.dictionary_type == 1">
                <label>正文编辑</label>
                <div>
                    <html-editor :htmlText="article.con_detail" :config="htmlEditorConfig"></html-editor>
                </div>
            </div>
            <div class="editor-groups" style="height: 5.21875rem;" v-if="article.dictionary_type == 2">
                <label>视频</label>
                <div>
                    <div class="video-ck-btn" v-if="!article.video_url" @click="selectVideo"></div>
                    <form enctype="multipart/form-data" style="display: none;" ref="videoForm">
                        <input type="file" ref="videoIpt" @change="uploadVideo" accept=".mp4, .ogg, .mpeg, .3gp, .rm, .rmvb" name="file">
                    </form>
                    <video v-if="article.video_url" controls autoplay>
                        <source :src="article.video_url" :type="'video/' + article.video_url.split('.')[article.video_url.split('.').length - 1]">
                    </video>
                </div>
            </div>
            <div class="editor-groups" style="height: 5.21875rem;">
                <label>封面图片</label>
                <div>
                    <image-editor :config="imageConfig" :images="[article.con_img]"></image-editor>
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
            if(this.article['dictionary_type'] == 1){
                this.article['con_detail'] = (this.$children[0].getContent&&this.$children[0].getContent()) || (this.$children[1].getContent&&this.$children[1].getContent())
            }
            this.$emit('saveArticle')
        },
        cancelEdit(){
            this.$emit('cancelEditArticle')
        },
        previewArticle(){
            if(this.article['dictionary_type'] == 1){
                this.article['con_detail'] = (this.$children[0].getContent&&this.$children[0].getContent()) || (this.$children[1].getContent&&this.$children[1].getContent())
            }
            this.$emit('showPreview')
        },
        selectVideo(){
            console.log('selectVideo')
            this.$refs.videoIpt.click()
        },
        uploadVideo(){
            console.log('uploadVideo')
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
                        const videoUrl = (rst.data.data.url.indexOf('http://') == -1 ? 'http://' : '') + rst.data.data.url
                        this.article['video_url'] = videoUrl
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
    },
    watch: {
        'article.dic_id': function(nVal){
            let tag = null
            for(let idx = 0; idx < this.tags.length; idx++){
                if(this.tags[idx]['dic_id'] == nVal){
                    tag = this.tags[idx]
                    break
                }
            }
            this.article['dictionary_type'] = tag.dictionary_type
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
.video-ck-btn { box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: .125rem; background-repeat: no-repeat; background-size: auto; background-position: center center; width: 4.1875rem; height: 4.1875rem; position: relative; cursor: pointer; background-image: url(../../assets/icon_upload.png); }
video { height: 100%; }
</style>