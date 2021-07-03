<template>
  <a-modal
    :maskClosable="false"
    title="设置优惠券"
    :visible="!!setModalShow"
    @ok="ok"
    @cancel="cancel"
    class="set-modal"
  >
    <div>
      <a-switch
        checked-children="开"
        un-checked-children="关"
        v-model="formData.zsSend"
      />
      <span style="margin-left: 15px">助手可以发送优惠券</span>
    </div>
    <div style="margin-top:20px">
      <a-switch
        checked-children="开"
        un-checked-children="关"
        v-model="formData.saleSend"
      />
      <span style="margin-left: 15px">销售可以发送优惠券（非助手的销售）</span>
    </div>
    <div style="margin-top:20px">
      每人可发送优惠券上限：
      <a-input-number v-model="formData.sendCount" :min="1" :precision="0" :max="1000"/>
    </div>
    <div style="margin-top:20px">
      设置为空则不限制发送次数，此限制只针对在私聊区发送优惠券
    </div>
  </a-modal>
</template>

<script>
import api from "../../../../api/api";
export default {
  name: "setModal",
  props: {
    setModalShow: {
      type: [Boolean, Object],
      default: false,
      required: false,
    },
  },
  data() {
    return {
      formData: {
        zsSend: false,
        saleSend: false,
      },
    };
  },
  created() {
    this.formData = {
      ...this.setModalShow,
      zsSend: this.setModalShow.zsSend === 0,
      saleSend: this.setModalShow.saleSend === 0,
    };
    console.log(this.formData);
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    ok() {
      // console.log(this.formData)
      this.$emit("ok", this.formData);
    },
  },
};
</script>

<style lang='less' scoped>
.set-modal {
}
</style>
