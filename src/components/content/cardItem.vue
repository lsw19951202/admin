<template>
    <div class="card-item">
        <div class="card-item-img">
            <img :src="imgSrc">
        </div>
        <div class="card-item-content">
            <div class="card-item-amount">{{num}}</div>
            <div class="card-item-desc">{{text}}</div>
        </div>
    </div>
</template>
<script>
import Setting from '@/setting'

export default {
    props: ['num', 'text', 'imgSrc']
}
</script>