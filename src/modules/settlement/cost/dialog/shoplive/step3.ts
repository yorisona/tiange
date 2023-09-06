/** 店播 成本结算 step3 */
import {
  computed,
  defineComponent,
  h,
  inject,
  Ref,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  SalaryType,
  SalaryTypeMap,
  Settlement,
  SettlementCostDataUnionParams,
  SettlementDataUnionParams,
  SettlementStep,
  SettlementSubmitParams,
  ShopLiveCostSettlementForm,
} from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob, parse, wait as AwaitFn } from '@/utils/func';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { calcTotalAdjustAmount, commonForm } from './utils';
import {
  saveSettlementCostDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import { useDebounceFn } from '@vueuse/core';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { uploadFileService } from '@/services/file';
import { HttpRequestOptions } from 'element-ui/types/upload';
import Decimal from 'decimal.js';
import { getToken } from '@/utils/token';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { Loading } from 'element-ui';
export const useForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadAPIFileHandler = (urlString: string, filename: string) => {
    fetch(urlString).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();
          downloadFileFromBlob(data, filename);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };
  return { downloadAPIFileHandler };
};

const fileTypeIconMap = new Map([
  ['image/jpeg', 'picture'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
  ['application/msword', 'word'],
  ['application/pdf', 'pdf'],
  ['xlsx', 'excel'],
  ['docx', 'word'],
  ['doc', 'word'],
  ['pdf', 'pdf'],
  ['jpeg', 'picture'],
]);

const getFileDataByPath = (filepath: string) => {
  const filename = filepath.split('/')[filepath.split('/').length - 1];
  const filename_suffix = filename.split('.')[filename.split('.').length - 1];
  const fileType = fileTypeIconMap.get(filename_suffix) ?? 'picture';

  return {
    name: filename,
    icon: fileType,
    type: fileType,
    path: filepath,
  };
};

export default defineComponent({
  name: 'TgShopLiveCostSettlementSubmitForm',
  components: {
    SettlementStep3Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    let loading: any;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const total_amount = ref('0');

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const { downloadAPIFileHandler } = useForm(ctx);
    const { downloadFileHandler } = commonForm(ctx);

    const DataForm = ref<ShopLiveCostSettlementForm>({
      detail_file: '',
      adjust_info: [],
      kol_salary_infos: [],
      settlement_files: [],
    });

    const schedule_file_list = ref<{ name: string; url: string }[]>([]);

    const RawFillForm = ref<Settlement | undefined>(undefined);

    const uploadedFileList = ref<
      { icon: string; type: string; size?: number; name: string; path: string }[]
    >([]);

    /** 初始化 */
    const raw_settlement_files = ref<string[]>([]);

    const getKolScheduleFile = (kol_id: string, settlement_id: string) => {
      const url = `/api/settlement/download_kol_schedule?settlement_id=${settlement_id}&kol_id=${kol_id}&Authorization=${getToken()}`;
      return url;
    };

    /** 下载排班和工资明细 */
    const downloadKolAPIFile = (url: string, filename: string) => {
      downloadAPIFileHandler(url, filename);
    };

    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;
      schedule_file_list.value = [];

      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';

      const kol_list = parse(data.kol_salary_infos).map(el => {
        let salary_description = '';
        if (el.salary_type === SalaryType.Hourly) {
          salary_description = `小时工资 ${formatAmountWithoutPrefix(
            el.unit_price,
          )}元/小时，直播时长 ${el.live_duration}/小时`;
        } else if (
          [SalaryType.Basic_or_commision, SalaryType.Basic_and_commision].includes(el.salary_type)
        ) {
          salary_description = `底薪 ${formatAmountWithoutPrefix(
            el.base_salary,
          )}元，净销额 ${formatAmountWithoutPrefix(el.sale_amount)}元，提成比例 ${
            el.commission_rate
          }%`;
        }

        schedule_file_list.value.push({
          name: el.kol_name ? el.kol_name.toString() : '--',
          url: getKolScheduleFile(el.kol_id.toString(), settlement_id),
        });

        const adjust_info = data.adjust_info.filter(item => item.kol_name === el.kol_name);
        const total_adjust_amount = calcTotalAdjustAmount(adjust_info);

        const real_salary = new Decimal(el.salary).add(total_adjust_amount).toFixed(2).toString();

        return {
          id: el.id.toString(),
          kol_id: el.kol_id.toString(),
          kol_name: el.kol_name,
          live_duration: el.live_duration.toString(),
          salary: el.salary.toString(),
          salary_str: formatAmountWithoutPrefix(el.salary.toString()) + ' 元',
          real_salary_str: formatAmountWithoutPrefix(real_salary) + ' 元',
          salary_description: salary_description,
          salary_type: el.salary_type,
          salary_type_str: SalaryTypeMap.get(el.salary_type ?? ''),
          sale_amount: el.sale_amount.toString(),
          base_salary: el.base_salary.toString(),
          commission_rate: el.commission_rate.toString(),
          adjust_info: adjust_info,
        };
      });

      DataForm.value.detail_file = data.detail_file;
      DataForm.value.kol_salary_infos = kol_list;
      DataForm.value.adjust_info = data.adjust_info;

      raw_settlement_files.value = data.settlement_files;
      DataForm.value.settlement_files = data.settlement_files;

      if (data.settlement_files) {
        uploadedFileList.value = data.settlement_files.map(filepath => {
          return getFileDataByPath(filepath);
        });
      }

      total_amount.value = new Decimal(data.total_settle_amount).toString();
    };

    /** 保存并退出 */
    const Step3SaveBeforeClose = async () => {
      if (settlement.value === undefined) {
        return;
      }
      const payload: SettlementDataUnionParams = {
        id: RawFillForm.value?.id ?? -1,
        step: SettlementStep.step_three,
      };
      const settlement_files = DataForm.value.settlement_files
        ? DataForm.value.settlement_files
        : [];

      payload.settlement_files = settlement_files;

      const { business_type } = settlement.value;

      saveLoading.value = true;
      const [{ data: response }] = await AwaitFn(
        500,
        saveSettlementCostDataService(payload, business_type),
      );
      saveLoading.value = false;
      if (response.success) {
        return true;
      } else {
        ctx.root.$message.error(response.message);
        return false;
      }
    };

    /** 提交 */
    const submit = async () => {
      if (settlement.value === undefined) {
        return;
      }
      const settlement_files = DataForm.value.settlement_files
        ? DataForm.value.settlement_files
        : [];

      if (settlement_files.length === 0) {
        ctx.root.$message.warning('请上传结算单扫描件');
        return;
      }

      const result = await AsyncConfirm(ctx, {
        title: '确定提交结算单吗？',
        content: () =>
          h('div', [
            h('div', '提交后将无法修改结算信息，确定要将结算单'),
            h('div', '提交给财务确认吗?'),
          ]),
        confirmText: '确定',
        cancelText: '取消',
      });

      if (!result) {
        return;
      }

      const payload: SettlementSubmitParams = {
        id: RawFillForm.value?.id ?? -1,
        settlement_files: settlement_files,
      };

      payload.settlement_files = settlement_files;

      saveLoading.value = true;
      const [{ data: response }] = await AwaitFn(500, submitSettlementDataService(payload));
      saveLoading.value = false;

      if (response.success) {
        ctx.root.$message.success('提交成功');
        ctx.emit('submit:success');
      } else {
        ctx.root.$message.error(response.message ?? '提交失败');
      }
    };

    /** 保存 */
    const onSaveHandler = useDebounceFn(submit, 200);

    /** 保存并退出 */
    const saveBeforeClose = async () => {
      return await Step3SaveBeforeClose();
    };

    /** 表单有数据变化 */
    const isEditModeChanged = computed(() => {
      return (
        JSON.stringify(raw_settlement_files.value) !==
        JSON.stringify(DataForm.value.settlement_files)
      );
    });

    const prev = async () => {
      if (settlement.value === undefined) {
        return;
      }
      if (isEditModeChanged.value) {
        const payload: SettlementCostDataUnionParams = {
          id: RawFillForm.value?.id ?? -1,
          step: SettlementStep.step_three,
        };
        const settlement_files = DataForm.value.settlement_files
          ? DataForm.value.settlement_files
          : [];

        payload.settlement_files = settlement_files;

        const { business_type } = settlement.value;

        saveLoading.value = true;
        const [{ data: response }] = await AwaitFn(
          500,
          saveSettlementCostDataService(payload, business_type),
        );
        saveLoading.value = false;

        if (response.success) {
          ctx.emit('prev', response.data);
        } else {
          ctx.root.$message.error(response.message);
        }
      } else {
        ctx.emit('prev');
      }
    };

    const next = async () => {
      onSaveHandler();
    };

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    /** 结算单 文件上传 */
    const uploadFileHandler = async (value: HttpRequestOptions) => {
      const file = value.file;
      if (file.size > 30 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 30MB!');
        return;
      }
      startLoading(); // 开启加载
      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      formData.append('type', 'settlement');

      /** 上传文件service */
      const res = await uploadFileService(formData);
      const result = res.data;
      loading.close(); // 关闭加载
      if (result.success) {
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        const fileType = value.file.type !== '' ? value.file.type : filename_suffix;

        const fileItem = {
          name: value.file.name,
          type: value.file.type,
          icon: fileTypeIconMap.get(fileType) ?? 'picture',
          size: value.file.size,
          path: result.data.source,
        };
        ctx.root.$message.success('上传成功');
        uploadedFileList.value.push(fileItem);
      } else {
        ctx.root.$message.error(result.message ?? '上传失败，稍后重试');
      }
    };

    watch(
      () => uploadedFileList.value,
      newVal => {
        if (newVal) {
          DataForm.value.settlement_files = uploadedFileList.value.map(el => el.path);
        }
      },
    );

    /** 删除已上传的文件 */
    const handleRemoveFileClick = (index: number) => {
      uploadedFileList.value.splice(index, 1);
    };

    const kolSalaryDataUrl = computed(() => {
      const url = `/api/settlement/download_kol_salary?settlement_id=${
        settlement.value?.id
      }&Authorization=${getToken()}`;
      return url;
    });

    return {
      kolSalaryDataUrl,
      downloadKolAPIFile,
      settlement,
      DataForm,
      saveLoading,
      total_amount,
      schedule_file_list,
      uploadedFileList,
      uploadFileHandler,
      fillForm,
      formatAmountWithoutPrefix,
      downloadFileHandler,
      handleRemoveFileClick,
      prev,
      next,
      confirmBeforeClose,
      saveBeforeClose,
    };
  },
});
