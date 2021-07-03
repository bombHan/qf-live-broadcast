<template>
  <a-modal
    :maskClosable="false"
    title="分享"
    v-if="!!shareModalShow"
    :visible="!!shareModalShow"
    @cancel="cancel"
    :footer="false"
    width="350px"
  >
    <div>
      <div style="line-height: 30px">直播网址：</div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          word-break: break-all;
        "
      >
        {{ shareModalShow.str }}
        <a @click="copyStr" style="margin-left: 10px">复制</a>
      </div>
      <div style="margin: 10px 0">二维码：</div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div style="width: 110px; height: 110px" ref="qrCode"></div>
        <a-button
          @click="downloadQRcode"
          style="margin-left: 20px"
          type="primary"
          >下载二维码</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script>
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";

export default {
  name: "shareModal",
  props: {
    shareModalShow: {
      type: [Boolean, Object],
      default: false,
      required: false,
    },
  },
  data() {
    return {};
  },
  created() {
    setTimeout(() => {
      this.bindQRCode();
    }, 100);
  },
  methods: {
    // 复制链接
    copyStr() {
      this.$utils.copyString(this.shareModalShow.str);
    },
    bindQRCode() {
      console.log(this.shareModalShow.str, this.$refs.qrCode);
      new QRCode(this.$refs.qrCode, {
        text: this.shareModalShow.str,
        width: 110,
        height: 110,
        colorDark: "#333333", // 二维码颜色
        colorLight: "#ffffff", // 二维码背景色
        correctLevel: QRCode.CorrectLevel.L, // 容错率，L/M/H
      });
    },
    // 下载二维码
    downloadQRcode() {
      html2canvas(this.$refs.qrCode, {
        useCORS: true, // 允许跨域
        backgroundColor: "#fff",
        width: 110,
        height: 110,
      }).then((canvas) => {
        setTimeout(() => {
          var imgData = canvas.toDataURL("image/jpeg");
          this.$utils.downloadByBlob(imgData, "分享二维码图片");
        }, 1000);
      });
    },
    cancel() {
      this.$emit('cancel')
    }
  },
};
</script>

<style lang='less' scoped>
</style>

