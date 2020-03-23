<template>
    <div class="html-editor">
        <div class="html-editor-header">
            <div class="html-editor-act-btns">
                <span class="editor-btn bold" v-if="config.actions.bold"></span>
                <span class="editor-btn emoji" v-if="config.actions.emoji"></span>
                <span class="editor-btn image" v-if="config.actions.image"></span>
                <span class="editor-btn link" v-if="config.actions.link"></span>
            </div>
        </div>
        <div class="html-editor-content">
            <div contenteditable="" v-html="htmlText" @input="changeContent"></div>
        </div>
    </div>
</template>
<script>
// import 'font-awesome/css/fontawesome-'

export default {
    props: ['config', 'htmlText'],
    methods: {
        changeContent: function(e){
            console.log(e)
            console.log(e.target.innerHTML)
        }
    }
}
</script>
<style scoped>
.html-editor { display: flex; flex-direction: column; width: 100%; height: 100%; }
.html-editor-header { position: relative; left: 0; top: 0; height: 1rem; margin: 0; border: 1px solid #d9d9d9; border-bottom: none; background-color: #efeded; box-sizing: border-box; }
.html-editor-act-btns { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; padding: .15rem; }
.editor-btn { display: block; float: left; width: .7rem; height: .7rem; box-sizing: border-box; background-position: center center; background-repeat: no-repeat; background-size: 70% 70%; }
.editor-btn::before { width: 100%; height: 100%; position: relative; left: 0; top: 0; display: block; text-align: center; line-height: .7rem; }
.editor-btn:hover { border: 1px solid #d9d9d9; }
.editor-btn.bold::before { content: '\ea62'; }
.editor-btn.emoji::before { content: '\e9df'; }
.editor-btn.image::before { content: '\e90d'; }
.editor-btn.link::before { content: '\e9cb'; }
.html-editor-content { width: 100%; height: 0; flex: 1; }
.html-editor-content>div { width: 100%; height: 100%; overflow-y: scroll; }
</style>