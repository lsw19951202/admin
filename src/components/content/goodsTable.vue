<template>
    <table>
        <thead>
            <tr>
                <th><input @click="changeAllGoodsCheckStatu($event)" type="checkbox" :checked="allGoodsChecked"></th>
                <th v-for="(item,index) in newFreeHeader" :key="index">
                    <div v-if="item.name == 'ID'">序号</div>
                    <div v-else>{{item.name}}</div>
                </th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,key,index) in newFreeTbody.data" :key="index">
                <td style="width: 1.5625rem; text-align: center;">
                    <input type="checkbox" @click="shooseStatus(key)" :checked="checkedId.indexOf(item.id) >= 0">
                </td>
                <td v-for="(val,index) in newFreeHeader" :key="index" style="padding:4px;">
                    <div v-if="val.field=='valid_time'" v-html="item[val.field].replace('至','<br/>至<br/>')"></div>
                    <div v-else>{{item[val.field]}}</div>
                </td>
                <td style="padding: 0 10px;" v-if="tableType=='newFree'">
                    <div class="shelfText" @click="offShelf(item.id)" v-if="item.in_show=='发布中'?true:false">下架</div>
                    <div class="issue" v-if="item.in_show=='发布中'?false:true">
                        <div class="textValue" @click="release(item.id)" v-if="item.free_operate == 'T'">发布</div>
                        <div class="textValue" @click="deleteBtn(item.id)">删除</div>
                    </div>
                </td>
                <td style="padding: 0 10px;" v-if="tableType=='highServant'">
                    <div class="shelfText" v-if="item.status=='发布中'?true:false" @click="offShelf(item.id)">下架</div>
                    <div class="issue" v-if="item.status=='发布中'?false:true">
                        <div class="textValue" @click="release(item.id)" v-if="item.high_operate == 'T'">发布</div>
                        <div class="textValue" v-if="item.high_edit == 'T'" @click="highEdit(item)">编辑</div>
                        <div class="textValue" @click="deleteBtn(item.id)">删除</div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>

export default {
    props: ['newFreeHeader','newFreeTbody','checkedId','tableType'],
    data: () => {
        return {
            allGoodsChecked:false
        }
    },
    created(){
        this.getTime('2020-07-28 00:00:00')
        this.getTime('2020-07-22 00:00:00')
    },
    methods:{
        getTime(str){//日期转化为毫秒数，传入字符串格式 yyyy-mm-dd hh:mm:ss
            const data = new Date(str.replace(/-/g,'/'));
            const time1 = data.getTime()
            console.log(time1)
        },
        offShelf(id){
            this.$emit("offShelfEvent",id)
        },
        release(id){
            this.$emit("releaseEvent",id)
        },
        deleteBtn(id){
            this.$emit("deleteEvent",id)
        },
        shooseStatus(key){
            this.$emit('shooseStatusEvent',key)
            this.allGoodsChecked = false
        },
        highEdit(e){
            this.$emit("editEvent",e)
        },
        changeAllGoodsCheckStatu: function(e){
            this.allGoodsChecked = true
            const checked = e.target.checked
            console.log("全选",checked)
            for(let idx = 0; idx < this.newFreeTbody.data.length; idx++){
                if(checked){
                    if(this.checkedId.indexOf(this.newFreeTbody.data[idx].id) == -1){
                        this.checkedId.push(this.newFreeTbody.data[idx].id)
                    }
                }else{
                    if(this.checkedId.indexOf(this.newFreeTbody.data[idx].id) >= 0){
                        this.checkedId.splice(this.checkedId.indexOf(this.newFreeTbody.data[idx].id), 1)
                    }
                }
            }
        },
    }
}
</script>
<style scoped>
.shelfText{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 auto;padding: 0;}
.issue{height: 30px;display: flex;justify-content: space-around;align-items: center;padding: 0 10px;box-sizing: border-box;}
.textValue{width: 40px;height: 25px;line-height: 25px;text-align: center;background-color: #4880EA;color: #ffffff;border-radius: 3px;cursor: pointer;margin: 0 5px;}
</style>