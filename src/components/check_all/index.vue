<template>
  <div class="checkall-container">
    <div class="sale-chance-wrap" v-if="dataitems && dataitems.length > 0">
      <p>
        <el-checkbox v-model="selection.checkAll" @change="handleCheckAllChange">{{
          selection.checkAll ? '反选' : '全选'
        }}</el-checkbox>
      </p>
      <el-checkbox-group v-model="currselectitems" @change="handleCheckedChange">
        <el-checkbox
          class="chance-checkbox"
          v-for="item in dataitems"
          :label="item[value]"
          :key="item[value]"
          >{{ item[label] }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
/**
 * 创始人组件 1处使用, 后期考虑删除
 */
export default {
  name: 'CheckAll',
  props: [
    /**  数据源 */
    'dataitems',
    /**  双向绑定值 */
    'value',
    /**  label */
    'label',
    /**  选中项[] */
    'selectitems',
  ],
  data() {
    return {
      selection: {
        checkAll: false,
        isIndeterminate: false,
      },
      currselectitems: [],
    };
  },
  created() {
    this.currselectitems = JSON.parse(JSON.stringify(this.selectitems));
    if (this.selectitems.length === this.dataitems.length) {
      this.selection.checkAll = true;
    } else {
      if (this.selectitems.length > 0) this.selection.isIndeterminate = true;
    }
  },
  methods: {
    // 初始化
    init() {
      this.selection = {
        checkAll: false,
        isIndeterminate: false,
      };
      this.currselectitems = [];
    },
    // 全选 / 反选
    handleCheckAllChange(val) {
      this.currselectitems = val ? this.dataitems.map(item => item[this.value]) : [];
      this.selection.checkAll = val;
      this.$emit('check-all-click', val);
    },
    // 选择项
    handleCheckedChange() {
      this.selection.checkAll = this.currselectitems.length === this.dataitems.length;
      this.selection.isIndeterminate =
        this.currselectitems.length > 0 && this.currselectitems.length < this.dataitems.length;
      this.$emit('check-click', JSON.parse(JSON.stringify(this.currselectitems)));
    },
    // 清空
    handelClear() {
      this.selection = {
        checkAll: false,
        isIndeterminate: false,
      };
      this.currselectitems = [];
    },
  },
};
</script>

<style lang="less" scoped>
.checkall-container {
  .sale-chance-wrap {
    background-color: #f6f6f6;
    padding: 5px 12px;
    line-height: 26px;
    margin: 10px 0;
    .chance-checkbox {
      margin: 0 5px 0 0;
      min-width: 110px;
    }
  }
}
</style>
