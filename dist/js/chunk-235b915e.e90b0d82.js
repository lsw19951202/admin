(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-235b915e"],{"3ea1":function(t,e,a){var o=a("f914");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=a("499e").default;i("6afa27fe",o,!0,{sourceMap:!1,shadowMode:!1})},"505b":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"detail-container"},[a("div",{staticClass:"detail-data-box"},[a("header",{staticClass:"search-header"},[a("div",{staticClass:"search-group"},[a("label",[t._v("商品名称:")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.goodsTitle,expression:"goodsTitle"}],attrs:{type:"text",placeholder:"请输入"},domProps:{value:t.goodsTitle},on:{input:function(e){e.target.composing||(t.goodsTitle=e.target.value)}}})]),a("div",{staticClass:"search-group"},[a("label",[t._v("商品ID:")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.goodsId,expression:"goodsId"}],attrs:{type:"text",placeholder:"请输入"},domProps:{value:t.goodsId},on:{input:function(e){e.target.composing||(t.goodsId=e.target.value)}}})]),a("selector",{staticClass:"search-group",attrs:{selectParams:t.selectParams,value:t.platform},on:{selectOptsClicked:t.selectOptsClicked}}),a("div",{staticClass:"search-group"},[a("label",[t._v("日期筛选:")]),a("flat-picker",{staticClass:"search-time-picker",attrs:{config:t.dateConfig,placeholder:"起始时间"},model:{value:t.createTimeBegin,callback:function(e){t.createTimeBegin=e},expression:"createTimeBegin"}}),t._m(0),a("flat-picker",{staticClass:"search-time-picker",attrs:{config:t.dateConfig,placeholder:"结束时间"},model:{value:t.createTimeEnd,callback:function(e){t.createTimeEnd=e},expression:"createTimeEnd"}})],1),a("button",{staticClass:"action-btn",on:{click:t.clearCheckedGoodsAndLoadData}},[t._v("搜索")]),a("a",{staticClass:"action-btn",staticStyle:{display:"inline-block"},attrs:{href:t.downloadUrl,download:t.createTimeBegin+".xlsx"}},[t._v("导出全部")]),a("a",{staticClass:"action-btn",staticStyle:{display:"inline-block"},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),t.selectExcel(e)}}},[t._v("导入")]),a("form",{ref:"fileForm",staticStyle:{display:"none"},attrs:{enctype:"multipart/form-data"}},[a("input",{ref:"excelIpt",attrs:{type:"file",accept:".xls, .xlsx",name:"file"},on:{change:t.uploadExcel}})])],1),a("div",{staticClass:"table-container hideScrollBar"},[a("detail-table",{attrs:{tbData:t.tbData,checkedArray:t.checkedGoods,tbType:t.tbType,tableHeader:t.tableHeader},on:{changeCheckStatus:t.changeCheckStatus}})],1),a("div",{staticClass:"page-footer",staticStyle:{display:"flex"}},[a("div",{staticStyle:{"margin-top":".3rem",height:".875rem","line-height":".875rem"}},[a("input",{staticStyle:{"margin-left":"1rem"},attrs:{type:"checkbox",id:"checkAllGoods"},domProps:{checked:t.allGoodsChecked},on:{click:function(e){return t.changeAllGoodsCheckStatu(e)}}}),a("label",{staticStyle:{"font-size":".375rem",color:"#666666",display:"inline-block",height:"100%","line-height":"1rem","margin-left":".3125rem","vertical-align":"top"},attrs:{for:"checkAllGoods"}},[t._v("全选")]),a("button",{staticClass:"action-btn",on:{click:t.exportCheckedGoods}},[t._v("导出")]),a("a",{ref:"exportXlsx",staticClass:"action-btn",staticStyle:{display:"none"}},[t._v("导出")])]),a("page",{staticStyle:{width:"0",flex:"1"},attrs:{pageData:t.pageData},on:{loadList:t.loadTBData}})],1)])])},i=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"split-line"},[a("div")])}],s=(a("c975"),a("a15b"),a("a434"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("2c17")),c=a("bff1"),l=a("707d"),n=a("bcc8"),r=a("ef59"),d=a("c38f"),h=a.n(d),p=(a("0952"),a("dc1c")),u={inject:["reload","alert","showLoading","hideLoading"],components:{"flat-picker":h.a,selector:l["a"],"detail-table":n["a"],page:r["a"]},data:function(){var t=new Date,e="";return e+=t.getFullYear()+"-",e+=(t.getMonth()<9?"0":"")+(t.getMonth()+1)+"-",e+=(t.getDate()<10?"0":"")+t.getDate(),{dateConfig:{time_24hr:!0,maxDate:e,locale:p["Mandarin"]},goodsTitle:"",platform:"",goodsId:"",tbType:"orderSalesList",tbData:[],pageData:{total:0,page:1,total_page:0},selectParams:{label:"下单平台",options:[{value:"",text:"请选择"},{value:"jd",text:"京东"},{value:"pdd",text:"拼多多"},{value:"tb",text:"淘宝"},{value:"elm",text:"饿了么"},{value:"mt",text:"美团"}]},createTimeBegin:e,createTimeEnd:e,tableHeader:c["default"].tableHeader.orderSalesList,checkedGoods:[]}},created:function(){this.loadTBData()},computed:{downloadUrl:function(){return c["default"].baseUrl+c["default"].urls.appSaleRank+"?goodsTitle="+this.goodsTitle+"&goodsId="+this.goodsId+"&platform="+this.platform+"&page="+this.pageData.page+"&createTimeBegin="+this.createTimeBegin+"&is_excel=1&skey="+this.$cookies.get("skey")+"&createTimeEnd="+this.createTimeEnd},allGoodsChecked:function(){for(var t=!0,e=0;e<this.tbData.length;e++)if("--"!=this.tbData[e][0]&&-1==this.checkedGoods.indexOf(this.tbData[e][0])){t=!1;break}return t}},methods:{selectExcel:function(){this.$refs.excelIpt.click()},uploadExcel:function(){var t=this;this.showLoading();var e=new FormData(this.$refs.fileForm);Object(s["a"])({url:c["default"].urls.appSaleRank,method:"post",data:e,headers:{"Content-Type":"multipart/form-data"}}).then((function(e){200==e.status?200==e.data.code?t.loadTBData(1):t.alert(e.data.message||"上传文件失败"):t.alert("上传文件失败")})).catch((function(e){t.alert("上传文件失败")})).then((function(){t.hideLoading(),t.$refs.excelIpt.value=""}))},exportCheckedGoods:function(){var t=this;0!=this.checkedGoods.length?(this.showLoading(),Object(s["a"])({url:c["default"].urls.appSaleRank,method:"get",responseType:"blob",params:{goodsTitle:this.goodsTitle,goodsId:this.goodsId,platform:this.platform,page:1,createTimeBegin:this.createTimeBegin,createTimeEnd:this.createTimeEnd,is_excel:1,goods_arr:this.checkedGoods.join(",")}}).then((function(e){if(200==e.status){var a=window.URL.createObjectURL(new Blob([e.data])),o=t.$refs.exportXlsx;o.href=a,o.setAttribute("download","商品列表.xlsx"),o.click(),t.checkedGoods=Object.assign([])}else t.alert("导出商品列表失败")})).catch((function(e){t.alert("导出商品列表失败")})).then((function(){t.hideLoading()}))):this.alert("请先选择要导出的商品")},clearCheckedGoodsAndLoadData:function(){this.checkedGoods=Object.assign([]),this.loadTBData(1)},loadTBData:function(t){var e=this;this.showLoading(),Object(s["a"])({url:c["default"].urls.appSaleRank,method:"get",params:{page:t||1,goodsTitle:this.goodsTitle,goodsId:this.goodsId,platform:this.platform,createTimeBegin:this.createTimeBegin,createTimeEnd:this.createTimeEnd}}).then((function(t){200==t.status?200==t.data.code?e.createTBData(t.data.data):e.alert(t.data.message||"加载商品销量排行列表失败"):e.alert("加载商品销量排行列表失败")})).catch((function(t){e.alert("加载商品销量排行列表失败")})).then((function(){e.hideLoading()}))},createTBData:function(t){this.pageData.total=t.total,this.pageData.page=t.page,this.pageData["total_page"]=t.total_page||t.pageCount||0;for(var e={},a=[{value:"",text:"请选择"}],o=0;o<t.platArr.length;o++)e[t.platArr[o]["plat"]]=t.platArr[o]["plat_name"],a.push({value:t.platArr[o]["plat"],text:t.platArr[o]["plat_name"]});this.selectParams.options=Object.assign([],a);for(var i=["goods_id","goods_title","goods_price","order_num","sale_num","platform","plat_commission_amount","order_amount"],s=[],c=0;c<t.data.length;c++){s.push([]);for(var l=t.data[c],n=0;n<i.length;n++){var r=l[i[n]]||(0==l[i[n]]?l[i[n]]:"--");5==n&&(r=e[r]||"--"),s[c].push(r)}}this.tbData=Object.assign([],s)},selectOptsClicked:function(t){this.platform=t},changeAllGoodsCheckStatu:function(t){for(var e=t.target.checked,a=0;a<this.tbData.length;a++)"--"!=this.tbData[a][0]&&(e?-1==this.checkedGoods.indexOf(this.tbData[a][0])&&this.checkedGoods.push(this.tbData[a][0]):this.checkedGoods.indexOf(this.tbData[a][0])>=0&&this.checkedGoods.splice(this.checkedGoods.indexOf(this.tbData[a][0]),1))},changeCheckStatus:function(t){"--"!=this.tbData[t][0]&&(this.checkedGoods.indexOf(this.tbData[t][0])>=0?this.checkedGoods.splice(this.checkedGoods.indexOf(this.tbData[t][0]),1):this.checkedGoods.push(this.tbData[t][0]))}}},g=u,f=(a("c565"),a("2877")),m=Object(f["a"])(g,o,i,!1,null,"65f4d040",null);e["default"]=m.exports},c565:function(t,e,a){"use strict";var o=a("3ea1"),i=a.n(o);i.a},f914:function(t,e,a){var o=a("24fb"),i=a("1de5"),s=a("f0c8"),c=a("0993");e=o(!1);var l=i(s),n=i(c);e.push([t.i,".detail-container[data-v-65f4d040]{background-color:#f2f2f2;padding:0;margin:0;overflow-y:scroll}input[type=checkbox][data-v-65f4d040]{position:relative;width:.625rem;height:.625rem}input[type=checkbox][data-v-65f4d040]:after{background-color:#fff;background-image:url("+l+');position:absolute;content:" ";background-repeat:no-repeat;background-position:50%;background-size:100% 100%;width:.625rem;height:.625rem}input[type=checkbox][data-v-65f4d040]:checked:after{background-image:url('+n+")}",""]),t.exports=e}}]);