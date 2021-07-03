<template>
  <div class="interact-manage">
    <div class="tool">
      <a-tabs v-model="activeTab" style="width: 100%" @change="changeTab">
        <a-tab-pane :key="2" tab="抽奖" />
        <a-tab-pane :key="1" tab="表单（功能暂未开放）" :disabled="true"/>
      </a-tabs>
      <a-button type="primary" ghost class="button" @click="addActivity"
        >添加活动</a-button
      >
    </div>
    <a-spin :spinning="loading">
      <div class="data-list">
        <!-- 表单 -->
        <div v-if="activeTab === 1">
          <a-table
            :columns="columns1"
            :dataSource="dataList"
            :rowKey="(record) => record.formId"
            :pagination="false"
          >
            <template slot="name" slot-scope="key">
              <Tooltip :str="key" :max="10" v-if="key && key.length > 10" />
              <div v-else>{{ key }}</div>
            </template>
            <template slot="action" slot-scope="key, item">
              <a style="margin-right: 10px" @click="pushForm(item)"> 推送 </a>
              <a style="margin-right: 10px" @click="deleteForm(item)"> 删除 </a>
            </template>
          </a-table>
        </div>
        <!-- 抽奖 -->
        <div v-else>
          <a-table
            :columns="columns2"
            :dataSource="dataList"
            :rowKey="(record) => record.prizeId"
            :pagination="false"
          >
            <template slot="name" slot-scope="key">
              <Tooltip :str="key" :max="10" v-if="key.length > 10" />
              <div v-else>{{ key }}</div>
            </template>
            <template slot="state" slot-scope="key">
              <div>
                {{ key === 0 ? "未推送" : key === 1 ? "已推送" : "已开奖" }}
              </div>
            </template>
            <template slot="action" slot-scope="key, item">
              <a
                style="margin-right: 10px"
                @click="edit(item)"
                v-if="item.state === 0"
                >编辑</a
              >
              <a
                style="margin-right: 10px"
                @click="push(item)"
                v-if="item.state === 0"
                >推送</a
              >
              <a
                style="margin-right: 10px"
                @click="open(item)"
                v-if="item.state === 1"
                >开奖</a
              >
              <a
                style="margin-right: 10px"
                @click="watchPrizeModalShow = item.prizeId"
                v-if="item.state !== 0"
                >查看</a
              >
            </template>
          </a-table>
        </div>
      </div>
      <div style="display: flex; flex-direction: row-reverse">
        <a-pagination
          :showTotal="(total) => `共 ${pagination.total} 条`"
          showSizeChanger
          showQuickJumper
          @change="pagerChange"
          @showSizeChange="sizeChange"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          :current="pagination.pageNum"
          style="margin-top: 20px"
        />
      </div>
    </a-spin>
    <!-- 表单的添加活动弹窗 -->
    <a-modal
      :maskClosable="false"
      title="选择表单"
      v-if="!!modalShow1"
      :visible="!!modalShow1"
      @cancel="modalCancel1"
      @ok="modalOk1"
    >
      <a-form-model :model="formData1" ref="form1">
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="表单类型"
        >
          <a-select v-model="formData1.formType" @change="changeFormType">
            <a-select-option
              v-for="item in typeList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="表单名称"
          prop="tsmFormId"
          :rules="[{ required: true, message: '请选择表单名称' }]"
        >
          <a-select v-model="formData1.tsmFormId">
            <a-select-option
              v-for="item in nameList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 抽奖的添加活动弹窗 -->
    <a-modal
      :maskClosable="false"
      :title="modalShow2 === 'add' ? '新增抽奖' : '编辑抽奖'"
      v-if="!!modalShow2"
      :visible="!!modalShow2"
      @cancel="modalCancel2"
      @ok="modalOk2"
    >
      <a-form-model :model="formData2" ref="form2">
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="奖品名称"
          prop="name"
          :rules="[{ required: true, message: '请填写奖品名称' }]"
        >
          <a-input v-model="formData2.name" :maxLength="10" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label="奖品数量"
          prop="prizeNumber"
          :rules="[{ required: true, message: '请填写奖品数量' }]"
        >
          <a-input-number
            v-model="formData2.prizeNumber"
            :precision="0"
            :min="1"
          />
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          label=" "
          :colon="false"
        >
          <a-checkbox v-model="formData2.isAddress"
            >要求中奖用户填写地址</a-checkbox
          >
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 查看抽奖详情弹窗 -->
    <watchPrizeModal
      v-if="watchPrizeModalShow"
      :modalShow="watchPrizeModalShow"
      @cancel="watchPrizeModalShow = false"
    />
  </div>
</template>

<script>
import api from "../../../api/api";
import Tooltip from "../../../components/Tooltip.vue";
import watchPrizeModal from "../components/watchPrizeModal.vue";
export default {
  name: "interactManage",
  components: {
    Tooltip,
    watchPrizeModal,
  },
  data() {
    return {
      loading: false,
      activeTab: 2, // 1表单2抽奖
      dataList: [], // 列表
      modalShow1: false, // 表单弹窗
      typeList: [], // 表单类型列表
      nameList: [], // 表单名称
      formData1: {
        formType: null, // 表单类型
        tsmFormId: null, // 表单名称id
      },
      modalShow2: false, // 抽奖弹窗 'add'或者'edit'
      formData2: {
        name: null,
        prizeNumber: 1,
        isAddress: false,
      },
      watchPrizeModalShow: false,
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      columns1: [
        {
          title: "表单名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "表单类型",
          dataIndex: "type",
        },
        {
          title: "创建者",
          dataIndex: "creatorName",
        },
        {
          title: "参与人数",
          dataIndex: "number",
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      columns2: [
        {
          title: "奖品名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "创建者",
          dataIndex: "creatorName",
        },
        {
          title: "参与人数",
          dataIndex: "joinNumber",
        },
        {
          title: "中奖人数",
          dataIndex: "prizeWinnerNumber",
        },
        {
          title: "活动状态",
          dataIndex: "state",
          scopedSlots: { customRender: "state" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  created() {
    if (this.activeTab === 1) {
      // 表单
      this.getFormDataList();
    } else {
      //抽奖
      this.getLuckDrawDataList();
    }
  },
  methods: {
    // 添加活动
    addActivity() {
      if (this.activeTab === 1) {
        // 表单
        this.getTypeList();
        this.modalShow1 = true;
        this.formData1 = {
          formType: null, // 表单类型
          tsmFormId: null, // 表单名称id
        };
      } else {
        //抽奖
        this.modalShow2 = "add";
        this.formData2 = {
          name: null,
          prizeNumber: 1,
          isAddress: false,
        };
      }
    },
    // 切换tab
    changeTab(val) {
      console.log(val);
      this.pagination = {
        ...this.pagination,
        pageNum: 1,
        total: null,
      };
      this.dataList = [];
      if (this.activeTab === 1) {
        // 表单
        this.getFormDataList();
      } else {
        //抽奖
        this.getLuckDrawDataList();
      }
    },
    // 获取表单列表
    getFormDataList() {
      this.loading = true;
      api
        .zbFormListPageJson({
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.dataList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 获取抽奖列表
    getLuckDrawDataList() {
      this.loading = true;
      api
        .prizeListPageJson({
          zbId: this.$route.query.zbId,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.dataList = res.data.list;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    sizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      if (this.activeTab === 1) {
        // 表单
        this.getFormDataList();
      } else {
        //抽奖
        this.getLuckDrawDataList();
      }
    },
    pagerChange(pageNum, pageSize) {
      this.pagination.pageNum = pageNum;
      if (this.activeTab === 1) {
        // 表单
        this.getFormDataList();
      } else {
        //抽奖
        this.getLuckDrawDataList();
      }
    },
    // 抽奖的编辑
    edit(target) {
      this.modalShow2 = "edit";
      this.formData2 = {
        prizeId: target.prizeId,
        name: target.name,
        prizeNumber: target.prizeNumber,
        isAddress: target.isAddress === 1,
      };
    },
    // 表单的推送
    pushForm(target) {
      const that = this;
      this.$confirm({
        title: "推送",
        content: `是否推送当前表单？`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          // api
          //   .zbPrizePushPrize({
          //     formId: target.formId,
          //   })
          //   .then((res) => {
          //     if (res.status) {
          //       that.$message.success("推送成功");
          //       that.getLuckDrawDataList();
          //     }
          //   });
        },
      });
    },
    // 表单的删除
    deleteForm(target) {
      const that = this;
      this.$confirm({
        title: "删除",
        content: `是否删除当前表单？`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          api
            .zbFormDelJson({
              formId: target.formId,
            })
            .then((res) => {
              if (res.status) {
                that.$message.success("删除成功");
                that.getFormDataList();
              }
            });
        },
      });
    },
    // 抽奖的推送
    push(target) {
      const that = this;
      this.$confirm({
        title: "推送",
        content: `是否推送当前抽奖？`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          api
            .prizePushPrize({
              prizeId: target.prizeId,
            })
            .then((res) => {
              if (res.status) {
                that.$message.success("推送成功");
                that.getLuckDrawDataList();
              }
            });
        },
      });
    },
    // 抽奖的开奖
    open(target) {
      // prizeGetPrizeCount
      api
        .prizeGetPrizeCount({
          prizeId: target.prizeId,
        })
        .then((res) => {
          const that = this;
          this.$confirm({
            title: "开奖",
            content: `当前参与抽奖人数为${res.data},是否确认开奖？`,
            okText: "确认",
            cancelText: "取消",
            onOk() {
              api
                .zbPrizeChoicePrize({
                  prizeId: target.prizeId,
                })
                .then((res) => {
                  if (res.status) {
                    that.$message.success("开奖成功");
                    that.getLuckDrawDataList();
                  }
                });
            },
          });
        });
    },
    getTypeList() {
      this.typeList = [
        { label: "报名登记", value: "报名登记" },
        { label: "问卷调研", value: "问卷调研" },
        { label: "活动投票", value: "活动投票" },
        { label: "考试测评", value: "考试测评" },
        { label: "满意度调查", value: "满意度调查" },
        { label: "营销长页", value: "营销长页" },
      ];
    },
    changeFormType(value) {
      console.log(value);
      this.nameList = [
        { label: "表单111", value: "表单111" },
        { label: "222", value: "222" },
        { label: "333", value: "333" },
      ];
      this.formData1.tsmFormId = null;
    },
    // 表单弹窗ok
    modalOk1() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          console.log(this.formData1);
          api
            .zbFormSaveJson({
              zbId: this.$route.query.zbId,
              ...this.formData1,
              formUrl: "",
            })
            .then((res) => {
              if (res.status) {
                this.modalCancel1();
                this.getFormDataList();
                this.$message.success("保存成功");
              }
            });
        }
      });
    },
    modalCancel1() {
      this.modalShow1 = false;
      this.formData1 = {
        formType: null, // 表单类型
        tsmFormId: null, // 表单名称id
      };
    },
    //抽奖弹窗ok
    modalOk2() {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          console.log(this.formData2);
          api
            .prizeSaveJson({
              ...this.formData2,
              isAddress: this.formData2.isAddress ? 1 : 0,
              zbId: this.$route.query.zbId,
            })
            .then((res) => {
              if (res.status) {
                this.modalCancel2();
                this.getLuckDrawDataList();
                this.$message.success("保存成功");
              }
            });
        }
      });
    },
    modalCancel2() {
      this.modalShow2 = false;
      this.formData2 = {
        name: null,
        prizeNumber: 1,
        isAddress: false,
      };
    },
  },
};
</script>

<style lang='less' scoped>
.interact-manage {
  .tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .button {
      position: absolute;
      right: 30px;
      bottom: 30px;
    }
  }
  .data-list {
    max-height: calc(100vh - 280px);
    overflow: auto;
  }
}
</style>
