<template>
  <tg-card
    class="project-collection"
    @rect:update="onRectUpdate"
    overflowInBody
    :style="{
      height: isFromLocalLife || isFromLiveDouyin ? 'calc(100vh - 145px)' : 'calc(100vh - 190px)',
    }"
  >
    <div class="header">
      <span class="label">应收金额：</span>
      <span class="text">{{ header_money.receivable }}</span>
      <span class="label">已核销金额：</span>
      <span class="text">{{ header_money.write_off }}</span>
      <span class="label">未核销金额：</span>
      <span class="text">{{ header_money.not_write_off }}</span>
      <div class="reverse-div">
        <el-checkbox @change="reload" v-model="isHideReversed" size="small">
          <span>隐藏已冲销数据</span>
        </el-checkbox>
      </div>
    </div>
    <el-table stripe border v-loading="loading" :data="data" v-bind="tableProps">
      <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      <div style="position: static" slot="empty">
        <empty-common detail-text="暂无数据"></empty-common>
      </div>
    </el-table>
    <achievement ref="achievementRef" @ok="reload()" />
    <invoicelist ref="invoicelistRef" />
    <InvoiceDetail ref="invoiceDialogRef" />
    <first-step ref="firstStepRef" @submit="reload()" />
  </tg-card>
</template>

<script src="./collection.tsx"></script>

<style lang="less" scoped>
/deep/ .el-table {
  a,
  .cell,
  .status {
    font-size: 12px;
  }
}
@labelColor: var(--text-third-color);
@defaultColor: var(--text-color);

.project-collection {
  .reverse-div {
    display: inline-block;
    /deep/ .el-checkbox__input {
      margin-top: -1px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 4px;
        }
      }
    }
  }
  /deep/ .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 150px;
      text-align: left;
      margin-right: -40px;
    }
  }
  line-height: 1;
  color: @defaultColor;
  position: relative;
  padding: 0 18px 18px 18px;
  .tabs-operation {
    position: absolute;
    top: -48px;
    right: 18px;
    height: 48px;
    display: flex;
    align-items: center;
  }

  .header {
    line-height: 32px;
    height: 32px;
    margin: 12px 0;
    padding: 0px;

    .label {
      font-weight: 400;
      font-size: 14px;
      color: @labelColor;
    }
    .text {
      margin-right: 32px;
      color: @defaultColor;
      font-weight: 400;
      font-size: 16px;
    }
  }
  .tg-button {
    color: var(--theme-color);
    font-size: 14px;
    border: 0;
    background: transparent;
    padding: 0;
    outline: 0;
    &:hover {
      cursor: pointer;
    }
  }
  .tg-button[disabled] {
    color: var(--text-des-color);
    &:hover {
      cursor: not-allowed;
    }
  }
  .tg-button + .tg-button {
    margin-left: 10px;
  }
  .operation-column {
    display: flex;
  }

  .column-cell {
    display: flex;
    flex-direction: column;
    &-start {
      justify-content: flex-start;
    }
    .label {
      color: @labelColor;
    }
    .column-cell-line {
      display: flex;
    }
  }

  .table_achievement {
    .text {
      color: var(--text-des-color);
    }
  }

  .cell-price-max {
    width: 100%;
    max-width: 140px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.pop-container {
  width: 316px;
  color: @defaultColor;
  padding: 8px;
  .label {
    color: @labelColor;
  }
  .pop-header {
    font-weight: 600;
  }
  .pop-row {
    margin-top: 10px;
    display: flex;
    .label {
      width: 70px;
      text-align: right;
    }
    .text {
      flex: 1;
    }
  }
}
</style>
