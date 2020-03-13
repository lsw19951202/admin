<template>
    <div v-show="isShow">
        <div class="loadMarkPane"></div>
        <div class="loadAniPane">
            <div class="loadAniContent">
                <div class="loadAniBody">
                    <div style="width: 100%;">
                        <div style="text-align: center;">
                            <div class="spinner">
                                <div class="rect1"></div>
                                <div class="rect2"></div>
                                <div class="rect3"></div>
                                <div class="rect4"></div>
                                <div class="rect5"></div>
                            </div>
                        </div>
                    </div>
                    <span class="loading-span">{{text || '数据加载中...'}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['isShow', 'text']
}
</script>