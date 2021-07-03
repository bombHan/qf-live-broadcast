<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :visible="modalShow"
    @cancel="cancel"
    @ok="ok"
    class="add-customer-modal"
    width="660px"
  >
    <a-spin :spinning="loading">
      <FormModelSearchForm
        :formList="searchFormList"
        @prevHandleSubmit="search"
        :defaultFormValues="defaultFormValues"
      ></FormModelSearchForm>
      <div class="list-wrap" v-if="dataList.length > 0">
        <a-checkbox-group v-model="selectedIds" style="margin-top: 20px">
          <a-checkbox
            v-for="(item, index) in dataList"
            :key="index"
            :value="item.id"
          >
            <div class="list-content">
              <div class="list-item">
                <div style="color: #999">预约的客户：</div>
                <div style="color: #000">
                  {{ item.resCustName }}-{{ item.resName }}-{{ item.resPhone }}
                </div>
              </div>
              <div class="list-item">
                <div style="color: #999">申请人：</div>
                <div style="color: #000">{{ item.applyName }}</div>
              </div>
              <div class="list-item">
                <div style="color: #999">申请时间：</div>
                <div style="color: #000">{{ item.inputTime }}</div>
              </div>
              <div class="list-item">
                <div style="color: #999">主题：</div>
                <div style="color: #000">{{ item.theme }}</div>
              </div>
              <div class="list-item">
                <div style="color: #999">预计时间：</div>
                <div style="color: #000">
                  {{ item.zbStartTime }} ~ {{ item.zbEndTime }}
                </div>
              </div>
              <div class="list-item">
                <div style="color: #999">备注：</div>
                <div style="color: #000">{{ item.remark }}</div>
              </div>
            </div>
          </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-empty :image="$Empty.PRESENTED_IMAGE_SIMPLE" v-else style="margin: 20px 0"></a-empty>
      <div style="margin-top: 15px; padding-left: 35px">
        已选中客户
        <span style="color: #1890ff">{{ this.selectedIds.length }}</span> 个
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import FormModelSearchForm from "@/components/FormModelSearchForm.vue";
import api from "../../../api/api";
export default {
  name: "addcustomermodal",
  components: {
    FormModelSearchForm,
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "选择申请列表客户",
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      dataList: [],
      selectedIds: [],
      defaultFormValues: {
        queryType: "resCustName",
      },
      searchFormList: [],
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      this.loading = true;
      api.orgGroupGet_all_sale_user_json().then((res) => {
        console.log("全部人员树----------", res);
        this.searchFormList = [
          {
            type: "compact",
            compactName: "queryType",
            options: [
              { value: "resCustName", label: "预约的客户" },
              { value: "resName", label: "联系人" },
              { value: "resPhone", label: "手机号" },
              { value: "theme", label: "主题" },
              { value: "remark", label: "备注" },
            ],
            compact: "input",
            name: "queryText",
          },
          {
            type: "treeselect",
            label: "申请人",
            name: "applyIdStr",
            replaceFields: {
              children: "children",
              title: "text",
              key: "id",
              value: "id",
            },
            treeData: res,
          },
        ];
        this.search();
      });
    },
    search(value) {
      console.log(value);
      const values = value || {};
      this.loading = true;
      api
        .reserveOrderListJson({
          applyIdStr: values.applyIdStr ? values.applyIdStr.join(",") : "",
          queryType: values.queryType,
          queryText: values.queryText,
        })
        .then((res) => {
          console.log("邀请列表数据", res.data);
          this.dataList = res.data;
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 点击确定
    ok() {
      console.log("okokokokok");
      if (this.selectedIds.length > 0) {
        this.$emit("ok", this.selectedIds);
      } else {
        this.$message.error("请选择至少一位客户");
      }
    },
    // 点击取消
    cancel() {
      console.log("cancelcancel!!!!");
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less">
.add-customer-modal {
  .list-wrap {
    max-height: 380px;
    overflow: auto;
    .ant-checkbox-wrapper {
      display: flex;
      align-items: center;
      margin: 0 0 20px 0;
      .list-content {
        width: 100%;
        border: 1px solid #ccc;
        width: 500px;
        padding: 15px;
        margin-left: 10px;
        .list-item {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
