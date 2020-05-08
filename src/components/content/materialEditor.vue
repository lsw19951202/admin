<template>
    <div class="detail-data-box material-editor">
        <div class="editor-header">新增/修改素材</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>素材类别</label>
                <div>
                    <input type="text" placeholder="请输入" v-model="material.type">
                </div>
            </div>
            <div class="editor-groups">
                <label>关键字</label>
                <div>
                    <input type="text" placeholder="请输入" v-model="material.keyWord">
                </div>
            </div>
            <div class="editor-groups">
                <label>素材标题</label>
                <div>
                    <input type="text" placeholder="请输入" v-model="material.title">
                </div>
            </div>
            <div class="editor-groups">
                <label>素材状态</label>
                <div>
                    <select v-model="material.status">
                        <option value="0">停用</option>
                        <option value="1">启用</option>
                    </select>
                </div>
            </div>
            <div class="editor-groups" style="flex: 1; height: 0;">
                <label>素材内容</label>
                <div>
                    <html-editor :htmlText="material.detail" :config="htmlEditorConfig" ></html-editor>
                </div>
            </div>
            <div class="editor-groups" style="height: 5.21875rem;">
                <label>图片上传</label>
                <div>
                    <span>(最多上传9张,点击相应位置上传图片)</span>
                    <image-editor :config="imageConfig" :images="material.imgs"></image-editor>
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" @click="saveMaterial">确认</button>
                    <button class="action-btn" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import htmlEditorVue from '../common/htmlEditor.vue'
import imageEditorVue from '../common/imageEditor.vue'
export default {
    props: ['material'],
    components: {
        'html-editor': htmlEditorVue,
        'image-editor': imageEditorVue
    },
    data: () => {
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
                    video: true,
                    fontSize: true
                }
            },
            imageConfig: {
                maxImageNum: 9
            }
        }
    },
    methods: {
        saveMaterial: function(){
            // console.log(this.$children[0].getContent())
            this.$parent.material.detail = this.$children[0].getContent()
            this.$emit('saveMaterial')
            // console.log(this.material)
        },
        cancelEdit: function(){
            this.$emit('cancelEditMaterial')
        }//,
        // changeDetail: function(htmlStr){
        //     this.$emit('changeDetail', htmlStr)
        // }, 
        // removeImage: function(idx){
            // this.$emit('removeImage', idx)
            // this.material.imgs.splice(idx, 1)
            // this.material.imgs.slice(idx, '')
        // }
    }
}
</script>
<style scoped>
.material-editor { padding: 0; color: #333333; }
.editor-header { font-weight: bold; height: 2.34375rem; line-height: 2.34375rem; border-bottom: 1px solid #e6e6e6; font-size: .5625rem; padding-left: 1.125rem; }
.editor-body { height: 0; flex: 1; padding: .75rem 1.125rem; display: flex; flex-direction: column; overflow: hidden; overflow-y: scroll; }
.editor-groups { width: 100%; height: 1.25rem; line-height: 1.25rem; display: flex; margin-top: .625rem; font-size: .4375rem; }
.editor-groups:first-child { margin-top: 0; }
.editor-groups label { width: 3.0625rem; height: 100%; line-height: 1.25rem; }
.editor-groups>div { flex: 1; height: 100%; width: 0; }
.editor-groups input,.editor-groups select { font-size: .4375rem; width: 15.9375rem; height: 100%; line-height: 1.25rem; border: 1px solid #d9d9d9; border-radius: .125rem; padding: .3125rem; box-sizing: border-box; }
.editor-groups select { -webkit-appearance: menulist; }
</style>