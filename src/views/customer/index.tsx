import { queryUserNames, exportCustomers, delCustomer } from '@/api/customer';
import {
  categoryFormate,
  addDateFormat,
  customerClassList,
  departmentList,
  customerLevelList,
  shopType,
  companyType,
  shopTypeList,
  companyTypeList,
} from '@/utils/format';
import addCustomer from './components/addCustomer.vue';
import { ROLE_CODE } from '@/const/roleCode';
import { areaType } from '@/const/kolConst';
import { deepClone } from '@/utils/tools';
import { areaStr } from '@/utils/filter';
import { GetCustomer, GetMarketingCustomer } from '@/services/customers';
import { getBodyRect, resize } from '@/utils/dom';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterNameCustomer, RouterNameProjectManage } from '@/const/router';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed, defineComponent, h, ref } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { wait } from '@/utils/func';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import useCustomerShopListLogic from '@/modules/customer/list/shop/useColumns';
import companyDetail from './detail/index.vue';
import { CustomerShop } from '@/types/tiange/customer';

const _areaType = deepClone(areaType);
// @ts-ignore
_areaType.unshift({
  value: '全部',
  key: '',
});

export default defineComponent({
  setup(props, ctx) {
    /** 是否显示 新增店铺 导出 删除 按钮
     * 营销业务/客户列表 不显示
     * 客户管理/客户列表 显示
     * 这两个菜单 共用当前文件
     */
    // v2.9 版本放弃使用
    const showOperationButton = computed(() => {
      return RouterNameCustomer.list === ctx.root.$route.name;
    });
    /** 是否是 营销业务的 客户列表 */
    const isMarketingMenu = computed(() => {
      return [
        RouterNameProjectManage.marketing.customer.list,
        RouterNameProjectManage.marketing.customer.listTab,
      ].includes(
        // @ts-ignore
        ctx.root.$route.name,
      );
    });
    const Permission = computed(() => {
      const canViewList = HasPermission(NEW_RIGHT_CODE.customer_list);
      const canCreate = HasPermission(NEW_RIGHT_CODE.customer_create);
      const canDelete = HasPermission(NEW_RIGHT_CODE.customer_delete);
      const canExport = HasPermission(NEW_RIGHT_CODE.customer_export);

      return { canViewList, canCreate, canDelete, canExport };
    });

    const business_type = ref('');

    // 自适应表格高度部分

    const buttonLineHeight = 32;
    const paginationLineHeight = 46;
    const rectPadding = 30;
    const otherHeight = 12;

    const topCardHeight = ref(0);

    const onTopCardRectUpdate = (rect: any) => {
      topCardHeight.value = rect.height;
    };
    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      fixedBlockHeightRefs: [topCardHeight],
      pagename: 'customer_shop',
    });

    const listLogic = useCustomerShopListLogic();

    const rowDetail: CustomerShop = {
      brand_id: 0,
      brand_name: '',
      business_type: [],
      category: 0,
      companies: [],
      company_type: 0,
      shop_id: 0,
      shop_name: '',
      shop_type: 0,
      add_by: '',
      add_by_id: 0,
      addr_province: '',
      addr_town: '',
      addr_county: '',
      addr_detail: '',
      company_id: 0,
      company_name: '',
      coop_ae: [],
      customer_name: '',
      customer_class: 0,
      department: 0,
      manager_infos: [],
      flag: 0,
      intention: '',
      level: 0,
      manager: '',
      manager_id: 0,
      manager_name: '',
      mobile: '',
      modified_by: '',
      modified_by_id: 0,
      wechat: '',
      total_coop_times: 0,
      total_coop_amount: 0,
      conversation_times: 0,
      is_year_customer: false,
      has_achievement_or_cost: false,
      invoice_title: '',
      invoice_addr: '',
      invoice_number: '',
      invoice_account: '',
      invoice_bank: '',
      invoice_phone: '',
      gmt_create: '',
      gmt_modified: '',
    };

    const detailDrawerRef = ref<null | { openDrawer: () => void }>(null);

    const exportParams: any = undefined;
    return {
      exportParams,
      Permission,
      ...listLogic,
      showOperationButton,
      isMarketingMenu,
      BusinessTypeOptions,
      business_type,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      // 按UI设计的要求暂时封印(仅开发环境开放了)
      // @ts-ignore
      hideToggleFilterFormVisibleBtn: process.env.NODE_ENV === 'development1',
      detailDrawerRef,
      rowDetail,
    };
  },
  data() {
    return {
      categoryList: _areaType,
      shopType,
      companyType,
      shopTypeList,
      companyTypeList,
      is_year_customer: false,
      searchValue: '1',
      inputValue: '',
      categoryIndex: '',
      shopTypeIndex: 0,
      companyTypeIndex: 0,
      // 客户经理列表
      managerList: [],
      customerClass: 0,
      customerClassType: 0,
      customerLevel: '',
      customerLevelType: 0,
      manager: '',
      addBy: '', // 录入人
      multArgs: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 200],
        // total: 0,
      },
      customerVisible: false,
      multipleSelection: [],
      // 客户分类
      customerClassList,
      // 部门
      departmentList,
      // 客户阶段
      customerLevelList,
      defaultVal: '-',
      bodyRect: { ...getBodyRect() },
    };
  },
  computed: {
    currentPage() {
      // return this.$store.state.customer.currentPage;
      // @ts-ignore
      return this.pagination.currentPage;
    },
    // 当前选中项数量
    selectedCount() {
      // @ts-ignore
      return this.multipleSelection.length;
    },
    columnsWidth() {
      // @ts-ignore
      if (this.bodyRect.width <= 1280) {
        return [52, 258, 76, 89, 228, 259];
      } else {
        return [52, undefined, 76, 89, undefined, 259];
      }
    },
  },
  methods: {
    filterAreaStr: areaStr,
    // 表头帮助显示
    DispayHelp(type: string) {
      switch (type) {
        case 'khfl': // 客户分类
          return (
            <span>
              客户分类
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <p>根据合作金额划分：</p>
                  <p>普通客户0-50W</p>
                  <p>重点客户51-150W</p>
                  <p>战略客户151-250W</p>
                  <p>KA客户251W以上</p>
                  <p>351w以上标记为【年框】</p>
                </div>
                <i class="el-icon-question" style="cursor: pointer; margin-left: 3px;"></i>
              </el-tooltip>
            </span>
          );
        case 'zhzs': // 总合作数
          return (
            <span>
              总合作数 / 次
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <p>有登记业绩金额的合作，算一次有效合作</p>
                </div>
                <i class="el-icon-question" style="cursor: pointer; margin-left: 3px;"></i>
              </el-tooltip>
            </span>
          );
        case 'zhzje': // 总合作金额
          return (
            <span>
              总合作金额
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <p>该客户所有合作中，登记业绩金额的总和</p>
                </div>
                <i class="el-icon-question" style="cursor: pointer; margin-left: 3px;"></i>
              </el-tooltip>
            </span>
          );
        default:
          return <span>--</span>;
      }
    },
    searchValueHandle(val: string) {
      this.multArgs = '';
      this.addBy = '';
    },
    addCustomer() {
      this.customerVisible = true;
    },
    close() {
      this.customerVisible = false;
    },
    resetCustomer(): void {
      this.customerClass = 0;
      this.customerClassType = 0;
      this.addBy = '';
      this.multArgs = '';
      this.categoryIndex = '';
      this.shopTypeIndex = 0;
      this.companyTypeIndex = 0;
      this.business_type = '';
      this.inputValue = '';
      this.searchValue = '1';
      // this.pagination.currentPage = 1
      this.$store.commit('customer/updatePage', 1);
      // @ts-ignore
      this.queryCustomer();
    },
    saveCustomer(_data: any) {
      this.$message.success('保存成功');
      // @ts-ignore
      this.close();
      // @ts-ignore
      this.resetCustomer();
      // @ts-ignore
      this.queryCustomer();
    },
    // 获取用户
    queryUserNames(): void {
      // 角色（管理员1，客户执行0，客户经理2，项目经理3）
      const params = {
        role: ROLE_CODE.customer_manager + ',' + ROLE_CODE.major_customer_manager,
      };
      queryUserNames(params).then(res => {
        if (res.data.success) {
          this.managerList = res.data.data.user_data;
        }
      });
    },
    /**
     * 绑定导出参数
     */
    bindExportParams() {
      this.exportParams = {
        category: this.categoryIndex,
        shop_type: this.shopTypeIndex,
        company_type: this.companyTypeIndex,
        customer_class: this.customerClassType,
      } as any;
      if (this.searchValue === '1') {
        // @ts-ignore
        this.exportParams.add_by = this.inputValue;
      } else {
        // @ts-ignore
        this.exportParams.mult_args = this.inputValue;
      }
    },
    // 点击查询客户列表
    clickQueryCustomer() {
      this.$store.commit('customer/updatePage', 1);
      // @ts-ignore
      this.queryCustomer();
    },
    // 获取客户列表
    async queryCustomer(): Promise<void> {
      const params = {
        is_year_customer: this.is_year_customer,
        category: this.categoryIndex,
        shop_type: this.shopTypeIndex === 0 ? '' : this.shopTypeIndex,
        company_type: this.companyTypeIndex === 0 ? '' : this.companyTypeIndex,
        customer_class: this.customerClassType === 0 ? '' : this.customerClassType,
        // @ts-ignore
        num: this.pagination.pageSize,
        page_num: this.currentPage,
        business_type: this.business_type,
      };
      if (this.searchValue === '1') {
        // @ts-ignore
        params.add_by = this.inputValue;
      } else {
        // @ts-ignore
        params.mult_args = this.inputValue;
      }
      if (this.$route.name === 'MarketingCustomerList') {
        // @ts-ignore
        params.business_type = 1;
      }
      // 绑定导出参数
      // @ts-ignore
      this.bindExportParams();

      const getCustomerService = this.isMarketingMenu ? GetMarketingCustomer : GetCustomer;

      this.loading = true;
      // @ts-ignore
      const [res] = await wait(500, getCustomerService(params));
      this.loading = false;

      if (res.data.success) {
        this.list = res.data.data.data;
        this.total = res.data.data.total;
        // @ts-ignore
        this.pagination.currentPage = this.currentPage;
      }
    },
    // 导出客户
    exportCustomers() {
      let customerIds = [];
      const params = {
        customer_ids: '',
      };
      // 没选默认导出所有
      // @ts-ignore
      if (this.multipleSelection.length === 0) {
        if (this.exportParams) {
          // @ts-ignore
          params.category = this.exportParams.category || undefined;
          // @ts-ignore
          params.shop_type = this.exportParams.shop_type || undefined;
          // @ts-ignore
          params.company_type = this.exportParams.company_type || undefined;
          // @ts-ignore
          params.customer_class = this.exportParams.customer_class || undefined;
          // @ts-ignore
          if (this.exportParams.add_by) {
            // @ts-ignore
            params.add_by = this.exportParams.add_by;
          }
          // @ts-ignore
          if (this.exportParams.mult_args) {
            // @ts-ignore
            params.mult_args = this.exportParams.mult_args;
          }
        }
      } else {
        // 选了导出选择的
        // @ts-ignore
        customerIds = this.multipleSelection.map(cc => cc.id);
        params.customer_ids = JSON.stringify(customerIds);
      }
      exportCustomers(params);
    },
    // 删除客户

    async delCustomer() {
      // console.log(this.multipleSelection.map(c => c.has_achievement_or_cost).indexOf(true));
      // @ts-ignore
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择客户');
      } else {
        // 如果找不到true返回-1,就可以删,否则提示框标红
        // @ts-ignore
        if (this.multipleSelection.map(cc => cc.has_achievement_or_cost).indexOf(true) === -1) {
          const result = await AsyncConfirm({ root: this }, '此操作将永久删除该数据, 是否继续？');

          if (result) {
            // @ts-ignore
            const customerId = [];
            // @ts-ignore
            this.multipleSelection.forEach((item: any) => {
              customerId.push(item.id);
            });
            const params = {
              // @ts-ignore
              customer_id: JSON.stringify(customerId),
            };
            delCustomer(params).then(res => {
              if (res.data.success) {
                this.$message.success('删除成功');
                // @ts-ignore
                this.queryCustomer();
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        } else {
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('p', undefined, [
              h(
                'span',
                { style: 'color: #F26467;font-weight:bold;font-size:16px;' },
                '所选客户包含业绩或成本',
              ),
              h(
                'p',
                { style: 'color: var(--text-color);font-size:14px;' },
                '此操作将永久删除该数据, 是否继续?',
              ),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            iconClass: 'warning-icon2',
          }).then(() => {
            const customerId: number[] = [];
            // @ts-ignore
            this.multipleSelection.forEach((item: any) => {
              customerId.push(item.id);
            });
            const params = {
              customer_id: JSON.stringify(customerId),
            };
            delCustomer(params).then(res => {
              if (res.data.success) {
                this.$message.success('删除成功');
                // @ts-ignore
                this.queryCustomer();
              } else {
                this.$message.error(res.data.message);
              }
            });
          });
        }
      }
    },

    // 行点击显示详情抽屉
    openDetailDrawer(row: any, column: any, event: any) {
      // @ts-ignore
      this.rowDetail.add_by = row.add_by;
      // @ts-ignore
      this.rowDetail.brand_id = row.brand_id;
      // @ts-ignore
      this.rowDetail.brand_name = row.brand_name;
      // @ts-ignore
      this.rowDetail.business_type = row.business_type;
      // @ts-ignore
      this.rowDetail.category = row.category;
      // @ts-ignore
      this.rowDetail.companies = row.companies;
      // @ts-ignore
      this.rowDetail.company_type = row.company_type;
      // @ts-ignore
      this.rowDetail.shop_id = row.shop_id;
      // @ts-ignore
      this.rowDetail.shop_name = row.shop_name;
      // @ts-ignore
      this.rowDetail.shop_type = row.shop_type;

      // @ts-ignore
      this.detailDrawerRef.openDrawer();
    },
    handleSizeChange(val: number) {
      // @ts-ignore
      this.pagination.pageSize = val;
      this.$store.commit('customer/updatePage', 1);
      // @ts-ignore
      this.queryCustomer();
    },
    handleCurrentChange(val: string) {
      // this.pagination.currentPage = val
      this.$store.commit('customer/updatePage', val);
      // @ts-ignore
      this.queryCustomer();
    },
    // 选择客户分类
    selectCustomerClass(type: any) {
      this.customerClassType = type;
    },
    handleSelectionChange(val: any) {
      this.multipleSelection = val;
    },
    categoryFormate,
    addDateFormat,
    // 更新分页并重载数据
    // 提供给标签组
    updatePageAndReload() {
      this.$store.commit('customer/updatePage', 1);
      // @ts-ignore
      this.queryCustomer();
    },
    resizeLinstener() {
      const { width, height } = getBodyRect();
      this.bodyRect = { width, height };
    },
  },
  components: {
    addCustomer,
    companyDetail,
    // stepMini,
  },
  watch: {
    currentPage(value: number) {
      // @ts-ignore
      this.pagination.currentPage = value;
    },
    $route: {
      handler(val: any, oldval: any) {
        if (
          val.name !== oldval.name &&
          !['CustomerList', 'MarketingCustomerList', 'MarketingShopDetail'].includes(val.name)
        ) {
          // @ts-ignore
          this.resetCustomer();
          this.customerClass = 0;
          this.customerClassType = 0;
          this.addBy = '';
          this.multArgs = '';
          this.categoryIndex = '';
          this.shopTypeIndex = 0;
          this.companyTypeIndex = 0;
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  activated() {
    // @ts-ignore
    this.queryCustomer();
  },
  mounted() {
    // @ts-ignore
    this.queryUserNames();
    // @ts-ignore
    this.queryCustomer();

    // @ts-ignore
    window.addEventListener('resize', this.resizeLinstener);
    resize();
  },
  destroyed() {
    // @ts-ignore
    window.removeEventListener('resize', this.resizeLinstener);
  },
});
