<template>
  <div class="invoice-detail-dialog">
    <el-dialog
      class="tg-dialog-classic"
      :visible="visible"
      width="550px"
      :center="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeAction"
    >
      <template #title>{{ title }}</template>
      <div class="dialog-height-scroll">
        <div v-for="(item, index) in list" :key="index" class="list">
          <h3 class="list-item-title">凭证{{ index + 1 }}</h3>
          <div class="list-item">
            <img
              class="list-item-img"
              :src="item.pic_url + `?Authorization=${getToken()}`"
              alt=""
              @click="checkoutPaymentBtn(item.pic_url + `?Authorization=${getToken()}`)"
            />
            <div class="list-item-detail">
              <p>
                <span class="label">发票号码：</span>
                <span>{{ item.invoice_num | emptyData }}</span>
              </p>
              <p>
                <span class="label">开票时间：</span>
                <span>{{ item.invoice_date.replace(/-/g, '.') | emptyData }}</span>
              </p>
              <p>
                <span class="label">开票金额：</span>
                <span>{{ numberMoneyFormat(item.amount, 2) }}</span>
              </p>
              <div style="display: flex">
                <span class="label">开票公司：</span>
                <p class="line-clamp-1" style="width: 210px">
                  {{ item.institution | emptyData }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { numberMoneyFormat } from '@/utils/formatMoney';
import { getToken } from '../../../utils/token';
import invoice from '@/modules/live/project/dialog/invoice';

export default {
  name: 'FinanceCertificate',
  props: {
    title: {
      type: String,
      default: '发票详情',
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    emptyData(data) {
      if (data === '' || data === undefined || data === null) {
        return '--';
      } else {
        return data;
      }
    },
  },
  methods: {
    getToken,
    numberMoneyFormat,
    checkoutPaymentBtn(link) {
      invoice.showDetail(link);
    },
    closeAction() {
      this.$emit('closeFinanceInvoiceDetailAction');
    },
  },
};
</script>

<style scoped lang="less">
.invoice-detail-dialog {
  .el-dialog__body {
    background: #f2f6f9 !important;
    max-height: 530px;
    //max-height: 900px;
    overflow-y: auto;
  }
  .dialog-height-scroll {
    max-height: 530px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 1px;
    }
  }
  /deep/ .el-dialog {
    padding: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    > .el-dialog__body {
      overflow: auto;
      color: #666666;
    }
  }
  .list {
    margin-bottom: 20px;
    padding: 0 20px;
    .list-item-title {
      font-size: 14px;
      line-height: 10px;
      margin-top: 20px;
      color: var(--text-color);
    }
    .list-item {
      height: 152px;
      background: #f6f6f6;
      border-radius: 4px;
      padding: 16px;
      display: flex;
      .list-item-img {
        display: block;
        width: 186px;
        height: 120px;
        margin-right: 10px;
        cursor: pointer;
      }
      .list-item-detail {
        flex: 1;
        line-height: 31px;
        .label {
          width: 70px;
          color: var(--text-des-color);
        }
      }
    }
  }
}
</style>
