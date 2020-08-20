<template>
    <div class="image-editor">
        <div style="display: flex; width: 100%; height: auto;">
            <span @click.prevent.stop="imageItemClick(idx)" class="image-item" v-for="(image, idx) in (config&&config.maxImageNum ? (config.maxImageNum > 9 ? 9 : config.maxImageNum) : 9)" :key="idx" :style="('background-image: url(' + (images[idx] ? (images[idx].indexOf('http') >= 0 ? images[idx] : ('http://' + images[idx])) : require('@/assets/icon_upload.png')) + ');' + (images[idx] ? ('background-size: cover;'): '')) + (editable ? '' : 'cursor: default;')">
                <span v-if="!images[idx]">图片{{sortNum[idx]}}</span>
                <div class="close-btn" v-if="images[idx] && editable" @click.stop="removeImage(idx)"></div>
            </span>
        </div>
        <div class="cbs" v-if="ewmEditable">
            <div class="ewm-checkbox" v-for="(img, idx) in (config&&config.maxImageNum ? (config.maxImageNum > 9 ? 9 : config.maxImageNum) : 9)" :key="idx">
                <slot v-if="images[idx]">
                    <input type="checkbox" :id="'ewmCb' + idx" :value="idx" @change.prevent.stop="checkboxClicked(idx)" :checked="ewm_img_index == idx" :disabled="!editable">
                    <label :for="'ewmCb' + idx">添加二维码</label>
                </slot>
            </div>
        </div>
        <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
            <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
        </form>
        <div class="cover" @click.prevent.stop="hidePreview" v-show="showPreviewPane"></div>
        <div class="preview-image" v-show="showPreviewPane">
            <img :src="previewImage">
        </div>
    </div>
</template>
<script>
import request from '@/axios'
import setting from '@/setting'

export default {
    inject: ['showLoading', 'hideLoading', 'alert', 'removeCurrImage', 'setImage'],
    props: ['images', 'maxImageNum', 'config', 'editable', 'ewmEditable', 'ewm_img_index'],
    data: () => {
        return {
            sortNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
            // 上传图片序号,上传完成后重新组件图片数组时需要用到
            uploadIdx: 0,
            previewImage: '',
            showPreviewPane: false
        }
    },
    methods: {
        checkboxClicked(idx){
            console.log('二维码选中状态切换====' + idx)
            if(this.$parent.material.ewm_img_index == idx){
                this.$parent.material['ewm_img_index'] = -1
            }else{
                this.$parent.material['ewm_img_index'] = idx
            }
        },
        hidePreview(){
            this.showPreviewPane = false
        },
        /**
         * 图片框点击
         * 打开文件夹
         * 选择图片
         */
        imageItemClick: function(idx){
            if(this.editable){
                // console.log('上传第' + (idx + 1) + '张图片')
                this.uploadIdx = idx
                // console.log(this.$refs.files)
                this.$refs.files.click()
            }else{
                if(this.images[idx]){
                    this.previewImage = this.images[idx]
                    this.showPreviewPane = true
                }
            }
        },
        removeImage: function(idx){
            console.log('删除第' + (idx + 1) + '张图片')
            // this.$emit('removeImage', idx)
            this.removeCurrImage(idx)
            if(this.$parent.material['ewm_img_index'] == idx){
                this.$parent.material['ewm_img_index'] = -1
            }
        },
        uploadImage: function(){
            this.showLoading()
            console.log('upload image')
            console.log(this.$refs.files.files)
            const formData = new FormData(this.$refs.fileForm)
            console.log(formData)
            request({
                url: setting.urls.uploadImage,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((resp) => {
                console.log(resp)
                if(resp.status == 200){
                    if(resp.data.code == 200){
                        const imgUrl = (resp.data.data.url.indexOf('http://') == -1 ? 'http://' : '') + resp.data.data.url
                        // this.$emit('', {imgUrl: imgUrl, idx: this.uploadIdx})
                        this.setImage({imgUrl: imgUrl, idx: this.uploadIdx})
                    }else{
                        this.alert(resp.data.message || '上传图片失败')
                    }
                }else{
                    this.alert('上传图片失败')
                }
            }).catch((e) => {
                console.log(e)
                this.alert('上传图片失败')
            }).then(() => {
                this.hideLoading()
                this.$refs.files.value = ''
            })
        }
    }
}
</script>
<style scoped>
.image-editor { width: 100%; height: 100%; overflow: hidden; }
.image-item { box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: .125rem; background-repeat: no-repeat; background-size: auto; background-position: center center; width: 4.1875rem; height: 4.1875rem; position: relative; display: inline-block; cursor: pointer; margin-left: .625rem; }
.image-item:first-child { margin-left: 0; }
.image-item>span { white-space: nowrap; position: absolute; left: 50%; top: 70%; transform: translate(-50%, -50%); color: #999999; font-size: .375rem; }
.close-btn { position: absolute; content: " "; display: block; width: .625rem; height: .625rem; right: .1rem; top: .1rem; background-image: url('../../assets/icon_close.png'); background-size: 100% 100%; background-position: center center; background-repeat: no-repeat; float: none; padding: 0; }
.preview-image { width: 400px; height: auto; z-index: 10000; left: 50%; top: 50%; transform: translate(-50%, -50%); position: fixed; }
.preview-image>img {
    width: 100%;
    height: auto;
}
</style>
<style lang="less" scoped>
.cbs {
    width: 100%;
    height: .625rem;
    display: flex;
    .ewm-checkbox {
        width: 4.1875rem;
        margin-left: .625rem;
        text-align: center;
        height: 100%;
        line-height: .625rem;
        box-sizing: border-box;
        input {
            margin-right: .1rem;
        }
    }
    .ewm-checkbox:first-child {
        margin-left: 0;
    }
}
</style>