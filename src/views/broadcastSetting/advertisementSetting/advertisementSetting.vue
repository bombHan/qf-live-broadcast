<template>
  <div class="advertisement-setting">
    <div class="left">
      <a-spin :spinning="loading">
        <div style="display: flex; align-items: center">
          <a-switch
            v-model="advSet"
            style="margin-right: 20px"
            @change="advertisementOpenChange"
            :disabled="dataList.length === 0 && !advSet"
            :title="dataList.length === 0 && !advSet ? '需要添加图片才能开启' : ''"
          />
          需要添加图片才能开启，在直播中添加广告图轮播，抢占访客视觉焦点
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0;
          "
        >
          <div>只能显示五个广告图轮播</div>
          <a-button @click="openModal" :disabled="dataList.length > 4" ghost type="primary"> 添加图片 </a-button>
        </div>
        <a-table
          :columns="columns"
          :dataSource="dataList"
          :rowKey="record => record.advertisingId"
          :pagination="false"
        >
          <template slot="photoUrl" slot-scope="key">
            <img :src="key" alt="photoUrl" style="width: 120px; height: 50px">
          </template>
          <template slot="action" slot-scope="key,item">
            <a @click="openModal(item)">编辑</a>
            <a style="margin-left: 15px" @click="deleteAdvertisement(item)">删除</a>
          </template>
        </a-table>
      </a-spin>
    </div>
    <div class="right">
      <div style="text-align: center; margin-bottom: 10px">预览效果</div>
      <img v-if="advSet" src="../../../assets/img/advertisement_open.png" alt="">
      <img v-else src="../../../assets/img/advertisement_close.png" alt="">
    </div>
    <a-modal
      :maskClosable="false"
      :title="formData.advertisingId ? '编辑图片' : '添加图片'"
      v-if="modalShow"
      :visible="modalShow"
      @cancel="modalCancel"
      @ok="modalOk"
      class="advertisement-modal"
    >
      <a-form-model :model="formData" ref="modalForm">
        <a-spin :spinning="uploading">
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="广告图"
            prop="photoUrl"
            :rules="[{ required: true, message: '请上传广告图' }]"
            extra="推荐尺寸：100px*200px，限制格式jpg、gif、png，大小不超过1m。"
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
                v-if="formData.photoUrl"
                :src="formData.photoUrl"
                alt="pic"
                style="width: 200px; height: 100px"
              />
              <div
                v-else
                style="
                  width: 200px;
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
          <a-form-model-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
            label="跳转链接"
            prop="advertisingUrl"
            :rules="[{ validator: validateUrl, trigger: ['change', 'blur'] }]"
          >
            <a-input v-model="formData.advertisingUrl" :maxLength="40"/>
          </a-form-model-item>

        </a-spin>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "advertisementSetting",
  data() {
    return {
      loading: false,
      advSet: false,
      dataList: [],
      columns: [
        {
          title: "广告图",
          dataIndex: "photoUrl",
          scopedSlots: { customRender: "photoUrl" },
        },
        {
          title: "跳转连接",
          dataIndex: "advertisingUrl",
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      modalShow: false,
      formData: {
        photoUrl: "",
        advertisingUrl: "",
      },
      uploading: false, // 图片上传
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取列表和开关状态
    getData() {
      this.loading = true;
      api
        .advertisingList({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log(res);
          this.advSet = res.list.advSet === 1;
          this.dataList = res.list.list;
          this.loading = false;
        });
    },
    // 开关切换接口
    advertisementOpenChange(value) {
      console.log(value);
      api
        .saveAdvSwitchSet({
          zbId: this.$route.query.zbId,
          advSet: this.advSet ? 1 : 2,
        })
        .then((res) => {
          if (res.status) {
            this.$message.success("更改成功");
          }
          this.getData();
        });
    },
    // 打开添加图片或者编辑图片弹窗
    openModal(target) {
      if (target) {
        this.formData = {
          advertisingId: target.advertisingId,
          photoUrl: target.photoUrl,
          advertisingUrl: target.advertisingUrl,
        };
      } else {
        this.formData = {
          photoUrl: "",
          advertisingUrl: "",
        };
      }
      this.modalShow = true;
    },
    // 图片上传前限制条件
    beforeUploadLimit(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file)
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
      if(isLt2M && fileType) {
        this.uploading = true;
      }
      return isLt2M && fileType;
    },
    // 图片上传
    handleChange(info) {
      console.log(info);
      if (info.file.status === "done") {
        this.formData.photoUrl = info.file.response.data.url;
        this.uploading = false;
      }
      if (info.file.status === "error") {
        this.$message.error("上传出错");
        this.uploading = false;
      }
      console.log(this.formData);
    },
    // 弹窗确定
    modalOk() {
      this.$refs.modalForm.validate((valid) => {
        if (valid) {
          console.log(this.formData);

          api.advertisingSaveOrUpdate({
            ...this.formData,
            zbId: this.$route.query.zbId,
          }).then((res) => {
            console.log(res);
            if(res.status) {
              this.$message.success('保存成功')
              this.modalCancel();
              this.getData()
            } else {
              this.$message.error(res.errorMsg)
            }
          })
        }
      });
    },
    // 弹窗取消
    modalCancel() {
      this.modalShow = false;
      this.formData = {
        photoUrl: "",
        advertisingUrl: "",
      };
    },
    // 删除
    deleteAdvertisement(item) {
      console.log(item);
      const that = this;
      this.$confirm({
        title: '删除',
        content: `是否删除当前广告？`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          api.advertisingDel({
            advertisingId: item.advertisingId
          }).then((res) => {
            that.$message.success('删除成功')
            that.getData()
          })
        },
      });
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

<style lang="less" scoped>
.advertisement-setting {
  display: flex;
  height: 100%;
  .left {
    width: calc(100% - 320px);
    padding-right: 40px;
  }
  .right {
    width: 320px;
  }
}
</style>
