<template>
    <table cellspacing="0" ref="table">
        <thead :class="tableHeaderFixed?'theadFixed':''" ref="thead">
            <tr v-for="(row, index) in tableHeader" v-bind:key="index">
                <td v-for="(col, idx) in row" v-bind:key="idx" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1">
                    {{col.name}}
                    <div v-if="col.canSort" class="sort">
                        <span :class="'asc' + (sortType == 'asc' ? ' hover' : '')" @click="sortTBData('asc', col.sortBy)"></span>
                        <span :class="'desc' + (sortType == 'desc' ? ' hover' : '')" @click="sortTBData('desc', col.sortBy)"></span>
                    </div>
                </td>
            </tr>
        </thead>
        <tbody v-if="tbType == 'user'" ref="tbody">
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
        <tbody v-if="tbType == 'role'" ref="tbody">
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
                    <button v-if="tbRow['delete_action'] == 'T'" @click="delBtnClicked(tbRow.url)" class="action-btn del-btn">删除</button>
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
        <tbody v-if="tbType == 'common'" :style="tableBodyClick?'cursor: pointer;':''" :class="tableHeaderFixed?'scrollable hideScrollBar':''" ref="tbody" @click.prevent.stop="tableBodyClicked($event)">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index" :class="getRowClass(index)" :title="getRowTitle(index)">
                <td v-for="(tbCol, idx) in tbRow" v-bind:key="idx">{{tbCol}}</td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'tdSpan'" :style="tableBodyClick?'cursor: pointer;':''" :class="tableHeaderFixed?'scrollable':''" ref="tbody" @click.prevent.stop="tableBodyClicked($event)">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index" :class="getRowClass(index)" :title="getRowTitle(index)">
                <td v-for="(tbCol, idx) in tbRow" v-bind:key="idx" style="background-color: white;" :colspan="tbCol.colspan" :rowspan="tbCol.rowspan">{{tbCol.text}}</td>
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
        <tbody v-if="tbType == 'orderSalesList'" ref="tbody">
            <tr v-for="(tbRow, index) in tbData" :key="index">
                <td style="width: 2.5625rem; text-align: center;">
                    <input type="checkbox" @click="changeCheckStatus($event, index)" :checked="tbRow[0] != '--' && checkedArray.indexOf(tbRow[0]) >= 0">
                </td>
                <td v-for="(tbCol, idx) in tbRow" :key="idx">{{tbCol}}</td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'userList'" ref="tbody" class="user-list">
            <tr v-for="(tbRow, index) in tbData" v-bind:key="index">
                <td style="width: 2.5625rem; text-align: center;">
                    <input type="checkbox" @click="changeCheckStatus($event, index)" :checked="selectUserList[index].checked">
                </td>
                <td v-for="(tbCol, idx) in tbRow" v-bind:key="idx">
                    <img :src="tbCol" v-if="idx == 2 && tbCol != '--'" style="width: 1.375rem; height: 1.375rem; border-radius: 50%;">
                    <div v-else-if="idx == 7" style="width: 100%; height: 100%; text-align: center;">
                        <div class="editable-box">
                            <div class="editable-dom" contenteditable="true" @click="startEdit($event)">{{tbCol}}</div>
                            <div class="editable-ok" @click="changeInviteCode($event, index)"></div>
                            <div class="editable-cancel" @click="cancelEdit($event)"></div>
                        </div>
                    </div>
                    <slot v-else>{{tbCol}}</slot>
                </td>
                <td>
                    <a @click="showMyTeam(tbRow)">我的团队</a>
                    <a @click="changeUserRank(tbRow, index)">用户调级</a>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'teamList'" ref="tbody" class="team-list">
            <tr v-for="(tbRow, index) in tbData" :key="index">
                <td v-for="(tbCol, idx) in tbRow" :key="idx">
                    <img :src="tbCol" v-if="idx == 2 && tbCol != '--'" style="width: 1.375rem; height: 1.375rem; border-radius: 50%;">
                    <slot v-else>{{tbCol}}</slot>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'orderList'" ref="tbody" class="order-list">
            <tr v-for="(tbRow, index) in tbData" :key="index">
                <td v-for="(tbCol, idx) in tbRow" :key="idx">
                    <img :src="tbCol" v-if="idx == 3 && tbCol != '--'" style="width: 1.375rem; height: 1.375rem; border-radius: 50%;">
                    <slot v-else>{{tbCol}}</slot>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'withdrawList'" ref="tbody" class="withdraw-list">
            <tr v-for="(tbRow, index) in tbData" :key="index">
                <td v-for="(tbCol, idx) in tbRow" :key="idx">{{tbCol}}</td>
                <td>
                    <a v-if="tbRow[3] == '等待审核'" @click="checkWithdraw(tbRow, index)">提现审核</a>
                    <slot v-else>--</slot>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'materialList'" ref="tbody" class="material-list">
            <tr v-for="(tbRow, index) in tbData" :key="index">
                <td v-for="(tbCol, idx) in tbRow" :key="idx">
                    <switch-progress v-if="idx == 4" :statusData="index" :turnOn="tbCol == 1" @changeSwitchStatus="changeSwitchStatus"></switch-progress>
                    <div v-else-if="idx == 5" v-html="tbCol"></div>
                    <div v-else-if="idx == 6">
                        <img v-for="(imgSrc, idxx) in tbCol" :key="idxx" :src="imgSrc.indexOf('http') >= 0 ? imgSrc : ('http://' + imgSrc)">
                    </div>
                    <slot v-else>{{tbCol}}</slot>
                </td>
                <td>
                    <a @click="modifyMaterial(index)">修改</a>
                    <a @click="delMaterial(index)">删除</a>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'tagList'" ref="tbody" class="tagList">
            <tr v-for="(tbRow, idx) in tbData" :key="idx">
                <td v-for="(tbCol, index) in tbRow" :key="index">
                    <slot v-if="index == tbRow.length - 1">
                        <button v-if="tbCol.label_edit == 'T'" @click="editBtnClicked(idx)" class="action-btn edit-btn">编辑</button>
                        <button v-if="tbCol.label_status == 'T' && tbCol.label_open_status == 'T'" @click="delBtnClicked(idx)" class="action-btn del-btn">启用</button>
                        <button v-if="tbCol.label_status == 'T' && tbCol.label_close_status == 'T'" @click="pubBtnClicked(idx)" class="action-btn modify-btn">隐藏</button>
                    </slot>
                    <slot v-else>
                        {{tbCol}}
                    </slot>
                </td>
            </tr>
        </tbody>
        <tbody v-if="tbType == 'articleList'" ref="tbody" class="articleList">
            <tr v-for="(tbRow, index) in tbData" :key="index">
                <td v-for="(tbCol, idx) in tbRow" :key="idx">
                    <slot v-if="idx == tbRow.length - 1">
                        <button v-if="tbCol.article_edit == 'T'" class="action-btn edit-btn" @click="editBtnClicked(index)">编辑</button>
                        <button v-if="tbCol.article_open == 'T'" class="action-btn modify-btn" @click="pubBtnClicked(index)">发布</button>
                        <button v-if="tbCol.article_close == 'T'" class="action-btn del-btn" @click="delBtnClicked(index)">下架</button>
                    </slot>
                    <slot v-else-if="idx == 2 && tbCol !== '无' && tbCol.indexOf('http') >= 0">
                        <img :src="tbCol">
                    </slot>
                    <slot v-else-if="idx == 2">
                        --
                    </slot>
                    <slot v-else>
                        {{tbCol}}
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
import switchProgress from '@/components/common/switch.vue'

export default {
    props: ['tableHeader', 'tbData', 'tbType', 'tableHeaderFixed', 'tableBodyClick', 'reduceData', 'selectUserList', 'checkedArray'],
    data: () => {
        return {
            'sortType': ''
        }
    },
    components: {
        'switch-progress': switchProgress
    },
    methods: {
        changeSwitchStatus: function(dt){
            this.$emit('changeSwitchStatus', dt)
        },
        delMaterial: function(idx){
            this.$emit('delMaterial', idx)
        },
        modifyMaterial: function(idx){
            this.$emit('modifyMaterial', idx)
        },
        checkWithdraw: function(dt, index){
            this.$emit('checkWithdraw', {data: dt, idx: index})
        },
        changeInviteCode: function(e, index){
            // console.log(e.target.parentNode.childNodes[0].innerHTML.trim())
            this.$parent.changeInviteCode(index, e.target.parentNode.childNodes[0].innerHTML.trim())
                .then((dt) => {
                    if(dt){
                        e.target.parentNode.className = 'editable-box'
                    }
                })
            // e.target.parentNode.childNodes[0].focus()
        },
        cancelEdit: function(e){
            e.target.parentNode.className = 'editable-box'
        },
        startEdit: function(e){
            e.target.parentNode.className = 'editable-box focus'
            // e.target.contenteditable = true
            // e.target.focus()
        },
        changeCheckStatus: function(e, idx){
            this.$emit('changeCheckStatus', idx)
        },
        changeUserRank: function(user, idx){
            this.$emit('changeUserRank', {user: user, idx: idx})
        },
        showMyTeam: function(user){
            this.$emit('showMyTeam', user)
        },
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
            }else if(this.tbType == 'tagList'){
                this.$emit('editTagClicked', idx)
            }else if(this.tbType == 'articleList'){
                this.$emit('editArticleClicked', idx)
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
            }else if(this.tbType == 'tagList'){
                this.$emit('delTagClicked', idx)
            }else if(this.tbType == 'articleList'){
                this.$emit('delArticleClicked', idx)
            }
        },
        pubBtnClicked: function(idx){
            if(this.tbType == 'articleList'){
                this.$emit('pubArticleClicked', idx)
            }else if(this.tbType == 'tagList'){
                this.$emit('pubTagClicked', idx)
            }
        },
        sortTBData: function(tp, sortBy){
            this.$emit('sortTBData', {sortType: tp, sortBy: sortBy})
        }
    },
    mounted: function(){
        if(this.tableHeaderFixed){
            this.$nextTick(() => {
                const baseFontSize = document.documentElement.style.fontSize.replace('px', '')
                const tableStyle = window.getComputedStyle(this.$refs.table)
                const tableContainerStyle = window.getComputedStyle(this.$refs.table.parentNode)
                const theadStyle = window.getComputedStyle(this.$refs.thead)
                // 如果表头是通过接口返回，则此时thead还未渲染，thead高度为0，所以不通过theadstyle获取表头高度
                // this.$refs.tbody.style.maxHeight = tableContainerStyle.height.replace('px', '') - tableContainerStyle.paddingTop.replace('px', '') - tableContainerStyle.paddingBottom.replace('px', '') - theadStyle.height.replace('px', '') - 15 + 'px'
                // 如果横向不滚动，则不需要减去滚动条高度
                if(tableContainerStyle.overflowX != 'scroll'){
                    this.$refs.tbody.style.maxHeight = tableContainerStyle.height.replace('px', '') - tableContainerStyle.paddingTop.replace('px', '') - tableContainerStyle.paddingBottom.replace('px', '') - baseFontSize * 1.5 - 1 + 'px'
                }else{
                    this.$refs.tbody.style.maxHeight = tableContainerStyle.height.replace('px', '') - tableContainerStyle.paddingTop.replace('px', '') - tableContainerStyle.paddingBottom.replace('px', '') - baseFontSize * 1.5 - 18 + 'px'
                }
            })
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
tbody.scrollable { display: block; overflow-y: scroll; }
tbody.scrollable tr { display: table; width: 100%; table-layout: fixed; }
.scrollable td { overflow-x: scroll; white-space: nowrap; }
.special_reduce { background-color: red; color: white; }
.user-list>tr>td:nth-child(3),.user-list>tr>td:nth-child(4),.user-list>tr>td:nth-child(7) { padding: 0 0.2rem; }
.user-list>tr>td:nth-child(5) { max-width: 4rem; white-space: nowrap; overflow-x: scroll; min-width: 4rem; width: 4rem; }
.user-list>tr>td:nth-child(8) { max-width: 2.5rem; min-width: 2.5rem; width: 2.5rem; white-space: nowrap; overflow-x: scroll; }
.user-list>tr>td:nth-child(9) { max-width: 4.5rem; min-width: 4.5rem; width: 4.5rem; }
.user-list>tr>td:nth-child(13),.user-list>tr>td:nth-child(12) { max-width: 3.5rem; width: 3.5rem; min-width: 3.5rem; }
.user-list a,.withdraw-list a,.material-list a { cursor: pointer; color: #4381E6; }
.user-list a:last-child,.material-list a:last-child { margin-left: .5rem; }
.editable-box { position: relative; width: 4.3rem; height: .90625rem; box-sizing: border-box; line-height: .90625rem; display: inline-block; text-align: center; }
.focus .editable-dom { text-align: left; padding-left: .25rem; background-color: #F8F8F8; }
.editable-ok,.editable-cancel { cursor: pointer; display: none; width: .4375rem; height: .4375rem; position: absolute; background-repeat: no-repeat; background-size: 100% 100%; background-position: center center; border-radius: 50%; top: .21875rem; }
.editable-ok { right: .75rem; background-image: url(../../assets/icon_save.png); }
.editable-cancel { background-image: url(../../assets/icon_close2.png); right: .21875rem; }
.focus .editable-ok, .focus .editable-cancel { display: block; }
.team-list>tr>td:nth-child(1),.team-list>tr>td:nth-child(2),.team-list>tr>td:nth-child(3),.team-list>tr>td:nth-child(6) { padding: 0 0.2rem; }
.team-list>tr>td:nth-child(15),.team-list>tr>td:nth-child(16) { max-width: 3.5rem; min-width: 3.5rem; width: 3.5rem; }
.team-list>tr>td:nth-child(4) { max-width: 3rem; min-width: 3rem; width: 3rem; white-space: nowrap; overflow-x: scroll; }
.order-list>tr>td:nth-child(1),.order-list>tr>td:nth-child(2) { width: 4rem; max-width: 4rem; min-width: 4rem; white-space: nowrap; overflow-x: scroll; padding: 0 .2rem; }
.order-list>tr>td:nth-child(14),.order-list>tr>td:nth-child(15) { max-width: 3.5rem; min-width: 3.5rem; width: 3.5rem; }
.order-list>tr>td:nth-child(3) { width: 3rem; max-width: 3rem; min-width: 3rem; overflow-x: scroll; white-space: nowrap; padding: 0 .2rem; }
.material-list>tr>td:nth-child(5) { padding: 0 .3rem; }
.material-list>tr>td:nth-child(6) { padding: 0 .3rem; width: 15rem; min-width: 15rem; max-width: 15rem; overflow-y: scroll; text-align: left; }
.material-list>tr>td:nth-child(7) { width: 9rem; min-width: 9rem; max-width: 9rem; text-align: center; }
.material-list>tr>td:nth-child(10),.material-list>tr>td:nth-child(11) { width: 3.5rem; min-width: 3.5rem; max-width: 3.5rem; }
.articleList>tr>td:nth-child(2) { width: 6rem; min-width: 6rem; max-width: 6rem; overflow-x: scroll; }
.articleList>tr>td:nth-child(3) { width: 9rem; max-width: 9rem; min-width: 9rem; }
.articleList>tr>td:nth-child(3)>img { width: 100%; }
.material-list img { width: 1.875rem; height: 1.875rem; margin-left: .5rem; }
.material-list img:first-child { margin-left: 0; }
input[type="checkbox"] { position: relative; width: 0.625rem; height: .625rem; vertical-align: sub; }
input[type="checkbox"]::after { background-color: #fff; background-image: url(../../assets/check.png); position: absolute; content: ' '; background-repeat: no-repeat; background-position: center center; background-size: 100% 100%; width: 0.625rem; height: 0.625rem; }
input[type="checkbox"]:checked::after { background-image: url(../../assets/checked.png); }
</style>