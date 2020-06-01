<template>
    <div class="detail-data-box tag-editor">
        <div class="editor-header">新增/编辑标签</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>标签名称</label>
                <div>
                    <input type="text" v-model="tag.enum_item_name" :disabled="tag.dic_id != null">
                </div>
            </div>
            <div class="editor-groups" v-if="tag.dic_id != null">
                <label>标签新名称</label>
                <div>
                    <input type="text" v-model="newTagName">
                </div>
            </div>
            <div class="editor-groups" v-if="tag.dic_id == null">
                <label>标签类型</label>
                <div>
                    <select v-model="tag.dictionary_type">
                        <option value="1">文本</option>
                        <option value="2">视频</option>
                    </select>
                </div>
            </div>
            <div class="editor-groups">
                <label>标签排序</label>
                <div>
                    <input type="text" v-model="tag.sort" :disabled="tag.dic_id != null">
                </div>
            </div>
            <div class="editor-groups" v-if="tag.dic_id != null">
                <label>新排序</label>
                <div>
                    <input type="text" v-model="newSort">
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" @click="saveTag">保存</button>
                    <button class="action-btn cancel-btn" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['tag'],
    inject: ['alert'],
    data: () => {
        return {
            newTagName: '',
            newSort: ''
        }
    },
    methods: {
        saveTag: function(){
            if(this.tag.dic_id != null){
                this.$emit('saveTag', {tagName: this.newTagName || this.tag.enum_item_name, sort: this.newSort || this.tag.sort || 1})
            }else{
                if(!this.tag.enum_item_name || !this.tag.sort || ! this.tag.dictionary_type){
                    this.alert('标签名称、标签排序和标签类型必填')
                    return
                }
                this.$emit('saveTag')
            }
        },
        cancelEdit: function(){
            this.$emit('cancelEditTag')
        }
    }
}
</script>
<style scoped>
.tag-editor { padding: 0; color: #333333; }
.editor-header { font-weight: bold; height: 2.34375rem; line-height: 2.34375rem; border-bottom: 1px solid #e6e6e6; font-size: .5625rem; padding-left: 1.125rem; }
.editor-body { height: 0; flex: 1; padding: .75rem 1.125rem; display: flex; flex-direction: column; overflow: hidden; overflow-y: scroll; }
.editor-groups { width: 100%; height: 1.25rem; line-height: 1.25rem; display: flex; margin-top: .625rem; font-size: .4375rem; }
.editor-groups:first-child { margin-top: 0; }
.editor-groups label { width: 3.0625rem; height: 100%; line-height: 1.25rem; }
.editor-groups>div { flex: 1; height: 100%; width: 0; }
.editor-groups input,.editor-groups select { font-size: .4375rem; width: 15.9375rem; height: 100%; line-height: 1.25rem; border: 1px solid #d9d9d9; border-radius: .125rem; padding: .3125rem; box-sizing: border-box; }
.editor-groups select { -webkit-appearance: menulist; }
</style>