<!--
 * @Author: 矢车
 * @Date: 2020-11-28 10:49:13
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-26 14:22:06
 * @Description: 供应商管理-供应商合同-结算单详情-结算情况
-->

<template>
  <div>
    <div class="block-content attachment-list">
      <el-table
        stripe
        :data="tableData"
        :header-cell-style="{
          backgroundColor: 'var(--table-thead-th-bg-color)',
          color: 'var(--text-second-color)',
        }"
        :cell-style="{ borderBottom: '1px solid #ebeef5' }"
      >
        <el-table-column
          width="60"
          label="序号"
          :formatter="(row, column, cellValue, index) => index + 1"
          align="center"
        ></el-table-column>
        <el-table-column prop="settle_amount" label="结算金额" align="center">
          <template slot-scope="scope">
            <span>￥{{ scope.row.settle_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="settle_way" label="结算方式" align="center">
          <template slot-scope="scope">
            <span>{{ enumSettleWay(scope.row.settlement_way) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" align="center"></el-table-column>
        <el-table-column prop="end_date" label="结束日期" align="center"></el-table-column>
        <!-- <el-table-column prop="done_amount" label="已付金额" align="center">
          <template slot-scope="scope">
            <span>￥{{ scope.row.done_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wait_amount" label="待付金额" align="center">
          <template slot-scope="scope">
            <span>￥{{ scope.row.wait_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoice_amount" label="已收发票金额" align="center">
          <template slot-scope="scope">
            <span>￥{{ scope.row.invoice_amount }}</span>
          </template></el-table-column
        > -->
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.comment || scope.row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { enumSettleWay } from '@/utils/enumFunc';

export default {
  name: 'SettleCondition',
  props: ['tableData'],
  methods: {
    enumSettleWay,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public.scss';
::v-deep .el-table__body-wrapper {
  margin-bottom: 10px;
}
.content-block {
  .block-content {
    padding: 10px 20px;
    ::v-deep .el-table {
      border-radius: 4px !important;
      .has-gutter {
        tr:first-child {
          height: 40px;
        }
      }
      tr {
        height: 58px;

        th > .cell {
          font-weight: 600;
          color: var(--text-des-color);
          font-size: 14px;
          background: #fafafa;
        }
      }
    }
  }
}
::v-deep .el-table {
  .cell {
    padding-left: 0 !important;
  }
}
</style>
