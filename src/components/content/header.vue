<template>
    <header class="content-title">{{title}}/<span>{{subTitle1}}/</span>{{subTitle2}}</header>
</template>
<script>
export default {
    props: ['title', 'subTitle1', 'subTitle2']
}
</script>