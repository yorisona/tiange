/**
 * 店铺代播 - 直播场次 - 场次详情
 */
import {
  defineComponent,
  ref,
  SetupContext,
  provide,
  computed,
  reactive,
  onBeforeMount,
  h,
  inject,
} from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';

import liveDisplayAddDialog from '../tabs/live/dialog/live.display.add.vue';
import {
  DisplayDeleteMcn,
  DisplayCloseMcn,
  QueryShopLiveRecordDataList,
  RemoveShopLiveRecordDataService,
  QueryInProjectTeam,
  DisplayDetailMcn,
  SetMCNLiveDisplayNotLived,
} from '@/services/live';
import { AsyncConfirm } from '@/use/asyncConfirm';
import limit from '@/utils/inputLimit';
import {
  KolSchedule,
  LiveDisplay,
  LiveDisplayDetail,
  LiveDisplayStatus,
  OperatorSchedule,
  ShopLiveRecordData,
  ShopLiveRecordDataForm,
  TaobaoLiveInfo,
} from '@/types/tiange/live';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { usePermission } from '@/use/permission';
import { wait } from '@/utils/func';
import { useRouter } from '@/use/vue-router';
import TgLiveDisplayDataInputDialog from '@/modules/live/display/dialog/LiveDisplayDataDialog.vue';
import { getToken } from '@/utils/token';
// import LiveGoods from '../dialog/liveGoods.vue';
import TgLiveScheduleDialog from '@/modules/live/project/dialog/livedisplay/LiveScheduleForm.vue';
import moment from 'moment';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { useSchedules } from '../use/schedule';
import { TableColumn } from '@/types/vendor/column';
import { GetLiveMerchantGoods } from '@/services/commonBusiness/project';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const JWToken = getToken();

export default defineComponent({
  name: 'TgLiveDisplay',
  components: {
    liveDisplayAddDialog,
    TgLiveDisplayDataInputDialog,
    TgLiveScheduleDialog,
    // LiveGoods,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const routes = [
      {
        name: RouterNameProjectManage.commonBusiness.project.list,
        title: '项目管理',
      },
      {
        // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
        name: RouterNameProjectManage.commonBusiness.project.detail,
        params: {
          id: router.currentRoute.params.id,
          tab: router.currentRoute.params.tab || 'live',
          liveType: router.currentRoute.params.liveType || 'calendar',
        },
        title: '项目详情',
      },
      {
        path: '',
        title: '场次详情',
      },
    ];

    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const permission = usePermission();

    const shop_live_id = router.currentRoute.params.liveId;
    const project_id = router.currentRoute.params.id;
    const _displayInfoData = displayInfoData(ctx, project_id, shop_live_id);
    const loading = ref(false);
    const ShopLiveDataList = ref<any[]>([]);
    const QueryForm = ref<{
      page_num: number;
      num: number;
      live_id: number | string;
    }>({
      page_num: 1,
      num: 10,
      live_id: shop_live_id,
    });
    const total = ref(0);

    const merchantGoods = ref<any>({});
    const addGoodsDialogVisible = ref(false);
    const addMerchantGoodsClick = () => {
      addGoodsDialogVisible.value = true;
      merchantGoods.value = {};
    };
    const onMerchantGoodsSave = () => {
      addGoodsDialogVisible.value = false;
      GetProjectShopLive();
    };
    const onMerchantGoodsEdit = () => {
      addGoodsDialogVisible.value = false;
      ctx.root.$message.success('编辑成功');
      GetProjectShopLive(false);
    };
    const onEditBtnClick = (row: any) => {
      addGoodsDialogVisible.value = true;
      merchantGoods.value = row;
    };

    const popoverFun = <T extends boolean>(row: any, text: string, num: number, text_only: T) => {
      const data = row[text] || '--';
      const { is_folded, folded_text } = get_limited_length_string(data, num);
      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [
              h('span', { slot: 'reference' }, [folded_text]),
              h('DefText', { props: { content: row[text] } }),
            ],
          ) as TableColumnRenderReturn<T>);
    };

    /** 商品ID渲染函数 */
    const product_code_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'product_code', 8, text_only);
    };
    /** 商品ID最大宽度 */
    const product_code_max_length = max_length_of_column(
      ShopLiveDataList,
      '商品ID',
      product_code_render,
    );

    /** 商品名称渲染函数 */
    const product_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'product_name', 14, text_only);
    };
    /** 商品名称最大宽度 */
    const product_name_max_length = max_length_of_column(
      ShopLiveDataList,
      '商品名称',
      product_name_render,
    );

    /** 所属公司渲染函数 */
    const company_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'company_name', 14, text_only);
    };
    /** 所属公司最大宽度 */
    const company_name_max_length = max_length_of_column(
      ShopLiveDataList,
      '所属公司',
      company_name_render,
    );

    /** 所属店铺渲染函数 */
    const shop_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'shop_name', 10, text_only);
    };
    /** 所属店铺最大宽度 */
    const shop_name_max_length = max_length_of_column(
      ShopLiveDataList,
      '所属店铺',
      shop_name_render,
    );

    /** 品牌渲染函数 */
    const brand_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'brand_name', 10, text_only);
    };
    /** 品牌最大宽度 */
    const brand_name_max_length = max_length_of_column(ShopLiveDataList, '品牌', brand_name_render);

    const ShopLiveColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '商品ID',
        minWidth: product_code_max_length.value,
        formatter: row => product_code_render(row, false),
      },
      {
        label: '商品名称',
        minWidth: product_name_max_length.value,
        formatter: row => product_name_render(row, false),
      },
      {
        label: '所属公司',
        minWidth: company_name_max_length.value,
        formatter: row => company_name_render(row, false),
      },
      {
        label: '所属店铺',
        minWidth: shop_name_max_length.value,
        formatter: row => shop_name_render(row, false),
      },
      {
        label: '品牌',
        minWidth: brand_name_max_length.value,
        formatter: row => brand_name_render(row, false),
      },
      {
        label: '收入坑位费 (元)',
        minWidth: 130,
        align: 'right',
        formatter: row => {
          return row.has_pit_fee ? numberMoneyFormat(row.income_pit_fee, 2, '.', ',', false) : '--';
        },
      },
      {
        label: '支出坑位费 (元)',
        minWidth: 130,
        align: 'right',
        formatter: row => {
          return row.has_pit_fee ? numberMoneyFormat(row.expend_pit_fee, 2, '.', ',', false) : '--';
        },
      },
      {
        label: '招商人员',
        minWidth: 104,
        align: 'center',
        formatter: row => {
          return row.add_by_name;
        },
      },
    ]);

    const GetProjectShopLive = async (clean?: boolean) => {
      if (clean) {
        QueryForm.value.page_num = 1;
      }
      const res: any = await GetLiveMerchantGoods({
        page_num: QueryForm.value.page_num,
        num: QueryForm.value.num,
        live_id: shop_live_id,
        project_id,
      });
      if (res.data.success) {
        ShopLiveDataList.value = res.data.data.data;
        total.value = res.data.data.total;
      } else {
        ShopLiveDataList.value = [];
        total.value = 0;
        ctx.root.$message.warning(res.message ?? '查询失败，稍后重试');
      }
    };

    GetProjectShopLive();

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      QueryForm.value.page_num = page_num;
      GetProjectShopLive(false);
    };
    const handlePageSizeChange = (num: number) => {
      QueryForm.value.num = num;
      GetProjectShopLive();
    };

    return reactive({
      permission,
      total,
      ShopLiveDataList,
      ShopLiveColumns,
      QueryForm,
      GetProjectShopLive,
      addGoodsDialogVisible,
      addMerchantGoodsClick,
      onMerchantGoodsSave,
      onMerchantGoodsEdit,
      merchantGoods,
      handleCurrentChange,
      handlePageSizeChange,
      loading,
      onEditBtnClick,
      ..._displayInfoData,
    });
  },
});

// 顶部信息LiveDisplay
function displayInfoData(ctx: SetupContext, project_id: string, shop_live_id: string) {
  const displayInfo = ref<LiveDisplay | undefined>(undefined);
  const LiveScheduleType = ref<string>('anchor');
  provide('liveDisplay', displayInfo);

  const isExpand = ref<boolean>(false);
  const closeLoading = ref<boolean>(false);
  const deleteLoading = ref<boolean>(false);
  const shouldEditing = ref<boolean>(false);

  // 编辑按钮事件
  const handleEditDisplayAction = async () => {
    if (Permission.value.canEdit && displayInfo.value?.live_status !== LiveDisplayStatus.lived) {
      shouldEditing.value = true;
    } else if (
      Permission.value.canEditLived &&
      displayInfo.value?.live_status === LiveDisplayStatus.lived
    ) {
      const confirm = await AsyncConfirm(ctx, {
        title: '是否设置成未归档？',
        cancelText: '否',
        confirmText: '是',
      });
      if (confirm) {
        // 设置为未归档
        const res = await SetMCNLiveDisplayNotLived({
          shop_live_id: shop_live_id,
        });
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          reload();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      }
    }
  };
  const router = useRouter();

  // 删除按钮事件
  const handleDeleteDisplayAction = async () => {
    const result = await AsyncConfirm(ctx, '确认删除本场次？');
    if (result) {
      deleteLoading.value = true;
      const res = await DisplayDeleteMcn(shop_live_id);
      deleteLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success('删除成功');
        ctx.root.$router.push({
          name: RouterNameProjectManage.commonBusiness.project.detail,
          params: {
            id: project_id,
            tab: router.currentRoute.params.tab,
            liveType: router.currentRoute.params.liveType,
          },
        });
      } else {
        ctx.root.$message.error(res.data.message ?? '删除失败，稍后重试');
      }
    }
  };
  const dialogResolve = ref();
  const dialogReject = ref();
  const AsyncGMV = async () => {
    return new Promise<string>((resolve, reject) => {
      dialog_form.value.actual_gmv = '';
      dialogVisible.value = true;
      dialogResolve.value = resolve;
      dialogReject.value = reject;
    });
  };
  // 关闭按钮事件
  const handleCloseDisplayAction = async () => {
    let gmv;
    if (displayInfo.value?.live_type === 60) {
      gmv = await AsyncGMV();
    }
    const result = await AsyncConfirm(ctx, '关闭后场次相关信息无法修改，确认是否关闭');
    if (result) {
      closeLoading.value = true;
      const res = await DisplayCloseMcn(shop_live_id, gmv);
      closeLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success('关闭成功');
        sendGetDisplayDetailRequesast();
      } else {
        ctx.root.$message.error(res.data.message ?? '关闭失败，稍后重试');
      }
    }
  };
  // 获取场次详情的请求
  const sendGetDisplayDetailRequesast = async () => {
    const { data: response } = await DisplayDetailMcn(shop_live_id);
    if (response.success) {
      displayInfo.value = response.data;
    } else {
      ctx.root.$message.error(response.message ?? '查询失败，稍后重试');
    }
  };
  const live_type_str = computed(() => {
    let live_type;
    if (displayInfo.value !== undefined && displayInfo.value.live_type !== undefined) {
      live_type = displayInfo.value.live_type;
    }
    switch (live_type) {
      case 60:
        return '直播';
      case 61:
        return '短视频';
      case 62:
        return '图文';
      default:
        return '';
    }
  });

  // ReloadDetailLoading
  const ReloadDetailLoading = ref(false);
  // 弹框关闭事件
  const handleCloseAction = () => {
    shouldEditing.value = false;
  };
  // 直播场次 弹框保存成功回调
  const handleSaveSucceedAction = async () => {
    shouldEditing.value = false;
    await reload();
  };

  // 直播时间生成
  const liveTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return '';
    }
    // const [startTimePrefix, _] = startTime.split(' ');
    // const [endTimePrefix, endTimeSurfix] = endTime.split(' ');

    const newLiveTime = `${startTime} ~ ${endTime}`;
    // if (startTimePrefix !== endTimePrefix) {
    //   newLiveTime = `${startTime} ~ 次日 ${endTimeSurfix}`;
    // } else {
    //   newLiveTime = `${startTime} ~ ${endTimeSurfix}`;
    // }
    return newLiveTime.replace(/-/g, '.');
  };

  // 直播状态字符串
  const liveStatus = (status: LiveDisplayStatus) => {
    if (status === LiveDisplayStatus.lived) {
      return '已归档';
    }
    return '未归档';
    // return LiveDisplayStatusMap.get(status);
  };

  const statusClasses = (status: LiveDisplayStatus) => {
    if (status === LiveDisplayStatus.lived) {
      return 'status-green-color';
    }
    return 'status-light-color';
    // switch (status) {
    //   case LiveDisplayStatus.waitingLive:
    //     return 'status-green-color';
    //   case LiveDisplayStatus.lived:
    //     return 'status-dark-color';
    //   default:
    //     return 'status-light-color';
    // }
  };
  const { isFromLocalLife, business_type, isFromSupplyChain } = useProjectBaseInfo();
  /** 权限检查 */
  const Permission = computed(() => {
    const canEdit = HasPermission(RIGHT_CODE.mcn_save_shop_live);
    const canEditLived = HasPermission(RIGHT_CODE.mcn_lived_edit_shop_live);
    const canEditKOLSchedule = isFromSupplyChain.value
      ? HasPermission(RIGHT_CODE.supply_edit_kol_schedule)
      : isFromLocalLife.value
      ? HasPermission(RIGHT_CODE.local_life_streamer_schedule)
      : HasPermission(RIGHT_CODE.live_streamer_schedule);
    const canEditOperatorSchedule = isFromSupplyChain.value
      ? HasPermission(RIGHT_CODE.supply_edit_assistant_schedule)
      : isFromLocalLife.value
      ? HasPermission(RIGHT_CODE.local_life_operation_schedule)
      : HasPermission(RIGHT_CODE.live_operation_schedule);
    const canEditArchive = isFromSupplyChain.value
      ? HasPermission(RIGHT_CODE.supply_view_shop_live_archive)
      : isFromLocalLife.value
      ? HasPermission(RIGHT_CODE.local_life_view_shop_live_archive)
      : HasPermission(RIGHT_CODE.view_shop_live_archive);
    return { canEdit, canEditLived, canEditArchive, canEditKOLSchedule, canEditOperatorSchedule };
  });

  const business_icon = (new_business_type: number | undefined) => {
    if (business_type.value === E.project.BusinessType.locallife) {
      new_business_type = business_type.value;
    }
    if (!new_business_type) return undefined;
    switch (new_business_type) {
      case 2:
        //  淘宝
        return 'ico-taobao';
      case 1:
        //  抖音
        return 'ico-douyin';
      case 7:
        //  本地
        return 'ico-douyin';
      case 9:
        //  本地
        return 'ico-douyin';
      default:
        return '';
    }
  };

  // 发送获取场次详情接口
  const { loadScheduleData, ScheduleData, ...rest } = useSchedules();

  const reload = async () => {
    ReloadDetailLoading.value = true;
    await sendGetDisplayDetailRequesast();
    ReloadDetailLoading.value = false;
  };
  provide('reload', reload);

  const ShopLiveRecordDataList = ref<ShopLiveRecordData[]>([]);

  // 直播留档列表
  const LoadShopLiveRecordDataList = async () => {
    const { data: res } = await QueryShopLiveRecordDataList(shop_live_id);
    if (res.success) {
      ShopLiveRecordDataList.value = res.data;
    } else {
      ctx.root.$message.warning('直播留档数据获取失败');
    }
  };

  // 直播数据
  const LiveStatData = ref({
    contrast_live_id: '',
    promote_order_amount: '',
    promote_order_num: '',
    promote_order_person: '',
    promote_order_conversion_rate: '',
    view_link: '',
    fans_order_amount_percent: '',
  });

  /** 淘宝插件 场记 直播数据 */
  const TaobaoLiveLogs = ref<TaobaoLiveInfo[]>([]);

  /** 场次ID */
  const AddLiveDataInputVisible = ref(false);

  const AddLiveRecordHandler = () => {
    LiveDisplayInfoData.value = {
      id: -1,
      live_url: '',
      /* 开始时间 */
      real_start_time: '',
      /* 结束时间 */
      real_end_time: '',
      /** 直播时长截图 */
      duration_screenshot: '',
      /** 直播数据截图 */
      data_screenshot: '',
      /** 实际直播时长 */
      real_duration: '',
    };

    AddLiveDataInputVisible.value = true;
  };

  /** 关闭弹窗 */
  const onAddDataInputModalClose = async (data: LiveDisplayDetail | undefined) => {
    AddLiveDataInputVisible.value = false;
    if (data) {
      await LoadShopLiveRecordDataList();
    }
  };

  const LiveDisplayInfoData = ref<ShopLiveRecordDataForm>({
    id: -1,
    live_url: '',
    /* 开始时间 */
    real_start_time: '',
    /* 结束时间 */
    real_end_time: '',
    /** 直播时长截图 */
    duration_screenshot: '',
    /** 直播数据截图 */
    data_screenshot: '',
    /** 实际直播时长 */
    real_duration: '',
  });

  const LiveScheduleDialogVisible = ref(false);

  const LiveSchedules = ref<{ kol: KolSchedule[]; operator: OperatorSchedule[] }>({
    kol: [],
    operator: [],
  });

  // 主播排班 运营排班
  const handleEditDisplayScheduleAction = (schedule_type: string) => {
    LiveScheduleDialogVisible.value = true;
    LiveScheduleType.value = schedule_type;
    if (schedule_type === 'anchor') {
      LiveSchedules.value.kol = ScheduleData.value.kolSchedules.map(el => {
        el.id = el.kol_id;
        return el;
      });
    } else {
      LiveSchedules.value.operator = ScheduleData.value.operatorSchedules.map(el => {
        el.id = el.user_id;
        return el;
      });
    }
  };

  const formDateRangeStr = (live_start_time: string, live_end_time: string) => {
    const startDate = moment(live_start_time);
    const endDate = moment(live_end_time);
    const isSameDay = startDate.isSame(endDate, 'd');
    let live_time = `${startDate.format('HH:mm')} ~ ${endDate.format('HH:mm')}`;
    if (!isSameDay) {
      live_time = `${live_time}(次日)`;
    }
    return live_time;
  };

  const GetDateRangeStr = (live_start_time: number, live_end_time: number) => {
    if (live_start_time && live_end_time) {
      live_start_time = live_start_time * 1000;
      live_end_time = live_end_time * 1000;
      const startDate = moment(live_start_time);
      const endDate = moment(live_end_time);
      const isSameDay = startDate.isSame(endDate, 'd');
      let live_time = `${startDate.format('YYYY.MM.DD HH:mm')} ~ ${endDate.format('HH:mm')}`;
      if (!isSameDay) {
        live_time = `${live_time}(次日)`;
      }
      return live_time;
    }
  };

  // 直播留档 删除
  const handleDeleteDisplayInfoDataAction = async (id: number) => {
    const confirm = await AsyncConfirm(ctx, '确认删除留档数据吗？');
    if (!confirm) {
      return;
    }

    const [{ data: res }] = await wait(
      200,
      RemoveShopLiveRecordDataService(id, business_type.value),
    );
    if (res.success) {
      ctx.root.$message.success(res.message ?? '删除成功');
      await LoadShopLiveRecordDataList();
    } else {
      ctx.root.$message.error(res.message ?? '删除失败');
    }
  };
  // 直播时间
  const display_live_date_range_str = computed(() => {
    if (displayInfo.value?.live_start_time && displayInfo.value?.live_end_time) {
      const startDate = moment(displayInfo.value?.live_start_time);
      const endDate = moment(displayInfo.value?.live_end_time);

      const isSameDay = startDate.isSame(endDate, 'd');
      let live_time = `${startDate.format('YYYY.MM.DD HH:mm')} ~ ${endDate.format('HH:mm')}`;
      if (!isSameDay) {
        live_time = `${live_time}(次日)`;
      }
      return live_time;
    } else {
      return '';
    }
  });

  // 直播留档编辑
  const handleUpdateDisplayInfoDataAction = async (livedata: ShopLiveRecordData) => {
    AddLiveDataInputVisible.value = true;
    LiveDisplayInfoData.value.duration_screenshot = livedata.duration_screenshot;
    LiveDisplayInfoData.value.data_screenshot = livedata.data_screenshot;
    LiveDisplayInfoData.value.live_url = livedata.live_url;
    LiveDisplayInfoData.value.id = livedata.id;
    LiveDisplayInfoData.value.real_start_time = livedata.real_start_time;
    LiveDisplayInfoData.value.real_end_time = livedata.real_end_time;
    LiveDisplayInfoData.value.real_duration = livedata.real_duration;
  };
  // 排班更新
  const handleUpdateScheduleAction = async () => {
    await loadScheduleData(shop_live_id, business_type.value || E.project.BusinessType.douyin);
  };

  // 可以编辑的状态 （已直播）状态所有按钮都不可编辑
  const CanEditStatus = computed(() => displayInfo.value?.live_status !== LiveDisplayStatus.lived);

  // 排班数据列表
  const kolScheduleList = computed(() => {
    const DataMap = new Map();
    const datalist: { date_range_str: string; users_str: string }[] = [];

    ScheduleData.value.kolSchedules.forEach(item => {
      const timestr = formDateRangeStr(item.start_time, item.end_time);
      const real_name = '(' + (item.real_name ?? '--') + ')';
      const combine_name = item.kol_name ? item.kol_name + real_name : '';

      if (DataMap.get(timestr)) {
        const users = DataMap.get(timestr);
        users.push(combine_name);

        DataMap.set(timestr, users);
      } else {
        DataMap.set(timestr, [combine_name]);
      }
    });
    DataMap.forEach(function (value, key) {
      datalist.push({ date_range_str: key, users_str: value.join('、') });
    });

    return datalist;
  });
  const OperatorScheduleList = computed(() => {
    const DataMap = new Map();
    const datalist: { date_range_str: string; users_str: string }[] = [];

    ScheduleData.value.operatorSchedules.forEach(item => {
      const timestr = formDateRangeStr(item.start_time, item.end_time);
      if (DataMap.get(timestr)) {
        const users = DataMap.get(timestr);
        users.push(item.operator_name);
        DataMap.set(timestr, users);
      } else {
        DataMap.set(timestr, [item.operator_name]);
      }
    });

    DataMap.forEach(function (value, key) {
      datalist.push({ date_range_str: key, users_str: ' ' + value.join('、') });
    });

    return datalist;
  });

  const isTaobaoDisplay = computed(
    () => displayInfo.value?.business_type === BusinessTypeEnum.taobao,
  );
  const inProjectTeam = ref<boolean | undefined>(undefined);
  const PermissionCheckLoading = ref(false);

  const methods = {
    queryInProjectTeam: async () => {
      PermissionCheckLoading.value = true;
      const res = await QueryInProjectTeam(project_id.toString(), displayInfo.value?.business_type);
      PermissionCheckLoading.value = false;
      if (res.data.success) {
        inProjectTeam.value = true;
        // inProjectTeam.value = res.data.data.in_project ? true : false;
        if (inProjectTeam.value) {
          reload();
        }
      }
    },
  };

  onBeforeMount(() => {
    methods.queryInProjectTeam();
  });

  const dialogVisible = ref(false);
  const dialogActualRef = ref();

  const dialog_form = ref({
    actual_gmv: '',
  });
  const dialog_rules = {
    actual_gmv: [{ required: true, message: '请填写实际GMV', trigger: 'blur' }],
  };

  const onSaveBtnClick = () => {
    dialogActualRef.value?.validate((pass: any) => {
      if (pass) {
        dialogVisible.value = false;
        dialogResolve.value((dialog_form.value.actual_gmv as any) * 100);
      }
    });
  };
  const onCancelBtnClick = () => {
    dialogVisible.value = false;
  };

  const limitGMV = (value: string) => {
    const newValue = limit.IntergerAndDecimals(value);
    dialog_form.value.actual_gmv = newValue;
    return newValue;
  };

  return {
    limitGMV,
    onCancelBtnClick,
    onSaveBtnClick,
    dialogActualRef,
    dialog_rules,
    dialog_form,
    dialogVisible,
    live_type_str,
    ReloadDetailLoading,
    PermissionCheckLoading,
    inProjectTeam,
    isTaobaoDisplay,
    TaobaoLiveLogs,
    OperatorScheduleList,
    kolScheduleList,
    CanEditStatus,
    formDateRangeStr,
    LiveStatData,
    handleUpdateScheduleAction,
    LiveSchedules,
    handleUpdateDisplayInfoDataAction,
    display_live_date_range_str,
    handleDeleteDisplayInfoDataAction,
    GetDateRangeStr,
    Permission,
    reload,
    isExpand,
    displayInfo,
    closeLoading,
    deleteLoading,
    shouldEditing,
    handleEditDisplayAction,
    handleCloseDisplayAction,
    handleDeleteDisplayAction,
    handleCloseAction,
    handleSaveSucceedAction,
    liveTime,
    liveStatus,
    LiveDisplayStatus,
    statusClasses,
    business_icon,
    ScheduleData,
    ShopLiveRecordDataList,
    LiveDisplayInfoData,
    AddLiveDataInputVisible,
    onAddDataInputModalClose,
    AddLiveRecordHandler,
    handleEditDisplayScheduleAction,
    LiveScheduleDialogVisible,
    JWToken,
    LiveScheduleType,
    shop_live_id,
  };
}
