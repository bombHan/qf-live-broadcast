<template>
  <div class="qfy-title">
    <div class="left-block"/>
    {{title}}
  </div>
</template>

<script>
export default {
  name: "qfyTitle",
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang='less' scoped>
.qfy-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 15px;
  .left-block{
    height: 25px;
    width: 5px;
    background: #1890ff;
    margin-right: 15px;
    border-radius: 5px;
  }
}
</style>
