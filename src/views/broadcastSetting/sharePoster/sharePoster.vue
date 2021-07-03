<template>
  <div class="share-poster">
    <div class="left">
      <a-spin :spinning="loading">
        <a-form-model :model="formData" ref="form">
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="分享海报开关"
          >
            <a-switch v-model="formData.isOpen"></a-switch>
            <span style="margin-left: 10px"
              >开启后，观众可以在观看页面中生成分享海报，邀请好友观看</span
            >
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="封面背景"
            prop="backgroundUrl"
            :rules="[{ required: true, message: '请上传封面背景' }]"
            extra="建议300*520图片"
          >
            <a-spin :spinning="uploading" style="width: 120px; height: 170px">
              <a-upload
                listType="picture-card"
                name="file"
                :beforeUpload="beforeUploadLimit"
                :showUploadList="false"
                accept=".png,.jpg,.jpeg"
                @change="handleChange"
                action="/v9.0/fileupload/file"
                :loading="uploading"
              >
                <img
                  v-if="formData.backgroundUrl"
                  :src="formData.backgroundUrl"
                  alt="pic"
                  style="width: 100px; height: 150px"
                />
                <div
                  v-else
                  style="
                    width: 100px;
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  "
                >
                  <a-icon type="plus" />
                  <div class="ant-upload-text">点击上传</div>
                </div>
              </a-upload>
            </a-spin>
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="模板选择"
            prop="templateType"
            :rules="[{ required: true, message: '请选择模板' }]"
          >
            <a-radio-group v-model="formData.templateType" @change="bindQRCode">
              <a-radio :value="1"
                ><img src="../../../assets/img/template-2.png"
              /></a-radio>
              <a-radio :value="2">
                <img src="../../../assets/img/template-3.png" />
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="直播名称"
            prop="zbName"
            :rules="[{ required: true, message: '请填写直播名称' }]"
          >
            <a-input v-model="formData.zbName" :maxLength="10" />
          </a-form-model-item>
          <a-form-model-item
            label="预计开播时间"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-date-picker
              format="YYYY-MM-DD HH:mm"
              :show-time="{ format: 'hh:mm' }"
              placeholder="请选择预计开播时间"
              v-model="formData.zbTime"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="直播人"
          >
            <a-input v-model="formData.zbAcctName" :maxLength="10" />
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="直播简介"
          >
            <a-textarea
              v-model="formData.zbDesc"
              :maxLength="28"
              :rows="4"
              :autoSize="{ minRows: 4, maxRows: 4 }"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
      <a-row style="margin: 20px;">
        <a-col span="5"></a-col>
        <a-col span="16" style="display: flex; flex-direction: row-reverse"
          ><a-button type="primary" @click="save">保存</a-button></a-col
        >
      </a-row>
    </div>
    <div class="right">
      <div style="display: flex; flex-direction: row-reverse">
        <a-button @click="downloadPoster" ghost type="primary"
          >下载海报</a-button
        >
      </div>
      <div class="poster-wrap">
        <div class="poster" ref="poster">
          <div
            :style="
              formData.templateType === 1
                ? 'height: 300px; width: 300px; overflow: hidden'
                : 'height: 520px; width: 300px; overflow: hidden'
            "
          >
            <img :src="formData.backgroundUrl" alt="图片" ref="backgroundUrl" />
          </div>
          <div
            style="
              height: 200px;
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              text-align: center;
            "
            v-show="formData.templateType === 1"
          >
            <div style="font-size: 16px; margin-bottom: 10px">
              {{ formData.zbName }} 直播
            </div>
            <div
              v-show="formData.zbAcctName"
              style="color: #999; margin-bottom: 10px"
            >
              直播人：{{ formData.zbAcctName }}
            </div>
            <div
              v-show="formData.zbTime"
              style="color: #999; margin-bottom: 15px"
            >
              {{ moment(formData.zbTime).format("YYYY-MM-DD HH:mm") }}
            </div>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div style="width: 55px; height: 55px" ref="qrCode1"></div>
              <div
                style="
                  width: 100px;
                  text-align: left;
                  margin-left: 10px;
                  color: #999;
                  word-break: break-all;
                "
              >
                {{ formData.zbDesc }}
              </div>
            </div>
          </div>
          <div
            v-show="formData.templateType === 2"
            style="
              height: 200px;
              position: absolute;
              bottom: 0px;
              left: 30px;
              right: 30px;
              background: rgba(250, 250, 250, 0.7);
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
              text-align: center;
            "
          >
            <div
              style="width: 55px; height: 55px; margin: 30px auto"
              ref="qrCode2"
            ></div>
            <div
              style="
                width: 150px;
                color: #999;
                word-break: break-all;
                margin: 0 auto;
              "
            >
              {{ formData.zbDesc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/api";
import moment from "moment";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import axios from "axios";
export default {
  name: "share-poster",
  data() {
    return {
      moment,
      loading: false, // 获取信息loading
      uploading: false, // 图片上传loading
      formData: {
        postId: null,
        backgroundUrl: null,
        templateType: 1,
        zbName: "",
        zbTime: null,
        zbAcctName: "",
        zbDesc: "",
        isOpen: false,
        imgData: "",
      },
      zbUrl: "https://www.baidu.com/",
    };
  },
  mounted() {
    this.getData();
    this.getUrl();
  },
  methods: {
    getData() {
      this.loading = true;
      api.posterInfoJson({ zbId: this.$route.query.zbId }).then((res) => {
        this.formData = {
          ...res.bean,
          isOpen: res.bean.isOpen === 0,
          zbTime: res.bean.zbTime ? moment(res.bean.zbTime) : null,
        };
        this.setBase64Image(this.formData.backgroundUrl, "backgroundUrl");
        console.log(this.formData);
        this.loading = false;
      });
    },
    getUrl() {
      api.roomShareUrl({ zbId: this.$route.query.zbId }).then((re) => {
        console.log("分享的直播地址信息", re);
        this.zbUrl = re.shareUrl;
        setTimeout(() => {
          this.bindQRCode();
        }, 100);
      });
    },
    // 图片上传前限制条件
    beforeUploadLimit(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file);
      const fileType = file.type === "image/jpeg" || file.type === "image/png";
      if (!fileType) {
        this.$message.error("图片格式必须是jpg/png");
      }
      if (!isLt2M) {
        this.$message.error("图片大小必须小于2M!");
      }
      if (isLt2M && fileType) {
        this.uploading = true;
      }
      return isLt2M && fileType;
    },
    // 图片上传
    handleChange(info) {
      console.log(info);
      if (info.file.status === "done") {
        this.formData.backgroundUrl = info.file.response.data.url;
        this.uploading = false;
        this.setBase64Image(this.formData.backgroundUrl, "backgroundUrl");
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      this.$refs.form.validateField("backgroundUrl");
      console.log(this.formData);
    },
    // 将跨域图地址转成base64地址这样html2canvas的时候不会报错
    setBase64Image(url, ref) {
      console.log(url);
      // url =
      //   "https://ylhslytest.oss-cn-hangzhou.aliyuncs.com/20201104/5e9621a7cb5044b5903020aa6c041801.jpg";
      var image = new Image();
      image.src = url + "?v=" + Math.random(); // 处理缓存
      image.crossOrigin = "*"; // 支持跨域图片

      image.onload = () => {
        let base64 = this.$utils.drawBase64Image(image);
        this.$refs[ref].src = base64;
      };
    },
    // 保存表单
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.formData);
          html2canvas(this.$refs.poster, {
            useCORS: true, // 允许跨域
            backgroundColor: "#fff",
            width: 300,
            height: 520,
          }).then((canvas) => {
            setTimeout(() => {
              const bas64Str = canvas.toDataURL("image/jpeg");
              api
                .postersaveJson({
                  ...this.formData,
                  zbId: this.$route.query.zbId,
                  isOpen: this.formData.isOpen ? 0 : 1, // 开启是0 关闭是1
                  zbTime: this.formData.zbTime
                    ? moment(this.formData.zbTime).format("YYYY-MM-DD HH:mm:00")
                    : null,
                  bas64Str,
                })
                .then((res) => {
                  if (res.status) {
                    this.$message.success("保存成功");
                    this.getData();
                  } else {
                    this.$message.error("保存失败");
                  }
                });
            }, 100);
          });
        }
      });
    },
    // 下载海报
    downloadPoster() {
      html2canvas(this.$refs.poster, {
        useCORS: true, // 允许跨域
        backgroundColor: "#fff",
        width: 300,
        height: 520,
      }).then((canvas) => {
        setTimeout(() => {
          var imgData = canvas.toDataURL("image/jpeg");
          // console.log(imgData);
          this.$utils.downloadByBlob(imgData, "分享海报");
        }, 100);
      });
    },
    // 上传海报图片文件
    uploadPoster() {
      html2canvas(this.$refs.poster, {
        useCORS: true, // 允许跨域
        backgroundColor: "#fff",
        width: 300,
        height: 520,
      }).then((canvas) => {
        const imgurl = canvas.toBlob((blob) => {
          //以时间戳作为文件名 实时区分不同文件 按需求自己定义就好
          let filename = `分享海报.jpg`;
          //转换canvas图片数据格式为formData
          let file2 = new File([blob], filename, { type: "image/jpg" });
          let formData = new FormData();
          formData.append("file", file2);
          //将转换为formData的canvas图片 上传到服务器
          axios.post("/v9.0/fileupload/file", formData).then((res) => {
            //图片上传成功之后，再调用对应的其他接口，传递指定的参数
            console.log(res.data);
          });
        });
      });
    },
    // 生成二维码
    bindQRCode() {
      // console.log(this.$refs[`qrCode${this.formData.templateType}`]);
      this.$refs[`qrCode${this.formData.templateType}`].innerHTML = "";
      new QRCode(this.$refs[`qrCode${this.formData.templateType}`], {
        text: this.zbUrl,
        width: 55,
        height: 55,
        colorDark: "#333333", // 二维码颜色
        colorLight: "#ffffff", // 二维码背景色
        correctLevel: QRCode.CorrectLevel.L, // 容错率，L/M/H
      });
    },
  },
};
</script>

<style lang="less" scoped>
.share-poster {
  display: flex;
  height: 100%;
  .left {
    width: calc(100% - 320px);
    padding-right: 40px;
  }
  .right {
    width: 300px;
    .poster-wrap {
      margin-top: 20px;
      width: 300px;
      height: 520px;
      box-shadow: 0 0 10px #ccc;
      .poster {
        height: 100%;
        width: 100%;
        background: #fff;
        position: relative;
      }
    }
  }
}
</style>
