(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-327165d8"],{8403:function(t,e,i){var o=i("24fb");e=o(!1),e.push([t.i,".detail-container[data-v-707f16e7]{background-color:#f2f2f2;padding:0;margin:0}",""]),t.exports=e},"8a04":function(t,e,i){"use strict";var o=i("c2cd"),n=i.n(o);n.a},c2cd:function(t,e,i){var o=i("8403");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var n=i("499e").default;n("1e8d7028",o,!0,{sourceMap:!1,shadowMode:!1})},e8ff:function(t,e,i){"use strict";i.r(e);var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"detail-container"},[i("div",{ref:"chart",staticStyle:{width:"100%",height:"100%"}})])},n=[],a=i("3eba"),l=i.n(a),s=(i("007d"),i("627c"),i("ef97"),i("d28f"),i("2c17")),r=i("bff1"),c={inject:["reload","alert","showLoading","hideLoading"],data:function(){return{echart:null}},created:function(){this.loadAllData()},methods:{loadAllData:function(){var t=this;this.showLoading(),Object(s["a"])({url:r["default"].urls.cpsAll,method:"get",params:{}}).then((function(e){if(200==e.status){var i=e.data;200==i.code?t.createOptions(i.data):t.alert(i.message||"加载统计数据失败")}else t.alert("加载统计数据失败")})).catch((function(e){t.alert("加载统计数据失败")})).then((function(e){t.hideLoading()}))},createDateItems:function(t,e){var i=[],o=new Date(t),n=new Date(e);while(o<=n){var a=o.getMonth()+1,l=o.getDate();i.push(a+"."+l),o.setDate(o.getDate()+1)}return i},createTitle:function(){return[{text:"云瞻信息总业绩图标",textStyle:{color:"#333333",fontWeight:"bold",fontSize:24},left:20,top:10},{text:"结算",top:60,left:20,textStyle:{color:"#333333",fontWeight:"bold",fontSize:16}},{text:"预估",top:"middle",left:20,textStyle:{color:"#333333",fontWeight:"bold",fontSize:16}}]},createLegend:function(){return{left:20,top:40,data:["淘宝","京东","拼多多","总业绩"],textStyle:{fontSize:14,fontWeight:"bold",color:"#333333"},itemGap:50,itemWith:30,itemHeight:4,icon:"rect"}},createGrid:function(){return[{x:60,y:110,width:(this.$refs.chart.clientWidth-120)/this.$refs.chart.clientWidth*100+"%",bottom:"55%"},{x:60,top:"55%",width:(this.$refs.chart.clientWidth-120)/this.$refs.chart.clientWidth*100+"%"}]},createXAxis:function(t,e){var i=this.createDateItems(t,e);return[{type:"category",gridIndex:0,boundaryGap:!1,name:"",position:"bottom",textStyle:{color:"#333333",fontSize:14},axisLine:{show:!1},data:i},{type:"category",gridIndex:1,boundaryGap:!1,name:"",position:"bottom",textStyle:{color:"#333333",fontSize:14},axisLine:{show:!1},data:i}]},createYAxis:function(){return[{position:"left",gridIndex:0,type:"value",name:"",textStyle:{color:"#333333",fontSize:14},axisLine:{show:!1},splitLine:{lineStyle:{color:"#E5E5E5",width:1}},axisLabel:{formatter:function(t,e){return t<1e3?t:t<1e4?t/1e3+"K":t<1e7?t/1e4+"W":t<1e8?t/1e7+"KW":t/1e8+"E"}}},{position:"left",gridIndex:1,type:"value",name:"",textStyle:{color:"#333333",fontSize:14},axisLine:{show:!1},splitLine:{lineStyle:{color:"#E5E5E5",width:1}},axisLabel:{formatter:function(t,e){return t<1e3?t:t<1e4?t/1e3+"K":t<1e7?t/1e4+"W":t<1e8?t/1e7+"KW":t/1e8+"E"}}}]},createSeries:function(t){return[{symbol:"none",lineStyle:{color:"#4880EA",width:1},itemStyle:{color:"#4880EA"},name:"淘宝",type:"line",data:t.js.tb},{lineStyle:{color:"#FFB400",width:1},itemStyle:{color:"#FFB400"},symbol:"none",name:"京东",type:"line",data:t.js.jd},{lineStyle:{color:"#FF5520",width:1},itemStyle:{color:"#FF5520"},symbol:"none",name:"拼多多",type:"line",data:t.js.pdd},{lineStyle:{color:"#94D243",width:1},itemStyle:{color:"#94D243"},symbol:"none",name:"总业绩",type:"line",data:t.js.tj},{symbol:"none",lineStyle:{color:"#4880EA",width:1},itemStyle:{color:"#4880EA"},name:"淘宝",type:"line",data:t.yg.tb,xAxisIndex:1,yAxisIndex:1},{lineStyle:{color:"#FFB400",width:1},itemStyle:{color:"#FFB400"},symbol:"none",name:"京东",type:"line",data:t.yg.jd,xAxisIndex:1,yAxisIndex:1},{lineStyle:{color:"#FF5520",width:1},itemStyle:{color:"#FF5520"},symbol:"none",name:"拼多多",type:"line",data:t.yg.pdd,xAxisIndex:1,yAxisIndex:1},{lineStyle:{color:"#94D243",width:1},itemStyle:{color:"#94D243"},symbol:"none",name:"总业绩",type:"line",data:t.yg.tj,xAxisIndex:1,yAxisIndex:1}]},createOptions:function(t){for(var e,i,o={tb:[],jd:[],pdd:[],tj:[]},n={tb:[],jd:[],pdd:[],tj:[]},a=0;a<t.estimate_commission.length;a++)0==a&&(e=t.estimate_commission[a].time),a==t.estimate_commission.length-1&&(i=t.estimate_commission[a].time),n.tb.push(t.estimate_commission[a].value.tb||0),n.jd.push(t.estimate_commission[a].value.jd||0),n.pdd.push(t.estimate_commission[a].value.pdd||0),n.tj.push(t.estimate_commission[a].value.all||0);for(var s=0;s<t.settle_commission.length;s++)o.tb.push(t.settle_commission[s].value.tb||0),o.jd.push(t.settle_commission[s].value.jd||0),o.pdd.push(t.settle_commission[s].value.pdd||0),o.tj.push(t.settle_commission[s].value.all||0);var r={title:this.createTitle(),legend:this.createLegend(),grid:this.createGrid(),backgroundColor:"#FFFFFF",xAxis:this.createXAxis(e,i),yAxis:this.createYAxis(),series:this.createSeries({js:o,yg:n}),tooltip:{trigger:"axis"}};this.echart||(this.echart=l.a.init(this.$refs.chart)),this.echart.setOption(r)}}},d=c,h=(i("8a04"),i("2877")),m=Object(h["a"])(d,o,n,!1,null,"707f16e7",null);e["default"]=m.exports}}]);