<template>
  <div class="qrcode-setting">
    <div class="left">
      <a-form-model :model="formData" ref="form">
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="是否开启二维码"
        >
          <a-switch v-model="formData.isOpen" />
          <span style="margin-left: 10px">放置二维码提醒用户扫码加群或关注微信公众号</span>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="引导关注设置"
        >
          <a-select v-model="formData.codeType">
            <a-select-option :value="1"> 关注公众号 </a-select-option>
            <a-select-option :value="2"> 扫码进群 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-spin :spinning="uploading" style="height: 125px">
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="上传二维码"
            prop="codeUrl"
            :rules="[{ required: true, message: '请上传二维码' }]"
          >
            <a-upload
              listType="picture-card"
              name="file"
              :beforeUpload="beforeUploadLimit"
              :showUploadList="false"
              accept=".png,.jpg,.jpeg,.gif"
              @change="handleChange"
              action="/v9.0/fileupload/file"
            >
              <img
                v-if="formData.codeUrl"
                :src="formData.codeUrl"
                alt="pic"
                style="width: 100px; height: 100px"
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
          </a-form-model-item>
        </a-spin>
      </a-form-model>
      <a-button
        type="primary"
        @click="save"
        style="display: block; margin: 20px auto"
        >保存</a-button
      >
    </div>
    <div class="right">
      <div style="text-align: center; margin-bottom: 10px">预览效果</div>
      <img
        v-if="formData.codeType === 1"
        src="../../../assets/img/关注公众号.png"
        alt=""
      />
      <img v-else src="../../../assets/img/扫码进群.png" alt="" />
      <img
        :src="formData.codeUrl"
        alt=""
        v-if="formData.codeUrl"
        class="qrcode"
      />
    </div>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "qrcodeSetting",
  data() {
    return {
      uploading: false,
      formData: {
        isOpen: false,
        codeType: 1,
        codeUrl: null,
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      api
        .qrcodeInfoJson({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log(res);
          this.formData = {
            ...res.bean,
            isOpen: res.bean.isOpen === 0,
          };
        });
    },
    // 图片上传前限制条件
    beforeUploadLimit(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file);
      const fileType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      if (!fileType) {
        this.$message.error("图片格式必须是jpg/png/gif");
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
        this.formData.codeUrl = info.file.response.data.url;
        this.uploading = false;
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      console.log(this.formData);
    },
    save() {
      console.log(this.formData);
      this.$refs.form.validate((valid) => {
        if (valid) {
          api
            .qrcodeSaveJson({
              ...this.formData,
              // codeId: this.formData.codeId,
              // codeType: ,
              // codeUrl: ,
              isOpen: this.formData.isOpen ? 0 : 1,
              zbId: this.$route.query.zbId,
            })
            .then((res) => {
              if (res.status) {
                this.$message.success("保存成功");
                this.getData();
              }
            });
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.qrcode-setting {
  display: flex;
  height: 100%;
  .left {
    width: calc(100% - 320px);
    padding-right: 40px;
    display: flex;
    flex-direction: column;
  }
  .right {
    width: 300px;
    position: relative;
    .qrcode {
      height: 100px;
      width: 100px;
      position: absolute;
      top: 215px;
      left: 102px;
    }
  }
}
</style>
