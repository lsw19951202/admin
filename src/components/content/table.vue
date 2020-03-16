<template>
    <table cellspacing="0" ref="table">
        <thead :class="tableHeaderFixed?'theadFixed':''" ref="thead">
            <tr v-for="(row, index) in tableHeader" v-bind:key="index">
                <td v-for="(col, idx) in row" v-bind:key="idx" :colspan="col.colspan">
                    {{col.name}}
                    <div v-if="col.canSort" class="sort">
                        <span :class="'asc' + (sortType == 'asc' ? ' hover' : '')" @click="sortTBData('asc', col.sortBy)"></span>
                        <span :class="'desc' + (sortType == 'desc' ? ' hover' : '')" @click="sortTBData('desc', col.sortBy)"></span>
                    </div>
                </td>
            </tr>
        </thead>
        <tbody v-if="tbType=='user'" ref="tbody">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index">
                <td>{{tbRow.user_name}}</td>
                <td>{{tbRow.user_real_name}}</td>
                <td>{{tbRow.role}}</td>
                <td>{{tbRow.is_super == 1?'是':'否'}}</td>
                <td>{{tbRow.create_time}}</td>
                <td>
                    <button v-if="tbRow.action.edit_user == 'T'" @click="editBtnClicked(index)" class="action-btn edit-btn">编辑</button>
                    <button v-if="tbRow.action.modify_pw == 'T'" @click="modifyBtnClicked(index)" class="action-btn modify-btn">修改密码</button>
                    <button v-if="tbRow.action.delete_user == 'T'" @click="delBtnClicked(index)" class="action-btn del-btn">删除</button>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType=='role'" ref="tbody">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index">
                <td>{{tbRow.name}}</td>
                <td>{{tbRow.create_time}}</td>
                <td>
                    <button v-if="tbRow.action.role_edit == 'T'" @click="editBtnClicked(index)" class="action-btn edit-btn">编辑</button>
                    <button v-if="tbRow.action.role_delete == 'T'" @click="delBtnClicked(index)" class="action-btn del-btn">删除</button>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'permission'" ref="tbody">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index" :class="tbRow.tp=='主菜单'?'main-menu':(tbRow.tp=='权限菜单'?'effect-menu':'auth-menu')">
                <td>{{tbRow.url}}</td>
                <td>{{tbRow.tp}}</td>
                <td>{{tbRow.name}}</td>
                <td>
                    <button v-if="tbRow.delete_action == 'T'" @click="delBtnClicked(index)" class="action-btn del-btn">删除</button>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'capital'" ref="tbody">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index">
                <td v-for="(tbCol, idx) in tbRow" v-bind:key="idx">{{tbCol}}</td>
                <td>
                    <button @click="loadCapitalDetail(tbRow)" class="action-btn edit-btn">查看</button>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'common'" :style="tableBodyClick?'cursor: pointer;':''" :class="tableHeaderFixed?'scrollable':''" ref="tbody" @click.prevent.stop="tableBodyClicked($event)">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index" :class="getRowClass(index)" :title="getRowTitle(index)">
                <td v-for="(tbCol, idx) in tbRow" v-bind:key="idx">{{tbCol}}</td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'handdata'" ref="tbody">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index">
                <td v-for="(tbCol, idx) in tbRow" v-bind:key="idx">{{tbCol}}</td>
                <td>
                    <a style="color: #4880EA; font-size: 0.375rem; cursor: pointer;" @click="showHandDetail(tbRow)">查看详情</a>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>

export default {
    props: ['tableHeader', 'tbData', 'tbType', 'tableHeaderFixed', 'tableBodyClick', 'reduceData'],
    data: () => {
        return {
            'sortType': ''
        }
    },
    methods: {
        showHandDetail: function(handData){
            this.$emit('loadHandDetail', handData)
        },
        loadCapitalDetail: function(capital){
            this.$emit('loadCapitalDetail', capital)
        },
        tableBodyClicked: function(evt){
            this.$emit('tableBodyClicked', evt)
        },
        getRowTitle: function(idx){
            return this.reduceData&&this.reduceData[idx]['special_reduce_show'] == 'T' ? ('较昨日减少' + this.reduceData[idx]['reduce_proportion']) : ''
        },
        getRowClass: function(idx){
            return this.reduceData&&this.reduceData[idx]['special_reduce_show'] == 'T' ? 'special_reduce' : ''
        },
        editBtnClicked: function(idx){
            if(this.tbType == 'user'){
                this.$emit('editUserClicked', idx);
            }else if(this.tbType == 'role'){
                this.$emit('editRoleClicked', idx)
            }
        },
        modifyBtnClicked: function(idx){
            this.$emit('modifyPwdClicked', idx)
        },
        delBtnClicked: function(idx){
            if(this.tbType == 'user'){
                this.$emit('deleteUserClicked', idx)
            }else if(this.tbType == 'role'){
                this.$emit('deleteRoleClicked', idx)
            }else if(this.tbType == 'permission'){
                this.$emit('deletePermissionClicked', idx)
            }
        },
        sortTBData: function(tp, sortBy){
            this.$emit('sortTBData', {sortType: tp, sortBy: sortBy})
        }
    },
    mounted: function(){
        if(this.tableHeaderFixed){
            const tableStyle = window.getComputedStyle(this.$refs.table)
            const tableContainerStyle = window.getComputedStyle(this.$refs.table.parentNode)
            const theadStyle = window.getComputedStyle(this.$refs.thead)
            this.$refs.tbody.style.maxHeight = tableContainerStyle.height.replace('px', '') - tableContainerStyle.paddingTop.replace('px', '') - tableContainerStyle.paddingBottom.replace('px', '') - theadStyle.height.replace('px', '') + 'px'
        }
    }
}
</script>
<style scoped>
tr.main-menu { background-color: #b3b4b3; }
tr.effect-menu { background-color: #e4e5e4; }
tr.auth-menu { background-color: transparent; }
.theadFixed { display: table; width: 100%; table-layout: fixed; }
.sort { display: inline-block; width: .3125rem; height: 1rem; vertical-align: middle; margin-left: .125rem; }
.sort>span { width: .3125rem; height: .40625rem; overflow: hidden; display: block; position: relative; }
.sort>span:last-child { margin-top: 1px; }
.sort>span:first-child::after { content: ''; width: .3125rem; height: .3125rem; background-color: #999999; transform: rotate(45deg); position: absolute; bottom: -.15625rem; left: 0; cursor: pointer; }
.sort>span:last-child::before { content: ''; width: .3125rem; height: .3125rem; background-color: #999999; transform: rotate(45deg); position: absolute; top: -.15625rem; left: 0; cursor: pointer; }
.sort>span.hover::after,.sort>span.hover::before { background-color: #333333; }
tbody.scrollable { display: block; overflow-y: scroll; }
tbody.scrollable tr { display: table; width: 100%; table-layout: fixed; }
.scrollable td { overflow-x: scroll; white-space: nowrap; }
.special_reduce { background-color: red; color: white; }
</style>