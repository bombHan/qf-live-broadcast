<template>
  <div class="echarts">
    <div ref="myChart" style="width: 100%; height: 350px"/>
  </div>
</template>

<script>
export default {
  name: "personNumber",
  props: {
    list: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {};
  },
  watch: {
    list: {
      handler(val, oldVal) {
        console.log("直播人数统计列表更新", val);
        this.draw();
      },
      deep: true,
    },
  },
  methods: {
    draw() {
      let myChart = this.$echarts.init(this.$refs.myChart);
      const nameList = this.list.map((item) => item.zbName);
      const viewNumberList = this.list.map((item) => item.viewNumber);
      const visitNumberList = this.list.map((item) => item.visitNumber);
      myChart.setOption({
        xAxis: {
          type: "category",
          data: nameList,
          axisLabel: {
            fontSize: 13,
          },
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
          formatter: (item) => {
            return `${item[0].name}<br>观看人次：${item[0].data}<br>访问人数：${item[1].data}`;
          },
        },
        legend: {
          left: 20,
          selectedMode: false,
        },
        series: [
          {
            name: "观看人次",
            data: viewNumberList,
            smooth: true,
            symbol: "circle",
            type: "line",
            itemStyle: {
              normal: {
                color: "#3e7bf8",
                label: { show: false, color: "#3e7bf8" },
              },
            },
          },
          {
            name: "访问人数",
            data: visitNumberList,
            smooth: true,
            symbol: "circle",
            type: "line",
            itemStyle: {
              normal: {
                color: "#f3d024",
                label: { show: false, color: "#f3d024" },
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.echarts {
  width: 100%;
}
</style>
