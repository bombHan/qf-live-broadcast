<template>
  <a-modal
    :maskClosable="false"
    title="拒绝"
    :visible="modalShow"
    @ok="ok"
    @cancel="cancel"
    width="500px"
  >
    <a-row>
      <a-col :span="6" style="text-align: right"> 拒绝理由： </a-col>
      <a-col :span="1" />
      <a-col :span="15">
        <a-textarea
          v-model="refuseRemark"
          placeholder="请输入拒绝理由"
          :auto-size="{ minRows: 8, maxRows: 8 }"
          :maxLength="100"
        />
        <div style="display: flex; margin: 15px 0">
          <div
            v-for="(item, index) in tagList"
            :key="index"
            class="tag"
            @click="clickTag(item)"
          >
            {{item}}
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  name: "rejectModal",
  props: {
    modalShow: {
      type: Boolean || String,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      refuseRemark: "",
      tagList: ["该客户无号码", "该直播无计划"],
    };
  },
  created() {},
  methods: {
    clickTag(str) {
      console.log(str);
      if (str.length + this.refuseRemark.length > 100) {
        this.$message.error('拒绝理由超出规定字符，无法插入')
      } else {
        this.refuseRemark += str;
      }
    },
    ok() {
      if(!!this.refuseRemark) {
        this.$emit('ok', this.refuseRemark)
      } else {
        this.$message.error('请输入拒绝理由')
      }
    },
    cancel() {
      this.$emit('cancel')
    },
  },
};
</script>

<style lang='less' scoped>
.tag {
  padding: 5px 10px;
  background: #f5f5f5;
  margin-right: 10px;
  cursor: pointer;
}
</style>
