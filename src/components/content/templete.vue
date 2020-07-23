<template>
    <div class="pageEditor">
        <div class="tempSelectBox">
            <div class="header">
                选择模板
            </div>
            <div class="tempBox">
                <div class="tempList">
                    <div class="tempItem">
                        <div class="header">
                            <input id="temp0" type="radio" name="tempSelectRadio" value="0" v-model="templete">
                            <label for="temp0">模板1</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pageEditBody">
            <div class="header">
                中间页配置
                <div>
                    <input id="createNewRadio" type="radio" name="isCreateNew" value="1" v-model="isCreateNew">
                    <label for="createNewRadio">新建</label>
                </div>
                <div>
                    <input id="selectOldRadio" type="radio" name="isCreateNew" value="0" v-model="isCreateNew">
                    <label for="selectOldRadio">选择已有中间页</label>
                </div>
            </div>
            <div class="body">
                <div v-if="isCreateNew == 1" class="pageEditBox">
                    <div class="edit-group need">
                        <label>中间页标题</label>
                        <input type="text" v-model="title">
                    </div>
                    <div class="edit-group need">
                        <label>所属平台</label>
                        <select v-model="platform">
                            <option value="tb">淘宝</option>
                            <option value="jd">京东</option>
                            <option value="pdd">拼多多</option>
                            <option value="vph">唯品会</option>
                        </select>
                    </div>
                    <div class="edit-group need">
                        <label>活动链接</label>
                        <input type="text" v-model="jump_url">
                    </div>
                    <div class="edit-gourp need" v-if="platform == 'jd'">
                        <label>短链接</label>
                        <input type="text" v-model="short_url">
                    </div>
                    <div class="edit-group need">
                        <label>文案</label>
                        <input type="text" v-model="copywriting">
                    </div>
                    <div class="edit-group tips">
                        <label></label>
                        <div>文案格式:'好物天天购,复制{{}},打开tb,天猫超市每天抢'</div>
                    </div>
                    <div class="edit-group need">
                        <label>页面背景色</label>
                        <input type="text" v-model="bg_color">
                    </div>
                    <div class="edit-group need">
                        <label>边框颜色</label>
                        <input type="text" v-model="border_color">
                    </div>
                    <div class="edit-group" style="height: 50px;">
                        <label>描述</label>
                        <textarea v-model="desc" placeholder="描述该中间页面背景/用途，仅作为内部说明，不会展示到APP界面" cols="" rows="2"></textarea>
                    </div>
                    <div class="edit-group need editImg">
                        <label>背景图片</label>
                        <div>
                            <input class="action-btn" type="button" value="上传" @click.prevent.stop="selectBgImg" v-if="!bg_img">
                            <img :src="bg_img" v-if="bg_img">
                        </div>
                    </div>
                    <div class="edit-group tips">
                        <label></label>
                        <div>
                            文件大小300k以下，尺寸750*?
                        </div>
                    </div>
                    <div class="edit-group need editImg">
                        <label>按钮图片</label>
                        <div>
                            <input class="action-btn" type="button" value="上传" @click.prevent.stop="selectBtnImg" v-if="!button_img">
                            <img :src="button_img" v-if="button_img">
                        </div>
                    </div>
                    <div class="edit-group tips">
                        <label></label>
                        <div>
                            文件大小35k以下，尺寸614*?
                        </div>
                    </div>
                    <div class="edit-group">
                        <label></label>
                        <div class="preview">
                            <input type="button" class="action-btn" value="预览">
                        </div>
                    </div>
                </div>
                <div v-if="isCreateNew == 0" class="pageEditBox">
                    <div class="edit-group need">
                        <label>选择中间页</label>
                        <select v-model="pageId">
                            <option value="0">第一个</option>
                            <option value="1">第二个</option>
                            <option value="2">第三个</option>
                            <option value="3">第四个</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['editable', 'pageData', 'pageList'],
    data(){
        return {
            templete: 0,
            isCreateNew: 1,
            pageId: '',
            title: '',
            platform: '',
            'jump_url': '',
            'short_url': '',
            copywriting: '',
            'bg_color': '',
            'border_color': '',
            desc: '',
            'bg_img': '',
            'button_img': ''
        }
    },
    methods: {
        getPageData(){
            if(this.isCreateNew == 1){
                return {
                    title: this.title,
                    platform: this.platform,
                    'jump_url': this.jump_url,
                    'short_url': this.short_url,
                    copywriting: this.copywriting,
                    'bg_color': this.bg_color,
                    'border_color': this.border_color,
                    desc: this.desc,
                    'bg_img': this.bg_img,
                    'button_img': this.button_img
                }
            }else{
                return this.pageId
            }
        }
    }
}
</script>
<style lang="less" scoped>
.pageEditor {
    background-color: white;
    width: 100%;
    height: fit-content;
    position: relative;
    .tempSelectBox {
        width: 100%;
        height: fit-content;
        overflow: hidden;
        background-color: #F4F4F4;
        .header {
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: left;
            font-size: 15px;
        }
        .tempBox {
            width: 100%;
            height: fit-content;
            overflow: hidden;
            overflow-x: scroll;
            .tempList {
                height: fit-content;
                .tempItem {
                    width: 64px;
                    height: 20px;
                    line-height: 20px;
                    margin-right: 10px;
                    display: inline-block;
                    .header {
                        width: 100%;
                        height: 20px;
                        line-height: 20px;
                        input {
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
        .tempBox::-webkit-scrollbar {
            display: none;
        }
    }
    .pageEditBody {
        width: 100%;
        padding-top: 10px;
        .header {
            width: 100%;
            text-align: left;
            font-size: 15px;
            div {
                display: inline-block;
                margin-left: 10px;
                input {
                    margin-right: 5px;
                }
            }
        }
        .body {
            width: 100%;
            .pageEditBox {
                width: 100%;
                margin-top: 10px;
                height: fit-content;
                .edit-group {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 13px;
                    display: flex;
                    box-sizing: border-box;
                    margin-bottom: 8px;
                    label {
                        width: 90px;
                        text-align: right;
                        margin-right: 8px;
                        overflow: hidden;
                        height: 40px;
                        line-height: 40px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        padding-right: 10px;
                        position: relative;
                    }
                    input, select, textarea {
                        width: 480px;
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid #DDDDDD;
                        box-sizing: border-box;
                        padding-left: 8px;
                        padding-right: 8px;
                    }
                    input.action-btn {
                        width: 80px;
                    }
                    textarea {
                        resize: none;
                        height: 50px;
                        line-height: 25px;
                    }
                    select {
                        appearance: menulist;
                    }
                    .preview {
                        width: 50%;
                        text-align: center;
                    }
                }
                .edit-group.need {
                    label::after {
                        content: '*';
                        color: red;
                        font-size: 15px;
                        display: block;
                        width: 10px;
                        text-align: center;
                        height: 40px;
                        line-height: 40px;
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                }
                .edit-group.tips {
                    height: 20px;
                    line-height: 20px;
                    text-align: left;
                    color: red;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>