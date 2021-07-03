<template>
  <div class="coupon-setting">
    <a-spin :spinning="loading">
      <div
        style="
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div>
          在企蜂云应用市场中维护好优惠券，在此页面维护该直播间的优惠券使用功能
        </div>
        <a-button type="primary" ghost @click="chooseCouponModalShow = true"
          >选择优惠券</a-button
        >
      </div>
      <div class="table-content">
        <a-table
          :columns="columns"
          :dataSource="dataList"
          :rowKey="(record) => record.id"
          :pagination="false"
        >
          <template slot="type" slot-scope="key">
            {{
              key === "0"
                ? "店铺促销券"
                : key === "1"
                ? "满减券"
                : key === "2"
                ? "折扣券"
                : "现金券"
            }}
          </template>
          <template slot="action" slot-scope="key, item">
            <a style="margin-right: 10px" @click="setCoupon(item)"> 设置 </a>
            <a style="margin-right: 10px" @click="detailCoupon(item)"> 详情 </a>
            <a style="margin-right: 10px" @click="deleteCoupon(item)"> 删除 </a>
          </template>
        </a-table>
      </div>
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
    </a-spin>
    <chooseCouponModal
      v-if="chooseCouponModalShow"
      :modalShow="chooseCouponModalShow"
      @ok="chooseCouponModalOk"
      @cancel="chooseCouponModalShow = false"
    />
    <!-- 详情弹窗 -->
    <detailModal
      v-if="!!detailModalShow"
      :detailModalShow="detailModalShow"
      @cancel="detailModalShow = false"
    />
    <!-- 设置弹窗 -->
    <setModal
      v-if="!!setModalShow"
      :setModalShow="setModalShow"
      @cancel="setModalShow = false"
      @ok="setModalOk"
    />
  </div>
</template>

<script>
import chooseCouponModal from "./components/chooseCouponModal.vue";
import detailModal from "./components/detailModal.vue";
import setModal from "./components/setModal.vue";
import api from "../../../api/api";
export default {
  name: "couponSetting",
  components: {
    chooseCouponModal,
    detailModal,
    setModal,
  },
  data() {
    return {
      loading: false,
      dataList: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: null,
      },
      chooseCouponModalShow: false, // 选择优惠券弹窗
      detailModalShow: false, // 详情弹窗
      setModalShow: false, // 设置弹窗
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
          title: "优惠券内容",
          dataIndex: "content",
        },
        {
          title: "剩余",
          dataIndex: "surplus",
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
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
        .couponListPageJson({
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("优惠券列表", res);
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
      this.getDataList();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getDataList();
    },
    chooseCouponModalOk(couponIds) {
      console.log("选中的优惠券的id数据", couponIds);
      api
        .couponInsertJson({
          zbId: this.$route.query.zbId,
          couponIds,
        })
        .then((res) => {
          this.$message.success("选择成功");
          this.chooseCouponModalShow = false;
          this.getDataList();
        });
    },
    // 设置
    setCoupon(target) {
      this.setModalShow = target;
    },
    // 详情
    detailCoupon(target) {
      this.detailModalShow = target;
    },
    // 删除
    deleteCoupon(target) {
      const id = target.id;
      console.log(id);
      const that = this;
      this.$confirm({
        title: "删除",
        content: `是否删除当前优惠券？`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          api
            .couponDelJson({
              id,
            })
            .then((res) => {
              that.$message.success("删除成功");
              that.getDataList();
            });
        },
      });
    },
    // 设置弹窗ok
    setModalOk(formData) {
      console.log(formData);
      api
        .couponSaveJson({
          ...formData,
          zsSend: formData.zsSend ? 0 : 1,
          saleSend: formData.saleSend ? 0 : 1,
        })
        .then((res) => {
          console.log(res);
          this.$message.success("保存成功");
          this.setModalShow = false;
          this.getDataList();
        });
    },
  },
};
</script>

<style lang='less' scoped>
.coupon-setting {
  .table-content {
    max-height: calc(100vh - 270px);
    overflow: auto;
    margin-top: 20px;
  }
}
</style>
