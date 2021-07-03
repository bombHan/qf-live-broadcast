<template>
  <div class="message-appointment">
    <a-spin :spinning="loading">
      <div style="margin-bottom: 20px">
        向预约客户发送短信提醒，仅给有电话号码的客户发送短信
      </div>
      <div style="display: flex; align-items: center">
        <a-switch
          v-model="switchSet"
          checked-children="开"
          un-checked-children="关"
        />
        <div style="margin: 0 10px">开播前</div>
        <a-select v-model="timeType" style="width: 100px">
          <a-select-option :value="1"> 3天 </a-select-option>
          <a-select-option :value="2"> 1天 </a-select-option>
          <a-select-option :value="3"> 3小时 </a-select-option>
          <a-select-option :value="4"> 2小时 </a-select-option>
          <a-select-option :value="5"> 1小时 </a-select-option>
          <a-select-option :value="6"> 30分钟 </a-select-option>
          <a-select-option :value="7"> 15分钟 </a-select-option>
        </a-select>
        <div style="margin: 0 10px">向预约客户发送短信</div>
        <a @click="modalShow = true">编辑短信内容</a>
      </div>
      <a-button
        type="primary"
        style="margin: 20px auto; display: block"
        @click="save"
        >保存</a-button
      >
    </a-spin>
    <a-modal
      :maskClosable="false"
      title="编辑短信内容"
      v-if="modalShow"
      :visible="modalShow"
      @cancel="modalShow = false"
      @ok="modalOk"
      width="760px"
    >
      <a-row style="margin-bottom: 20px">
        <a-col span="4" style="text-align: right">短信内容：</a-col>
        <a-col span="11" style="position: relative">
          <a-textarea
            v-model="smsContent"
            :maxLength="280 - (smsLabel || '').length"
            :rows="6"
            :autoSize="{ minRows: 6, maxRows: 6 }"
            placeholder="请输入短信内容"
          />
          <div
            style="position: absolute; bottom: 30px; right: 20px; color: #ccc"
          >
            {{ (smsContent || "").length + (smsLabel || "").length }} / 280
          </div>
          <div
            style="display: flex; flex-direction: row-reverse; margin-top: 5px"
          >
            <a @click="addLink">插入直播链接</a>
          </div>
        </a-col>
        <a-col span="9">
          <div
            style="
              margin-left: 10px;
              background: rgb(204, 204, 204, 0.3);
              padding: 10px;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>短信模板</div>
              <a-select
                v-model="messageTemplate"
                style="width: 100px"
                @change="getMessageTemplate"
              >
                <a-select-option
                  :value="item.tsgId"
                  v-for="(item, index) in messageTemplateSelects"
                  :key="index"
                >
                  {{ item.groupName }}
                </a-select-option>
              </a-select>
            </div>
            <div
              style="overflow: auto; height: 110px"
              v-if="messageTemplates.length > 0"
            >
              <div
                v-for="(item, index) in messageTemplates"
                :key="index"
                style="
                  padding: 5px;
                  margin: 10px 0;
                  border: 1px solid #ccc;
                  background: #fff;
                  cursor: pointer;
                "
                @click="chooseTemplate(item.content)"
              >
                <Tooltip
                  :str="`${index + 1}. ${item.content}`"
                  :max="14"
                  v-if="item.content.length > 14"
                />
                <span v-else>{{ index + 1 }}. {{ item.content }}</span>
              </div>
            </div>
            <a-empty
              v-else
              :image-style="{
                height: '60px',
              }"
            />
          </div>
        </a-col>
      </a-row>
      <a-row style="display: flex; align-items: center">
        <a-col span="4" style="text-align: right">签名：</a-col>
        <a-col span="20">
          <a-input v-model="smsLabel" style="width: 150px" disabled />
          （签名也计入字数）
        </a-col>
      </a-row>
      <a-row style="margin: 20px 0">
        <a-col span="4" />
        <a-col span="20" style="line-height: 30px; color: #999">
          温馨提示：
          <br />
          1.营销或非法短信将被系统自动屏蔽；<br />
          2.短信有效发送时间为8:30-18:00，非有效时间发送平台自动顺延发送时间；<br />
          3.请遵守《信息源入网信息安全责任书》的相关规定，并接受通信管理局审计。
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import api from "../../../api/api";
import Tooltip from "../../../components/Tooltip.vue";
export default {
  name: "messageAppointment",
  components: {
    Tooltip,
  },
  data() {
    return {
      loading: false,
      switchSet: false, // 开关
      timeType: 1, // 开播前时间类型 1:3天 2:1天 3:3小时 4:2小时 5:1小时 6:30分钟 7:15分钟
      smsContent: "", // 短信内容
      smsLabel: "", // 短信签名
      modalShow: false,
      messageTemplate: "all", // 短信模板
      messageTemplateSelects: [], // 短信模板右上角下拉框选项
      messageTemplates: [], // 短信模板列表
      link: "", // 直播链接
    };
  },
  created() {
    console.log(window.parent.smsLabel);
    this.smsLabel = window.parent.hyx
      ? window.parent.hyx.signature
      : "【慧营销直播】";
    this.getData();
    this.getMessageTemplateType();
    this.getLink();
  },
  methods: {
    getData() {
      this.loading = true;
      api.smsGetInfo({ zbId: this.$route.query.zbId }).then((res) => {
        if (res.status) {
          const data = res.bean;
          this.switchSet = data.switchSet === 2;
          this.timeType = data.timeType;
          this.smsContent = data.smsContent;
        }
        this.loading = false;
      });
    },
    save() {
      api
        .smsSaveOrUpdate({
          zbId: this.$route.query.zbId,
          type: 1,
          switchSet: this.switchSet ? 2 : 1,
          timeType: this.timeType,
        })
        .then((res) => {
          if (res.status) {
            this.$message.success("保存成功");
          }
        });
    },
    // 获取短信模板
    getMessageTemplateType() {
      api.typeListJson().then((res) => {
        console.log(res);
        this.messageTemplateSelects = res.data;
        this.messageTemplateSelects.unshift({
          groupName: "全部",
          tsgId: "all",
        });
      });
      this.getMessageTemplate();
    },
    getMessageTemplate() {
      this.messageTemplates = [
        "无色群二无群二无",
        "撒大声地撒多撒多所多所发多少发多少多",
        "是的萨达撒多所大所多",
      ];
      // tempListJson
      api
        .tempListJson({
          tsgId: this.messageTemplate === "all" ? null : this.messageTemplate,
        })
        .then((res) => {
          console.log(res);
          this.messageTemplates = res.data;
        });
    },
    //获取直播链接
    getLink() {
      api.roomShareUrl({ zbId: this.$route.query.zbId }).then((re) => {
        console.log("分享的直播地址信息", re);
        this.link = re.shareUrl;
      });
    },
    // 插入连接
    addLink() {
      const link = this.link;
      if (
        (this.smsLabel || "").length +
          (this.smsContent || "").length +
          link.length >
        280
      ) {
        this.$message.error(
          "当前短信内容加上链接超出280字，请删除后再插入直播链接"
        );
      } else {
        if (this.smsContent) {
          this.smsContent += link;
        } else {
          this.smsContent = link;
        }
      }
    },
    // 选择模板
    chooseTemplate(target) {
      this.smsContent = target;
    },
    modalOk() {
      console.log(this.smsContent, this.smsLabel);
      if (this.smsContent && this.smsContent.length > 0) {
        api
          .smsSaveOrUpdate({
            zbId: this.$route.query.zbId,
            type: 2,
            smsContent: this.smsContent,
            smsLabel: this.smsLabel,
          })
          .then((res) => {
            if (res.status) {
              this.$message.success("保存成功");
              this.modalShow = false;
            }
          });
      } else {
        this.$message.error("短信内容不能为空");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.message-appointment {
}
</style>
