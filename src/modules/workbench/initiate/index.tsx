/**
 * 工作台 - 发起审批
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-16 19:43:24
 */
import { defineComponent, h, ref } from '@vue/composition-api';
import loanLogo from '@/assets/img/workbench/yongkuanshenqing.png';
import refundLogo from '@/assets/img/workbench/tuikuanshenqing.png';
import advanceLogo from '@/assets/img/workbench/jiekuanshengqing.png';
import invoicingLogo from '@/assets/img/workbench/kaipiaoshenqing.png';
import LoanFormModal from './loan/form.vue';
import RefundFormModal from './refund/form.vue';
import ApplicationDialog from '@/views/workbench/application/applicationDialog.vue';
import InvoicesDialog from '@/views/workbench/invoices/invoicesDialog.vue';

import styles from './index.module.less';

interface BlockMenu {
  /** 名称 */
  name: string;
  /** logo */
  logo: string;
  /** 样式类名 */
  class: string;

  /** 点击回调 */
  click(): void;
}

export default defineComponent({
  name: 'TgWorkbenchInitate',
  components: {
    LoanFormModal,
    RefundFormModal,
    ApplicationDialog,
    InvoicesDialog,
  },
  setup(props, ctx) {
    // 用款
    const loanFormModalVisible = ref(false);
    const setLoanFormModalVisible = (visible = false) => (loanFormModalVisible.value = visible);

    const refundFormModalVisible = ref(false);
    const setRefundFormModalVisible = (visible = false) => (refundFormModalVisible.value = visible);

    const blockMenuClass = styles['block-menu'];

    const applicationDialog = ref<any>(null);
    const invoicesDialog = ref<any>(null);

    const blockMenus = ref<BlockMenu[]>([
      {
        name: '用款申请',
        logo: loanLogo,
        class: blockMenuClass,
        click: () => {
          setLoanFormModalVisible(true);
        },
      },
      {
        name: '退款申请',
        logo: refundLogo,
        class: blockMenuClass,
        click: () => {
          setRefundFormModalVisible(true);
        },
      },
      {
        name: '垫款申请',
        logo: advanceLogo,
        class: blockMenuClass,
        click: () => {
          applicationDialog.value.show();
        },
      },
      {
        name: '开票申请',
        logo: invoicingLogo,
        class: blockMenuClass,
        click: () => {
          invoicesDialog.value.show();
        },
      },
    ]);

    return {
      blockMenus,
      loanFormModalVisible,
      setLoanFormModalVisible,
      refundFormModalVisible,
      setRefundFormModalVisible,
      applicationDialog,
      invoicesDialog,
    };
  },
  render() {
    const blockMenus: BlockMenu[] = this.blockMenus;

    const LoanFormModalProps = {
      attrs: {
        visible: this.loanFormModalVisible,
      },
      on: {
        'dialog:close': () => this.setLoanFormModalVisible(),
        close: () => this.setLoanFormModalVisible(),
      },
    };

    const RefundFormModalProps = {
      attrs: {
        visible: this.refundFormModalVisible,
      },
      on: {
        'dialog:close': () => this.setRefundFormModalVisible(),
        close: () => this.setRefundFormModalVisible(),
      },
    };

    const ApplicationDialogProps = {
      ref: 'applicationDialog',
    };

    const InvoicesDialogProps = {
      ref: 'invoicesDialog',
    };

    return h('div', undefined, [
      h('div', { class: styles['block-menu-grid'] }, [
        blockMenus.map(menu => {
          return h(
            'div',
            {
              class: menu.class,
              on: {
                click: menu.click,
              },
            },
            [<img src={menu.logo} />, <span>{menu.name}</span>],
          );
        }),
      ]),
      // 用款申请弹窗
      <LoanFormModal {...LoanFormModalProps} />,
      <RefundFormModal {...RefundFormModalProps} />,
      <application-dialog {...ApplicationDialogProps} />,
      <invoices-dialog {...InvoicesDialogProps} />,
    ]);
  },
});
