import { computed, defineComponent, h, inject, Ref, ref, unref, watch } from '@vue/composition-api';
import { useSettlementIncomeList } from '@/modules/settlement/use/incomeList';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
// import { SettlementType } from '@/types/tiange/finance/settlement';
import {
  Settlement,
  SettlementCostBasicInfoSaveParams,
  SettlementKind,
  SettlementListQueryParams,
  SettlementStatus,
  SettlementStatusMap,
  SettlementType,
} from '@/types/tiange/finance/settlement';
import moment from 'moment';
import Decimal from 'decimal.js';
import { Decimal2String } from '@/utils/string';
import { sleep, wait } from '@/utils/func';
import {
  GetSettlementDetail,
  GetSettlementList,
  ReplaceCommonEstimateSettlementCost,
  ReplaceCoopEstimateSettlementCost,
  ReplaceLiveEstimateSettlementCost,
  ReplaceLocalLifeEstimateSettlementCost,
  ReplaceSupplyChainEstimateSettlementCost,
  SaveSettlementCostBasicInfo,
} from '@/services/finance/settlement';
import { SettlementCol } from '../../use/columns';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { LiveProject } from '@/types/tiange/live.project';
import { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { showProDateFormat } from '@/utils/format';
import { BusinessTypeEnum } from '@/types/tiange/common';

const total_settle_amount_render = (row: Settlement) =>
  '' + Decimal2String(new Decimal(row.tax_included_amount ?? 0));

export default defineComponent({
  data() {
    return {
      topText: '请选择对应的收入结算',
      tips: '如果没有可选择的收入结算，请先发起对应的收入结算并填写结算数据保存',
    };
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const newProject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(newProject);
    const isAreaCost =
      jsonProject.value?.cooperation_type === 2 ||
      inject('cooperation_type', {
        value: 1,
      }).value === 2 ||
      false;
    console.log('----', isAreaCost);
    // const { isFromMarketing, isFromCommon, project_id, project_type } = useProjectBaseInfo();
    const { isFromMarketing, project_id, project_type } = useProjectBaseInfo();
    const project =
      inject<Ref<MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined>>(
        'project3in1',
      ) ?? ref(undefined);
    const { loading, data, total, loadDataAll } = useSettlementIncomeList(project_type);
    /** 选中的收入结算ID */
    const checkedRowId = ref<number | undefined>(undefined);
    /** 选中的收入结算 */
    const checkedRow = ref<Settlement | undefined>(undefined);
    /** 编辑时保存的原始数据 */
    const originalCheckedId = ref<number | undefined>(undefined);
    /** 编辑模式 */
    const isEditMode = computed(() => checkedRowId.value !== undefined);
    /** 编辑模式下有数据变化 */
    const isEditModeChanged = computed(
      () => isEditMode.value && checkedRowId.value !== originalCheckedId.value,
    );
    /** 是否暂估 */
    const is_estimate_mode = ref(0);
    const Step1Frm = ref({
      settlement_way: '1',
      business_type: BusinessTypeEnum.marketing,
    });

    /** 暂估结算 替换 */
    const replace_settlement_date_str = ref('');

    const ReplaceSettlementDateList = ref<
      { label: string; value: string; settlement_type: number }[]
    >([]);
    const ReplaceIdsSettlementDateList = ref<
      { label: string; value: string; settlement_type: number }[]
    >([]);
    /** 加载 暂估结算 数据 */
    const GetEstimateSettlementList = async (payload: SettlementListQueryParams) => {
      const [{ data: response }] = await wait(200, GetSettlementList(unref(project_type), payload));
      if (response && response.success) {
        // ReplaceSettlementDateList 日期去重
        const map = new Map();
        ReplaceIdsSettlementDateList.value = [];
        response.data.data.forEach(item => {
          const datestr =
            showProDateFormat(item.start_date * 1000, 'YYYY.MM.DD') +
            ' ~ ' +
            showProDateFormat(item.end_date * 1000, 'YYYY.MM.DD');

          if (!map.has(datestr)) {
            map.set(datestr, true);
            // if (item.settlement_type !== SettlementType.s2b2c_douyin_cps) {
            ReplaceSettlementDateList.value.push({
              label: datestr,
              value: datestr,
              settlement_type: item.settlement_type,
            });
          }
          // }
          // if (item.is_tmp === 0 && item.settlement_type !== SettlementType.s2b2c_douyin_cps) {
          if (item.is_tmp === 0) {
            ReplaceIdsSettlementDateList.value.push({
              label: `${item.settlement_uid} ${item.company_name} ${datestr} ${
                '￥' + (item.tax_included_amount || '0')
              } `,
              value: item.id.toString() + ':' + datestr,
              settlement_type: item.settlement_type,
            });
          }
        });
      } else {
        ctx.root.$message.warning(response.message);
      }
    };

    const getEstimateSettlementQueryPayload = () => {
      const business_type = Step1Frm.value.business_type;
      const payload: SettlementListQueryParams = {
        project_id: project_id.value,
        settlement_kind: SettlementKind.cost,
        no_reverse: 1,
        is_estimate: 1,
        business_type: business_type,
      };
      return payload;
    };

    watch(
      () => Step1Frm.value.settlement_way,
      newVal => {
        if (newVal && Step1Frm.value.settlement_way === '2') {
          ReplaceSettlementDateList.value = [];
          const payload = getEstimateSettlementQueryPayload();
          GetEstimateSettlementList(payload);
        }
      },
    );

    /** 填充表单数据 */
    const fillForm = async (originalSettlement?: Settlement, is_estimate?: number) => {
      if (is_estimate === 1) {
        is_estimate_mode.value = 1;
      }
      await loadDataAll({
        project_id: project_id.value,
        no_reverse: 1,
        is_tmp: 0,
        // is_estimate: 0,
      });

      if (project.value?.project__type === 'live') {
        Step1Frm.value.business_type = project.value.business_type;
      } else if (project.value?.project__type === 'supply_chain') {
        Step1Frm.value.business_type = project.value.business_type;
      } else if (project.value?.project__type === 'local_life') {
        Step1Frm.value.business_type = project.value.business_type;
      } else if (project.value?.project__type === 'marketing') {
        Step1Frm.value.business_type = BusinessTypeEnum.marketing;
      } else if (project.value?.project__type === 'common') {
        Step1Frm.value.business_type = BusinessTypeEnum.mcn;
      }
      if (originalSettlement === undefined) {
        checkedRowId.value = undefined;
        originalCheckedId.value = undefined;
        checkedRow.value = undefined;
        if (is_estimate === 1) {
          is_estimate_mode.value = 1;
        }
      } else {
        is_estimate_mode.value = originalSettlement.is_estimate;

        checkedRowId.value = originalSettlement.related_income_settlement_id;
        originalCheckedId.value = originalSettlement.related_income_settlement_id;
        checkedRow.value = data.value.find(
          el => el.id === originalSettlement.related_income_settlement_id,
        );
      }
    };

    const filtered_data = computed(() => {
      // if (isFromMarketing.value) {
      //   return data.value;
      // } else if (isFromCommon.value) {
      //   return data.value.filter(
      //     row => row.settlement_type !== SettlementType.common_mcn_douyin_cps,
      //   );
      // } else {
      //   return data.value;
      // }
      // return data.value.filter(item => {
      // return item.settlement_type !== SettlementType.s2b2c_douyin_cps;
      // });
      return data.value;
    });

    /** 当前结算单是否拆分后的正式结算单 */
    const is_splited_settlement = computed(
      () => settlement.value !== undefined && settlement.value.super_settlement_id !== null,
    );

    const onRowClick = (row: Settlement) => {
      if (is_splited_settlement.value) {
        return;
      }

      // if (isFromMarketing.value && row.status === SettlementStatus.confirmed) {
      //   return;
      // }

      checkedRowId.value = row.id;
      checkedRow.value = { ...row };
    };
    const isNewCost = ref(isFromMarketing.value || isAreaCost);
    const columns = computed<SettlementCol[]>(() => [
      {
        label: '选择',
        align: 'center',
        width: 60,
        formatter: row => {
          // const marketting_disabled = isNewCost.value && row.status === SettlementStatus.confirmed;

          return h('el-radio', {
            props: {
              value: checkedRowId.value,
              label: row.id,
              size: 'mini',
              disabled: is_splited_settlement.value,
            },
            nativeOn: {
              click: () => {
                if (is_splited_settlement.value) {
                  return;
                }
                onRowClick(row);
              },
            },
          });
        },
      },
      {
        label: '结算编号',
        property: 'settlement_uid',
        align: 'left',
        // width: isNewCost.value ? 180 : 284,
        width: 180,
      },
      {
        label: '结算公司',
        property: 'company_name',
        align: 'left',
        showOverflowTooltip: true,
        width: 160,
      },
      {
        label: '结算周期',
        property: 'start_date',
        align: 'center',
        // width: isNewCost.value ? 230 : 286,
        width: 180,
        formatter: row =>
          [row.start_date, row.end_date]
            .map(el => moment(el * 1000).format('YYYY.MM.DD'))
            .join(' ~ '),
      },
      {
        label: '结算金额 (元)',
        property: 'total_settle_amount',
        align: 'right',
        minWidth: 120,
        formatter: total_settle_amount_render,
      },
      {
        minWidth: 84,
      },
      {
        label: '结算状态',
        property: 'status',
        align: 'center',
        minWidth: 108,
        formatter: row => {
          const { status } = row;
          const className =
            status === SettlementStatus.unsubmit
              ? 'fg-cancel'
              : status === SettlementStatus.wait_confirm
              ? 'fg-waiting'
              : status === SettlementStatus.confirmed
              ? 'fg-success'
              : 'fg-failure';

          return h('span', { class: className }, SettlementStatusMap.get(status) ?? '--');
        },
      },
    ]);

    /** 取消(上一步) */
    const prev = async () => {
      ctx.emit('cancel');
    };

    /** 保存中 */
    const saveLoading = ref(false);

    /** 保存步骤一数据(基本信息) */
    const saveStep1Data = async () => {
      if ('finance' === project_type.value || 'finance_cost' === project_type.value) {
        return;
      }

      if (checkedRowId.value === undefined || checkedRow.value === undefined) {
        ctx.root.$message.warning('请选择收入结算');
        return;
      }

      const payload: SettlementCostBasicInfoSaveParams = {
        id: settlement.value?.id,
        settlement_type: checkedRow.value.settlement_type,
        related_income_settlement_id: checkedRowId.value,
      };

      if (is_estimate_mode.value === 1) {
        payload.is_estimate = 1;
      }
      saveLoading.value = true;
      const [{ data: response }] = await wait(
        400,
        SaveSettlementCostBasicInfo(project_type.value, payload),
      );

      if (response && response.success) {
        const response2 = getSettlementDetailAfterSave(response.data.id);
        return response2;
      } else {
        saveLoading.value = false;
        return response;
      }
    };
    const getSettlementDetailAfterSave = async (id: number) => {
      // if (response.success) {
      const [{ data: response2 }] = await wait(
        400,
        GetSettlementDetail(project_type.value, { id: id }),
      );
      saveLoading.value = false;

      return response2;
      // }
      // else {
      //   saveLoading.value = false;
      //   return response;
      // }
    };

    const handlerResponse = (response: any) => {
      if (response && response.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
        return true;
      } else if (response && response.success === false) {
        ctx.root.$message.error(response.message ?? '保存失败');
        return false;
      } else {
        // do nth
        return false;
      }
    };

    const replaceEstimateStep1Data = async () => {
      if (replace_settlement_date_str.value === '') {
        ctx.root.$message.warning(
          settlement_replace_way.value === 1 ? '请选择暂估结算单' : '请选择暂估结算周期',
        );
        return;
      }

      let payload: any = {};
      if (settlement_replace_way.value === 0) {
        const [start_date, end_date] = replace_settlement_date_str.value.split(' ~ ');
        payload = {
          project_id: project_id.value.toString(),
          start_date: start_date.replace(/\./g, '-'),
          end_date: end_date.replace(/\./g, '-'),
        };
      } else {
        const [settlementIdstr, datestr] = replace_settlement_date_str.value.split(':');
        const [start_date, end_date] = datestr.split(' ~ ');
        payload = {
          project_id: project_id.value.toString(),
          start_date: start_date.replace(/\./g, '-'),
          end_date: end_date.replace(/\./g, '-'),
          settlement_id: Number(settlementIdstr),
        };
      }
      const ReplaceInCostService =
        Step1Frm.value.business_type === BusinessTypeEnum.marketing
          ? ReplaceCoopEstimateSettlementCost
          : [
              BusinessTypeEnum.taobao,
              BusinessTypeEnum.taobaopick,
              BusinessTypeEnum.douyin,
            ].includes(Step1Frm.value.business_type)
          ? ReplaceLiveEstimateSettlementCost
          : [BusinessTypeEnum.supplyChain].includes(Step1Frm.value.business_type)
          ? ReplaceSupplyChainEstimateSettlementCost
          : [BusinessTypeEnum.locallife].includes(Step1Frm.value.business_type)
          ? ReplaceLocalLifeEstimateSettlementCost
          : ReplaceCommonEstimateSettlementCost;

      saveLoading.value = true;
      const [{ data: response }] = await Promise.all([
        await ReplaceInCostService(payload),
        await sleep(500),
      ]);

      if (response.success) {
        const response2 = getSettlementDetailAfterSave(response.data.id);
        return response2;
      } else {
        saveLoading.value = false;
        return response;
      }
    };

    const saveStep1Hanlder = async () => {
      if (Step1Frm.value.settlement_way === '1') {
        // 普通结算
        const response = await saveStep1Data();
        return handlerResponse(response);
      } else {
        // 替换 暂估结算
        const response = await replaceEstimateStep1Data();
        return handlerResponse(response);
      }
    };

    /** 下一步 */
    const next = async () => {
      if (isEditMode.value && !isEditModeChanged.value) {
        ctx.emit('next');
        return;
      }

      await saveStep1Hanlder();
    };

    /** 关闭前保存 */
    const saveBeforeClose = async () => {
      return await saveStep1Hanlder();
    };

    /** 判断关闭前是否需要弹窗确认 */
    const confirmBeforeClose = async () => isEditModeChanged.value;

    const table_width = computed(() => (isNewCost.value ? 894 : 1052));
    const settlement_replace_way = ref(1);
    return {
      settlement_replace_way,
      is_estimate_mode,
      ReplaceIdsSettlementDateList,
      ReplaceSettlementDateList,
      replace_settlement_date_str,
      Step1Frm,
      settlement,
      columns,
      project_id,
      project,
      loading,
      data: filtered_data,
      onRowClick,
      total,
      loadDataAll,
      fillForm,
      saveLoading,
      prev,
      next,
      saveBeforeClose,
      confirmBeforeClose,
      table_width,
      SettlementType,
    };
  },
});
