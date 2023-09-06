/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-21 17:15:57
 */
import { BankInfo } from '@/types/tiange/public/bank';
import { deepClone } from '@/utils/tools';
import { defineComponent, PropType, ref, watch } from '@vue/composition-api';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    bank: {
      type: Object as PropType<BankInfo>,
    },
  },
  setup(props, ctx) {
    const private_methods = {
      init_bank: () => {
        return {
          bank_no: '',
          account_name: '',
          account: '',
          bank: '',
          account_bank: '',
          accoiation_bank_no: '',
          account_id: '1',
        } as BankInfo;
      },
    };

    const bank_info = ref<BankInfo>(private_methods.init_bank());

    const rules = {
      account_name: [{ required: true, message: '请输入账号名称', trigger: 'blur' }],
      account: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 11, max: 24, message: '数字，长度11-24位', trigger: 'blur' },
      ],
      bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
    };

    const methods = {
      cancel: () => {
        ctx.emit('update:visible');
        ctx.emit('close');
      },
      sure: () => {
        methods.save_bank_info();
      },
      accoiation_bank_no_input: (val: string) => {
        const newVal = val.replace(/[^\d]/g, '');
        bank_info.value.accoiation_bank_no = newVal;
      },
      account_input: (val: string) => {
        const newVal = val.replace(/[^\d]/g, '');
        bank_info.value.account = newVal;
      },
      save_bank_info: async () => {
        ctx.emit('update:visible');
        ctx.emit('close');
      },
    };

    watch([() => props.visible, () => props.bank], ([newVisiable, newBank]) => {
      if (newVisiable) {
        if (newBank) {
          bank_info.value = deepClone(newBank) as BankInfo;
        } else {
          bank_info.value = private_methods.init_bank();
        }
      } else {
        setTimeout(() => {
          bank_info.value = private_methods.init_bank();
        }, 300);
      }
    });

    return {
      rules,
      bank_info,
      ...methods,
    };
  },
});
