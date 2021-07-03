<template>
  <div class="data-bar">
    <!-- 左边 -->
    <div class="left">
      <img src="../../../assets/img/直播数据.jpg" alt="直播数据图片" />
      <div style="color: #999; margin: 0 20px 0 10px">直播数据</div>
      <div style="display: flex; align-items: center">
        <div class="data-item" v-if="zbState === 1 || zbState === 2">
          <div class="title">预约人数</div>
          <div class="content">{{ liveBroadcastData.totalApplyNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 2">
          <div class="title">实际访问</div>
          <div class="content">{{ liveBroadcastData.actualApplyNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">预约人数 / 实际访问</div>
          <div class="content">
            {{ liveBroadcastData.totalApplyNum }} /
            {{ liveBroadcastData.actualApplyNum }}
          </div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">推进商机</div>
          <div class="content">{{ liveBroadcastData.businessOpNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">赢单</div>
          <div class="content">{{ liveBroadcastData.winNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">
            促单有效率
            <a-tooltip>
              <template slot="title">（推进商机+赢单）/直播访问人数</template>
              <a-icon
                type="question-circle"
                style="font-size: 16px; color: #1890ff"
              />
            </a-tooltip>
          </div>
          <div class="content">{{ liveBroadcastData.promoteRate }}</div>
        </div>
      </div>
    </div>
    <!-- 右边 -->
    <div class="right">
      <img src="../../../assets/img/我的客户.jpg" alt="我的客户图片" />
      <div style="color: #999; margin: 0 20px 0 10px">我的客户</div>
      <div style="display: flex; align-items: center">
        <div class="data-item" v-if="zbState === 1 || zbState === 2">
          <div class="title">
            我的客户
            <a-tooltip>
              <template slot="title"
                >这场直播中自己、权限内的成员已成功预约直播的客户。</template
              >
              <a-icon
                type="question-circle"
                style="font-size: 16px; color: #1890ff"
              />
            </a-tooltip>
          </div>
          <div class="content">{{ liveBroadcastData.myClientNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 2">
          <div class="title">实际访问</div>
          <div class="content">{{ liveBroadcastData.myActualClientNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 2">
          <div class="title">
            到访率
            <a-tooltip>
              <template slot="title">我预约的客户的访问人数/预约数</template>
              <a-icon
                type="question-circle"
                style="font-size: 16px; color: #1890ff"
              />
            </a-tooltip>
          </div>
          <div class="content">{{ liveBroadcastData.visitorRate }}</div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">
            我的客户
            <a-tooltip>
              <template slot="title"
                >这场直播中自己、权限内的成员已成功预约直播的客户。</template
              >
              <a-icon
                type="question-circle"
                style="font-size: 16px; color: #1890ff"
              />
            </a-tooltip>
            / 实际访问
          </div>
          <div class="content">
            {{ liveBroadcastData.myClientNum }} /
            {{ liveBroadcastData.myActualClientNum }}
          </div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">推进商机</div>
          <div class="content">{{ liveBroadcastData.myBusinessOpNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">赢单</div>
          <div class="content">{{ liveBroadcastData.myWinNum }}</div>
        </div>
        <div class="data-item" v-if="zbState === 3 || zbState === 4">
          <div class="title">促单有效率</div>
          <div class="content">{{ liveBroadcastData.myPromoteRate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dataBar",
  props: {
    liveBroadcastData: {
      type: Object,
      default: {},
      required: false,
    },
    zbState: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang='less' scoped>
.data-bar {
  display: flex;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-right: 1px solid #ccc;
    height: 60px;
    .data-item {
      color: #000;
      margin-right: 40px;
      .title {
        margin: 5px 0;
      }
      .content {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    padding-left: 40px;
    height: 60px;
    flex-wrap: wrap;
    .data-item {
      color: #000;
      margin-right: 30px;
      .title {
        margin: 5px 0;
      }
      .content {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
}
</style>
