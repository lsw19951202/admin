<template>
    <div class="detail-data-box preview">
        <div class="preview-body">
            <div class="phone">
                <div v-if="article.dictionary_type == 1">
                    <div class="article-title">{{article.con_title}}</div>
                    <div class="article-info">
                        <div class="pub-date">{{createTime}}</div>
                        <div class="read-num">1234</div>
                    </div>
                    <div class="article-content" v-html="article.con_detail"></div>
                </div>
                <div v-if="article.dictionary_type == 2" style="padding: 14px 0px 10px;">
                    <div class="article-video">
                        <video controls autoplay>
                            <source :src="article.video_url" :type="'video/' + article.video_url.split('.')[article.video_url.split('.').length - 1]">
                        </video>
                    </div>
                    <div class="article-title" style="line-clamp: 1; -webkit-line-clamp: 1;">{{article.con_title}}</div>
                    <div class="article-info">
                        <div class="pub-date">{{createTime}}</div>
                        <div class="read-num">1234</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="preview-footer">
            <button class="action-btn" @click="hidePreview">返回</button>
        </div>
    </div>
</template>
<script>
export default {
    props: ['article'],
    data(){
        const now = new Date()
        const createTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        return {
            createTime
        }
    },
    methods: {
        hidePreview(){
            this.$emit('hidePreview')
        }
    }
}
</script>
<style scoped>
.preview { padding: 0; display: flex; flex-direction: column; }
.preview-header { font-weight: bold; height: 2.34375rem; line-height: 2.34375rem; border-bottom: 1px solid #e6e6e6; font-size: .5625rem; padding-left: 1.125rem; }
.preview-body { flex: 1; height: 0; width: 100%; text-align: center; }
.phone { width: 377px; height: 669px; margin: auto; border: 1px solid #333333; color: #282828; padding: 16px 14px 14px; box-sizing: border-box; text-align: left; overflow-y: scroll; }
.phone::-webkit-scrollbar { display: none; }
.phone>div { max-width: 100% !important; overflow: hidden; }
.phone>div>div { max-width: 100% !important; overflow: hidden; }
.article-title { font-size: 20px; font-weight: bold; line-height: 30px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -moz-box-orient: vertical; line-clamp: 2; -webkit-line-clamp: 2; }
.article-info { margin-top: 12px; height: 17px; line-height: .53125rem; font-size: 12px; color: #686868; display: flex; }
.pub-date { flex: 1; width: 0; height: 100%; text-align: left; }
.read-num { height: 100%; width: auto; position: relative; }
.read-num::before { content: ' '; background-image: url(http://static.yunzhanxinxi.com/find_ic_read@2x.png); background-repeat: no-repeat; background-size: 100% 100%; background-position: center center; display: block; position: absolute; width: 12px; height: 7.875px; left: -16px; top: 4px; }
.article-content { width: 100%; margin-top: 27px; word-break: break-all; font-size: 14px; line-height: 26px; }
.article-content img { width: 100%; }
.article-content>div { width: 100%; }
.article-content>div,.article-content>img { margin-top: 25px; }
.article-content>div:first-child,.article-content>img:first-child { margin-top: 0; }
.article-video { width: 100%; }
video { width: 100%; object-fit: fill; }
.preview-footer { width: 100%; height: 1.25rem; line-height: 1.25rem; text-align: center; }
</style>