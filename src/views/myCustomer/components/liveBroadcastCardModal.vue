<template>
  <a-modal
    :maskClosable="false"
    title="直播卡片"
    :visible="!!modalShow"
    :footer="null"
    @cancel="cancel"
    class="live-broadcast-card-codal"
    :width="900"
  >
    <a-spin :spinning="loading">
      <div style="display: flex; flex-direction: row-reverse">
        <!-- <a-button type="primary" @click="turnToHyx" >转至慧营销</a-button> -->
        <a-button
          type="primary"
          @click="turnToHyx"
          :disabled="!!(cardInfo.resId || !cardInfo.mobilePhone)"
          >转至慧营销</a-button
        >
      </div>
      <!-- 顶部卡片信息 -->
      <div class="info">
        <a-avatar
          :src="cardInfo.imgUrl"
          style="
            color: #fff;
            width: 55px;
            height: 55px;
            line-height: 55px;
            margin-right: 20px;
            font-size: 24px;
          "
        />
        <div class="info-content">
          <a-row class="info-content-item">
            <a-col :span="8" class="title">客户名称：</a-col>
            <a-col :span="1"></a-col>
            <a-col :span="15">{{ cardInfo.nickname }}</a-col>
          </a-row>
          <a-row class="info-content-item">
            <a-col :span="8" class="title">手机号：</a-col>
            <a-col :span="1"></a-col>
            <a-col :span="15">{{ cardInfo.mobilePhone }}</a-col>
          </a-row>
          <a-row class="info-content-item">
            <a-col :span="8" class="title">IP：</a-col>
            <a-col :span="1"></a-col>
            <a-col :span="15">{{ cardInfo.ipAddress }}</a-col>
          </a-row>
          <a-row class="info-content-item">
            <a-col :span="8" class="title">促单接待：</a-col>
            <a-col :span="1"></a-col>
            <a-col :span="15">{{ cardInfo.receptionName }}</a-col>
          </a-row>
        </div>
      </div>
      <div style="display: flex">
        <!-- tabs -->
        <a-tabs
          v-model="activeTab"
          @change="tabChange"
          :tab-position="'left'"
          size="large"
        >
          <a-tab-pane key="1" tab="访客日志" />
          <a-tab-pane key="2" tab="慧营销资料" v-if="this.cardInfo.resId && this.cardInfo.isShowHyx" />
          <a-tab-pane key="3" tab="点评" v-if="this.cardInfo.resId" />
          <a-tab-pane key="4" tab="私聊" v-if="this.cardInfo.imSessionId" />
        </a-tabs>
        <div style="flex: 1">
          <!-- 访客日志 -->
          <div class="content1 content" v-if="activeTab === '1'">
            <template v-if="visitorLogList.length > 0">
              <div
                v-for="(item, index) in visitorLogList"
                :key="index"
                class="content1-item"
              >
                <div class="title">时间：</div>
                <div class="text">{{ item.inputTime }}</div>
                <div class="title">操作：</div>
                <div class="text">{{ item.operation }}</div>
                <div class="title">备注：</div>
                <div class="text">{{ item.remark }}</div>
              </div>
            </template>
            <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else style="margin-top: 20px" />
          </div>
          <!-- 慧营销资料 -->
          <div class="content2" v-if="activeTab === '2'">
            <iframe
              id="iframe"
              :src="`${window.location.origin}${$config.hyxFront}/#/customer-card?type=zb&id=${this.cardInfo.resId}`"
            />
            <!-- http://hyx9.test.com -->
          </div>
          <!-- 点评 -->
          <div
            style="
              display: flex;
              flex-direction: row-reverse;
              margin-bottom: 15px;
            "
            v-if="activeTab === '3'"
          >
            <a-button ghost type="primary" @click="commentModalShow = true"
              >写点评</a-button
            >
          </div>
          <div class="content3 content" v-if="activeTab === '3'">
            <template v-if="commentList.length > 0">
              <div
                v-for="(item, index) in commentList"
                :key="index"
                class="content3-item"
              >
                <div class="top">
                  <img
                    src="../../../assets/img/点评.jpg"
                    alt="img"
                    style="margin-right: 20px"
                  />
                  <div>
                    <div style="margin-bottom: 10px">
                      <span class="label">点评时间：</span>
                      <span>{{ item.reviewDate }}</span>
                    </div>
                    <div>
                      <span class="label">提交人：</span>
                      <span>{{ item.reviewAcc }}</span>
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="label" style="flex: none">点评内容：</div>
                  <div style="word-break: break-all">{{ item.revComment }}</div>
                </div>
              </div>
            </template>
            <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else />
            <!-- commentList -->
          </div>
          <!-- 私聊 -->
          <div class="content2" v-if="activeTab === '4'">
            <iframe
              id="iframe"
              :src="`${window.location.origin}${$config.chatFront}/#/conversation?data=${base64}`"
            />
          </div>
          <!-- 分页器，点评无分页器 -->
          <div
            style="display: flex; flex-direction: row-reverse"
            v-if="activeTab === '1'"
          >
            <a-pagination
              :showTotal="(total) => `共 ${pagination.total} 条`"
              showSizeChanger
              showQuickJumper
              @change="pagerChange"
              @showSizeChange="sizeChange"
              :pageSize="pagination.pageSize"
              :total="pagination.total"
              :current="pagination.pageNum"
              style="margin-top: 15px"
            />
          </div>
        </div>
      </div>
    </a-spin>
    <commentModal
      :modalShow="commentModalShow"
      v-if="commentModalShow"
      @ok="commentModalOk"
      @cancel="commentModalShow = false"
    />
  </a-modal>
</template>

<script>
import api from "../../../api/api";
import commentModal from "./commentModal";
import moment from "moment";
import {encode} from "js-base64";
export default {
  name: "liveBroadcastCardModal",
  components: {
    commentModal,
  },
  props: {
    modalShow: {
      type: [Boolean, Object],
      default: false,
      required: false,
    },
  },
  data() {
    return {
      window: window,
      moment,
      colorNumber: 0, // 头像颜色的随机数
      loading: false, // 弹窗loading
      cardInfo: {}, //直播卡片信息
      activeTab: "1", // tab选中的值
      visitorLogList: [], // 访客日志列表
      hyxDataList: [], //慧营销资料列表
      commentList: [], // 点评列表
      commentModalShow: false, // 点评的发表评论弹窗
      pagination: {
        // 列表都共用一个pagination
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    };
  },
  computed: {
    base64() {
      let str = JSON.stringify({
        source: 1,
        orgId: this.cardInfo.orgId,
        sessionId: this.cardInfo.imSessionId,
        msgTimeEnd: moment().format("YYYY-MM-DD 23:59:59"),
        changStatus: "C2C",
        repectionAccount: this.cardInfo.receptionId,
        lsrId: this.modalShow.zbId ? this.modalShow.zbId : this.$route.query.zbId,
      });
      let base64 = encode(str);
      return base64;
    },
  },
  created() {
    this.getInfo();
    this.colorNumber = Math.floor(Math.random() * 4);
    // console.log(this.colorNumber);
  },
  methods: {
    // 获取卡片信息
    getInfo() {
      api
        .visitorFindVisitorByVisitId({
          visitId: this.modalShow.visitId,
        })
        .then((res) => {
          console.log("直播卡片人员信息", res.data);
          this.cardInfo = {
            ...res.data,
          };
          this.activeTab = "1";
          this.tabChange("1");
          this.getData();
          console.log(this.base64);
        });
    },
    // 转至慧营销
    turnToHyx() {
      console.log("转至慧营销", this.cardInfo); // 用里面的resId
      let turnType = 1;
      const that = this;
      this.$confirm({
        title: "转入慧营销",
        content: (
          <div style="margin-top: 20px">
            <a-radio-group
              defaultValue={1}
              onChange={(e) => {
                turnType = e.target.value;
                console.log(turnType);
              }}
            >
              <div style="margin-bottom: 20px">
                <a-radio value={1}>转至慧营销—市场推广</a-radio>
              </div>
              <div>
                <a-radio value={2}>转至慧营销—我的资源</a-radio>
              </div>
            </a-radio-group>
          </div>
        ),
        okText: "确定",
        cancelText: "取消",
        onOk() {
          console.log(that.cardInfo.id, turnType);
          api
            .visitorJoinHyx({
              type: turnType,
              ids: [that.cardInfo.id],
            })
            .then((res) => {
              that.$message.success(res.msg);
              that.getInfo();
            });
        },
      });
    },
    // tabchange事件
    tabChange(val) {
      // console.log("tab的值", val);
      this.pagination.pageNum = 1;
      this.pagination.total = 0;
      this.getData();
    },
    sizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      this.getData();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getData();
    },
    // 切换tab去获取下面的数据
    getData() {
      console.log("tab的值", this.activeTab);
      if (this.activeTab === "1") {
        this.getVisitorLog();
      } else if (this.activeTab === "2") {
        this.getHyxData();
      } else if (this.activeTab === "3") {
        this.getComment();
      }
    },
    // 获取访客日志列表
    getVisitorLog() {
      this.loading = true;
      api
        .zbVisitorLogListPageJson({
          visitId: this.modalShow.visitId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("访客日志列表", res.data);
          this.visitorLogList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 获取慧营销资料列表
    getHyxData() {
      this.hyxDataList = [];
      this.loading = true;
      this.loading = false;
    },
    // 获取点评列表
    getComment() {
      this.loading = true;
      api
        .cardCustReviewList({
          custId: this.cardInfo.resId,
        })
        .then((res) => {
          console.log("点评列表", res.data);
          this.commentList = res.data;
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 写点评(发表评论)弹窗点击确定
    commentModalOk(val) {
      console.log(val);
      api
        .cardSaveReview({
          ...val,
          custId: this.cardInfo.resId,
        })
        .then((res) => {
          this.$message.success("发表成功");
          this.commentModalShow = false;
          this.getData();
        });
    },
    // 关闭当前弹窗
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang='less' scoped>
.live-broadcast-card-codal {
  .info {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    padding: 0 20px 20px 60px;
    .info-content {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      .info-content-item {
        width: 50%;
        margin: 10px 0;
        .title {
          text-align: right;
        }
      }
    }
  }
  .content {
    // max-height: 360px;
    max-height: calc(100vh - 390px);
    overflow: auto;
    padding-right: 10px;
  }
  .content1 {
    .content1-item {
      margin-bottom: 20px;
      border: 1px solid #ccc;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      .title {
        color: #999;
      }
      .text {
        margin-right: 25px;
      }
    }
  }
  .content2 {
    // overflow: auto;
    height: calc(100vh - 340px) !important;
    #iframe {
      height: 100%;
      width: 100%;
      border: none;
    }
  }
  .content3 {
    .content3-item {
      padding: 15px;
      border: 1px solid #ccc;
      margin-bottom: 20px;
      .label {
        color: #999;
      }
      .top {
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid #ccc;
      }
      .bottom {
        padding-top: 15px;
        display: flex;
      }
    }
  }
}
</style>
<style lang="less">
.live-broadcast-card-codal {
  .ant-modal {
    top: 50px;
    // width: 100% !important;
    // height: 100vh !important;
    // overflow: auto;
    // top: 0;
    // padding-bottom: 0;
    // .ant-modal-content{
    //   height: 100vh !important;
    // }
  }
}
</style>
