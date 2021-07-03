<template>
  <a-modal
    :maskClosable="false"
    title="创建直播"
    v-if="createModalShow"
    :visible="createModalShow"
    @cancel="createModalCancel"
    @ok="createModalOk"
    :confirmLoading="confirmLoading"
  >
    <a-form-model :model="createFormData" ref="createForm">
      <a-form-model-item
        label="直播名称"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="[{ required: true, message: '请输入直播名称' }]"
        prop="zbName"
      >
        <a-input
          :maxLength="10"
          v-model.trim="createFormData.zbName"
          placeholder="请填写直播名称"
        />
      </a-form-model-item>
      <a-form-model-item
        label="预计开播时间"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="[{ required: true, message: '请选择预计开播时间' }]"
        prop="expectStartTime"
      >
        <a-date-picker
          format="YYYY-MM-DD HH:mm"
          :show-time="{ format: 'hh:mm' }"
          placeholder="请选择预计开播时间"
          v-model="createFormData.expectStartTime"
          style="width: 100%"
        />
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
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
              v-if="createFormData.picUrl"
              :src="createFormData.picUrl"
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
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-textarea
          :maxLength="28"
          v-model="createFormData.zbDesc"
          placeholder="请输入简介"
          :autoSize="{ minRows: 4, maxRows: 4 }"
        />
      </a-form-model-item>
      <a-form-model-item
        label="可选范围"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        style="margin: 0"
      >
        <a-radio-group
          v-model="createFormData.isVisible"
          @change="createFormData.visibles = []"
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
              v-if="createFormData.isVisible === 2"
              label=""
              :colon="false"
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :rules="[{ required: true, message: '请选择人员' }]"
              prop="visibles"
            >
              <a-tree-select
                v-model="createFormData.visibles"
                style="width: 100px"
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
              v-if="createFormData.isVisible === 2"
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
  </a-modal>
</template>

<script>
import api from "../../../api/api";
import moment from "moment";
import { mapState } from "vuex";
export default {
  name: "addBroadcast",
  props: {
    createModalShow: {
      // 创建直播弹窗显示隐藏
      type: Boolean || Object,
      default: false,
      required: true,
    },
    confirmLoading: {
      // 创建直播确定按钮loading
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      treeData: [], // 可选择人的树状结构
      uploading: false,
      createFormData: {
        zbName: "",
        expectStartTime: moment().add(1, "day"),
        zbDesc: "",
        isVisible: 1, // 1全部可见2指定可见
        visibles: [],
        picUrl: null,
      },
    };
  },
  computed: {
    ...mapState({
      picUrl: (state) => state.picUrl,
    }),
  },
  created() {
    this.getTreeData();
    this.createFormData.picUrl = this.picUrl
  },
  methods: {
    // 关闭弹窗
    createModalCancel() {
      this.$emit("createModalCancel");
    },
    createModalOk() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.$emit("createModalOk", this.createFormData);
        }
      });
    },
    // 获取人员树
    getTreeData() {
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
        this.createFormData.picUrl = info.file.response.data.url;
        setTimeout(() => {
          this.uploading = false;
        }, 600);
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      this.$refs.createForm.validateField("picUrl");
      console.log(this.createFormData);
    },
  },
};
</script>

<style lang='less' scoped>
.add-broadcast {
}
</style>
