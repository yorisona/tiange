<template>
  <el-popover trigger="hover" popper-class="pop-receivable" placement="bottom-end">
    <div class="pop-receivable-detail">
      <div class="receivable-detail-content">
        <div class="detail-header">
          <div v-if="showSettlementUid" class="header column-width">结算单编号</div>
          <div class="header column-width">{{ firstColumnHeader }}</div>
          <div class="header right column-width">核销金额 (元)</div>
          <div class="header column-width">核销人/{{ dateTextComputed }}</div>
        </div>
        <div class="detail-body">
          <div class="body-row" v-for="(row, index) in list" :key="index">
            <div v-if="showSettlementUid" class="rg right column-width">
              <span>{{ row.settlement_uid }}</span>
            </div>
            <div v-if="type === 'receivable'" class="rg right column-width">
              <span
                :style="
                  String(row.write_off_amount).startsWith('-') ? 'color: var(--error-color)' : ''
                "
                >{{ row.receipt_uid }}</span
              >
            </div>
            <div v-if="type === 'receive'" class="rg right column-width">
              <span
                :style="
                  String(row.write_off_amount).startsWith('-') ? 'color: var(--error-color)' : ''
                "
                >{{ row.receivable_uid }}</span
              >
            </div>
            <div v-if="type === 'payable'" class="rg right column-width">
              <span
                :style="
                  String(row.write_off_amount).startsWith('-') ? 'color: var(--error-color)' : ''
                "
              >
                {{ row.cost_id }}
              </span>
            </div>
            <div v-if="type === 'commonBusinessPayableActual'" class="rg right column-width">
              <span
                :style="
                  String(row.write_off_amount).startsWith('-') ? 'color: var(--error-color)' : ''
                "
              >
                {{ row.payable_uid }}
              </span>
            </div>

            <div class="rg right column-width">
              <span :style="row.write_off_amount < 0 ? 'color: var(--error-color)' : ''">{{
                formatAmount(row.write_off_amount, '')
              }}</span>
            </div>
            <div class="rg column-width">
              <div>
                <p>{{ row.write_off_user }}</p>
                <span class="write-date">{{ row.write_off_time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <hr> -->
      <!-- <el-table
        stripe
        class="customer-table"
        max-height="310"
        :data="list"
        :header-cell-style="{
          height: '42px',
          padding: '0',
          color: '#A4B2C2',
          fontWeight: 400,
          border: 'none',
        }"
        :cell-style="{
          border: 'none',
        }"
      >
        <el-table-column v-if="type === 'receivable'" align="left" label="收款编号" min-width="168">
          <template slot-scope="scoped">
            <span :style="scoped.row.receipt_uid.endsWith('-D') ? 'color: var(--error-color)' : ''">{{
              scoped.row.receipt_uid
            }}</span></template
          >
        </el-table-column>
        <el-table-column v-if="type === 'receive'" align="left" label="应收编号" min-width="156">
          <template slot-scope="scoped">{{ scoped.row.receivable_uid }}</template>
        </el-table-column>
        <el-table-column v-if="type === 'payable'" align="left" label="付款ID" min-width="156">
          <template slot-scope="scoped">
            <span :style="String(scoped.row.cost_id).endsWith('-D') ? 'color: var(--error-color)' : ''">
              {{ scoped.row.cost_id }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === 'commonBusinessPayableActual'"
          align="left"
          label="应付编号"
          min-width="156"
        >
          <template slot-scope="scoped">{{ scoped.row.payable_uid }}</template>
        </el-table-column>
        <el-table-column align="right" label="核销金额" min-width="128">
          <template slot-scope="scoped">
            <span :style="scoped.row.write_off_amount < 0 ? 'color: var(--error-color)' : ''">{{
              numberMoneyFormat(scoped.row.write_off_amount, 2)
            }}</span></template
          >
        </el-table-column>
        <el-table-column align="left" label="核销人/日期" min-width="102">
          <template slot-scope="scoped">
            <p>{{ scoped.row.write_off_user }}</p>
            <span class="write-date">{{ scoped.row.write_off_time }}</span>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
    <tg-button type="link" slot="reference" :style="{ color: btncolor }">{{ btntitle }}</tg-button>
  </el-popover>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: 'receivable',
    },
    btntitle: {
      type: String,
      default: '预览',
    },
    btncolor: {
      type: String,
      default: '#2877ff',
    },
    showSettlementUid: {
      type: Boolean,
      default: false,
    },
    dateText: {
      type: String,
      default: () => '日期',
    },
  },
  setup(props, ctx) {
    const firstColumnHeader = computed(() => {
      let header = '';
      if (props.type === 'receivable') {
        header = '单据编号';
      } else if (props.type === 'receive') {
        header = '应收编号';
      } else if (props.type === 'payable') {
        header = '单据编号';
      } else if (props.type === 'commonBusinessPayableActual') {
        header = '应付编号';
      }
      return header;
    });

    const dateTextComputed = computed(() => props.dateText);

    return {
      dateTextComputed,
      firstColumnHeader,
      formatAmount,
    };
  },
});
</script>

<style lang="less" scoped>
@import './index.less';
.button-item {
  padding: 0;
  font-weight: 400;
}
.pop-receivable-detail {
  /deep/ .el-table {
    .cell {
      line-height: 18px;
    }
  }
  .detail-body {
    max-height: 200px;
    overflow-y: auto;
    overflow-y: overlay;
  }
}
</style>
