import { defineComponent, h } from '@vue/composition-api';
import { queryCompanyList, deleteCompany, exportCompany } from '@/api/medium';
import { categoryListNew, cooperationPlatformList } from '@/utils/format';
import { fixFileToken } from '@/utils/http';
import CompanyAdd from './components/drawer/company.add.vue';
import PersonalLibrary from './components/personalLibrary.vue';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { RouterNameSupplier } from '@/const/router';
import { HasPermission, usePermission } from '@/use/permission';
import { computed, ref } from '@vue/composition-api';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { wait } from '@/utils/func';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import { useRouter } from '@/use/vue-router';
import Folder from '@/modules/supplier/components/folder/index.vue';
import { SupplierCompanyVerifyStatus } from '@/const/companyConst';

export default defineComponent({
  components: {
    // addCompany,
    CompanyAdd,
    PersonalLibrary,
    Folder,
  },
  setup(props, ctx) {
    const router = useRouter();
    const permission = usePermission();
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewCompanyList = HasPermission(NEW_RIGHT_CODE.supplier_company_list);
      const canEditCompany = HasPermission(NEW_RIGHT_CODE.supplier_company_edit);
      const canCreateCompany = HasPermission(NEW_RIGHT_CODE.supplier_company_create);
      const canExportCompany = HasPermission(NEW_RIGHT_CODE.supplier_company_export);
      const canDeleteCompany = HasPermission(NEW_RIGHT_CODE.supplier_company_delete);

      return {
        canEditCompany,
        canCreateCompany,
        canViewCompanyList,
        canExportCompany,
        canDeleteCompany,
      };
    });

    const verifyStatusList = ref([
      {
        value: undefined,
        label: '全部',
      },
      {
        value: -1,
        label: '未通过',
      },
      {
        value: 0,
        label: '审核中',
      },
      {
        value: 1,
        label: '已通过',
      },
      {
        value: 2,
        label: '未提交',
      },
    ]);

    const show = ref(false);
    const handleFolderClick = () => {
      show.value = !show.value;
    };
    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;
    const companyList = ref([]);

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: any) => {
      topCardHeight.value = rect.height;
    };

    // 擅长平台
    const platForms = (platforms: string, isall = true) => {
      if (platforms === '') {
        return [];
      }
      if (isall) {
        return platforms.split('、');
      } else {
        return platforms.split('、').splice(0, 3);
      }
    };

    // 擅长领域格式化
    const areaFormat = (areas: string, isall = true) => {
      if (areas === '') {
        return [];
      }
      if (isall) {
        return areas.split('、');
      } else {
        return areas.split('、').splice(0, 3);
      }
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight, 200],
      tableMinHeight: 100,
    });

    const company_name_render = (row: any, text_only: boolean) => {
      const data = row.name ?? '--';
      const { is_folded, folded_text } = get_limited_length_string(data, 16);

      return text_only || !is_folded
        ? folded_text
        : h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
                minWidth: '220',
                openDelay: 300,
              },
            },
            [h('div', { slot: 'reference', class: 'company-name item-hover' }, [folded_text])],
          );
    };

    const platform_render = (row: any, text_only: boolean) => {
      const data = row.platforms ? row.platforms.replace(/、/g, '、') : '--';
      const { is_folded, folded_text } = get_limited_length_string(data, 18);

      return text_only || !is_folded
        ? folded_text
        : h(
            'el-popover',
            {
              props: {
                placement: 'top',
                trigger: 'hover',
                popperClass: 'platform-areas-grid-popover',
                openDelay: 300,
              },
            },
            [
              h('div', { slot: 'reference', class: 'line-clamp-2 item-hover' }, [folded_text]),
              h(
                'div',
                { class: 'popover-container' },
                platForms(row.platforms).map((el: any) => {
                  return h('span', [el]);
                }),
              ),
            ],
          );
    };

    const category_render = (row: any, text_only: boolean) => {
      const data = row.areas ? row.areas.replace(/、/g, '、') : '--';
      const { is_folded, folded_text } = get_limited_length_string(data, 35);

      return text_only || !is_folded
        ? folded_text
        : h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                popperClass: 'platform-areas-grid-popover',
                openDelay: 300,
              },
            },
            [
              h('div', { slot: 'reference', class: 'line-clamp-2 item-hover' }, [folded_text]),
              h(
                'div',
                { class: 'popover-container' },
                areaFormat(row.areas).map((el: any) => {
                  return h('span', [el]);
                }),
              ),
            ],
          );
    };

    const columns = computed(() => [
      // {
      //   width: 40,
      //   align: 'center',
      //   type: 'selection',
      // },
      {
        label: '公司名称',
        // @ts-ignore
        minWidth: max_length_of_column(companyList, '公司名称', company_name_render).value,
        formatter: (row: any) => company_name_render(row, false),
      },
      {
        label: '擅长平台',
        // @ts-ignore
        minWidth: max_length_of_column(companyList, '擅长平台', platform_render).value,
        formatter: (row: any) => platform_render(row, false),
      },
      {
        label: '擅长领域',
        // @ts-ignore
        minWidth: max_length_of_column(companyList, '擅长领域', category_render).value,
        formatter: (row: any) => category_render(row, false),
      },
    ]);

    const addCompanyNew = () => {
      router.push({ name: RouterNameSupplier.companyAdd });
    };
    const editCompany = (evt: any, id: string) => {
      evt.stopPropagation();
      router.push({
        name: RouterNameSupplier.companyEdit,
        params: {
          id,
        },
      });
    };
    const newcategoryList = JSON.parse(JSON.stringify(categoryListNew));
    newcategoryList.unshift('全部');
    return {
      areaFormat,
      platForms,
      newcategoryList,
      show,
      handleFolderClick,
      columns,
      companyList,
      Permission,
      permission,
      onTopCardRectUpdate,
      addCompanyNew,
      ...tableHeightLogic,
      SupplierCompanyVerifyStatus,
      editCompany,
      verifyStatusList,
    };
  },
  data() {
    return {
      deleteLoading: false,
      mediumType: 1,
      categoryIndex: 0,
      cooperationPlatformList,
      cooperationPlatformIndex: 0,
      ticketValue: '',
      ticketList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      companyName: '',
      approval_status: undefined,
      companyVisible: false,
      multipleSelection: [],
      pagination: {
        currentPage: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30],
        total: 100,
      },

      // -----------------
      defaultVal: '--',
      tableLoading: false,
    };
  },
  activated() {
    this.queryMedium();
  },
  mounted() {
    this.queryMedium();
  },
  created() {
    // this.queryMedium();
  },
  methods: {
    addCompany() {
      this.companyVisible = true;
    },
    close() {
      this.companyVisible = false;
    },
    selectCooperationPlatform(index: number) {
      this.cooperationPlatformIndex = index;
      this.queryMedium();
    },
    selectCategory(index: number) {
      this.categoryIndex = index;
      this.queryMedium();
    },
    resetMedium() {
      this.cooperationPlatformIndex = 0;
      this.categoryIndex = 0;
      this.companyName = '';
      this.ticketValue = '';
      this.approval_status = undefined;
      this.pagination.currentPage = 1;
      this.queryMedium();
    },
    saveCompany() {
      this.close();
      this.resetMedium();
    },
    // 点击查询公司列表
    clickQueryMedium() {
      this.pagination.currentPage = 1;
      this.queryMedium();
    },
    // 获取公司列表
    queryMedium() {
      this.tableLoading = true;
      const params = {
        platforms: this.cooperationPlatformIndex,
        areas: this.categoryIndex,
        name: this.companyName.replace(/(^\s*)|(\s*$)/g, ''),
        num: this.pagination.pageSize,
        page: this.pagination.currentPage,
        approval_status: this.approval_status,
      };
      if (this.ticketValue !== '') {
        // @ts-ignore
        params.special_ticket = this.ticketValue;
      }
      queryCompanyList(params).then(res => {
        this.tableLoading = false;
        if (res.data.success) {
          this.companyList = res.data.data.data;
          this.pagination.total = res.data.data.total;
        }
      });
    },
    // 导出公司
    exportCompany() {
      let ids = '';
      // 没选默认导出所有
      if (this.multipleSelection.length === 0) {
        this.companyList.forEach(item => {
          if (ids) {
            // @ts-ignore
            ids = ids + ',' + item.id;
          } else {
            // @ts-ignore
            ids = '' + item.id;
          }
        });
      } else {
        // 选了导出选择的
        this.multipleSelection.forEach(item => {
          if (ids) {
            // @ts-ignore
            ids = ids + ',' + item.id;
          } else {
            // @ts-ignore
            ids = '' + item.id;
          }
        });
      }
      const params = {
        ids,
      };
      exportCompany(params);
    },
    // 删除公司
    async delCompany() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择公司');
        return;
      }

      const result = await AsyncConfirm({ root: this }, '此操作将删除该数据, 是否继续？');
      if (!result) {
        return;
      }

      // @ts-ignore
      const ids = this.multipleSelection.map(item => item.id).join(',');
      const params = {
        ids,
      };

      this.deleteLoading = true;
      const [{ data: response }] = await wait(500, deleteCompany(params));
      this.deleteLoading = false;

      if (response.success) {
        this.$message.success(response.message);
        this.queryMedium();
      } else {
        this.$message.error(response.message ?? '删除失败');
      }
    },
    preview(row: any) {
      console.log(row.quotation);
      const url = row.quotation;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        if (row.quotation_size < 5) {
          window.open(wrUrl);
        } else {
          this.$message({
            message: '该文件过大（超过5M），请下载后查看！',
            type: 'warning',
          });
        }
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    // 下载报价单
    downloadQuotation(url: string) {
      window.open(this.fixFileToken(url, false));
    },
    goDetail(row: any) {
      this.$router.push({
        name: RouterNameSupplier.company,
        params: {
          id: row.id,
        },
      });
    },
    handleSizeChange(val: number) {
      this.pagination.pageSize = val;
      this.queryMedium();
    },
    handleCurrentChange(val: number) {
      this.pagination.currentPage = val;
      this.queryMedium();
    },
    handleSelectionChange(val: Array<any>) {
      // @ts-ignore
      this.multipleSelection = val;
    },
    fixFileToken,
  },
});
