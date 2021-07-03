<template>
  <div ref="whole" class="back">
    <!-- <div class="layout-header">
      <div class="layout-header-logo" @click="clickLogo">
        <img src="../../assets/images/logo1.png" />
        <span style="font-weight: bold">直播页面</span>
      </div>
      <div class="layout-header-right">
        <a-avatar
          style="vertical-align: top; backgroundcolor: rgb(50, 150, 250)"
          icon="user"
        />
        <a-button class="color51" style="padding: 0 5px" type="link">{{
          info.name
        }}</a-button>
      </div>
    </div> -->
    <div class="layout-main">
      <!-- <div class="page-title" v-if="isBack || breadTitle">
        <a-button type="link" v-if="isBack" @click="$router.go(-1)">
          <a-icon type="left" />
          <span style="margin-left: 2px">返回</span>
        </a-button>
        <span v-if="isBack" style="font-size: 14px; margin-right: 15px">|</span>
        <span style="font-size: 14px">{{ breadTitle }}</span>
      </div> -->

      <router-view />
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import api from "@/api/api";
export default {
  data() {
    return {
      isBack: false,
      breadTitle: "",
      info: {},
    };
  },
  created() {
    // 匹配标题
    const meta = this.$route.meta;
    this.isBack = meta.isBack;
    this.breadTitle = meta.breadTitle;
    this.getInfo();
  },
  methods: {
    getInfo() {
      // api.getUserInfo().then((res) => {
      //   console.log(res);
      //   this.info = res
      // })
      api.zbCodesJson().then((res) => {
        console.log('获取到创建直播默认图片',res.data.zbInsertImgUrl[0].keyValue);
        this.$store.commit('updatePicUrl', res.data.zbInsertImgUrl[0].keyValue)
      })
    },
    clickLogo() {
      // 截图当前整个页面并且下载
      // html2canvas(this.$refs.whole, {
      //   backgroundColor: "#ffffff"
      // }).then(canvas => {
      //   var imgData = canvas.toDataURL("image/jpeg");
      //   this.fileDownload(imgData);
      // });
    },
    fileDownload(downloadUrl) {
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = downloadUrl;
      aLink.download = "当前页截图.png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
  },
};
</script>
<style lang="less" scoped>
.back {
  .layout-header {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    height: 52px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 12px 1px rgba(42, 54, 70, 0.09);
    display: flex;
    align-items: center;
    padding: 0 10px;
    .layout-header-logo {
      flex: 1;
      img {
        height: 40px;
        padding-right: 10px;
      }
    }
    .layout-header-right {
      display: flex;
      align-items: center;
      height: 32px;
      .color51 {
        color: #333;
        cursor: default;
      }
    }
  }
  .layout-main {
    min-height: 100vh;
    box-sizing: border-box;
    // background: rgba(241, 242, 245, 1);
    background: #fff;
    .page-title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 600;
      color: rgba(77, 77, 77, 1);
      line-height: 38px;
    }
  }
}
</style>
<style lang="less">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #ffffff;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>