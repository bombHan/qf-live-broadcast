<template>
  <div class="watch-setting">
    <a-radio-group v-model="readSet">
      <a-radio :value="1">
        手机号验证
        <a-tooltip>
          <template slot="title"
            >观看直播的访客必须通过手机号验证，才能进入直播间</template
          >
          <a-icon
            type="question-circle"
            style="font-size: 16px; color: #1890ff; margin-left: 10px;margin-right: 40px"
          />
        </a-tooltip>
      </a-radio>
      <a-radio :value="2"> 免费观看 </a-radio>
    </a-radio-group>
    <div style="display:flex;margin-top: 20px">
      <a style="margin-right: 40px" @click="hyxModalShow=true">邀请慧营销客户</a>
      <a @click="modalShow=true">邀请申请列表客户</a>
      <div style="margin-left:20px">选择客户请在直播数据-预约客户数据查看。</div>
    </div>
    <a-button type="primary" @click="save" style="display:block;margin: 20px auto">保存</a-button>
    <!-- 邀请慧营销客户 -->
    <addHyxCustomerModal
      @ok="hyxModalOk"
      @cancel="hyxModalCancel"
      :modalShow="hyxModalShow"
      v-if="hyxModalShow"
    />
    <addCustomerModal
      @ok="modalOk"
      @cancel="modalCancel"
      :modalShow="modalShow"
      v-if="modalShow"
    />
  </div>
</template>

<script>
import api from "../../../api/api";
import addHyxCustomerModal from "../../broadcastHall/components/addHyxCustomerModal.vue";
import addCustomerModal from '../components/addCustomerModal.vue'
export default {
  name: "watchSetting",
  components: {
    addHyxCustomerModal,
    addCustomerModal
  },
  data() {
    return {
      readSet: 1,
      hyxModalShow: false,
      modalShow: false,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
        console.log(res);
        this.readSet = res.data.readSet;
      });
    },
    save() {
      api.roomSaveReadset({
        zbId: this.$route.query.zbId,
        readSet: this.readSet
      }).then((res) => {
        if(res.status) {
          this.$message.success('保存成功')
          this.getInfo()
        }
      })
    },
    hyxModalOk(resIds) {
      console.log(resIds);
      api.reserveCustSaveHyxCust({
        zbId: this.$route.query.zbId,
        resIds
      }).then((res) => {
        if(res.status) {
          this.$message.success(`提交成功：${res.data}`);
          this.hyxModalCancel()
        }
      })
    },
    hyxModalCancel() {
      this.hyxModalShow = false;
    },
    modalOk(orderIds) {
      console.log(orderIds);
      api.reserveCustSaveReserveOrder({
        orderIds,
        zbId: this.$route.query.zbId
      }).then((res) => {
        if(res.status) {
          this.$message.success(`提交成功：${res.data}`);
          this.modalCancel()
        }
      })
    },
    modalCancel() {
      this.modalShow = false;
    },

  },
};
</script>

<style lang="less" scoped>
.watch-setting {
}
</style>
