/*
 * @Author: 肖槿
 * @Date: 2021-06-04 17:06:14
 * @Description: 核销第一步
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-22 18:04:46
 * @FilePath: \goumee-star-frontend\src\modules\live\project\tabs\writeDialog\firstStep.ts
 */
import { defineComponent, ref, h, computed } from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import * as useConst from './const';
import { achievementType, yxywIsActualIncomeType } from '@/types/tiange/live.project';
import { sleep } from '@/utils/func';
import { Decimal2String, getPositiveNumber, get_length_of_string } from '@/utils/string';
import { AsyncConfirm } from '@/use/asyncConfirm';
import type { submitWrteOff, writeOffParams } from '@/types/tiange/marketing/achievement';
import { TableColumn } from '@/types/vendor/column';
import Decimal from 'decimal.js';
import { max_length_of_column } from '@/utils/table';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const formatAmount = (num: string | number) => Decimal2String(new Decimal(num));

interface receivableIns {
  receivable_id: number;
}
interface achievementIns {
  achievement_id: number;
}
interface achievementSearchIns {
  achievement_uid?: string;
  receivable_uid?: string;
  receivable_type: number;
}
interface payableSearchIns {
  const_id: number;
  project_type: string;
  cost_split_id?: number;
}
const useList = (ctx: SetupContext) => {
  const data = ref<yxywIsActualIncomeType[]>([]);
  const queryData = ref<yxywIsActualIncomeType[]>([]);
  const loading = ref<boolean>(false);
  const achievementLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const loadDataList = async (payload: receivableIns | achievementIns, ajaxFn: any) => {
    loading.value = true;
    const [{ data: response }] = await Promise.all([await ajaxFn(payload), await sleep(500)]);
    loading.value = false;

    if (response.success) {
      response.data.forEach((item: yxywIsActualIncomeType) => (item.write_off_amount = undefined));
      data.value = response.data;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const loadAchievement = async (payload: achievementSearchIns | payableSearchIns, ajaxFn: any) => {
    achievementLoading.value = true;
    const [{ data: response }] = await Promise.all([await ajaxFn(payload), await sleep(500)]);
    achievementLoading.value = false;
    if (response.success) {
      response.data.write_off_amount = undefined;
      queryData.value = [response.data];
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const submitAjax = async (payload: writeOffParams, ajaxFn: any) => {
    submitLoading.value = true;
    const [{ data: response }] = await Promise.all([await ajaxFn(payload), await sleep(500)]);
    submitLoading.value = false;
    if (response.success) {
      return Promise.resolve(true);
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
      return Promise.reject();
    }
  };
  return {
    loading,
    data,
    queryData,
    loadDataList,
    loadAchievement,
    submitAjax,
    submitLoading,
  };
};

export default defineComponent({
  setup(_, ctx) {
    const pageConst = ref(useConst.isActualIncome);

    const businessType = ref<number>(1); // 1:营销业务；2: 淘宝点播；3：抖音店播
    const notAmount = ref<string>('');
    const logicPart = useList(ctx);
    const nextFlag = ref<boolean>(false);
    const achievementId = ref<string>('');
    const writeOffVisible = ref<boolean>(false);
    const selectedYxywIsActualIncome = ref<yxywIsActualIncomeType[]>([]);

    /** 实收金额渲染函数 */
    const gather_amount_render = ({
      gather_amount,
    }: {
      gather_amount: string | number | undefined;
    }) => (gather_amount === undefined ? '--' : `￥${formatAmount(gather_amount)}`);

    /** 实收金额最小宽度 */
    const gather_amount_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map(row =>
          get_length_of_string(gather_amount_render(row)),
        ),
        get_length_of_string('实收金额'),
      ),
    );

    /** 应收金额渲染函数 */
    const payable_amount_render = ({
      payable_amount,
    }: {
      payable_amount: string | number | undefined;
    }) => (payable_amount === undefined ? '--' : `￥${formatAmount(payable_amount)}`);

    /** 应收金额最小宽度 */
    const payable_amount_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map((row: any) =>
          get_length_of_string(payable_amount_render(row)),
        ),
        get_length_of_string('应收金额'),
      ),
    );

    /** 应付金额渲染函数 */
    const receivable_amount_render = ({
      receivable_amount,
    }: {
      receivable_amount: string | number | undefined;
    }) => (receivable_amount === undefined ? '--' : `￥${formatAmount(receivable_amount)}`);

    /** 应付金额最小宽度 */
    const receivable_amount_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map((row: any) =>
          get_length_of_string(receivable_amount_render(row)),
        ),
        get_length_of_string('应付金额'),
      ),
    );

    /** 实付金额渲染函数 */
    const cost_amount_render = ({
      cost_amount,
      search_type,
    }: {
      cost_amount: string | number | undefined;
      search_type: number | undefined;
    }) =>
      cost_amount === undefined
        ? '--'
        : `￥${formatAmount(search_type === 4 ? Number(cost_amount) * -1 : cost_amount)}`;

    /** 实付金额最小宽度 */
    const cost_amount_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map((row: any) =>
          get_length_of_string(cost_amount_render(row)),
        ),
        get_length_of_string('实付金额'),
      ),
    );

    /** 未核销金额渲染函数 */
    const not_write_off_amount_render = (row: { not_write_off_amount: string | number }) =>
      `￥${formatAmount(row.not_write_off_amount)}`;

    /** 未核销金额最小宽度 */
    const not_write_off_amount_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map(row =>
          get_length_of_string(not_write_off_amount_render(row)),
        ),
        get_length_of_string('未核销金额'),
      ),
    );

    /** 编号 */
    const uid_render = (row: { uid: string }) => `${row.uid}`;
    /** 编号最小宽度 */
    const uid_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map(row => get_length_of_string(uid_render(row))),
        get_length_of_string('收款编号'),
      ),
    );

    const id_render = (row: { id: number }) => `${row.id}`;
    /** 项目名称渲染函数(仅供计算长度用) */
    const project_name_render = (row: { project_name: string }) => {
      if (!row.project_name) return '--';
      if (row.project_name.length <= 13) {
        return row.project_name;
      }
      return row.project_name.substr(0, 13) + '...';
    };

    /** 项目名称渲染函数(真实渲染) */
    const project_name_real_render = ({ project_name }: { project_name: string }) => {
      if (!project_name) return '--';
      if (project_name.length <= 13) {
        return project_name;
      }
      return h(
        'el-tooltip',
        {
          props: {
            effect: 'light',
            placement: 'top-start',
            content: project_name,
          },
        },
        [h('span', undefined, project_name.substr(0, 13) + '...')],
      );
    };

    /** 编号最小宽度 */
    const project_name_min_length = computed(() =>
      Math.max(
        ...selectedYxywIsActualIncome.value.map(row =>
          get_length_of_string(project_name_render(row)),
        ),
        get_length_of_string('项目名称'),
      ),
    );

    const commonColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '核销金额 (元)',
        width: 122,
        formatter: (row: yxywIsActualIncomeType) => {
          return h('el-input', {
            on: {
              input: (val: string) => {
                inputNumber(val, row);
              },
              blur: () => {
                blurNumber(row);
              },
            },
            attrs: {
              size: 'mini',
              placeholder: '0.00',
            },
            props: {
              value: row.write_off_amount,
            },
          });
        },
      },
      {
        label: '操作',
        width: 70,
        formatter: (row: any, column: any, cellValue: any, index: number) => {
          return h(
            'a',
            {
              on: {
                click: () => {
                  removeColumnHandler(index);
                },
              },
            },
            ['移除'],
          );
        },
      },
    ]);

    const isActualIncomeColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '应收编号',
        property: 'uid',
        minWidth: uid_min_length.value,
        formatter: uid_render,
      },
      {
        label: '应收金额',
        align: 'right',
        minWidth: receivable_amount_min_length.value + 20,
        formatter: (row: any) => receivable_amount_render(row),
      },
      {
        label: '项目名称',
        minWidth: project_name_min_length.value,
        formatter: project_name_real_render,
      },
      {
        label: '未核销金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: not_write_off_amount_min_length.value + 20,
        formatter: not_write_off_amount_render,
      },
      ...commonColumns.value,
    ]);

    const isReceivableColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '收/付款编号',
        property: 'uid',
        minWidth: uid_min_length.value,
        formatter: uid_render,
      },
      {
        label: '实收/实付金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: gather_amount_min_length.value + 40,
        formatter: gather_amount_render,
      },
      {
        label: '项目名称',
        minWidth: project_name_min_length.value,
        formatter: project_name_real_render,
      },
      {
        label: '未核销金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: not_write_off_amount_min_length.value + 20,
        formatter: not_write_off_amount_render,
      },
      ...commonColumns.value,
    ]);

    const isActualColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '应付编号',
        property: 'uid',
        minWidth: uid_min_length.value,
        formatter: uid_render,
      },
      {
        label: '应付金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: payable_amount_min_length.value + 20,
        formatter: (row: any) => payable_amount_render(row),
      },
      {
        label: '项目名称',
        minWidth: 220,
        formatter: project_name_real_render,
      },
      {
        label: '未核销金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: not_write_off_amount_min_length.value + 20,
        formatter: not_write_off_amount_render,
      },
      ...commonColumns.value,
    ]);

    const isPayable = computed<TableColumn<any>[]>(() => [
      {
        label: '收/付款编号',
        property: 'id',
        minWidth: max_length_of_column(selectedYxywIsActualIncome, '收/付款编号', uid_render).value,
        formatter: (row: any) => {
          if (row.search_type === 4) return uid_render(row);
          return id_render(row);
        },
      },
      {
        label: '实付金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: cost_amount_min_length.value + 20,
        formatter: (row: any) => cost_amount_render(row),
      },
      {
        label: '项目名称',
        minWidth: 220,
        formatter: project_name_real_render,
      },
      {
        label: '未核销金额',
        align: 'right',
        headerAlign: 'right',
        minWidth: not_write_off_amount_min_length.value + 20,
        formatter: not_write_off_amount_render,
      },
      ...commonColumns.value,
    ]);

    // 实收核销列表
    const thirdColumn = computed<TableColumn<any>[]>(() => {
      if (pageConst.value.type === 'isActualIncome') {
        return isActualIncomeColumns.value;
      } else if (pageConst.value.type === 'isReceivable') {
        return isReceivableColumns.value;
      } else if (pageConst.value.type === 'isActual') {
        return isActualColumns.value;
      } else if (pageConst.value.type === 'isPayable') {
        return isPayable.value;
      } else {
        return [];
      }
    });
    let currentAmount = 0;
    let receivableUid = '';
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    let isDydbOrYxyw = isFromSupplyChain.value
      ? 'supply_chain'
      : isFromLocalLife.value
      ? 'local_life'
      : 'live';

    const closeHandler = () => {
      writeOffVisible.value = false;
      nextFlag.value = false;
      selectedYxywIsActualIncome.value = [];
      notAmount.value = '';
      achievementId.value = '';
      logicPart.queryData.value = [];
    };
    const addColumnHandle = () => {
      let _item = logicPart.queryData.value[0];
      if (_item?.search_type === 2 || _item?.search_type === 4) {
        _item = { ..._item };
        _item.gather_amount = Number('-' + _item.gather_amount);
        _item.not_write_off_amount = Number('-' + _item.not_write_off_amount);
      }
      selectedYxywIsActualIncome.value.unshift(_item);
      logicPart.queryData.value = [];
    };
    const handleSelectionChange = (list: yxywIsActualIncomeType[]) => {
      selectedYxywIsActualIncome.value = list;
    };
    const addColumn: any = {
      label: ' ',
      align: 'right',
      formatter: (row: any) => {
        const smap = selectedYxywIsActualIncome.value.map(item => item.id);
        return h(
          'el-button',
          {
            on: {
              click: () => {
                addColumnHandle();
              },
            },
            attrs: {
              size: 'mini',
              type: 'primary',
              disabled: smap.includes(row.id),
            },
          },
          ['添加'],
        );
      },
    };
    const removeColumnHandler = (idx: number) => {
      selectedYxywIsActualIncome.value.splice(idx, 1);
    };
    const blurNumber = (row: yxywIsActualIncomeType) => {
      if (row?.search_type === 2 || row?.search_type === 4) {
        const val = row.write_off_amount;
        if (val) {
          const _val = Number('-' + row.write_off_amount);
          if (isNaN(_val)) {
            row.write_off_amount = row.write_off_amount?.includes('-')
              ? row.write_off_amount
              : '-' + row.write_off_amount;
          } else if (_val >= row.not_write_off_amount) {
            row.write_off_amount = _val + '';
          } else {
            row.write_off_amount = row.not_write_off_amount + '';
          }
        }
      }
    };
    const inputNumber = (val: string, row: yxywIsActualIncomeType) => {
      if (!row.search_type || row.search_type === 1) {
        if (Number(val) > row.not_write_off_amount) {
          row.write_off_amount = row.not_write_off_amount + '';
        } else {
          row.write_off_amount = getPositiveNumber(val);
        }
      } else {
        row.write_off_amount = getPositiveNumber(val);
      }
    };
    const searchHandler = () => {
      if (!achievementId.value.trim()) return;
      const obj = <any>{};
      const pathname = location.pathname.split('/');
      const pid = pathname.find(v => /\d/.test(v));
      if (pageConst.value.type === 'isReceivable') {
        obj.achievement_uid = achievementId.value;
        obj.receivable_type = businessType.value;
        obj.project_id = pid;
      } else if (pageConst.value.type === 'isActualIncome') {
        obj.receivable_uid = achievementId.value;
        obj.receivable_type = businessType.value;
      } else if (pageConst.value.type === 'isPayable') {
        obj.cost_id = achievementId.value;
        obj.payable_type = businessType.value;
        obj.project_type = isDydbOrYxyw;
        obj.project_id = pid;
      } else if (pageConst.value.type === 'isActual') {
        obj.payable_uid = achievementId.value;
        obj.payable_type = businessType.value;
      }
      logicPart.loadAchievement(obj, pageConst.value.queryAjax);
      achievementId.value = '';
    };

    const show = ({
      type = 'isActualIncome',
      id,
      leaf,
      amount,
      busType,
      receivable_uid,
      cost_split_id,
    }: achievementType) => {
      console.log(leaf, 'leaf');

      writeOffVisible.value = true;
      const obj: any = {};
      if (type === 'isActualIncome') {
        pageConst.value = useConst.isActualIncome;
        obj.achievement_id = id;
      } else if (type === 'isReceivable') {
        pageConst.value = useConst.isReceivable as any;
        obj.receivable_id = id;
      } else if (type === 'isActual') {
        pageConst.value = useConst.isActual as any;
        obj.cost_id = id;
        obj.project_type = leaf;
        if (leaf === 'live' || leaf === 'local_life' || leaf === 'supply_chain') {
          obj.cost_split_id = cost_split_id;
        }
      } else if (type === 'isPayable') {
        pageConst.value = useConst.isPayable as any;
        obj.project_type = leaf;
        obj.payable_id = id;
      }
      pageConst.value.secondColumn[4] = addColumn;

      businessType.value = busType;
      currentAmount = amount;
      receivableUid = receivable_uid;
      isDydbOrYxyw = leaf;
      notAmount.value = formatAmount(amount);
      //TODO: 应收调用接口
      logicPart.loadDataList(
        obj,
        leaf === 'coop'
          ? pageConst.value.yxSameProjectAjax
          : isFromLocalLife.value
          ? pageConst.value.dbSameLocalLifeProjectAjax
          : pageConst.value.dbSameProjectAjax,
      );
    };
    const nextStep = () => {
      nextFlag.value = true;
    };
    const submitHandler = async () => {
      const hasZero = selectedYxywIsActualIncome.value.find(item => item.write_off_amount === '0');
      if (hasZero) {
        ctx.root.$message({
          type: 'warning',
          message: '核销金额不能小于等于0',
          duration: 2000,
          showClose: true,
        });
        return;
      }
      const amounts = selectedYxywIsActualIncome.value
        .filter(item => item.write_off_amount)
        .map(item => item.write_off_amount);
      const total = amounts.reduce((total: any, current: any) => total * 1 + current * 1, 0);
      const payload = <submitWrteOff[]>selectedYxywIsActualIncome.value.map(item => {
        if (pageConst.value.type === 'isReceivable') {
          return {
            receivable_uid: receivableUid,
            receipt_uid: item.uid,
            write_off_amount: item.write_off_amount,
          };
        } else if (pageConst.value.type === 'isActualIncome') {
          return {
            receivable_uid: item.uid,
            receipt_uid: receivableUid,
            write_off_amount: item.write_off_amount,
          };
        } else if (pageConst.value.type === 'isActual') {
          return {
            paid_uid: receivableUid,
            payable_uid: item.uid,
            write_off_amount: item.write_off_amount,
          };
        } else if (pageConst.value.type === 'isPayable') {
          return {
            paid_uid: item.search_type === 4 ? item.uid : item.id,
            payable_uid: receivableUid,
            write_off_amount: item.write_off_amount,
          };
        }
      });
      if (total > currentAmount) {
        ctx.root.$message({
          type: 'warning',
          message: '输入核销金额不能超过可核销金额',
          duration: 2000,
          showClose: true,
        });
        return;
      } else if (!total || total <= 0) {
        ctx.root.$message({
          type: 'warning',
          message: '核销金额不能小于等于0',
          duration: 2000,
          showClose: true,
        });
        return;
      }
      const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
      const confirm = await AsyncConfirm(ctx, { title: '确认进行核销？操作成功后不可撤销' });
      if (confirm) {
        const obj: writeOffParams = { list: payload, confirm: true, project_type: isDydbOrYxyw };
        const fn =
          isDydbOrYxyw === 'live' ||
          isDydbOrYxyw === 'local_life' ||
          isDydbOrYxyw === 'supply_chain'
            ? isFromSupplyChain.value
              ? pageConst.value.dbSubmitSupplyChainAjax
              : isFromLocalLife.value
              ? pageConst.value.dbSubmitLocalLifeAjax
              : pageConst.value.dbSubmitAjax
            : pageConst.value.yxSubmitAjax;
        logicPart.submitAjax(obj, fn).then(() => {
          closeHandler();
          ctx.root.$message({
            type: 'success',
            message: '核销成功',
            duration: 2000,
            showClose: true,
          });
          ctx.emit('submit');
        });
      }
    };
    return {
      writeOffVisible,
      closeHandler,
      nextFlag,
      show,
      nextStep,
      submitHandler,
      ...logicPart,
      notAmount,
      pageConst,
      handleSelectionChange,
      achievementId,
      searchHandler,
      selectedYxywIsActualIncome,
      thirdColumn,
    };
  },
});
