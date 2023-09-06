/** 店播 成本结算 step3 after */
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
  Settlement,
  SettlementCostDataUnionParams,
  SettlementDataUnionParams,
  SettlementIncomeType,
  SettlementStep,
  SettlementSubmitParams,
  SettlementType,
  ShopLiveCostSettlementFormAfter,
} from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob, wait as AwaitFn } from '@/utils/func';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
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
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import utils from '@/utils';
import { ContractSettlement } from '@/types/tiange/contract';
import use from '@/modules/customer/contract/list/use';
import moment from 'moment';
const JWT_TOKEN = getToken();

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

    const { downloadFileHandler } = commonForm(ctx);

    const DataForm = ref<ShopLiveCostSettlementFormAfter>({
      detail_file: '',
      adjust_info: [],
      settlement_files: [],
      is_include_tax: 0,
      invoice_type: undefined,
      company_service_type: '1',
      company_service_rate: '',
      company_service_amount: '',
      kol_service_amount: '',
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      json_data: {
        amount_info_list: [],
      },
      seal_type: null,
    });

    const schedule_file_list = ref<{ name: string; url: string }[]>([]);

    const RawFillForm = ref<Settlement | undefined>(undefined);

    const uploadedFileList = ref<
      { icon: string; type: string; size?: number; name: string; path: string }[]
    >([]);

    /** 初始化 */
    const raw_settlement_files = ref<string[]>([]);

    const getKolScheduleFile = (settlement_id: string, company_id: string) => {
      const url = `/api/settlement/download_kol_schedule?company_id=${company_id}&settlement_id=${settlement_id}&Authorization=${JWT_TOKEN}`;
      return url;
    };

    /** 下载排班 */
    const downloadKolScheduleFile = (filename: string) => {
      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';

      const url = getKolScheduleFile(
        settlement_id,
        RawFillForm.value?.company_id.toString() ?? '-1',
      );
      downloadFileHandler(url, filename);
    };

    /** 下载主播费用明显 */
    const downloadKolServiceFeeFile = (filename: string) => {
      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';
      const company_id = RawFillForm.value?.company_id.toString() ?? '-1';

      const fwf =
        DataForm.value.company_service_amount !== '' ? DataForm.value.company_service_amount : 0;
      const adjust_sum = calcTotalAdjustAmount(DataForm.value.adjust_info);

      const url = `/api/settlement/download_company_salary?adjust_sum=${adjust_sum}&fwf=${fwf}&company_id=${company_id}&settlement_id=${settlement_id}&Authorization=${JWT_TOKEN}`;

      downloadFileHandler(url, filename);
    };
    const previewFile = (file: string) => {
      // const url = location.origin + file;
      const origin =
        process.env.NODE_ENV === 'development'
          ? 'http://feishu.corp.goumee.com/test1'
          : location.origin;
      const url = origin + file;
      if (
        file.includes('.png') ||
        file.includes('.jpg') ||
        file.includes('.jpeg') ||
        file.includes('.pdf')
      ) {
        window.open(url);
      } else {
        window.open('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url));
      }
    };
    const previewKolServiceFeeFile = () => {
      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';
      const company_id = RawFillForm.value?.company_id.toString() ?? '-1';
      const fwf =
        DataForm.value.company_service_amount !== '' ? DataForm.value.company_service_amount : 0;
      const adjust_sum = calcTotalAdjustAmount(DataForm.value.adjust_info);
      const url = `/api/settlement/download_company_salary?adjust_sum=${adjust_sum}&fwf=${fwf}&company_id=${company_id}&settlement_id=${settlement_id}&Authorization=${JWT_TOKEN}`;
      previewFile(url);
    };

    const previewKolScheduleFile = () => {
      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';
      const url = getKolScheduleFile(
        settlement_id,
        RawFillForm.value?.company_id.toString() ?? '-1',
      );
      previewFile(url);
    };
    const old_contract_id = ref<any>(undefined);
    const old_seal_type = ref<number | null>(null);
    const contract_info = ref<ContractSettlement>({
      contract_uid: undefined,
      coop_start_date: undefined,
      coop_end_date: undefined,
      sign_type_name: undefined,
      contract_company_name: undefined,
    });
    const amountDetail = (type: SettlementIncomeType) => {
      return DataForm.value.json_data
        ? DataForm.value.json_data.amount_info_list?.find(el => el.type === type)
        : null;
    };
    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;
      schedule_file_list.value = [
        {
          name: data.kol_name ?? '--',
          url: '',
        },
      ];
      if (
        data.json_data &&
        data.json_data.amount_info_list &&
        data.json_data.amount_info_list.length > 0
      ) {
        DataForm.value.json_data = JSON.parse(JSON.stringify(data.json_data));
        const anchor_detail: any = amountDetail(9);
        if (anchor_detail) {
          DataForm.value.company_service_amount =
            anchor_detail.company_service_amount?.toString() ?? '0';
          DataForm.value.kol_service_amount = anchor_detail.kol_service_amount?.toString() || '0';
          DataForm.value.company_service_type =
            Number(anchor_detail.company_service_type) === 2 ? '2' : '1';
          DataForm.value.company_service_rate =
            anchor_detail.company_service_rate?.toString() ?? '';
        }
      } else {
        DataForm.value.company_service_amount = data.company_service_amount?.toString() ?? '0';
        DataForm.value.kol_service_amount = data.kol_service_amount?.toString() || '0';
        DataForm.value.company_service_type = Number(data.company_service_type === 2) ? '2' : '1';
        DataForm.value.company_service_rate = data.company_service_rate?.toString() ?? '';
      }
      DataForm.value.seal_type = data.seal_type;
      DataForm.value.detail_file = data.detail_file;
      DataForm.value.adjust_info = data.adjust_info;
      DataForm.value.tax_rate = data.tax_rate?.toString() ?? '';
      DataForm.value.is_include_tax = data.is_include_tax === 0 ? 0 : 1;
      DataForm.value.invoice_type = data.invoice_type;
      raw_settlement_files.value = data.settlement_files;
      DataForm.value.settlement_files = data.settlement_files;
      cooperation_link_contract_id.value = data.contract_id || undefined;
      old_contract_id.value = data.contract_id || undefined;
      old_seal_type.value = data.seal_type || null;
      contract_info.value.contract_uid = data.contract_uid;
      contract_info.value.sign_type_name = data.sign_type_name;
      contract_info.value.coop_start_date = data.coop_start_date;
      contract_info.value.coop_end_date = data.coop_end_date;
      contract_info.value.contract_company_name = data.contract_company_name;
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
        contract_id: cooperation_link_contract_id.value,
        seal_type: DataForm.value.seal_type || null,
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

      if (settlement.value.is_estimate === 0 && settlement_files.length === 0) {
        ctx.root.$message.warning('请上传结算单扫描件');
        return;
      }
      if (settlement.value.is_estimate === 0 && !DataForm.value.seal_type) {
        ctx.root.$message.warning('请选择是否盖章');
        return;
      }
      if (
        settlement.value.is_estimate === 0 &&
        DataForm.value.seal_type === 2 &&
        !cooperation_link_contract_id.value
      ) {
        ctx.root.$message.warning('请选择合同');
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
        contract_id: cooperation_link_contract_id.value,
        seal_type: DataForm.value.seal_type || null,
      };

      if (settlement.value.is_estimate === 0) {
        payload.settlement_files = settlement_files;
      }

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
        old_seal_type.value !== DataForm.value.seal_type ||
        old_contract_id.value !== cooperation_link_contract_id.value ||
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
          contract_id: cooperation_link_contract_id.value,
          seal_type: DataForm.value.seal_type || null,
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

    const company_service_amount_str = computed(() => {
      return Decimal2String(new Decimal(DataForm.value.company_service_amount || 0));
    });

    const kol_service_amount_str = computed(() => {
      return Decimal2String(new Decimal(DataForm.value.kol_service_amount || 0));
    });

    const contract_id_list = ref<ContractSettlement[]>([]);
    // 关联客户合同输入值获取
    const { project_id } = useProjectBaseInfo();
    const getContract = async (kw?: string) => {
      const res = await GetContractUid({
        company_name: kw,
        only_main: 0,
        project_id: project_id.value,
        contract_status: 2,
        partner_type: 2,
        exclude_sign_types: -3,
        settlement_start_date: settlement.value
          ? moment(settlement.value.start_date * 1000).format('YYYY-MM-DD')
          : undefined,
        settlement_end_date: settlement.value
          ? moment(settlement.value.end_date * 1000).format('YYYY-MM-DD')
          : undefined,
      });
      if (res.data.success) {
        contract_id_list.value = res.data.data.data;
      } else {
        contract_id_list.value = [];
      }
    };
    if (props.readonly === false) {
      getContract('');
    }
    const cooperation_link_contract_id = ref<number | undefined>(undefined);
    // 选择关联框架合同
    const selectContractUidChange = (val: any) => {
      cooperation_link_contract_id.value = val;
    };
    const basename = (item: string) => {
      return utils.basename(item);
    };

    const { isFromLocalLife, isFromSupplyChain, isFromLiveDouyin } = useProjectBaseInfo();
    const contractClick = () => {
      const contract = use.useContract(
        isFromSupplyChain.value ||
          RawFillForm.value?.settlement_type === SettlementType.supply_chain
          ? '5'
          : isFromLocalLife.value ||
            RawFillForm.value?.settlement_type === SettlementType.local_life
          ? '4'
          : isFromLiveDouyin.value ||
            RawFillForm.value?.settlement_type === SettlementType.live_douyin
          ? '6'
          : '2',
        ctx,
      );
      contract.contractClick(
        cooperation_link_contract_id.value as number,
        true,
        project_id.value || RawFillForm.value?.project_id,
      );
    };
    return {
      contractClick,
      contract_info,
      basename,
      contract_id_list,
      getContract,
      cooperation_link_contract_id,
      selectContractUidChange,
      kolSalaryDataUrl,
      downloadKolServiceFeeFile,
      previewKolServiceFeeFile,
      previewKolScheduleFile,
      downloadKolScheduleFile,
      company_service_amount_str,
      kol_service_amount_str,
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
