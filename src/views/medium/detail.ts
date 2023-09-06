/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-05-10 11:11:48
 */
import { defineComponent, ref, computed, inject } from '@vue/composition-api';
import { companyDetail, deleteCompany } from '@/api/medium';
import { categoryListNew, cooperationPlatformListNew } from '@/utils/format';
import { fixFileToken } from '@/utils/http';
import { RouterNameSupplier } from '@/const/router';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { Company } from '@/types/tiange/supplier';
import { onBeforeMount } from '@vue/composition-api';
import invoice from '@/modules/live/project/dialog/invoice';
import CompanyAdd from './components/drawer/company.add.vue';
import { downloadFileFromBlob } from '@/utils/func';
import { getToken } from '@/utils/token';
import NewApproveProgress from '@/views/customer/components/newApproveProgress.vue';
import { SupplierCompanyVerifyStatus, SupplierCompanyVerifyStatusEnum } from '@/const/companyConst';

const routes = [
  // {
  //   name: RouterNameSupplier.list,
  //   title: '供应商管理',
  // },
  {
    name: RouterNameSupplier.manage,
    title: '公司管理',
  },
  {
    path: '',
    title: '公司详情',
  },
];

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
  name: 'mediumDetail',
  props: {
    id: Number,
  },
  components: {
    CompanyAdd,
    NewApproveProgress,
  },
  setup(props, ctx) {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const detailLoading = ref<boolean>(false);
    const companyFormEdit = ref<Company | undefined>(undefined);
    const companyVisible = ref<boolean>(false);

    const company = ref<Company>({
      id: undefined,
      add_by: '',
      add_by_id: undefined,
      /** 地址 */
      address: '',
      /** 擅长领域，用“,”拼接。 */
      areas: [],
      /** 市 */
      city: '',
      /** 区 */
      county: '',
      /** 描述 */
      description: '',
      /** 描述文件的url */
      description_file: '',
      // /** 描述预览预览的url */
      // description_file_preview: '',
      /** 上传的logo的url，没有就传空 */
      logo: '',
      /** 公司名称 */
      name: '',
      /** 合作平台，用“,”拼接。 */
      platforms: [],
      /** 省 */
      province: '',
      /** 报价单的url */
      quotation: '',
      // quotation_size: 0.03
      /** 是否专票 */
      special_ticket: 1,
      /** 联系人邮箱 */
      contact_email: '',
      /** 联系电话 */
      contact_no: '',
      /** 联系人 */
      contact_person: '',
      /** 微信号 */
      wechat: '',

      /** 财务联系邮箱 */
      contact_email2: '',
      /** 财务联系电话 */
      contact_no2: '',
      /** 财务联系人 */
      contact_person2: '',
      /** 财务微信 */
      wechat2: '',
      /** 开户行 */
      bank_of_deposit: '',
      /** 银行账号 */
      bank_card_number: '',
      /** 支付宝账号 */
      alipay_account: '',
      /** 营业执照 */
      business_license: [],
      /** 开户许可证 */
      account_permit: [],
      quotation_size: 0,
      /** 审核状态 */
      verify_status: undefined,
      /** 审批流程 */
      approval_flow_detail: [],
      /** 开户行省 */
      bank_province: '',
      /** 开户行市 */
      bank_city: '',
      /** 开户银行 */
      bank_name: '',
      /** 开户支行 */
      bank_sub_name: '',
      /** 联行号 */
      bank_code: '',
      /** 新增原因 */
      reason: '',
    });
    /** 权限检查 */
    const Permission = computed(() => {
      const canEdit = HasPermission(NEW_RIGHT_CODE.supplier_company_edit);
      const canDelete = HasPermission(NEW_RIGHT_CODE.supplier_company_delete);

      return {
        canEdit,
        canDelete,
      };
    });

    const platforms = computed(() => {
      if (company.value.platforms.length > 0) {
        return company.value.platforms
          .map((item: number) => {
            const platform = cooperationPlatformListNew.find(plObj => plObj.type === Number(item));
            return platform?.value;
          })
          .filter(item => item !== undefined);
      }
      return [];
    });

    const areas = computed(() => {
      if (company.value.areas.length > 0) {
        return company.value.areas
          .map(item => {
            return categoryListNew[Number(item) - 1];
          })
          .filter(item => item !== undefined);
      }
      return [];
    });

    const getCompanyDetail = async () => {
      const params = {
        companyId: props.id,
      };
      detailLoading.value = true;
      const res = await companyDetail(params);
      detailLoading.value = false;
      if (res.data.success) {
        company.value = res.data.data;
      }
    };

    const contract_status_str = computed(() => {
      return SupplierCompanyVerifyStatus.find(
        (item, key) => item.value === company.value.verify_status,
      )?.label;
    });

    const editCompany = () => {
      companyFormEdit.value = JSON.parse(JSON.stringify(company.value));
      companyVisible.value = true;
    };
    const delCompany = () => {
      ctx.root
        .$confirm('此操作将删除该公司数据, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
        .then(() => {
          const params = {
            ids: props.id,
          };
          deleteCompany(params).then(res => {
            if (res.data.success) {
              ctx.root.$router.push({
                name: RouterNameSupplier.list,
              });
            } else {
              ctx.root.$message(res.data.message);
            }
          });
        });
    };
    const saveCompany = () => {
      companyVisible.value = false;
      getCompanyDetail();
    };

    const showImage = (url: string) => {
      const imageArr = ['.png', '.jpg', '.jpeg'];
      const lowerUrl = url.toLowerCase();
      if (
        lowerUrl.toLowerCase().includes(imageArr[0]) ||
        lowerUrl.includes(imageArr[1]) ||
        lowerUrl.includes(imageArr[2])
      ) {
        invoice.showDetail(fixFileToken(url, false));
        return true;
      }

      return false;
    };
    const previewFile = (fileUrl: string, size = 0) => {
      if (fileUrl) {
        const ret = showImage(fileUrl);
        if (ret) {
          return;
        }
        const url = fileUrl;
        const arr = ['.doc', '.ppt', '.xls'];
        const wrUrl =
          'https://view.officeapps.live.com/op/view.aspx?src=' +
          encodeURIComponent(fixFileToken(url, false));
        if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
          if (size < 5) {
            window.open(wrUrl);
          } else {
            ctx.root.$message({
              message: '该文件过大（超过5M），请下载后查看！',
              type: 'warning',
            });
          }
        } else {
          window.open(fixFileToken(url, false));
        }
      }
    };
    const downloadQuotation = () => {
      if (company.value.quotation) {
        window.open(fixFileToken(company.value.quotation, false));
      }
    };

    onBeforeMount(async () => {
      if (ctx.root.$route.params.id) {
        getCompanyDetail();
      }
    });

    const getFileName = (url: string) => {
      if (url && url.length) {
        const urlArr = url.split('/');
        return decodeURIComponent(urlArr[urlArr.length - 1]) ?? '--';
      }
      return '--';
    };

    const address = computed(() => {
      let addr = company.value.province;
      if (company.value.city) {
        addr += company.value.city;
      }
      if (company.value.county) {
        addr += company.value.county;
      }
      if (company.value.address) {
        addr += company.value.address;
      }
      return addr ? addr : '--';
    });

    const fileIcon = (url: string | undefined) => {
      const defaultIcon = 'picture';
      let file_icon: string | undefined = undefined;
      if (url) {
        const filename = url.split('/')[url.split('/').length - 1];
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        file_icon = fileTypeIconMap.get(filename_suffix) ?? defaultIcon;
      }
      return 'ico-' + file_icon;
    };

    const downloadFile = (url: string) => {
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
            const filename = decodeURIComponent(url.split('/')[url.split('/').length - 1]);
            downloadFileFromBlob(data, filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    const status_tag_class = computed(() => {
      if (company.value?.verify_status === SupplierCompanyVerifyStatusEnum.PENDING) {
        return `approval-status-label-circle pending`.toLowerCase();
      } else if (company.value?.verify_status === SupplierCompanyVerifyStatusEnum.APPROVED) {
        return `approval-status-label-circle normal`.toLowerCase();
      } else if (company.value?.verify_status === SupplierCompanyVerifyStatusEnum.NOT_APPROVED) {
        return `approval-status-label-circle failure`.toLowerCase();
      } else {
        return `approval-status-label-circle invalid`.toLowerCase();
      }
    });

    const verify_status = computed(() => {
      if (company.value?.verify_status === SupplierCompanyVerifyStatusEnum.PENDING) {
        return 4;
      } else if (company.value?.verify_status === SupplierCompanyVerifyStatusEnum.APPROVED) {
        return 2;
      } else if (company.value?.verify_status === SupplierCompanyVerifyStatusEnum.NOT_APPROVED) {
        return 3;
      } else {
        return 1;
      }
    });

    const handleEditClick = () => {
      ctx.root.$router.push({
        name: RouterNameSupplier.companyEdit,
        params: {
          id: ctx.root.$route.params.id,
          isFromDetail: '1',
        },
      });
    };

    return {
      company,
      companyFormEdit,
      companyVisible,
      getCompanyDetail,
      detailLoading,
      Permission,
      editCompany,
      delCompany,
      close,
      saveCompany,
      previewFile,
      downloadQuotation,
      fixFileToken,
      getFileName,
      platforms,
      areas,
      address,
      fileTypeIconMap,
      fileIcon,
      downloadFile,
      contract_status_str,
      status_tag_class,
      verify_status,
      handleEditClick,
    };
  },
});
