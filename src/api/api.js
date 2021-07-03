import { $axios_qfy } from "./index";

let api = {
  // Get 接口
  // listPageJson(params) {
  //   console.log(params)
  //   return $axios_qfy.get("/zb/room/listPageJson", {params:params});
  // },
},
  apiUrl = {
    // Post 接口
    //直播大厅
    inputAndUpdZb: '/zb/room/inputAndUpdZb', // 创建和修改直播
    orgGroupGet_group_user_json: "/orgGroup/get_group_user_json", // 获取人员权限树
    orgGroupGet_all_sale_user_json: "/orgGroup/get_all_sale_user_json", // 获取全部人员树

    // 直播设置
    recepSaveJson: "/zb/recep/saveJson", // 接待设置保存
    saveAdvSwitchSet: "/zb/advertising/saveAdvSwitchSet", // 广告位设置开关
    advertisingSaveOrUpdate: "/zb/advertising/saveOrUpdate", // 广告位保存
    advertisingDel: "/zb/advertising/del", // 删除广告位
    postersaveJson: "/zb/poster/saveJson", // 保存海报信息
    smsSaveOrUpdate: "/zb/sms/saveOrUpdate", // 短信预约信息保存
    roomSaveReadset: "/zb/room/saveReadset", // 保存观看设置
    reserveCustSaveHyxCust: '/zb/reserveCust/saveHyxCust', // 慧营销客户加入直播
    reserveCustSaveReserveOrder: "/zb/reserveCust/saveReserveOrder", // 邀请申请列表客户--保存
    qrcodeSaveJson: "/zb/qrcode/saveJson", // 二维码设置保存
    shopSaveJson: "/zb/shop/saveJson", // 商品设置保存商品信息
    shopSaveShop: "/zb/shop/saveShop", // 商品设置从商品库选商品
    shopDelJson: '/zb/shop/delJson', // 商品设置删除商品
    prizeSaveJson: "/zb/prize/saveJson", // 互动管理抽奖新增，编辑保存
    prizePushPrize: "/zb/prize/pushPrize" , // 互动管理抽奖---推送
    zbPrizeChoicePrize: "/zb/prize/choicePrize", // 互动管理抽奖---开奖
    zbFormSaveJson: "/zb/form/saveJson", // 互动管理表单添加活动
    zbFormDelJson: "/zb/form/delJson", // 互动管理表单删除
    couponDelJson: "/zb/coupon/delJson", // 优惠券删除
    couponSaveJson: "/zb/coupon/saveJson", // 优惠券设置
    couponInsertJson: "/zb/coupon/insertJson", // 优惠券选用

    // 我约的客户
    cardSaveReview: "/cust/card/saveReview", // 我预约的客户-直播卡片-新增点评内容
    visitorJoinHyx: "/zb/visitor/joinHyx", // 我预约的客户-直播卡片-转入慧营销

    //促单预约
    reserveOrderSaveJson: "/zb/reserveOrder/saveJson", // 促单预约拒绝
    

  },
  getApiUrl = {
    // get 接口
    // 实名认证接口
    roomCheckRealName: "/zb/room/checkRealName", // 实名认证获取
    zbCodesJson: "/api/zb/codesJson", // 获取码库，主要为了创建直播的默认图片

    //直播大厅
    willPlyAndMyData: "/zb/room/willPlyAndMyData", // 展示即将开播和我的数据
    rankListData: "/zb/room/rankListData", // 直播大厅右下角数据
    isExistName: '/zb/room/isExistName', // 查询直播名称是否重复
    listPageJson: "/zb/room/listPageJson", // 直播列表
    getZbState: "/zb/room/getZbState", // 获取直播状态和信息
    roomShareUrl: "/zb/room/shareUrl", // 获取直播地址
    // 添加客户弹窗
    addcustSearchs: "/zb/addcust/searchs", // 获取查询项
    orgGroupGet_group_json: "/orgGroup/get_group_json", // 资源录入部门组织树
    taoCustomerGetCustPortraitList: "/res/taoCustomer/getCustPortraitList", // 客户画像二级列表
    resGroupGet_res_group_json: "/res/resGroup/get_res_group_json", // 资源分组二级列表
    addcustList: "/zb/addcust/list", // 添加客户 - 查询列表

    //直播设置
    recepGetInfo: "/zb/recep/getInfo", // 接待设置信息获取
    advertisingList: "/zb/advertising/list", // 广告位数据获取
    posterInfoJson: "/zb/poster/infoJson", // 分享海报信息查询
    smsGetInfo: '/zb/sms/getInfo', // 获取短信预约信息
    typeListJson: '/sms/temp/type/listJson', // 短信类别列表获取
    tempListJson: '/sms/temp/listJson', // 短信模板列表回去
    roomZbInfo: "/zb/room/zbInfo", // 总览信息获取
    reserveOrderListJson: "/zb/reserveOrder/listJson", // 观看设置中申请列表客户列表获取
    qrcodeInfoJson: "/zb/qrcode/infoJson", // 二维码设置信息获取
    shopInfoJson: "/zb/shop/infoJson", // 商品设置获取某个商品的详情
    shopListPageJson: "/zb/shop/listPageJson", // 商品设置，商品列表获取
    shopShopListPage: "/zb/shop/shopListPage", // 商品设置，选用商品列表
    shopQueryOrg: "/zb/shop/queryOrg", // 商品是否开通商城
    prizeListPageJson: "/zb/prize/listPageJson", // 互动管理抽奖列表
    zbPrizeVisitInfoJson: "/zb/prizeVisit/infoJson", // 互动管理抽奖的详情查看列表
    zbFormListPageJson: "/zb/form/listPageJson", // 互动管理表单列表
    prizeGetPrizeCount: "/zb/prize/getPrizeCount", // 互动管理点击开奖获取抽奖人数
    couponListPageJson: "/zb/coupon/listPageJson", // 优惠券分页列表
    couponInfoJson: "/zb/coupon/infoJson", // 获取优惠券详情
    couponLiveCouponPage: "/zb/coupon/liveCouponPage", // 获取选用优惠券的列表
    
    // 我约的客户
    reserveCustCustListPage: "/zb/reserveCust/custListPage", // 我约的客户列表
    reserveCustGetZbData: "/zb/reserveCust/getZbData", // 我约的客户直播数据
    visitorFindVisitorByVisitId: "/zb/visitor/findVisitorByVisitId", // 我约的客户中直播卡片详情
    zbVisitorLogListPageJson: "/zb/visitorLog/listPageJson", // 我约的客户中 访客日志列表
    cardCustReviewList: "/cust/card/custReviewList", // 我约的客户中 点评列表

    // 直播数据
    dataInfoJson: "/zb/data/infoJson", // 直播数据统计-直播数据和互动数据和商品点数据
    visitorFindDataWithVisitAndTerminal: "/zb/visitor/findDataWithVisitAndTerminal", // 直播数据统计-短信发送情况，客户分步，观看终端
    visitorFindDataWithArea: "/zb/visitor/findDataWithArea", // 直播数据统计-地域分布
    zbDataOnlineListJson: "/zb/dataOnline/listJson", // 直播数据统计-实时观看人次
    visitorListPageJson: "/zb/visitor/listPageJson", // 访客数据列表 -列表数据
    reserveCustListPageJson: "/zb/reserveCust/listPageJson", // 预约客户数据-列表数据
    interactCollectListPage: "/zb/interactCollect/listPage", // 互动信息收集-数据列表

    //促单预约
    reserveOrderListPageJson: "/zb/reserveOrder/listPageJson", // 促单预约列表
    tsmBusinessStageSetListJson: "/business/tsmBusinessStageSet/listJson", // 商机阶段列表

    //促单追踪
    reserveCustFindReserveCustByTrace: "/zb/reserveCust/findReserveCustByTrace", // 促单追踪列表
    reserveCustFindNumberByTrace: "/zb/reserveCust/findNumberByTrace", // 促单追踪-参与直播客户数据
    
    // 统计分析
    statisticAnalyzeLiveDetail: "/zb/statistic/analyzeLiveDetail" , // 数据统计- 直播数据列表
    statisticAnalyzeLiveWeek: "/zb/statistic/analyzeLiveWeek", // 数据统计- 直播数据列表
    statisticAnalyzeLiveEffect: "/zb/statistic/analyzeLiveEffect", // 效果统计 -列表

  };

for (let [key, value] of Object.entries(getApiUrl)) {
  api[key] = (params) => {
    return $axios_qfy.get(value, {params:params});
  };
}

for (let [key, value] of Object.entries(apiUrl)) {
  api[key] = (params) => {
    return $axios_qfy.post(value, params);
  };
}

export default api;