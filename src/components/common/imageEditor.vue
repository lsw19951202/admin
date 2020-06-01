<template>
    <div class="image-editor">
        <span @click="imageItemClick(idx)" class="image-item" v-for="(image, idx) in (config&&config.maxImageNum ? (config.maxImageNum > 9 ? 9 : config.maxImageNum) : 9)" :key="idx" :style="('background-image: url(' + (images[idx] ? (images[idx].indexOf('http') >= 0 ? images[idx] : ('http://' + images[idx])) : require('@/assets/icon_upload.png')) + ');' + (images[idx] ? ('background-size: cover;'): '')) + (editable ? '' : 'cursor: default;')">
            <span v-if="!images[idx]">图片{{sortNum[idx]}}</span>
            <div class="close-btn" v-if="images[idx] && editable" @click.stop="removeImage(idx)"></div>
        </span>
        <form enctype="multipart/form-data" style="display: none;" ref="fileForm">
            <input type="file" accept=".jpg, .jpeg, .png, .gif" style="display: none;" name="file" ref="files" @change="uploadImage">
        </form>
    </div>
</template>
<script>
import request from '@/axios'
import setting from '@/setting'

export default {
    inject: ['showLoading', 'hideLoading', 'alert', 'removeCurrImage', 'setImage'],
    props: ['images', 'maxImageNum', 'config', 'editable'],
    data: () => {
        return {
            sortNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
            // 上传图片序号,上传完成后重新组件图片数组时需要用到
            uploadIdx: 0
        }
    },
    methods: {
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
            }
        },
        removeImage: function(idx){
            console.log('删除第' + (idx + 1) + '张图片')
            // this.$emit('removeImage', idx)
            this.removeCurrImage(idx)
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
.image-editor { width: 100%; height: 100%; overflow: hidden; display: flex; }
.image-item { box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: .125rem; background-repeat: no-repeat; background-size: auto; background-position: center center; width: 4.1875rem; height: 4.1875rem; position: relative; display: inline-block; cursor: pointer; margin-left: .625rem; }
.image-item:first-child { margin-left: 0; }
.image-item>span { white-space: nowrap; position: absolute; left: 50%; top: 70%; transform: translate(-50%, -50%); color: #999999; font-size: .375rem; }
.close-btn { position: absolute; content: " "; display: block; width: .625rem; height: .625rem; right: .1rem; top: .1rem; background-image: url('../../assets/icon_close.png'); background-size: 100% 100%; background-position: center center; background-repeat: no-repeat; float: none; padding: 0; }
</style>