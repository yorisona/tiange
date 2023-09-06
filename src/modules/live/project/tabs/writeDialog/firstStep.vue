<!--
 * @Author: 肖槿
 * @Date: 2021-06-04 17:05:29
 * @Description: 核销第一步弹框
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-22 18:01:15
 * @FilePath: \goumee-star-frontend\src\modules\live\project\tabs\writeDialog\firstStep.vue
-->
<template>
  <el-dialog
    class="tg-dialog-classic tg-dialog-vcenter-new write-off-first"
    :visible="writeOffVisible"
    width="868px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="closeHandler"
  >
    <template #title>{{ pageConst.dialogTitle }}</template>
    <div class="write-off-main">
      <el-alert
        v-if="!nextFlag"
        style="color: #ff7a36; height: 40px"
        :closable="false"
        :title="pageConst.alert"
        type="warning"
        show-icon
      />
      <div class="write-amount">
        <span>{{ pageConst.amountText }}</span>
        <span class="amount">{{ notAmount }}</span>
      </div>
      <template v-if="nextFlag">
        <div class="write-off-query write-off-next">
          <div class="next-head">
            <span class="label">{{ pageConst.queryText }}</span>
            <div style="margin-left: auto; color: #a4b2c2; margin-right: 5px">
              <el-popover placement="top" trigger="hover" :content="pageConst.searchTip">
                <div class="tip" slot="reference">
                  <tg-icon name="ico-question"></tg-icon>
                </div>
              </el-popover>
            </div>

            <el-input
              v-model="achievementId"
              class="next-input"
              size="mini"
              @keypress.enter.native="searchHandler"
              :placeholder="pageConst.queryPlaceholder"
            >
              <span slot="suffix" class="el-icon-search suffix-search" @click="searchHandler" />
            </el-input>
          </div>
          <div class="query-table">
            <el-table stripe :data="queryData" height="88px">
              <el-table-column
                v-for="(col, colIndex) in pageConst.secondColumn"
                v-bind="col"
                :key="colIndex"
              />
              <template #empty>
                <div>
                  <div style="margin-top: -45px">
                    <span style="font-size: 14px; color: var(--text-third-color)">暂无数据</span>
                  </div>
                </div>
              </template>
            </el-table>
          </div>
        </div>
        <div class="write-off-selected write-off-next">
          <div class="next-head">
            <span class="label">{{ pageConst.writeOffText }}</span>
          </div>
          <div class="selected-table">
            <el-table stripe :data="selectedYxywIsActualIncome" height="260px">
              <el-table-column
                v-for="(col, colIndex) in thirdColumn"
                v-bind="col"
                :key="colIndex"
              />
              <template #empty>
                <div class="selected-table-empty">
                  <empty-common img-height="100" img-width="150"></empty-common>
                </div>
              </template>
            </el-table>
          </div>
        </div>
      </template>
      <div v-else class="write-off-table">
        <div class="table-title">{{ pageConst.projectText }}</div>
        <el-table
          stripe
          v-loading="loading"
          :data="data"
          height="426px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-for="(col, colIndex) in pageConst.firstColumn"
            v-bind="col"
            :key="colIndex"
          />
          <template #empty>
            <div class="pdt-20">
              <empty-common img-height="100" img-width="150"></empty-common>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <template #footer>
      <tg-button-line justify-content="center">
        <tg-button @click="closeHandler">取消</tg-button>
        <tg-button
          v-if="nextFlag"
          :disabled="selectedYxywIsActualIncome.length === 0"
          type="primary"
          @click="submitHandler"
        >
          提交
        </tg-button>
        <tg-button v-else type="primary" @click="nextStep">下一步</tg-button>
      </tg-button-line>
    </template>
  </el-dialog>
</template>

<script src="./firstStep.ts"></script>

<style lang="less">
.write-off-first {
  .tg-btn {
    line-height: 26px !important;
    height: 28px !important;
    font-size: 12px !important;
    &.tg-btn-default {
      color: var(--text-second-color);
    }
  }
  & .write-off-main {
    & .write-amount {
      font-size: 14px;
      color: var(--text-color);
      line-height: 18px;
      padding: 22px 24px 16px 24px;
      & .amount {
        color: #ff7a36;
        font-size: 18px;
        padding-left: 12px;
        font-weight: 600;
      }
      & .tip {
        font-weight: 400;
        float: right;
      }
    }
    & .write-off-table {
      padding: 0 24px;
      & .table-title {
        line-height: 40px;
        font-size: 14px;
        color: var(--text-color);
        font-weight: 600;
      }
      & .el-table__row td {
        border: none !important;
        padding: 11px 0;
      }

      & .el-table::before {
        display: none;
      }
    }
    & .write-off-next {
      border: 1px solid rgba(164, 178, 194, 0.3);
      border-radius: 2px;
      & .next-head {
        padding: 0 18px;
        background: rgba(164, 178, 194, 0.09);
        height: 40px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 18px;
        & .next-input {
          width: 182px;
        }
        & .label {
          font-size: 14px;
          color: var(--text-color);
        }

        & .suffix-search {
          font-size: 14px;
          cursor: pointer;
          margin: 8px 6px 0 0;
        }
      }
    }
    & .write-off-query {
      & .el-table__empty-block {
        min-height: 10px;
        overflow: hidden;
      }
    }
    & .write-off-query,
    & .write-off-selected {
      margin: 0 24px;
      & .query-table,
      & .selected-table {
        margin: 0 18px;
        & .el-table__header-wrapper th.is-leaf {
          background: #fff;
        }
        & .el-table__row td {
          border: none !important;
          padding: 7px 0;
        }
      }

      & .query-table {
        & .el-table::before {
          display: none;
        }
      }
    }

    & .write-off-selected {
      margin-top: 18px;
      margin-bottom: 24px;
      & .selected-table {
        //margin-right: 0;
        & .el-table__header-wrapper th.is-leaf {
          background: #fff;
        }
        & .selected-table-empty {
          margin-top: -25px;

          & span {
            position: relative;
            top: -35px;
          }
        }
      }
    }
  }
  & .el-table th > .cell {
    color: var(--text-color);
  }
}
.tg-page-container .write-off-first .el-table thead > tr > th:last-child {
  background: rgba(164, 178, 194, 0.1);
}
</style>
