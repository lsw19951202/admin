<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showArticleEditor">
            <header class="search-header">
                <div class="search-group">
                    <label>关键词</label>
                    <input type="text" placeholder="请输入" v-model="keyWord">
                </div>
                <selector class="search-group" :value="status" :selectParams="statusSelectParams" @selectOptsClicked="statusSelectOptsClicked"></selector>
                <selector class="search-group" :value="tag" :selectParams="tagSelectParams" @selectOptsClicked="tagSelectOptsClicked"></selector>
                <button class="action-btn" @click="loadTBData(1)">搜索</button>
                <button class="action-btn" @click="toManageTag">标签管理</button>
                <button class="action-btn" @click="addArticle">新建文章+</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @changeStatus="changeStatus" @editArticle="editArticle" @delArticle="delArticle"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
        </div>
        <article-editor v-if="showArticleEditor" :article="article" @saveArticle="saveArticle" @cancelEditArticle="cancelEditArticle"></article-editor>
    </div>
</template>
<script>
import setting from '@/setting'
import request from '@/axios'
import qs from 'qs'
import DetailTable from '@/components/content/table.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadContentByUrl'],
    components: {
        'detail-table': DetailTable
    },
    data(){
        return {
            tbType: 'articleList',
            tbData: [],
            tableHeader: setting.tableHeader.sxyArticle,
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            showArticleEditor: false,
            article: {},
            articles: [],
            status: '',
            tag: '',
            keyWord: '',
            tags: []
        }
    },
    created(){
        this.loadTags()
        this.loadTBData(1)
    },
    provide(){
        return {
            removeCurrImage: this.removeImage,
            setImage: this.setImage
        }
    },
    methods: {
        loadTags(){
            this.showLoading()
            request({
                url: '',
                method: 'get',
                params: {}
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.tags = rst.data.data
                    }else{
                        this.alert(rst.data.message || '加载标签失败')
                    }
                }else{
                    this.alert('加载标签数据失败')
                }
            }).catch(e => {
                this.alert('加载标签数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadTBData(pageNum){
            this.showLoading()
            request({
                url: '',
                method: 'get',
                params: {
                    keyWord: this.keyWord,
                    status: this.status,
                    tag: this.tag,
                    page: pageNum || 1
                }
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.createTBData(rst.data)
                    }else{
                        this.alert(rst.data.message || '加载文章列表失败')
                    }
                }else{
                    this.alert('加载文章列表失败')
                }
            }).catch(e => {
                this.alert('加载文章列表失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            this.articles = dt.data || []
            const tbData = []
            const fields = ['title', 'img', 'status', 'type', 'tag', 'createTime', 'updateTime', 'adderId']
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                tbData[idx].push((idx < 9 ? '0' : '') + (idx + 1))
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || '--')
                }
            }
            this.tbData = Object.assign([], tbData)
        },
        statusSelectOptsClicked(dt){
            this.status = dt
        },
        tagSelectOptsClicked(dt){
            this.tag = dt
        },
        // 跳转到标签管理
        toManageTag(){
            this.loadContentByUrl('/sxy/article')
        },
        addArticle(){
            this.article = {id: null, type: null}
            this.showArticleEditor = true
            this.$parent.subTitle2 = '新增文章'
        },
        editArticle(idx){
            this.article = Object.assign({}, JSON.parse(JSON.stringify(this.articles[idx])))
            this.showArticleEditor = true
            this.$parent.subTitle2 = '编辑文章'
        },
        delArticle(idx){
            this.showLoading()
            request({
                url: '',
                method: 'get',
                params: {
                    id: this.articles[idx]['id']
                }
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.loadTBData(this.pageData.page || 1)
                    }else{
                        this.alert(rst.data.message || '删除文章失败')
                    }
                }else{
                    this.alert('删除文章失败')
                }
            }).catch(e => {
                this.alert('删除文章失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        saveArticle(){
            this.showLoading()
            request({
                url: '',
                method: 'post',
                data: qs.stringify(this.article)
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.loadTBData(this.pageData.page || 1)
                        this.showArticleEditor = false
                    }else{
                        this.alert(rst.data.message || '保存文章失败')
                    }
                }else{
                    this.alert('保存文章失败')
                }
            }).catch(e => {
                this.alert('保存文章失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        cancelEditArticle(){
            this.showArticleEditor = false
        },
        removeImage(){
            this.article.img = ''
        },
        setImage(dt){
            this.article.img = dt.imgUrl
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>