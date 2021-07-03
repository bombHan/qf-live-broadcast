<template>
  <span>
    <a-tooltip
      :placement="placement"
      :title="str"
      :class="className"
      v-if="str.length > max"
    >
      {{ str.length > max ? str.slice(0, max) + "..." : str }}
    </a-tooltip>
    <span v-else>{{ str }}</span>
  </span>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      required: false,
      default: "top",
    },
    className: {
      type: String,
      required: false,
      default: "",
    },
    str: {
      type: String,
      required: true,
      default: "",
    },
    max: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
</style>
