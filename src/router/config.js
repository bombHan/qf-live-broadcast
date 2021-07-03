export default [{
    path: '/',
    redirect: '/broadcast'
  },
  {
    path: "/broadcast",
    component: () => import("@/views/layoutManagement/index"),
    redirect: '/broadcast/broadcastHall',
    children: [
      {
        path: "broadcastHall",
        name: "broadcastHall",
        component: () => import("@/views/broadcastHall/broadcastHall.vue"),
        meta: {
          isBack: false,
          breadTitle: "直播大厅",
        },
      },
      {
        path: "broadcastSetting",
        name: "broadcastSetting",
        component: () => import("@/views/broadcastSetting/index.vue"),
        meta: {
          isBack: false,
          breadTitle: "直播设置",
        },
      },
      {
        path: "myCustomer",
        name: "myCustomer",
        component: () => import("../views/myCustomer/myCustomer.vue"),
        meta: {
          isBack: false,
          breadTitle: "我约的客户",
        },
      },
      {
        path: "broadcastData",
        name: "broadcastData",
        component: () => import("../views/broadcastData/index.vue"),
        meta: {
          isBack: false,
          breadTitle: "直播数据",
        },
      },
      {
        path: "orderAppointment",
        name: "orderAppointment",
        component: () => import("../views/orderAppointment/orderAppointment.vue"),
        meta: {
          isBack: false,
          breadTitle: "促单预约",
        },
      },
      {
        path: "orderTrack",
        name: "orderTrack",
        component: () => import("../views/orderTrack/orderTrack.vue"),
        meta: {
          isBack: false,
          breadTitle: "促单追踪",
        },
      },
      {
        path: "statisticsClassify",
        name: "statisticsClassify",
        component: () => import("../views/statisticsClassify/index.vue"),
        meta: {
          isBack: false,
          breadTitle: "统计分析",
        },
      },
    ]
  },
  {
    path: "/iframe",
    component: () => import("../views/iframe/index.vue"),
  },
  
];