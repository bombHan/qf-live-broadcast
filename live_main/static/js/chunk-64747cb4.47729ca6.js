(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-64747cb4"],{"9c6cc":function(t,A,e){"use strict";e.r(A);var a=function(){var t=this,A=t.$createElement,a=t._self._c||A;return a("div",{staticClass:"order-track"},[a("searchTool",{staticStyle:{margin:"0 0 20px 20px"},attrs:{topData:t.topData},on:{getFilterData:t.search}}),a("div",{staticStyle:{padding:"0 20px","margin-bottom":"20px"}},[t._v("\n    促单追踪包含自己及权限内的成员已参与直播的客户，共包含客户\n    "+t._s(t.joinNumber)+" 条，其中赢单 "+t._s(t.winNumber)+" 次。\n  ")]),a("a-table",{attrs:{loading:t.loading,columns:t.columns,dataSource:t.dataList,rowKey:function(t){return t.custId},pagination:!1},scopedSlots:t._u([{key:"action",fn:function(A,n){return[a("div",[1===n.isBelongMe?a("img",{staticStyle:{cursor:"pointer"},attrs:{title:"客户卡片",src:e("b2ce")},on:{click:function(A){return t.customerCard(n)}}}):t._e(),1===n.isBelongMe?a("img",{staticStyle:{margin:"0 10px",cursor:"pointer"},attrs:{title:"跟进",src:e("f95b")},on:{click:function(A){return t.followUp(n)}}}):t._e(),a("img",{staticStyle:{cursor:"pointer"},attrs:{title:"直播卡片",src:e("ce37")},on:{click:function(A){return t.liveBroadcastCard(n)}}})])]}}])}),a("div",{staticStyle:{display:"flex","flex-direction":"row-reverse"}},[a("a-pagination",{staticStyle:{"margin-top":"20px","margin-right":"20px"},attrs:{showTotal:function(A){return"共 "+t.pagination.total+" 条"},showSizeChanger:"",showQuickJumper:"",pageSize:t.pagination.pageSize,total:t.pagination.total,current:t.pagination.pageNum},on:{change:t.pagerChange,showSizeChange:t.sizeChange}})],1),t.modalShow?a("liveBroadcastCardModal",{attrs:{modalShow:t.modalShow},on:{cancel:function(A){t.modalShow=!1}}}):t._e()],1)},n=[],i=(e("ac67"),e("1bc78"),e("32ea"),e("3612")),o=(e("a450"),e("ad80")),r=e("826a"),s=e("4ec3");function c(t,A){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);A&&(a=a.filter((function(A){return Object.getOwnPropertyDescriptor(t,A).enumerable}))),e.push.apply(e,a)}return e}function l(t){for(var A=1;A<arguments.length;A++){var e=null!=arguments[A]?arguments[A]:{};A%2?c(Object(e),!0).forEach((function(A){Object(i["a"])(t,A,e[A])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):c(Object(e)).forEach((function(A){Object.defineProperty(t,A,Object.getOwnPropertyDescriptor(e,A))}))}return t}var B={name:"orderTrack",components:{searchTool:o["a"],liveBroadcastCardModal:r["a"]},data:function(){return{loading:!1,joinNumber:0,winNumber:0,filterObj:{},modalShow:!1,dataList:[],pagination:{pageSize:10,pageNum:1,total:null},columns:[{title:"操作",dataIndex:"action",scopedSlots:{customRender:"action"}},{title:"客户名称",dataIndex:"resCustName"},{title:"联系人",dataIndex:"resName"},{title:"联系电话",dataIndex:"resPhone"},{title:"所有者",dataIndex:"applyName"},{title:"商机阶段",dataIndex:"stageName"},{title:"参与直播名称",dataIndex:"zbName"},{title:"参与直播时间",dataIndex:"visitTime"},{title:"直播人",dataIndex:"zbAcctName"},{title:"促单效果",dataIndex:"resultStateStr"}],topData:{selectList:[{name:"resCustName",text:"客户名称"},{name:"resName",text:"联系人"}],filterList:[{type:"select",name:"stageId",label:"商机阶段",options:[]},{type:"rangepicker",name:"joinTime",label:"参与直播时间",showTime:!0,format:"YYYY-MM-DD HH:mm:ss"},{type:"treeSelect",name:"zbAcctId",label:"直播人",treeSelectParams:{fetchUrl:"/orgGroup/get_all_sale_user_json"}},{type:"select",name:"resultState",label:"促单效果",options:[{label:"新商机",value:1},{label:"推进商机",value:2},{label:"赢单",value:3}]}]}}},created:function(){this.getBussinessList(),this.getDataNumber(),this.getDataList()},methods:{getDataNumber:function(){var t=this;s["a"].reserveCustFindNumberByTrace().then((function(A){console.log("促单追踪数据",A.data),t.joinNumber=A.data.joinNumber,t.winNumber=A.data.winNumber}))},getBussinessList:function(){var t=this;s["a"].tsmBusinessStageSetListJson().then((function(A){console.log("商机阶段可选择列表",A);var e=A.data.map((function(t){return{label:t.name,value:t.id}}));t.topData.filterList[0].options=e}))},search:function(t){this.filterObj=l(l({},t),{},{applyId:t.applyId?t.applyId.join(","):null,zbAcctId:t.zbAcctId?t.zbAcctId.join(","):null,joinTime:t.joinTime?t.joinTime.join(","):null}),console.log(this.filterObj),this.getDataList()},getDataList:function(){var t=this;console.log("列表请求参数",this.filterObj),this.loading=!0,s["a"].reserveCustFindReserveCustByTrace(l(l({},this.filterObj),{},{zbId:this.$route.query.zbId,pageSize:this.pagination.pageSize,pageNum:this.pagination.pageNum})).then((function(A){console.log("促单追踪列表",A.data),t.dataList=A.data.list,t.pagination=l(l({},t.pagination),{},{total:A.data.total}),t.loading=!1}))},sizeChange:function(t,A){this.pagination.pageSize=A,this.pagination.pageNum=1,console.log(this.pagination),this.getDataList()},pagerChange:function(t,A){this.pagination.pageNum=t,this.getDataList()},liveBroadcastCard:function(t){console.log("直播卡片",t),this.modalShow=l(l({},t),{},{visitId:t.visitId})},customerCard:function(t){console.log("客户卡片",t);var A=window.location;window.parent.toCard&&window.parent.toCard({single:!0,title:"客户卡片",url:"".concat(A.origin).concat(this.$config.hyxFront,"/#/customer-card?id=").concat(t.resId)})},followUp:function(t){console.log("跟进",t);var A=window.location;window.parent.toCard&&window.parent.toCard({single:!0,title:"跟进",url:"".concat(A.origin).concat(this.$config.hyxFront,"/#/client/businessFollow?moduleType=0&resCustId=").concat(t.resId)})}}},Q=B,g=(e("a1ff"),e("4ac2")),d=Object(g["a"])(Q,a,n,!1,null,"ca2b1b3a",null);A["default"]=d.exports},a1ff:function(t,A,e){"use strict";e("ed9f")},b2ce:function(t,A){t.exports="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQAI/8QAIRAAAQUBAAICAwAAAAAAAAAAAQIDBAURBgAhEhMHIkH/xAAVAQEBAAAAAAAAAAAAAAAAAAAGB//EAB8RAAEDBQADAAAAAAAAAAAAAAECERIAAyExUTJCwf/aAAwDAQACEQMRAD8A11VSuhtuUh9LbsXARMjImvTR2TsGOAsBQIbSUobT+wAH89bp9+KR3Ok52wobNiNbxoj1nCjuvS+ocsmHGX322iPqWSDoc0KGEHDubs8h0/jam4uxr+hr34TUeJOfhUkqQQGQMXHdbbUj5FaEKSrTg95o8UrXpVvRc3zMSqtlvQ7GCsyZFNIgx240aS26FKLqEpCvraA+Kd1R9DPKRcubJQIyI9ow75R+axRBCVOMl2HHfmnr/9k="},ce37:function(t,A){t.exports="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQMI/8QAIhAAAgMAAgIBBQAAAAAAAAAAAQIDBAUGEQAhMQcSEzJh/8QAFQEBAQAAAAAAAAAAAAAAAAAABgf/xAAfEQACAQQCAwAAAAAAAAAAAAABERIAAgNRITEiMkL/2gAMAwEAAhEDEQA/ANe4svJd7jWdv6VXakbRhisNZj5jLShZpeioWJCqoCWVQoHfwPZ8UQcn4rq4l5aezShfUp1Z3u8nl0ImimsJCymKQkE9SeiOiCAe/keViuz5f02y+K28PXGpnRVKswkwrdqq/wCB4/uIaKNlkVghIAPvsAke+k47D7edg8fzc7kFiWHTpWZbepl2KsccUNqOdyXlRR8IVVQSf1H98ouTIWSbBCRH0ob9opdcLVEbLSx5GSGm9dOv/9k="},ed9f:function(t,A,e){},f95b:function(t,A){t.exports="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEI/8QAHxAAAQQDAQEBAQAAAAAAAAAAAQIDBAUGERIiEyQl/8QAFAEBAAAAAAAAAAAAAAAAAAAABv/EAB8RAAIABQUAAAAAAAAAAAAAABETACMxYvBBUYGRsv/aAAwDAQACEQMRAD8A3tf30fMoeQWFhkDtTh1c47D/AASPkXijy6446n1rraUoSQCBs9dABQX0fDIePz6/IHbbDrBxqF++R9SyV+WnG3VetdaSpCiQAdjnkgy+oI+Fw8gr7DH3bbDrFx2Z/PjfUslfp1txpPrXW1JWkEAHR55BKgoI+aQ8fr6/H3anDq9xqb/Qj/IvFHppptpXrXRClLUACBoddEhlIRqo2gDthwQdnOu5385WP//Z"}}]);
//# sourceMappingURL=chunk-64747cb4.47729ca6.js.map