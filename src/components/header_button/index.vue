<template>
  <div class="header-container">
    <span class="i_box">
      <i v-show="isback" class="el-icon-arrow-left" @click="handleBack"></i>
    </span>
    <div class="txt">
      <h2>{{ title }}</h2>
      <p v-show="subtitle">
        {{ subtitle }}
      </p>
    </div>
    <div class="opt-btns">
      <span v-show="isedit">
        <el-tooltip :content="edittip" placement="top" effect="light">
          <i class="iconfont icon-bianji" @click="handleEdit"></i>
        </el-tooltip>
      </span>
      <span v-show="isdelete">
        <el-tooltip :content="deltip" placement="top" effect="light">
          <i class="iconfont icon-shanchu" @click="handleDelete"></i>
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
/**
 * 不知道干啥用, 暂未找到引用, 考虑删除
 */
export default {
  name: 'HeaderButton',
  /** title: 标题
   * subtitle: 副标题
   * isback: 显示返回按钮
   * isedit: 是否显示编辑按钮
   * edittip：编辑提示
   * isdelete: 是否显示删除按钮
   * deltip: 删除提示 **/

  props: ['title', 'subtitle', 'isback', 'isedit', 'edittip', 'isdelete', 'deltip'],
  data() {
    return {};
  },
  methods: {
    /** 返回 */
    handleBack() {
      this.$router.back();
    },
    /** 编辑 */
    handleEdit() {
      this.$emit('edit-click');
    },
    /** 删除 */
    handleDelete() {
      this.$emit('delete-click');
    },
  },
};
</script>

<style lang="less" scoped>
.header-container {
  position: relative;
  // background: #F2F6F9;
  i,
  h2,
  p {
    display: inline-block;
    line-height: 54px;
    margin: 0;
    vertical-align: middle;
  }
  .txt {
    display: inline-block;
    margin-bottom: 10px;
  }
  .el-icon-arrow-left {
    width: 50px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    color: #bfc1c8;
    cursor: pointer;
    font-size: 24px;
    font-weight: 600;
    margin-right: 12px;
    position: relative;
    &.el-icon-arrow-left::before {
      position: absolute;
      top: -8px;
      left: 12px;
    }
  }
  h2 {
    font-size: 18px;
    color: var(--text-color);
  }
  p {
    color: var(--text-des-color);
    font-size: 14px;
    margin-left: 12px;
    span {
      margin: 0 15px;
    }
  }
  .opt-btns {
    float: right;
    margin-top: 56px;
    padding-right: 15px;
    .icon-bianji::before {
      color: #396fff;
    }
    .icon-shanchu::before {
      color: #f05765;
      margin-left: 5px;
    }
    span {
      display: inline-block;
      // padding: 10px;
      padding-top: 10px;
      padding-left: 5px;
    }
  }
}
</style>
