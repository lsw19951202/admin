<template>
<div class="push-editor detail-data-box">
    <div class="editor-header">新增/修改PUSH</div>
    <div class="editor-body hideScrollBar">
        <div class="editor-groups necessary">
            <label>标题</label>
            <div>
                <input type="text" v-model="pushObj.title" :disabled="!editable">
            </div>
        </div>
        <div class="editor-groups necessary" style="height: 6rem;">
            <label>push文案</label>
            <div>
                <html-editor style="width: 25rem;" :htmlText="pushObj.text" :editable="editable" :config="htmlEditorConfig"></html-editor>
            </div>
        </div>
        <div class="editor-groups" style="height: 4rem;">
            <label>描述</label>
            <div>
                <textarea style="width: 25rem; height: 4rem;" :disabled="!editable" v-model="pushObj.desc" placeholder="请简要描述该弹窗背景/用途等，仅作为内部说明。将不会展示到APP界面。50字以内.非必填项。"></textarea>
            </div>
        </div>
        <div class="editor-groups necessary" style="height: auto;">
            <label>push规则</label>
            <div>
                <push-rule-editor :pushObj="pushObj" :pushPage="pushPage" :editable="editable"></push-rule-editor>
            </div>
        </div>
        <div class="editor-groups">
            <label>当前状态</label>
            <div>
                <div style="color: red;">{{pushObj.status == 1 ? '发布中' : pushObj.status == 2 ? '已下架' : '待发布'}}</div>
            </div>
        </div>
        <div class="editor-groups">
            <label></label>
            <div>
                <button class="action-btn" style="background-color: #ccc; color: #333;" @click.prevent.stop="$parent.cancelEdit">取消</button>
                <button class="action-btn" @click.prevent.stop="$parent.savePushObj">确定</button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import htmlEditorVue from '../common/htmlEditor.vue'
import pushRuleEditorVue from './pushRuleEditor.vue'

export default {
    props: ['editable', 'pushObj', 'pushPage'],
    data(){
        return {
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
            }
        }
    },
    components: {
        'html-editor': htmlEditorVue,
        'push-rule-editor': pushRuleEditorVue
    },
    methods: {
        getText(){
            for(let idx = 0; idx < this.$children.length; idx++){
                if(this.$children[idx].$el.className == 'html-editor'){
                    return this.$children[idx].getContent()
                }
            }
        },
        getPushRule(){
            for(let idx = 0; idx < this.$children.length; idx++){
                if(this.$children[idx].$el.className == 'push-rule-editor'){
                    return this.$children[idx].getPushRule()
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.push-editor {
    padding: 0;
    color: #333333;
    .editor-header {
        font-weight: bold;
        height: 2.34375rem;
        line-height: 2.34375rem;
        border-bottom: 1px solid #e6e6e6;
        font-size: .5625rem;
        padding-left: 1.125rem;
    }
    .editor-body {
        height: 0;
        flex: 1;
        padding: .75rem 1.125rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-y: auto;
        .editor-groups {
            width: 100%;
            height: 1.25rem;
            line-height: 1.25rem;
            display: flex;
            margin-top: .625rem;
            font-size: .4375rem;
            label {
                width: 3.0625rem;
                height: 100%;
                line-height: 1.25rem;
            }
            div {
                input {
                    font-size: .4375rem;
                    width: 15.9375rem;
                    height: 100%;
                    line-height: 1.25rem;
                    border: 1px solid #d9d9d9;
                    border-radius: .125rem;
                    padding: .3125rem;
                    box-sizing: border-box;
                }
                textarea {
                    resize: none;
                    height: 100%;
                    border: 1px solid #d9d9d9;
                    border-radius: .125rem;
                    padding: .3125rem;
                    box-sizing: border-box;
                }
            }
        }
        .editor-groups>div {
            width: 0;
            flex: 1;
            height: 100%;
        }
        .necessary {
            label {
                position: relative;
            }
            label::after {
                content: '*';
                color: red;
                display: inline-block;
                position: absolute;
                font-size: .4375rem;
            }
        }
        .editor-groups:first-child {
            margin-top: 0;
        }
    }
}
</style>