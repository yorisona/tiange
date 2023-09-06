import {
  defineComponent,
  ref,
  inject,
  Ref,
  h,
  computed,
  SetupContext,
  watch,
} from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { formatAmountWithoutPrefix } from '@/utils/string';

import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep3Layout from '@/modules/settlement/component/step2.cost.layout';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import {
  Settlement,
  SettlementCostDataUnionParams,
  SettlementDataUnionParams,
  SettlementStep,
  SettlementSubmitParams,
} from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob, wait as AwaitFn } from '@/utils/func';
import { useDebounceFn } from '@vueuse/core';
import {
  saveSettlementCostDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import Decimal from 'decimal.js';
import { getToken } from '@/utils/token';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { Loading } from 'element-ui';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import { ContractSettlement } from '@/types/tiange/contract';
import utils from '@/utils';
import use from '@/modules/customer/contract/list/use';
import moment from 'moment';
const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
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

export const commonForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadFileHandler = (urlString: string) => {
    fetch(urlString, requestOptions).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();
          const filename = decodeURIComponent(
            urlString.split('/')[urlString.split('/').length - 1],
          );
          downloadFileFromBlob(data, filename);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };
  return { downloadFileHandler };
};

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
  name: 'Step3MCNVTask',
  components: { SettlementStep3Layout, CardLayout, TopCard },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const methods = {
      formatAmount,
      getFileName: (fileUrl: string) => {
        if (fileUrl && fileUrl.length) {
          const urlArr = fileUrl.split('/');
          return urlArr[urlArr.length - 1] ?? '--';
        }
        return '--';
      },
    };
    const total_amount = ref('0');
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

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    /** 初始化 */
    const raw_settlement_files = ref<string[]>([]);
    const old_contract_id = ref<any>(undefined);
    const old_seal_type = ref<number | null>(null);
    const contract_info = ref<ContractSettlement>({
      contract_uid: undefined,
      coop_start_date: undefined,
      coop_end_date: undefined,
      sign_type_name: undefined,
      contract_company_name: undefined,
    });
    const DataForm = ref<any>({
      adjust_info: [{ adjust_amount: '', adjust_reason: '' }],
      settlement_files: [],
      seal_type: '',
      is_include_tax: 0,
      invoice_type: undefined,
    });
    const { downloadFileHandler } = commonForm(ctx);
    const vtask_income_file = ref('');

    const uploadedFileList = ref<
      { icon: string; type: string; size?: number; name: string; path: string }[]
    >([]);

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

    const kol_user_count = ref(0);
    const RawFillForm = ref<Settlement | undefined>(undefined);

    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;

      kol_user_count.value = data.kol_count ?? 0;

      total_amount.value = new Decimal(data.total_settle_amount).toString();

      vtask_income_file.value = data.income_file;

      DataForm.value.settlement_files = data.settlement_files;
      raw_settlement_files.value = data.settlement_files;
      DataForm.value.tax_rate = data.tax_rate?.toString() ?? '';
      DataForm.value.is_include_tax = data.is_include_tax === 0 ? 0 : 1;
      DataForm.value.invoice_type = data.invoice_type;
      DataForm.value.seal_type = data.seal_type || null;
      DataForm.value.company_name = data.company_name;
      DataForm.value.spend_amount = data.spend_amount;
      DataForm.value.adjust_info = data.adjust_info;
      DataForm.value.spend_description = `总收入 ${data.original_income_amount}元，总支出 ${data.original_spend_amount}元，退款金额 ${data.refund_amount}元，机构扣点
      ${data.buckle_point}%， 税点 ${data.tax_point}%`;
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
    };
    const company_name = computed(() => RawFillForm.value?.company_name);
    const kolDataUrl = computed(() => {
      if (company_name.value) {
        const url = `/api/settlement/download_settlement_kol_data?settlement_id=${
          settlement.value?.id
        }&company_name=${DataForm.value.company_name}&Authorization=${getToken()}`;
        return url;
      } else {
        return '';
      }
    });

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
      if (
        settlement.value.is_estimate === 0 &&
        (DataForm.value.seal_type === undefined || DataForm.value.seal_type === '')
      ) {
        ctx.root.$message.warning('请选择是否盖章');
        return;
      }
      if (settlement.value.is_estimate === 0 && !cooperation_link_contract_id.value) {
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

      // if (settlement.value?.is_estimate === 0) {
      payload.settlement_files = settlement_files;
      // }

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
      if (
        old_contract_id.value !== cooperation_link_contract_id.value ||
        old_seal_type.value !== DataForm.value.seal_type
      ) {
        return true;
      }
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
          contract_id: cooperation_link_contract_id.value || 0,
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

    const next = async () => {
      onSaveHandler();
    };

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    const formatAmountStr = (amount: string | undefined) => {
      if (amount && amount !== '') {
        return formatAmountWithoutPrefix(amount);
      } else {
        return '0';
      }
    };

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
    const contractClick = () => {
      const contract = use.useContract('3', ctx);
      contract.contractClick(
        cooperation_link_contract_id.value as number,
        true,
        project_id.value || settlement.value?.project_id,
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
      settlement,
      ...methods,
      formatAmountStr,
      kol_user_count,
      handleRemoveFileClick,

      DataForm,
      vtask_income_file,
      uploadedFileList,
      total_amount,
      saveLoading,

      kolDataUrl,
      saveBeforeClose,
      fillForm,
      prev,
      next,
      uploadFileHandler,
      downloadFileHandler,
      confirmBeforeClose,
    };
  },
});
