import { TgTableColumn } from '@/types/vendor/column';
import { ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import debriefingDetail from '@/modules/performance/debriefing/dialog/debriefingDetail/index.vue';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import { get_report_detail } from '@/services/performance';
import { FD } from '@/utils/formatData';
type Col = TgTableColumn<any>;
/**
 * 述职列表列（没有操作列）
 */
export const useDebriefingColumns = () => {
  const nameColumn = ref<Col>({
    label: '述职名称',
    minWidth: 120,
    showOverflowTooltip: true,
    dataType: 'text',
    prop: 'name',
  });
  const userColumn = ref<Col>({
    label: '述职人',
    minWidth: 120,
    align: 'center',
    dataType: 'text',
    prop: 'username',
  });
  const departmentNameColumn = ref<Col>({
    label: '部门',
    minWidth: 120,
    showOverflowTooltip: true,
    dataType: 'text',
    prop: 'department_fullname',
  });
  const createDateColumn = ref<Col>({
    label: '时间',
    minWidth: 120,
    align: 'center',
    dataType: 'date',
    prop: 'gmt_create',
  });
  const dateColumn = ref<Col>({
    label: '述职时间',
    minWidth: 120,
    align: 'center',
    dataType: 'date',
    prop: 'report_date',
  });
  const gradeColumn = ref<Col>({
    label: '综合得分',
    align: 'center',
    minWidth: 120,
    dataType: 'text',
    prop: 'result',
  });
  const levelColumn = ref<Col>({
    label: '述职等级',
    align: 'center',
    minWidth: 120,
    dataType: 'text',
    prop: 'result_level',
    formatter: row => {
      return FD.formatEmpty(row.result_level).toUpperCase();
    },
  });
  const operatorNameColumn = ref<Col>({
    label: '操作人',
    align: 'center',
    minWidth: 120,
    dataType: 'text',
    prop: 'username',
  });
  return {
    nameColumn,
    userColumn,
    departmentNameColumn,
    dateColumn,
    createDateColumn,
    gradeColumn,
    levelColumn,
    operatorNameColumn,
  };
};
/**
 * 述职管理列
 */
export const useDeriefingManageColumns = () => {
  const { nameColumn, operatorNameColumn, createDateColumn } = useDebriefingColumns();
  return [nameColumn.value, createDateColumn.value, operatorNameColumn.value];
};
/**
 * 述职管理清单列
 */
export const useDeriefingManageListColumns = () => {
  const { nameColumn, userColumn, departmentNameColumn, dateColumn, gradeColumn, levelColumn } =
    useDebriefingColumns();
  return [
    nameColumn.value,
    userColumn.value,
    departmentNameColumn.value,
    dateColumn.value,
    gradeColumn.value,
    levelColumn.value,
  ];
};

/**
 * 我的述职列
 */
export const useDeriefingMineColumns = () => {
  const { nameColumn, dateColumn, gradeColumn, levelColumn } = useDebriefingColumns();
  return [nameColumn.value, dateColumn.value, gradeColumn.value, levelColumn.value];
};
/**
 * 下级述职列
 */
export const useDeriefingUnderlingColumns = () => {
  const { nameColumn, userColumn, dateColumn, gradeColumn, levelColumn } = useDebriefingColumns();
  return [
    nameColumn.value,
    userColumn.value,
    dateColumn.value,
    gradeColumn.value,
    levelColumn.value,
  ];
};
export const useDebriefingDetailRequest = () => useRequest(get_report_detail, { manual: true });
async function viewDetailHandler(
  row: any,
  detailDialog: ReturnType<typeof useDebriefingDetailDialog>,
  detailRequest: ReturnType<typeof useRequest>,
) {
  const res = await detailRequest.runAsync({
    id: row.id,
  });
  if (res.data.success) {
    detailDialog.show(res.data.data);
  } else {
    Message.error(res.data.message || '获取述职详情失败');
  }
}
export const viewDebriefingDetailBtn = (
  row: any,
  detailDialog: ReturnType<typeof useDebriefingDetailDialog>,
  detailRequest: ReturnType<typeof useRequest>,
) => {
  return (
    <tg-button type="link" onClick={() => viewDetailHandler(row, detailDialog, detailRequest)}>
      查看详情
    </tg-button>
  );
};

export const useDebriefingDetailDialog = () => {
  const dialog = useDialog({
    title: '述职详情',
    width: 721,
    footer: false,
    component: debriefingDetail,
  });
  return dialog;
};
