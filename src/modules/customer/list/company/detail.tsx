/**
 * 公司详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-02 17:12:28
 */
import { computed, defineComponent, inject, onBeforeMount, ref, watch } from '@vue/composition-api';
import { BatchDeleteCompany, GetCompanyDetail } from '@/services/company';
import type { Company } from '@/types/tiange/company';
// import { addDateFormat } from '@/utils/format';
import companyLogoDef from '@/assets/images/20000/company_detail_logo_def.png';
import { fillEmptyStr } from '@/utils/string';
import { useCompanyRight } from './useRight';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterNameCustomer } from '@/const/router';
import formDrawer from './form/drawer.vue';
import { fixFileToken } from '@/utils/http';
import { downloadFileFromBlob } from '@/utils/func';
import { companyTypeList } from '@/utils/format';
import NewApproveProgress from '@/views/customer/components/newApproveProgress.vue';
import { BusinessTypeMap, CustomerCategoryMAP } from '@/types/tiange/common';
// import { ShopTypeMap } from '@/types/tiange/customer.enum';
import { customerCompanyVerifyStatus, customerCompanyVerifyStatusEnum } from '@/const/companyConst';
import { getToken } from '@/utils/token';
import { AccountTypeMap } from '@/types/tiange/finance/finance';

export default defineComponent({
  name: 'TgCustomerCompanyDetail',
  components: {
    formDrawer,
    NewApproveProgress,
  },
  methods: {
    fillEmptyStr: fillEmptyStr,
  },
  setup(props, ctx) {
    const formDrawerRef = ref<null | { open: (data?: Company) => void }>(null);

    /** 加载中 */
    const loading = ref(false);
    /** 详情数据 */
    const company = ref<Company | undefined>(undefined);

    const getDetail = async () => {
      loading.value = true;
      const { data: response } = await GetCompanyDetail(ctx.root.$route.params.id);
      loading.value = false;
      if (response.success) {
        company.value = response.data;
      } else {
        ctx.root.$router.push('/');
      }
    };

    onBeforeMount(() => {
      getDetail();
    });

    const addByFormat = computed(
      () => `录入人：${company.value?.add_by ?? '--'}`, // ${addDateFormat(company.value?.gmt_create)}`
    );

    /** 公司LOGO */
    const logo = computed(() =>
      company.value?.logo ? fixFileToken(company.value.logo, false) : companyLogoDef,
    );

    const isIntroduceFilePdf = (introduce_file: string) => /\.pdf/giu.test(introduce_file ?? '');

    const introduceFilename = (introduce_file: string) => {
      const file_name = introduce_file.split('/').pop();
      if (file_name) {
        return decodeURIComponent(file_name);
      }
      return '--';
    };

    const introduceFileLink = computed(() =>
      fixFileToken(company.value?.introduce_file ?? '', false),
    );

    // 编辑
    const onEditBtnClick = () => {
      formDrawerRef.value?.open(company.value);
    };

    const onDeleteBtnClick = async () => {
      const result = await AsyncConfirm(ctx, '删除后数据无法恢复，是否继续操作？');

      if (result) {
        const { data: response } = await BatchDeleteCompany({
          ids: [ctx.root.$route.params.id],
        });

        if (response.success) {
          ctx.root.$message.success({
            message: '删除成功，即将返回公司列表',
            duration: 2000,
            onClose: () => {
              ctx.root.$router.push({
                name: RouterNameCustomer.company,
              });
            },
          });
        } else {
          ctx.root.$message.error(response.message ?? '删除失败');
        }
      }
    };

    // 保存成功回调
    const onCompanyFormSubmitSuccess = async () => {
      await getDetail();
    };

    const companyAddr = computed(() =>
      [
        company.value?.province ?? '',
        company.value?.city ?? '',
        company.value?.county ?? '',
        company.value?.address ?? '',
      ]
        .filter(el => el !== '')
        .join(''),
    );

    const introduceRef = ref<null | HTMLDivElement>(null);

    /** 公司介绍合拢按钮 */
    const introduceRefNeedCollapseBtn = ref(false);

    /** 公司介绍是否合拢状态，默认不合拢 */
    const introduceRefCollapsed = ref(false);

    const initIntroduceBlock = () => {
      if (introduceRef.value) {
        const { height } = introduceRef.value.getBoundingClientRect();
        if (height > 18) {
          introduceRefNeedCollapseBtn.value = true;
          introduceRefCollapsed.value = true;
        }
      }
    };

    // 初始化
    watch(
      () => introduceRef.value,
      () => {
        initIntroduceBlock();
      },
    );

    const onIntroduceRefCollapsedBtnClick = () => {
      introduceRefCollapsed.value = !introduceRefCollapsed.value;
    };

    const downloading = ref(false);

    const onDownClick = (introduceFile: string, fileName: string) => {
      const token = getToken();
      const fileUrl = token
        ? `${introduceFile}?Authorization=${encodeURIComponent(token)}`
        : introduceFile;
      downloading.value = true;
      fetch(fileUrl)
        .then(res => res.blob())
        .then(blob => {
          downloadFileFromBlob(blob, fileName);
          ctx.root.$message.success('下载完成啦');
        })
        .finally(() => {
          downloading.value = false;
        });
    };

    const contract_status_str = computed(() => {
      return customerCompanyVerifyStatus.find(
        (item, index) => item.value === company.value?.verify_status,
      )?.label;
    });

    const status_tag_class = computed(() => {
      if (company.value?.verify_status === customerCompanyVerifyStatusEnum.PENDING) {
        return `approval-status-label-circle pending`.toLowerCase();
      } else if (company.value?.verify_status === customerCompanyVerifyStatusEnum.APPROVED) {
        return `approval-status-label-circle normal`.toLowerCase();
      } else if (company.value?.verify_status === customerCompanyVerifyStatusEnum.NOT_APPROVED) {
        return `approval-status-label-circle failure`.toLowerCase();
      } else {
        return `approval-status-label-circle invalid`.toLowerCase();
      }
    });

    const verify_status = computed(() => {
      if (company.value?.verify_status === customerCompanyVerifyStatusEnum.PENDING) {
        return 4;
      } else if (company.value?.verify_status === customerCompanyVerifyStatusEnum.APPROVED) {
        return 2;
      } else if (company.value?.verify_status === customerCompanyVerifyStatusEnum.NOT_APPROVED) {
        return 3;
      } else {
        return 1;
      }
    });

    const handleEditClick = () => {
      ctx.root.$router.push({
        name: RouterNameCustomer.companyEdit,
        params: {
          id: ctx.root.$route.params.id,
          isFromDetail: '1',
        },
      });
    };
    const routes = [
      {
        path: '/customer/company',
        title: '公司管理',
      },
      {
        path: '',
        title: '公司详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    return {
      ...useCompanyRight(ctx),
      loading,
      getDetail,
      company,
      companyAddr,
      addByFormat,
      logo,
      onEditBtnClick,
      onDeleteBtnClick,
      isIntroduceFilePdf,
      introduceFilename,
      introduceFileLink,
      onCompanyFormSubmitSuccess,
      NO_SHOPS_TIP: '没有关联店铺的数据哦～可在店铺管理-新增/编辑店铺页进行关联',
      formDrawerRef,
      introduceRef,
      introduceRefCollapsed,
      introduceRefNeedCollapseBtn,
      onIntroduceRefCollapsedBtnClick,
      onDownClick,
      downloading,
      contract_status_str,
      status_tag_class,
      companyTypeList,
      BusinessTypeMap,
      CustomerCategoryMAP,
      // ShopTypeMap,
      verify_status,
      handleEditClick,
      AccountTypeMap,
    };
  },
});
