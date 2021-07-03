<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :visible="!!modalShow"
    @cancel="cancel"
    @ok="ok"
    class="add-hyx-customer-modal"
    width="800px"
  >
    <div style="display: flex; height: 450px">
      <!-- 左边 -->
      <div style="width: 50%; display: flex; flex-direction: column">
        <!-- 筛选条件 -->
        <div style="padding-bottom: 20px">
          <a-input-group compact style="margin-bottom: 15px">
            <a-select v-model="searchSelect" style="width: 30%">
              <a-select-option value="custName"> 客户名称 </a-select-option>
              <a-select-option value="businessName"> 商机名称 </a-select-option>
              <a-select-option value="contacts"> 联系人 </a-select-option>
              <a-select-option value="phone"> 联系电话 </a-select-option>
            </a-select>
            <a-input style="width: 70%" v-model="searchInput" />
          </a-input-group>
          <template v-for="(item, index) in Object.keys(searchObj)">
            <a-input-group compact :key="index" style="margin-bottom: 15px">
              <a-input
                style="width: 30%; cursor: default"
                :value="getName(item)"
                readOnly
              />
              <a-range-picker
                style="width: 70%"
                v-model="searchObj[item]"
                v-if="
                  item === 'inputTime' ||
                  item === 'actionTime' ||
                  item === 'nextActionTime'
                "
              />
              <!-- 资源分组 -->
              <a-select
                style="width: 70%"
                v-model="searchObj[item]"
                v-else-if="item === 'resGroup'"
              >
                <a-select-opt-group
                  v-for="(groupItem, groupIndex) in queryResource[item]"
                  :key="groupIndex"
                >
                  <span slot="label"
                    ><a-icon type="user" />{{ groupItem.text }}</span
                  >
                  <a-select-option
                    :value="groupItemItem.id"
                    v-for="(
                      groupItemItem, groupIndexIndex
                    ) in groupItem.children"
                    :key="groupIndexIndex"
                  >
                    {{ groupItemItem.text }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
              <!-- 客户画像 -->
              <a-select
                style="width: 70%"
                v-model="searchObj[item]"
                v-else-if="item === 'custPortrait'"
                :mode="'multiple'"
                :maxTagCount="2"
              >
                <a-select-opt-group
                  v-for="(groupItem, groupIndex) in queryResource[item]"
                  :key="groupIndex"
                >
                  <span slot="label"
                    ><a-icon type="user" />{{ groupItem.groupName }}</span
                  >
                  <a-select-option
                    :value="groupItemItem.id"
                    v-for="(
                      groupItemItem, groupIndexIndex
                    ) in groupItem.childList"
                    :key="groupIndexIndex"
                  >
                    {{ groupItemItem.optionName }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
              <!-- 资源录入部门 -->
              <a-tree-select
                v-else-if="item === 'inputGroup'"
                style="width: 70%"
                v-model="searchObj[item]"
                :tree-data="queryResource[item]"
                search-placeholder="请选择"
                :replaceFields="{
                  children: 'children',
                  title: 'text',
                  key: 'id',
                  value: 'id',
                }"
              />
              <!-- 资源来源 -->
              <a-select
                v-else-if="item === 'resSource'"
                style="width: 70%"
                v-model="searchObj[item]"
              >
                <a-select-option
                  v-for="(groupItem, groupIndex) in queryResource[item]"
                  :value="groupItem.value"
                  :key="groupIndex"
                >
                  {{ groupItem.name }}
                </a-select-option>
              </a-select>
            </a-input-group>
          </template>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <a @click="clickSet">设置查询项</a>
            <a-button
              type="primary"
              icon="search"
              style="width: 50px"
              @click="search"
            />
          </div>
        </div>
        <!-- 选中客户 -->
        <div
          style="
            border-top: 1px solid #ccc;
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          "
        >
          <div style="padding: 15px 0">选中的客户</div>
          <div style="overflow: auto">
            <div
              v-for="(item, index) in selectedList"
              :key="index"
              style="margin-bottom: 10px;border;1px solid #ccc;background:#f7f7f7;padding: 5px 10px;display:flex;justify-content:space-between;align-items:center"
            >
              <Tooltip
                v-if="
                  item.custName.length +
                    (item.contacts || '').length +
                    (item.phone || '').length >
                  22
                "
                :str="`${item.custName} - ${item.contacts} - ${item.phone}`"
                :max="22"
              />
              <span v-else>
                {{ item.custName }} - {{ item.contacts }}
                {{ item.contacts ? "-" : "" }} {{ item.phone }}</span
              >
              <a-icon
                type="close"
                style="cursor: pointer"
                @click="deleteCustomer(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 右边 -->
      <div style="width: 50%; padding: 0 20px; overflowY: auto;overflowX: hidden;">
        <a-spin :spinning="searchLoading" style="width: 100%">
          <a-checkbox
            v-for="(item, index) in dataList"
            :checked="isChecked(item)"
            :key="index"
            @change="
              (e) => {
                checkChange(e, item);
              }
            "
            :disabled="!item.phone"
          >
            <div class="checkbox-item">
              <div class="checkbox-item-top">
                <div>
                  <span class="title">客户名称：</span>
                  {{ item.custName }}
                </div>
                <div>
                  <span class="title">联系人：</span>
                  <span style="margin-right: 20px">
                    <Tooltip :str="item.contacts" :max="4" />
                  </span>
                  <span class="title">常用电话：</span>
                  <span>{{ item.phone }}</span>
                </div>
              </div>
              <div class="checkbox-item-bottom">
                <div
                  v-for="(listItem, listIndex) in item.business"
                  :key="listIndex"
                >
                  {{ listIndex + 1 }}. {{ listItem.name }}
                </div>
              </div>
            </div>
          </a-checkbox>
        </a-spin>
      </div>
    </div>
    <a-modal
      :maskClosable="false"
      title="设置查询项"
      v-if="!!setModalShow"
      :visible="!!setModalShow"
      @cancel="setCancel"
      @ok="setOk"
    >
      <a-row>
        <a-checkbox-group :value="setModalShow" @change="changeSet">
          <a-col
            v-for="(item, index) in queryItemList"
            :key="index"
            span="8"
            style="margin-bottom: 10px"
          >
            <a-checkbox :value="item.key">{{ item.name }}</a-checkbox>
          </a-col>
        </a-checkbox-group>
      </a-row>
      <div style="position: absolute; bottom: 15px; right: 165px">
        {{ setModalShow.length }} / 3
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import Tooltip from "@/components/Tooltip.vue";
import api from "../../../api/api";
import axios from "axios";
import moment from "moment";
export default {
  name: "addHyxCustomerModal",
  props: {
    modalShow: {
      type: [String, Boolean],
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "添加客户",
      required: false,
    },
  },
  components: {
    Tooltip,
  },
  data() {
    return {
      moment,
      searchSelect: "custName", // 第一个筛选条件下拉框的值
      searchInput: "", // 第一个筛选条件的输入值
      searchObj: {}, // 设置的查询项
      setModalShow: false, // 设置查询项弹窗，显示的时候是个数组
      queryItemList: [
        { name: "资源分组", key: "resGroup" },
        { name: "资源来源", key: "resSource" },
        { name: "添加/分配时间", key: "inputTime" },
        { name: "最近联系时间", key: "actionTime" },
        { name: "下次联系时间", key: "nextActionTime" },
        { name: "客户画像", key: "custPortrait" },
        { name: "资源录入部门", key: "inputGroup" },
      ], // 设置查询项列表
      queryResource: {
        resGroup: [], // 资源分组二级下拉列表
        resSource: [], // 资源来源平铺列表
        custPortrait: [], // 客户画像二级下拉列表
        inputGroup: [], // 资源录入部门 组织结构树
      }, // 查询项对应的下拉列表
      searchLoading: false,
      dataList: [], // 搜索出来的列表
      selectedList: [], // 选中客户
    };
  },
  created() {
    this.search();
    this.getQueryResource();
  },
  methods: {
    // s获取每个查询项的下拉列表
    getQueryResource() {
      axios
        .all([
          api.orgGroupGet_group_json(), // 资源录入部门组织树
          api.taoCustomerGetCustPortraitList(), // 客户画像二级列表
          api.resGroupGet_res_group_json(), // 资源分组二级列表
          api.addcustSearchs(), // 获取查询项以及resSource资源来源平铺列表
        ])
        .then((res) => {
          console.log(
            "部门组织树",
            res[0],
            "客户画像二级列表",
            res[1],
            "资源分组二级列表",
            res[2],
            "获取查询项以及resSource资源来源平铺列表",
            res[3]
          );
          this.queryResource = {
            resGroup: res[2].data, // 资源分组二级下拉列表
            resSource: res[3].data.resSource, // 资源来源平铺列表
            custPortrait: res[1].data, // 客户画像二级下拉列表
            inputGroup: res[0], // 资源录入部门 组织结构树
          }; // 查询项对应的下拉列表
        });
    },
    // 点击设置查询项
    clickSet() {
      this.setModalShow = Object.keys(this.searchObj) || [];
    },
    // 设置查询项checkbox
    changeSet(value) {
      console.log(value);
      if (value.length > 3) {
        this.$message.error("最多只能选择3个查询项");
      } else {
        this.setModalShow = value;
      }
    },
    // 设置项根据key找到对应中文
    getName(key) {
      const targetObj = this.queryItemList.find((item) => {
        return item.key === key;
      });
      return targetObj.name;
    },
    // 设置查询项弹窗ok
    setOk() {
      let newObj = {};
      this.setModalShow.forEach((item) => {
        if (
          item === "resGroup" ||
          item === "resSource" ||
          item === "inputGroup"
        ) {
          newObj[item] = null;
        } else {
          newObj[item] = [];
        }
      });
      this.searchObj = newObj;
      this.setModalShow = false;
      console.log(this.searchObj);
      // this.searchObj = {
      //   resGroup: null,
      //   resSource: null,
      //   inputTime: [],
      //   actionTime: [],
      //   nextActionTime: [],
      //   custPortrait: [],
      //   inputGroup: null,
      // };
    },
    // 设置查询项弹窗cancel
    setCancel() {
      this.setModalShow = false;
    },
    // 点击搜索
    search() {
      // this.searchObj = {
      //   resGroup: null,
      //   resSource: null,
      //   inputTime: [],
      //   actionTime: [],
      //   nextActionTime: [],
      //   custPortrait: [],
      //   inputGroup: null,
      // };
      let searchObj = {};
      Object.keys(this.searchObj).forEach((item) => {
        if (this.searchObj[item] instanceof Array) {
          if (item === "custPortrait") {
            searchObj[item] = this.searchObj[item].join(",")
              ? this.searchObj[item].join(",")
              : null;
          } else {
            searchObj[item] = this.searchObj[item].join(",")
              ? `${moment(this.searchObj[item][0]).format(
                  "YYYY-MM-DD"
                )},${moment(this.searchObj[item][1]).format("YYYY-MM-DD")}`
              : null;
          }
        } else {
          searchObj[item] = this.searchObj[item];
        }
      });
      console.log(
        "搜索！！！",
        this.searchSelect,
        this.searchInput,
        this.searchObj,
        searchObj
      );
      this.searchLoading = true;
      api
        .addcustList({
          queryType: this.searchSelect,
          queryText: this.searchInput,
          ...searchObj,
        })
        .then((res) => {
          console.log(res);
          this.dataList = res.data;
          // this.dataList = [
          //   {
          //     custId: 1,
          //     custName: "哈哈哈哈好",
          //     contacts: "申达股份",
          //     phone: "13989898989",
          //     business: [
          //       { name: "商机商机" },
          //       { name: "asdsdsadsa" },
          //       { name: "IP的覅偶京东方就色不能" },
          //     ],
          //   },
          //   {
          //     custId: 2,
          //     custName: "fff",
          //     contacts: "s份",
          //     phone: "13967898989",
          //     business: [{ name: "111" }, { name: "asdsdsadsa" }],
          //   },
          // ];
          this.searchLoading = false;
        })
        .catch((e) => {
          this.searchLoading = false;
        });
    },
    // 判断右边的checkbox是否勾上
    isChecked(targetObj) {
      let flag = false;
      this.selectedList.forEach((item) => {
        if (item.custId === targetObj.custId) {
          flag = true;
        }
      });
      return flag;
    },
    // 右边checkboxchange事件
    checkChange(e, targetObj) {
      console.log(e.target.checked, targetObj);
      let isExist = false;
      this.selectedList.forEach((item) => {
        if (item.custId === targetObj.custId) {
          isExist = true;
        }
      });
      if (isExist) {
        this.selectedList = this.selectedList.filter((item) => {
          return item.custId !== targetObj.custId;
        });
      } else {
        this.selectedList.push(targetObj);
      }
    },
    // 删除客户
    deleteCustomer(targetObj) {
      this.selectedList = this.selectedList.filter((item) => {
        return item.custId !== targetObj.custId;
      });
    },
    // 点击确定
    ok() {
      console.log("okokokokok");
      const ids = this.selectedList.map((item) => {
        return item.custId;
      });
      if (this.selectedList.length > 0) {
        this.$emit("ok", ids, this.selectedList);
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
.add-hyx-customer-modal {
  .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
    margin: 0;
    margin-bottom: 15px;
    .checkbox-item {
      padding: 10px;
      border: 1px solid #ccc;
      width: 310px;
      .checkbox-item-top {
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        .title {
          color: #b6b6b6;
        }
      }
      .checkbox-item-bottom {
        padding-top: 10px;
      }
    }
  }
}
</style>
