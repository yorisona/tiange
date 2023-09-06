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
import { computed, defineComponent, inject, ref, SetupContext, watch } from '@vue/composition-api';
import SettlementStep2Layout from '@/modules/settlement/component/step2.layout';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { downloadFileFromLink, sleep } from '@/utils/func';
import { getToken } from '@/utils/token';
import {
  getSettlementTaobaoLiveTimeService,
  getShopLiveTimeFileService,
  saveSettlementDataService,
  uploadTaobaoSettlementFileService,
} from '@/services/finance/settlement';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { Decimal } from 'decimal.js';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { calcTaobaoCommissionAmount, calcTaobaoTotalAmount, commonForm } from './utils';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import TopCard from '@/modules/settlement/component/top.card.vue';

const { debounce } = lodash;

const JwtToken = getToken();

const useForm = (ctx: SetupContext) => {
  /** 下载模版 */
  const downloadTemplateHandler = () => {
    const filename = 'taobao_live_template.xlsx';

    const url =
      window.location.origin + '/template/settlement/' + filename + '?Authorization=' + JwtToken;
    downloadFileFromLink(url);
  };

  /** 服务费 计算 */
  const calcServiceFee = (
    form_unit_price: string | undefined,
    form_total_duration: string | undefined,
  ) => {
    const unit_price = new Decimal(
      form_unit_price && form_unit_price !== '' ? form_unit_price : '0.00',
    );

    const total_duration = new Decimal(
      form_total_duration && form_total_duration !== '' ? form_total_duration : '0.00',
    );

    const result = unit_price.mul(total_duration).toFixed(2);
    return result.toString();
  };

  const DisplayForm = ref({
    id: -1,
    commission: '',
    service_amount: '',
    recommend_amount: '',
    total_duration: '',
    total_live_num: '',
  });

  const DataForm = ref<SettlementShopLiveDataForm>({
    adjust_info: [],
    commission_rate: '',
    recommend_file: '',
    refund_rate: '',
    unit_price: '',
    tax_amount: '0',
    tax_rate: '',
    invoice_type: undefined,
    tax_included_amount: '0',
    tax_excluded_amount: '0',
    recommend_live_time: '0',
    record_count: '0',
  });

  return {
    DisplayForm,
    DataForm,
    downloadTemplateHandler,
    calcServiceFee,
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
    const newproject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(newproject);
    const uploadLoading = ref(false);
    const cooperation_type = ref(
      jsonProject.value?.cooperation_type === 2 ||
        inject('cooperation_type', {
          value: 1,
        }).value === 2
        ? 2
        : 1,
    );
    const { downloadFileHandler } = commonForm(ctx);

    /** useForm */
    const { DisplayForm, DataForm, downloadTemplateHandler, calcServiceFee } = useForm(ctx);

    /** 服务费 */
    const service_amount_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.service_amount && DisplayForm.value.service_amount !== ''
            ? DisplayForm.value.service_amount
            : '0.00',
        ) + ' 元',
    );

    /** 佣金  */
    const commission_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.commission && DisplayForm.value.commission !== ''
            ? DisplayForm.value.commission
            : '0.00',
        ) + ' 元',
    );

    /** 种草金额 */
    const recommend_amount_str = computed(() =>
      formatAmountWithoutPrefix(
        DisplayForm.value.recommend_amount && DisplayForm.value.recommend_amount !== ''
          ? DisplayForm.value.recommend_amount
          : '0.00',
      ),
    );

    /** 佣金 */
    const commission_amount = computed(() => {
      return calcTaobaoCommissionAmount(
        DisplayForm.value.recommend_amount,

        DataForm.value.refund_rate,
        DataForm.value.commission_rate,
      );
    });

    /** 总结算金额 */
    const total_amount = computed(() =>
      calcTaobaoTotalAmount(
        DataForm.value.adjust_info,

        DisplayForm.value.service_amount,
        DisplayForm.value.commission,
      ),
    );

    /** 总结算金额(显示用) */
    const formatted_total_amount = computed(() => total_amount.value.toString());

    watch(
      () => [commission_amount.value],
      newVal => {
        if (newVal) {
          DisplayForm.value.commission = commission_amount.value;
        }
      },
    );

    /** 淘宝 上传文件结果 */
    const getTaobaoUploadResult = async (payload: FormData) => {
      const { data: res } = await uploadTaobaoSettlementFileService(payload);
      if (res.success) {
        const result = res.data;
        DisplayForm.value.recommend_amount = getDecimalFixedAmount(
          result.recommend_amount.toString(),
        );

        DataForm.value.recommend_file = result.recommend_file;
        //区域项目
        if (cooperation_type.value !== 1) {
          DisplayForm.value.total_live_num = result.recommend_live_count
            ? result.recommend_live_count.toString()
            : '0';
          DisplayForm.value.total_duration = result.recommend_live_time
            ? result.recommend_live_time
            : '0';
        }
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
      return getTaobaoUploadResult(formData)
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
          } else {
            ctx.root.$message.warning(response.message);
          }
        }
      } else {
        ctx.emit('prev');
      }
    };

    const getValueOrDefault = (value: string | number | undefined, defaultValue = '0') => {
      return value && value !== '' ? `${value}` : defaultValue;
    };

    /** 金额定长 */
    const getDecimalFixedAmount = (amount: string) => {
      return new Decimal(amount).toFixed(2).toString();
    };

    const getSubmitData = (DataForm: SettlementShopLiveDataForm) => {
      const payload: SettlementDataUnionParams = {
        id: DisplayForm.value.id,
        commission: getDecimalFixedAmount(DisplayForm.value.commission),
        service_amount: getDecimalFixedAmount(DisplayForm.value.service_amount),
        recommend_amount: getDecimalFixedAmount(DisplayForm.value.recommend_amount),

        commission_rate: DataForm.commission_rate,
        total_settle_amount: total_amount.value.toFixed(2).toString(),
        adjust_info: [],
        total_live_num: DisplayForm.value.total_live_num,
        total_duration:
          DataForm.recommend_live_time !== '0'
            ? DataForm.recommend_live_time
            : DisplayForm.value.total_duration,
        unit_price: DataForm.unit_price,
        refund_rate: DataForm.refund_rate,
        tax_amount: `${DataForm.tax_amount ?? 0}`,
        invoice_type: DataForm.invoice_type,
        tax_rate: `${DataForm.tax_rate ?? 6}`,
        tax_excluded_amount: `${DataForm.tax_excluded_amount}`,
        tax_included_amount: `${DataForm.tax_included_amount}`,
      };

      if (DataForm.recommend_file) {
        payload.recommend_file = DataForm.recommend_file;
      }

      return payload;
    };

    const getRequestResponse = async (payload: SettlementDataUnionParams) => {
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await saveSettlementDataService(payload, BusinessTypeEnum.taobao),
        await sleep(200),
      ]);
      saveLoading.value = false;

      return response;
    };

    const RawFillForm = ref<Settlement | undefined>(undefined);

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

    const checkFormData = (jump_next = true) => {
      if (DataForm.value.commission_rate && new Decimal(DataForm.value.commission_rate).gt('100')) {
        return '佣金比例填写错误';
      }
      if (DataForm.value.refund_rate && new Decimal(DataForm.value.refund_rate).gt('100')) {
        ctx.root.$message.error('退货率填写错误');
        return;
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

      payload.commission = getValueOrDefault(payload.commission);
      payload.service_amount = getValueOrDefault(payload.service_amount);
      payload.recommend_amount = getValueOrDefault(payload.recommend_amount);

      payload.commission_rate = getValueOrDefault(payload.commission_rate);
      payload.refund_rate = getValueOrDefault(payload.refund_rate);
      payload.unit_price = getValueOrDefault(payload.unit_price);
      payload.unit_price = getValueOrDefault(payload.unit_price);
      payload.tax_rate = getValueOrDefault(payload.tax_rate);
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

    watch(
      () => [DataForm.value.unit_price, DisplayForm.value.total_duration],
      newVal => {
        if (newVal) {
          DisplayForm.value.service_amount = calcServiceFee(
            DataForm.value.unit_price,
            DisplayForm.value.total_duration,
          );
        }
      },
    );

    /** 初始化 */
    const RawDataForm = ref<SettlementShopLiveDataForm>({
      adjust_info: [],
      commission_rate: '',
      recommend_file: '',
      refund_rate: '',
      unit_price: '',
      tax_amount: '0',
      tax_rate: '',
      invoice_type: undefined,
      tax_included_amount: '0',
      tax_excluded_amount: '0',
    });

    const getDefaultEmptyString = (value: string | number | undefined) => {
      if (value === '0' || value === 0) {
        return '0.00';
      } else if (!value || value === '') {
        return '';
      } else {
        return new Decimal(value?.toString()).toFixed(2).toString();
      }
    };

    const getDefaultZero = (value: string | number | undefined) => {
      if (!value || value === '') {
        return '0.00';
      }
      if (value === '0') {
        return '0.00';
      } else {
        return new Decimal(value?.toString()).toFixed(2).toString();
      }
    };
    const ShowAdjustInfo = ref(false);

    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;

      const fill_tax_rate = data.tax_rate?.toString() ? data.tax_rate?.toString() : '0';
      cooperation_type.value = data.cooperation_type
        ? data.cooperation_type
        : cooperation_type.value;
      DisplayForm.value.id = data.id;
      DisplayForm.value.commission = getDefaultZero(data.commission.toString());
      DisplayForm.value.recommend_amount = data.recommend_amount.toString();
      DisplayForm.value.service_amount = data.service_amount.toString();
      DisplayForm.value.total_live_num = data.record_count.toString();
      DisplayForm.value.total_duration = data.total_duration.toString();
      DataForm.value.adjust_info = data.adjust_info;
      DataForm.value.commission_rate = data.commission_rate.toString();
      DataForm.value.unit_price = data.unit_price.toString();
      DataForm.value.recommend_file = data.recommend_file;
      DataForm.value.refund_rate = data.refund_rate.toString();
      DataForm.value.tax_amount = data.tax_amount?.toString();
      DataForm.value.invoice_type = data.invoice_type;
      DataForm.value.tax_rate = fill_tax_rate;
      DataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      DataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');

      RawDataForm.value.tax_amount = data.tax_amount?.toString();
      RawDataForm.value.invoice_type = data.invoice_type;
      RawDataForm.value.tax_rate = fill_tax_rate;
      RawDataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      RawDataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');

      RawDataForm.value.adjust_info = data.adjust_info;
      RawDataForm.value.commission_rate = data.commission_rate.toString();
      RawDataForm.value.unit_price = data.unit_price.toString();
      RawDataForm.value.recommend_file = data.recommend_file;
      RawDataForm.value.refund_rate = data.refund_rate.toString();

      ShowAdjustInfo.value = true;

      /** 淘宝店播 服务费区块 时长文件 */
      if (data.live_file) {
        DataForm.value.live_file = data.live_file;
        RawDataForm.value.live_file = data.live_file;
      }

      initTaobaoLiveTimeData(DisplayForm.value.id.toString());
    };

    /** 初始化时长 */
    const initTaobaoLiveTimeData = async (settlement_id: string) => {
      //自营项目
      if (cooperation_type.value === 1) {
        //自营需要从这个字段拿数据
        const payload = { settlement_id: settlement_id };
        const { data: resp } = await getSettlementTaobaoLiveTimeService(payload);
        if (resp.success) {
          DisplayForm.value.total_duration = resp.data.live_hours.toString();
          DisplayForm.value.total_live_num = resp.data.live_count.toString();
        } else {
          ctx.root.$message.error(resp.message);
          DisplayForm.value.total_duration = '0';
          DisplayForm.value.total_live_num = '0';
        }
      }
    };

    const getShopLiveTimeFileUrl = async (settlement_id: string, unit_price: string) => {
      const payload = { settlement_id: settlement_id, unit_price: unit_price };

      const resp = await getShopLiveTimeFileService(payload);
      if (resp.data.success) {
        return resp.data.data;
      } else {
        ctx.root.$message.error(resp.data.message);
        return '';
      }
    };

    const update_shop_live_file = async (settlement_id: number, unit_price: string) => {
      const fileurl = await getShopLiveTimeFileUrl(settlement_id.toString(), unit_price);
      DataForm.value.live_file = fileurl;
    };

    /** 下载 原始数据 */
    const downloadShopLiveTimeFile = async () => {
      await update_shop_live_file(DisplayForm.value.id, DataForm.value.unit_price ?? '');
      if (DataForm.value.live_file) {
        downloadFileHandler(DataForm.value.live_file);
      }
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
          service_amount: getDefaultZero(DisplayForm.value.service_amount),
          commission: getDefaultZero(DisplayForm.value.commission),
          total_amount: getDefaultZero(total_amount.value.toString()),
        }) !==
          JSON.stringify({
            service_amount: getDefaultZero(RawFillForm.value?.service_amount ?? '0'),
            commission: getDefaultZero(RawFillForm.value?.commission ?? '0'),
            total_amount: getDefaultZero(RawFillForm.value?.total_settle_amount ?? '0'),
          })
      );
    });
    /** tax有数据变化 */
    const taxValueHasChange = computed(
      () =>
        JSON.stringify({
          tax_amount: DataForm.value.tax_amount,
          tax_rate: DataForm.value.tax_rate,
          invoice_type: DataForm.value.invoice_type,
        }) !==
        JSON.stringify({
          tax_amount: RawDataForm.value.tax_amount,
          tax_rate: RawDataForm.value.tax_rate,
          invoice_type: RawDataForm.value.invoice_type,
        }),
    );

    const confirmBeforeClose = async () => {
      return taxValueHasChange.value || isEditModeChanged.value;
    };

    const UnitPriceInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
      DataForm.value.unit_price = result;
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

    const RefundRateInput = (value: string) => {
      const result = getPositiveRateNumber(value);
      DataForm.value.refund_rate = result;
    };
    const taxValueChangeHandler = (item: TaxAmountInfo) => {
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
      ShowAdjustInfo,
      commission_amount,
      RefundRateInput,
      CommissionRateInput,
      UnitPriceInput,
      saveBeforeClose,
      confirmBeforeClose,
      downloadShopLiveTimeFile,
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
      recommend_amount_str,
      commission_str,
      service_amount_str,
      onAdjustAccountDataChange,
      taxValueChangeHandler,
      invoiceTypeChangedHandler,
      taxRateChanged,
      cooperation_type,
      uploadLoading,
    };
  },
});
