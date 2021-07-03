<template>
  <div class="my-customer">
    <searchTool :topData="topData" @getFilterData="getDataList" />
    <dataBar
      :liveBroadcastData="liveBroadcastData"
      :zbState="zbInfo.zbState"
      style="margin: 20px 0"
    />
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      "
    >
      <a-button
        type="primary"
        ghost
        @click="batchSend"
        :disabled="selectedList.length === 0"
        >批量发送短信</a-button
      >
    </div>
    <!-- 我约的客户列表 -->
    <div class="table-wrap" v-if="dataList.length > 0">
      <a-spin :spinning="dataListLoading">
        <a-checkbox
          v-for="(item, index) in dataList"
          :key="index"
          :checked="isChecked(item)"
          @change="
            (e) => {
              checkChange(e.target.checked, item);
            }
          "
        >
          <div class="checkbox">
            <div class="left">
              <div class="left-item" @click.prevent="customerCard(item)">
                <img src="../../assets/img/客户卡片.jpg" />
                客户卡片
              </div>
              <div
                class="left-item"
                v-if="zbInfo.zbState !== 1"
                @click.prevent="followUp(item)"
              >
                <img src="../../assets/img/跟进.jpg" />
                跟进
              </div>
              <div class="left-item" @click.prevent="sendMessage(item)">
                <img src="../../assets/img/发送短信.jpg" />
                发送短信
              </div>
              <div
                class="left-item"
                @click.prevent="liveBroadcastCard(item)"
                v-if="zbInfo.zbState !== 1 && item.isJoin === 1"
              >
                <img src="../../assets/img/直播卡片.jpg" />
                直播卡片
              </div>
            </div>
            <div class="right">
              <img src="../../assets/img/用户.png" class="user" />
              <div class="right-top">
                <div class="right-item">
                  客户名称：
                  <Tooltip
                    :str="item.resCustName"
                    :max="9"
                    v-if="item.resCustName && item.resCustName.length > 9"
                  />
                  <span v-else>{{ item.resCustName }}</span>
                </div>
                <div class="right-item">
                  联系人：
                  <Tooltip
                    :str="item.resName"
                    :max="9"
                    v-if="item.resName && item.resName.length > 9"
                  />
                  <span v-else>{{ item.resName }}</span>
                </div>
                <div class="right-item">常用电话：{{ item.resPhone }}</div>
                <div class="right-item">预约人：{{ item.applyName }}</div>
                <div class="right-item">
                  商机名称：
                  <Tooltip
                    :str="item.businessName"
                    :max="9"
                    v-if="item.businessName && item.businessName.length > 9"
                  />
                  <span v-else>{{ item.businessName }}</span>
                </div>
                <div class="right-item">商机产品：{{item.productName}}</div>
              </div>
              <div class="right-bottom" v-if="zbInfo.zbState !== 1">
                <div class="right-item">
                  是否参与直播：{{ item.isJoin === 1 ? "是" : "否" }}
                </div>
                <div class="right-item" v-if="item.isJoin === 1">
                  访问直播时间：{{ item.visitTime }}
                </div>
                <div
                  class="right-item"
                  v-if="
                    item.isJoin === 1 &&
                    (zbInfo.zbState === 3 || zbInfo.zbState === 4)
                  "
                >
                  促单效果：{{ item.stateStr }}
                </div>
              </div>
            </div>
          </div>
        </a-checkbox>
      </a-spin>
    </div>
    <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE"v-else />
    <div style="display: flex; flex-direction: row-reverse">
      <a-pagination
        :showTotal="(total) => `共 ${pagination.total} 条`"
        showSizeChanger
        showQuickJumper
        @change="pagerChange"
        @showSizeChange="sizeChange"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        :current="pagination.pageNum"
        style="margin-top: 15px; margin-right: 15px"
      />
    </div>
    <!-- 直播卡片弹窗组件 -->
    <liveBroadcastCardModal
      v-if="modalShow"
      :modalShow="modalShow"
      @cancel="modalShow = false"
    />
  </div>
</template>

<script>
import api from "../../api/api";
import searchTool from "../../components/SearchTool/index.vue";
import dataBar from "./components/dataBar";
import Tooltip from "../../components/Tooltip.vue";
import liveBroadcastCardModal from "./components/liveBroadcastCardModal.vue";
export default {
  name: "myCustomer",
  components: {
    searchTool,
    dataBar,
    Tooltip,
    liveBroadcastCardModal,
  },
  data() {
    return {
      zbInfo: {
        // 当前直播状态
        zbState: 0, // 1未开始 2进行中 3,4已结束。0是为了一开始直播数据bar里面什么都不显示
      },
      filterData: {}, // 搜索筛选项
      liveBroadcastData: {}, // 直播数据
      dataListLoading: false,
      dataList: [],
      selectedList: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: null,
      },
      modalShow: false,
    };
  },
  computed: {
    topData() {
      let topData = {
        selectList: [
          {
            name: "resCustName",
            text: "客户名称",
          },
          {
            name: "resName",
            text: "联系人",
          },
          {
            name: "resPhone",
            text: "常用电话",
          },
          {
            name: "businessName",
            text: "商机名称",
          },
        ],
        filterList: [
          {
            type: "treeSelect",
            name: "applyIdStr",
            label: "预约人",
            treeSelectParams: {
              // fetchUrl: 'asdsads'
            },
          },
          {
            type: "select",
            name: "isJoin",
            label: "是否参与直播",
            options: [
              { label: "否", value: 0 },
              { label: "是", value: 1 },
            ],
          },
          {
            type: "select",
            name: "state",
            label: "促单结果",
            options: [
              { label: "新商机", value: 1 },
              { label: "推进商机", value: 2 },
              { label: "赢单", value: 3 },
            ],
          },
        ],
      };
      // 直播未开始不显示是否参与直播筛选项
      if (this.zbInfo.zbState && this.zbInfo.zbState === 1) {
        topData.filterList = topData.filterList.filter((item) => {
          return item.name !== "isJoin";
        });
      }
      // 直播未开始和进行中都不显示促单效果筛选项
      if (this.zbInfo.zbState && this.zbInfo.zbState < 3) {
        topData.filterList = topData.filterList.filter((item) => {
          return item.name !== "state";
        });
      }
      return topData;
    },
  },
  created() {
    this.getZbState();
    this.getDataList();
    this.getZbData();
  },
  methods: {
    getZbState() {
      api
        .getZbState({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log("当前直播状态信息", res.data);
          this.zbInfo = res.data;
        });
    },
    getDataList(value) {
      if (value) {
        console.log(value);
        this.filterData = value;
        if (value.applyIdStr) {
          this.filterData.applyIdStr = this.filterData.applyIdStr.join(",");
        }
        this.selectedList = [];
      }
      this.dataListLoading = true;
      api
        .reserveCustCustListPage({
          zbId: this.$route.query.zbId,
          ...this.filterData,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("我约的列表！！！", res);
          this.dataList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
          this.dataListLoading = false;
        })
        .catch((e) => {
          this.dataListLoading = false;
        });
    },
    getZbData() {
      api
        .reserveCustGetZbData({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log("直播数据", res);
          this.liveBroadcastData = res.data;
        });
    },
    sizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      this.getDataList();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getDataList();
    },
    // 判断是否勾选上
    isChecked(item) {
      let flag = false;
      this.selectedList.forEach((it) => {
        if (item.custId === it.custId) {
          flag = true;
        }
      });
      return flag;
    },
    // checkbox改变值
    checkChange(value, item) {
      console.log(value, item);
      if (value) {
        this.selectedList.push(item);
      } else {
        this.selectedList = this.selectedList.filter((it) => {
          return item.custId !== it.custId;
        });
      }
    },
    // 点击批量发送短信
    batchSend() {
      const list = this.selectedList.map((item) => {
        return {
          name: item.resName ? item.resName : "",
          phone: item.resPhone,
        };
      });
      const location = window.location;
      window.parent.toCard &&
        window.parent.toCard({
          single: true,
          title: "批量发送短信",
          url: `${location.origin}${
            this.$config.hyxFront
          }/#/communicate/smsGroupSend?disable=true&list=${JSON.stringify(
            list
          )}`,
        });
    },
    // 客户卡片
    customerCard(item) {
      console.log("客户卡片", item);
      const location = window.location;
      window.parent.toCard &&
        window.parent.toCard({
          single: true,
          title: "客户卡片",
          url: `${location.origin}${this.$config.hyxFront}/#/customer-card?id=${item.resId}`,
        });
    },
    // 跟进
    followUp(item) {
      console.log("跟进", item);
      const location = window.location;
      window.parent.toCard &&
        window.parent.toCard({
          single: true,
          title: "跟进",
          url: `${location.origin}${this.$config.hyxFront}/#/client/businessFollow?moduleType=0&resCustId=${item.resId}`,
        });
    },
    // 发送短信
    sendMessage(item) {
      console.log("发送短信", item);
      const list = [
        {
          name: item.resName ? item.resName : "",
          phone: item.resPhone,
        },
      ];
      const location = window.location;
      window.parent.toCard &&
        window.parent.toCard({
          single: true,
          title: "发送短信",
          url: `${
            location.origin
          }${this.$config.hyxFront}/#/communicate/smsGroupSend?disable=true&list=${JSON.stringify(
            list
          )}`,
        });
    },
    // 直播卡片
    liveBroadcastCard(item) {
      console.log("直播卡片", item);
      this.modalShow = { ...item, visitId: item.visitId };
    },
  },
};
</script>

<style lang='less' scoped>
.my-customer {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .table-wrap {
    overflow: auto;
    .ant-checkbox-wrapper {
      display: flex;
      align-items: center;
      margin: 0;
      margin-bottom: 20px;
      .checkbox {
        border: 1px solid #ccc;
        width: calc(100vw - 90px);
        display: flex;
        border-radius: 10px;
        background: #f9f9f9;
        .left {
          padding: 20px;
          width: 210px;
          display: flex;
          flex-wrap: wrap;
          border-right: 1px solid #ccc;
          color: #3e7bf8;
          background: #fff;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          align-items: center;
          align-content: center;
          .left-item {
            width: 50%;
            height: 30px;
            display: flex;
            align-items: center;
            align-content: center;
            img {
              margin-right: 5px;
            }
          }
        }
        .right {
          padding: 20px;
          padding-left: 90px;
          position: relative;
          width: calc(100% - 210px);
          padding-bottom: 0;
          .user {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            left: 25px;
          }
          .right-top {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding-bottom: 5px;
            .right-item {
              margin-bottom: 15px;
              width: 25%;
            }
          }
          .right-bottom {
            padding-top: 15px;
            display: flex;
            align-items: center;
            border-top: 1px solid #ccc;
            .right-item {
              width: 25%;
              margin-bottom: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
