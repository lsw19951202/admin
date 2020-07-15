<template>
    <div class="detail-data-box material-label-editor">
        <div class="editor-header">新增/修改标签</div>
        <div class="editor-body hideScrollBar">
            <div class="editor-groups">
                <label>标签名称</label>
                <div>
                    <input type="text" placeholder="请输入标签名称" v-model="materialLabel.enum_item_name" :disabled="materialLabel.dic_id">
                </div>
            </div>
            <div class="editor-groups" v-if="materialLabel.dic_id">
                <label>标签新名称</label>
                <div>
                    <input type="text" placeholder="请输入新名称" v-model="label_name">
                </div>
            </div>
            <div class="editor-groups">
                <label>排序</label>
                <div>
                    <input type="text" placeholder="请输入排序" v-model="materialLabel.sort" :disabled="materialLabel.dic_id">
                </div>
            </div>
            <div class="editor-groups" v-if="materialLabel.dic_id">
                <label>新排序</label>
                <div>
                    <input type="text" placeholder="请输入新排序" v-model="sort">
                </div>
            </div>
            <div class="editor-groups">
                <label></label>
                <div>
                    <button class="action-btn" @click="saveMaterialLabel" v-if="editable">保存</button>
                    <button class="action-btn" @click="cancelEdit">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['materialLabel', 'editable'],
    data(){
        return {
            'label_name': '',
            sort: null
        }
    },
    methods: {
        saveMaterialLabel(){
            if(this.materialLabel['dic_id']){
                this.$emit('saveMaterialLabel', {'label_name': this.label_name, 'sort': this.sort, 'dic_id': this.materialLabel['dic_id']})
            }else{
                this.$emit('saveMaterialLabel')
            }
            this.$data['label_name'] = ''
            this.sort = null
        },
        cancelEdit(){
            this.$emit('cancelEdit')
        }
    }
}
</script>
<style scoped>
.material-label-editor { padding: 0; color: #333333; }
.editor-header { font-weight: bold; height: 2.34375rem; line-height: 2.34375rem; border-bottom: 1px solid #e6e6e6; font-size: .5625rem; padding-left: 1.125rem; }
.editor-body { height: 0; flex: 1; padding: .75rem 1.125rem; display: flex; flex-direction: column; overflow: hidden; overflow-y: scroll; }
.editor-groups { width: 100%; height: 1.25rem; line-height: 1.25rem; display: flex; margin-top: .625rem; font-size: .4375rem; }
.editor-groups:first-child { margin-top: 0; }
.editor-groups label { width: 3.0625rem; height: 100%; line-height: 1.25rem; }
.editor-groups>div { flex: 1; height: 100%; width: 0; }
.editor-groups input,.editor-groups select { font-size: .4375rem; width: 15.9375rem; height: 100%; line-height: 1.25rem; border: 1px solid #d9d9d9; border-radius: .125rem; padding: .3125rem; box-sizing: border-box; }
</style>