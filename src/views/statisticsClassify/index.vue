<template>
  <div class="statistics-classify">
    <a-spin :spinning="loading">
      <div class="menu">
        <div class="menu-title">
          <img
            src="../../assets/img/统计分类.png"
            style="margin-right: 10px"
          />统计分类
        </div>
        <div
          v-for="item in menuList"
          :key="item.key"
          :class="
            currentMenu.key === item.key
              ? 'menu-item active-menu-item'
              : 'menu-item'
          "
          @click="changeMenu(item)"
        >
          <img :src="item.img" class="img" />
          <img :src="item.hoverImg" class="hover-img" />
          <img :src="item.activeImg" class="active-img" />
          {{ item.name }}
        </div>
      </div>
      <div class="content">
        <div style="padding: 20px">
          <div class="content-content">
            <dataStatistics v-if="currentMenu.key === '1'"/>
            <effectStatistics v-if="currentMenu.key === '2'"/>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import api from "../../api/api";
import dataStatistics from './dataStatistics/dataStatistics.vue'
import effectStatistics from './effectStatistics/effectStatistics.vue'
export default {
  name: "statisticsClassify",
  components: {
    dataStatistics,
    effectStatistics,
  },
  data() {
    return {
      loading: false,
      menuList: [
        {
          name: "直播数据统计",
          key: "1",
          img: require("../../assets/img/数据统计.png"),
          hoverImg: require("../../assets/img/数据统计hover.png"),
          activeImg: require("../../assets/img/数据统计active.png"),
        },
        {
          name: "直播效果统计",
          key: "2",
          img: require("../../assets/img/效果统计.png"),
          hoverImg: require("../../assets/img/效果统计hover.png"),
          activeImg: require("../../assets/img/效果统计active.png"),
        },
      ],
      currentMenu: { name: "直播数据统计", key: "1" },
    };
  },
  created() {},
  methods: {
    // 切换菜单
    changeMenu(item) {
      if (item.key !== this.currentMenu.key) {
        this.currentMenu = item;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.statistics-classify {
  height: 100vh;
  position: relative;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    border-bottom: 1px solid #ccc;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;
    z-index: 999;
  }
  .menu {
    position: fixed;
    top: 0px;
    left: 0;
    bottom: 0;
    width: 180px;
    border-right: 1px solid #ccc;
    background: #fff;
    overflow: auto;
    .menu-title {
      padding-top: 20px;
      margin-bottom: 10px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
    }
    .menu-item {
      padding: 15px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      .img,
      .active-img,
      .hover-img {
        margin-right: 10px;
      }
      .active-img,
      .hover-img {
        display: none;
      }
      &:hover {
        color: #51abff;
        .img,
        .active-img {
          display: none;
        }
        .hover-img {
          display: block;
        }
      }
    }
    .active-menu-item {
      color: #1890ff;
      .img,
      .hover-img {
        display: none;
      }
      .active-img {
        display: block;
      }
    }
  }
  .content {
    height: 100vh;
    padding: 0px 0 0 180px;
    background: #fff;
    overflow: auto;
  }
}
</style>
