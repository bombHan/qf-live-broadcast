<template>
  <div class="order-appointment">
    <a-spin :spinning="loading">
      <a-radio-group v-model="tabType" button-style="solid" @change="changeTab">
        <a-radio-button :value="1" style="width: 120px; text-align: center">
          我申请的
        </a-radio-button>
        <a-radio-button :value="2" style="width: 120px; text-align: center">
          我下属申请的
        </a-radio-button>
        <a-radio-button :value="3" style="width: 120px; text-align: center">
          指定给我的
        </a-radio-button>
      </a-radio-group>
      <searchTool
        :topData="topData"
        @getFilterData="search"
        :key="tabType"
        style="margin: 20px 0"
      />
      <div class="content" v-if="dataList.length > 0">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="content-item"
        >
          <div class="content-item-top">
            <div class="left">
              <div style="display: flex; flex-wrap: wrap">
                <div class="left-item">
                  预约客户：{{ item.resCustName }}-{{ item.resName }}-{{
                    item.resPhone
                  }}
                </div>
                <div class="left-item">
                  预约主播：
                  <tooltip
                    :str="item.reserveAcctName"
                    :max="20"
                  />
                </div>
                <div class="left-item">主题：{{ item.theme }}</div>
              </div>
              <div class="left-item">
                预计直播时间：{{ item.zbStartTime }} ~ {{ item.zbEndTime }}
              </div>
              <div class="left-item" style="margin-bottom: 0">
                备注：{{ item.remark }}
              </div>
            </div>
            <div class="right">
              <a-button v-if="item.type === 0" @click="modalShow = item.id"
                >拒绝</a-button
              >
              <img src="../../assets/img/已通过.png" v-if="item.type === 1" />
              <img src="../../assets/img/已拒绝.png" v-if="item.type === 2" />
            </div>
          </div>
          <div class="content-item-center">
            <div class="item">申请人：{{ item.applyName }}</div>
            <div class="item">申请时间：{{ item.inputTime }}</div>
          </div>
          <div class="content-item-bottom" v-if="item.type !== 0">
            <div class="item" v-if="item.type === 2">
              拒绝理由：{{ item.refuseRemark }}
            </div>
            <div class="item" v-if="item.type === 1">
              直播名称：{{ item.zbName }}
            </div>
            <div class="item" v-if="item.type === 1">
              直播人：{{ item.zbAcctName }}
            </div>
            <div class="item" v-if="item.type === 1">
              直播时间：{{ item.zbTime }}
            </div>
          </div>
        </div>
      </div>
      <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else />
      <div style="display: flex; flex-direction: row-reverse" v-if="dataList.length > 0">
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
          style="margin-top: 20px"
        />
      </div>
    </a-spin>
    <rejectModal
      v-if="!!modalShow"
      :modalShow="!!modalShow"
      @cancel="modalShow = false"
      @ok="rejectModalOk"
    />
  </div>
</template>

<script>
import searchTool from "../../components/SearchTool/index.vue";
import api from "../../api/api";
import tooltip from "../../components/Tooltip.vue";
import rejectModal from "./components/rejectModal.vue";
export default {
  name: "orderAppointment",
  components: {
    searchTool,
    tooltip,
    rejectModal,
  },
  data() {
    return {
      loading: false,
      tabType: 1,
      obj: {
        input: "",
      },
      filterObj: {},
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      dataList: [],
      modalShow: false,
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    changeTab() {
      this.filterObj = {};
      this.getDataList();
    },
    search(value) {
      if (value) {
        this.filterObj = {
          ...value,
          applyIdStr: value.applyIdStr ? value.applyIdStr.join(",") : null,
        };
      }
      this.getDataList();
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
    getDataList() {
      console.log(this.tabType, this.filterObj);
      this.loading = true;
      api
        .reserveOrderListPageJson({
          tabType: this.tabType,
          ...this.filterObj,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log(res.data);
          this.loading = false;
          this.dataList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
        });
    },
    rejectModalOk(refuseRemark) {
      console.log(this.modalShow, refuseRemark);
      api
        .reserveOrderSaveJson({
          id: this.modalShow,
          refuseRemark,
        })
        .then((res) => {
          console.log(res);
          this.$message.success("拒绝成功");
          this.modalShow = false;
          this.getDataList();
        });
    },
  },
  computed: {
    topData() {
      let topData = {};
      if (this.tabType === 1) {
        topData = {
          selectList: [
            {
              name: "resCustName",
              text: "预约客户",
            },
            {
              name: "resName",
              text: "联系人",
            },
            {
              name: "resPhone",
              text: "电话",
            },
            {
              name: "theme",
              text: "主题",
            },
            {
              name: "remark",
              text: "备注",
            },
          ],
          filterList: [
            {
              type: "select",
              name: "type",
              label: "申请状态",
              options: [
                { label: "待通过", value: 0 },
                { label: "已通过", value: 1 },
                { label: "已拒绝", value: 2 },
              ],
            },
          ],
        };
      } else if (this.tabType === 2) {
        topData = {
          selectList: [
            {
              name: "resCustName",
              text: "预约客户",
            },
            {
              name: "resName",
              text: "联系人",
            },
            {
              name: "resPhone",
              text: "电话",
            },
            {
              name: "theme",
              text: "主题",
            },
            {
              name: "remark",
              text: "备注",
            },
          ],
          filterList: [
            {
              type: "treeSelect",
              name: "applyIdStr",
              label: "申请人",
            },
            {
              type: "select",
              name: "type",
              label: "申请状态",
              options: [
                { label: "待通过", value: 0 },
                { label: "已通过", value: 1 },
                { label: "已拒绝", value: 2 },
              ],
            },
          ],
        };
      } else if (this.tabType === 3) {
        topData = {
          selectList: [
            {
              name: "resCustName",
              text: "预约客户",
            },
            {
              name: "resName",
              text: "联系人",
            },
            {
              name: "resPhone",
              text: "电话",
            },
            {
              name: "theme",
              text: "主题",
            },
            {
              name: "remark",
              text: "备注",
            },
          ],
          filterList: [
            {
              type: "treeSelect",
              name: "applyIdStr",
              label: "申请人",
              treeSelectParams: {
                fetchUrl: "/orgGroup/get_all_sale_user_json",
              },
            },
            {
              type: "select",
              name: "type",
              label: "申请状态",
              options: [
                { label: "待通过", value: 0 },
                { label: "已通过", value: 1 },
                { label: "已拒绝", value: 2 },
              ],
            },
          ],
        };
      }

      return topData;
    },
  },
};
</script>

<style lang='less' scoped>
.order-appointment {
  padding: 20px;
  padding-bottom: 10px;
  .content {
    overflow: auto;
    max-height: calc(100vh - 200px);
    padding-right: 10px;
    .content-item {
      padding: 20px;
      border: 1px solid #ccc;
      background: #f9f9f9;
      margin-bottom: 20px;
      border-radius: 10px;
      .content-item-top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
        .left {
          flex: 1;
          .left-item {
            margin: 0 50px 15px 0;
          }
        }
        .right {
          flex: none;
          width: 100px;
          text-align: right;
        }
      }
      .content-item-center {
        border-top: 1px solid #ccc;
        padding-top: 20px;
        display: flex;
        .item {
          margin: 0 50px 0 0;
        }
      }
      .content-item-bottom {
        display: flex;
        padding-top: 20px;
        border-top: 1px solid #ccc;
        margin-top: 20px;
        .item {
          margin: 0 50px 0 0;
        }
      }
    }
  }
}
</style>
