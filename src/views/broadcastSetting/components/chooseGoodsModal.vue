<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :visible="modalShow"
    @cancel="cancel"
    @ok="ok"
    class="choose-goods-modal"
    width="800px"
  >
    <a-spin :spinning="loading">
      <FormModelSearchForm
        :formList="searchFormList"
        @prevHandleSubmit="getData"
        :defaultFormValues="defaultFormValues"
        style="margin-bottom: 20px"
      ></FormModelSearchForm>
      <div class="list-wrap" v-if="dataList.length > 0">
        <!-- <a-checkbox
          :checked="false"
          @change="changeAllSelect"
        >
          全选
        </a-checkbox> -->
        <a-checkbox
          v-for="(item, index) in dataList"
          :key="index"
          :value="item.goodsId"
          :checked="isChecked(item)"
          @change="changeCheckbox"
        >
          <div class="list-content">
            <div class="list-item">
              <div class="left">
                <img :src="item.mainPic" alt="图片" class="pic" />
                <div class="title">{{ item.goodsName }}</div>
              </div>
              <div style="text-align: center;">
                <!-- <div style="color: #999; font-size: 12px; position: relative">
                  原价：111元
                  <div
                    style="
                      width: 100%;
                      border-top: 1px solid #999;
                      position: absolute;
                      top: 9px;
                    "
                  />
                </div> -->
                <div style="font-size: 16px; color: red" v-if="item.hasSpec === 0">现价：{{item.realPrice}}元</div>
                <div style="font-size: 16px; color: red" v-else>现价：{{item.minPrice}}元 - {{item.maxPrice}}元</div>
              </div>
            </div>
          </div>
        </a-checkbox>
      </div>
      <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else style="margin: 20px 0"></a-empty>
      <div
        style="
          display: flex;
          flex-direction: row-reverse;
          margin-top: 30px;
          align-items: center;
          justify-content: space-between;
        "
      >
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
        />
        <div>
          已选中
          <span style="color: #1890ff">{{ this.selectedIds.length }}</span>
          个商品
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import api from "../../../api/api";
import FormModelSearchForm from "@/components/FormModelSearchForm.vue";
export default {
  name: "chooseGoodsModal",
  props: {
    modalShow: {
      type: Boolean,
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "选择商品",
      required: false,
    },
  },
  components: {
    FormModelSearchForm,
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
      selectedIds: [],
      defaultFormValues: {
        name: null,
      },
      queryObj: {},
      searchFormList: [
        // {
        //   type: "compact",
        //   compactName: "queryType",
        //   options: [
        //     { value: "resCustName", label: "预约的客户" },
        //     { value: "resName", label: "联系人" },
        //     { value: "resPhone", label: "手机号" },
        //     { value: "theme", label: "主题" },
        //     { value: "remark", label: "备注" },
        //   ],
        //   compact: "input",
        //   name: "queryText",
        // },
        {
          type: "input",
          label: "商品名称",
          name: "goodsName",
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData(value) {
      if (value) {
        console.log(value);
        this.queryObj = value;
      }
      this.loading = true;
      api
        .shopShopListPage({
          ...this.queryObj,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log(res);
          this.dataList = res.data.list;
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
    isChecked(target) {
      return this.selectedIds.includes(target.goodsId);
    },
    changeCheckbox(e) {
      console.log(e.target.value, e.target.checked);
      if (e.target.checked) {
        this.selectedIds.push(e.target.value);
      } else {
        this.selectedIds = this.selectedIds.filter((item) => {
          return item !== e.target.value;
        });
      }
    },
    // 全选
    changeAllSelect() {},
    sizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      this.getData();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getData();
    },
    // 点击确定
    ok() {
      // console.log("okokokokok");
      if (this.selectedIds.length > 0) {
        this.$emit("ok", this.selectedIds);
      } else {
        this.$message.error("请选择至少一个商品");
      }
    },
    // 点击取消
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less">
.choose-goods-modal {
  .list-wrap {
    max-height: 350px;
    overflow: auto;
    .ant-checkbox-wrapper {
      display: flex;
      align-items: center;
      margin: 0 0 20px 0;
      .list-content {
        width: 700px;
        margin-left: 10px;
        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            display: flex;
            align-items: center;
            .pic {
              height: 80px;
              width: 120px;
              margin-right: 20px;
            }
            .title {
              color: #000;
              font-size: 16px;
              width: 350px;
              word-break: break-all;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
