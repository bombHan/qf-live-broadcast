<template>
  <a-modal
    :maskClosable="false"
    title="优惠券详情"
    :visible="!!detailModalShow"
    :footer="null"
    @cancel="cancel"
    class="detail-modal"
  >
    <a-form-model>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="优惠券名称"
      >
        {{ detailObj.name }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="优惠券类型"
      >
        {{
          detailObj.type === 0
            ? "店铺促销"
            : detailObj.type === 1
            ? "满减"
            : detailObj.type === 2
            ? "折扣"
            : "现金券"
        }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="适用商品"
      >
        {{
          detailObj.googsType === 0
            ? "全部商品可用"
            : detailObj.googsType === 1
            ? "指定商品可用"
            : "指定商品不可用"
        }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="使用门槛"
      >
        {{
          detailObj.useConditionType === 0
            ? "无使用门槛"
            : `使用商品范围内满${detailObj.useCondition}元`
        }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="优惠内容"
      >
        {{ detailObj.content }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="发放张数/剩余"
      >
        {{ detailObj.amount }}/{{ detailObj.surplus }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="用券时间"
      >
        <span v-if="detailObj.validType === 0">
          固定日期 {{ detailObj.validStartTime }} - {{ detailObj.validEndTime }}
        </span>
        <span v-else>
          领券当日起{{ detailObj.validDay }}天内有效
        </span>
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="限领张数"
      >
        {{ detailObj.limitAmount }}
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
        label="使用说明"
      >
        {{ detailObj.remark }}
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import api from "../../../../api/api";
export default {
  name: "detailModal",
  props: {
    detailModalShow: {
      type: [Boolean, Object],
      default: false,
      required: false,
    },
  },
  data() {
    return {
      detailObj: {},
    };
  },
  created() {
    this.getDetailObj();
  },
  methods: {
    getDetailObj() {
      console.log(this.detailModalShow);
      api
        .couponInfoJson({
          ticketId: this.detailModalShow.ticketId,
        })
        .then((res) => {
          console.log(res);
          this.detailObj = res.bean;
        });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang='less' scoped>
.detail-modal {
  .ant-form-item {
    margin-bottom: 0px;
  }
}
</style>
