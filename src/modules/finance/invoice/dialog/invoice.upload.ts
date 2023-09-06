import { computed, defineComponent, h, ref } from '@vue/composition-api';
import computer from '../comonents/invoice.pc.upload.vue';
import iphone from '../comonents/invoice.iphone.upload.vue';
import chooseHistoryInvoice from '../comonents/chooseHistoryInvoice/index.vue';
import { UploadInvoice } from '@/types/tiange/finance/invoice';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useRefTabs } from '@/use/tab';
import { wait } from '@/utils/func';
import { UploadFinancialInvoice, UploadInvoiceSettlement } from '@/services/finance/invoice';
import { ChooseHistoryInvoiceType } from '../comonents/chooseHistoryInvoice';
import { Message } from 'element-ui';

export type baseInfo = {
  id: number;
  company: '';
  total_amount: number;
  deposit_received_id?: number | undefined;
  business_type?: string;
  approval_id?: string;
};

export default defineComponent({
  components: { computer, iphone, chooseHistoryInvoice },
  setup(_, ctx) {
    const saveLoading = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const baseType = ref<number>(1);
    const projectType = ref<number | undefined>(undefined);
    const currentTab = ref('computer');
    const baseInfo = ref<baseInfo>({
      id: 0,
      company: '',
      total_amount: 0,
      deposit_received_id: undefined,
    });
    const invoicePcUploadPef = ref<{ getData(): void } | null>(null);
    const chooseHistoryInvoiceRef = ref<ChooseHistoryInvoiceType | undefined>();
    const tabs = useRefTabs(
      computed(() => {
        const tabList = [
          {
            label: '手机拍照上传',
            value: 'iphone',
          },
          {
            label: '上传发票截图',
            value: 'computer',
          },
          {
            label: '选择历史发票',
            value: 'chooseHistoryInvoice',
          },
        ];
        if (baseInfo.value && baseInfo.value.deposit_received_id) {
          tabList.pop();
        }
        return tabList;
      }),
      currentTab.value,
    );

    const show = (data: baseInfo, type = 1, project_type = undefined) => {
      //type 1代表财务发票上传
      baseType.value = type;
      visible.value = true;
      baseInfo.value = data;
      // baseInfo.id = data.id;
      // baseInfo.total_amount = data.total_amount;
      // baseInfo.company = data.company;
      projectType.value = project_type;
    };
    const cancel = () => {
      visible.value = false;
    };

    const isConfirmIdentical = async (info: any) => {
      const isBuyer = info.every((item: UploadInvoice) => {
        return (
          item.buyer_name.replace('(', '（').replace(')', '）') ===
          baseInfo.value.company.replace('(', '（').replace(')', '）')
        );
      });
      // const sumAmount = info.reduce((pre: number, cur: UploadInvoice) => {
      //   return pre + Number(cur.total_amount);
      // }, 0);
      if (!isBuyer) {
        const confirm = await AsyncConfirm(ctx, '上传发票与发票申请中信息不一致，是否继续上传?');
        return confirm;
      }
      return true;
    };

    const isCostConfirmIdentical = async (info: any) => {
      const seller_name = info.find((item: UploadInvoice) => {
        return item.seller_name !== baseInfo.value.company;
      });
      if (seller_name) {
        // const confirm = await AsyncConfirm(
        //   ctx,
        //   // '上传的发票销售方与结算单供应商不一致，是否继续上传?',
        //   {
        //     title: '',
        //     content: () =>
        //       h(
        //         'div',
        //         {
        //           style: {
        //             lineHeight: '20px',
        //             fontSize: '16px',
        //             color: 'var(--text-color)',
        //             fontWeight: 500,
        //           },
        //         },
        //         [h('div', ['上传的发票销售方与结算单供应商不一致']), h('div', ['是否继续上传?'])],
        //       ),
        //   },
        // );
        // return confirm;
        Message.error('上传失败，销售方抬头与供应商不一致');
        return false;
      }
      return true;
    };

    const submit = async () => {
      let ids: string[] = [];
      let invoice_tmp_infos: { invoice_number: string; seller_name: string }[] = [];
      if (tabs.checkedTab.value === 'chooseHistoryInvoice') {
        ids = (chooseHistoryInvoiceRef.value?.getCheckedIds() || []).map(el => `${el}`);
        if (ids.length === 0) {
          ctx.root.$message.warning('请选择历史发票');
          return false;
        }
        if (baseType.value === 2) {
          invoice_tmp_infos = ids.map(el => ({
            invoice_number: el,
            seller_name: baseInfo.value.company,
          }));
        }
      } else {
        const info = invoicePcUploadPef.value?.getData();
        if (baseType.value === 1) {
          (info as any).map((item: UploadInvoice) => {
            if (item.invoice_number) {
              ids.push(item.invoice_number);
            }
          });
          if (ids.length === 0) {
            ctx.root.$message.warning('请先上传发票');
            return false;
          }
          const confirm = await isConfirmIdentical(info);
          if (!confirm) return false;
        } else if (baseType.value === 2) {
          (info as any).map((item: UploadInvoice) => {
            if (item.invoice_number) {
              invoice_tmp_infos.push({
                invoice_number: item.invoice_number,
                seller_name: item.seller_name,
              });
            }
          });
          if (invoice_tmp_infos.length === 0) {
            ctx.root.$message.warning('请先上传发票');
            return false;
          }
          const confirm = await isCostConfirmIdentical(info);
          if (!confirm) return false;
        }
      }

      saveLoading.value = true;
      const [{ data }] = await wait(
        500,
        baseType.value === 1
          ? UploadFinancialInvoice({
              approval_info_id: baseInfo.value.id,
              invoice_tmp_numbers: ids,
            })
          : UploadInvoiceSettlement(
              { settlement_id: baseInfo.value.id, invoice_tmp_infos },
              projectType.value,
            ),
      );
      saveLoading.value = false;
      if (data.success) {
        visible.value = false;
        ctx.emit('success');
        ctx.root.$message.success('发票上传成功');
      } else {
        ctx.root.$message({
          type: 'error',
          message: data.message ?? '上传失败，稍后重试',
          duration: 3000,
          showClose: true,
        });
      }
    };
    return {
      saveLoading,
      visible,
      invoicePcUploadPef,
      chooseHistoryInvoiceRef,
      cancel,
      submit,
      currentTab,
      show,
      baseType,
      baseInfo,
      projectType,
      ...tabs,
    };
  },
});
