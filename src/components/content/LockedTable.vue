<template>
    <div class="table-container" @scroll.prevent.stop="tableScroll($event)" :style="'margin-top: ' + (tbStyle.marginTop || 0) + ';'">
        <table cellspacing="0" :style="'width: ' + tbStyle.width + '; position: relative;'" ref="table">
            <thead :style="'z-index: 53; left: ' + scrollPos.left + 'px; top: ' + scrollPos.top + 'px; position: absolute; border-right: 1px solid #E2E2E2; border-bottom: 1px solid #E2E2E2;'" v-show="showFixedHeadCol" ref="fixedHeadCol">
                <tr v-for="(row, index) in getFixedHeadCol" :key="index">
                    <td v-for="(col, idx) in row" :key="idx" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1">
                        {{col.name}}
                    </td>
                </tr>
            </thead>
            <thead :style="'z-index: 52; left: 0; top: ' + scrollPos.top + 'px; border-bottom: 1px solid #E2E2E2;'" ref="fixedHead">
                <tr v-for="(row, index) in tbData.tableHeader" :key="index">
                    <td v-for="(col, idx) in row" :key="idx" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1">
                        {{col.name}}
                    </td>
                </tr>
            </thead>
            <tbody :style="'z-index: 51; left: ' + scrollPos.left + 'px; top: 1.5rem; position: absolute; background-color: white; border-right: 1px solid #E2E2E2;'" v-show="showFixedHeadCol" ref="fixedCol">
                <tr v-for="(row, index) in getFixedCol" :key="index" style="background-color: white;">
                    <td v-for="(col, idx) in row" :key="idx" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1">
                        {{col.text}}
                    </td>
                </tr>
            </tbody>
            <tbody style="z-index: 50; background-color: white;" ref="tbody">
                <tr v-for="(row, index) in tbData.tbData" :key="index" style="background-color: white;" @click.prevent.stop="rowClicked(row)">
                    <td v-for="(col, idx) in row" :key="idx" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1">
                        {{col.text}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props: ['tbData', 'tbStyle'],
    data: () => {
        return {
            showFixedHeadCol: false,
            scrollPos: {
                left: 0,
                top: 0
            }
        }
    },
    computed: {
        getFixedHeadCol: function() {
            const fixedHeadCol = []
            for(let row = 0; row < this.tbData.lockedRow; row++){
                fixedHeadCol.push([])
                for(let col = 0; col < this.tbData.lockedCol; col++){
                    fixedHeadCol[row].push(this.tbData.tableHeader[row][col])
                }
            }
            return fixedHeadCol
        },
        getFixedCol: function() {
            const fixedCol = []
            let idx = 0, rowspan = 1, maxCol = this.tbData.lockedCol
            for(let row = 0; row < this.tbData.tbData.length; row++){
                fixedCol.push([])
                if(idx == 0 || idx == rowspan){
                    rowspan = 1
                    for(let ii = 0; ii < this.tbData.lockedCol; ii++){
                        rowspan = Math.max(this.tbData.tbData[row][ii]['rowspan'] || 1, rowspan);
                    }
                    idx = 0
                }
                if(idx == 0){
                    maxCol = this.tbData.lockedCol
                }else{
                    maxCol = this.tbData.lockedCol - 1
                }
                idx++
                for(let col = 0; col < maxCol; col++){
                    fixedCol[row].push(this.tbData.tbData[row][col])
                }
            }
            return fixedCol
        }
    },
    watch: {
        tbData: function(){
            this.$nextTick(() => {
                this.resizeFixedHead()
            })
        }
    },
    methods: {
        // 行点击事件
        rowClicked: function(dt){
            this.$emit('rowClicked', dt)
        },
        resizeFixedHead: function(){
            this.showFixedHeadCol = false
            // 设置表格顶部padding
            this.$refs['table'].style.paddingTop = '0px'
            // 设置表头position: inherit;
            this.$refs['fixedHead'].style.position = 'static'
            const fixedCol = this.$refs['fixedCol'], fixedHead = this.$refs['fixedHead'], fixedHeadCol = this.$refs['fixedHeadCol'], tbody = this.$refs['tbody']
            const theadSize = []
            for(let idx = 0; idx < fixedHead.children.length; idx++){
                const theadTrChilds = fixedHead.children[idx].children
                theadSize.push([])
                for(let idxx = 0; idxx < theadTrChilds.length; idxx++){
                    theadSize[idx].push(theadTrChilds[idxx].offsetWidth)
                }
            }
            // 设置左上角表头
            for(let idx = 0; idx < fixedHeadCol.children.length; idx++){
                const trChilds = fixedHeadCol.children[idx].children
                for(let idxx = 0; idxx < trChilds.length; idxx++){
                    const td = trChilds[idxx]
                    td.style.width = theadSize[idx][idxx] + 'px'
                    td.style.maxWidth = theadSize[idx][idxx] + 'px'
                    td.style.minWidth = theadSize[idx][idxx] + 'px'
                }
            }
            // 设置表头大小
            for(let idx = 0; idx < fixedHead.children.length; idx++){
                const fixedHeadTrChilds = fixedHead.children[idx].children
                for(let idxx = 0; idxx < fixedHeadTrChilds.length; idxx++){
                    const td = fixedHeadTrChilds[idxx]
                    td.style.width = theadSize[idx][idxx] + 'px'
                    td.style.maxWidth = theadSize[idx][idxx] + 'px'
                    td.style.minWidth = theadSize[idx][idxx] + 'px'
                }
            }
            const tbodySize = []
            for(let idx = 0; idx < tbody.children.length; idx++){
                const tbodyTrChilds = tbody.children[idx].children
                tbodySize.push([])
                for(let idxx = 0; idxx < tbodyTrChilds.length; idxx++){
                    tbodySize[idx].push(tbodyTrChilds[idxx].offsetWidth)
                }
            }
            // 设置左侧body
            for(let idx = 0; idx < fixedCol.children.length; idx++){
                const fixedColTrChilds = fixedCol.children[idx].children
                for(let idxx = 0; idxx < fixedColTrChilds.length; idxx++){
                    const td = fixedColTrChilds[idxx]
                    td.style.width = tbodySize[idx][idxx] + 'px'
                    td.style.maxWidth = tbodySize[idx][idxx] + 'px'
                    td.style.minWidth = tbodySize[idx][idxx] + 'px'
                }
            }
            // 设置body
            for(let idx = 0; idx < tbody.children.length; idx++){
                const tbodyTrChilds = tbody.children[idx].children
                for(let idxx = 0; idxx < tbodyTrChilds.length; idxx++){
                    const td = tbodyTrChilds[idxx]
                    td.style.width = tbodySize[idx][idxx] + 'px'
                    td.style.minWidth = tbodySize[idx][idxx] + 'px'
                    td.style.maxWidth = tbodySize[idx][idxx] + 'px'
                }
            }
            // 设置表格顶部padding
            this.$refs['table'].style.paddingTop = this.tbData.lockedRow * 1.5 + 'rem'
            // 设置表头position: inherit;
            this.$refs['fixedHead'].style.position = 'absolute'
            this.showFixedHeadCol = true
        },
        tableScroll: function(evt){
            this.scrollPos = {
                left: evt.target.scrollLeft,
                top: evt.target.scrollTop
            }
        }
    }
}
</script>
<style scoped>
.table-container { margin: 0; position: relative; overflow: scroll; }
.table-container div { position: absolute; left: 0; top: 0; overflow: hidden; background-color: white; }
td { overflow: scroll; }
tbody td { word-break: break-all; }
</style>