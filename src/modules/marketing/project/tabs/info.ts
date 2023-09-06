import { computed, defineComponent, inject, ref, Ref } from '@vue/composition-api';

import MarketingProjectDialog from '@/modules/marketing/project/dialog/project.form.vue';
import {
  MarketingProjectCompanyTypeMap,
  MarketingProjectCustomerClassMap,
  MarketingProjectDetail,
} from '@/types/tiange/marketing/project';
import moment from 'moment';
import { MarketingProjectCooperationTypeMap } from '@/types/tiange/marketing/project.enum';
import { CustomerCategoryMAP } from '@/types/tiange/common';
import { formatAmount } from '@/utils/string';
import { downloadFileFromBlob } from '@/utils/func';
import { getToken } from '@/utils/token';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

export default defineComponent({
  name: 'MarketingProjectDetailInfo',
  components: {
    MarketingProjectDialog,
  },
  setup(props, ctx) {
    const ProjectFormVisible = ref(false);
    const project =
      inject<Ref<MarketingProjectDetail>>('MarketingProject') ?? ref<MarketingProjectDetail>();

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

    const currentProject = computed(() => project.value);
    const ProjectDetail = computed(() => {
      const planList = (currentProject.value?.plan ?? []).map(filepath => {
        const filename = filepath.split('/')[filepath.split('/').length - 1];
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];

        return {
          filename,
          icon: fileTypeIconMap.get(filename_suffix) ?? 'picture',
          filepath,
        };
      });

      return {
        ...currentProject.value,

        roi_str: currentProject.value?.roi_str ? currentProject.value?.roi_str : '--',
        per_uv_str: currentProject.value?.per_uv ? currentProject.value?.per_uv + '元/个' : '--',
        per_pv_str: currentProject.value?.per_pv ? currentProject.value?.per_pv + '元/个' : '--',
        pv_str: currentProject.value?.pv ? currentProject.value?.pv.toLocaleString('en-US') : '--',
        uv_str: currentProject.value?.uv ? currentProject.value?.uv.toLocaleString('en-US') : '--',
        gmv_str: currentProject.value?.gmv ? formatAmount(currentProject.value?.gmv) : '--',
        sale_amount_str: currentProject.value?.sale_amount
          ? formatAmount(currentProject.value?.sale_amount)
          : '--',
        gather_amount_str: currentProject.value?.gather_amount
          ? formatAmount(currentProject.value?.gather_amount)
          : '--',
        wait_gather_amount_str: currentProject.value?.wait_gather_amount
          ? formatAmount(currentProject.value?.wait_gather_amount)
          : '--',
        refund_total_amount_str: currentProject.value?.refund_total_amount
          ? formatAmount(currentProject.value?.refund_total_amount)
          : '--',
        cost_amount_str: currentProject.value?.cost_amount
          ? formatAmount(currentProject.value?.cost_amount)
          : '--',
        budget_str: currentProject.value?.budget
          ? formatAmount(currentProject.value?.budget)
          : '--',
        planList: planList,
        aeList: currentProject.value?.ae ?? [],
        manager_name: currentProject.value?.manager_name ?? '--',
        cooperation_name: currentProject.value?.cooperation_name,
        cooperation_uid: currentProject.value?.cooperation_uid,
        cooperation_type_str: currentProject.value?.cooperation_type
          .map(el => MarketingProjectCooperationTypeMap.get(el) ?? '')
          .join('/'),
        shop_name: currentProject.value?.shop_name,
        customer_class_str:
          MarketingProjectCustomerClassMap.get(currentProject.value?.customer_class ?? 0) ?? '--',
        category_str: CustomerCategoryMAP.get(currentProject.value?.category ?? 0) ?? '--',
        company_type_str:
          MarketingProjectCompanyTypeMap.get(currentProject.value?.company_type ?? 0) ?? '--',
        is_gather_str: currentProject.value?.is_gather ? '是' : '否',
        gather_date_str: currentProject.value?.gather_date
          ? moment((currentProject.value?.gather_date ?? 0) * 1000).format('YYYY.MM.DD')
          : '--',
        company_name: currentProject.value?.company_name,
        customer_id: currentProject.value?.customer_id,
        note: currentProject.value?.note ? currentProject.value?.note : '--',
        remark: currentProject.value?.remark ? currentProject.value?.remark : '--',
      };
    });

    /** 编辑项目 */
    const toggleMarketingProjectModalVisible = async (success: boolean) => {
      ProjectFormVisible.value = success;
    };

    const onProjectFormModalClose = async (success: boolean) => {
      ProjectFormVisible.value = false;
      if (success) {
        ctx.emit('MarketProjectDetailReload');
      }
    };

    const downloadCaseBtnClick = async (filepath: string) => {
      const filename = decodeURIComponent(filepath.split('/')[filepath.split('/').length - 1]);

      fetch(filepath, requestOptions).then(async response => {
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

    /** 跳转到客户详情 */
    const jumptoShopDetailPage = (shop_id: number) => {
      const path = '/customer/shop/' + shop_id.toString();
      window.open(path);
    };
    /** 权限检查 */
    const Permission = computed(() => {
      const canSaveProject = HasPermission(RIGHT_CODE.marketing_project_save);
      return { canSaveProject };
    });

    /** 跳转到公司详情 */
    const jumptoCompanyDetailPage = (customer_company_id: number) => {
      const path = '/customer/company/' + customer_company_id.toString();
      window.open(path);
    };

    return {
      Permission,
      jumptoShopDetailPage,
      downloadCaseBtnClick,
      ProjectDetail,
      currentProject,
      ProjectFormVisible,
      toggleMarketingProjectModalVisible,
      onProjectFormModalClose,
      jumptoCompanyDetailPage,
    };
  },
});
