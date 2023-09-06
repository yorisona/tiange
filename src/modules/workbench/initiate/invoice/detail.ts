/**
 * 开票申请详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-23 13:34:18
 */
import { computed, defineComponent, ref } from '@vue/composition-api';
import type { Ref, SetupContext } from '@vue/composition-api';
import type { ApprovalInfo } from '@/types/tiange/workbench';
import { InvoiceTypeMap } from '@/types/tiange/workbench';
import { ExportApprovalInfoPDF, QueryApprovalInfo } from '@/services/workbench/workbench';
import { sleep } from '@/utils/func';
import { fixFileToken } from '@/utils/http';
import { ApprovalStatus, ApprovalStatusMap } from '@/types/tiange/system';
import { RouterLegal, RouterNameFinance, RouterNameProjectManage } from '@/const/router';
import Money, { MoneyUnit } from '@/utils/money';
import moment from 'moment';
import ApprovalFlow from '@/modules/workbench/approvalFlow';
import { GetApprovalInfo } from '@/services/workbentch';
import { workbenchStore } from '@/modules/workbench/store';
import { useApproval } from '@/use/approval';

const money = new Money();

const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `￥${money.format(num, MoneyUnit.Yuan)}`;

export interface TgInvoiceDetail {
  /**
   * 获取详情数据并打开弹窗
   * @author  Jerry <jerry.hz.china@gmail.com>
   * @since   2021-04-23 13:56:31
   * @param   {number} approval_id 审批单id
   */
  open: (approval_id: number) => Promise<void>;
}

const useOther = () => {
  /** 导出PDF */
  const exportPdf = (approval_id: number) => {
    ExportApprovalInfoPDF(approval_id);
  };

  return { exportPdf };
};

const useSomeFields = (ctx: SetupContext, detail: Ref<ApprovalInfo | undefined>) => {
  const ApprovalStatusText = computed(() =>
    ApprovalStatusMap.get(detail.value?.approval_status ?? ApprovalStatus.Processing),
  );

  const 发票类型 = computed(() =>
    detail.value?.level_two_types
      ? InvoiceTypeMap.get(detail.value?.level_two_types) ?? '--'
      : '--',
  );

  const jumpContract = () => {
    if (!detail.value?.contract_id) {
      return;
    }
    const { href } = ctx.root.$router.resolve({
      name: RouterLegal.contracts.customer.detail,
      params: {
        id: `${detail.value?.contract_id ?? ''}`,
      },
      query: {
        partner_type: '2',
      },
    });
    window.open(href, '_blank');
  };

  const 开票金额 = computed(() => moneyFormat(detail.value?.invoice_amount));

  const jumpAchievement = () => {
    if (!detail.value?.achievement_id) {
      return;
    }

    const type = detail.value?.achievement_uid?.substring(0, 2) ?? '';
    const name =
      type === 'DY' || type === 'TD' || type === 'TB' || type === 'YX'
        ? RouterNameFinance.receive
        : RouterNameProjectManage.marketing.achievement;

    const { href } = ctx.root.$router.resolve({
      name,
      query: {
        source: 'dialog',
        achievement: detail.value?.achievement_uid,
      },
    });

    window.open(href, '_blank');
  };

  const 收款时间标签 = computed(() => `${detail.value?.is_received ? '预计' : ''}收款时间：`);
  const 收款时间 = computed(() => moment(detail.value?.received_date).format('YYYY.MM.DD'));

  const 款项是否收到 = computed(() => (detail.value?.is_received === 1 ? '是' : '否'));

  const 发票寄送方式 = computed(() =>
    detail.value?.invoice_send_type === 1 ? '快递寄送' : '自行送达',
  );

  return {
    ApprovalStatusText,
    发票类型,
    jumpContract,
    开票金额,
    jumpAchievement,
    收款时间标签,
    收款时间,
    款项是否收到,
    发票寄送方式,
  };
};

/** 详情缓存 */
const cache = new Map<number, ApprovalInfo>();

export default defineComponent({
  name: 'TgInvoiceDetail',
  components: {
    ApprovalFlow,
  },
  props: {},
  setup(props, ctx) {
    const visible = ref(false);
    const loading = ref(false);

    const detail = ref<ApprovalInfo | undefined>(undefined);

    const openDialog = () => {
      visible.value = true;
    };

    const closeDialog = () => {
      visible.value = false;
    };

    // 动态注册vuex子模块
    if (!ctx.root.$store.hasModule('workbench')) {
      ctx.root.$store.registerModule('workbench', workbenchStore);
    }

    /**
     * 获取详情数据并打开弹窗
     * @author  Jerry <jerry.hz.china@gmail.com>
     * @since   2021-04-23 13:56:31
     * @param   {number} approval_id 审批单id
     */
    const open = async (approval_id: number) => {
      loading.value = true;

      const detailInCache = cache.get(approval_id);

      openDialog();
      if (detailInCache !== undefined) {
        await sleep(500);
        detail.value = detailInCache;
      } else {
        const [{ data: response }] = await Promise.all([
          await QueryApprovalInfo({ approval_id }),
          await sleep(500),
        ]);

        if (response.success) {
          detail.value = response.data;
          cache.set(approval_id, response.data);
        } else {
          ctx.root.$message.error(response.message ?? '获取审批单详情失败');
          closeDialog();
        }
      }

      const { data: response2 } = await GetApprovalInfo({ approval_id });

      if (response2.success) {
        ctx.root.$store.dispatch('workbench/setApproval', {
          ...response2.data,
        });
      } else {
        ctx.root.$message.error(response2.message ?? '获取审批详情失败');
      }

      loading.value = false;
    };

    const close = () => {
      closeDialog();
      detail.value = undefined;
    };

    return {
      visible,
      loading,
      open,
      close,
      detail,
      fixFileToken,
      ...useOther(),
      ...useSomeFields(ctx, detail),
      ...useApproval(ctx),
    };
  },
});
