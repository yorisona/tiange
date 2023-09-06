import { computed, defineComponent, inject, provide, ref } from '@vue/composition-api';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import {
  ExportMonitorAnalysisReport,
  GetCommoditySettingConfig,
  GetCompetitiveShops,
  GetQueryDouyinReportProjects,
  GetCommodityMonitorAnalysis,
  UpDataCommodityMonitorAnalysis,
  GetQueryAnalysisCategory,
  GetCommodityYearSeasonRule,
} from '@/services/datacenter';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { RouterDataCenter } from '@/const/router';
import { numberFormat } from '@/utils/formatMoney';
import { get_folded_text } from '@/utils/string';
import formatPriceForm from '@/utils/formatData';
import {
  shopBaseColumns,
  shopSaleColumns,
  shopLastSaleColumns,
  shopWeekSaleColumns,
  shopAllSaleColumns,
  shopAllBaseColumns,
  getLineArr,
} from './use';
import { monitorAnalysisItem, saleCountItemOpt, settingItem, settingItemOpt } from './types';
import { sleep, wait } from '@/utils/func';
import { useDialog } from '@/use/dialog';
import targetSettingDialog from '@/modules/datacenter/commodityAnalysis/components/setting/targetSettting.vue';
import uploadTemplate from './dialog/uploadTemplate/index.vue';
import { Confirm } from '@/use/asyncConfirm';

const { formatPriceFormYuan } = formatPriceForm;
type CatBase = {
  cat_id: number;
  cat_name: string;
  sub_categories?: any;
};
const routes = [
  {
    name: RouterDataCenter.commodityAnalysis,
    title: '品牌商品分析',
  },
  {
    path: '',
    title: '商品监控分析',
  },
];
export default defineComponent({
  name: 'TgDataCenterMonitor',
  components: {},
  setup(_, ctx) {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 0;
    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight, -42],
      tableMinHeight: 100,
    });
    const shop_name_list = ref<String[]>([]);
    const queryForm = ref({
      shop_name: [] as string[],
      project_id: undefined as number | string | undefined,
      project_name: undefined as string | undefined,
      item_id: undefined,
      item_sn: undefined,
      first_cat_id: undefined as number | undefined,
      first_tiange_cat_name: undefined as string | undefined,
      third_cat_id: undefined as number[] | undefined,
      third_tiange_cat_name: undefined as string | undefined,
      year: undefined,
      season: undefined,
      product_status: 0,
      sample_status: undefined,
      page_num: 1,
      num: 10,
    });
    const querySelectForm = ref(JSON.parse(JSON.stringify(queryForm.value)));
    const total = ref(0);
    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      querySelectForm.value.page_num = page_num;
      reloadListData();
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      queryForm.value.page_num = 1;
      querySelectForm.value.page_num = 1;
      querySelectForm.value.num = num;
      reloadListData();
    };
    provide('searchParams', queryForm);
    const updateRouterParams = () => {
      const router = useRouter();
      const { project_id, project_name } = router.currentRoute.query;
      queryForm.value.project_id = project_id ? Number(project_id) : undefined;
      queryForm.value.project_name = project_name as string | undefined;
      querySelectForm.value = JSON.parse(JSON.stringify(queryForm.value));
    };
    updateRouterParams();

    /** 项目列表 */
    const project_list = ref<
      { project_id: string; project_name: string; project_status: number; new_report: boolean }[]
    >([]);
    const queryData = () => {
      GetQueryDouyinReportProjects().then(res => {
        project_list.value = res.data.data.projects;
      });
    };
    queryData();

    /** 项目切换 */
    const getProjectId = () => {
      competitiveData();
      getFirstCatList();
      getYearSectionParams();
      upSettingDataParams(false);
    };

    /** 点击按钮查询*/
    const onQueryClick = () => {
      upTableData(false);
      queryForm.value.page_num = 1;
      querySelectForm.value = JSON.parse(JSON.stringify(queryForm.value));
      reloadListData();
    };

    /** 表格数据处理 */
    const getNewList = (arr: monitorAnalysisItem[]) => {
      return arr.map((item: monitorAnalysisItem) => {
        item.is_sample = item.has_sample === '有' ? 1 : item.has_sample === '无' ? 0 : null;
        item.sale_count_list_line = getLineArr(
          (item.sale_count_list || []).filter((_: saleCountItemOpt, subIndex: number) => {
            return isShowColumn('Day' + (7 - subIndex) + '销量');
          }),
        );
        item.last_4week_sale_info_line = getLineArr(
          (item.last_4week_sale_info || []).filter((_: saleCountItemOpt, subIndex: number) => {
            return isShowColumn(
              subIndex !== 3 ? '第W-' + (3 - subIndex || '') + '周销量' : '第W周销量',
              true,
              '近4周销售跟踪',
            );
          }),
        );
        item.competitive_sku_info_list = item.competitive_sku_info_list.map((sub: any) => {
          sub.last_4week_sale_info_line = getLineArr(
            (sub.last_4week_sale_info || []).filter((_: saleCountItemOpt, thirdIndex: number) => {
              return isShowColumn(
                thirdIndex !== 3 ? '第W-' + (3 - thirdIndex || '') + '周销量' : '第W周销量',
                false,
                '近4周销售跟踪',
              );
            }),
          );
          return sub;
        });
        return item;
      });
    };

    /** 更新表格数据 */
    const reloadListData = async () => {
      if (!querySelectForm.value.project_id) {
        ctx.root.$message.warning('请选择项目');
        return;
      }
      loading.value = true;
      const payload: any = {
        project_id: querySelectForm.value.project_id,
        sample_status: querySelectForm.value.sample_status,
        product_status: querySelectForm.value.product_status,
        year: querySelectForm.value.year,
        season: querySelectForm.value.season,
        third_cat_id_list: querySelectForm.value.third_cat_id
          ? querySelectForm.value.third_cat_id.join(',')
          : '',
        first_cat_id: querySelectForm.value.first_cat_id,
        sn: querySelectForm.value.item_sn,
        item_id: querySelectForm.value.item_id,
        shop_names: querySelectForm.value.shop_name
          ? querySelectForm.value.shop_name.join(',')
          : '',
        num: querySelectForm.value.num,
        page_num: querySelectForm.value.page_num,
      };
      const [{ data: response }] = await wait(500, GetCommodityMonitorAnalysis(payload));
      if (response.success) {
        total.value = response.data.total;
        shop_name_list.value = response.data.shop_name_list;
        list.value = getNewList(response.data.data);
        loading.value = false;
        mainTableKey.value = Math.random();
      } else {
        list.value = [];
        total.value = 0;
        loading.value = false;
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    const loading = ref(false);
    const list = ref<monitorAnalysisItem[]>([]);
    const clickCellLabel = ref('');
    const clickRow = ref(0);
    const onRowClick = (row: any, column: any) => {
      if (
        column.label.indexOf('追单') >= 0 ||
        column.label.indexOf('商品健康度') >= 0 ||
        column.label.indexOf('商品策略建议') >= 0
      ) {
        clickRow.value = row.index;
        clickCellLabel.value = column.label;
      } else {
        clickCellLabel.value = '';
      }
    };

    const exportLoading = ref(false);
    const exportBtnClick = async () => {
      exportLoading.value = true;
      const payload = {
        project_id: querySelectForm.value.project_id,
        sample_status: querySelectForm.value.sample_status,
        product_status: querySelectForm.value.product_status,
        year: querySelectForm.value.year,
        season: querySelectForm.value.season,
        third_cat_id_list: querySelectForm.value.third_cat_id
          ? querySelectForm.value.third_cat_id.join(',')
          : '',
        first_cat_id: querySelectForm.value.first_cat_id,
        sn: querySelectForm.value.item_sn,
        item_id: querySelectForm.value.item_id,
        shop_names: querySelectForm.value.shop_name
          ? querySelectForm.value.shop_name.join(',')
          : '',
      };

      const [{ data: response }] = await wait(500, ExportMonitorAnalysisReport(payload));
      exportLoading.value = false;
      if (response.success) {
        await Confirm({
          title: '导出任务创建成功',
          content: '请稍后去工作台-我的文件查看。',
          confirmText: '确定',
          showCancelBtn: false,
        });
      } else {
        ctx.root.$message.error(response.message || '导出任务创建失败，请重新导出！');
      }
    };

    //获取竞品店铺
    const competitiveList = ref<any[]>([]);
    const competitiveData = async (isFirst = false) => {
      const {
        data: { data },
      } = await GetCompetitiveShops({
        project_id: Number(queryForm.value.project_id || 0),
        has_self: false,
        local: 2,
      });
      if (data && data.length > 0) {
        competitiveList.value = data || [];
        queryForm.value.shop_name = (data || [])
          .filter((item: { shop_name: string; style: number; choice: number | boolean }) => {
            return item.choice === 1 || item.choice === true;
          })
          .map((sub: { shop_name: string }) => {
            return sub.shop_name;
          });
      }
      if (isFirst) {
        setTimeout(() => {
          querySelectForm.value = JSON.parse(JSON.stringify(queryForm.value));
          reloadListData();
        }, 200);
      }
    };
    competitiveData(true);

    /** 类目名称搜索 */
    const firstCatList = ref<CatBase[]>([]);
    const thirdCatList = ref<CatBase[]>([]);

    const getFirstCatList = async () => {
      const { data: response } = await GetQueryAnalysisCategory({
        project_id: queryForm.value.project_id,
      });
      if (response.success) {
        firstCatList.value = response.data || [];
        const catOne = firstCatList.value.filter(item => {
          return item.cat_id === queryForm.value.first_cat_id;
        });
        queryForm.value.first_cat_id =
          catOne && catOne.length > 0 ? queryForm.value.first_cat_id : undefined;
        thirdCatList.value = catOne && catOne[0] ? catOne[0].sub_categories : [];
        const third_cat_id: number[] = [];
        thirdCatList.value.map(item => {
          if ((queryForm.value.third_cat_id || []).indexOf(item.cat_id) >= 0) {
            third_cat_id.push(item.cat_id);
          }
        });
        queryForm.value.third_cat_id = third_cat_id || undefined;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const yearList = ref<{ chars: String; real: String }[]>([]);
    const quarterList = ref<{ chars: String; real: String }[]>([]);
    const getYearSectionParams = async () => {
      const [{ data: response }] = await wait(
        500,
        GetCommodityYearSeasonRule({ project_id: Number(queryForm.value.project_id || 0) }),
      );
      if (response.success && response.data) {
        yearList.value = response.data.year.data.length > 0 ? response.data.year.data : [];
        quarterList.value = response.data.season.data.length > 0 ? response.data.season.data : [];
        const yearOne = yearList.value.filter(item => {
          return item.real === queryForm.value.year;
        });
        queryForm.value.year = yearOne && yearOne.length > 0 ? queryForm.value.year : undefined;
        const quarterOne = quarterList.value.filter(item => {
          return item.real === queryForm.value.season;
        });
        queryForm.value.season =
          quarterOne && quarterOne.length > 0 ? queryForm.value.season : undefined;
      }
    };
    /** 初始数据获取 */
    getFirstCatList();
    getYearSectionParams();
    const onFirstCatChange = async (cat_id: number) => {
      queryForm.value.first_cat_id = cat_id;
      queryForm.value.third_cat_id = undefined;
      queryForm.value.third_tiange_cat_name = '';
      const catOne = firstCatList.value.filter(item => {
        return item.cat_id === cat_id;
      });
      thirdCatList.value = catOne && catOne[0] ? catOne[0].sub_categories : [];
    };
    const onThirdCatChange = (cat_id: number[]) => {
      queryForm.value.third_cat_id = cat_id || undefined;
    };

    /** 表头渲染 */
    const renderHeader = (h: any, { column }: { column: any }) => {
      const header = column.label.split(' ');
      return [h('p', [h('p', { class: 'title-p' }, header[0]), h('span', {}, header[1])])];
    };
    const weekDayArr = computed(() => {
      return list.value.length > 0 && list.value[0].sale_count_list
        ? list.value[0].sale_count_list.map((item: { sale_count: number; date: string }) => {
            return moment(item.date).format('MM.DD');
          })
        : [
            moment().add(-7, 'day').format('MM.DD'),
            moment().add(-6, 'day').format('MM.DD'),
            moment().add(-5, 'day').format('MM.DD'),
            moment().add(-4, 'day').format('MM.DD'),
            moment().add(-3, 'day').format('MM.DD'),
            moment().add(-2, 'day').format('MM.DD'),
            moment().add(-1, 'day').format('MM.DD'),
          ];
    });
    /** 完整字段显示 */
    const showShopMoreSetting = ref(false);
    const selectRow = ref(undefined);

    const showAllClick = (row: any) => {
      console.log('show');
      showShopMoreSetting.value = true;
      selectRow.value = row;
    };
    /** 指标配置显示 */
    const saleSelfBaseList = ref<settingItem[]>([]);
    const saleCompetitiveBaseList = ref<settingItem[]>([]);
    /** 传递数据到指标配置*/
    const saleSettingSelfBaseList = ref<settingItem[]>([]);
    const saleSettingCompetitiveBaseList = ref<settingItem[]>([]);
    const checkedSelfArr = ref<String[][]>([]);
    const checkedCompetitiveArr = ref<String[][]>([]);
    const showColumnArr = ref<Boolean[]>([]);
    const dialogTargetSetting = useDialog({
      component: targetSettingDialog,
      title: '指标设置',
      width: '880px',
      footer: false,
      on: {
        submit() {
          upSettingDataParams(true);
        },
      },
    });
    const showSettingClick = async () => {
      if (saleSelfBaseList.value.length < 1) {
        await upSettingDataParams(true);
      }
      dialogTargetSetting.show(
        querySelectForm.value.project_id,
        saleSelfBaseList.value,
        saleCompetitiveBaseList.value,
      );
    };
    /** table-key 刷新表格 */
    const mainTableKey = ref(0);
    /** 获取指标配置数据 */
    const upSettingDataParams = async (isRefresh = false) => {
      const [{ data: response }] = await wait(
        500,
        GetCommoditySettingConfig({ project_id: Number(queryForm.value.project_id || 0) }),
      );
      if (response.success && response.data) {
        saleSettingSelfBaseList.value = response.data.data.self_config || [];
        saleSettingCompetitiveBaseList.value = response.data.data.competitive_config || [];
        if (isRefresh) {
          upTableData();
        }
      }
    };
    /** 更新表格 */
    const upTableData = (isRefresh = true) => {
      if (
        JSON.stringify(saleCompetitiveBaseList.value) !==
          JSON.stringify(saleSettingCompetitiveBaseList.value) ||
        JSON.stringify(saleSelfBaseList.value) !== JSON.stringify(saleSettingSelfBaseList.value)
      ) {
        saleCompetitiveBaseList.value = JSON.parse(
          JSON.stringify(saleSettingCompetitiveBaseList.value),
        );
        saleSelfBaseList.value = JSON.parse(JSON.stringify(saleSettingSelfBaseList.value));
        checkedSelfArr.value = saleSelfBaseList.value.map((item: settingItem) => {
          return (
            item.children
              .filter((it: settingItemOpt) => it.select)
              .map((sub: settingItemOpt) => sub.name) || []
          );
        });
        checkedCompetitiveArr.value = saleCompetitiveBaseList.value.map((item: settingItem) => {
          return item.children
            .filter((it: settingItemOpt) => it.select)
            .map((sub: settingItemOpt) => sub.name);
        });
      }
      /** 列显示的情况 */
      showColumnArr.value = [
        isShowColumn('商品销售信息'),
        isShowColumn('近7天销售跟踪'),
        isShowColumn('上周销售跟踪'),
        isShowColumn('近4周销售跟踪'),
        isShowColumn('累计销售统计'),
        isShowColumn('商品基本属性'),
        isShowColumn('近4周销售跟踪', false),
        isShowColumn('累计销售统计', false),
      ];
      if (isRefresh && list.value && list.value.length > 1) {
        list.value = getNewList(list.value);
        mainTableKey.value = Math.random();
      }
    };
    upSettingDataParams(true);

    /** 导入 */
    const dialogUploadTemplate = useDialog({
      component: uploadTemplate,
      title: '数据导入',
      width: '300px',
      footer: false,
      on: {
        submit() {
          onQueryClick();
        },
      },
    });
    const importClick = () => {
      dialogUploadTemplate.show();
    };

    /** 列是否显示 */
    const isShowColumn = (name: string, isSelf = true, parentName = '') => {
      let find = false;
      let saleBaseArr = saleSelfBaseList.value;
      if (!isSelf) {
        saleBaseArr = saleCompetitiveBaseList.value;
      }
      if (saleBaseArr.length < 1) {
        return true;
      }
      if (
        name === '商品销售信息' ||
        name === '近7天销售跟踪' ||
        name === '上周销售跟踪' ||
        name === '近4周销售跟踪' ||
        name === '累计销售统计' ||
        name === '商品基本属性' ||
        name === '累计销售统计'
      ) {
        const baseItem: any = saleBaseArr.find(it => it.label === name);
        const children = baseItem
          ? baseItem.children.filter((sub: settingItemOpt) => sub.select)
          : [];
        return children.length > 0;
      }
      const week = moment().add(-1, 'week').format('ww');
      name = name.replace(week + '周', 'W周');
      name = name.replace(Number(week) + '周', 'W周');
      name = name.replace(' （手动维护）', '');
      saleBaseArr.map((item: settingItem) => {
        item.children
          .filter((it: settingItemOpt) => it.select)
          .map((sub: settingItemOpt) => {
            /** 父组件 */
            if (
              (parentName && parentName === item.label && isShowColumn(parentName, isSelf)) ||
              (!parentName && sub.name === name)
            ) {
              if (sub.name === name) {
                find = true;
              }
            }
          });
      });
      return find;
    };
    /** 表头的class,颜色变化 */
    const getClassNameColumn = (name: string) => {
      let className = '';
      switch (name) {
        case '商品销售信息':
          className = showColumnArr.value[0]
            ? 'department-fund-statement-head-odd'
            : 'department-fund-statement-head-even';
          break;
        case '近7天销售跟踪':
          className = showColumnArr.value[0]
            ? 'department-fund-statement-head-even'
            : 'department-fund-statement-head-odd';
          break;
        case '上周销售跟踪':
          className =
            showColumnArr.value.slice(0, 2).filter(it => it).length % 2 === 0
              ? 'department-fund-statement-head-odd'
              : 'department-fund-statement-head-even';
          break;
        case '近4周销售跟踪':
          className =
            showColumnArr.value.slice(0, 3).filter(it => it).length % 2 === 1
              ? 'department-fund-statement-head-even'
              : 'department-fund-statement-head-odd';
          break;
        case '累计销售统计':
          className =
            showColumnArr.value.slice(0, 4).filter(it => it).length % 2 === 0
              ? 'department-fund-statement-head-odd'
              : 'department-fund-statement-head-even';
          break;
        case '商品基本属性':
          className =
            showColumnArr.value.slice(0, 5).filter(it => it).length % 2 === 1
              ? 'department-fund-statement-head-even'
              : 'department-fund-statement-head-odd';
          break;
        default:
          className = '';
      }
      return className;
    };
    /**  更新数据 */
    const inputBlur = async (row: any) => {
      if (clickCellLabel.value === '') {
        return;
      }
      clickCellLabel.value = '';
      const payload: any = {
        data: {
          additional_order: row.additional_order,
          advice: row.advice,
          health: row.health,
          has_sample: row.has_sample === '有' ? 1 : row.has_sample === '无' ? 0 : null,
        },
        item_id: row.item_id || undefined,
        spec_id: row.spec_id,
      };
      const [{ data: response }, _] = await Promise.all([
        await UpDataCommodityMonitorAnalysis(payload),
        await sleep(200),
      ]);
      if (response.success) {
        ctx.root.$message.success(response.message ?? '保存成功');
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    const getXY = (
      type: string,
      index: number,
      subIndex: number,
      competitive_sku_info_list: any,
    ) => {
      return competitive_sku_info_list.length > index &&
        competitive_sku_info_list[index].last_4week_sale_info_line.length > subIndex
        ? competitive_sku_info_list[index].last_4week_sale_info_line[subIndex][type]
        : 0;
    };
    const onResetClick = async () => {
      loading.value = true;
      updateRouterParams();
      await getProjectId(); //获取筛选选择
      queryForm.value.item_sn = undefined;
      queryForm.value.item_id = undefined;
      queryForm.value.first_cat_id = undefined;
      queryForm.value.first_tiange_cat_name = '';
      queryForm.value.third_cat_id = undefined;
      queryForm.value.third_tiange_cat_name = '';
      queryForm.value.year = undefined;
      queryForm.value.season = undefined;
      queryForm.value.sample_status = undefined;
      queryForm.value.product_status = 0;
      onQueryClick();
    };
    return {
      onResetClick,
      getXY,
      importClick,
      inputBlur,
      shop_name_list,
      total,
      handleCurrentChange,
      handlePageSizeChange,
      mainTableKey,
      showColumnArr,
      getClassNameColumn,
      isShowColumn,
      saleSettingSelfBaseList,
      saleSettingCompetitiveBaseList,
      saleCompetitiveBaseList,
      saleSelfBaseList,
      checkedSelfArr,
      checkedCompetitiveArr,
      showSettingClick,
      selectRow,
      showShopMoreSetting,
      showAllClick,
      shopAllBaseColumns,
      shopAllSaleColumns,
      shopWeekSaleColumns,
      shopLastSaleColumns,
      weekDayArr,
      renderHeader,
      clickRow,
      clickCellLabel,
      yearList,
      quarterList,
      firstCatList,
      thirdCatList,
      onFirstCatChange,
      onThirdCatChange,
      getFirstCatList,
      shopBaseColumns,
      shopSaleColumns,
      competitiveList,
      loading,
      onRowClick,
      onTopCardRectUpdate,
      list,
      formatPriceFormYuan,
      numberFormat,
      get_folded_text,
      exportBtnClick,
      exportLoading,
      ProjectStatusEnum,
      getProjectId,
      queryForm,
      querySelectForm,
      project_list,
      ...tableHeightLogic,
      onQueryClick,
    };
  },
});
