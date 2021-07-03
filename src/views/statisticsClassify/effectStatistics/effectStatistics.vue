<template>
  <div class="effect-statistics">
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
    <QfyTitle title="按组分析" />
    <a-table
      :columns="groupColumns"
      :data-source="groupDataList"
      :pagination="false"
      :rowKey="(record, index) => record.id"
      :customRow="customRow"
      :rowClassName="rowClassName"
      :loading="loading"
    >
      <template slot="pushBusinessNum" slot-scope="text, record">
        {{ text }} | {{ record.pushBusiness }}%
      </template>
      <template slot="winNum" slot-scope="text, record">
        {{ text }} | {{ record.winRate }}%
      </template>
      <template slot="newBusinessNum" slot-scope="text, record">
        {{ text }} | {{ record.newBusiness }}%
      </template>
    </a-table>
    <QfyTitle title="个人分析" style="margin-top: 20px" />
    <a-table
      :columns="personColumns"
      :data-source="activeRow.list || []"
      :pagination="false"
      :rowKey="(record, index) => index"
      :loading="loading"
    >
      <template slot="pushBusinessNum" slot-scope="text, record">
        {{ text }} | {{ record.pushBusiness }}%
      </template>
      <template slot="winNum" slot-scope="text, record">
        {{ text }} | {{ record.winRate }}%
      </template>
      <template slot="newBusinessNum" slot-scope="text, record">
        {{ text }} | {{ record.newBusiness }}%
      </template>
    </a-table>
  </div>
</template>

<script>
import moment from "moment";
import FormModelSearchForm from "../../../components/FormModelSearchForm.vue";
import QfyTitle from "../../../components/QfyTitle.vue";
import api from "../../../api/api";
export default {
  name: "effectStatistics",
  components: {
    FormModelSearchForm,
    QfyTitle,
  },
  data() {
    return {
      moment,
      formValues: {
        date: [
          moment().subtract(7, "day").format("YYYY-MM-DD"),
          moment().subtract(1, "day").format("YYYY-MM-DD"),
        ],
      },
      loading: false,
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
      groupColumns: [
        {
          title: "部门名称",
          dataIndex: "groupName",
        },
        {
          title: "创建直播场次",
          dataIndex: "createNum",
        },
        {
          title: "预约客户次数",
          dataIndex: "applyNum",
        },
        {
          title: "客户到访次数",
          dataIndex: "visitNum",
        },
        {
          title: "推进客户商机",
          dataIndex: "pushBusinessNum",
          scopedSlots: { customRender: "pushBusinessNum" },
        },
        {
          title: "客户赢单",
          dataIndex: "winNum",
          scopedSlots: { customRender: "winNum" },
        },
        {
          title: "客户新商机",
          dataIndex: "newBusinessNum",
          scopedSlots: { customRender: "newBusinessNum" },
        },
      ],
      groupDataList: [],
      activeRow: {},
      personColumns: [
        {
          title: "姓名",
          dataIndex: "userName",
        },
        {
          title: "创建直播场次",
          dataIndex: "createNum",
        },
        {
          title: "预约客户次数",
          dataIndex: "applyNum",
        },
        {
          title: "客户到访次数",
          dataIndex: "visitNum",
        },
        {
          title: "推进客户商机",
          dataIndex: "pushBusinessNum",
          scopedSlots: { customRender: "pushBusinessNum" },
        },
        {
          title: "客户赢单",
          dataIndex: "winNum",
          scopedSlots: { customRender: "winNum" },
        },
        {
          title: "客户新商机",
          dataIndex: "newBusinessNum",
          scopedSlots: { customRender: "newBusinessNum" },
        },
      ],
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    search(values) {
      console.log("values", values);
      if (values.date && values.date.length > 0) {
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
    getDataList() {
      console.log("sssssss");
      this.loading = true;
      api
        .statisticAnalyzeLiveEffect({
          liveTimeStr: this.formValues.date.join(","),
        })
        .then((res) => {
          console.log(res);
          this.groupDataList = res.list;
          // this.groupDataList = [
          //   { list: [{userName: 1213}], groupName: "1111", id: "sw1" },
          //   { list: [{userName:111}, {userName:4333}], groupName: "22", id: "sw" },
          // ];
          this.searchedFormValues = this.formValues;
          this.activeRow =
            this.groupDataList.length > 0 ? this.groupDataList[0] : {};
          this.loading = false;
        });
    },
    customRow(record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index);
            this.activeRow = record;
          },
        },
      };
    },
    rowClassName(record, index) {
      return record.id === this.activeRow.id ? "activeRow" : "";
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
.effect-statistics {
}
</style>
<style lang='less'>
.effect-statistics {
  .activeRow {
    background: #ecf6fd;
  }
}
</style>
