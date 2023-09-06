import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  Ref,
  ref,
  watch,
} from '@vue/composition-api';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { BusinessTypeEnum } from '@/types/tiange/common';
import type { FormRule } from '@/types/vendor/form';
import { sleep, wait } from '@/utils/func';
import {
  // GetSettledDates,
  GetSettlementList,
  ReplaceCommonEstimateSettlementIncome,
  ReplaceCoopEstimateSettlementIncome,
  ReplaceLiveEstimateSettlementIncome,
  ReplaceLocalLifeEstimateSettlementIncome,
  ReplaceSupplyChainEstimateSettlementIncome,
  SaveSettlementStep1,
} from '@/services/finance/settlement';
import { ElFormRef, validate } from '@/utils/form';
import {
  // SettledDatesQueryParams,
  Settlement,
  SettlementKind,
  SettlementListQueryParams,
  SettlementStep,
  SettlementStep1Frm,
  SettlementStep1SaveParams,
  SettlementType,
} from '@/types/tiange/finance/settlement';
import moment from 'moment';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import type { LiveProject } from '@/types/tiange/live.project';
import type { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { showProDateFormat } from '@/utils/format';
import { formatTime } from '@/utils/tools';

type DateType = Date | string | number;

/** 判断日期是否相同 */
const date_equal = (date1: DateType, date2: DateType) =>
  moment(date1).format('YYYY-MM-DD') === moment(date2).format('YYYY-MM-DD');

export default defineComponent({
  setup(props, ctx) {
    const {
      project_id,
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromLiveDouyin,
      isFromCommon,
      isFromSupplyChain,
    } = useProjectBaseInfo();
    const project_type =
      inject<ComputedRef<'marketing' | 'live' | 'common' | 'local_life' | 'supply_chain'>>(
        'project_type',
      ) ?? ref('live');
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const project =
      inject<Ref<MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined>>(
        'project3in1',
      ) ?? ref(undefined);
    const newProject = JSON.stringify(project || { cooperation_type: 0 });
    const jsonProject = JSON.parse(newProject);

    const isAreaCost =
      jsonProject.value?.cooperation_type === 2 ||
      inject('cooperation_type', {
        value: 1,
      }).value === 2 ||
      false;
    const mcn_platform_type = computed(() => {
      if (project.value?.project__type === 'common') {
        return project.value?.platform_type;
      }
      return undefined;
    });
    const step1FrmRef = ref<ElFormRef>(null);
    const step1Frm = ref<SettlementStep1Frm>({
      id: undefined,
      settlement_type: '',
      business_type: BusinessTypeEnum.marketing,
      date: [],
      dateMonth: '',
      is_estimate: 0,
      /** 结算方式 1 普通结算 2 替换暂估结算 */
      settlement_way: '1',
    });

    const fillFormReady = ref(false);
    /** 当前项目已结算的日期，需要禁用 */
    const settledDates = ref<string[]>([]);

    const step1FrmRules = ref<{
      [prop in keyof SettlementStep1Frm]?: FormRule<SettlementStep1Frm[prop]>[];
    }>({
      settlement_type: [
        {
          required: true,
          message: '请选择业务类型',
          trigger: 'change',
        },
      ],
      settlement_way: [
        {
          required: true,
          message: '请选择结算方式',
          trigger: 'change',
        },
      ],
      settlement_replace_id: [
        {
          required: true,
          message: '请选择结算周期',
          trigger: 'blur',
        },
      ],
      settlement_replace_way: [
        {
          required: true,
          message: '请选择替换方式',
          trigger: 'change',
        },
      ],
      dateMonth: [
        {
          required: true,
          message: '请选择结算周期',
          trigger: 'change',
        },
        {
          validator: (rule, value, callback) => {
            if (step1Frm.value.dateMonth) {
              /*  const dateFormat = 'yyyy-MM-DD';
              const currentDate = moment(step1Frm.value.dateMonth);
              const start_date: string = currentDate.clone().startOf('M').format(dateFormat);
              const end_date: string = currentDate.clone().endOf('M').format(dateFormat);
              const start_time = new Date(start_date).getTime();
              const end_time = new Date(end_date).getTime();*/
              callback();
            } else {
              callback(new Error('请选择结算周期'));
            }
          },
        },
      ],
      date: [
        {
          required: true,
          message: '请选择结算周期',
          trigger: 'blur',
        },
        {
          validator: (rule, value, callback) => {
            const dates = value.map(el => new Date(el).getTime());

            const settle_dates: string[] = [];
            settledDates.value.forEach(el => {
              const timestamp = new Date(el).getTime();
              if (dates[0] <= timestamp && timestamp <= dates[1]) {
                settle_dates.push(el);
              }
            });

            if (settle_dates.length > 0) {
              callback(
                new Error(
                  settle_dates.map(el => moment(el).format('YYYY.MM.DD ')).join('、') + '已被结算',
                ),
              );
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
    });

    /**
     * 项目创建时间/周期开始日期
     * ```
     * 早于项目创建时间的时间段肯定不在结算周期内
     * ```
     */
    // const gmt_create = computed(() => {
    //   if (project.value === undefined) {
    //     return Date.now();
    //   } else if (project.value.project__type === 'marketing') {
    //     return (project.value.gmt_create ?? 0) * 1000;
    //   } else if (project.value.project__type === 'live') {
    //     return new Date(project.value.start_date ?? 0).getTime();
    //   } else if (project.value.project__type === 'common') {
    //     return new Date(project.value.gmt_create ?? 0).getTime();
    //   } else {
    //     return Date.now();
    //   }
    // });

    /** 结算周期日期范围选择选项 */
    const pickerOptions = {
      disabledDate(date: Date) {
        if (isFromCommon.value) {
          return false;
        }
        const now_timestamp = Date.now();
        const date_timestamp = date.getTime();
        // 早于项目创建时间 或 晚于结算当天的 禁止选择
        if (date_timestamp > now_timestamp && !date_equal(date, now_timestamp)) {
          return true;
        } else {
          return settledDates.value.some(el => date_equal(el, date));
        }
      },
    };

    /** 编辑模式原始数据 */
    const originalFrmData = ref<SettlementStep1Frm>({
      id: undefined,
      settlement_type: '',
      business_type: BusinessTypeEnum.marketing,
      date: [],
      dateMonth: '',
      is_estimate: 0,
      /** 结算方式 1 普通结算 2 替换暂估结算 */
      settlement_way: '1',
    });

    /** 重置表单数据 */
    const resetFrm = () => {
      step1Frm.value.id = undefined;
      step1Frm.value.settlement_type = '';
      step1Frm.value.business_type = BusinessTypeEnum.marketing;
      step1Frm.value.date = [];
      step1Frm.value.dateMonth = '';
    };

    /** 重置表单原始数据 */
    const resetOriginalFrmData = (settlement_type: SettlementType | '' = '') => {
      originalFrmData.value.id = undefined;
      originalFrmData.value.settlement_type = settlement_type;
      originalFrmData.value.business_type = BusinessTypeEnum.marketing;
      originalFrmData.value.date = [];
    };

    /** 编辑模式 */
    const isEditMode = computed(() => originalFrmData.value.id !== undefined);

    /** 编辑模式下有数据变化 */
    const isEditModeChanged = computed(
      () =>
        isEditMode.value &&
        JSON.stringify(originalFrmData.value) !== JSON.stringify(step1Frm.value),
    );

    // const initSettledDates = async () => {
    //   if (project.value === undefined || mcn_platform_type.value === 1) {
    //     return;
    //   }

    //   const payload: SettledDatesQueryParams = {
    //     project_id: project_id.value,
    //     business_type: step1Frm.value.business_type,
    //     settlement_id: settlement.value?.id,
    //   };
    //   const { data: response } = await GetSettledDates(payload);

    //   if (response.success) {
    //     settledDates.value = response.data;
    //   } else {
    //     settledDates.value = [];
    //   }
    // };

    // watch(
    //   () => fillFormReady.value && project.value !== undefined,
    //   () => {
    //     initSettledDates();
    //   },
    // );

    /** 填充表单数据 */
    const fillForm = (data?: Settlement, is_estimate?: number) => {
      if (is_estimate === 1) {
        step1Frm.value.is_estimate = 1;
      }
      resetFrm();
      resetOriginalFrmData();
      if (data === undefined) {
        console.log(project.value?.project__type, '66');

        if (project.value?.project__type === 'live') {
          // 仅店播的结算类型可选只有一项直接定死
          if (project.value.business_type === BusinessTypeEnum.douyin) {
            step1Frm.value.settlement_type = SettlementType.live_douyin;
            step1Frm.value.business_type = BusinessTypeEnum.douyin;
          } else if (project.value.business_type === BusinessTypeEnum.taobao) {
            step1Frm.value.settlement_type = SettlementType.live_taobao;
            step1Frm.value.business_type = BusinessTypeEnum.taobao;
          } else if (project.value.business_type === BusinessTypeEnum.taobaopick) {
            step1Frm.value.settlement_type = SettlementType.live_taobao_pick;
            step1Frm.value.business_type = BusinessTypeEnum.taobaopick;
          }
        } else if (project.value?.project__type === 'supply_chain') {
          step1Frm.value.settlement_type = SettlementType.supply_chain;
          step1Frm.value.business_type = BusinessTypeEnum.supplyChain;
        } else if (project.value?.project__type === 'local_life') {
          step1Frm.value.settlement_type = SettlementType.local_life;
          step1Frm.value.business_type = BusinessTypeEnum.locallife;
        } else if (project.value?.project__type === 'marketing') {
          step1Frm.value.business_type = BusinessTypeEnum.marketing;
        } else if (project.value?.project__type === 'common') {
          step1Frm.value.business_type = BusinessTypeEnum.mcn;
          if (project.value.platform_type === 1) {
            step1Frm.value.settlement_type = SettlementType.common_mcn_douyin_cps;
          }
        }
        if (is_estimate === 1) {
          step1Frm.value.is_estimate = 1;
        }
        resetOriginalFrmData(step1Frm.value.settlement_type);
      } else {
        const { id, settlement_type, start_date, end_date, business_type } = data;
        step1Frm.value.id = id;
        step1Frm.value.settlement_type = settlement_type;
        step1Frm.value.date = [start_date, end_date].map(el =>
          moment(el * 1000).format('YYYY-MM-DD'),
        );
        step1Frm.value.business_type = business_type;
        step1Frm.value.is_estimate = data.is_estimate;

        originalFrmData.value.is_estimate = data.is_estimate;
        originalFrmData.value.id = id;
        originalFrmData.value.settlement_type = settlement_type;
        originalFrmData.value.date = [start_date, end_date].map(el =>
          moment(el * 1000).format('YYYY-MM-DD'),
        );
        originalFrmData.value.business_type = business_type;
        if (
          (isFromLive.value ||
            isFromLiveDouyin.value ||
            isFromLocalLife.value ||
            isFromSupplyChain.value) &&
          (step1Frm.value.settlement_type === SettlementType.live_douyin ||
            step1Frm.value.settlement_type === SettlementType.local_life ||
            step1Frm.value.settlement_type === SettlementType.supply_chain) &&
          !isAreaCost
        ) {
          const currentDate = moment(step1Frm.value.date[0]);
          const dateFormat = 'yyyy-MM';
          step1Frm.value.dateMonth = currentDate.clone().startOf('month').format(dateFormat);
          console.log(step1Frm);
        }
      }

      // 拉取并初始化结算周日的禁用日
      fillFormReady.value = true;
      nextTick(() => {
        step1FrmRef.value?.clearValidate();
      });
    };

    onBeforeUnmount(() => {
      fillFormReady.value = false;
      settledDates.value = [];
    });

    /**
     * 项目名称
     */
    const project_name = computed(() => {
      switch (project.value?.project__type) {
        case 'marketing':
          return project.value.cooperation_name || '--';
        case 'live':
        case 'local_life':
        case 'common':
        case 'supply_chain':
          return project.value.project_name || '--';
        default:
          return '--';
      }
    });

    const typeOptions = computed(() => {
      switch (project.value?.project__type) {
        case 'live': {
          if (project.value.business_type === BusinessTypeEnum.douyin) {
            return [{ label: '抖音店播', value: SettlementType.live_douyin }];
          } else if (project.value.business_type === BusinessTypeEnum.taobao) {
            return [{ label: '淘宝店播', value: SettlementType.live_taobao }];
          } else if (project.value.business_type === BusinessTypeEnum.taobaopick) {
            return [{ label: '淘宝甄选', value: SettlementType.live_taobao_pick }];
          } else {
            return [];
          }
        }
        case 'supply_chain': {
          if (project.value.business_type === BusinessTypeEnum.supplyChain) {
            return [{ label: '供应链', value: SettlementType.supply_chain }];
          } else {
            return [];
          }
        }
        case 'local_life': {
          if (project.value.business_type === BusinessTypeEnum.locallife) {
            return [{ label: '本地生活', value: SettlementType.local_life }];
          } else {
            return [];
          }
        }

        case 'common':
          if (project.value?.platform_type === 1) {
            return [{ label: '创新项目-抖音', value: SettlementType.common_mcn_douyin_cps }];
          }
          return [
            { label: '创新项目-淘宝CPS', value: SettlementType.common_mcn_taobao_cps },
            { label: '创新项目-V任务', value: SettlementType.common_mcn_vtask },
            { label: '创新项目-其他', value: SettlementType.s2b2c_taobao_other },
          ];
        case 'marketing':
          return [
            { label: '营销', value: SettlementType.marketing_marketing },
            { label: 'V任务', value: SettlementType.marketing_vtask },
          ];
        default:
          return [];
      }
    });

    const prev = () => {
      ctx.emit('cancel');
    };

    /** 保存加载中 */
    const saveLoading = ref(false);

    /** 保存步骤一数据(基础信息) */
    const saveStep1Data = async () => {
      const result = await validate(step1FrmRef as Ref<ElFormRef>);
      if (!result) {
        return;
      }

      const { id, settlement_type, business_type, is_estimate } = step1Frm.value;
      let start_date = '',
        end_date = '';
      if (
        (isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value) &&
        (step1Frm.value.settlement_type === SettlementType.live_douyin ||
          step1Frm.value.settlement_type === SettlementType.local_life ||
          step1Frm.value.settlement_type === SettlementType.supply_chain) &&
        !isAreaCost
      ) {
        const dateFormat = 'yyyy-MM-DD';
        const currentDate = moment(step1Frm.value.dateMonth);
        start_date = currentDate.clone().startOf('M').format(dateFormat);
        end_date = currentDate.clone().endOf('M').format(dateFormat);
        // 早于项目创建时间 或 晚于结算当天的 禁止选择
        const timestamp = new Date(end_date).getTime();
        const now_timestamp = Date.now();
        if (timestamp > now_timestamp) {
          end_date = formatTime(now_timestamp);
        }
      } else {
        start_date = step1Frm.value.date[0];
        end_date = step1Frm.value.date[1];
      }
      if (settlement_type === '') {
        return;
      }

      const payload: SettlementStep1SaveParams = {
        id,
        project_id: project_id.value,
        business_type: business_type,
        settlement_type,
        start_date,
        end_date,
        step: SettlementStep.step_two,
      };

      if (is_estimate === 1) {
        payload.is_estimate = is_estimate;
      }

      saveLoading.value = true;
      const [{ data: response }] = await Promise.all([
        await SaveSettlementStep1(project_type.value, payload),
        await sleep(500),
      ]);
      saveLoading.value = false;

      return response;
    };

    const handlerResponse = (response: any) => {
      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
        return true;
      } else if (response?.success === false) {
        ctx.root.$message.error(response.message ?? '保存失败');
        return false;
      } else {
        // do nth
        return false;
      }
    };

    const replaceEstimateStep1Data = async () => {
      if (settlement_replace_id.value === '') {
        ctx.root.$message.warning(
          settlement_replace_way.value === 1 ? '请选择暂估结算单' : '请选择暂估结算周期',
        );
        return;
      }
      const payload = {
        settlement_id: settlement_replace_id.value,
        is_single: settlement_replace_way.value,
      };

      const ReplaceInComeService =
        step1Frm.value.business_type === BusinessTypeEnum.marketing
          ? ReplaceCoopEstimateSettlementIncome
          : [
              BusinessTypeEnum.taobao,
              BusinessTypeEnum.taobaopick,
              BusinessTypeEnum.douyin,
            ].includes(step1Frm.value.business_type)
          ? ReplaceLiveEstimateSettlementIncome
          : [BusinessTypeEnum.supplyChain].includes(step1Frm.value.business_type)
          ? ReplaceSupplyChainEstimateSettlementIncome
          : [BusinessTypeEnum.locallife].includes(step1Frm.value.business_type)
          ? ReplaceLocalLifeEstimateSettlementIncome
          : ReplaceCommonEstimateSettlementIncome;

      saveLoading.value = true;
      const [{ data: response }] = await Promise.all([
        await ReplaceInComeService(payload),
        await sleep(500),
      ]);
      saveLoading.value = false;

      return response;
    };

    const saveStep1Handler = async () => {
      if (step1Frm.value.settlement_way === '1') {
        /** 普通结算 */
        const response = await saveStep1Data();
        return handlerResponse(response);
      } else {
        /** 替换 暂估结算 */
        const response = await replaceEstimateStep1Data();
        return handlerResponse(response);
      }
    };

    const next = async () => {
      // 编辑模式但无数据变更 则直接下一步
      if (isEditMode.value && !isEditModeChanged.value) {
        ctx.emit('next');
        return;
      }
      await saveStep1Handler();
    };

    /** 关闭前保存 */
    const saveBeforeClose = async () => {
      return await saveStep1Handler();
    };

    /** 判断关闭前是否需要弹窗确认 */
    const confirmBeforeClose = async () => isEditModeChanged.value;

    /** 暂估替换 结算周期 */
    const settlement_replace_id = ref('');
    const settlement_replace_way = ref(1);
    const SettlementReplaceDateOptions = ref<
      { label: string; value: string; settlement_type: number }[]
    >([]);
    const SettlementIdsReplaceDateOptions = ref<
      { label: string; value: string; settlement_type: number }[]
    >([]);
    const getEstimateSettlementQueryPayload = (): SettlementListQueryParams => {
      const payload: SettlementListQueryParams = {
        project_id: project_id.value,
        settlement_kind: SettlementKind.income,
        no_reverse: 1,
        is_estimate: 1,
        is_tmp: 0,
        business_type: step1Frm.value.business_type,
      };
      return payload;
    };

    /** 加载 暂估结算 数据 */
    const GetEstimateSettlementList = async (payload: SettlementListQueryParams) => {
      const [{ data: response }] = await wait(200, GetSettlementList(project_type.value, payload));
      if (response.success) {
        SettlementReplaceDateOptions.value = [];
        SettlementIdsReplaceDateOptions.value = [];
        response.data.data.forEach(item => {
          const date_str =
            showProDateFormat(item.start_date * 1000, 'YYYY.MM.DD') +
            ' ~' +
            showProDateFormat(item.end_date * 1000, 'YYYY.MM.DD');
          SettlementReplaceDateOptions.value.push({
            label: `${date_str} ${item.company_name}`,
            value: item.id.toString(),
            settlement_type: item.settlement_type,
          });
          SettlementIdsReplaceDateOptions.value.push({
            label: `${item.settlement_uid} ${item.company_name} ${date_str} ${
              '￥' + (item.tax_included_amount || '0')
            } `,
            value: item.id.toString(),
            settlement_type: item.settlement_type,
          });
        });
      } else {
        ctx.root.$message.warning(response.message);
      }
    };

    watch(
      () => step1Frm.value.settlement_way,
      newVal => {
        if (newVal && step1Frm.value.settlement_way === '2') {
          GetEstimateSettlementList(getEstimateSettlementQueryPayload());
        }
      },
    );
    watch(
      () => settlement_replace_way.value,
      () => {
        settlement_replace_id.value = '';
      },
    );
    // watch(
    //   () => step1Frm.value.settlement_type,
    //   newVal => {
    //     if (settlement.value) {
    //       if (newVal === SettlementType.s2b2c_taobao_other) {
    //         settlement.value.is_tmp = 1;
    //       } else if (
    //         SettlementType.common_mcn_taobao_cps === newVal ||
    //         SettlementType.common_mcn_vtask === newVal
    //       ) {
    //         settlement.value.is_tmp = 0;
    //       }
    //     }
    //   },
    // );

    const onSettlementTypeChange = (newVal: SettlementType) => {
      if (settlement.value) {
        if (newVal === SettlementType.s2b2c_taobao_other) {
          settlement.value.is_tmp = 1;
        } else if (
          SettlementType.common_mcn_taobao_cps === newVal ||
          SettlementType.common_mcn_vtask === newVal
        ) {
          settlement.value.is_tmp = 0;
        }
      }
    };
    return {
      isAreaCost,
      settlement_replace_id,
      settlement_replace_way,
      SettlementReplaceDateOptions,
      SettlementIdsReplaceDateOptions,
      settlement,
      step1FrmRef,
      originalFrmData,
      step1Frm,
      step1FrmRules,
      typeOptions,
      settledDates,
      pickerOptions,
      project_id,
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromLiveDouyin,
      isFromSupplyChain,
      isFromCommon,
      project,
      project_name,
      prev,
      next,
      saveBeforeClose,
      confirmBeforeClose,
      saveLoading,
      fillForm,
      mcn_platform_type,
      SettlementType,
      onSettlementTypeChange,
    };
  },
});
