<template>
    <div class="detail-data-box material-editor">
        <div class="editor-header">新增/修改素材</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>所属标签</label>
                <div>
                    <select v-model="material.material_type" :disabled="!editable">
                        <option :value="label.value" v-for="(label, idx) in materialLabelList" :key="idx">{{label.text}}</option>
                    </select>
                </div>
            </div>
            <div class="editor-groups" style="flex: 1; height: 0;">
                <label>素材详情</label>
                <div>
                    <html-editor :htmlText="material.material_detail" :config="htmlEditorConfig" :editable="editable"></html-editor>
                </div>
            </div>
            <div class="editor-groups">
                <label>生效时间</label>
                <div>
                    <flat-picker v-model="material.start_time" class="search-time-picker" :config="dateConfig" :disabled="!editable"></flat-picker>
                    到
                    <flat-picker v-model="material.end_time" class="search-time-picker" :config="dateConfig" :disabled="!editable"></flat-picker>
                </div>
            </div>
            <div class="editor-groups" style="height: 5.94375rem;">
                <label>图片上传</label>
                <div>
                    <span>(最多上传9张,点击相应位置上传图片)</span>
                    <image-editor :ewmEditable="ewmEditable" :ewm_img_index="material.ewm_img_index" :config="imageConfig" :images="material.image_list" :editable="editable"></image-editor>
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" v-if="editable" @click="saveMaterial">确认</button>
                    <button class="action-btn" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import htmlEditorVue from '../common/htmlEditor.vue'
import imageEditorVue from '../common/imageEditor.vue'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'

export default {
    props: ['material', 'editable', 'materialLabelList', 'ewmEditable'],
    components: {
        'html-editor': htmlEditorVue,
        'image-editor': imageEditorVue,
        'flat-picker': flatPicker
    },
    data: () => {
        return {
            dateConfig: {
                locale: Mandarin,
                dateFormat: 'Y-m-d H:i:S',
                enableTime: true,
                'time_24hr': true
            },
            htmlEditorConfig: {
                actions: {
                    bold: false,
                    italic: false,
                    alignLeft: false,
                    alignCenter: false,
                    alignRight: false,
                    strikethrough: false,
                    underline: false,
                    emoji: true,
                    image: false,
                    link: false,
                    video: false,
                    fontSize: false
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
            this.$parent.material['material_detail'] = this.$children[0].getContent()
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
.editor-groups input.search-time-picker { width: 7.5rem; }
</style>