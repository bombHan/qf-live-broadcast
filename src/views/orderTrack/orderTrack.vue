<template>
  <div class="order-track">
    <searchTool
      :topData="topData"
      @getFilterData="search"
      style="margin: 0 0 20px 20px"
    />
    <div style="padding: 0 20px; margin-bottom: 20px">
      促单追踪包含自己及权限内的成员已参与直播的客户，共包含客户
      {{ joinNumber }} 条，其中赢单 {{ winNumber }} 次。
    </div>
    <a-table
      :loading="loading"
      :columns="columns"
      :dataSource="dataList"
      :rowKey="(record) => record.custId"
      :pagination="false"
    >
      <template slot="action" slot-scope="key, item">
        <div>
          <img
            title="客户卡片"
            src="../../assets/img/客户卡片.jpg"
            style="cursor: pointer"
            @click="customerCard(item)"
            v-if="item.isBelongMe === 1"
          />
          <img
            title="跟进"
            src="../../assets/img/跟进.jpg"
            style="margin: 0 10px; cursor: pointer"
            @click="followUp(item)"
            v-if="item.isBelongMe === 1"
          />
          <img
            title="直播卡片"
            src="../../assets/img/直播卡片.jpg"
            style="cursor: pointer"
            @click="liveBroadcastCard(item)"
          />
        </div>
      </template>
    </a-table>
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
        style="margin-top: 20px; margin-right: 20px"
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
import searchTool from "../../components/SearchTool/index.vue";
import liveBroadcastCardModal from "../myCustomer/components/liveBroadcastCardModal.vue";
import api from "../../api/api";
export default {
  name: "orderTrack",
  components: {
    searchTool,
    liveBroadcastCardModal,
  },
  data() {
    return {
      loading: false,
      joinNumber: 0, // 参与直播的客户数量
      winNumber: 0, // 赢单客户的数量
      filterObj: {}, // 筛选框对象
      modalShow: false, // 直播卡片弹窗
      dataList: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: null,
      },
      columns: [
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "客户名称",
          dataIndex: "resCustName",
        },
        {
          title: "联系人",
          dataIndex: "resName",
        },
        {
          title: "联系电话",
          dataIndex: "resPhone",
        },
        {
          title: "所有者",
          dataIndex: "applyName",
        },
        {
          title: "商机阶段",
          dataIndex: "stageName",
        },
        {
          title: "参与直播名称",
          dataIndex: "zbName",
        },
        {
          title: "参与直播时间",
          dataIndex: "visitTime",
        },
        {
          title: "直播人",
          dataIndex: "zbAcctName",
        },
        {
          title: "促单效果",
          dataIndex: "resultStateStr",
        },
      ],
      topData: {
        selectList: [
          {
            name: "resCustName",
            text: "客户名称",
          },
          {
            name: "resName",
            text: "联系人",
          },
          // {
          //   name: "name",
          //   text: "商机名称",
          // },
        ],
        filterList: [
          {
            type: "select",
            name: "stageId",
            label: "商机阶段",
            options: [],
          },
          // {
          //   type: "treeSelect",
          //   name: "applyId",
          //   label: "预约人",
          // },
          {
            type: "rangepicker",
            name: "joinTime",
            label: "参与直播时间",
            showTime: true,
            format: "YYYY-MM-DD HH:mm:ss",
          },
          {
            type: "treeSelect",
            name: "zbAcctId",
            label: "直播人",
            treeSelectParams: {
              fetchUrl: "/orgGroup/get_all_sale_user_json",
              // treeCheckable: false
            },
          },
          {
            type: "select",
            name: "resultState",
            label: "促单效果",
            options: [
              { label: "新商机", value: 1 },
              { label: "推进商机", value: 2 },
              { label: "赢单", value: 3 },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.getBussinessList();
    this.getDataNumber();
    this.getDataList();
  },
  methods: {
    getDataNumber() {
      api.reserveCustFindNumberByTrace().then((res) => {
        console.log("促单追踪数据", res.data);
        this.joinNumber = res.data.joinNumber;
        this.winNumber = res.data.winNumber;
      });
    },
    getBussinessList() {
      api.tsmBusinessStageSetListJson().then((res) => {
        console.log("商机阶段可选择列表", res);
        const bussinessList = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.topData.filterList[0].options = bussinessList;
      });
    },
    search(value) {
      this.filterObj = {
        ...value,
        applyId: value.applyId ? value.applyId.join(",") : null,
        zbAcctId: value.zbAcctId ? value.zbAcctId.join(",") : null,
        joinTime: value.joinTime ? value.joinTime.join(",") : null,
      };
      console.log(this.filterObj);
      this.getDataList();
    },
    getDataList() {
      console.log("列表请求参数", this.filterObj);
      this.loading = true;
      api
        .reserveCustFindReserveCustByTrace({
          ...this.filterObj,
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("促单追踪列表", res.data);
          this.dataList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
          this.loading = false;
        });
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
    // 直播卡片
    liveBroadcastCard(item) {
      console.log("直播卡片", item);
      this.modalShow = { ...item, visitId: item.visitId };
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
  },
};
</script>

<style lang='less' scoped>
.order-track {
  padding: 20px 0;
}
</style>
