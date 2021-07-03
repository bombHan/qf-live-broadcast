<template>
  <div class="basic-setting">
    <a-form-model :model="formData" ref="form">
      <a-form-model-item
        label="直播名称"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        :rules="[{ required: true, message: '请输入直播名称' }]"
        prop="zbName"
      >
        <a-input
          :maxLength="10"
          v-model.trim="formData.zbName"
          placeholder="请填写直播名称"
        />
      </a-form-model-item>
      <a-form-model-item
        label="预计开播时间"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        :rules="[{ required: true, message: '请选择预计开播时间' }]"
        prop="expectStartTime"
      >
        <a-date-picker
          format="YYYY-MM-DD HH:mm"
          :show-time="{ format: 'hh:mm' }"
          placeholder="请选择预计开播时间"
          v-model="formData.expectStartTime"
          style="width: 100%"
        />
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        label="直播封面"
        prop="picUrl"
        :rules="[{ required: true, message: '请上传直播封面' }]"
      >
        <a-spin :spinning="uploading">
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
              v-if="formData.picUrl"
              :src="formData.picUrl"
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
        </a-spin>
      </a-form-model-item>
      <a-form-model-item
        label="直播简介"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-textarea
          :maxLength="28"
          v-model="formData.zbDesc"
          placeholder="请输入简介"
          :autoSize="{ minRows: 4, maxRows: 4 }"
        />
      </a-form-model-item>
      <a-form-model-item
        label="可选范围"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        style="margin: 0"
      >
        <a-radio-group
          v-model="formData.isVisible"
          @change="formData.visibles = []"
        >
          <div style="display: flex; align-items: center">
            <div
              v-for="(item, index) in $dictionary.visRange"
              :key="index"
              style="margin-bottom: 24px"
            >
              <a-radio :value="item.value">{{ item.label }}</a-radio>
            </div>
            <a-form-model-item
              v-if="formData.isVisible === 2"
              label=""
              :colon="false"
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :rules="[{ required: true, message: '请选择人员' }]"
              prop="visibles"
            >
              <a-tree-select
                v-model="formData.visibles"
                style="width: 170px"
                :tree-data="treeData"
                tree-checkable
                search-placeholder="请选择"
                :maxTagCount="1"
                :replaceFields="{
                  children: 'children',
                  title: 'text',
                  key: 'id',
                  value: 'id',
                }"
              />
            </a-form-model-item>
            <div
              v-if="formData.isVisible === 2"
              style="margin-bottom: 24px; margin-left: 10px"
            >
              <a-tooltip>
                <template slot="title"
                  >选择用户才可添加自己的客户到该场直播中</template
                >
                <a-icon
                  type="question-circle"
                  style="font-size: 16px; color: #1890ff"
                />
              </a-tooltip>
            </div>
          </div>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <a-button
      @click="save"
      style="display: block; margin: 0 auto"
      type="primary"
      :disabled="info.zbState > 1"
      :title="info.zbState > 1 ? '只有在直播未开始状态下才可保存': ''"
      >保存</a-button
    >
  </div>
</template>

<script>
import moment from "moment";
import api from "../../../api/api";
export default {
  name: "basicSetting",
  data() {
    return {
      treeData: [], // 可选择人的树状结构
      uploading: false,
      formData: {
        zbName: "",
        expectStartTime: null,
        zbDesc: "",
        isVisible: 1, // 1全部可见2指定可见
        visibles: [],
      },
    };
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
      requried: false,
    },
  },
  created() {
    this.getData();
    this.getPerson();
  },
  methods: {
    getData() {
      api.roomZbInfo({ zbId: this.$route.query.zbId }).then((res) => {
        console.log(res);
        this.formData = {
          ...res.result,
          expectStartTime: moment(res.result.expectStartTime),
        };
      });
    },
    getPerson() {
      api.orgGroupGet_all_sale_user_json().then((res) => {
        console.log(res);
        this.treeData = res;
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
        this.formData.picUrl = info.file.response.data.url;
        this.uploading = false;
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      this.$refs.form.validateField("picUrl");
      console.log(this.formData);
    },
    // 保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.formData);
          api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
            if (res.data.zbState && res.data.zbState === 1) {
              api
                .isExistName({
                  zbName: this.formData.zbName,
                  zbId: this.$route.query.zbId,
                })
                .then((res) => {
                  console.log(res);
                  if (res.status) {
                    api
                      .inputAndUpdZb({
                        ...this.formData,
                        zbId: this.$route.query.zbId,
                        expectStartTime: moment(
                          this.formData.expectStartTime
                        ).format("YYYY-MM-DD HH:mm:00"),
                      })
                      .then((res) => {
                        console.log(res);
                        if (res.status) {
                          this.$message.success("保存成功");
                          this.getData();
                        } else {
                          this.$message.error("保存失败");
                        }
                      });
                  } else {
                    this.$message.error("该直播名称已存在");
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              this.$message.error("直播已开始，无法保存");
              this.$parent.$parent.getInfo();
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.basic-setting {
}
</style>
