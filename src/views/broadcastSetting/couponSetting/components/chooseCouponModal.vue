<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :visible="!!modalShow"
    @cancel="cancel"
    @ok="ok"
    class="choose-coupon-modal"
    width="800px"
  >
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :rowKey="(record) => record.id"
      :pagination="false"
      :loading="loading"
      :rowSelection="{
        onChange: onSelectChange,
        selectedRowKeys: selectedRowKeys,
        columnTitle: ' ',
      }"
    >
      <template slot="type" slot-scope="key">
        {{key === '0' ? '店铺促销' : (key === '1' ? '满减券' : (key === '2' ? '折扣券' : '现金券'))}}
      </template>
      <template slot="number" slot-scope="key, item">
        {{ item.amount }}/{{ item.surplus }}
      </template>
      <!-- <template slot="name" slot-scope="key">
        <Tooltip :str="key" :max="9" v-if="key && key.length > 9" />
        <div v-else>{{ key }}</div>
      </template> -->
    </a-table>
    <div
      style="
        display: flex;
        align-items: center;
        margin-top: 20px;
        justify-content: space-between;
      "
    >
      <div style="line-height: 32px">
        已选择 {{ selectedRowKeys.length }} 个优惠券
      </div>
      <a-pagination
        :showTotal="(total) => `共 ${pagination.total} 条`"
        showSizeChanger
        showQuickJumper
        @change="pagerChange"
        @showSizeChange="sizeChange"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        :current="pagination.pageNum"
      />
    </div>
  </a-modal>
</template>

<script>
import api from "../../../../api/api";
import Tooltip from "../../../../components/Tooltip.vue";
export default {
  name: "chooseCouponModal",
  components: {
    Tooltip,
  },
  props: {
    modalShow: {
      type: [Boolean, String],
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "选择优惠券",
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      dataList: [],
      selectedRowKeys: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: null,
      },
      columns: [
        {
          title: "优惠券名称",
          dataIndex: "name",
        },
        {
          title: "优惠券类型",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "优惠内容",
          dataIndex: "content",
        },
        {
          title: "发放张数/剩余张数",
          dataIndex: "number",
          scopedSlots: { customRender: "number" },
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
        .couponLiveCouponPage({
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log('选用优惠券列表',res);
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
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 点击取消
    ok() {
      this.$emit("ok", this.selectedRowKeys);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less">
.choose-coupon-modal {
}
</style>
