(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0078982f"],{"0ac2":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table-container",style:"margin-top: "+(t.tbStyle.marginTop||0)+";",on:{scroll:function(e){return e.preventDefault(),e.stopPropagation(),t.tableScroll(e)}}},[a("table",{ref:"table",style:"width: "+t.tbStyle.width+"; position: relative;",attrs:{cellspacing:"0"}},[a("thead",{directives:[{name:"show",rawName:"v-show",value:t.showFixedHeadCol,expression:"showFixedHeadCol"}],ref:"fixedHeadCol",style:"z-index: 53; left: "+t.scrollPos.left+"px; top: "+t.scrollPos.top+"px; position: absolute; border-right: 1px solid #E2E2E2; border-bottom: 1px solid #E2E2E2;"},t._l(t.getFixedHeadCol,(function(e,i){return a("tr",{key:i},t._l(e,(function(e,i){return a("td",{key:i,attrs:{colspan:e.colspan||1,rowspan:e.rowspan||1}},[t._v(" "+t._s(e.name)+" ")])})),0)})),0),a("thead",{ref:"fixedHead",style:"z-index: 52; left: 0; top: "+t.scrollPos.top+"px; border-bottom: 1px solid #E2E2E2;"},t._l(t.tbData.tableHeader,(function(e,i){return a("tr",{key:i},[t._l(e,(function(e,i){return a("td",{key:i,attrs:{colspan:e.colspan||1,rowspan:e.rowspan||1}},[t._v(" "+t._s(e.name)+" ")])})),"userRankList"==t.tbType?a("td",[t._v(" 操作 ")]):t._e()],2)})),0),a("tbody",{directives:[{name:"show",rawName:"v-show",value:t.showFixedHeadCol,expression:"showFixedHeadCol"}],ref:"fixedCol",style:"z-index: 51; left: "+t.scrollPos.left+"px; top: "+1.5*t.tbData.lockedRow+"rem; position: absolute; background-color: white; border-right: 1px solid #E2E2E2;"},t._l(t.getFixedCol,(function(e,i){return a("tr",{key:i,staticStyle:{"background-color":"white"}},t._l(e,(function(e,i){return a("td",{key:i,attrs:{colspan:e.colspan||1,rowspan:e.rowspan||1}},[t._v(" "+t._s(e.text)+" ")])})),0)})),0),a("tbody",{ref:"tbody",staticStyle:{"z-index":"50","background-color":"white"}},t._l(t.tbData.tbData,(function(e,i){return a("tr",{key:i,staticStyle:{"background-color":"white"}},[t._l(e,(function(e,i){return a("td",{key:i,attrs:{colspan:e.colspan||1,rowspan:e.rowspan||1}},[t._v(" "+t._s(e.text)+" ")])})),"userRankList"==t.tbType?a("td",[a("a",{attrs:{href:"javascript: void(0);"},on:{click:function(a){return a.preventDefault(),a.stopPropagation(),t.rowClicked(e)}}},[t._v("查看订单")])]):t._e(),"poolList"==t.tbType?a("td",[a("a",{attrs:{href:"javascript: void(0);"},on:{click:function(a){return a.preventDefault(),a.stopPropagation(),t.rowClicked(e,"prize")}}},[t._v("奖励详情")]),a("a",{staticStyle:{"margin-left":".5rem"},attrs:{href:"javascript: void(0);"},on:{click:function(a){return a.preventDefault(),a.stopPropagation(),t.rowClicked(e,"order")}}},[t._v("订单详情")]),a("a",{staticStyle:{"margin-left":".5rem"},attrs:{href:"javascript: void(0);"},on:{click:function(a){return a.preventDefault(),a.stopPropagation(),t.rowClicked(e,"prizeList")}}},[t._v("奖金列表")])]):t._e()],2)})),0)])])},o=[],l=(a("a434"),{props:["tbData","tbStyle","tbType"],data:function(){return{showFixedHeadCol:!1,scrollPos:{left:0,top:0}}},computed:{getFixedHeadCol:function(){var t=[];if(this.tbData.tableHeader.length>0){for(var e=0;e<this.tbData.lockedRow;e++)t.push([]);for(var a=0;a<this.tbData.lockedRow;a++)for(var i=0;i<this.tbData.lockedCol;i++){if(t[a].length>=this.tbData.lockedCol)break;if(t[a].push(this.tbData.tableHeader[a][i]),(this.tbData.tableHeader[a][i].colspan||1)>1)for(var o=1;o<(this.tbData.tableHeader[a][i].colspan||1);o++)t[a].push({text:"needDel"});if((this.tbData.tableHeader[a][i].rowspan||1)>1)for(var l=1;l<this.tbData.tableHeader[a][i].rowspan;l++)for(var r=0;r<(this.tbData.tableHeader[a][i].colspan||1);r++)t[a+l].push({text:"needDel"})}for(var s=0;s<t.length;s++){for(var n=0;n<t[s].length;n++)"needDel"==t[s][n]["text"]&&(t[s].splice(n,1),n--);0==t[s].length&&(t.splice(s,1),s--)}}return t},getFixedCol:function(){for(var t=[],e=0;e<this.tbData.tbData.length;e++)t.push([]);for(var a=0;a<this.tbData.tbData.length;a++)for(var i=0;i<this.tbData.lockedCol;i++){if(t[a].length>=this.tbData.lockedCol)break;for(var o=0;o<(this.tbData.tbData[a][i].rowspan||1);o++)for(var l=0;l<(this.tbData.tbData[a][i].colspan||1);l++)t[a+o].push(0==o&&0==l?this.tbData.tbData[a][i]:{text:"needDel"})}for(var r=0;r<t.length;r++){for(var s=0;s<t[r].length;s++)"needDel"==t[r][s]["text"]&&(t[r].splice(s,1),s--);0==t[r].length&&(t.splice(r,1),r--)}return t}},watch:{tbData:function(){var t=this;this.$nextTick((function(){t.resizeFixedHead()}))}},methods:{rowClicked:function(t,e){e?this.$emit("rowClicked",{tp:e,data:t}):this.$emit("rowClicked",t)},resizeFixedHead:function(){this.showFixedHeadCol=!1,this.$refs["table"].style.paddingTop="0px",this.$refs["fixedHead"].style.position="static";for(var t=this.$refs["fixedCol"],e=this.$refs["fixedHead"],a=this.$refs["fixedHeadCol"],i=this.$refs["tbody"],o=[],l=0;l<e.children.length;l++){var r=e.children[l].children;o.push([]);for(var s=0;s<r.length;s++)o[l].push(r[s].offsetWidth)}for(var n=0;n<a.children.length;n++)for(var c=a.children[n].children,d=0;d<c.length;d++){var h=c[d];h.style.width=o[n][d]+"px",h.style.maxWidth=o[n][d]+"px",h.style.minWidth=o[n][d]+"px",h.style.height=e.children[n].children[d].offsetHeight+"px"}for(var f=0;f<e.children.length;f++)for(var p=e.children[f].children,u=0;u<p.length;u++){var b=p[u];b.style.width=o[f][u]+"px",b.style.maxWidth=o[f][u]+"px",b.style.minWidth=o[f][u]+"px"}for(var v=[],m=0;m<i.children.length;m++){var _=i.children[m].children;v.push([]);for(var y=0;y<_.length;y++)v[m].push(_[y].offsetWidth)}for(var g=0;g<t.children.length;g++)for(var x=t.children[g].children,w=0;w<x.length;w++){var k=x[w];k.style.width=v[g][w]+"px",k.style.maxWidth=v[g][w]+"px",k.style.minWidth=v[g][w]+"px"}for(var D=0;D<i.children.length;D++)for(var C=i.children[D].children,T=0;T<C.length;T++){var S=C[T];S.style.width=v[D][T]+"px",S.style.minWidth=v[D][T]+"px",S.style.maxWidth=v[D][T]+"px"}this.$refs["table"].style.paddingTop=1.5*this.tbData.lockedRow+"rem",this.$refs["fixedHead"].style.position="absolute",this.showFixedHeadCol=!0},tableScroll:function(t){this.scrollPos={left:t.target.scrollLeft,top:t.target.scrollTop}}}}),r=l,s=(a("f781"),a("2877")),n=Object(s["a"])(r,i,o,!1,null,"562520ec",null);e["a"]=n.exports},"1dde":function(t,e,a){var i=a("d039"),o=a("b622"),l=a("2d00"),r=o("species");t.exports=function(t){return l>=51||!i((function(){var e=[],a=e.constructor={};return a[r]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},"3ca3":function(t,e,a){"use strict";var i=a("6547").charAt,o=a("69f3"),l=a("7dd0"),r="String Iterator",s=o.set,n=o.getterFor(r);l(String,"String",(function(t){s(this,{type:r,string:String(t),index:0})}),(function(){var t,e=n(this),a=e.string,o=e.index;return o>=a.length?{value:void 0,done:!0}:(t=i(a,o),e.index+=t.length,{value:t,done:!1})}))},"4e4f":function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,".table-container[data-v-562520ec]{margin:0;position:relative;overflow:scroll}.table-container div[data-v-562520ec]{position:absolute;left:0;top:0;overflow:hidden;background-color:#fff}td[data-v-562520ec]{overflow:scroll}tbody td[data-v-562520ec]{word-break:break-all}",""]),t.exports=e},"606e":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"detail-container hideScrollBar"},[a("div",{staticClass:"detail-data-box nopadding"},[a("ul",{staticClass:"tab-box"},[a("li",{class:"tab-item"+(1==t.company_id?" selected":""),on:{click:function(e){return t.tabClicked(1)}}},[t._v("四川云瞻")]),a("li",{class:"tab-item"+(2==t.company_id?" selected":""),staticStyle:{left:"145px"},on:{click:function(e){return t.tabClicked(2)}}},[t._v("成都云瞻")]),a("li",{class:"tab-item"+(0==t.company_id?" selected":""),staticStyle:{left:"290px"},on:{click:function(e){return t.tabClicked(0)}}},[t._v("汇总")])]),a("div",{staticClass:"detail-main"},[a("header",{staticClass:"search-header"},[a("div",{directives:[{name:"show",rawName:"v-show",value:1==t.company_id,expression:"company_id == 1"}],staticClass:"search-group",staticStyle:{"margin-left":"0"}},[a("label",[t._v("期间:")]),a("flat-picker",{staticClass:"search-time-picker",attrs:{config:t.dateConfig,placeholder:"期间"},model:{value:t.start_time_sc,callback:function(e){t.start_time_sc=e},expression:"start_time_sc"}})],1),a("div",{directives:[{name:"show",rawName:"v-show",value:2==t.company_id,expression:"company_id == 2"}],staticClass:"search-group",staticStyle:{"margin-left":"0"}},[a("label",[t._v("期间:")]),a("flat-picker",{staticClass:"search-time-picker",attrs:{config:t.dateConfig,placeholder:"期间"},model:{value:t.start_time_cd,callback:function(e){t.start_time_cd=e},expression:"start_time_cd"}})],1),a("div",{directives:[{name:"show",rawName:"v-show",value:0==t.company_id,expression:"company_id == 0"}],staticClass:"search-group",staticStyle:{"margin-left":"0"}},[a("label",[t._v("期间:")]),a("flat-picker",{staticClass:"search-time-picker",attrs:{config:t.dateConfig,placeholder:"期间"},model:{value:t.start_time_all,callback:function(e){t.start_time_all=e},expression:"start_time_all"}})],1),a("button",{staticClass:"search-btn",on:{click:t.loadData}},[t._v("搜索")]),a("div",{staticStyle:{flex:"1"}}),a("a",{staticClass:"action-btn",staticStyle:{display:"inline-block"},attrs:{href:t.downloadUrl,download:t.company[t.company_id]+".xlsx"}},[t._v("导出")])]),a("div",{staticClass:"table_title"},[t._v(t._s(t.getTitle))]),a("div",{staticClass:"table_sub_title flex"},[a("div",{staticClass:"text_left",staticStyle:{width:"100px","white-space":"nowrap"}},[t._v(" 编制单位："+t._s(t.company[t.company_id])+" ")]),a("div",{staticClass:"flex1 text-center"},[t._v(" 期间："+t._s(t.getTimeIn)+" ")]),a("div",{staticClass:"text-right",staticStyle:{width:"100px","white-space":"nowrap"}},[t._v(" 单元：人民币元 ")])]),a("locked-table",{directives:[{name:"show",rawName:"v-show",value:1==t.company_id,expression:"company_id == 1"}],attrs:{tbData:t.scTBData,tbStyle:t.tbStyle}}),a("locked-table",{directives:[{name:"show",rawName:"v-show",value:2==t.company_id,expression:"company_id == 2"}],attrs:{tbData:t.cdTBData,tbStyle:t.tbStyle}}),a("locked-table",{directives:[{name:"show",rawName:"v-show",value:0==t.company_id,expression:"company_id == 0"}],attrs:{tbData:t.allTBData,tbStyle:t.tbStyle}})],1)])])},o=[],l=(a("d3b7"),a("3ca3"),a("ddb0"),a("c38f")),r=a.n(l),s=(a("0952"),a("dc1c")),n=a("bff1"),c=a("0ac2"),d={inject:["reload","alert","showLoading","hideLoading","loadFields","loadTBData"],components:{"flat-picker":r.a,"locked-table":c["a"]},data:function(){var t=new Date,e="";return e+=t.getFullYear()+"-",e+=(t.getMonth()<9?"0":"")+(t.getMonth()+1),{start_time_sc:e,start_time_cd:e,start_time_all:e,dateConfig:{time_24hr:!0,maxDate:e,locale:s["Mandarin"],dateFormat:"Y-m"},company_id:0,company:{0:"汇总交易数据",1:"四川云瞻",2:"成都云瞻"},scTBData:{tableHeader:[],tbData:[],lockedRow:0,lockedCol:0},cdTBData:{tableHeader:[],tbData:[],lockedRow:0,lockedCol:0},allTBData:{tableHeader:[],tbData:[],lockedRow:0,lockedCol:0},companyFields:[],fields:[],tbStyle:{width:"60rem"}}},computed:{getTitle:function(){return this.company_id?this.company[this.company_id]+"CPS业务月交易汇总数据统计":"云瞻信息CPS业务月交易汇总数据统计"},downloadUrl:function(){return n["default"].baseUrl+n["default"].urls.cpsDealMonth+"?company_id="+this.company_id+"&statistics_month="+(1==this.company_id?this.start_time_sc:2==this.company_id?this.start_time_cd:this.start_time_all)+"&page=1&is_excel=1&skey="+this.$cookies.get("skey")},getTimeIn:function(){return 1==this.company_id?this.start_time_sc:2==this.company_id?this.start_time_cd:this.start_time_all}},created:function(){var t=this;return this.showLoading(),Promise.all([this.loadFields(n["default"].urls.cpsFields,{order_type:"financedeal"}),this.loadTBData(n["default"].urls.cpsDealMonth,{company_id:1,page:1,statistics_month:this.start_time_sc},"get"),this.loadTBData(n["default"].urls.cpsDealMonth,{company_id:2,page:1,statistics_month:this.start_time_cd},"get"),this.loadTBData(n["default"].urls.cpsDealMonth,{company_id:0,page:1,statistics_month:this.start_time_all},"get")]).then((function(e){t.fields=e[0].fields,t.scTBData={tableHeader:e[0].tableHeader,tbData:t.createTBData(e[1],1),lockedRow:e[0].tableHeader.length,lockedCol:e[0].lockedFields.length},t.cdTBData={tableHeader:e[0].tableHeader,tbData:t.createTBData(e[2],2),lockedRow:e[0].tableHeader.length,lockedCol:e[0].lockedFields.length},t.allTBData={tableHeader:e[0].tableHeader,tbData:t.createTBData(e[3],0),lockedRow:e[0].tableHeader.length,lockedCol:e[0].lockedFields.length}})).catch((function(e){t.alert(e.message||"加载数据失败")})).then((function(){t.hideLoading()}))},methods:{tabClicked:function(t){this.$data["company_id"]=t},loadData:function(){var t=this,e={company_id:this.company_id,page:1,statistics_month:1==this.company_id?this.start_time_sc:2==this.company_id?this.start_time_cd:this.start_time_all};this.showLoading(),this.loadTBData(n["default"].urls.cpsDealMonth,e,"get").then((function(e){var a=t.createTBData(e,t.company_id);1==t.company_id&&(t.scTBData={tbData:a,tableHeader:t.scTBData.tableHeader,lockedRow:t.scTBData.lockedRow,lockedCol:t.scTBData.lockedCol}),2==t.company_id&&(t.cdTBData={tbData:a,tableHeader:t.cdTBData.tableHeader,lockedRow:t.cdTBData.lockedRow,lockedCol:t.cdTBData.lockedCol}),0==t.company_id&&(t.allTBData={tbData:a,tableHeader:t.allTBData.tableHeader,lockedRow:t.allTBData.lockedRow,lockedCol:t.allTBData.lockedCol})})).catch((function(e){t.alert(e.message||"加载数据失败")})).then((function(){t.hideLoading()}))},createTBData:function(t,e){for(var a=[],i=0;i<t.data.length;i++){a.push([]);for(var o=t.data[i],l=0;l<this.fields.length;l++)a[i].push({text:o[this.fields[l]]||(0===o[this.fields[l]]?o[this.fields[l]]:"--")})}return a}},watch:{company_id:function(t,e){var a=this;this.$nextTick((function(){1==t?a.$children[3].resizeFixedHead():2==t?a.$children[4].resizeFixedHead():a.$children[5].resizeFixedHead()}))}}},h=d,f=(a("95c6"),a("2877")),p=Object(f["a"])(h,i,o,!1,null,"667e182a",null);e["default"]=p.exports},"65f0":function(t,e,a){var i=a("861d"),o=a("e8b5"),l=a("b622"),r=l("species");t.exports=function(t,e){var a;return o(t)&&(a=t.constructor,"function"!=typeof a||a!==Array&&!o(a.prototype)?i(a)&&(a=a[r],null===a&&(a=void 0)):a=void 0),new(void 0===a?Array:a)(0===e?0:e)}},8418:function(t,e,a){"use strict";var i=a("c04e"),o=a("9bf2"),l=a("5c6c");t.exports=function(t,e,a){var r=i(e);r in t?o.f(t,r,l(0,a)):t[r]=a}},"95c6":function(t,e,a){"use strict";var i=a("e8e0"),o=a.n(i);o.a},a434:function(t,e,a){"use strict";var i=a("23e7"),o=a("23cb"),l=a("a691"),r=a("50c4"),s=a("7b0b"),n=a("65f0"),c=a("8418"),d=a("1dde"),h=a("ae40"),f=d("splice"),p=h("splice",{ACCESSORS:!0,0:0,1:2}),u=Math.max,b=Math.min,v=9007199254740991,m="Maximum allowed length exceeded";i({target:"Array",proto:!0,forced:!f||!p},{splice:function(t,e){var a,i,d,h,f,p,_=s(this),y=r(_.length),g=o(t,y),x=arguments.length;if(0===x?a=i=0:1===x?(a=0,i=y-g):(a=x-2,i=b(u(l(e),0),y-g)),y+a-i>v)throw TypeError(m);for(d=n(_,i),h=0;h<i;h++)f=g+h,f in _&&c(d,h,_[f]);if(d.length=i,a<i){for(h=g;h<y-i;h++)f=h+i,p=h+a,f in _?_[p]=_[f]:delete _[p];for(h=y;h>y-i+a;h--)delete _[h-1]}else if(a>i)for(h=y-i;h>g;h--)f=h+i-1,p=h+a-1,f in _?_[p]=_[f]:delete _[p];for(h=0;h<a;h++)_[h+g]=arguments[h+2];return _.length=y-i+a,d}})},d477:function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,".detail-container[data-v-667e182a]{background-color:#f2f2f2;padding:0;margin:0;overflow-y:scroll}",""]),t.exports=e},ddb0:function(t,e,a){var i=a("da84"),o=a("fdbc"),l=a("e260"),r=a("9112"),s=a("b622"),n=s("iterator"),c=s("toStringTag"),d=l.values;for(var h in o){var f=i[h],p=f&&f.prototype;if(p){if(p[n]!==d)try{r(p,n,d)}catch(b){p[n]=d}if(p[c]||r(p,c,h),o[h])for(var u in l)if(p[u]!==l[u])try{r(p,u,l[u])}catch(b){p[u]=l[u]}}}},e8b5:function(t,e,a){var i=a("c6b6");t.exports=Array.isArray||function(t){return"Array"==i(t)}},e8e0:function(t,e,a){var i=a("d477");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var o=a("499e").default;o("5755b273",i,!0,{sourceMap:!1,shadowMode:!1})},ea57:function(t,e,a){var i=a("4e4f");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var o=a("499e").default;o("2bc63ce5",i,!0,{sourceMap:!1,shadowMode:!1})},f781:function(t,e,a){"use strict";var i=a("ea57"),o=a.n(i);o.a},fdbc:function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);