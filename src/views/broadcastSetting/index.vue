<template>
  <div class="broadcast-setting">
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
        <a-button
          type="primary"
          @click="enterBroadcast"
          :disabled="info.zbState > 3"
        >
          进入直播
        </a-button>
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
            <overview v-if="currentMenu.key === '1'"/>
            <basicSetting v-if="currentMenu.key === '2'" :info="info"/>
            <watchSetting v-if="currentMenu.key === '3'"/>
            <receptionSetting v-else-if="currentMenu.key === '4'" :info="info"/>
            <interactManage v-else-if="currentMenu.key === '5'"/>
            <advertisementSetting v-else-if="currentMenu.key === '6'"/>
            <qrcodeSetting v-else-if="currentMenu.key === '7'"/>
            <goodsSetting v-else-if="currentMenu.key === '8'"/>
            <couponSetting v-else-if="currentMenu.key === '9'"/>
            <sharePoster v-else-if="currentMenu.key === '10'"/>
            <messageSetting v-else-if="currentMenu.key === '11'"/>
          </div>
        </div>
      </div>
      <a-modal
        :maskClosable="false"
        v-if="modalShow"
        :visible="modalShow"
        :footer="false"
        width="350px"
        :closable="false"
      >
        <div slot="title">
          <a-icon
            type="info-circle"
            style="margin-right: 10px; color: #faad14"
          />结束提醒
        </div>
        当前直播已结束，请回直播大厅
      </a-modal>
    </a-spin>
  </div>
</template>

<script>
import api from "../../api/api";
import receptionSetting from './receptionSetting/receptionSetting.vue'
import advertisementSetting from './advertisementSetting/advertisementSetting.vue'
import sharePoster from './sharePoster/sharePoster.vue'
import messageSetting from './messageSetting/messageSetting.vue'
import overview from './overview/overview.vue';
import basicSetting from './basicSetting/basicSetting.vue'
import watchSetting from './watchSetting/watchSetting.vue'
import qrcodeSetting from './qrcodeSetting/qrcodeSetting.vue'
import goodsSetting from './goodsSetting/goodsSetting.vue'
import interactManage from './interactManage/interactManage.vue'
import couponSetting from './couponSetting/couponSetting.vue'
export default {
  name: "broadcastsetting",
  components: {
    overview, // 总览
    basicSetting, // 基础设置
    watchSetting, // 观看设置
    receptionSetting, // 接待设置
    interactManage, // 互动管理
    advertisementSetting, //广告位设置
    qrcodeSetting, // 二维码设置
    goodsSetting, // 商品设置
    couponSetting, // 优惠券设置
    sharePoster, // 分享海报
    messageSetting, // 短信设置
  },
  data() {
    return {
      loading: false,
      modalShow: false, // 直播结束的弹窗显示隐藏
      info: {}, // 直播信息
      menuList: [
        { name: "总览", key: "1" },
        { name: "基础设置", key: "2" },
        { name: "观看设置", key: "3" },
        { name: "接待设置", key: "4" },
        { name: "互动管理", key: "5" },
        { name: "广告位设置", key: "6" },
        { name: "二维码设置", key: "7" },
        { name: "商品设置", key: "8" },
        { name: "优惠券设置", key: "9" },
        { name: "分享海报", key: "10" },
        { name: "短信设置", key: "11" },
      ],
      currentMenu: { name: "总览", key: "1" },
    };
  },
  created() {
    console.log(this.$route.query);
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.loading = true;
      api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
        console.log('获取info信息',res.data);
        this.info = res.data;
        if (res.data.zbState > 3) {
          this.modalShow = true;
        }
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
      });
    },
    // 进入直播间
    enterBroadcast() {
      console.log("进入直播间");
      api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
        if (res.data.zbState && res.data.zbState < 4) {
          // 跳到直播页面,获取直播间地址
          if (window.parent.toCard) {
              window.parent.toCard({
                single: true,
                title: "直播间",
                url: `${this.$config.roomFront}#/?zbId=${this.$route.query.zbId}`,
              });
            } else {
              // 开发时打开直播间地址
              window.open(`${this.$config.roomFront}#/?zbId=${this.$route.query.zbId}`)
            }
        } else {
          this.$message.error("直播彻底已结束，无法进入直播");
          

        }
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
.broadcast-setting {
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
