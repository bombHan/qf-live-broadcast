<template>
  <div class="data-statistics">
    <a-spin :spinning="loading">
      <div
        style="
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <FormModelSearchForm
          :formList="searchFormList"
          @prevHandleSubmit="search"
          :defaultFormValues="formValues"
        ></FormModelSearchForm>
        <div>
          统计时间：{{ searchedFormValues.date[0] }} 至
          {{ searchedFormValues.date[1] }}
        </div>
      </div>
      <QfyTitle title="直播数据列表" />
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="false"
        :rowKey="(record, index) => index"
        :customRow="customRow"
      >
        <template slot="liveTime" slot-scope="text"> {{ text }} 分钟 </template>
      </a-table>
      <div class="bottom">
        <div class="bottom-left">
          <QfyTitle title="直播数据列表" style="margin-bottom: 20px" />
          <a-select
            v-model="timeType"
            style="margin-bottom: 20px; width: 200px"
            @change="getBottomDataList"
          >
            <a-select-option :value="1"> 按日统计 </a-select-option>
            <a-select-option :value="2"> 按周统计 </a-select-option>
          </a-select>
          <a-table
            :loading="bottomLoading"
            :columns="bottomColumns"
            :data-source="bottomDataList"
            :pagination="false"
            :rowKey="(record, index) => index"
          />
        </div>
        <div class="bottom-right">
          <QfyTitle title="直播人数统计" style="margin-bottom: 15px" />
          <PersonNumber :list="echartDataList" />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import FormModelSearchForm from "../../../components/FormModelSearchForm.vue";
import api from "../../../api/api";
import moment from "moment";
import QfyTitle from "../../../components/QfyTitle.vue";
import PersonNumber from "./components/PersonNumber.vue";
import Tooltip from "../../../components/Tooltip.vue";
export default {
  name: "dataStatistics",
  components: {
    FormModelSearchForm,
    QfyTitle,
    PersonNumber,
  },
  data() {
    return {
      moment,
      loading: false,
      formValues: {
        date: [
          moment().subtract(7, "day").format("YYYY-MM-DD"),
          moment().subtract(1, "day").format("YYYY-MM-DD"),
        ],
      },
      searchedFormValues: {
        date: [],
      },
      searchFormList: [
        {
          type: "rangepicker",
          label: "时间",
          name: "date",
          disabledDate: this.disabledDate,
        },
      ],
      dataList: [],
      echartDataList: [],
      columns: [
        {
          title: "直播名称",
          dataIndex: "zbName",
          customRender: (text, row, index) => {
            if (index < this.dataList.length - 1) {
              return <Tooltip str={text ? text : ''} max={10} />;
            }
            return {
              children: text,
              attrs: {
                colSpan: 4,
              },
            };
          },
        },
        {
          title: "主播",
          dataIndex: "zbAcctName",
          customRender: (text, row, index) => {
            if (index < this.dataList.length - 1) {
              return text;
            }
            return {
              children: text,
              attrs: {
                colSpan: 0,
              },
            };
          },
        },
        {
          title: "助手",
          dataIndex: "assistant",
          scopedSlots: { customRender: "assistant" },
          customRender: (text, row, index) => {
            if (index < this.dataList.length - 1) {
              return <Tooltip str={text ? text : ''} max={10} />;
            }
            return {
              children: text,
              attrs: {
                colSpan: 0,
              },
            };
          },
        },
        {
          title: "直播开始时间",
          dataIndex: "actualStartTime",
          customRender: (text, row, index) => {
            if (index < this.dataList.length - 1) {
              return text;
            }
            return {
              children: text,
              attrs: {
                colSpan: 0,
              },
            };
          },
        },
        {
          title: "观看人次",
          dataIndex: "viewNumber",
        },
        {
          title: "访问人数",
          dataIndex: "visitNumber",
        },
        {
          title: "预约人数",
          dataIndex: "custNumber",
        },
        {
          title: "直播时长",
          dataIndex: "liveTime",
          scopedSlots: { customRender: "liveTime" },
        },
      ],
      timeType: 2, // 1=按日分组，2=按周分组(默认)
      bottomLoading: false, // 左下角数据请求loading
      bottomDataList: [], // 左下角数据列表
      bottomColumns: [
        {
          title: "日期",
          dataIndex: "liveTimeStr",
        },
        {
          title: "直播场次",
          dataIndex: "zbNumber",
        },
        {
          title: "观看人次",
          dataIndex: "viewNumber",
        },
        {
          title: "访问人数",
          dataIndex: "visitorNumber",
        },
      ],
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    customRow(record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index);
          },
        },
      };
    },
    search(values) {
      console.log("values", values);
      if (values.date && values.date.length > 0) {
        console.log(moment(values.date[1]).diff(values.date[0], "day"));
        if (moment(values.date[1]).diff(values.date[0], "day") > 30) {
          this.$message.error("查询时间跨度超过31天，请按需调整后重新查询");
        } else {
          this.formValues = values;
          this.getDataList();
        }
      } else {
        this.$message.error("请选择时间区间后再进行查询");
      }
    },
    //获取直播数据列表
    getDataList() {
      console.log("请求日期", this.formValues.date);
      this.loading = true;
      api
        .statisticAnalyzeLiveDetail({
          liveTimeStr: this.formValues.date.join(","),
        })
        .then((res) => {
          console.log("上面直播数据统计列表", res.list);
          this.searchedFormValues = this.formValues;
          this.dataList = this.calcDataList(res.list);
          this.echartDataList = this.calcDataList(res.list, "noSum");
          this.loading = false;
          this.getBottomDataList();
        });
    },
    // 计算直播数据列表数据，加一行合计
    calcDataList(list, type) {
      // viewNumber,visitNumber,custNumber,liveTime
      list = list.map((item) => {
        return {
          ...item,
          viewNumber: item.viewNumber ? item.viewNumber : 0,
          visitNumber: item.visitNumber ? item.visitNumber : 0,
          custNumber: item.custNumber ? item.custNumber : 0,
          liveTime: item.liveTime ? item.liveTime : 0,
        };
      });
      if (type === "noSum") {
        list.pop();
        return list;
      } else {
        return list;
      }
    },
    //获取底部左边直播数据列表
    getBottomDataList() {
      api
        .statisticAnalyzeLiveWeek({
          liveTimeStr: this.formValues.date.join(","),
          timeType: this.timeType,
        })
        .then((res) => {
          console.log("左下角的数据列表", res);
          this.bottomDataList = res.list;
        });
    },
    disabledDate(current) {
      // console.log(current, moment().add(365, 'days'), moment().subtract(365, 'days'));
      return (
        current &&
        (current > moment().add(365, "days") ||
          current < moment().subtract(365, "days"))
      );
    },
  },
};
</script>

<style lang='less' scoped>
.data-statistics {
  .bottom {
    margin-top: 20px;
    display: flex;
    .bottom-left {
      width: 50%;
    }
    .bottom-right {
      width: 50%;
    }
  }
}
</style>
