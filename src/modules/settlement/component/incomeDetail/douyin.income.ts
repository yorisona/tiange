/*
 * @Brief: 抖音cps/团长服务费喝星图收入
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:33:43
 */
import { uploadMCNDouyinFileService } from '@/services/finance/settlement';
import { CompanyInfoForMCNDouyin, SettlementIncomeType } from '@/types/tiange/finance/settlement';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { defineComponent, PropType, computed, ref } from '@vue/composition-api';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { commonForm } from '../../cost/dialog/shoplive/utils';

export default defineComponent({
  props: {
    feeDetail: {
      type: Object as PropType<CompanyInfoForMCNDouyin>,
    },
  },
  setup(props, ctx) {
    const dataForm = computed(() => {
      return props.feeDetail;
    });

    const company_name = computed(() => {
      let company_name = dataForm.value?.company_name;
      if (!company_name) {
        switch (props.feeDetail?.type) {
          case SettlementIncomeType.head_service_fee:
            company_name = '北京巨量引擎网络技术有限公司';
            break;
          case SettlementIncomeType.douyin_cps:
            company_name = '北京巨量引擎网络技术有限公司';
            break;
          case SettlementIncomeType.xingtu:
            company_name = '武汉巨量星图科技有限公司';
            break;
        }
        // if (dataForm.value) {
        //   dataForm.value.company_name = company_name as string;
        // }
      }
      return company_name;
    });

    const uploadLoading = ref<boolean>(false);

    const { downloadFileHandler } = commonForm(ctx);

    const appHost = computed(() => {
      let url = undefined;
      try {
        url = new URL(process.env.VUE_APP_BASE_API);
      } catch {
        console.log(`current url = ${url}`);
      }

      const urlProtocol = url?.protocol;
      const urlHostName = url?.hostname;
      return `${urlProtocol}//${urlHostName}`;
    });

    const methods = {
      // templateFileUrl: () => {

      //   let url: string = '';
      //   switch (dataForm.value?.type) {
      //     case  SettlementIncomeType.head_service_fee:
      //       url = 'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/group_template.xlsx';
      //       break;
      //     case  SettlementIncomeType.xingtu:
      //       url = 'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/xingtu_template.xlsx';
      //       break;
      //     case SettlementIncomeType.douyin_cps:
      //       url = `${appHost.value}/template/settlement/douyin_cps_template.xlsx`
      //       break;
      //   }
      //   return url;
      // },
      downTempFile: () => {
        let url = '';
        switch (dataForm.value?.type) {
          case SettlementIncomeType.head_service_fee:
            url =
              'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/group_template.xlsx';
            break;
          case SettlementIncomeType.xingtu:
            url =
              'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/xingtu_template.xlsx';
            break;
          case SettlementIncomeType.douyin_cps:
            url = `${appHost.value}/template/settlement/douyin_cps_template.xlsx`;
            break;
        }
        window.open(url);
        // downloadFileHandler(url);
      },
      downloadDataFile: () => {
        if (!dataForm.value?.file) {
          return;
        }
        downloadFileHandler(dataForm.value?.file ?? '');
      },
      uploadFileHandler: async (value: HttpRequestOptions) => {
        const file = value.file;
        if (file.size > 30 * 1024 * 1024) {
          ctx.root.$message.error('上传文件大小不能超过 30MB!');
          return;
        }
        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);

        let res = undefined;
        let type: 'douyin' | 'xingtu' | 'head_fee' = 'douyin';
        uploadLoading.value = true;
        try {
          switch (dataForm.value?.type) {
            case SettlementIncomeType.xingtu:
              type = 'xingtu';
              break;
            case SettlementIncomeType.douyin_cps:
              type = 'douyin';
              break;
            case SettlementIncomeType.head_service_fee:
              type = 'head_fee';
              break;
            default:
              break;
          }
          res = await uploadMCNDouyinFileService(formData, type);
        } catch (error) {
          uploadLoading.value = false;
          return;
        }
        uploadLoading.value = false;
        if (res?.data.success) {
          if (dataForm.value) {
            dataForm.value.income_amount = `${res?.data.data.income_amount ?? 0}`;
            dataForm.value.file = res.data.data.income_file;
            dataForm.value.company_name = company_name.value ?? '';
          }

          ctx.root.$message.success('上传成功');
        } else {
          ctx.root.$message.error(res?.data.message ?? '上传/解析失败，稍后重试');
        }
      },
      formatAmountWithoutPrefix,
      reset: () => {
        if (dataForm.value) {
          dataForm.value.company_id = '';
          dataForm.value.company_name = '';
          dataForm.value.income_amount = undefined;
          dataForm.value.file = undefined;
        }
      },
    };
    return {
      company_name,
      uploadLoading,
      dataForm,
      ...methods,
    };
  },
});
