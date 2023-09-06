<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#steps {
  .steps {
    padding: 6px 0 20px;
  }
  ::v-deep .el-steps {
    .el-step__icon {
      width: 32px;
      height: 32px;
      font-size: 18px;
    }
    .el-step__head {
      .el-step__line {
        background-color: #dfe2e9;
        width: 80%;
        left: 60%;
      }
      .el-step__icon-inner {
        font-weight: 400;
      }
      &.is-wait {
        color: #c0c3cb;
        .el-step__icon.is-text {
          border-color: #dfe2e9;
        }
      }
      &.is-process {
        color: #a1a6b2;
        .el-step__icon.is-text {
          border-color: #dfe2e9;
        }
      }
      &.is-success {
        color: $color-primary;
        border-color: $color-primary;
        .el-step__icon.is-text {
          background: $color-primary;
          color: #fff;
          font-size: 20px;
        }
        .el-step__line {
          background-color: $color-primary;
        }
      }
    }
    .el-step__title {
      font-size: 14px;
      line-height: 30px;
      &.is-wait {
        color: #c0c3cb;
      }
      &.is-process {
        color: #a1a6b2;
      }
      &.is-success {
        color: $color-primary;
      }
    }
    .el-step.is-horizontal .el-step__line {
      top: 17px;
    }
  }
}
</style>

<template>
  <div id="steps">
    <el-steps :active="$props.active" finish-status="success" align-center class="steps">
      <el-step title="需求设置"></el-step>
      <el-step title="匹配主播"></el-step>
      <el-step title="生成方案"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'steps',
  props: ['active'],
};
</script>
