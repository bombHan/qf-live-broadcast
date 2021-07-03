<template>
  <a-modal
    :maskClosable="false"
    title="发表评论"
    :visible="modalShow"
    @cancel="cancel"
    @ok="ok"
    class="comment-modal"
  >
     <a-form-model :model="formData" ref="form">
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="评论内容"
          prop="revComment"
          :rules="[{ required: true, message: '请填写评论内容' }]"
        >
          <a-textarea :maxLength="200" v-model.trim="formData.revComment" placeholder="请输入内容" :rows="5" :autoSize="{ minRows: 5, maxRows: 5 }"/>
        </a-form-model-item>
      </a-form-model>
  </a-modal>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "commentModal",
  props: {
    modalShow: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      formData: {
        revComment: ''
      }
    };
  },
  created() {

  },
  methods: {
    // 点击确定
    ok() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.$emit("ok", this.formData);
        }
      })
    },
    // 点击取消
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less">
.comment-modal {
}
</style>
