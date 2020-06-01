<template>
    <div class="detail-container">
        <div class="detail-data-box" v-show="!showArticleEditor && !showPreview">
            <header class="search-header">
                <div class="search-group">
                    <label>关键词</label>
                    <input type="text" placeholder="请输入" v-model="keyWord">
                </div>
                <selector class="search-group" :value="status" :selectParams="statusSelectParams" @selectOptsClicked="statusSelectOptsClicked"></selector>
                <selector class="search-group" :value="tag" :selectParams="tagSelectParams" @selectOptsClicked="tagSelectOptsClicked"></selector>
                <button class="action-btn" @click="loadTBData(1)">搜索</button>
                <!-- <button class="action-btn" @click="toManageTag">标签管理</button> -->
                <button class="action-btn" v-if="showAddArticleBtn" @click="addArticle">新建文章</button>
            </header>
            <div class="table-container hideScrollBar">
                <detail-table :tbType="tbType" :tbData="tbData" :tableHeader="tableHeader" @pubArticleClicked="changeArticleStatus" @editArticleClicked="editArticle" @delArticleClicked="changeArticleStatus" @detailBtnClicked="showArticleDetailView"></detail-table>
            </div>
            <page :pageData="pageData" @loadList="loadTBData"></page>
        </div>
        <article-editor :editable="!showArticleDetail" v-if="showArticleEditor" :article="article" :tags="tags" @saveArticle="saveArticle" @cancelEditArticle="cancelEditArticle" @showPreview="showPreviewPane"></article-editor>
        <preview v-if="showPreview" :article="article" @hidePreview="hidePreview"></preview>
        <confirm @confirmClicked="confirmClicked" :isShow="showConfirm" :confirmParams="confirmParams"></confirm>
    </div>
</template>
<script>
import setting from '@/setting'
import request from '@/axios'
import qs from 'qs'
import DetailTable from '@/components/content/table.vue'
import articleEditorVue from '../components/content/articleEditor.vue'
import previewVue from '../components/content/preview.vue'
import selectVue from '../components/common/select.vue'
import pageVue from '../components/content/page.vue'
import confirmVue from '../components/common/confirm.vue'

export default {
    inject: ['reload', 'alert', 'showLoading', 'hideLoading', 'loadContentByUrl'],
    components: {
        'detail-table': DetailTable,
        'article-editor': articleEditorVue,
        'preview': previewVue,
        'selector': selectVue,
        'page': pageVue,
        'confirm': confirmVue
    },
    data(){
        return {
            tbType: 'articleList',
            showConfirm: false,
            showAddArticleBtn: false,
            showArticleDetail: false,
            tbData: [],
            tableHeader: setting.tableHeader.sxyArticle,
            pageData: {
                total: 0,
                page: 1,
                'total_page': 0
            },
            showArticleEditor: false,
            article: {id: null, 'con_title': null, 'con_img': null, 'enum_item_name': null, 'con_status': null, 'con_status_name': null, 'con_type': null, 'dictionary_type': null, 'create_time': null, 'update_time': null, 'create_user_name': null, 'update_user_name': null, 'con_prefix': null, 'con_detail': null, 'dic_id': null, 'video_url': null},
            articles: [],
            status: '',
            tag: '',
            keyWord: '',
            tags: [],
            showPreview: false,
            statusSelectParams: {
                label: '发布状态',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '请选择'
                }, {
                    value: 1,
                    text: '可用'
                }, {
                    value: 2,
                    text: '停用'
                }]
            },
            tagSelectParams: {
                label: '标签',
                placeholder: '请选择',
                options: [{
                    value: '',
                    text: '请选择'
                }]
            },
            confirmParams: {
                type: 'modifyStatus',
                header: '操作提示',
                text: '确定修改标签状态?',
                idx: 0
            },
        }
    },
    created(){
        this.showLoading()
        return Promise.all([
            this.loadTags(),
            this.loadArticleList()
        ]).then(rst => {
            this.tags = rst[0].data || []
            for(let idx = 0; idx < this.tags.length; idx++){
                this.tagSelectParams.options.push({
                    value: this.tags[idx]['enum_item_value'],
                    text: this.tags[idx]['enum_item_name']
                })
            }
            this.createTBData(rst[1])
        }).catch(e => {
            console.log(e)
            this.alert('加载文章数据失败')
        }).then(() => {
            this.hideLoading()
        })
    },
    provide(){
        return {
            removeCurrImage: this.removeImage,
            setImage: this.setImage
        }
    },
    methods: {
        showArticleDetailView(idx){
            this.showArticleDetail = true
            this.editArticle(idx)
        },
        loadArticle(id){
            this.showLoading()
            request({
                url: setting.urls.collegeArticleDetail,
                method: 'get',
                params: {
                    'article_id': id
                }
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.article = rst.data.data
                        for(let idx = 0; idx < this.tags.length; idx++){
                            if(this.tags[idx]['enum_item_name'] == this.article['enum_item_name']){
                                // this.article['dic_id'] = this.tags[idx]['dic_id']
                                if(!this.article.video_url){
                                    this.article = Object.assign(this.article, {'dic_id': this.tags[idx]['dic_id'], 'video_url': null})
                                }else{
                                    this.article = Object.assign(this.article, {'dic_id': this.tags[idx]['dic_id']})
                                }
                                break
                            }
                        }
                        this.showArticleEditor = true
                        this.showPreview = false
                        this.$parent.subTitle2 = this.showArticleDetail ? '文章详情' : '编辑文章'
                    }else{
                        this.alert(rst.data.message || '加载文章详情失败')
                    }
                }else{
                    this.alert('加载文章详情失败')
                }
            }).catch(e => {
                this.alert('加载文章详情失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        loadArticleList(pageNum){
            return new Promise((resolve, reject) => {
                request({
                    url: setting.urls.collegeArticle,
                    method: 'get',
                    params: {
                        'key_words': this.keyWord,
                        'con_status': this.status,
                        'con_type': this.tag,
                        page: pageNum || 1
                    }
                }).then(rst => {
                    if(rst.status == 200){
                        if(rst.data.code == 200){
                            resolve(rst.data.data)
                        }else{
                            reject()
                        }
                    }else{
                        reject()
                    }
                }).catch(e => {
                    reject(e)
                })
            })
        },
        loadTags(){
            return new Promise((resolve, reject) => {
                request({
                    url: setting.urls.collegeLabellist,
                    method: 'get',
                    params: {}
                }).then(rst => {
                    if(rst.status == 200){
                        if(rst.data.code == 200){
                            resolve(rst.data.data)
                        }else{
                            reject()
                        }
                    }else{
                        reject()
                    }
                }).catch(e => {
                    reject(e)
                })
            })
        },
        loadTBData(pageNum){
            this.showLoading()
            this.loadArticleList(pageNum).then(rst => {
                this.createTBData(rst)
            }).catch(e => {
                this.alert('加载文章数据失败')
            }).then(() => {
                this.hideLoading()
            })
        },
        createTBData(dt){
            this.pageData.total = dt.total
            this.pageData.page = dt.page
            this.pageData['total_page'] = dt.total_page || dt.pageCount || 0

            this.showAddArticleBtn = (dt.actions&&dt.actions['article_add'] == 'T') || false

            this.articles = dt.data || []
            const tbData = []
            const fields = ['con_title', 'con_img', 'con_status_name', 'con_type', 'enum_item_name', 'create_time', 'update_time', 'update_user_name']
            for(let idx = 0; idx < dt.data.length; idx++){
                const item = dt.data[idx]
                tbData.push([])
                tbData[idx].push(idx + 1)
                for(let idxx = 0; idxx < fields.length; idxx++){
                    tbData[idx].push(item[fields[idxx]] || '--')
                }
                tbData[idx].push({
                    'article_edit': item['article_edit'] || 'F',
                    'article_open': item['article_open'] || 'F',
                    'article_close': item['article_close'] || 'F'
                })
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
        // toManageTag(){
        //     this.loadContentByUrl('/college/label')
        // },
        addArticle(){
            this.article = {id: null, 'con_title': null, 'con_img': null, 'enum_item_name': null, 'con_status': null, 'con_status_name': null, 'con_type': null, 'dictionary_type': null, 'create_time': null, 'update_time': null, 'create_user_name': null, 'update_user_name': null, 'con_prefix': null, 'con_detail': null, 'dic_id': null, 'video_url': null}
            this.showArticleEditor = true
            this.$parent.subTitle2 = '新增文章'
        },
        editArticle(idx){
            // this.article = Object.assign({}, JSON.parse(JSON.stringify(this.articles[idx])))
            // this.showArticleEditor = true
            // this.$parent.subTitle2 = '编辑文章'
            this.loadArticle(this.articles[idx]['id'])
        },
        confirmClicked(dt){
            this.showConfirm = false
            if(dt){
                this.showLoading()
                request({
                    url: setting.urls.collegeArticleStatus,
                    method: 'get',
                    params: {
                        'article_id': this.articles[dt.idx]['id'],
                        'con_status': this.articles[dt.idx]['con_status'] == 1 ? 2 : 1
                    }
                }).then(rst => {
                    if(rst.status == 200){
                        if(rst.data.code == 200){
                            this.loadTBData(this.pageData.page || 1)
                        }else{
                            this.alert(rst.data.message || '修改文章状态失败')
                        }
                    }else{
                        this.alert('修改文章状态失败')
                    }
                }).catch(e => {
                    this.alert('修改文章状态失败')
                }).then(() => {
                    this.hideLoading()
                })
            }
        },
        changeArticleStatus(idx){
            this.confirmParams.idx = idx
            if(this.articles[idx]['con_status'] == 1){
                this.confirmParams.text = '是否确认隐藏该文章?'
            }else if(this.articles[idx]['con_status'] == 0){
                this.confirmParams.text = '是否确认显示该文章?'
            }
            this.showConfirm = true
        },
        saveArticle(){
            let data = null
            if(!this.article['dictionary_type']){
                this.alert('文章所属标签未选择')
                return
            }
            let checkedTagValue = null
            for(let idx = 0; idx < this.tags.length; idx++){
                if(this.tags[idx]['dic_id'] == this.article['dic_id']){
                    checkedTagValue = this.tags[idx]['enum_item_value']
                }
            }
            if(this.article['dictionary_type'] == 1){
                data = {
                    'con_title': this.article.con_title,
                    'con_image': this.article.con_img,
                    'con_prefix': this.article.con_prefix,
                    'con_detail': this.article.con_detail,
                    'con_type': checkedTagValue
                }
            }else if(this.article['dictionary_type'] == 2){
                data = {
                    'con_title': this.article.con_title,
                    'con_image': this.article.con_img,
                    'video_url': this.article.video_url,
                    'con_type': checkedTagValue
                }
            }
            if(this.article.id) {
                data['con_id'] = this.article.id
            }
            this.showLoading()
            request({
                url: setting.urls.collegeArticleModify,
                method: 'post',
                data: qs.stringify(data)
            }).then(rst => {
                if(rst.status == 200){
                    if(rst.data.code == 200){
                        this.showArticleEditor = false
                        this.showPreview = false
                        this.$parent.subTitle2 = ''
                        this.loadTBData(this.pageData.page || 1)
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
            this.$parent.subTitle2 = ''
            this.showArticleEditor = false
            this.showArticleDetail = false
        },
        removeImage(){
            this.article['con_img'] = null
        },
        setImage(dt){
            this.article['con_img'] = dt.imgUrl
        },
        showPreviewPane(){
            this.showArticleEditor = false
            this.showPreview = true
            this.$parent.subTitle2 = '预览'
        },
        hidePreview(){
            this.showPreview = false
            this.showArticleEditor = true
            this.$parent.subTitle2 = this.article.id ? '编辑文章' : '新增文章'
        }
    }
}
</script>
<style scoped>
.detail-container { background-color: #f2f2f2; padding: 0; margin: 0; overflow-y: scroll; }
.detail-data-box { margin-top: 0; }
</style>