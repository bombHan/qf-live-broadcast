<template>
  <div class="appointment-customer-data">
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <searchTool :topData="topData" @getFilterData="search" />
      <a-button type="primary" ghost @click="exportExcel">导出</a-button>
    </div>
    <a-table
      :loading="loading"
      :columns="columns"
      :dataSource="dataList"
      :rowKey="(record) => record.custId"
      :pagination="false"
    >
      <template slot="action" slot-scope="key, item">
        <img
          v-if="item.isJoin"
          src="../../../assets/img/查看.png"
          @click="view(item)"
          style="cursor: pointer; margin-left: 10px"
        />
        <img
          v-else
          src="../../../assets/img/不可查看.png"
          style="margin-left: 10px; cursor: not-allowed"
          title="未进入直播无法查看其直播卡片"
        />
      </template>
      <template slot="isJoin" slot-scope="key">
        <span>
          {{ key === 0 ? "否" : "是" }}
        </span>
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
        style="margin-top: 20px"
      />
    </div>
    <liveBroadcastCardModal
      v-if="modalShow"
      :modalShow="modalShow"
      @cancel="modalShow = false"
    />
  </div>
</template>

<script>
import searchTool from "../../../components/SearchTool/index.vue";
import liveBroadcastCardModal from "../../myCustomer/components/liveBroadcastCardModal";
import api from "../../../api/api";
export default {
  name: "appointmentCustomerData",
  components: {
    searchTool,
    liveBroadcastCardModal,
  },
  data() {
    return {
      loading: false,
      filterObj: {},
      dataList: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: null,
      },
      modalShow: false, // 查看弹窗
      topData: {
        selectList: [
          {
            name: "resPhone",
            text: "手机号",
          },
          {
            name: "resCustName",
            text: "客户名称",
          },
          {
            name: "resName",
            text: "联系人",
          },
        ],
        filterList: [
          // {
          //   type: "rangepicker",
          //   name: "visitTimeStr",
          //   label: "访问时间",
          //   // showTime: true,
          //   // format: "YYYY-MM-DD HH:mm:ss",
          // },
          {
            type: "select",
            name: "isJoin",
            label: "进入直播",
            options: [
              { label: "是", value: 1 },
              { label: "否", value: 0 },
            ],
          },
        ],
      },
      columns: [
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "手机号",
          dataIndex: "resPhone",
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
          title: "访问时间",
          dataIndex: "visitTime",
        },
        {
          title: "进入直播",
          dataIndex: "isJoin",
          scopedSlots: { customRender: "isJoin" },
        },
        {
          title: "促单接待",
          dataIndex: "receptionName",
        },
      ],
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    search(value) {
      this.filterObj = {
        ...value,
        visitTimeStr: value.visitTimeStr ? value.visitTimeStr.join(",") : null,
      };
      console.log(this.filterObj);
      this.getDataList();
    },
    getDataList() {
      console.log("列表请求参数", this.filterObj);
      this.loading = true;
      api
        .reserveCustListPageJson({
          ...this.filterObj,
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("预约客户数据列表", res.data);
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
      this.pagination.total = null;
      console.log(this.pagination);
      this.getDataList();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getDataList();
    },
    // 导出
    exportExcel() {
      this.$utils.exportExcel("/zb/reserveCust/getReserveCustExcel", {
        zbId: this.$route.query.zbId,
      });
    },
    // 表格中点击查看
    view(item) {
      console.log("查看对象", item);
      this.modalShow = { visitId: item.visitId };
    },
  },
};
</script>

<style lang='less' scoped>
.appointment-customer-data {
}
</style>
