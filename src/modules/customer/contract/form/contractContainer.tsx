/**
 * 新增/编辑合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:06:18
 */
import { defineComponent, ref, computed, nextTick } from '@vue/composition-api';
// 客户合同
import contract from './contract_coexist.vue';
//  客户补充协议
import AddAttachmentDialog from '@/modules/customer/contract/form/annex_coexist.vue';

//  供应商合同
import addSupplierContract from '@/views/medium/components/addContract_coexist.vue';
// 供应商补充协议
import AddAttachmentDialogSupplier from '@/views/medium/components/addAttachmentDialog_coexist.vue';
export default defineComponent({
  name: 'AddContract',
  components: {
    contract,
    AddAttachmentDialog,
    AddAttachmentDialogSupplier,
    addSupplierContract,
  },
  props: {
    type: {
      type: String,
      default: 'add',
    },
    dialogType: {
      type: Number,
      default: 1,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const visible = ref(false);
    const childCompRef = ref<any>();
    const tabs = ref(0);
    const dialogSubmit = () => {
      childCompRef.value?.onSaveBtnClick();
    };
    const lastShowValue = ref<any>(undefined);
    const comp = computed<string>(() => {
      if (props.dialogType === 2)
        return tabs.value === 0 ? 'addSupplierContract' : 'AddAttachmentDialogSupplier';
      return tabs.value === 0 ? 'contract' : 'AddAttachmentDialog';
    });
    const show = (...args: any) => {
      childCompRef.value?.show(...args);
      visible.value = true;
      lastShowValue.value = args;
    };
    const tabsChange = (value: number) => {
      tabs.value = value;
      nextTick(() => {
        show(...lastShowValue.value);
      });
    };

    const onComplate = () => {
      ctx.emit('close');
      ctx.emit('complete');
    };
    const compListeners = {
      tabsChange,
      added: onComplate,
      edited: onComplate,
    };
    return {
      comp,
      dialogSubmit,
      saveLoading,
      visible,
      show,
      tabs,
      tabsChange,
      childCompRef,
      compListeners,
    };
  },
  methods: {
    added() {
      this.$emit('close');
    },
  },
  render(h) {
    return h(
      this.comp as string,
      {
        ref: 'childCompRef',
        props: {
          type: this.type,
          tabs: this.tabs,
        },
        on: {
          ...(this.compListeners as any),
          ...this.$listeners,
        },
      },
      [],
    );
  },
});
