<template>
  <div class="echarts">
    <div class="title">
      观看终端
    </div>
    <div ref="myChart" style="width: 100%; height: 250px"></div>
  </div>
</template>

<script>
import "echarts/map/js/china";
export default {
  name: "echarts",
  props: {
    dataObj: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    dataObj: {
      handler(val, oldVal) {
        console.log("观看终端的dataObj传进来的值更新啦！！！", val);
        this.dealData();
        this.draw();
      },
      deep: true,
    },
  },
  methods: {
    dealData() {
      let data = [];
      console.log(this.dataObj);
      const pcData = {
        value: this.dataObj.terminalPCData, // number类型
        percent: this.dataObj.terminalPCDataPercentage, // string类型
        name: `电脑  ${this.dataObj.terminalPCDataPercentage}  ${this.dataObj.terminalPCData}`,
        itemStyle: { color: "#3c75e8" },
      };
      data.push(pcData);
      const mobileData = {
        value: this.dataObj.terminalPhoneData, // number类型
        percent: this.dataObj.terminalPhoneDataPercentage, // string类型
        name: `手机  ${this.dataObj.terminalPhoneDataPercentage}  ${this.dataObj.terminalPhoneData}`,
        itemStyle: { color: "#f3cf21" },
      };
      data.push(mobileData);
      this.data = data;
      console.log('最新的观看终端data：', this.data)
    },
    draw() {
      let myChart = this.$echarts.init(this.$refs.myChart);
      const nameList = this.data.map((item) => {return item.name})
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: (item) => {
            return `观看人数占比<br>${item.name}`;
          },
        },
        legend: {
          top: 0,
          left: -5,
          itemWidth: 10,
          itemHeight: 10,
          orient: "vertical",
          align: "left",
        },
        series: [
          {
            name: "观看人数占比",
            type: "pie",
            radius: ["70%", "90%"],
            top: 40,
            left: 0,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontWeight: "bold",
                fontSize: 18
              },
            },
            labelLine: {
              show: false,
            },
            data: this.data,
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
