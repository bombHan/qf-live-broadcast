<template>
  <div class="visitor-data-list">
    <searchTool :topData="topData" @getFilterData="search" />
    <div style="display: flex; justify-content: space-between; margin: 20px 0">
      <a-button
        type="primary"
        ghost
        @click="turnToHyx"
        :disabled="selectedIds.length === 0"
        >转入慧营销</a-button
      >
      <a-button type="primary" ghost @click="exportExcel">导出</a-button>
    </div>
    <a-table
      :loading="loading"
      :columns="columns"
      :dataSource="dataList"
      :rowKey="(record) => record.id"
      :pagination="false"
      :rowSelection="{
        onChange: onSelectChange,
        selectedRowKeys: selectedIds,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.state !== 2,
          },
        }),
      }"
    >
      <template slot="action" slot-scope="key, item">
        <!-- <a @click="view(item)">查看</a> -->
        <img src="../../../assets/img/查看.png" @click="view(item)" style="cursor: pointer;margin-left: 10px"/>
      </template>
      <template slot="state" slot-scope="key, item">
        <div>
          {{
            item.state === 0
              ? "无号码"
              : item.state === 1
              ? "已转资源"
              : item.state === 2
              ? "未转资源"
              : item.state === 3
              ? "预约客户"
              : "号码重复"
          }}
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
  name: "visitorDataLsit",
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
      selectedIds: [],
      modalShow: false, // 查看弹窗
      topData: {
        selectList: [
          {
            name: "ipAddress",
            text: "IP",
          },
          {
            name: "mobilePhone",
            text: "手机号",
          },
        ],
        filterList: [
          {
            type: "select",
            name: "state",
            label: "状态",
            options: [
              { label: "无号码", value: 0 },
              { label: "已转资源", value: 1 },
              { label: "未转资源", value: 2 },
              { label: "预约客户", value: 3 },
              { label: "号码重复", value: 4 },
            ],
          },
          {
            type: "rangepicker",
            name: "visitTimeStr",
            label: "访问时间",
            // showTime: true,
            // format: 'YYYY-MM-DD HH:mm:ss'
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
          title: "IP",
          dataIndex: "ipAddress",
        },
        {
          title: "手机号",
          dataIndex: "mobilePhone",
        },
        {
          title: "客户名称",
          dataIndex: "nickname",
        },
        {
          title: "访问时间",
          dataIndex: "visitTime",
        },
        {
          title: "促单接待",
          dataIndex: "receptionName",
        },
        {
          title: "状态",
          dataIndex: "state",
          scopedSlots: { customRender: "state" },
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
      this.loading = true;
      api
        .visitorListPageJson({
          ...this.filterObj,
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("访客数据列表", res.data);
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
    // 选择id
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows);
      this.selectedIds = selectedRowKeys;
    },
    turnToHyx() {
      console.log("转至慧营销", this.selectedIds); // 用里面的resId
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
          console.log(that.selectedIds, turnType);
          api
            .visitorJoinHyx({
              type: turnType,
              ids: that.selectedIds,
            })
            .then((res) => {
              that.$message.success(res.msg);
              that.selectedIds = [];
              that.getDataList();
            });
        },
      });
    },
    // 导出
    exportExcel() {
      this.$utils.exportExcel("/zb/visitor/getVisitorExcel", {
        ...this.filterObj,
        zbId: this.$route.query.zbId,
      });
    },
    // 查看
    view(item) {
      console.log("查看对象", item);
      this.modalShow = { visitId: item.id };
    },
  },
};
</script>

<style lang='less' scoped>
.visitor-data-list {
}
</style>
