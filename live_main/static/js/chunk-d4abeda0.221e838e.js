(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d4abeda0"],{"046c":function(t,e,a){t.exports=a.p+"static/img/已通过.99be0b6b.png"},"1f24":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[t.str.length>t.max?a("a-tooltip",{class:t.className,attrs:{placement:t.placement,title:t.str}},[t._v("\n    "+t._s(t.str.length>t.max?t.str.slice(0,t.max)+"...":t.str)+"\n  ")]):a("span",[t._v(t._s(t.str))])],1)},i=[],s=(a("e680"),{props:{placement:{type:String,required:!1,default:"top"},className:{type:String,required:!1,default:""},str:{type:String,required:!0,default:""},max:{type:Number,required:!1,default:0}},data:function(){return{}},created:function(){},methods:{}}),r=s,l=a("4ac2"),o=Object(l["a"])(r,n,i,!1,null,null,null);e["a"]=o.exports},"354c":function(t,e,a){},"55b1":function(t,e,a){"use strict";a("354c")},"81a9":function(t,e,a){},"86fc":function(t,e,a){"use strict";a("81a9")},a661:function(t,e,a){t.exports=a.p+"static/img/已拒绝.0a652dc7.png"},bc08:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"order-appointment"},[n("a-spin",{attrs:{spinning:t.loading}},[n("a-radio-group",{attrs:{"button-style":"solid"},on:{change:t.changeTab},model:{value:t.tabType,callback:function(e){t.tabType=e},expression:"tabType"}},[n("a-radio-button",{staticStyle:{width:"120px","text-align":"center"},attrs:{value:1}},[t._v("\n        我申请的\n      ")]),n("a-radio-button",{staticStyle:{width:"120px","text-align":"center"},attrs:{value:2}},[t._v("\n        我下属申请的\n      ")]),n("a-radio-button",{staticStyle:{width:"120px","text-align":"center"},attrs:{value:3}},[t._v("\n        指定给我的\n      ")])],1),n("searchTool",{key:t.tabType,staticStyle:{margin:"20px 0"},attrs:{topData:t.topData},on:{getFilterData:t.search}}),t.dataList.length>0?n("div",{staticClass:"content"},t._l(t.dataList,(function(e,i){return n("div",{key:i,staticClass:"content-item"},[n("div",{staticClass:"content-item-top"},[n("div",{staticClass:"left"},[n("div",{staticStyle:{display:"flex","flex-wrap":"wrap"}},[n("div",{staticClass:"left-item"},[t._v("\n                预约客户："+t._s(e.resCustName)+"-"+t._s(e.resName)+"-"+t._s(e.resPhone)+"\n              ")]),n("div",{staticClass:"left-item"},[t._v("\n                预约主播：\n                "),n("tooltip",{attrs:{str:e.reserveAcctName,max:20}})],1),n("div",{staticClass:"left-item"},[t._v("主题："+t._s(e.theme))])]),n("div",{staticClass:"left-item"},[t._v("\n              预计直播时间："+t._s(e.zbStartTime)+" ~ "+t._s(e.zbEndTime)+"\n            ")]),n("div",{staticClass:"left-item",staticStyle:{"margin-bottom":"0"}},[t._v("\n              备注："+t._s(e.remark)+"\n            ")])]),n("div",{staticClass:"right"},[0===e.type?n("a-button",{on:{click:function(a){t.modalShow=e.id}}},[t._v("拒绝")]):t._e(),1===e.type?n("img",{attrs:{src:a("046c")}}):t._e(),2===e.type?n("img",{attrs:{src:a("a661")}}):t._e()],1)]),n("div",{staticClass:"content-item-center"},[n("div",{staticClass:"item"},[t._v("申请人："+t._s(e.applyName))]),n("div",{staticClass:"item"},[t._v("申请时间："+t._s(e.inputTime))])]),0!==e.type?n("div",{staticClass:"content-item-bottom"},[2===e.type?n("div",{staticClass:"item"},[t._v("\n            拒绝理由："+t._s(e.refuseRemark)+"\n          ")]):t._e(),1===e.type?n("div",{staticClass:"item"},[t._v("\n            直播名称："+t._s(e.zbName)+"\n          ")]):t._e(),1===e.type?n("div",{staticClass:"item"},[t._v("\n            直播人："+t._s(e.zbAcctName)+"\n          ")]):t._e(),1===e.type?n("div",{staticClass:"item"},[t._v("\n            直播时间："+t._s(e.zbTime)+"\n          ")]):t._e()]):t._e()])})),0):n("a-empty",{attrs:{image:t.$Empty.PRESENTED_IMAGE_SIMPLE}}),t.dataList.length>0?n("div",{staticStyle:{display:"flex","flex-direction":"row-reverse"}},[n("a-pagination",{staticClass:"diy-pagination",staticStyle:{"margin-top":"20px"},attrs:{showTotal:function(e){return"共 "+t.pagination.total+" 条"},showSizeChanger:"",showQuickJumper:"",pageSize:t.pagination.pageSize,total:t.pagination.total,current:t.pagination.pageNum},on:{change:t.pagerChange,showSizeChange:t.sizeChange}})],1):t._e()],1),t.modalShow?n("rejectModal",{attrs:{modalShow:!!t.modalShow},on:{cancel:function(e){t.modalShow=!1},ok:t.rejectModalOk}}):t._e()],1)},i=[],s=(a("ac67"),a("1bc78"),a("32ea"),a("3612")),r=a("ad80"),l=a("4ec3"),o=a("1f24"),c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{maskClosable:!1,title:"拒绝",visible:t.modalShow,width:"500px"},on:{ok:t.ok,cancel:t.cancel}},[a("a-row",[a("a-col",{staticStyle:{"text-align":"right"},attrs:{span:6}},[t._v(" 拒绝理由： ")]),a("a-col",{attrs:{span:1}}),a("a-col",{attrs:{span:15}},[a("a-textarea",{attrs:{placeholder:"请输入拒绝理由","auto-size":{minRows:8,maxRows:8},maxLength:100},model:{value:t.refuseRemark,callback:function(e){t.refuseRemark=e},expression:"refuseRemark"}}),a("div",{staticStyle:{display:"flex",margin:"15px 0"}},t._l(t.tagList,(function(e,n){return a("div",{key:n,staticClass:"tag",on:{click:function(a){return t.clickTag(e)}}},[t._v("\n          "+t._s(e)+"\n        ")])})),0)],1)],1)],1)},p=[],m={name:"rejectModal",props:{modalShow:{type:Boolean||String,default:!1,required:!1}},data:function(){return{refuseRemark:"",tagList:["该客户无号码","该直播无计划"]}},created:function(){},methods:{clickTag:function(t){console.log(t),t.length+this.refuseRemark.length>100?this.$message.error("拒绝理由超出规定字符，无法插入"):this.refuseRemark+=t},ok:function(){this.refuseRemark?this.$emit("ok",this.refuseRemark):this.$message.error("请输入拒绝理由")},cancel:function(){this.$emit("cancel")}}},u=m,d=(a("86fc"),a("4ac2")),g=Object(d["a"])(u,c,p,!1,null,"8acbb1d0",null),h=g.exports;function f(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function b(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?f(Object(a),!0).forEach((function(e){Object(s["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):f(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var v={name:"orderAppointment",components:{searchTool:r["a"],tooltip:o["a"],rejectModal:h},data:function(){return{loading:!1,tabType:1,obj:{input:""},filterObj:{},pagination:{pageSize:10,pageNum:1,total:0},dataList:[],modalShow:!1}},created:function(){this.getDataList()},methods:{changeTab:function(){this.filterObj={},this.getDataList()},search:function(t){t&&(this.filterObj=b(b({},t),{},{applyIdStr:t.applyIdStr?t.applyIdStr.join(","):null})),this.getDataList()},sizeChange:function(t,e){this.pagination.pageSize=e,this.pagination.pageNum=1,console.log(this.pagination),this.getDataList()},pagerChange:function(t,e){this.pagination.pageNum=t,this.getDataList()},getDataList:function(){var t=this;console.log(this.tabType,this.filterObj),this.loading=!0,l["a"].reserveOrderListPageJson(b(b({tabType:this.tabType},this.filterObj),{},{pageSize:this.pagination.pageSize,pageNum:this.pagination.pageNum})).then((function(e){console.log(e.data),t.loading=!1,t.dataList=e.data.list,t.pagination=b(b({},t.pagination),{},{total:e.data.total})}))},rejectModalOk:function(t){var e=this;console.log(this.modalShow,t),l["a"].reserveOrderSaveJson({id:this.modalShow,refuseRemark:t}).then((function(t){console.log(t),e.$message.success("拒绝成功"),e.modalShow=!1,e.getDataList()}))}},computed:{topData:function(){var t={};return 1===this.tabType?t={selectList:[{name:"resCustName",text:"预约客户"},{name:"resName",text:"联系人"},{name:"resPhone",text:"电话"},{name:"theme",text:"主题"},{name:"remark",text:"备注"}],filterList:[{type:"select",name:"type",label:"申请状态",options:[{label:"待通过",value:0},{label:"已通过",value:1},{label:"已拒绝",value:2}]}]}:2===this.tabType?t={selectList:[{name:"resCustName",text:"预约客户"},{name:"resName",text:"联系人"},{name:"resPhone",text:"电话"},{name:"theme",text:"主题"},{name:"remark",text:"备注"}],filterList:[{type:"treeSelect",name:"applyIdStr",label:"申请人"},{type:"select",name:"type",label:"申请状态",options:[{label:"待通过",value:0},{label:"已通过",value:1},{label:"已拒绝",value:2}]}]}:3===this.tabType&&(t={selectList:[{name:"resCustName",text:"预约客户"},{name:"resName",text:"联系人"},{name:"resPhone",text:"电话"},{name:"theme",text:"主题"},{name:"remark",text:"备注"}],filterList:[{type:"treeSelect",name:"applyIdStr",label:"申请人",treeSelectParams:{fetchUrl:"/orgGroup/get_all_sale_user_json"}},{type:"select",name:"type",label:"申请状态",options:[{label:"待通过",value:0},{label:"已通过",value:1},{label:"已拒绝",value:2}]}]}),t}}},y=v,_=(a("55b1"),Object(d["a"])(y,n,i,!1,null,"2a758793",null));e["default"]=_.exports}}]);
//# sourceMappingURL=chunk-d4abeda0.221e838e.js.map