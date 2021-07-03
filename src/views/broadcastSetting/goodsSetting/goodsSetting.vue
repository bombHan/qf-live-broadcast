<template>
  <div class="goods-setting">
    <div class="tool">
      <div>在商品库中选择商品展示在直播间中</div>
      <div style="margin-right:20px">
        <a-button
          type="primary"
          ghost
          style="margin-right: 20px"
          @click="chooseGoods"
          >选择商品库</a-button
        >
        <a-button type="primary" ghost @click="editGoodsModalShow = 'add'"
          >添加商品</a-button
        >
      </div>
    </div>
    <a-spin :spinning="loading">
      <div class="list-wrap">
        <div class="list-item" v-for="(item, index) in dataList" :key="index">
          <div class="left">
            <img
              :src="(item.shopUrls || [])[0]"
              alt=""
              style="width: 120px; height: 80px; margin-right: 20px"
            />
            <div class="list-item-content">
              <div style="font-size: 16px; display: flex; align-items: center">
                <Tooltip
                  :str="item.name"
                  :max="20"
                  v-if="item.name && item.name.length > 20"
                />
                <span v-else>{{ item.name }}</span>
                <img
                  src="../../../assets/img/goods.png"
                  alt=""
                  v-if="item.type === 2"
                  style="margin-left: 10px"
                />
              </div>
              <div>
                <Tooltip
                  :str="item.shopDesc"
                  :max="50"
                  v-if="item.shopDesc && item.shopDesc.length > 50"
                />
                <span v-else>{{ item.shopDesc }}</span>
              </div>
              <!-- 内部添加商品显示 -->
              <div style="display: flex; align-items: center" v-if="item.type === 1">
                <div
                  style="
                    color: #999;
                    font-size: 12px;
                    position: relative;
                    margin-right: 30px;
                  "
                  v-if="item.oldPrice != null"
                >
                  原价：{{ item.oldPrice }}元
                  <div
                    style="
                      width: 100%;
                      border-top: 1px solid #999;
                      position: absolute;
                      top: 9px;
                    "
                  />
                </div>
                <div
                  style="font-size: 16px; color: red"
                  v-if="item.nowPrice != null"
                >
                  现价：{{ item.nowPrice }}元
                </div>
              </div>
              <!-- 商品库价格显示 -->
              <div style="display: flex; align-items: center" v-else>
                <div
                  style="font-size: 16px; color: red"
                  v-if="item.hasSpec === 0"
                >
                  现价：{{ item.realPrice }}元
                </div>
                <div
                  style="font-size: 16px; color: red"
                  v-if="item.hasSpec === 1"
                >
                  现价：{{ item.minPrice }}元 - {{ item.maxPrice }}元
                </div>
              </div>
            </div>
          </div>
          <div>
            <a @click="deleteGoods(item.id)">删除</a>
            <a
              style="margin-left: 20px"
              @click="editGoodsModalShow = item.id"
              v-if="item.type === 1"
              >编辑</a
            >
          </div>
        </div>
      </div>
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
    <chooseGoodsModal
      v-if="chooseGoodsModalShow"
      :modalShow="chooseGoodsModalShow"
      @ok="chooseGoodsOk"
      @cancel="chooseGoodsCancel"
    />
    <editGoodsModal
      v-if="editGoodsModalShow"
      :modalShow="editGoodsModalShow"
      @ok="editGoodsOk"
      @cancel="editGoodsCancel"
    />
  </div>
</template>

<script>
import chooseGoodsModal from "../components/chooseGoodsModal.vue";
import editGoodsModal from "../components/editGoodsModal.vue";
import Tooltip from "../../../components/Tooltip.vue";
import api from "../../../api/api";
export default {
  name: "goodsSetting",
  components: {
    chooseGoodsModal,
    editGoodsModal,
    Tooltip,
  },
  data() {
    return {
      loading: false,
      dataList: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      chooseGoodsModalShow: false, // 选择商品弹窗显示
      editGoodsModalShow: false, // 添加商品或者编辑商品 添加是'add',编辑是对应的id
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.loading = true;
      api
        .shopListPageJson({
          zbId: this.$route.query.zbId,
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
    sizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      this.getDataList();
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      this.getDataList();
    },
    // 删除
    deleteGoods(id) {
      console.log(id);
      const that = this;
      this.$confirm({
        title: "删除",
        content: `是否删除当前商品？`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          api
            .shopDelJson({
              id,
            })
            .then((res) => {
              that.$message.success("删除成功");
              that.getDataList();
            });
        },
      });
    },
    chooseGoods(){
      api.shopQueryOrg().then((res)=>{
        console.log(res);
        if(res.status) {
          this.chooseGoodsModalShow = true
        }
      })
    },
    //选择商品ok
    chooseGoodsOk(shopIds) {
      console.log(shopIds);
      api
        .shopSaveShop({
          zbId: this.$route.query.zbId,
          shopIds,
        })
        .then((res) => {
          if (res.status) {
            this.$message.success("选择成功");
            this.chooseGoodsCancel();
            this.getDataList();
          }
        });
    },
    chooseGoodsCancel() {
      this.chooseGoodsModalShow = false;
    },
    //添加商品或者编辑商品ok
    editGoodsOk(value) {
      console.log(value);
      api
        .shopSaveJson({
          ...value,
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          if (res.status) {
            this.$message.success("保存成功");
            this.editGoodsCancel();
            this.getDataList();
          }
        });
    },
    editGoodsCancel() {
      this.editGoodsModalShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.goods-setting {
  .tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .list-wrap {
    margin: 20px 0;
    max-height: calc(100vh - 280px);
    overflow: auto;
    padding-right: 10px;
    .list-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      justify-content: space-between;
      padding: 10px;
      &:hover{
        background: #e6f7ff;
      }
      .left {
        display: flex;
        .list-item-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
