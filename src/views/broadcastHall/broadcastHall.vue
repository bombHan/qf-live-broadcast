<template>
  <div class="broadcast-hall">
    <!-- 左边直播列表 -->
    <div class="left">
      <a-spin :spinning="dataListLoading">
        <a-radio-group
          v-model="type"
          button-style="outline"
          @change="changeTab"
        >
          <a-radio-button :value="1" style="width: 120px; text-align: center">
            全部直播
          </a-radio-button>
          <a-radio-button :value="2" style="width: 120px; text-align: center">
            我参与的直播
          </a-radio-button>
        </a-radio-group>
        <div class="toolbar">
          <div class="toolbar-left">
            <searchTool
              :topData="topData"
              @getFilterData="search"
              :key="type"
            />
          </div>
          <div class="toolbar-right">
            <a style="margin-right: 20px" @click="getTip">快速掌握促单小技巧</a>
            <a-button
              @click="createBroadcast"
              ghost
              type="primary"
              v-if="$utils.hasPermission('btn-liveBroadcast-zbdt-create')"
              >创建直播</a-button
            >
          </div>
        </div>

        <div class="content" v-if="dataList.length > 0">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            class="content-item"
          >
            <div class="content-item-top">
              <a-row>
                <a-col span="9" style="display: flex; align-items: center">
                  直播名称：
                  <!-- <Tooltip
                    :str="item.zbName"
                    :max="8"
                    v-if="item.zbName.length > 8"
                  />
                  <span v-else>{{ item.zbName }}</span> -->
                  <span>{{ item.zbName }}</span>
                  <div
                    style="
                      padding: 0 10px;
                      border-radius: 12px;
                      margin-left: 10px;
                    "
                    :style="
                      item.zbState === 1
                        ? 'border: 1px solid orange;'
                        : item.zbState === 2
                        ? 'border: 1px solid #23bf80;'
                        : 'border: 1px solid #999;'
                    "
                  >
                    <template v-if="item.zbState === 1">
                      <span style="color: orange">{{
                        $dictionary.actualZbState[item.zbState]
                      }}</span>
                    </template>
                    <template v-else-if="item.zbState === 2">
                      <!-- <a-badge color="#23bf80" /> -->
                      <span style="color: #23bf80">{{
                        $dictionary.actualZbState[item.zbState]
                      }}</span>
                    </template>
                    <template
                      v-else-if="item.zbState === 3 || item.zbState === 4"
                    >
                      <!-- <a-badge color="#999999" /> -->
                      <span style="color: #999999">{{
                        $dictionary.actualZbState[item.zbState]
                      }}</span>
                    </template>
                  </div>
                </a-col>
                <a-col span="3"> 主播：{{ item.anchorName }} </a-col>
                <a-col span="6"> 助手：{{ item.assisNames }} </a-col>
                <a-col span="6">
                  预约人数/实际访问：{{ item.orderNum }}人 /
                  {{ item.actualNum }}人
                </a-col>
              </a-row>
              <a-row style="margin-top: 10px">
                <a-col span="9">
                  预计开播时间：
                  {{ moment(item.expectStartTime).format("YYYY-MM-DD HH:mm") }}
                </a-col>
                <a-col span="9">
                  实际开播时间：
                  {{
                    item.actualStartTime
                      ? moment(item.actualStartTime).format("YYYY-MM-DD HH:mm")
                      : "——"
                  }}
                </a-col>
                <a-col span="6" v-if="item.role === 1 || item.role === 2">
                  本场角色：{{ item.role === 1 ? "主播" : "助手" }}
                </a-col>
              </a-row>
            </div>
            <div class="content-item-bottom">
              <div>
                {{ item.custNames }}
              </div>
              <div style="display: flex; align-items: center">
                <a
                  class="button"
                  @click="goToSetting(item)"
                  v-if="item.zbSet === 1"
                  >直播设置</a
                >
                <a class="button" @click="data(item)" v-if="item.data === 1">
                  数据
                </a>
                <a class="button" @click="share(item)" v-if="item.share === 1">
                  分享
                </a>
                <a
                  class="button"
                  @click="addCustomer(item)"
                  v-if="item.addClient === 1"
                >
                  添加客户
                </a>
                <a
                  class="button"
                  v-if="item.myClient === 1"
                  @click="myCustomer(item)"
                  >我约的客户</a
                >
                <a-button
                  ghost
                  type="primary"
                  class="button"
                  v-if="item.goZb === 1"
                  @click="goToBroadcast(item)"
                  >去直播</a-button
                >
              </div>
            </div>
          </div>
        </div>
        <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else />
        <div style="display: flex; flex-direction: row-reverse">
          <a-pagination
            :showTotal="(total) => `共 ${pagination.total} 条`"
            class="diy-pagination"
            showSizeChanger
            showQuickJumper
            @change="pagerChange"
            @showSizeChange="sizeChange"
            :pageSize="pagination.pageSize"
            :total="pagination.total"
            :current="pagination.pageNum"
            style="margin-top: 10px"
          />
        </div>
      </a-spin>
    </div>
    <!-- 右边信息列表 -->
    <div class="right">
      <!-- 即将开播 -->
      <div class="will-play">
        <div class="title">
          <a-icon type="play-circle" class="icon" />即将开播
        </div>

        <a-spin
          :spinning="infoLoading"
          style="height: calc(100% - 60px); overflow: auto"
        >
          <div class="content" v-if="info.list && info.list.length > 0">
            <div
              v-for="(item, index) in info.list"
              :key="index"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 5px;
              "
            >
              <div style="width: 85px; display: flex; align-items: center">
                <img src="../../assets/img/箭头.png" v-if="index === 0" />
                <img src="../../assets/img/圆点.png" v-else />
                <span style="margin-left: 7px">{{
                  item.anchorName.slice(0, 4)
                }}</span>
              </div>
              <div style="width: 110px">
                <Tooltip
                  v-if="item.zbName.length > 6"
                  :str="item.zbName"
                  :max="6"
                /><span v-else>{{ item.zbName }}</span>
              </div>
              <div style="width: 85px">
                {{ moment(item.expectStartTime).format("MM-DD HH:mm") }}
              </div>
            </div>
          </div>
          <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else></a-empty>
        </a-spin>
      </div>
      <!-- 我的数据 -->
      <div class="my-data">
        <a-spin :spinning="infoLoading">
          <div class="title">
            <a-icon type="pie-chart" class="icon" />我的数据
          </div>
          <div class="content">
            <div>
              我参与直播
              <span style="font-size: 16px; font-weight: bold">{{
                info.myZbNum
              }}</span>
              场
            </div>
            <div>
              共接待客户
              <span style="font-size: 16px; font-weight: bold">{{
                info.recepNum
              }}</span>
              个
            </div>
          </div>
        </a-spin>
      </div>
      <!-- 排行榜 -->
      <div class="rank-list">
        <div class="title"><a-icon type="bar-chart" class="icon" />排行榜</div>

        <div class="tab">
          <a-tabs
            v-model="rankListType"
            style="width: 210px; margin: 0 auto"
            @change="getRankList"
          >
            <a-tab-pane :key="1" tab="参与直播" />
            <a-tab-pane :key="2" tab="参与客户" />
          </a-tabs>
          <div class="border-bottom" />
        </div>
        <div class="content">
          <a-spin :spinning="rankListLoading">
            <a-row class="row">
              <a-col span="7">排名</a-col>
              <a-col span="7">姓名</a-col>
              <a-col span="10">{{
                rankListType === 1 ? "参与直播场次" : "参与直播客户个数"
              }}</a-col>
            </a-row>

            <div v-if="rankList.length > 0">
              <a-row v-for="(item, index) in rankList" :key="index" class="row">
                <a-col span="7">{{ item.rank }}</a-col>
                <a-col span="7">
                  <Tooltip :str="item.accountName" :max="4" />
                </a-col>
                <a-col span="10"
                  >{{ item.num }}{{ rankListType === 1 ? "场" : "个" }}</a-col
                >
              </a-row>
            </div>
            <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else style="margin-top: 20px" />
          </a-spin>
        </div>
      </div>
    </div>
    <!-- 创建直播弹窗 -->
    <addBroadcastModal
      :createModalShow="createModalShow"
      :confirmLoading="confirmLoading"
      v-if="createModalShow"
      @createModalOk="createModalOk"
      @createModalCancel="createModalCancel"
    />

    <!-- 分享弹窗 -->
    <shareModal
      :shareModalShow="shareModalShow"
      v-if="!!shareModalShow"
      @cancel="shareModalShow = false"
    />

    <!-- 添加客户弹窗 -->
    <addHyxCustomerModal
      @ok="addCustomerModalOk"
      @cancel="addCustomerModalCancel"
      :modalShow="addCustomerModalShow"
      v-if="addCustomerModalShow"
    />
    <!-- 快速掌握小技巧 -->
    <a-modal
      :maskClosable="false"
      :title="null"
      :visible="quickModalShow"
      @cancel="quickModalShow = false"
      :footer="null"
      width="1050px"
    >
      <div style="padding-right: 10px">
        <img
          src="../../assets/img/快速掌握小技巧.png"
          alt=""
          style="width: 1000px; margin-top: 20px"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import Tooltip from "@/components/Tooltip.vue";
import addHyxCustomerModal from "./components/addHyxCustomerModal.vue";
import addBroadcastModal from "./components/addBroadcastModal.vue";
import api from "../../api/api";
import { TreeSelect } from "ant-design-vue";
import moment from "moment";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import searchTool from "../../components/SearchTool/index.vue";
import shareModal from "./components/shareModal.vue";

export default {
  name: "broadcasthall",
  components: {
    Tooltip,
    addHyxCustomerModal,
    addBroadcastModal,
    searchTool,
    shareModal,
  },
  data() {
    return {
      SHOW_PARENT,
      moment,
      type: 1, // 全部直播，我参与的直播tab切换
      quickModalShow: false, // 快速掌握小技巧弹窗
      createModalShow: false, // 创建直播弹窗显示隐藏
      confirmLoading: false, // 创建直播确定按钮loading
      dataListLoading: false, // 直播列表loading
      searchCondition: {}, // 搜索条件
      dataList: [], // 直播列表
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      shareModalShow: false, // 分享弹窗
      addCustomerModalShow: false, // 添加客户弹窗
      info: {
        // 即将开播， 我的数据
        list: [],
        myZbNum: 0,
        recepNum: 0,
      },
      infoLoading: false,
      rankListType: 1, // 参与直播1，参与客户2
      rankListLoading: false, // 排行榜loading
      rankList: [],
      topData: {},
    };
  },
  created() {
    console.log(
      "当前环境",
      process.env.NODE_ENV,
      this.$utils.hasPermission("btn-liveBroadcast-zbdt-create")
    );
    this.getFilter();
    this.getDataList();
    this.getInfo();
    this.getRankList();
  },
  methods: {
    // 获取筛选项的选项列表
    getFilter() {
      this.topData = {
        selectList: [
          {
            name: "zbName",
            text: "直播名称",
          },
        ],
        filterList: [
          {
            type: "select",
            name: "zbState",
            label: "直播状态",
            options: [
              { label: "未开始", value: 1 },
              { label: "进行中", value: 2 },
              { label: "已结束", value: 3 },
            ],
          },
          {
            type: "rangepicker",
            name: "actualTime",
            label: "实际开播时间",
          },
          {
            type: "rangepicker",
            name: "zbTimes",
            label: "预计开播时间",
          },
          {
            type: "treeSelect",
            name: "zbAcctIdsStr",
            label: "主播",
            treeSelectParams: {
              fetchUrl: "/orgGroup/get_all_sale_user_json",
            },
          },
          {
            type: "treeSelect",
            name: "assistantsStr",
            label: "助手",
            treeSelectParams: {
              fetchUrl: "/orgGroup/get_all_sale_user_json",
            },
          },
        ],
      };
    },
    // 切换全部直播和我参与的直播
    changeTab() {
      this.searchCondition = {}; // 清空筛选条件
      this.search();
    },
    // 查询
    search(value) {
      console.log("筛选框数据", value);
      if (value) {
        this.searchCondition = {
          queryText: value.queryText,
          queryType: value.queryType,
          assistantsStr: value.assistantsStr
            ? value.assistantsStr.join(",")
            : null,
          zbAcctIdsStr: value.zbAcctIdsStr
            ? value.zbAcctIdsStr.join(",")
            : null,
          zbTimes: value.zbTimes ? value.zbTimes.join(",") : null,
          actualTime: value.actualTime ? value.actualTime.join(",") : null,
          zbState: value.zbState,
        };
      }
      this.getDataList();
      this.getInfo();
      this.getRankList();
    },
    sizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      console.log(this.pagination);
      this.getDataList();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getDataList();
    },
    //获取直播列表
    getDataList() {
      // console.log(
      //   "直播列表参数",
      //   this.type,
      //   this.searchCondition,
      //   this.pagination
      // );
      this.dataListLoading = true;
      console.log(this.pagination);
      api
        .listPageJson({
          type: this.type,
          ...this.searchCondition,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("直播列表！！！", res);
          this.dataList = res.data.list ? res.data.list : [];
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
    // 快速掌握促单小技巧
    getTip() {
      this.quickModalShow = true;
    },
    // 添加客户弹窗确定
    addCustomerModalOk(resIds) {
      console.log(resIds, this.addCustomerModalShow);
      api
        .reserveCustSaveHyxCust({
          zbId: this.addCustomerModalShow,
          resIds,
        })
        .then((res) => {
          if (res.status) {
            this.$message.success(`提交成功：${res.data}`);
            this.addCustomerModalCancel();
            this.getDataList();
          }
        });
    },
    // 添加客户弹窗取消
    addCustomerModalCancel() {
      this.addCustomerModalShow = false;
    },
    // 去直播设置
    goToSetting(item) {
      api.getZbState({ zbId: item.zbId }).then((res) => {
        if (res.data.zbState && res.data.zbState < 4) {
          if (window.parent.toCard) {
            window.parent.toCard({
              single: true,
              title: "直播设置",
              url: `${window.location.origin}${this.$config.myFront}/#/broadcast/broadcastSetting?zbId=${item.zbId}`,
            });
          } else {
            this.$router.push({
              path: "/broadcast/broadcastSetting",
              query: { zbId: item.zbId },
            });
          }
        } else {
          this.$message.error("直播已结束，无法进入直播设置");
          this.getDataList();
        }
      });
    },
    // 添加客户
    addCustomer(item) {
      api.getZbState({ zbId: item.zbId }).then((res) => {
        if (res.data.zbState && res.data.zbState < 4) {
          this.addCustomerModalShow = item.zbId;
        } else {
          this.$message.error("直播已结束，无法添加客户");
          this.getDataList();
        }
      });
    },
    // 我约的客户
    myCustomer(item) {
      if (window.parent.toCard) {
        window.parent.toCard({
          single: true,
          title: "我约的客户",
          url: `${window.location.origin}${this.$config.myFront}/#/broadcast/myCustomer?zbId=${item.zbId}`,
        });
      } else {
        this.$router.push({
          path: "/broadcast/myCustomer",
          query: { zbId: item.zbId },
        });
      }
    },
    data(item) {
      if (window.parent.toCard) {
        window.parent.toCard({
          single: true,
          title: "直播数据",
          url: `${window.location.origin}${this.$config.myFront}/#/broadcast/broadcastData?zbId=${item.zbId}`,
        });
      } else {
        this.$router.push({
          path: "/broadcast/broadcastData",
          query: { zbId: item.zbId },
        });
      }
    },
    //分享
    share(item) {
      api.getZbState({ zbId: item.zbId }).then((res) => {
        if (res.data.zbState && res.data.zbState < 4) {
          api.roomShareUrl({ zbId: item.zbId }).then((re) => {
            console.log("分享的直播地址信息", re);
            this.shareModalShow = {
              str: re.shareUrl,
            };
          });
        } else {
          this.$message.error("直播已结束，无法分享");
          this.getDataList();
        }
      });
    },
    // 去直播
    goToBroadcast(item) {
      api.getZbState({ zbId: item.zbId }).then((res) => {
        if (res.data.zbState && res.data.zbState < 4) {
          // 跳到直播页面,获取直播间地址
          if (window.parent.toCard) {
            window.parent.toCard({
              single: true,
              title: "直播间",
              url: `${this.$config.roomFront}#/?zbId=${item.zbId}`,
            });
          } else {
            // 开发时打开直播间地址
            // http://hyx9.test.com/live_hall?zbId=
            window.open(`${this.$config.roomFront}#/?zbId=${item.zbId}`);
          }
        } else {
          this.$message.error("直播彻底已结束，无法进入直播");
          this.getDataList();
        }
      });
    },
    // 创建直播
    createBroadcast() {
      api.roomCheckRealName().then((res) => {
        // console.log(res);
        if (res.status) {
          this.createModalShow = true;
        }
      });
    },
    // 创建直播确定
    createModalOk(createFormData) {
      console.log(createFormData);
      this.confirmLoading = true;
      api
        .isExistName({ zbName: createFormData.zbName })
        .then((res) => {
          console.log(res);
          if (res.status) {
            api
              .inputAndUpdZb({
                ...createFormData,
                expectStartTime: moment(createFormData.expectStartTime).format(
                  "YYYY-MM-DD HH:mm:00"
                ),
              })
              .then((res) => {
                console.log(res);
                if (res.status) {
                  this.$message.success(res.msg || "创建成功");
                  this.createModalCancel();
                  this.search();
                } else {
                  this.$message.error("创建失败");
                }
                this.confirmLoading = false;
              })
              .catch((e) => {
                this.confirmLoading = false;
              });
          } else {
            this.$message.error("该直播名称已存在");
            this.confirmLoading = false;
          }
        })
        .catch((e) => {
          console.log(e);
          this.confirmLoading = false;
        });
    },
    // 创建直播取消
    createModalCancel() {
      this.createModalShow = false;
    },
    //获取右边信息
    getInfo() {
      this.infoLoading = true;
      api.willPlyAndMyData().then((res) => {
        console.log("右边中上部分数据", res);
        this.info = res.data;
        this.infoLoading = false;
      });
    },
    // 获取排名
    getRankList() {
      this.rankListLoading = true;
      api
        .rankListData({
          type: this.rankListType,
        })
        .then((res) => {
          this.rankList = res.data;
          this.rankListLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.broadcast-hall {
  position: relative;
  padding: 20px;
  .left {
    margin-right: 340px;
    height: calc(100vh - 40px);
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      .toolbar-left {
        display: flex;
        align-items: center;
      }
      .toolbar-right {
        display: flex;
        align-items: center;
      }
    }
    .content {
      max-height: calc(100vh - 190px);
      padding-right: 10px;
      overflow: auto;
      .content-item {
        overflow: hidden;
        border: 1px solid #ccc;
        border-radius: 6px;
        margin-bottom: 20px;
        .content-item-top {
          padding: 20px;
        }
        .content-item-bottom {
          padding: 15px;
          display: flex;
          background: #f9f9f9;
          border-top: 1px solid #ccc;
          align-items: center;
          justify-content: space-between;
          .button {
            margin-left: 20px;
          }
        }
      }
    }
  }
  .right {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 322px;
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .will-play {
      height: calc(50% - 120px);
      .title {
        margin-bottom: 20px;
        font-size: 15px;
        font-weight: bold;
        .icon {
          margin-right: 10px;
          font-size: 16px;
        }
      }
    }
    .my-data {
      border-top: 1px solid #ccc;
      padding-top: 20px;
      height: 120px;
      .title {
        margin-bottom: 20px;
        font-size: 15px;
        font-weight: bold;
        .icon {
          margin-right: 10px;
          font-size: 16px;
        }
      }
      .content {
        height: calc(100% - 60px);
        display: flex;
        justify-content: space-between;
      }
    }
    .rank-list {
      border-top: 1px solid #ccc;
      padding-top: 20px;
      height: 50%;
      .title {
        font-size: 15px;
        font-weight: bold;
        .icon {
          margin-right: 10px;
          font-size: 16px;
        }
      }
      .tab {
        position: relative;
        .border-bottom {
          border-bottom: 1px solid #ccc;
          position: absolute;
          bottom: 15px;
          z-index: 0;
          height: 1px;
          width: 100%;
        }
      }
      .content {
        height: calc(100% - 80px);
        overflow: auto;
        position: relative;
        text-align: center;
        .row {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.broadcast-hall {
  .ant-radio-group {
    .ant-radio-button-wrapper{
      &:hover{color:#666}
      border-color: #ccc;
    }
    .ant-radio-button-wrapper-checked {
      color: #666;
      background: #eef1f5;
      border-color: #ccc;
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
        box-shadow: none;
        border-color: #ccc;
    }
  }
}
</style>
