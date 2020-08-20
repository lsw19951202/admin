<template>
    <table>
        <thead>
            <tr>
                <th v-for="(item,index) in theadData" :key="index">{{item.name}}</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,key,index) in tbodyData.data" :key="index">
                <td v-for="(val,index) in theadData" :key="index" style="padding:4px;">
                    <div v-if="val.field == 'img'" style="display: flex;align-items: center;justify-content: center;cursor: pointer;">
                        <img :src="item[val.field]" alt="图片" style="width: 5rem; height: 3rem; border-radius: 5px;" @click="choosePicture(item[val.field])">
                    </div>
                    <div v-else>{{item[val.field]}}</div>
                </td>
                <td style="padding: 0 10px;">
                    <div class="issue" v-if="item.status == '发布中'">
                        <div class="textValue" @click="offShelfBtn(item.id)">下架</div>
                        <!-- <div class="textValue" @click="lookUpBtn(item)">查看</div> -->
                        <div class="textValue" @click="editBtn(item)">编辑</div>
                    </div>
                    <div class="issue" v-else>
                        <div class="textValue" @click="releaseBtn(item.id)">发布</div>
                        <div class="textValue" @click="deleteBtn(item.id)">删除</div>
                        <div class="textValue" @click="editBtn(item)">编辑</div>
                    </div>
                </td>
            </tr>
        </tbody>
        <!-- 图片预览 -->
        <div class="mask" v-if="showImg">
            <div class="alert-mark" @click="closeImg"></div>
            <img :src="imgUrl" alt="图片" class="imgBox">
        </div>
    </table>
</template>

<script>
export default {
    props: ['theadData', 'tbodyData'],
    data(){
        return{
            showImg:false,
            imgUrl:''
        }
    },
    methods:{
        offShelfBtn(id){//下架
            console.log(id,"下架id")
            this.$emit("offShelfEvent",id)
        },
        releaseBtn(id){//发布
            console.log(id,"发布id")
            this.$emit("releaseEvent",id)
        },
        deleteBtn(id){//删除
            console.log(id,"删除id")
            this.$emit("deleteEvent",id)
        },
        choosePicture(url){//查看图片 
            this.imgUrl = url;
            this.showImg = true;
        },
        closeImg(){
            this.showImg=false
        },
        lookUpBtn(item){//查看
            this.$emit('lookUpEvent',item)
        },
        editBtn(item){//编辑
            this.$emit('editEvent',item)
        }
    }
}
</script>

<style scoped>
.issue{height: 30px;display: flex;justify-content: space-around;align-items: center;padding: 0 10px;box-sizing: border-box;}
.textValue{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 5px;}

.alert-mark{width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000000; opacity: .5; z-index: 10001;}
.imgBox{width: 30%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%); z-index: 10002;}
</style>