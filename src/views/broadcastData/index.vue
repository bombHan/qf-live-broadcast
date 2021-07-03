<template>
  <div class="broadcast-data">
    <a-spin :spinning="loading">
      <div class="title">
        <div style="display: flex; align-items: center">
          <span style="font-size: 18px">{{ info.zbName }}</span>
          <div
            style="
              padding: 0 10px;
              border-radius: 12px;
              margin-left: 10px;
            "
            :style="info.zbState === 1 ? 'border: 1px solid orange;' : (info.zbState === 2 ? 'border: 1px solid #23bf80;': 'border: 1px solid #999;')"
          >
            <template v-if="info.zbState === 2">
              <a-badge color="#23bf80" />
              <span style="color: #23bf80">{{
                $dictionary.actualZbState[info.zbState]
              }}</span>
            </template>
            <template v-else-if="info.zbState === 1">
              <a-badge color="orange" />
              <span style="color: orange">{{
                $dictionary.actualZbState[info.zbState]
              }}</span>
            </template>
            <template v-else-if="info.zbState === 3 || info.zbState === 4">
              <a-badge color="#999999" />
              <span style="color: #999999">{{
                $dictionary.actualZbState[info.zbState]
              }}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="menu">
        <div
          v-for="item in menuList"
          :key="item.key"
          :class="
            currentMenu.key === item.key
              ? 'menu-item active-menu-item'
              : 'menu-item'
          "
          @click="changeMenu(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="content">
        <div style="padding: 20px">
          <div class="content-title">{{currentMenu.name}}</div>
          <div class="content-content">
            <dataStatistics v-if="currentMenu.key=== '1'"/>
            <visitorDataLsit v-else-if="currentMenu.key=== '2'"/>
            <appointmentCustomerData v-else-if="currentMenu.key=== '3'"/>
            <interactInformation v-else-if="currentMenu.key=== '4'"/>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import api from "../../api/api";
import dataStatistics from './dataStatistics/dataStatistics.vue'
import visitorDataLsit from './visitorDataLsit/visitorDataLsit.vue'
import appointmentCustomerData from './appointmentCustomerData/appointmentCustomerData'
import interactInformation from './interactInformation/interactInformation.vue'
export default {
  name: "broadcastData",
  components: {
    dataStatistics, // 直播数据统计
    visitorDataLsit, // 访客数据列表
    appointmentCustomerData, // 预约客户数据
    interactInformation, // 互动信息收集
  },
  data() {
    return {
      loading: false,
      modalShow: false, // 直播结束的弹窗显示隐藏
      info: {}, // 直播信息
      menuList: [
        { name: "直播数据统计", key: "1" },
        { name: "访客数据列表", key: "2" },
        { name: "预约客户数据", key: "3" },
        { name: "互动信息收集", key: "4" },
      ],
      currentMenu: { name: "访客数据列表", key: "2" },
    };
  },
  created() {
    // console.log(this.$route.query);
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.loading = true;
      api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
        console.log('当前直播信息',res);
        this.info = res.data;
        if (res.data.zbState > 2) {
          this.modalShow = true;
        }
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
      });
    },
    // 切换菜单
    changeMenu(item) {
      if (item.key !== this.currentMenu.key) {
        this.currentMenu = item;
        this.getInfo();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.broadcast-data {
  height: 100vh;
  position: relative;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    border-bottom: 1px solid #ccc;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;
    z-index: 999;
  }
  .menu {
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 0;
    width: 180px;
    border-right: 1px solid #ccc;
    background: #fff;
    overflow: auto;
    .menu-item {
      text-align: center;
      padding: 15px 0;
      cursor: pointer;
      &:hover {
        color: #51abff;
      }
    }
    .active-menu-item {
      color: #1890ff;
    }
  }
  .content {
    height: 100vh;
    padding: 80px 0 0 180px;
    background: #fff;
    overflow: auto;
    .content-title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
}
</style>
