<template>
  <div class="echarts">
    <div class="title">地域分布</div>
    <div ref="myChart" style="width: 100%; height: 250px"></div>
  </div>
</template>

<script>
import "echarts/map/js/china";
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
        console.log("地域分布data列表数据更新！！", val);
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
        .visitorFindDataWithArea({
          zbId: this.$route.query.zbId,
        })
        .then((res) => {
          // const res1 = {"data":[{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"北京市","pid":110000000000,"visitNumber":20,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"天津市","pid":120000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"河北省","pid":130000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"山西省","pid":140000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"内蒙古自治区","pid":150000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"辽宁省","pid":210000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"吉林省","pid":220000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"黑龙江省","pid":230000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"上海市","pid":310000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"江苏省","pid":320000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"浙江省","pid":330000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"安徽省","pid":340000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"福建省","pid":350000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"江西省","pid":360000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"山东省","pid":370000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"河南省","pid":410000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"湖北省","pid":420000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"湖南省","pid":430000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"广东省","pid":440000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"广西壮族自治区","pid":450000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"海南省","pid":460000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"重庆市","pid":500000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"四川省","pid":510000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"贵州省","pid":520000000000,"visitNumber":50,"percentage":"70%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"云南省","pid":530000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"西藏自治区","pid":540000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"陕西省","pid":610000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"甘肃省","pid":620000000000,"visitNumber":5,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"青海省","pid":630000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"宁夏回族自治区","pid":640000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null},{"pageNum":0,"pageSize":10,"startDate":null,"endDate":null,"orderKey":null,"pname":"新疆维吾尔自治区","pid":650000000000,"visitNumber":0,"percentage":"0%","allNumber":2,"id":null}],"status":true}
          this.data = res.data.map((item) => {
            return {
              name: this.dealName(item.pname),
              value: item.visitNumber,
              percent: item.percentage,
            };
          });
          console.log("地域分布数据", this.data);
        });
    },
    dealName(oldName) {
      let newName = oldName.replace("省", "");
      newName = newName.replace("市", "");
      newName = newName.replace("自治区", "");
      newName = newName.replace("特别行政区", "");
      newName = newName.replace("壮族", "");
      newName = newName.replace("回族", "");
      newName = newName.replace("维吾尔", "");
      // console.log(newName);
      return newName;
    },
    draw() {
      let myChart = this.$echarts.init(this.$refs.myChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          show: false, // 不显示提示标签
          //鼠标放地图的某一块，显示的提示框
          formatter(params, ticket, callback) {
            // console.log(params)
            return params.data ? `${params.name}<br />${params.data.percent}  ${params.data.value}` : ''; // 因为数据里没有南海诸岛
          },
          backgroundColor: "rgba(1,1,1,0.5)", // 提示标签背景颜色
          textStyle: { color: "#fff" }, // 提示标签字体颜色
        },
        visualMap: {
          min: 0,
          max: 20,
          text: ["高", "低"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["#fff", "#1890ff"],
          },
          show: false,
        },
        grid: {
          left: "10%",
          right: "10%",
          top: "10%",
          bottom: "10%",
          containLabel: true,
        },
        geo: {
          map: "china",
          roam: false,
          zoom: 1.2,
          tooltip: {
            show: false, // 不显示提示标签
          },
          label: {
            normal: {
              show: false, // 显示省份标签
              textStyle: { color: "#000" }, // 省份标签字体颜色
            },
            emphasis: {
              // 对应的鼠标悬浮效果
              show: false,
              textStyle: { color: "#000" },
            },
          },
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                // 隐藏地图
                normal: {
                  opacity: 0, // 为 0 时不绘制该图形
                },
              },
              label: {
                show: false, // 隐藏文字
              },
            },
          ],
          itemStyle: {
            normal: {
              borderWidth: 0.5, // 区域边框宽度
              borderColor: "#999", // 区域边框颜色
              areaColor: "#fff", // 区域颜色
              label: { show: false },
            },
            emphasis: {
              show: false,
              borderWidth: 0.5,
              areaColor: "#1890ff",
              borderColor: "#000", // 区域边框颜色
            },
          },
        },
        series: [
          {
            type: "map",
            mapType: "china",
            roam: false,
            zoom: 1.2,
            tooltip: {
              show: false, // 不显示提示标签
            },
            label: {
              normal: {
                show: true, // 显示省份标签
              },
            },
            itemStyle: {
              normal: {
                areaColor: "#fff",
                borderWidth: 0.5, // 区域边框宽度
                borderColor: "#ccc", // 区域边框颜色
                label: { show: false },
              },
              emphasis: {
                show: false,
                areaColor: "#1890ff",
              },
            },
            geoIndex: 0,
            //鼠标放入地图显示提示框
            tooltip: { show: true },
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
