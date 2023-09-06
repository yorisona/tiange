/**
 * 合同审批
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-12 19:49:37
 */
import { computed, defineComponent } from '@vue/composition-api';
import customerContract from '@/modules/customer/contract/index.vue';
import customerContractOld from '@/views/contractApproval/components/customerContract.vue';
import supplierContract from '@/views/contractApproval/components/mediumContract.vue';
import contractAttachment from '@/views/contractApproval/components/contractAttachment.vue';
import { useRouteTabs } from '@/use/tab';

export default defineComponent({
  name: 'TgContractApproval',
  components: {
    customerContract,
    customerContractOld,
    supplierContract,
    contractAttachment,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(ctx, [
      // { value: 'customerContract', label: '客户合同' },
      { value: 'customerContractOld', label: '客户合同' },
      { value: 'supplierContract', label: '供应商合同' },
      { value: 'contractAttachment', label: '附件' },
    ]);

    const extraClass = computed(() => {
      if (tabs.checkedTab.value === 'customerContract') {
        return 'tg-page-container';
      } else {
        return '';
      }
    });

    return { ...tabs, extraClass };
  },
});
