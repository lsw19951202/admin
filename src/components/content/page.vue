<template>
    <div class="pages-container">
        共搜索到<span class="pages-rows">{{pageData.total}}</span>条数据
        <div class="pages-btns">
            <div :class="'pageBtn prev' + (pageData.page == 1?' disabled':'')" @click="loadPrevPage">&lt;</div>
            <div :class="'pageBtn' + ((n + fromPage - 1) == pageData.page?' checked':'')" v-for="n in (toPage - fromPage + 1)" v-bind:key="n" @click="loadList(n + fromPage - 1)">{{n + fromPage - 1}}</div>
            <div :class="'pageBtn next' + (pageData.page == pageData.total_page?' disabled':'')" @click="loadNextPage">&gt;</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['pageData'],
    data: () => {
        return {
            // fromPage: 1,
            // toPage: 1
        }
    },
    methods: {
        loadPrevPage: function(){
            if(this.pageData.page == 1){
                this.$parent.alert('已经是第一页')
                return
            }
            this.loadList(this.pageData.page - 1)
        },
        loadNextPage: function(){
            if(this.pageData.page >= this.pageData.total_page){
                this.$parent.alert('已经是最后一页')
                return
            }
            this.loadList(this.pageData.page - 0 + 1)
        },
        loadList: function(pageNum){
            this.$emit('loadList', pageNum)
        }
    },
    computed: {
        fromPage: function(){
            console.log(this.pageData)
            let page = 1;
            if(this.pageData.total_page > 9){
                if(this.pageData.page <= 5){
                    page = 1
                }else if(this.pageData.total_page - this.pageData.page <= 4){
                    page = this.pageData.total_page - 8
                }else{
                    page = this.pageData.page - 4
                }
            }else{
                page = 1
            }
            console.log(page)
            return page
        },
        toPage: function(){
            let page = 9
            if(this.pageData.total_page > 9){
                if(this.pageData.page <= 5){
                    page = 9
                }else if(this.pageData.total_page - this.pageData.page <= 4){
                    page = this.pageData.total_page - 0
                }else{
                    page = this.pageData.page - 0 + 4
                }
            }else{
                page = (this.pageData.total_page - 0) || 1
            }
            console.log(page)
            return page
        }
    }
}
</script>