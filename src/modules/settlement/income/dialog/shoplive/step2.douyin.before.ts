/** 业务结算 结算数据 阶段 */
import lodash from '@/utils/lodash/custom';

import {
  AdjustInfo,
  Settlement,
  SettlementShopLiveDataForm,
  SettlementDataUnionParams,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import {
  computed,
  defineComponent,
  inject,
  Ref,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import SettlementStep2Layout from '@/modules/settlement/component/step2.layout';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import { downloadFileFromLink, sleep } from '@/utils/func';
import { getToken } from '@/utils/token';
import {
  saveSettlementDataService,
  uploadDouyinOrderSettlementFileService,
} from '@/services/finance/settlement';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { Decimal } from 'decimal.js';
import { calcDouyinCommissionAmount, calcDouyinTotalAmount, commonForm } from './utils';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { LiveProject } from '@/types/tiange/live.project';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
const { debounce } = lodash;

const JwtToken = getToken();

const useForm = (ctx: SetupContext) => {
  /** 下载模版 */
  const downloadTemplateHandler = () => {
    const filename = 'douyin_live_template.xlsx';

    const url =
      window.location.origin + '/template/settlement/' + filename + '?Authorization=' + JwtToken;
    downloadFileFromLink(url);
  };

  const DisplayForm = ref({
    id: -1,
    commission: '',
  });

  const DataForm = ref<SettlementShopLiveDataForm>({
    adjust_info: [],
    commission_rate: '',
    sale_amount: '',
    service_amount: '',
    marketing_advertising_amount: '',
    order_file: '',
    tax_rate: '',
    tax_amount: '0',
    tax_excluded_amount: '0',
    tax_included_amount: '0',
    invoice_type: undefined,
    business_type: 3,
    commission: '',
  });

  return {
    DataForm,
    DisplayForm,
    downloadTemplateHandler,
  };
};

export default defineComponent({
  name: 'TgSettlementDataForm',
  components: {
    SettlementStep2Layout,
    TgAdjustAccountForm,
    TopCard,
  },
  props: {},
  setup(props, ctx) {
    const saveLoading = ref(false);
    const { business_type, isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    const newProject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(newProject);
    const uploadLoading = ref(false);
    const cooperation_type = ref(
      jsonProject.value?.cooperation_type === 2 ||
        inject('cooperation_type', {
          value: 1,
        }).value === 2
        ? 2
        : 1,
    );

    /** 项目详情 */
    const project = computed<
      MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined
    >(() => {
      const live_project = inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
      return live_project.value
        ? ({
            ...live_project.value,
            project__type: isFromSupplyChain.value
              ? 'supply_chain'
              : isFromLocalLife.value
              ? 'local_life'
              : 'live',
          } as LiveProject)
        : undefined;
    });

    const { downloadFileHandler } = commonForm(ctx);
    /** useForm */
    const { DisplayForm, DataForm, downloadTemplateHandler } = useForm(ctx);

    /** 佣金  */
    const commission_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.commission && DisplayForm.value.commission !== ''
            ? DisplayForm.value.commission
            : '0.00',
        ) + ' 元',
    );

    /** 佣金 */
    const commission_amount = computed(() =>
      calcDouyinCommissionAmount(DataForm.value.sale_amount, DataForm.value.commission_rate),
    );

    /** 总结算金额 */
    const total_amount = computed(() =>
      calcDouyinTotalAmount(
        DataForm.value.adjust_info,
        DataForm.value.business_type === 8
          ? DataForm.value.commission
          : DisplayForm.value.commission,
        Number(DataForm.value.service_amount || 0) +
          Number(DataForm.value.marketing_advertising_amount || 0),
      ),
    );

    /** 总结算金额(显示用) */
    const formatted_total_amount = computed(() => Decimal2String(total_amount.value));

    watch(
      () => [commission_amount.value],
      newVal => {
        if (newVal) {
          DisplayForm.value.commission = commission_amount.value;
        }
      },
    );

    /** 金额定长 */
    const getDecimalFixedAmount = (amount: string) => {
      return new Decimal(amount).toFixed(2).toString();
    };

    /** 抖音  上传文件结果 */
    const updateDouyinUploadResult = async (payload: FormData) => {
      const { data: res } = await uploadDouyinOrderSettlementFileService(payload);
      if (res.success) {
        const result = res.data;
        DataForm.value.order_file = result.order_file;
        DataForm.value.sale_amount = getDecimalFixedAmount(result.order_amount.toString());

        ctx.root.$message.success('上传成功');
      } else {
        ctx.root.$message.error(res.message ?? '上传失败，稍后重试');
      }
    };

    /** 上传文件 */
    const uploadFileHandler = async (value: HttpRequestOptions) => {
      const file = value.file;
      if (file.size > 50 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 50MB!');
        return;
      }

      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      formData.append('id', DisplayForm.value.id.toString());
      uploadLoading.value = true;
      return updateDouyinUploadResult(formData)
        .then((value: any) => {
          uploadLoading.value = false;
          return value;
        })
        .catch((e: any) => {
          uploadLoading.value = false;
          return Promise.reject(e);
        });
    };

    /** 手工调账数据变更 */
    const onAdjustAccountDataChange = (adjust_info: AdjustInfo[]) => {
      DataForm.value.adjust_info = adjust_info;
    };

    const prev = async () => {
      if (taxValueHasChange.value || isEditModeChanged.value) {
        const jump_next = false;
        const response = await submit(jump_next);
        if (response) {
          if (response.success) {
            ctx.emit('prev', response.data);
          }
          /* else {
            ctx.root.$message.warning(response.message);
          }*/
        }
      } else {
        ctx.emit('prev');
      }
    };

    const getValueOrDefault = (value: string | number | undefined, defaultValue = '0') => {
      return value && value !== '' ? `${value}` : defaultValue;
    };

    const getSubmitData = (DataForm: SettlementShopLiveDataForm) => {
      const payload: SettlementDataUnionParams = {
        id: DisplayForm.value.id,
        commission:
          DataForm.business_type === 8
            ? DataForm.commission
            : getDecimalFixedAmount(DisplayForm.value.commission),
        adjust_info: [],
        commission_rate: DataForm.commission_rate,
        total_settle_amount: total_amount.value.toFixed(2).toString(),
        service_amount: DataForm.service_amount,
        marketing_advertising_amount: DataForm.marketing_advertising_amount,
        sale_amount: DataForm.sale_amount,
        tax_rate: DataForm.tax_rate,
        tax_amount: DataForm.tax_amount,
        invoice_type: DataForm.invoice_type,
        tax_included_amount: DataForm.tax_included_amount,
        tax_excluded_amount: DataForm.tax_excluded_amount,
      };

      if (DataForm.order_file) {
        payload.order_file = DataForm.order_file;
      }
      return payload;
    };

    const getRequestResponse = async (payload: SettlementDataUnionParams) => {
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await saveSettlementDataService(
          payload,
          business_type.value || project.value?.business_type || E.project.BusinessType.douyin,
        ),
        await sleep(200),
      ]);
      saveLoading.value = false;

      return response;
    };

    const RawFillForm = ref<Settlement | undefined>(undefined);

    const checkFormData = (jump_next = true) => {
      if (DataForm.value.business_type === 8) {
        if (!DataForm.value.commission) {
          return '请填写佣金';
        }
      } else if (!DataForm.value.commission_rate) {
        return '请填写佣金比例';
      }
      if (cooperation_type.value === 1 && !DataForm.value.service_amount) {
        return '请填写服务费';
      }
      const form_adjust_info_list = ref<AdjustInfo[]>([]);

      if (DataForm.value.adjust_info && DataForm.value.adjust_info?.length >= 1) {
        const adjust_info_list = DataForm.value.adjust_info.filter(
          el => el.adjust_reason || el.adjust_amount,
        );
        if (adjust_info_list.some(el => /^(?:\+|-)?0?(?:\.0{0,2})?$/u.test(el.adjust_amount))) {
          return '请输入正确的调整金额';
        }
        if (adjust_info_list.some(el => el.adjust_amount === '0')) {
          ctx.root.$message.error('调整金额不能为0');
          return '调整金额不能为0';
        }
        if (
          !adjust_info_list.every(
            el =>
              el.adjust_amount &&
              el.adjust_amount !== '' &&
              el.adjust_amount !== '-' &&
              el.adjust_reason,
          )
        ) {
          return '请完善手工调账信息';
        }

        if (adjust_info_list.length > 0) {
          form_adjust_info_list.value = adjust_info_list;
        }
      }

      const total_settle_amount = total_amount.value.toFixed(2).toString();

      if (
        jump_next &&
        form_adjust_info_list.value &&
        form_adjust_info_list.value.length === 0 &&
        ['0', '0.0', '0.00'].includes(total_settle_amount ?? '0')
      ) {
        return '至少填写一项结算项';
      }
      if (total_amount.value.lessThanOrEqualTo(new Decimal(0))) {
        return '总结算金额不能小于等于0';
      }
      return;
    };

    const getValidAdjustInfoList = () => {
      if (DataForm.value.adjust_info && DataForm.value.adjust_info?.length >= 1) {
        const adjust_info_list = DataForm.value.adjust_info.filter(
          el => el.adjust_reason || el.adjust_amount,
        );
        if (adjust_info_list.length > 0) {
          return adjust_info_list;
        }
      }
      return [];
    };

    /** 点击保存 */
    const submit = async (jump_next = true) => {
      if (saveLoading.value) {
        return;
      }
      if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
        ctx.root.$message.warning('请选择发票类型');
        return;
      }
      const err_msg = checkFormData(jump_next);
      if (err_msg) {
        ctx.root.$message.error(err_msg);
        return;
      }

      const payload = getSubmitData(DataForm.value);
      payload.step = jump_next ? SettlementStep.step_three : SettlementStep.step_two;
      payload.adjust_info = getValidAdjustInfoList();

      payload.commission_rate = getValueOrDefault(payload.commission_rate);
      payload.commission = getValueOrDefault(payload.commission);
      payload.sale_amount = getValueOrDefault(payload.sale_amount);
      payload.tax_rate = getValueOrDefault(payload.tax_rate);
      payload.service_amount = getValueOrDefault(payload.service_amount);
      payload.marketing_advertising_amount = getValueOrDefault(
        payload.marketing_advertising_amount,
      );
      const response = await getRequestResponse(payload);

      if (response.success) {
        if (jump_next) {
          ctx.emit('next', response.data);
        }
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
      return response;
    };

    /** 保存 */
    const onSaveHandler = debounce(submit, 200);

    /** tax有数据变化 */
    const taxValueHasChange = computed(
      () =>
        JSON.stringify({
          tax_amount: DataForm.value.tax_amount,
          tax_rate: DataForm.value.tax_rate,
          invoice_type: DataForm.value.invoice_type,
          service_amount: DataForm.value.service_amount,
          marketing_advertising_amount: DataForm.value.marketing_advertising_amount,
        }) !==
        JSON.stringify({
          tax_amount: RawDataForm.value.tax_amount,
          tax_rate: RawDataForm.value.tax_rate,
          invoice_type: RawDataForm.value.invoice_type,
          service_amount: RawDataForm.value.service_amount,
          marketing_advertising_amount: RawDataForm.value.marketing_advertising_amount,
        }),
    );

    const next = () => {
      if (taxValueHasChange.value || isEditModeChanged.value) {
        onSaveHandler();
      } else {
        const jump_next = true;
        const err_msg = checkFormData(jump_next);
        if (err_msg) {
          ctx.root.$message.error(err_msg);
          return;
        } else {
          ctx.emit('next', RawFillForm.value);
        }
      }
    };

    /** 初始化 */
    const RawDataForm = ref<SettlementShopLiveDataForm>({
      adjust_info: [],
      commission_rate: '',
      sale_amount: '',
      order_file: '',
      tax_rate: '',
      tax_amount: '0',
      tax_excluded_amount: '0',
      tax_included_amount: '0',
      invoice_type: undefined,
      service_amount: '',
      marketing_advertising_amount: '',
      business_type: 3,
      commission: '',
    });

    const getDefaultZero = (value: string | number | undefined) => {
      if (!value || value === '') {
        return '0.00';
      }
      if (value === '0') {
        return '0.00';
      } else {
        return new Decimal(value.toString()).toFixed(2).toString();
      }
    };

    const getDefaultEmptyString = (value: string | number | undefined) => {
      if (value === '0' || value === 0) {
        return '0.00';
      } else if (!value || value === '') {
        return '';
      } else {
        return new Decimal(value?.toString()).toFixed(2).toString();
      }
    };
    const ShowAdjustInfo = ref(false);

    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;
      const fill_tax_rate = data.tax_rate?.toString() ? data.tax_rate?.toString() : '0';
      DisplayForm.value.id = data.id;
      DisplayForm.value.commission = getDefaultZero(data.commission.toString());
      cooperation_type.value = data.cooperation_type
        ? data.cooperation_type
        : cooperation_type.value;
      DataForm.value.adjust_info = data.adjust_info;
      DataForm.value.commission_rate = data.commission_rate.toString();
      DataForm.value.sale_amount = data.sale_amount.toString();
      DataForm.value.order_file = data.order_file;
      DataForm.value.invoice_type = data.invoice_type;
      DataForm.value.tax_amount = data.tax_amount?.toString();
      DataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      DataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');
      DataForm.value.service_amount = getDefaultEmptyString(data.service_amount ?? '');
      DataForm.value.marketing_advertising_amount = getDefaultEmptyString(
        data.marketing_advertising_amount ?? '',
      );
      DataForm.value.tax_rate = fill_tax_rate;
      DataForm.value.business_type = data.business_type ?? null;
      DataForm.value.commission = getDefaultEmptyString(data.commission ?? '');

      RawDataForm.value.adjust_info = data.adjust_info;
      RawDataForm.value.commission_rate = data.commission_rate.toString();
      RawDataForm.value.sale_amount = data.sale_amount.toString();
      RawDataForm.value.order_file = data.order_file;
      RawDataForm.value.invoice_type = data.invoice_type;
      RawDataForm.value.tax_amount = data.tax_amount?.toString();
      RawDataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      RawDataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');
      RawDataForm.value.service_amount = getDefaultEmptyString(data.service_amount ?? '');
      RawDataForm.value.marketing_advertising_amount = getDefaultEmptyString(
        data.marketing_advertising_amount ?? '',
      );
      RawDataForm.value.tax_rate = fill_tax_rate;
      RawDataForm.value.business_type = data.business_type ?? null;
      RawDataForm.value.commission = getDefaultEmptyString(data.commission ?? '');

      ShowAdjustInfo.value = true;
    };

    /** 保存并退出 */
    const saveBeforeClose = async () => {
      const jump_next = false;
      const response = await submit(jump_next);
      if (response) {
        return response.success;
      } else {
        return false;
      }
    };

    /** 表单有数据变化 */
    const isEditModeChanged = computed(() => {
      return (
        JSON.stringify(RawDataForm.value) !== JSON.stringify(DataForm.value) ||
        JSON.stringify({
          commission: getDefaultZero(DisplayForm.value.commission),
          total_amount: getDefaultZero(total_amount.value.toString()),
        }) !==
          JSON.stringify({
            commission: getDefaultZero(RawFillForm.value?.commission ?? '0'),
            total_amount: getDefaultZero(RawFillForm.value?.total_settle_amount ?? '0'),
          })
      );
    });

    const confirmBeforeClose = async () => {
      return taxValueHasChange.value || isEditModeChanged.value;
    };

    const SaleAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.sale_amount = result;
    };
    const ServiceAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.service_amount = result;
    };
    const ExtensionAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.marketing_advertising_amount = result;
    };
    const CommissionAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.commission = result;
    };
    const getPositiveRateNumber = (value: string) => {
      return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
    };

    const CommissionRateInput = (value: string) => {
      const result = getPositiveRateNumber(value);
      DataForm.value.commission_rate = result;
    };

    const valueChange = (item: TaxAmountInfo) => {
      DataForm.value.tax_rate = item.tax_rate;
      DataForm.value.tax_included_amount = item.tax_included_amount;
      DataForm.value.tax_excluded_amount = item.tax_excluded_amount;
      DataForm.value.tax_amount = item.tax_amount;
      DataForm.value.invoice_type = item.invoice_type;
      DataForm.value.tax_rate =
        item.invoice_type === 0 ? '0' : item.tax_rate || DataForm.value.tax_rate;
    };

    const invoiceTypeChangedHandler = (val: number) => {
      DataForm.value.invoice_type = val;
      DataForm.value.tax_rate = val === 0 ? '0' : DataForm.value.tax_rate;
    };
    const taxRateChanged = (val: any) => {
      // const value = (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
      //   val.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      // ) ?? [''])[0];
      DataForm.value.tax_rate = val;
    };

    return {
      ExtensionAmountInput,
      Decimal2String,
      ShowAdjustInfo,
      commission_amount,
      CommissionRateInput,
      SaleAmountInput,
      ServiceAmountInput,
      CommissionAmountInput,
      saveBeforeClose,
      confirmBeforeClose,
      fillForm,
      uploadFileHandler,
      downloadFileHandler,
      downloadTemplateHandler,
      saveLoading,
      total_amount,
      formatted_total_amount,
      prev,
      next,
      DisplayForm,
      DataForm,
      commission_str,
      onAdjustAccountDataChange,
      valueChange,
      invoiceTypeChangedHandler,
      taxRateChanged,
      cooperation_type,
      uploadLoading,
    };
  },
});
