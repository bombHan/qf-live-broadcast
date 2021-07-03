<template>
  <div class="overview">
    <div style="display: flex; justify-content: space-between">
      <a-form-model style="width: calc(100% - 400px)">
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16, offset: 1 }"
          label="直播名称"
        >
          <div>{{ info.zbName }}</div>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16, offset: 1 }"
          label="预计开播时间"
        >
          <div>{{ info.expectStartTime }}</div>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16, offset: 1 }"
          label="实际开播时间"
          v-if="!!info.actualStartTime"
        >
          <div>{{ info.actualStartTime }}</div>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16, offset: 1 }"
          label="主播"
        >
          <div>{{ info.anchorName }}</div>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16, offset: 1 }"
          label="助手"
        >
          <div>{{ info.assisNames }}</div>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16, offset: 1 }"
          label="直播简介"
        >
          <div>{{ info.zbDesc }}</div>
        </a-form-model-item>
      </a-form-model>
      <div style="padding-right: 20px">
        <img :src="info.picUrl" style="width: 200px; height: 200px" />
        <div
          style="margin-top: 20px; display: flex; flex-direction: row-reverse"
        >
          <a-button
            type="primary"
            ghost
            style="margin-left: 20px"
            @click="watch"
            >观看</a-button
          >
          <a-button type="primary" ghost @click="share">分享</a-button>
        </div>
      </div>
    </div>
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <div style="font-size: 16px">直播数据</div>
      <a-button
        type="primary"
        ghost
        @click="watchMore"
        style="margin-right: 20px"
        >查看更多数据</a-button
      >
    </div>
    <div class="data">
      <div class="data-item">
        <img src="../../../assets/img/访问人数.png" class="data-item-img" />
        <div
          style="
            display: flex;
            justify-content: center;
            flex-direction: column;
            color: #000;
          "
        >
          <div style="margin-bottom: 5px">访问人数</div>
          <div>{{ fwCount }}</div>
        </div>
      </div>
      <div class="data-item">
        <img
          src="../../../assets/img/点赞次数.png"
          class="data-item-img"
          ref="rotate"
        />
        <div
          style="
            display: flex;
            justify-content: center;
            flex-direction: column;
            color: #000;
          "
        >
          <div style="margin-bottom: 5px">点赞次数</div>
          <div>{{ dzCount }}</div>
        </div>
      </div>
      <!-- <div class="data-item">
        <img src="../../../assets/img/讨论数.png" class="data-item-img" />
        <div
          style="
            display: flex;
            justify-content: center;
            flex-direction: column;
            color: #000;
          "
        >
          <div style="margin-bottom: 5px">讨论数</div>
          <div>{{ discussCount }}</div>
        </div>
      </div> -->
      <div class="data-item">
        <img src="../../../assets/img/观看人次.png" class="data-item-img" />
        <div
          style="
            display: flex;
            justify-content: center;
            flex-direction: column;
            color: #000;
          "
        >
          <div style="margin-bottom: 5px">观看人次</div>
          <div>{{ gkCount }}</div>
        </div>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <shareModal
      :shareModalShow="shareModalShow"
      v-if="!!shareModalShow"
      @cancel="shareModalShow = false"
    />
  </div>
</template>

<script>
import api from "../../../api/api";
import shareModal from "../../broadcastHall/components/shareModal.vue";
export default {
  name: "overview",
  components: {
    shareModal,
  },
  data() {
    return {
      info: {
        zbName: "",
        zbDesc: "",
        assisNames: "",
        anchorName: "",
        expectStartTime: "",
        actualStartTime: "",
      },
      shareModalShow: false,
      gkCount: 0,
      fwCount: 0,
      dzCount: 0,
      discussCount: 0,
    };
  },
  created() {
    this.getInfo();
    this.getData();
  },
  methods: {
    getInfo() {
      api.roomZbInfo({ zbId: this.$route.query.zbId }).then((res) => {
        console.log("----------info信息", res.result);
        this.info = res.result;
      });
    },
    getData() {
      api.dataInfoJson({ zbId: this.$route.query.zbId }).then((res) => {
        console.log("---------直播数据", res.data);
        this.gkCount = res.data.gkCount;
        this.fwCount = res.data.fwCount;
        this.dzCount = res.data.dzCount;
        this.discussCount = res.data.discussCount;
      });
    },
    // 观看
    watch() {
      api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
        if (res.data.zbState && res.data.zbState < 4) {
          // 跳到直播页面
          api.roomShareUrl({ zbId: this.$route.query.zbId }).then((re) => {
            console.log("直播地址信息", re);
            if (
              window.parent.external &&
              window.parent.external.CppShowPublicUrl
            ) {
              external.call(
                "CppShowPublicUrl",
                { url: re.shareUrl },
                (error, result) => {
                  console.log(result);
                }
              );
            } else {
              window.open(re.shareUrl);
            }
          });
        } else {
          this.$message.error("直播彻底已结束，无法进入直播");
        }
      });
    },
    //分享
    share() {
      api
        .roomShareUrl({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log("分享的直播网址：", res);
          this.shareModalShow = {
            str: res.shareUrl,
          };
        });
    },
    // 查看更多
    watchMore() {
      if (window.parent.toCard) {
        window.parent.toCard({
          single: true,
          title: "直播数据",
          url: `${window.location.origin}${this.$config.myFront}/#/broadcast/broadcastData?zbId=${this.$route.query.zbId}`,
        });
      } else {
        this.$router.push({
          path: "/broadcast/broadcastData",
          query: { zbId: this.$route.query.zbId },
        });
      }
    },
    start() {
      let random = Math.floor(Math.random() * 10);
      let deg = 36 * random + 5 * 360;
      this.$refs.rotate.style.transform = 'rotate(0 deg)'
      this.$refs.rotate.removeAttribute('style');
      setTimeout(() => {
        this.$refs.rotate.style.transform = `rotate(${deg}deg)`;
        this.$refs.rotate.style.transition = `transform ${3}s ease-out`;
      }, 10);
    },
  },
};
</script>

<style lang="less" scoped>
.overview {
  .data {
    display: flex;
    flex-wrap: wrap;
    .data-item {
      width: 240px;
      margin-bottom: 20px;
      height: 50px;
      display: flex;
      .data-item-img {
        height: 50px;
        width: 50px;
        margin-right: 15px;
      }
    }
  }
}
</style>
