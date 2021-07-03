<template>
  <div class="data-statistics">
    <!-- 第一部分 -->
    <div class="block1">
      <!-- 第一部分直播数据 -->
      <div class="left">
        <div class="title">直播数据</div>
        <div class="content">
          <div class="content-item">
            <img src="../../../assets/img/观看人次.png" />
            <div class="content-item-text">
              <div>观看人次</div>
              <div class="bold">{{ block1Data.gkCount }}</div>
            </div>
          </div>
          <div class="content-item">
            <img src="../../../assets/img/访问人次.png" />
            <div class="content-item-text">
              <div>访问人次</div>
              <div class="bold">{{ block1Data.fwCount }}</div>
            </div>
          </div>
          <div class="content-item">
            <img src="../../../assets/img/商品点击量.png" />
            <div class="content-item-text">
              <div>商品点击量</div>
              <div class="bold">{{ block1Data.spdjCount }}</div>
            </div>
          </div>
          <div class="content-item">
            <img src="../../../assets/img/点赞次数.png" />
            <div class="content-item-text">
              <div>点赞次数</div>
              <div class="bold">{{ block1Data.dzCount }}</div>
            </div>
          </div>
          <!-- <div class="content-item">
            <img src="../../../assets/img/讨论数.png" />
            <div class="content-item-text">
              <div>讨论数</div>
              <div class="bold">{{ block1Data.discussCount }}</div>
            </div>
          </div> -->
          <div class="content-item">
            <img src="../../../assets/img/广告点击量.png" />
            <div class="content-item-text">
              <div>广告点击量</div>
              <div class="bold">{{ block1Data.ggdjCount }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 第一部分互动数据 -->
      <div class="right">
        <div class="title">互动数据（参与人数）</div>
        <div class="content">
          <div class="content-item">
            <img src="../../../assets/img/抽奖.png" />
            <div class="content-item-text">
              <div>抽奖</div>
              <div class="bold">{{ block1Data.cjCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第二部分 -->
    <div class="block2">
      <!-- 第二部分短信发送情况 -->
      <div class="left">
        <div class="title">短信发送情况</div>
        <div class="content">
          <div class="content-item">
            <div class="gray">短信总发送条数</div>
            <div>{{ block2Data.msgTotalNum }}</div>
          </div>
          <div class="content-item">
            <div class="gray">发送成功</div>
            <div>{{ block2Data.msgSuccessNum }}</div>
          </div>
          <div class="content-item">
            <div class="gray">
              消耗蜂豆
              <a-tooltip>
                <template slot="title"
                  >每条短信消耗10蜂豆</template
                >
                <a-icon
                  type="question-circle"
                  style="font-size: 16px; color: #1890ff;"
                />
              </a-tooltip>
            </div>
            <div>{{ block2Data.talkCoinNum }}</div>
          </div>
        </div>
      </div>
      <!-- 第二部分商品数据 -->
      <div class="right">
        <div class="title">商品数据</div>
        <div class="content">
          <div class="content-item">
            <div class="gray">访客总点击量</div>
            <div>{{ block1Data.spdjCount }}</div>
          </div>
          <div class="content-item">
            <div class="gray">
              点击购买次数
              <a-tooltip>
                <template slot="title"
                  >点击购买次数</template
                >
                <a-icon
                  type="question-circle"
                  style="font-size: 16px; color: #1890ff;"
                />
              </a-tooltip>
            </div>
            <div>{{ block1Data.spdjgmCount }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第三部分 -->
    <div class="block3">
      <div class="block3-content">
        <customerDistribution :dataObj="block2Data"/>
      </div>
      <div class="block3-content">
        <viewTerminal :dataObj="block2Data"/>
      </div>
      <div class="block3-content-40">
        <placeDistribution />
      </div>
    </div>
    <!-- 第四部分 -->
    <div class="block4">
      <realtimeView/>
    </div>
  </div>
</template>

<script>
import api from "../../../api/api";
import customerDistribution from './components/customerDistribution'
import viewTerminal from './components/viewTerminal'
import placeDistribution from './components/placeDistribution'
import realtimeView from './components/realtimeView.vue'
export default {
  name: "dataStatistics",
  components: {
    customerDistribution,
    viewTerminal,
    placeDistribution,
    realtimeView
  },
  data() {
    return {
      block1Data: {}, // 直播数据和互动数据和商品点数据
      block2Data: {}, // 短信发送情况，客户分步，观看终端
    };
  },
  created() {
    this.getBlock1Data();
    this.getBlock2Data();
  },
  methods: {
    // 直播数据和互动数据
    getBlock1Data() {
      api
        .dataInfoJson({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log("直播数据,互动数据,商品数据", res.data);
          this.block1Data = res.data;
        });
    },
    getBlock2Data() {
      api
        .visitorFindDataWithVisitAndTerminal({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log("短信发送情况，客户分步，观看终端", res.data);
          this.block2Data = res.data;
        });
    }
  },
};
</script>

<style lang='less' scoped>
.data-statistics {
  .block1 {
    border-bottom: 1px solid #ccc;
    display: flex;
    padding: 20px;
    padding-top: 0;
    margin: 0 -20px;
    .left {
      width: 55%;
    }
    .right {
      width: 45%;
    }
    .title {
      font-size: 15px;
      margin-bottom: 10px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      color: #000;
      .content-item {
        width: 180px;
        display: flex;
        margin-bottom: 20px;
        .content-item-text {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 15px;
          .bold {
            // font-weight: bold;
          }
        }
      }
    }
  }
  .block2 {
    border-bottom: 1px solid #ccc;
    display: flex;
    padding: 20px;
    margin: 0 -20px;
    .left {
      width: 55%;
    }
    .right {
      width: 45%;
    }
    .title {
      font-size: 15px;
      margin-bottom: 10px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      color: #000;
      .content-item {
        border: 1px solid #ccc;
        padding: 20px 0;
        width: 170px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 5px;
        color: #000;
        margin: 0 20px 20px 0;
        .gray {
          color: #999;
          margin-bottom: 5px;
        }
      }
    }
  }
  .block3 {
    border-bottom: 1px solid #ccc;
    display: flex;
    padding: 20px;
    margin: 0 -20px;
    .block3-content{
      width: 30%;
    }
    .block3-content-40{
      width: 40%;
    }
    
  }
  .block4 {
    display: flex;
    padding: 20px 0;
  }
}
</style>
