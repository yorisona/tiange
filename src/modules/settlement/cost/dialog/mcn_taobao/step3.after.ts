import { defineComponent, inject, onMounted, ref, Ref, h, computed } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import {
  Settlement,
  SettlementDataUnionParams,
  SettlementSubmitParams,
  SettlementStep,
} from '@/types/tiange/finance/settlement';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import {
  saveSettlementDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import { deepClone } from '@/utils/tools';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { AsyncConfirm } from '@/use/asyncConfirm';

import TopCard from '@/modules/settlement/component/top.card.vue';
import { Loading } from 'element-ui';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import utils from '@/utils';
import use from '@/modules/customer/contract/list/use';
import { ContractSettlement } from '@/types/tiange/contract';
import moment from 'moment';
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

export default defineComponent({
  name: 'Step3MCNTaoBaoAfter',
  components: {
    CardLayout,
    SettlementStep2Layout,
    TgAdjustAccountForm,
    TopCard,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const seal_type = ref<number | null>(null);
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

    const cloneSettlement = computed(() => {
      const newSettlement = deepClone(settlement.value) as Settlement;
      return newSettlement;
    });
    const settlementFiles = ref<string[]>(cloneSettlement.value?.settlement_files ?? []);
    const originSettlementFiles = ref<string[]>([...settlementFiles.value]);
    const old_contract_id = ref<number | undefined>(undefined);
    const old_seal_type = ref<number | null>(null);
    const contract_info = ref<ContractSettlement>({
      contract_uid: undefined,
      coop_start_date: undefined,
      coop_end_date: undefined,
      sign_type_name: undefined,
      contract_company_name: undefined,
    });
    const kolDataUrl = computed(() => {
      return `/api/settlement/download_settlement_kol_data?settlement_id=${
        cloneSettlement.value?.id
      }&company_name=${cloneSettlement.value?.company_name}&Authorization=${getToken()}`;
    });

    const methods = {
      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(false);
        } else {
          ctx.emit('prev');
        }
      },
      next: async () => {
        if (settlement.value?.is_estimate === 0 && !settlementFiles.value.length) {
          ctx.root.$message.warning('请上传结算单扫描件');
          return;
        }
        if (settlement.value?.is_estimate === 0 && !seal_type.value) {
          ctx.root.$message.warning('请选择是否盖章');
          return;
        }
        if (settlement.value?.is_estimate === 0 && !cooperation_link_contract_id.value) {
          ctx.root.$message.warning('请选择合同');
          return;
        }
        const result = await AsyncConfirm(ctx, {
          title: '确定提交结算单吗?',
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
        // 提交结算数据
        methods.submitSettlementDataRequest();
      },
      isModified: () => {
        const originDetailData = JSON.stringify(originSettlementFiles.value);
        const newDetailData = JSON.stringify(settlementFiles.value);
        if (
          old_contract_id.value !== cooperation_link_contract_id.value ||
          old_seal_type.value !== seal_type.value
        ) {
          return true;
        }
        if (originDetailData !== newDetailData) {
          return true;
        }
        return false;
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(true);
      },
      fillForm: (data?: Settlement) => {
        if (data) {
          settlementFiles.value = data.settlement_files ? [...data.settlement_files] : [];
          cooperation_link_contract_id.value = data.contract_id || undefined;
          seal_type.value = data.seal_type || null;
          old_contract_id.value = data.contract_id || undefined;
          old_seal_type.value = data.seal_type || null;
          contract_info.value.contract_uid = data.contract_uid;
          contract_info.value.sign_type_name = data.sign_type_name;
          contract_info.value.coop_start_date = data.coop_start_date;
          contract_info.value.coop_end_date = data.coop_end_date;
          contract_info.value.contract_company_name = data.contract_company_name;
        }
      },
      getPositiveRateNumber: (value: string) => {
        return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
      },
      formatAmount: (amount: string | number) => {
        return formatAmount(amount, 'None');
      },
      getFileName: (fileUrl: string) => {
        if (fileUrl && fileUrl.length) {
          const urlArr = fileUrl.split('/');
          return urlArr[urlArr.length - 1] ?? '--';
        }
        return '--';
      },
      getFileIcon: (fileUrl: string) => {
        // const filename = fileUrl.split('/')[fileUrl.split('/').length - 1];
        const fileSpliceList = fileUrl.split('.');
        const filename_suffix = fileSpliceList[fileSpliceList.length - 1];
        const fileType = fileTypeIconMap.get(filename_suffix) ?? 'picture';
        return `ico-${fileType}`;
      },
      handleRemoveFileClick: (index: number) => {
        settlementFiles.value.splice(index, 1);
      },
      uploadFileHandler: async (value: HttpRequestOptions) => {
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

        const res = await uploadFileService(formData);
        loading.close(); // 关闭加载
        if (res.data.success) {
          settlementFiles.value.push(res.data.data.source);
          ctx.root.$message.success('上传成功');
        } else {
          ctx.root.$message.error(res.data.message ?? '上传失败，稍后重试');
        }
      },
      downloadFile: (url: string, name: string | undefined = undefined) => {
        const requestOptions = {
          headers: {
            Authorization: getToken() ?? '',
          },
        };
        fetch(url, requestOptions).then(async response => {
          const result = response.clone();
          try {
            const data = await result.json();
            ctx.root.$message.error(data.message);
          } catch {
            if (response.status === 200) {
              const data = await response.blob();
              const filename =
                name ?? decodeURIComponent(url.split('/')[url.split('/').length - 1]);
              downloadFileFromBlob(data, filename);
            } else {
              ctx.root.$message.error('下载失败');
            }
          }
        });
      },
      downKolDataFile: () => {
        methods.downloadFile(
          kolDataUrl.value,
          `${cloneSettlement.value?.company_name}的主播详情.xlsx`,
        );
      },
      saveSettlementDataRequest: async (isClose: boolean) => {
        if (!cloneSettlement.value?.id) {
          return;
        }
        const params: SettlementDataUnionParams = {
          id: cloneSettlement.value?.id,
          step: SettlementStep.step_three,
          contract_id: cooperation_link_contract_id.value,
          settlement_files: settlementFiles.value,
          seal_type: seal_type.value || null,
        };

        saveLoading.value = true;
        const res = await saveSettlementDataService(params, BusinessTypeEnum.mcn);
        saveLoading.value = false;
        if (res.data.success) {
          if (isClose) {
            ctx.root.$message.success(res.data.message ?? '保存成功');
          } else {
            // ctx.root.$message.success(res.data.message ?? '保存成功');
            ctx.emit('prev', res.data.data);
          }

          return true;
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
          return false;
        }
      },
      //  提交保存数据
      submitSettlementDataRequest: async () => {
        if (!cloneSettlement.value?.id) {
          return;
        }
        // if (settlement.value?.is_estimate === 0 && !settlementFiles.value.length) {
        //   ctx.root.$message.warning('请上传结算单扫描件');
        //   return;
        // }
        const params: SettlementSubmitParams = {
          id: cloneSettlement.value?.id,
          contract_id: cooperation_link_contract_id.value,
          seal_type: seal_type.value || null,
        };

        // if (settlement.value?.is_estimate === 0) {
        params.settlement_files = settlementFiles.value;
        // }

        saveLoading.value = true;
        const res = await submitSettlementDataService(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '提交结算成功');
          //  提交
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error(res.data.message ?? '提交失败');
        }
      },
    };
    const openPreview = (file: string, url: string) => {
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
    const previewKolDataFile = () => {
      const file = kolDataUrl.value;
      // const _name = `${cloneSettlement.value?.company_name}的主播详情.xlsx`;
      const origin =
        process.env.NODE_ENV === 'development'
          ? 'http://feishu.corp.goumee.com/test1'
          : location.origin;
      const url = origin + file;
      openPreview(file, url);
    };
    const tbcpsPreviewFile = (file: string) => {
      const url = `${file}?Authorization=${getToken()}`;
      openPreview(file, url);
    };
    onMounted(() => {
      originSettlementFiles.value = deepClone(settlementFiles.value) as string[];
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
      seal_type,
      contract_info,
      basename,
      contract_id_list,
      getContract,
      cooperation_link_contract_id,
      selectContractUidChange,
      settlement,
      saveLoading,
      kolDataUrl,
      ...methods,
      cloneSettlement,
      settlementFiles,
      previewKolDataFile,
      tbcpsPreviewFile,
    };
  },
});
