<template>
  <div class="iframe">
    <iframe
      src="https://www.baidu.com/"
      frameborder="0"
      style="width: 100%; height: 100vh"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang='less' scoped>
::-webkit-scrollbar {
  width: 20px;
  height: 6px;
  background-color: #ffffff;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
