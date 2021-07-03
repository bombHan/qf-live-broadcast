<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :visible="!!modalShow"
    @cancel="cancel"
    :footer="null"
    class="watch-prize-modal"
    width="900px"
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      "
    >
      <div style="display: flex; align-items: center">
        是否中奖：
        <a-select
          v-model="isWinner"
          style="margin: 0 20px 0 10px; width: 120px"
        >
          <a-select-option value=""> 全部 </a-select-option>
          <a-select-option value="0"> 未中奖 </a-select-option>
          <a-select-option value="1"> 中奖 </a-select-option>
        </a-select>
        <a-button @click="getDataList" type="primary">查询</a-button>
      </div>
      <div>
        请导出查看全部
        <a-button @click="exportExcel" type="primary" style="margin-left: 10px"
          >导出</a-button
        >
      </div>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :rowKey="(record) => record.prizeVisitId"
      :pagination="false"
      :loading="loading"
    >
      <template slot="isWinner" slot-scope="key">
        {{ key === 0 ? "未中奖" : "中奖" }}
      </template>
      <template slot="address" slot-scope="key">
        <Tooltip :str="key" :max="9" v-if="key && key.length > 9" />
        <div v-else>{{ key }}</div>
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
  </a-modal>
</template>

<script>
import api from "../../../api/api";
import Tooltip from "../../../components/Tooltip.vue";
export default {
  name: "chooseGoodsModal",
  components: {
    Tooltip,
  },
  props: {
    modalShow: {
      // 传进来的是bool值或者是抽奖详情的id
      type: [Boolean, String],
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "抽奖详情",
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      isWinner: "",
      dataList: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      columns: [
        {
          title: "IP",
          dataIndex: "ipAddress",
        },
        {
          title: "客户名称",
          dataIndex: "visitName",
        },
        {
          title: "手机号",
          dataIndex: "phone",
        },
        {
          title: "是否中奖",
          dataIndex: "isWinner",
          scopedSlots: { customRender: "isWinner" },
        },
        {
          title: "地址",
          dataIndex: "address",
          scopedSlots: { customRender: "address" },
        },
        {
          title: "参与时间",
          dataIndex: "inputTime",
        },
      ],
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.loading = true;
      api
        .zbPrizeVisitInfoJson({
          prizeId: this.modalShow,
          isWinner: this.isWinner,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.dataList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
        })
        .catch((e) => {
          this.loading = false;
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
    // 导出
    exportExcel() {
      this.$utils.exportExcel("/zb/prizeVisit/getPrizeVisitExcel", {
        prizeId: this.modalShow,
        isWinner: this.isWinner,
      });
    },
    // 点击取消
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less">
.watch-prize-modal {
}
</style>
