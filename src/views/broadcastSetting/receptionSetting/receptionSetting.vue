<template>
  <div class="reception-setting">
    <a-spin :spinning="loading">
      <a-radio-group v-model="type" @change="typeChange">
        <div class="radio-item">
          <a-radio :value="1"
            >客户所有者接待访客（无所有者访客助手接待、无助手由主播接待）</a-radio
          >
          <div class="assistants" v-if="type === 1">
            选择助手：
            <a-tree-select
              v-model="accounts"
              style="width: 300px"
              :tree-data="treeData"
              tree-checkable
              search-placeholder="请选择"
              :maxTagCount="2"
              :replaceFields="{
                children: 'children',
                title: 'text',
                key: 'id',
                value: 'id',
              }"
            />
          </div>
        </div>
        <div class="radio-item">
          <a-radio :value="2">助手接待访客</a-radio>
          <div class="assistants" v-if="type === 2">
            选择助手：
            <a-tree-select
              v-model="accounts"
              style="width: 300px"
              :tree-data="treeData"
              tree-checkable
              search-placeholder="请选择"
              :maxTagCount="2"
              :replaceFields="{
                children: 'children',
                title: 'text',
                key: 'id',
                value: 'id',
              }"
            />
          </div>
        </div>
        <div class="radio-item">
          <a-radio :value="3">仅由主播接待</a-radio>
        </div>
      </a-radio-group>
      <div style="text-align: center">
        <a-button
          type="primary"
          @click="save"
          :disabled="info.zbState > 1"
          :title="info.zbState > 1 ? '只有在直播未开始状态下才可保存': ''"
          >保存</a-button
        >
      </div>
    </a-spin>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "receptionSetting",
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
      requried: false,
    },
  },
  data() {
    return {
      loading: false,
      type: 3,
      disableAccounts: [],
      accounts: [],
      treeData: [],
    };
  },
  computed: {
    filnalTreeData() {
      let res = this.dealTreeData(this.treeData);
      return res;
    },
  },
  created() {
    this.getData();
    this.getTreeData();
    console.log(
      this,
      this.$options._componentTag,
      this.$parent,
      this.$parent.$options._componentTag
    );
  },
  methods: {
    getTreeData() {
      api.orgGroupGet_all_sale_user_json().then((res) => {
        console.log("人员树--------", res);
        this.treeData = res;
      });
    },
    dealTreeData(list) {
      list = list.map((item) => {
        if (item.children) {
          return {
            ...item,
            children: this.dealTreeData(item.children),
          };
        } else {
          let flag = this.disableAccounts.includes(item.id);
          return {
            ...item,
            disabled: flag,
          };
        }
      });
      return list;
    },
    getData() {
      this.loading = true;
      api.recepGetInfo({ zbId: this.$route.query.zbId }).then((res) => {
        console.log("获取接待设置数据-------------", res.data);
        this.type = res.data.type;
        this.accounts = res.data.accounts || [];
        this.disableAccounts = res.data.accounts || [];
        this.loading = false;
      });
    },
    typeChange(value) {
      // console.log(value);
      this.accounts = [];
    },
    save() {
      console.log(this.type, this.accounts, this.info);
      // zbAcctId
      if (this.accounts.includes(this.info.zbAcctId)) {
        this.$message.error("主播不能成为助手");
      } else {
        if(this.type === 2 && this.accounts.length === 0){
          this.$message.error("请选择助手后再保存");
        } else {
          api.getZbState({ zbId: this.$route.query.zbId }).then((res) => {
            if (res.data.zbState && res.data.zbState === 1) {
              api
                .recepSaveJson({
                  zbId: this.$route.query.zbId,
                  type: this.type,
                  accounts: this.accounts,
                })
                .then((res) => {
                  this.$message.success("保存成功");
                  this.getData();
                });
            } else {
              this.$message.error("直播已开始，无法保存");
              this.$parent.$parent.getInfo();
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.reception-setting {
  .radio-item {
    margin-bottom: 60px;
    .assistants {
      display: flex;
      align-items: center;
      margin-top: 25px;
      margin-left: 25px;
    }
  }
}
</style>
<style lang="less">
.reception-setting {
  .ant-select-selection--multiple .ant-select-selection__choice__remove {
    display: none;
  }
  .ant-select-selection--multiple .ant-select-selection__choice {
    padding-right: 10px;
  }
}
</style>
