<template>
  <div class="interact-infomation">
    <div class="title">
      <!-- <div class="title-item">
        <img src="../../../assets/img/表单.jpg" class="icon" />
        <div class="text">表单</div>
      </div>
      <div class="title-item">
        <img src="../../../assets/img/投票.jpg" class="icon" />
        <div class="text">投票</div>
      </div> -->
      <div class="title-item">
        <img src="../../../assets/img/抽奖.jpg" class="icon" />
        <div class="text">抽奖</div>
      </div>
      <!-- <div class="title-item">
        <img src="../../../assets/img/调查问卷.jpg" class="icon" />
        <div class="text">调查问卷</div>
      </div> -->
    </div>
    <a-spin :spinning="loading">
      <div class="content" v-if="dataList.length > 0">
        <template v-for="(item, index) in dataList">
          <div class="content-item" :key="index" v-if="item.type === 1">
            <div
              class="content-item-title"
              :style="`background:url(${require('../../../assets/img/抽奖.jpg')}) no-repeat;`"
            >
              抽奖 - {{ item.interactName }}
            </div>
            <div class="content-item-content">
              <span style="font-weight: bold">{{ item.joinNum }}</span>
              <span style="font-size: 14px; margin-left: 5px">人</span>
            </div>
            <div class="content-item-bottom">
              <a @click="download(item)">下载详情</a>
            </div>
          </div>
        </template>
      </div>
      <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else></a-empty>
    </a-spin>

    <div style="display: flex; flex-direction: row-reverse">
      <a-pagination
        :showTotal="(total) => `共 ${pagination.total} 条`"
        showSizeChanger
        showQuickJumper
        :pageSizeOptions="['9']"
        @change="pagerChange"
        @showSizeChange="sizeChange"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        :current="pagination.pageNum"
        style="margin-top: 20px"
      />
    </div>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "interactInfomation",
  data() {
    return {
      dataList: [],
      pagination: {
        pageSize: 9,
        pageNum: 1,
        total: null,
      },
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      console.log("列表请求参数", this.filterObj);
      this.loading = true;
      api
        .interactCollectListPage({
          ...this.filterObj,
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log("互动信息收集", res.data);
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
    // 下载
    download(item) {
      if (item.type === 1) {
        this.$utils.exportExcel("/zb/prizeVisit/getPrizeVisitExcel", {
          prizeId: item.interactId,
        });
      }
    },
  },
};
</script>

<style lang='less' scoped>
.interact-infomation {
  .title {
    display: flex;
    margin-bottom: 20px;
    .title-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .icon {
        display: block;
        height: 10px;
        width: 10px;
        margin-right: 5px;
      }
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .content-item {
      width: 30%;
      margin-right: 3%;
      margin-bottom: 25px;
      height: 170px;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      .content-item-title {
        padding: 15px 0;
        text-align: center;
        color: #fff;
        font-size: 16px;
        margin: 0;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      .content-item-content {
        padding: 25px 0;
        text-align: center;
        font-size: 18px;
      }
      .content-item-bottom {
        text-align: center;
      }
    }
  }
}
</style>
