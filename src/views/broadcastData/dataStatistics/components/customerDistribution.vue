<template>
  <div class="echarts">
    <div class="title">
      客户分布
      <a-tooltip>
        <template slot="title">客户进入直播时，是慧营销客户的统计</template>
        <a-icon
          type="question-circle"
          style="font-size: 18px; color: #1890ff"
        />
      </a-tooltip>
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
        console.log("客户分布的dataObj传进来的值更新啦！！！", val);
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
      const appointmentCustomer = {
        value: this.dataObj.visitCustDate, // number类型
        percent: this.dataObj.visitCustDatePercentage, // string类型
        name: `预约客户  ${this.dataObj.visitCustDatePercentage}  ${this.dataObj.visitCustDate}`,
        itemStyle: { color: "#3c75e8" },
      };
      data.push(appointmentCustomer);
      const normalCustomer = {
        value: this.dataObj.visitDate, // number类型
        percent: this.dataObj.visitDatePercentage, // string类型
        name: `普通客户  ${this.dataObj.visitDatePercentage}  ${this.dataObj.visitDate}`,
        itemStyle: { color: "#f3cf21" },
      };
      data.push(normalCustomer);
      this.data = data;
      console.log('最新的客户分布data：', this.data)
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
            right: 0,
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
