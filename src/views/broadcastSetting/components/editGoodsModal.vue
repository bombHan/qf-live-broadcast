<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :visible="modalShow !== false"
    @cancel="cancel"
    @ok="ok"
    class="edit-goods-modal"
  >
    <a-spin :spinning="loading">
      <a-form-model :model="formData" ref="form">
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="商品名称"
          prop="name"
          :rules="[{ required: true, message: '请填写商品名称' }]"
        >
          <a-input v-model.trim="formData.name" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="商品原价"
          prop="oldPrice"
        >
          <a-input-number
            v-model="formData.oldPrice"
            style="width: 100%"
            :min="0"
            :precision="2"
          /><span style="position: absolute; right: -20px">元</span>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="商品现价"
          prop="nowPrice"
          :rules="[{ required: true, message: '请填写商品现价' }]"
        >
          <a-input-number
            v-model="formData.nowPrice"
            style="width: 100%"
            :min="0"
            :precision="2"
          /><span style="position: absolute; right: -20px">元</span>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="商品简介"
        >
          <a-input v-model="formData.shopDesc" :maxLength="50" />
        </a-form-model-item>
        <a-spin :spinning="uploading">
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
            label="商品图片"
            prop="shopUrls"
            :rules="[{ required: true, message: '请上传商品图片' }]"
            extra="支持jpg、png格式，推荐尺寸750*620，最大不超过2MB，最多可上传5张图片"
          >
            <div style="display: flex; algin-items: center; flex-wrap: wrap">
              <div
                v-for="(item, index) in formData.shopUrls"
                :key="index"
                style="position: relative"
              >
                <a-icon
                  style="
                    fontsize: 18px;
                    position: absolute;
                    right: 15px;
                    top: -5px;
                  "
                  type="close-circle"
                  @click="deleteShopImg(item)"
                />
                <img
                  :src="item"
                  alt="img"
                  style="height: 100px; width: 100px; margin: 0 20px 10px 0"
                />
              </div>
              <a-upload
                listType="picture-card"
                name="file"
                :beforeUpload="beforeUploadLimit"
                :showUploadList="false"
                accept=".png,.jpg,.jpeg,.gif"
                @change="shopPicChange"
                action="/v9.0/fileupload/file"
                style="width: 110px"
                v-if="formData.shopUrls.length < 5"
              >
                <div
                  style="
                    width: 85px;
                    height: 85px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  "
                >
                  <a-icon type="plus" />
                  <div class="ant-upload-text">点击上传</div>
                </div>
              </a-upload>
            </div>
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
            label="商品详情"
            prop="detailUrls"
            :rules="[{ required: true, message: '请上传商品详情图片' }]"
            extra="支持jpg、png格式，推荐尺寸750*620，最大不超过2MB，最多可上传5张图片"
          >
            <div style="display: flex; algin-items: center; flex-wrap: wrap">
              <div
                v-for="(item, index) in formData.detailUrls"
                :key="index"
                style="position: relative"
              >
                <a-icon
                  style="
                    fontsize: 18px;
                    position: absolute;
                    right: 15px;
                    top: -5px;
                  "
                  type="close-circle"
                  @click="deleteDetailImg(item)"
                />
                <img
                  :src="item"
                  alt="img"
                  style="height: 100px; width: 100px; margin: 0 20px 10px 0"
                />
              </div>
              <a-upload
                listType="picture-card"
                name="file"
                :beforeUpload="beforeUploadLimit"
                :showUploadList="false"
                accept=".png,.jpg,.jpeg,.gif"
                @change="detailPicChange"
                action="/v9.0/fileupload/file"
                style="width: 110px"
                v-if="formData.detailUrls.length < 5"
              >
                <div
                  style="
                    width: 85px;
                    height: 85px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  "
                >
                  <a-icon type="plus" />
                  <div class="ant-upload-text">点击上传</div>
                </div>
              </a-upload>
            </div>
          </a-form-model-item>
        </a-spin>
         <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="跳转链接"
          prop="jumpUrl"
          :rules="[{ required: true, message: '请填写跳转链接' },{ validator: validateUrl, trigger: ['change', 'blur'] }]"
        >
          <a-input v-model.trim="formData.jumpUrl" :maxLength="40" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "editGoodsModal",
  props: {
    modalShow: {
      type: [String, Boolean],
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "添加商品",
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      uploading: false,
      formData: {
        name: null,
        oldPrice: null,
        nowPrice: null,
        shopDesc: null,
        shopUrls: [],
        detailUrls: [],
        jumpUrl: null,
      },
    };
  },
  created() {
    if (this.modalShow !== "add") {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.loading = true;
      this.formData.id = this.modalShow;
      api.shopInfoJson({
        id: this.modalShow
      }).then((res) => {
        this.formData = res.bean;
        this.loading = false;
      })
      
    },
    // 删除商品图片
    deleteShopImg(src) {
      this.formData.shopUrls = this.formData.shopUrls.filter((item) => {
        return item !== src;
      });
      this.$refs.form.validateField("shopUrls");
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
    // 商品图片上传
    shopPicChange(info) {
      console.log(info);
      if (info.file.status === "done") {
        if(info.file.response.status) {
          this.formData.shopUrls.push(info.file.response.data.url);
        } else {
          this.$message.error(info.file.response.errorMsg);
        }
        this.uploading = false;
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      this.$refs.form.validateField("shopUrls");
      console.log(this.formData);
    },
    // 删除商品详情图片
    deleteDetailImg(src) {
      this.formData.detailUrls = this.formData.detailUrls.filter((item) => {
        return item !== src;
      });
      this.$refs.form.validateField("detailUrls");
    },
    // 商品详情图片上传
    detailPicChange(info) {
      console.log(info);
      if (info.file.status === "done") {
        this.formData.detailUrls.push(info.file.response.data.url);
        this.uploading = false;
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      this.$refs.form.validateField("detailUrls");
      console.log(this.formData);
    },
    // 点击确定
    ok() {
      // console.log("okokokokok");
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("ok", this.formData);
        }
      });
    },
    // 点击取消
    cancel() {
      this.$emit("cancel");
    },
    // 网址校验
    validateUrl(rule, value, callback) {
      const flag = this.$utils.IsURL(value);
      if(flag) {
        callback();
      } else {
        callback('输入网址格式有误');
      }
    }
  },
};
</script>

<style lang="less">
.edit-goods-modal {
}
</style>
