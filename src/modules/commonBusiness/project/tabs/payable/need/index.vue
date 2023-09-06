<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-28 09:55:32
-->
<template>
  <tg-card
    class="tg-common-business-tab-payable-need flex-auto"
    @rect:update="onRectUpdate"
    v-bind="cardProps"
  >
    <div class="btns-line mgb-12 mgt-12">
      <!--      <tg-button class="payment-btn" type="primary" icon="ico-btn-add" @click="showPaymentDialog"-->
      <!--        >付款申请</tg-button-->
      <!--      >-->
      <label>应付金额：</label>
      <span>{{ formatAmount(info.payable) }}</span>
      <label>已核销金额：</label>
      <span>{{ formatAmount(info.write_off) }}</span>
      <label>未核销金额：</label>
      <span>{{ formatAmount(info.not_write_off) }}</span>
      <div class="reverse-div">
        <el-checkbox @change="reload" v-model="isHideReversed" size="small">
          <span>隐藏已冲销数据</span>
        </el-checkbox>
      </div>
    </div>
    <!-- <div class="table-container"> -->
    <el-table stripe border :data="list" v-loading="loading" v-bind="tableProps">
      <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      <!-- <el-table-column align="left" label="应付编号" min-width="194">
        <template slot-scope="scope">
          <div :class="scope.row.reversed_id ? 'reverse-red' : ''">
            {{ scope.row.payable_uid }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="应付金额" min-width="140">
        <template slot="header">
          <span class="cell-price-max">应付金额</span>
        </template>
        <template slot-scope="scope">
          <div :class="scope.row.reversed_id ? 'reverse-red cell-price-max' : 'cell-price-max'">
            {{ numberMoneyFormat(scope.row.payable_amount, 2) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建日期" min-width="150">
        <template slot-scope="scope">{{ scope.row.create_date }}</template>
      </el-table-column>
      <el-table-column align="left" label="结算单" min-width="222">
        <template slot-scope="scope">
          <div :class="scope.row.reversed_id ? 'reverse-red' : ''">
            {{ scope.row.settlement_uid }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="核销状态" min-width="176">
        <template slot-scope="scope">
          <div class="line-info">
            <p class="label-50">状态：</p>
            <p v-if="scope.row.write_off_status === 2" class="write-on">已核销</p>
            <p v-else-if="scope.row.write_off_status === 1" class="write-off">部分核销</p>
            <p v-else class="write-off">未核销</p>
          </div>
          <div v-if="scope.row.write_off_infos.length > 0" class="line-info">
            <p class="label-50">详情：</p>
            <write-list-pop :list="scope.row.write_off_infos" type="payable"></write-list-pop>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="78">
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.write_off_status !== 2 &&
              Permission.common_business_write_off &&
              !scope.row.reverse_id &&
              !scope.row.reversed_id
            "
            type="text"
            class="button-item"
            :id="scope.row.payable_uid"
            @click="handleWriteOff(scope.row)"
            >核销</el-button
          > -->
      <!-- <el-button
              type="text"
              class="button-item"
              :id="scope.row.payable_uid"
              @click="handleReserve(scope.row)"
              >冲销</el-button
            > -->
      <!-- </template>
      </el-table-column> -->
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
    <!-- </div> -->
    <first-step ref="firstStepRef" @submit="getList" />
    <!-- <reverseOrderDialog ref="reverseOrderDialogRef" />
    <tg-mask-loading :visible="writeOffLoading" content="正在提交冲销，请稍候..." /> -->
    <payment-dialog
      v-if="paymentDialogVisible"
      :visible.sync="paymentDialogVisible"
      :data="paymentData"
      :projectType="3"
      @dialog:close="paymentDialogVisible = false"
    ></payment-dialog>
  </tg-card>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import '../index.less';
.tg-common-business-tab-payable-need {
  .reverse-div {
    display: inline-block;
    margin-bottom: 0;
    .el-checkbox__input {
      margin-top: 0;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 3.5px;
        }
      }
    }
  }
  .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 150px;
      text-align: left;
      margin-right: -40px;
    }
  }
  .el-table {
    a,
    .cell,
    .status {
      font-size: 12px;
    }
    .tg-button {
      margin-right: 10px;
    }
  }
}
</style>
