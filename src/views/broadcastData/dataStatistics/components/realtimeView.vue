<template>
  <div class="echarts">
    <div ref="myChart" style="width: 100%; height: 250px"></div>
  </div>
</template>

<script>
import api from "../../../../api/api";
export default {
  name: "echarts",
  data() {
    return {
      data: [],
    };
  },
  watch: {
    data: {
      handler(val, oldVal) {
        console.log("实时观看人次数据更新！！", val);
        this.draw();
      },
      deep: true,
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      api
        .zbDataOnlineListJson({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          console.log("实时观看人次数据", res.data);
          this.data = res.data;
        });
    },
    draw() {
      let myChart = this.$echarts.init(this.$refs.myChart);
      const x = (this.data || []).map((item) => {
        return item.inputTime;
      });
      const y = (this.data || []).map((item) => {
        return item.shzxCount;
      });
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (item) => {
            return `${item[0].name}<br>实时观看并发（人/次）：${item[0].data}`;
          },
        },
        legend: {
          orient: "vertical",
          left: -5,
        },

        xAxis: {
          type: "category",
          data: x,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "实时观看并发（人/次）",
            data: y,
            type: "line",
            smooth: true,
            symbol: "circle",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#1890ff",
              },
            },
            itemStyle: {
              normal: {
                color: "#1890ff",
                borderColor: "#1890ff",
                label : {show: true}
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
  .title {
    margin-bottom: 10px;
    font-size: 15px;
  }
}
</style>
