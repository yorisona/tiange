/*
 * @Author: 肖槿
 * @Date: 2022-05-20 14:40:41
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-05-26 14:30:30
 * @FilePath: \goumee-star-frontend\src\modules\commonBusiness\project\tabs\setting\index.ts
 */
import { defineComponent, ref, computed, reactive, toRefs, onMounted } from '@vue/composition-api';
import {
  GetSearchExpenseType,
  PostSaveS2b2cSetting,
  GetS2b2cSettlementSetting,
} from '@/services/live.project';
import { useRouter } from '@/use/vue-router';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { ElForm } from 'element-ui/types/form';

interface constShareType {
  expense_type_id: string; // 支出类别id
  share_proportion: string; // 达人承担比例
}
export default defineComponent({
  name: 'TgTabCalendarWeek',
  components: {},
  setup(props, ctx) {
    const router = useRouter();
    const project_id = computed(() => router.currentRoute.params.id);
    const settingForm = ref<any>({
      project_id: project_id.value,
      kol_divide: '',
      invoice_enable: '1',
      invoice_tax_rate: '',
      invoice_platform: '1',
      commission_rate: '',
      cost_share: [],
    });
    const settingFormRef = ref<ElForm | undefined>(undefined);
    const typeObject = reactive<any>({
      typeLoading: false,
      typeData: [],
    });
    const formRules = {
      commission_rate: [{ required: true, message: '请输入比例', trigger: ['blur'] }],
      kol_divide: [{ required: true, message: '请输入比例', trigger: ['blur', 'change'] }],
      invoice_enable: [{ required: true, message: '请输入比例', trigger: ['blur', 'change'] }],
      invoice_tax_rate: [{ required: true, message: '请输入税率', trigger: ['blur', 'change'] }],
    };
    const getPositiveRateNumber = (value: string) => {
      return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
    };
    const divideRateInput = (keys: string, val: string) => {
      const result = getPositiveRateNumber(val);
      settingForm.value[keys] = String(result);
    };
    const chargeTableData = [
      {
        text: '费用类型',
        required: true,
      },
      {
        text: '达人承担比例',
        required: true,
      },
      {
        text: '操作',
      },
    ];
    const addType = () => {
      settingForm.value.cost_share.push({
        expense_type_id: '',
        share_proportion: '0',
      });
    };
    const deleteType = (idx: number) => {
      settingForm.value.cost_share.splice(idx, 1);
    };
    const shareProportionHandler = (obj: constShareType, val: string) => {
      const result = getPositiveRateNumber(val);
      obj.share_proportion = result;
    };
    const remoteMethod = async (query: string) => {
      if (query !== '') {
        typeObject.typeLoading = true;
        const {
          data: { data },
        } = await GetSearchExpenseType(query);
        typeObject.typeData = data;
      } else {
        typeObject.typeData = [];
      }
      typeObject.typeLoading = false;
    };
    const onSubmit = async () => {
      // console.log(settingForm.value);
      try {
        await settingFormRef.value?.validate();
        settingForm.value.cost_share = settingForm.value.cost_share.filter(
          (item: constShareType) => item.expense_type_id,
        );
        const { data } = await PostSaveS2b2cSetting(settingForm.value);
        if (data.success) {
          ctx.root.$message.success('保存成功');
        }
      } catch (error) {
        ctx.root.$message.error('保存失败');
      }
    };
    const shareIds = computed(() =>
      settingForm.value.cost_share.map((item: any) => item.expense_type_id),
    );
    onMounted(async () => {
      const {
        data: {
          data: {
            kol_divide,
            invoice_enable,
            invoice_tax_rate,
            invoice_platform,
            cost_share,
            commission_rate,
          },
        },
      } = await GetS2b2cSettlementSetting(project_id.value);
      settingForm.value.kol_divide = kol_divide + '';
      settingForm.value.invoice_enable = invoice_enable + '';
      settingForm.value.invoice_tax_rate = invoice_tax_rate + '';
      settingForm.value.invoice_platform = invoice_platform ? invoice_platform + '' : '1';
      settingForm.value.cost_share = cost_share;
      settingForm.value.commission_rate = commission_rate;
      typeObject.typeData = cost_share.map((item: any) => ({
        expense_type: item.expense_type,
        id: item.expense_type_id,
      }));
    });
    return {
      project_id,
      formRules,
      shareIds,
      onSubmit,
      addType,
      deleteType,
      remoteMethod,
      settingForm,
      settingFormRef,
      chargeTableData,
      divideRateInput,
      shareProportionHandler,
      ...toRefs(typeObject),
    };
  },
});
