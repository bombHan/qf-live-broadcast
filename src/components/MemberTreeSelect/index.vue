<template>
  <a-tree-select
    :value="value"
    style="width: 200px"
    :tree-data="treeSelectObject.treeData"
    :treeCheckable="treeSelectObject.treeCheckable"
    :placeholder="treeSelectObject.placeholder || '请选择'"
    :maxTagCount="treeSelectObject.maxTagCount || 1"
    :replaceFields="treeSelectObject.replaceFields"
    :treeDefaultExpandAll="true"
    :treeNodeFilterProp="'title'"
    @change="handleTreeChange"
    :allowClear='true'
  />
</template>

<script>
import axios from "axios";
import { TreeSelect } from "ant-design-vue";
export default {
  name: "member-tree-select",
  props: {
    treeSelectParams: {
      type: Object,
    },
    propName: {
      type: String
    },
    value: {
      type: Array
    }
  },
  watch: {
    treeSelectParams: {
      handler(val, oldVal) {
        this.treeSelectObject = Object.assign({}, this.treeSelectObject, val);
      },
      immediate: true,
      deep: true,
    },
  },
  components: {},
  data() {
    return {
      treeSelectValue: [],
      treeSelectObject: {
        fetchUrl: "/orgGroup/get_group_user_json",
        // 全部人员树：/orgGroup/get_all_sale_user_json
        // 人员权限树：/orgGroup/get_group_user_json
        treeCheckable: true,
        treeData: [],
        placeholder: "请选择",
        maxTagCount: 1,
        replaceFields: {
          children: "children",
          title: "text",
          key: "id",
          value: "id",
        },
      },
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
    };
  },
  created() {
    this.treeSelectObject = Object.assign(
      {},
      this.treeSelectObject,
      this.treeSelectParams
    );
    if(this.treeSelectObject.treeData && this.treeSelectObject.treeData.length) {

    }else {
      this.getTreeSelectDataByUrl(this.treeSelectObject.fetchUrl);
    }
  },
  methods: {
    getTreeSelectDataByUrl(fetchUrl, params = {}) {
      axios.post('/v9.0' + fetchUrl, params).then((res) => {
        this.$set(this.treeSelectObject, "treeData", res.data);
      });
    },
    handleTreeChange(value, label, extra) {
      // console.log(value, label, extra)
      // console.log(this.treeSelectValue)
      this.$emit("treeChange",value,this.propName);
    }
  },
};
</script>

<style lang="less" scoped>
</style>