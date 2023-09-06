<!--
 * @Description: 发起审批-内容
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: 矢车
 * @LastEditTime: 2020-12-17 16:35:57
 -->

<template>
  <div class="apply">
    <div class="main">
      <div class="apply-click" @click="loan">
        <span>
          <img src="@/assets/img/workbench/yongkuanshenqing.png" />
        </span>
        <span>用款申请</span>
      </div>
      <div class="apply-click" @click="refund">
        <span>
          <img src="@/assets/img/workbench/tuikuanshenqing.png" />
        </span>
        <span>退款申请</span>
      </div>
      <div class="apply-click" @click="application">
        <span>
          <img src="@/assets/img/workbench/jiekuanshengqing.png" />
        </span>
        <span>借款申请</span>
      </div>
      <div class="apply-click" @click="invoices">
        <span>
          <img src="@/assets/img/workbench/kaipiaoshenqing.png" />
        </span>
        <span>开票申请</span>
      </div>
    </div>
    <!-- 用款申请弹窗 -->
    <show-apply-dialog ref="showApplyDialog" />
    <!-- 退款申请弹窗 -->
    <refund-dialog ref="refundDialog" />
    <!-- 垫款申请弹窗 -->
    <application-dialog ref="applicationDialog" @save="childSave" />
    <!-- 开票申请弹窗 -->
    <invoices-dialog ref="invoicesDialog" />
  </div>
</template>
<script>
import ShowApplyDialog from './ApplyDialog';
import RefundDialog from '@/views/workbench/refund/refundDialog';
import ApplicationDialog from '@/views/workbench/application/applicationDialog';
import InvoicesDialog from '@/views/workbench/invoices/invoicesDialog';
export default {
  components: {
    ShowApplyDialog,
    RefundDialog,
    ApplicationDialog,
    InvoicesDialog,
  },
  data() {
    return {};
  },
  methods: {
    // 用款申请
    loan() {
      this.$refs.showApplyDialog.show();
    },
    // 退款申请
    refund() {
      this.$refs.refundDialog.show();
    },
    // 垫款申请
    application() {
      this.$refs.applicationDialog.show();
    },
    // 垫款申请点击保存回调（tab栏回到 我发起的）
    childSave() {
      this.$parent.activeName = 'third';
      this.$parent.onclick_initiate({ approval_search_type: 2 });
    },
    // 开票申请
    invoices() {
      this.$refs.invoicesDialog.show();
    },
  },
};
</script>
<style lang="less" scoped>
.apply {
  background: #fff;
  height: 180px;
  margin-top: 10px;
  border-radius: 10px;
  display: flex;
  .main {
    display: flex;
    margin: auto 0;
    padding-left: 30px;
  }
}
.apply-click {
  cursor: pointer;
  width: 200px;
  height: 70px;
  line-height: 70px;
  background: rgba(248, 250, 252, 1);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 16px;
  margin-right: 20px;
  img {
    margin: 0 20px;
    vertical-align: middle;
    width: 54px;
    height: 54px;
  }
}
</style>
