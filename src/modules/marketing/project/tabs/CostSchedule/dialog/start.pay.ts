/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-09 14:02:10
 */

import { KolQuery } from '@/services/live';
import { CreateCostPayment } from '@/services/marketing.project';
import { Kol } from '@/types/tiange/live';
import { MarketingStartPayForm, MarketingStartPayParams } from '@/types/tiange/marketing/project';
import { defineComponent, ref, watch, PropType } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

const initFormData = (): MarketingStartPayForm => {
  return {
    kol: undefined,
    start_end_date: [],
    pay_date: moment().format('yyyy-MM-DD'),
    v_task_link: undefined,
    v_task_product_link: undefined,
  };
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    cost: {
      /** 打款方式，((1:银行卡 2, 'v任务'), (3, '对公银行'), (4, '支付宝')) */
      type: Object as PropType<{ cost_id: number; pay_way: number }>,
      require: true,
      default: () => {
        return {
          pay_way: 1,
        };
      },
    },
  },
  emits: ['close', 'save'],
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const queryKOLloading = ref<boolean>(false);
    const elFormRef = ref<ElForm | undefined>(undefined);
    const formData = ref<MarketingStartPayForm>(initFormData());
    const kolList = ref<Kol[]>([]);
    const elFormRules = {
      kol: [{ required: true, message: '请输入并选择KOL名称', trigger: 'change' }],
      start_end_date: [{ required: true, message: '请选择业务执行日期', trigger: 'change' }],
      v_task_link: [{ required: true, message: '请输入V任务链接', trigger: 'blur' }],
      v_task_product_link: [{ required: true, message: '请输入产品链接', trigger: 'blur' }],
    };

    const methods = {
      onClose: () => {
        ctx.emit('update:visible', false);
        ctx.emit('close');
      },
      onSave: () => {
        let validateFields = ['kol', 'start_end_date'];
        if (props.cost.pay_way === 2) {
          validateFields = ['kol', 'start_end_date', 'v_task_link', 'v_task_product_link'];
        }
        let validateSucceedCount = 0;
        elFormRef.value?.validateField(validateFields, result => {
          if (!result) {
            validateSucceedCount += 1;
            if (validateSucceedCount === validateFields.length) {
              methods.savePayRequest();
            }
          }
        });
      },
      /**
       * 请求部分
       */
      queryKOL: async (kw: string) => {
        if (!kw) {
          kolList.value = [];
          return;
        }
        queryKOLloading.value = true;
        const res = await KolQuery({
          kol_name: kw,
        });
        queryKOLloading.value = false;
        if (res.data.success) {
          kolList.value = res.data.data.filter(el => el.kol_id > 0) ?? [];
        } else {
          kolList.value = [];
        }
      },
      savePayRequest: async () => {
        const [start_date, end_date] = formData.value.start_end_date;
        saveLoading.value = true;
        const params: MarketingStartPayParams = {
          cost_id: props.cost?.cost_id,
          kol_id: formData.value.kol?.kol_id ?? -1,
          pay_way: props.cost?.pay_way,
          live_start_date: start_date,
          live_end_date: end_date,
          transfer_date: formData.value.pay_date,
          v_task_list:
            props.cost.pay_way === 2
              ? [
                  {
                    item_url: formData.value.v_task_product_link,
                    v_task_url: formData.value.v_task_link,
                  },
                ]
              : undefined,
        };
        const res = await CreateCostPayment(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success('发起打款成功');
          ctx.emit('save');
        } else {
          ctx.root.$message.error(res.data.message ?? '发起打款失败');
        }
      },
    };
    watch([() => props.visible], ([newVisible]) => {
      if (!newVisible) {
        formData.value = initFormData();
        kolList.value = [];
        setTimeout(() => {
          elFormRef.value?.clearValidate();
        }, 300);
      }
    });
    return {
      kolList,
      saveLoading,
      queryKOLloading,
      elFormRules,
      elFormRef,
      formData,
      ...methods,
    };
  },
});
