/*
 * @Author: 肖槿
 * @Date: 2021-07-20 16:16:59
 * @Description: 达人管理
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-09-30 18:29:42
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\index.ts
 */
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  h,
  watch,
  onActivated,
} from '@vue/composition-api';
import { useList } from './use/list';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { BusinessTypeEnum, BusinessTypeOptions } from '@/types/tiange/common';
import { resize } from '@/utils/dom';
import {
  mediaType,
  kolTagList,
  newKolTagList,
  newPlatformList,
  areaType,
  KolVerifyStatusEnum,
  kolVerifyStatus,
  kolVerifyStatusFilter,
  specialList,
  KolTagEnum,
} from '@/const/kolConst';
import { RouterNameSupplier } from '@/const/router';
import inputRange from './inputRange.vue';
import { exportKol } from '@/api/medium';
import { get_limited_length_string } from '@/utils/string';
import Folder from '@/modules/supplier/components/folder/index.vue';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  name: 'kolManage',
  components: {
    inputRange,
    Folder,
  },
  setup(prop, ctx) {
    const router = useRouter();
    const kolLogic = useList(ctx);
    const buttonLineHeight = 32;
    const paginationLineHeight = 46;
    const rectPadding = 30;
    const otherHeight = 12;
    const categoryIndex = ref('');
    const topCardHeight = ref(0);
    const citys = ref([]);
    const show = ref(false);
    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      fixedBlockHeightRefs: [topCardHeight],
      pagename: 'customer_shop',
    });
    const Permission = computed(() => {
      const canViewKolList = HasPermission(NEW_RIGHT_CODE.kol_list);
      const canEditKol = HasPermission(NEW_RIGHT_CODE.kol_edit);
      const canCreateKol = HasPermission(NEW_RIGHT_CODE.kol_create);
      const canExportKol = HasPermission(NEW_RIGHT_CODE.kol_export);
      const canDeleteKol = HasPermission(NEW_RIGHT_CODE.kol_delete);
      const canApprovalKol = HasPermission(NEW_RIGHT_CODE.kol_approval);

      return {
        canEditKol,
        canCreateKol,
        canViewKolList,
        canExportKol,
        canDeleteKol,
        canApprovalKol,
      };
    });
    const salesRange = ref([]);
    const myAreaType = computed(() => [
      { label: '全部', value: 0 },
      ...areaType.map((item: any) => ({
        label: item.value,
        value: item.key,
      })),
    ]);
    const newMediaType = computed(() =>
      mediaType.map((item: any) => ({ label: item.value, value: item.key })),
    );
    const onTopCardRectUpdate = (rect: any) => {
      topCardHeight.value = rect.height - 40;
    };
    const clickQueryCustomer = () => {
      kolLogic.filterParams.value.page = 1;
      kolLogic.pagination.value.currentPage = 1;
      kolLogic.getKolList(kolLogic.filterParams.value);
    };
    const resetCustomer = () => {
      /*const newdate = new Date();
      const timestr =
        newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate();*/
      kolLogic.filterParams.value = {
        kol_name: '',
        business_type: '',
        area: 0,
        platform: '',
        kol_tag: '',
        verify_status: '',
        add_by: '',
        page: 1,
        num: 20,
        gmt_modified_gte: '',
      };
      salesRange.value = [];
      citys.value = [];
      kolLogic.getKolList(kolLogic.filterParams.value);
    };

    if (router.currentRoute.query.source === 'console_kol_apply') {
      kolLogic.filterParams.value.verify_status = String(KolVerifyStatusEnum.PENDING);
    }
    const addCol = () => {
      ctx.root.$router.push({
        name: RouterNameSupplier.generate,
      });
    };
    const exportCustomers = () => {
      const kolIds = kolLogic.customerList.value.map(item => item.kol_info.kol_id);
      exportKol({
        kol_ids: JSON.stringify(kolIds),
      });
    };
    const importCustomers = (file: any) => {
      kolLogic.importAjax(file);
    };
    const goDetail = (row: any, colomn: any, evt: any) => {
      if (evt.target.nodeName !== 'SPAN') {
        ctx.root.$router.push({
          name: RouterNameSupplier.listDetail,
          params: { id: `${row.kol_info.kol_id}` },
        });
      }
    };
    const handleSizeChange = (num: number) => {
      kolLogic.filterParams.value.num = num;
      kolLogic.getKolList(kolLogic.filterParams.value);
    };
    const handleCurrentChange = (page: number) => {
      kolLogic.filterParams.value.page = page;
      kolLogic.getKolList(kolLogic.filterParams.value);
    };
    const businessTypeOptions = [
      { value: BusinessTypeEnum.marketing, label: '整合营销' },
      { value: BusinessTypeEnum.mcn, label: '创新项目' },
    ];
    const currentTagList = ref<any>([
      {
        value: KolTagEnum.GRASS_KOL,
        label: '种草达人',
      },
      {
        value: KolTagEnum.LIVE_KOL,
        label: '直播达人',
      },
      {
        value: KolTagEnum.TAOBAO_KOL,
        label: '淘宝KOL',
      },
      {
        value: KolTagEnum.TAOBAO_KOC,
        label: '淘宝KOC',
      },
      {
        value: KolTagEnum.DOUYIN_KOL,
        label: '抖音KOL',
      },
      {
        value: KolTagEnum.DOUYIN_KOC,
        label: '抖音KOC',
      },
    ]);
    const filters = (value: any, arr: any) => {
      return arr.find((item: any) => item.value === value)?.label || '--';
    };
    const changeShowMoreParams = () => {
      show.value = !show.value;
    };
    /** 公司名称渲染函数 */
    const kol_company_name_render = <T extends boolean>(
      row: any,
      text_only: T,
    ): TableColumnRenderReturn<T> => {
      const { is_folded, folded_text } = get_limited_length_string(
        row.kol_info.kol_company_name ? row.kol_info.kol_company_name : '--',
        14,
      );

      if (text_only) {
        return folded_text;
      }

      if (is_folded) {
        return h('div', { class: 'company-name-line' }, [
          h(
            'el-popover',
            {
              props: {
                placement: 'right',
                content: row.kol_info.kol_company_name,
                trigger: 'hover',
              },
            },
            [h('div', { slot: 'reference', class: 'company-name item-hover' }, [folded_text])],
          ),
        ]) as TableColumnRenderReturn<T>;
      } else {
        return h('div', { class: 'company-name-line' }, folded_text) as TableColumnRenderReturn<T>;
      }
    };
    const company_name_render = <T extends boolean>(row: any, text_only: T) => {
      const data = row.kol_info.kol_name ?? '--';
      const { is_folded, folded_text } = get_limited_length_string(data, 9);
      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
                width: '220',
                openDelay: 300,
              },
            },
            [h('div', { slot: 'reference', class: 'company-name item-hover' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };
    const kolColumn = ref<any[]>([
      {
        label: '达人名称',
        minWidth: 68,
        formatter: (row: any) => company_name_render(row, false),
      },
      {
        label: '业务类型',
        minWidth: 68,
        align: 'center',
        formatter: (row: any) => {
          if (row.kol_info.business_type.length) {
            const businessType: number[] = row.kol_info.business_type.filter(
              (item: any) => item === BusinessTypeEnum.marketing || item === BusinessTypeEnum.mcn,
            );
            const businessTypeList: string[] = businessType.map(item =>
              filters(item, BusinessTypeOptions),
            );
            const businessTypeListStr = businessTypeList.length
              ? businessTypeList.join('、')
              : '--';
            return h(
              'div',
              { slot: 'reference', class: 'popover-div-ellipsis' },
              businessTypeListStr,
            );
          } else {
            return '--';
          }
        },
      },
      {
        label: '达人标签',
        minWidth: 108,
        align: 'center',
        formatter: (row: any) => {
          return h('div', {}, filters(row.kol_info.kol_tag, kolTagList));
        },
      },
      {
        label: '所属公司',
        minWidth: 136,
        align: 'left',
        headerAlign: 'left',
        formatter: (row: any) => kol_company_name_render(row, false),
      },
      {
        label: '是否专票',
        minWidth: 88,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => {
          return h('div', {}, filters(row.kol_info.special_ticket, specialList));
        },
      },
      {
        label: '擅长类目',
        minWidth: 88,
        align: 'left',
        headerAlign: 'left',
        formatter: (row: any) => {
          if (row.kol_info.areas) {
            const areaList: string[] = row.kol_info.areas.split('、');
            const areaVnode = areaList.map(item => h('span', {}, item));
            const areaListStr = areaList.join('、');
            return h(
              'el-popover',
              {
                props: {
                  trigger: 'hover',
                  openDelay: 300,
                  width: 270,
                  placement: 'bottom-start',
                },
              },
              [
                h('div', { class: 'xiaojin-popover-span-area' }, areaVnode),
                h('div', { slot: 'reference', class: 'popover-div-ellipsis' }, areaListStr),
              ],
            );
          } else {
            return '--';
          }
        },
      },
      {
        label: '创建人',
        minWidth: 90,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => {
          return h('div', {}, row.kol_info.add_by ? row.kol_info.add_by : '--');
        },
      },
      {
        label: '审核状态',
        minWidth: 90,
        align: 'center',
        formatter: (row: any) => {
          let className = 'point fail';
          if (row.kol_info.verify_status === KolVerifyStatusEnum.PENDING) {
            className = 'point process';
          } else if (row.kol_info.verify_status === KolVerifyStatusEnum.APPROVED) {
            className = 'point success';
          } else if (row.kol_info.verify_status === KolVerifyStatusEnum.NOT_APPROVED) {
            className = 'point block';
          }
          return h(
            'div',
            {
              class: 'co-status',
              style: {
                width: '100%',
                justifyContent: 'center',
              },
            },
            [
              h('div', { class: className }, ''),
              h('div', { class: 'success' }, filters(row.kol_info.verify_status, kolVerifyStatus)),
            ],
          );
        },
      },
      {
        label: '操作',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => {
          const editButton =
            Permission.value.canEditKol &&
            row.kol_info.verify_status === KolVerifyStatusEnum.NOT_APPROVED
              ? h(
                  'el-button',
                  {
                    attrs: { type: 'text', style: 'padding: 0' },
                    on: {
                      click: (evt: any) => {
                        // evt.target.stopPropagation();
                        if (evt.target.nodeName === 'SPAN') {
                          ctx.root.$router.push({
                            path: '/supplier/generate/generate/' + row.kol_info.kol_id,
                          });
                        }
                      },
                    },
                  },
                  '编辑',
                )
              : '';
          const approvalButton =
            Permission.value.canApprovalKol &&
            row.kol_info.verify_status === KolVerifyStatusEnum.PENDING
              ? h(
                  'el-button',
                  {
                    attrs: { type: 'text', style: 'padding: 0' },
                    on: {
                      click: (evt: any) => {
                        // evt.target.stopPropagation();
                        if (evt.target.nodeName === 'SPAN') {
                          ctx.root.$router.push({
                            path: '/supplier/generate/approval/' + row.kol_info.kol_id,
                          });
                        }
                      },
                    },
                  },
                  '审核',
                )
              : '';
          return [editButton, approvalButton];
        },
      },
    ]);
    watch(
      () => ctx.root.$route,
      (pro, next) => {
        if (next.name === 'SupplierGenerate') {
          kolLogic.getKolList(kolLogic.filterParams.value);
        }
      },
    );
    watch(
      () => kolLogic.filterParams.value.business_type,
      (val: any) => {
        if (val === BusinessTypeEnum.marketing) {
          currentTagList.value = [
            {
              value: KolTagEnum.GRASS_KOL,
              label: '种草达人',
            },
            {
              value: KolTagEnum.LIVE_KOL,
              label: '直播达人',
            },
          ];
        } else if (val === BusinessTypeEnum.mcn) {
          currentTagList.value = [
            {
              value: KolTagEnum.TAOBAO_KOL,
              label: '淘宝KOL',
            },
            {
              value: KolTagEnum.TAOBAO_KOC,
              label: '淘宝KOC',
            },
            {
              value: KolTagEnum.DOUYIN_KOL,
              label: '抖音KOL',
            },
            {
              value: KolTagEnum.DOUYIN_KOC,
              label: '抖音KOC',
            },
          ];
        } else {
          currentTagList.value = [
            {
              value: KolTagEnum.GRASS_KOL,
              label: '种草达人',
            },
            {
              value: KolTagEnum.LIVE_KOL,
              label: '直播达人',
            },
            {
              value: KolTagEnum.TAOBAO_KOL,
              label: '淘宝KOL',
            },
            {
              value: KolTagEnum.TAOBAO_KOC,
              label: '淘宝KOC',
            },
            {
              value: KolTagEnum.DOUYIN_KOL,
              label: '抖音KOL',
            },
            {
              value: KolTagEnum.DOUYIN_KOC,
              label: '抖音KOC',
            },
          ];
        }
        if (
          !currentTagList.value.find(
            (item: any) => item.value === kolLogic.filterParams.value.kol_tag,
          )
        ) {
          kolLogic.filterParams.value.kol_tag = '';
        }
      },
    );
    onMounted(() => {
      kolLogic.getKolList(kolLogic.filterParams.value);
      kolLogic.getCategorData();
      kolLogic.fetchCityData();
      resize();
    });
    onActivated(() => {
      kolLogic.getKolList(kolLogic.filterParams.value);
    });
    return {
      onTopCardRectUpdate,
      categoryIndex,
      Permission,
      clickQueryCustomer,
      resetCustomer,
      handleSizeChange,
      handleCurrentChange,
      addCol,
      importCustomers,
      exportCustomers,
      goDetail,
      kolColumn,
      newMediaType,
      newKolTagList,
      newPlatformList,
      myAreaType,
      salesRange,
      businessTypeOptions,
      citys,
      ...kolLogic,
      ...tableHeightLogic,
      kolVerifyStatusFilter,
      show,
      changeShowMoreParams,
      Folder,
      kolTagList,
      currentTagList,
    };
  },
});
