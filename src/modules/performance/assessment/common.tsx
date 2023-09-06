import { computed, h, reactive, ref, set } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import { downloadFileFromLink, isEmpty, previewFile } from '@/utils/func';
import { EASSESSMENT_STAGE, EINDICATOR_TYPE, INDICATOR_TYPE_MAP } from '@/const/performance';
import limit from '@/utils/inputLimit';
import { useUserInfo } from '@/use/vuex';
import { queryUserNames } from '@/api/customer';
import { Confirm } from '@/use/asyncConfirm';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { Query_Assessment_Level_Config } from '@/services/performance';
const AssessMentKey = 'NPerformance.IEvaluationGroup';

export const defaultAssessment = () => {
  return {
    assessment_dimension_list: [],
    is_superior_rating: true,
    is_self_evaluation: true,
    is_target_confirmed: true,
    is_modify_indicator: false,
    is_transfer: false,
    superior_rating: [
      {
        is_transfer: false,
        scorer: {
          is_manager: true,
          manager: 1,
        },
      },
    ],
    by_evaluation_person: [],
  } as NPerformance.IEvaluationGroup | any;
};
// 载入本地考评组
export const loadLocalAssessment = (): NPerformance.IEvaluationGroup => {
  const localData = localStorage.getItem(AssessMentKey);
  if (localData !== null) return JSON.parse(localData);
  return defaultAssessment();
};
export const saveLocalAssessment = (data: NPerformance.IEvaluationGroup) => {
  localStorage.setItem(AssessMentKey, JSON.stringify(data));
};
export const resetLocalAssessment = () => {
  localStorage.removeItem(AssessMentKey);
};

// 计算单元格合并
export const useTransformAssessToTable = (data: NPerformance.IEvaluationGroup) => {
  // const newData: NPerformance.IEvaluationGroup = JSON.parse(JSON.stringify(data));
  const _data: any[] = [];
  data.assessment_dimension_list.forEach((item: any) => {
    let isFirstRow = true;
    item.indicator_list.forEach((ind: NPerformance.Indicators & any) => {
      ind.assessment_dimension = {
        name: item.name,
        is_modify_delete: item.is_modify_delete,
        id: item.id,
      };
      if (isFirstRow) {
        ind.span = [item.indicator_list.length, 1];
        isFirstRow = false;
      } else {
        ind.span = [0, 0];
      }
      _data.push(ind);
    });
  });

  return _data;
};
// 空指标维度补充数据
export const appendEmptyIndc = (data: NPerformance.IEvaluationGroup) => {
  data.assessment_dimension_list.forEach(item => {
    if (!item.is_modify_delete) return;
    if (item.indicator_list.length === 0) {
      const indicator: NPerformance.Indicators = {} as any;
      indicator.indicator_type = item.dimension_type_list[0] as any;
      indicator.name = '';
      indicator.check_standard = '';
      if (indicator.indicator_type === EINDICATOR_TYPE.RATION) {
        indicator.is_result = true;
        indicator.is_target = true;
        indicator.weight = '' as any;
      } else if (indicator.indicator_type === EINDICATOR_TYPE.QUALITATIVE) {
        indicator.weight = '' as any;
      }
      indicator.remark = '';
      indicator.is_assign_scorer = false;
      item.indicator_list.push(indicator);
    }
  });
};
export const replaceEnter = (str: string) => {
  if (isEmpty(str)) return str;
  const strs = str.split('\n');
  const result = [];
  for (let i = 0; i < strs.length; i++) {
    if (i > 0) result.push(<br />);
    result.push(strs[i]);
  }
  return result;
};
export const replaceGMVEnter = (str: string) => {
  if (isEmpty(str)) return str;
  const strs = str.split('\n\n');
  const result = [];
  for (let i = 0; i < strs.length; i++) {
    if (i > 0) result.push(<div style="height:8px" />);
    const two_strs = strs[i].split('\n');
    for (let j = 0; j < two_strs.length; j++) {
      if (j > 0) result.push(<br />);
      result.push(two_strs[j]);
    }
  }
  return result;
};
/** 绩效表格状态 **/
export enum AssessTableStatus {
  /** 默认 **/
  NONE,
  /** 目标制定编辑 **/
  EDIT_SELF_TARGET,
  /** 自评编辑阶段 **/
  EDIT_SELF_RESULT,
  /** 上级评分 **/
  EDIT_SUPPER_SCORE,
  /** 上级制定目标 **/
  EDIT_SUPERIOR_TARGET,
  /** 隔级  调整评分 **/
  EDIT_SUPERIOR_MODIFY,
}

export const useAssessmentTable = (
  showRelationProjectDialog?: (row: any, column: number) => void,
) => {
  const status = ref<AssessTableStatus>(AssessTableStatus.NONE);
  let submit: {
    AutoSaveTarget: TG.anyFunc;
    AutoSaveSelfEvaluation: TG.anyFunc;
    AutoSaveSuperiorRating: TG.anyFunc;
  };
  const data = ref<NPerformance.IAssessmentPeople>({
    assessment_dimension_list: [],
  } as any);
  const tableData = ref<NPerformance.Indicators[]>([]);
  const statusClass = computed(() => {
    return status.value === AssessTableStatus.NONE ? '' : ' disabled';
  });
  const user = useUserInfo();
  // 评分人下拉框
  const searchAssignScorer = async (val: string) => {
    if (val.trim() === '') {
      return [];
    }
    // queryUserNames
    //GetUser
    return queryUserNames({
      username: val,
    }).then(res => {
      if (res.data.success) {
        return res.data.data.user_data.map((it: any) => {
          return {
            value: it.id,
            label: it.username,
            ...it,
          };
        }) as any;
      } else {
        return [];
      }
    });
  };
  // Query_Assessment_Level_Config
  const levelConfig = ref<any[]>([]);
  Query_Assessment_Level_Config().then(res => {
    const data = res.data.data;
    if (data.length > 0 && data[0].config_list.length > 0) {
      levelConfig.value = data[0].config_list;
    }
  });

  const columns = computed(() => {
    // 重要
    status.value;
    data.value;
    // 判断是否开启指定评分人
    const hasOpenAssignScorer = tableData.value.some(it => it.is_assign_scorer);
    // 是否有结果值
    const hasResultScorer = tableData.value.some(it => it.is_result);

    // 当前上级类型
    let superLink = 0;
    for (const rating of data.value.superior_rating_link_list || []) {
      if (rating.is_close === 0) {
        superLink = rating.link;
        break;
      }
    }

    // 是否包含有加分项
    const hasIncreaseLimit = tableData.value.some(
      it => it.indicator_type === EINDICATOR_TYPE.BONUS,
    );
    // 是否包含有扣分项
    const hasDecreaseLimit = tableData.value.some(
      it => it.indicator_type === EINDICATOR_TYPE.DEDUCT,
    );
    // 存储字段是否至少一行中有数据
    const hasFieldData: Record<string, undefined | boolean> = {};
    const fields = [
      'remark',
      'self_assessment_score',
      'self_assessment_remark',
      'superior_assessment_score',
      'superior_assessment_remark',
      'assign_scorer_id',
      'assign_assessment_score',
      'assign_assessment_remark',
      'result_ass',
      'level_ass',
      'result',
      'result_remark',
    ];
    tableData.value?.forEach((item: any) => {
      fields.forEach(key => {
        if (!isEmpty(item[key])) {
          hasFieldData[key] = true;
        }
      });
    });
    if (
      data.value.self_evaluation_summary &&
      (data.value.self_evaluation_summary.summary_memo ||
        data.value.self_evaluation_summary.summary_files.length > 0)
    ) {
      hasFieldData['self_evaluation_summary'] = true;
    }
    if (
      data.value.superior_assessment_summary &&
      data.value.superior_assessment_summary.summary_memo
    ) {
      hasFieldData['superior_assessment_summary'] = true;
    }
    if (data.value.result) {
      hasFieldData['result_ass'] = true;
    }

    return (
      [
        {
          label: '维度',
          align: 'center',
          minWidth: 80,
          fixed: 'left',
          formatter: (row: any) => {
            return (
              <span class={`cell_per ${statusClass.value}`}>{row.assessment_dimension?.name}</span>
            );
          },
        },
        {
          minWidth: 80,
          label: '指标名称',
          fixed: 'left',
          formatter: (row: any) => {
            const valueKey = 'name';
            const editKey = `${valueKey}_edit`;
            if (
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
              row.assessment_dimension.is_modify_delete === true
            ) {
              const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
              return (
                <fragments>
                  <div style="height:40px" />
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      placeholder="请输入指标名称"
                      size="mini"
                      maxlength={30}
                      value={editValue}
                      resize="none"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        if (status.value === AssessTableStatus.EDIT_SELF_TARGET)
                          submit.AutoSaveTarget();
                      }}
                      onInput={(val: any) => {
                        set(row, editKey, val);
                      }}
                      style="width:100%;height:100%"
                    />
                  </div>
                </fragments>
              );
            }

            if (row[editKey] !== undefined) row[editKey] = undefined;
            return (
              <span class={`cell_per ${statusClass.value}`}>
                {isEmpty(row[valueKey]) ? '' : row[valueKey]}
              </span>
            );
          },
        },
        {
          minWidth: 76,
          label: '指标类型',
          align: 'center',
          formatter: (row: any) => {
            const valueKey = 'indicator_type';
            return (
              <span class={`cell_per ${statusClass.value}`}>
                {isEmpty(row[valueKey]) ? '' : INDICATOR_TYPE_MAP.get(row[valueKey])}
              </span>
            );
          },
        },
        // !(status.value === AssessTableStatus.NONE && !hasFieldData['remark']) && {
        !(
          (status.value === AssessTableStatus.NONE ||
            status.value === AssessTableStatus.EDIT_SELF_RESULT ||
            status.value === AssessTableStatus.EDIT_SUPPER_SCORE) &&
          !hasFieldData['remark']
        ) && {
          align: 'left',
          label: '指标定义',
          prop: 'remark',
          minWidth: 120,
          formatter: (row: any) => {
            const valueKey = 'remark';
            const editKey = `${valueKey}_edit`;
            if (
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
              row.assessment_dimension.is_modify_delete
            ) {
              const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
              return (
                <fragments>
                  <div style="height:100px" />
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        if (status.value === AssessTableStatus.EDIT_SELF_TARGET)
                          submit.AutoSaveTarget();
                      }}
                      type="textarea"
                      placeholder="请输入指标定义"
                      value={editValue}
                      resize="none"
                      maxlength={350}
                      show-word-limit
                      onInput={(val: any) => {
                        set(row, editKey, val);
                      }}
                    />
                  </div>
                </fragments>
              );
            }
            if (row[editKey] !== undefined) row[editKey] = undefined;
            return (
              <span class={`cell_per ${statusClass.value}`}>
                {isEmpty(row[valueKey]) ? '' : replaceEnter(row[valueKey])}
              </span>
            );
          },
        },
        {
          label: '考核标准',
          minWidth: 200,
          align: 'left',
          formatter: (row: any) => {
            const valueKey = 'check_standard';
            const editKey = `${valueKey}_edit`;
            const is_auto = row.compute_code === 'project_gmv' ? true : false;
            if (
              is_auto === false &&
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
              row.assessment_dimension.is_modify_delete
            ) {
              const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
              return (
                <fragments>
                  <div class="cell_per" style="height:60px" />
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        if (status.value === AssessTableStatus.EDIT_SELF_TARGET)
                          submit.AutoSaveTarget();
                      }}
                      placeholder="请输入考核标准"
                      value={editValue}
                      resize="none"
                      maxlength={350}
                      show-word-limit={true}
                      onInput={(val: any) => {
                        set(row, editKey, val);
                      }}
                    />
                  </div>
                </fragments>
              );
            }
            if (row[editKey] !== undefined) row[editKey] = undefined;
            return (
              <span
                class={`cell_per ${statusClass.value} ${
                  String(row['related_project_ids'] || '') === '' &&
                  is_auto &&
                  (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                    status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET)
                    ? 'placed'
                    : ''
                } ${is_auto ? 'gmv' : ''}`}
              >
                {String(row['related_project_ids'] || '') === '' &&
                is_auto &&
                (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                  status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) ? (
                  '请关联项目'
                ) : isEmpty(row[valueKey]) ? (
                  ''
                ) : is_auto ? (
                  <span>
                    <span style="color:var(--text-third-color);margin-bottom:12px;display: block;">
                      项目GMV月度目标:
                    </span>
                    {replaceGMVEnter(row[valueKey])}
                  </span>
                ) : (
                  replaceEnter(row[valueKey])
                )}
              </span>
            );
          },
        },
        hasResultScorer && {
          align: 'left',
          label: '目标值',
          minWidth: 70,
          formatter: (row: any) => {
            const valueKey = 'target';
            const editKey = `${valueKey}_edit`;
            const is_auto = row.compute_code === 'project_gmv' ? true : false;
            if (
              is_auto === false &&
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
              row.is_target
            ) {
              const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
              return (
                <fragments>
                  <div class="cell_per" style="height:100px" />
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        if (status.value === AssessTableStatus.EDIT_SELF_TARGET)
                          submit.AutoSaveTarget();
                      }}
                      size="mini"
                      value={editValue}
                      resize="none"
                      show-word-limit={true}
                      maxlength={100}
                      placeholder="请输入目标值"
                      onInput={(val: any) => {
                        set(row, editKey, val);
                      }}
                    />
                  </div>
                </fragments>
              );
            }
            if (row[editKey] !== undefined) row[editKey] = undefined;
            if (
              String(row['related_project_ids'] || '') !== '' &&
              isEmpty(row[valueKey]) &&
              is_auto
            ) {
              row[valueKey] = '100%';
            }
            return (
              <span
                class={`cell_per ${statusClass.value} ${
                  row.is_target &&
                  String(row['related_project_ids'] || '') === '' &&
                  is_auto &&
                  (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                    status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET)
                    ? 'placed'
                    : ''
                }`}
              >
                {!row.is_target
                  ? '--'
                  : String(row['related_project_ids'] || '') === '' &&
                    is_auto &&
                    (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                      status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET)
                  ? '请关联项目'
                  : row[valueKey]}
              </span>
            );
          },
        },
        hasResultScorer &&
          (status.value === AssessTableStatus.EDIT_SELF_RESULT || hasFieldData['result']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SELF && {
            align: 'left',
            label: '结果值',
            minWidth: 70,
            formatter: (row: any) => {
              const valueKey = 'result';
              const editKey = `${valueKey}_edit`;
              const is_auto = row.compute_code === 'project_gmv' ? true : false;
              if (
                is_auto === false &&
                status.value === AssessTableStatus.EDIT_SELF_RESULT &&
                row.is_result
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <fragments>
                    <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                      <el-input
                        placeholder="请输入结果值"
                        type="textarea"
                        onfocus={() => set(row, '_active', valueKey)}
                        onblur={() => {
                          set(row, '_active', '');
                          submit.AutoSaveSelfEvaluation();
                        }}
                        size="mini"
                        value={editValue}
                        resize="none"
                        onInput={(val: any) => {
                          set(row, editKey, val);
                        }}
                        style="width:100%;height:100%"
                      />
                    </div>
                  </fragments>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {!row.is_result ? '--' : row[valueKey]}
                </span>
              );
            },
          },
        hasResultScorer &&
          (status.value === AssessTableStatus.EDIT_SELF_RESULT || hasFieldData['result_remark']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SELF && {
            align: 'left',
            label: '结果值说明',
            minWidth: 150,
            formatter: (row: any) => {
              const valueKey = 'result_remark';
              const editKey = `${valueKey}_edit`;
              const is_auto = row.compute_code === 'project_gmv' ? true : false;
              if (
                is_auto === false &&
                status.value === AssessTableStatus.EDIT_SELF_RESULT &&
                row.is_result
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        submit.AutoSaveSelfEvaluation();
                      }}
                      size="mini"
                      resize="none"
                      maxlength={100}
                      show-word-limit
                      value={editValue}
                      placeholder="请输入结果值说明"
                      onInput={(val: any) => {
                        set(row, editKey, val);
                      }}
                    />
                  </div>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {!row.is_result ? (
                    '--'
                  ) : is_auto ? (
                    <span>{replaceGMVEnter(row[valueKey])}</span>
                  ) : (
                    replaceEnter(row[valueKey])
                  )}
                </span>
              );
            },
          },
        {
          align: 'right',
          label: '权重(%)',
          minWidth: 60,
          formatter: (row: any) => {
            const valueKey = 'weight';
            const editKey = `${valueKey}_edit`;
            if (
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
              (row.indicator_type === EINDICATOR_TYPE.QUALITATIVE ||
                row.indicator_type === EINDICATOR_TYPE.RATION) &&
              row.assessment_dimension.is_modify_delete
            ) {
              const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
              return (
                <div class={`weight edit ${row._active === valueKey ? 'active' : ''}`}>
                  <el-input
                    type="textarea"
                    maxlength={3}
                    resize="none"
                    onfocus={() => set(row, '_active', valueKey)}
                    onblur={() => {
                      set(row, '_active', '');
                      if (status.value === AssessTableStatus.EDIT_SELF_TARGET)
                        submit.AutoSaveTarget();
                    }}
                    size="mini"
                    placeholder="请输入权重"
                    value={editValue}
                    onInput={(val: any) => {
                      set(row, editKey, limit.Interger(val));
                    }}
                    style="width:100%;height:100%"
                  >
                    <span slot="append">%</span>
                  </el-input>
                </div>
              );
            }
            if (row[editKey] !== undefined) row[editKey] = undefined;
            let value = '';
            switch (row.indicator_type) {
              case EINDICATOR_TYPE.DEDUCT:
              case EINDICATOR_TYPE.BONUS:
                value = '--';
                break;
              case EINDICATOR_TYPE.QUALITATIVE:
              case EINDICATOR_TYPE.RATION:
                if (isEmpty(row.weight)) return '';
                value = `${row.weight}%`;
                break;
            }
            return <span class={`cell_per ${statusClass.value}`}>{value}</span>;
          },
        },
        hasIncreaseLimit && {
          align: 'center',
          label: '加分上限',
          minWidth: 80,
          formatter: (row: any) => {
            if (row.indicator_type !== EINDICATOR_TYPE.BONUS)
              return <span class={`cell_per ${statusClass.value}`}>--</span>;
            const valueKey = 'increase_limit';
            return (
              <span class={`cell_per ${statusClass.value}`}>
                {isEmpty(row[valueKey]) ? '--' : row[valueKey]}
              </span>
            );
          },
        },
        hasDecreaseLimit && {
          align: 'center',
          label: '扣分上限',
          minWidth: 80,
          formatter: (row: any) => {
            const valueKey = 'decrease_limit';
            if (row.indicator_type !== EINDICATOR_TYPE.DEDUCT)
              return <span class={`cell_per ${statusClass.value}`}>--</span>;
            return (
              <span class={`cell_per ${statusClass.value}`}>
                {isEmpty(row[valueKey]) ? '--' : row[valueKey]}
              </span>
            );
          },
        },
        !(status.value === AssessTableStatus.NONE && !hasFieldData['self_assessment_score']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SELF && {
            label: '自评',
            'render-header': () => {
              return (
                <span>
                  自评 <br />({(data.value as any)?.weight}%)
                </span>
              );
            },
            align: 'right',
            prop: 'self_assessment_score',
            minWidth: 66,
            formatter: (row: any) => {
              const valueKey = 'self_assessment_score';
              const editKey = `${valueKey}_edit`;
              const is_auto = row.compute_code === 'project_gmv' ? true : false;
              if (is_auto === false && status.value === AssessTableStatus.EDIT_SELF_RESULT) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      placeholder="按百分制进行打分"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        submit.AutoSaveSelfEvaluation();
                      }}
                      size="mini"
                      maxlength={3}
                      resize="none"
                      value={editValue}
                      onInput={(val: any) => {
                        set(row, editKey, limit.Interger(val));
                      }}
                    />
                  </div>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {isEmpty(row[valueKey]) ? '' : row[valueKey]}
                </span>
              );
            },
          },
        !(
          (status.value === AssessTableStatus.NONE ||
            status.value === AssessTableStatus.EDIT_SUPPER_SCORE) &&
          !hasFieldData['self_assessment_remark']
        ) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SELF && {
            label: '自评说明',
            align: 'left',
            minWidth: 100,
            formatter: (row: any) => {
              const valueKey = 'self_assessment_remark';
              const editKey = `${valueKey}_edit`;
              if (status.value === AssessTableStatus.EDIT_SELF_RESULT) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <fragments>
                    <div style="height:100px" />
                    <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                      <el-input
                        placeholder="请输入自评说明"
                        onfocus={() => set(row, '_active', valueKey)}
                        onblur={() => {
                          set(row, '_active', '');
                          submit.AutoSaveSelfEvaluation();
                        }}
                        type="textarea"
                        resize="none"
                        maxlength={100}
                        show-word-limit
                        size="mini"
                        value={editValue}
                        onInput={(val: any) => {
                          set(row, editKey, val);
                        }}
                      />
                    </div>
                  </fragments>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {isEmpty(row[valueKey]) ? '' : replaceEnter(row[valueKey])}
                </span>
              );
            },
          },
        (status.value === AssessTableStatus.EDIT_SELF_RESULT ||
          hasFieldData['self_evaluation_summary']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SELF && {
            label: '自评总结',
            align: 'left',
            prop: 'self_evaluation_summary',
            minWidth: 170,
            formatter: () => {
              const valueKey = 'summary_memo';
              const row: any = data.value.self_evaluation_summary;
              if (status.value === AssessTableStatus.EDIT_SELF_RESULT) {
                const editValue = row[valueKey];
                return (
                  <fragments>
                    <div style="min-height:400px" />
                    <div class={`edit  ${row._active === valueKey ? 'active' : ''}`}>
                      <div class="edit-merge">
                        <div>
                          <el-input
                            placeholder="请输入自评总结 (非必填)"
                            onfocus={() => set(row, '_active', valueKey)}
                            onblur={() => {
                              set(row, '_active', '');
                              submit.AutoSaveSelfEvaluation();
                            }}
                            type="textarea"
                            resize="none"
                            maxlength={400}
                            show-word-limit
                            size="mini"
                            value={editValue}
                            onInput={(val: any) => {
                              set(data.value.self_evaluation_summary, 'summary_memo', val);
                            }}
                          />
                        </div>
                        <div class="summary_memo_box">
                          {data.value.self_evaluation_summary.summary_files.length < 5 && (
                            <div style="display:flex">
                              <tg-upload
                                action="/api/anchor/upload_anchor_file"
                                show-file-list={false}
                                beforeUpload={FormValidation.ValidationFileUpload({
                                  excel: true,
                                  pdf: true,
                                  doc: true,
                                  image: true,
                                })}
                                success={(res: { data: { source: string } }) => {
                                  data.value.self_evaluation_summary.summary_files.push(
                                    res.data.source,
                                  );
                                  submit.AutoSaveSelfEvaluation();
                                }}
                              >
                                <tg-button icon="ico-upload-lite" size="mini">
                                  上传附件
                                </tg-button>
                              </tg-upload>
                              <div style="color:var(--text-third-color);margin-left:6px;line-height:26px">
                                (非必填)
                              </div>
                            </div>
                          )}

                          {data.value.self_evaluation_summary.summary_files.length === 0 && (
                            <span class="tips" style="color: var(--text-third-color)">
                              支持扩展名：docx，pdf，xlsx，jpg，png；最多上传5个文件夹
                            </span>
                          )}
                          <upload-file-list
                            v-model={data.value.self_evaluation_summary.summary_files}
                            onDelete={submit.AutoSaveSelfEvaluation}
                          />
                        </div>
                      </div>
                    </div>
                  </fragments>
                );
              }
              return (
                <div class={`cell_per view-summary ${statusClass.value}`} style="min-height:400px">
                  <div class="content">
                    {replaceEnter(data.value.self_evaluation_summary.summary_memo)}
                  </div>
                  <upload-file-list
                    delete={false}
                    v-model={data.value.self_evaluation_summary.summary_files}
                    scopedSlots={{
                      append: (file: string) => {
                        return (
                          <div class="upload-file-download">
                            <tg-button
                              type="link"
                              class="mgr-10"
                              onClick={() => previewFile(file, true)}
                            >
                              预览
                            </tg-button>
                            <tg-button type="link" onClick={() => downloadFileFromLink(file, true)}>
                              下载
                            </tg-button>
                          </div>
                        );
                      },
                    }}
                  />
                </div>
              );
            },
          },
        ((status.value === AssessTableStatus.EDIT_SUPPER_SCORE && superLink === 1) ||
          hasFieldData['superior_assessment_score']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SUPERIOR && {
            label: '上级评分',
            'render-header': () => {
              const superior_rating: any = (data.value as any).superior_rating;

              return (
                <span>
                  上级评分 <br />(
                  {superior_rating && superior_rating.length > 0 && superior_rating[0].weight}%)
                </span>
              );
            },
            align: 'left',
            key: 'superiors',
            prop: 'superior_assessment_score',
            minWidth: 80,
            formatter: (row: any) => {
              const valueKey = 'superior_assessment_score';
              const editKey = `${valueKey}_edit`;
              if (
                status.value === AssessTableStatus.EDIT_SUPPER_SCORE &&
                !row.is_assign_scorer &&
                superLink === 1
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      placeholder="按百分制进行打分"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        submit.AutoSaveSuperiorRating();
                      }}
                      size="mini"
                      maxlength={3}
                      resize="none"
                      value={editValue}
                      onInput={(val: any) => {
                        set(row, editKey, limit.Interger(val));
                      }}
                      style="width:100%;height:100%"
                    />
                  </div>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {row.is_assign_scorer ? '--' : row[valueKey]}
                </span>
              );
            },
          },
        ((status.value === AssessTableStatus.EDIT_SUPPER_SCORE && superLink === 1) ||
          hasFieldData['superior_assessment_remark']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SUPERIOR && {
            label: '上级评分说明',
            align: 'left',
            minWidth: 100,
            formatter: (row: any) => {
              const valueKey = 'superior_assessment_remark';
              const editKey = `${valueKey}_edit`;
              if (
                status.value === AssessTableStatus.EDIT_SUPPER_SCORE &&
                !row.is_assign_scorer &&
                superLink === 1
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <fragments>
                    <div class="cell_per" style="height:100px" />
                    <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                      <el-input
                        type="textarea"
                        placeholder="请输入上级评分说明"
                        onfocus={() => set(row, '_active', valueKey)}
                        onblur={() => {
                          set(row, '_active', '');
                          submit.AutoSaveSuperiorRating();
                        }}
                        size="mini"
                        resize="none"
                        maxlength={100}
                        show-word-limit
                        value={editValue}
                        onInput={(val: any) => {
                          set(row, editKey, val);
                        }}
                        style="width:100%;height:100%"
                      />
                    </div>
                  </fragments>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {row.is_assign_scorer ? '--' : row[valueKey]}
                </span>
              );
            },
          },
        ((status.value === AssessTableStatus.EDIT_SUPPER_SCORE && superLink === 1) ||
          hasFieldData['superior_assessment_summary']) &&
          data.value.present_stage >= EASSESSMENT_STAGE.SUPERIOR && {
            label: '上级评分总结',
            align: 'left',
            prop: 'superior_assessment_summary',
            minWidth: 140,
            formatter: () => {
              const valueKey = 'summary_memo';
              const row: any = data.value.superior_assessment_summary;
              if (
                status.value === AssessTableStatus.EDIT_SUPPER_SCORE &&
                !row.is_assign_scorer &&
                superLink === 1
              ) {
                const editValue = row[valueKey];
                return (
                  <fragments>
                    <div class="cell_per" style="height:100px" />
                    <div class={`edit  ${row._active === valueKey ? 'active' : ''}`}>
                      <div class="edit-merge no-attachment">
                        <div>
                          <el-input
                            placeholder="请输入评分总结"
                            onfocus={() => set(row, '_active', valueKey)}
                            onblur={() => {
                              set(row, '_active', '');
                              submit.AutoSaveSuperiorRating();
                            }}
                            type="textarea"
                            resize="none"
                            maxlength={400}
                            show-word-limit
                            size="mini"
                            value={editValue}
                            onInput={(val: any) => {
                              set(data.value.superior_assessment_summary, 'summary_memo', val);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </fragments>
                );
              }
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {row.is_assign_scorer ? '--' : row[valueKey]}
                </span>
              );
            },
          },
        (status.value !== AssessTableStatus.NONE || hasFieldData['assign_scorer_id']) &&
          hasOpenAssignScorer && {
            label: '指定评分人',
            align: 'center',
            minWidth: 85,
            formatter: (row: any) => {
              const valueKey = 'assign_scorer_id';
              const editKey = `${valueKey}_edit`;
              const textKey = `assign_scorer_username`;
              const searchOptionsKey = 'assign_scorer_options';
              if (
                (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                  status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
                row.is_assign_scorer
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-select
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                      }}
                      size="mini"
                      value={editValue}
                      onChange={() => {
                        if (status.value === AssessTableStatus.EDIT_SELF_TARGET)
                          submit.AutoSaveTarget();
                      }}
                      onInput={(val: any) => {
                        const find = row[searchOptionsKey].find((it: any) => it.value === val);
                        set(row, editKey, val);
                        if (find) set(row, textKey, find.label);
                      }}
                      filterable
                      remote
                      remote-method={(val: string) => {
                        searchAssignScorer(val).then(options => {
                          set(row, searchOptionsKey, options);
                        });
                      }}
                      style="width:100%;height:100%"
                      placeholder="请选择评分人"
                    >
                      {row[searchOptionsKey]?.map((item: any) => {
                        return <el-option label={item.label} value={item.value} />;
                      })}
                    </el-select>
                  </div>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {!row.is_assign_scorer ? '--' : row[textKey]}
                </span>
              );
            },
          },
        (status.value !== AssessTableStatus.NONE || hasFieldData['assign_assessment_score']) &&
          hasOpenAssignScorer &&
          data.value.present_stage >= EASSESSMENT_STAGE.SUPERIOR && {
            label: '指定评分人评分',
            align: 'center',
            prop: 'assign_assessment_score',
            minWidth: 110,
            formatter: (row: any) => {
              const valueKey = 'assign_assessment_score';
              const editKey = `${valueKey}_edit`;
              if (
                status.value === AssessTableStatus.EDIT_SUPPER_SCORE &&
                row.is_assign_scorer &&
                user.value.id === row.assign_scorer_id
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      type="textarea"
                      placeholder="按百分制进行打分"
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        submit.AutoSaveSuperiorRating();
                      }}
                      size="mini"
                      maxlength={3}
                      resize="none"
                      value={editValue}
                      onInput={(val: any) => {
                        set(row, editKey, limit.Interger(val));
                      }}
                      style="width:100%;height:100%"
                    />
                  </div>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {!row.is_assign_scorer ? '--' : row[valueKey]}
                </span>
              );
            },
          },
        (status.value !== AssessTableStatus.NONE || hasFieldData['assign_assessment_remark']) &&
          hasOpenAssignScorer &&
          data.value.present_stage >= EASSESSMENT_STAGE.SUPERIOR && {
            label: '指定评分人说明',
            align: 'left',
            minWidth: 150,
            formatter: (row: any) => {
              const valueKey = 'assign_assessment_remark';
              const editKey = `${valueKey}_edit`;
              if (
                status.value === AssessTableStatus.EDIT_SUPPER_SCORE &&
                row.is_assign_scorer &&
                user.value.id === row.assign_scorer_id
              ) {
                const editValue = row[editKey] === undefined ? row[valueKey] : row[editKey];
                return (
                  <div class={`edit ${row._active === valueKey ? 'active' : ''}`}>
                    <el-input
                      onfocus={() => set(row, '_active', valueKey)}
                      onblur={() => {
                        set(row, '_active', '');
                        submit.AutoSaveSuperiorRating();
                      }}
                      size="mini"
                      resize="none"
                      type="textarea"
                      placeholder="请输入说明"
                      maxlength={100}
                      show-word-limit
                      value={editValue}
                      onInput={(val: any) => {
                        set(row, editKey, val);
                      }}
                      style="width:100%;height:100%"
                    />
                  </div>
                );
              }
              if (row[editKey] !== undefined) row[editKey] = undefined;
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {!row.is_assign_scorer ? '--' : row[valueKey]}
                </span>
              );
            },
          },

        hasFieldData['result_ass'] &&
          status.value !== AssessTableStatus.EDIT_SUPERIOR_MODIFY && {
            label: '考核结果',
            align: 'center',
            minWidth: 80,
            fixed: 'right',
            prop: 'result_ass',
            formatter: () => {
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {isEmpty(data.value.result) ? '' : data.value.result}
                </span>
              );
            },
          },

        hasFieldData['result_ass'] &&
          status.value !== AssessTableStatus.EDIT_SUPERIOR_MODIFY && {
            label: '绩效等级',
            align: 'center',
            minWidth: 80,
            fixed: 'right',
            prop: 'level_ass',
            formatter: (row: any) => {
              return (
                <span class={`cell_per ${statusClass.value}`}>
                  {isEmpty(data.value.level) ? '' : data.value.level}
                </span>
              );
            },
          },
        status.value === AssessTableStatus.EDIT_SUPERIOR_MODIFY && {
          label: '考核结果',
          align: 'center',
          minWidth: 90,
          prop: 'result_ass',
          formatter: () => {
            const row: any = data.value;
            return (
              <fragments>
                <div class="cell_per" style="height:100px" />
                <div class={`edit`}>
                  <div class="edit-merge no-attachment">
                    <div>
                      <el-input
                        placeholder="请输入调整结果"
                        resize="none"
                        size="mini"
                        maxLength={6}
                        value={row.result_edit}
                        onInput={(val: any) => {
                          set(data.value, 'result_edit', limit.IntergerAndDecimals(val));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </fragments>
            );
          },
        },
        status.value === AssessTableStatus.EDIT_SUPERIOR_MODIFY && {
          label: '绩效等级',
          align: 'center',
          minWidth: 90,
          prop: 'level_ass',
          formatter: () => {
            let score = (data.value as any).result_edit;
            let level = '';
            if (score !== '' || score !== undefined) {
              score = Number(score);
              for (let i = 0; i < levelConfig.value.length; i++) {
                const tmp: any = levelConfig.value[i];
                if (score > tmp.gt_score && score <= tmp.lte_score) {
                  level = tmp.name;
                  break;
                }
              }
            }

            return <span class={`cell_per ${statusClass.value}`}>{level}</span>;
          },
        },

        (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
          status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) && {
          align: 'center',
          label: '操作',
          width: 80,
          fixed: 'right',
          prop: 'remark',
          formatter: (row: any, val, column, rowNumber) => {
            const btns = [];
            const is_auto = row.compute_code === 'project_gmv' ? true : false;
            if (
              is_auto &&
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET)
            ) {
              btns.push(
                <div class="cell_per">
                  <tg-button
                    type="link"
                    onclick={() => {
                      showRelationProjectDialog && showRelationProjectDialog(row, column);
                    }}
                  >
                    关联项目
                  </tg-button>
                </div>,
              );
            }
            if (
              (status.value === AssessTableStatus.EDIT_SELF_TARGET ||
                status.value === AssessTableStatus.EDIT_SUPERIOR_TARGET) &&
              row.assessment_dimension.is_modify_delete
            ) {
              const [rowSpan, colSpan] = row.span;
              if (rowSpan !== 1) {
                btns.push(
                  <div class="cell_per">
                    <tg-button
                      onclick={async () => {
                        await Confirm('确定删除指标吗?');
                        if (rowSpan > 0) {
                          (tableData.value[rowNumber + 1] as any).span = [rowSpan - 1, colSpan];
                        } else {
                          for (let i = rowNumber; i >= 0; i--) {
                            const [rS, cS] = (tableData.value[i] as any).span;
                            if (rS !== 0) {
                              (tableData.value[i] as any).span = [rS - 1, cS];
                              break;
                            }
                          }
                        }
                        tableData.value.splice(rowNumber, 1);
                        const currentaDimensionId = row.assessment_dimension.id;
                        // 找到删除后同一个纬度的指标
                        const newIndicator_list = tableData.value.filter(
                          (it: any) => it.assessment_dimension.id === currentaDimensionId,
                        );
                        // 找到所属维度
                        const dimension = data.value.assessment_dimension_list.find(
                          it => it.id === currentaDimensionId,
                        );
                        // 在同步到原始未单元格合并的数据
                        dimension.indicator_list = newIndicator_list;
                        if (status.value === AssessTableStatus.EDIT_SELF_TARGET) {
                          submit.AutoSaveTarget();
                        }
                      }}
                      type="link"
                    >
                      删除
                    </tg-button>
                  </div>,
                );
              } else {
                if (btns.length < 1) {
                  return <span class={`cell_per ${statusClass.value}`} />;
                }
              }
            }
            if (btns.length < 1) {
              return <span class={`cell_per ${statusClass.value}`} />;
            }
            return h('div', { class: 'operation' }, btns);
            // btns.push(<span class={`cell_per ${statusClass.value}`} />);
          },
        },
      ] as TgTableColumn<NPerformance.IAssessmentPeople>[]
    ).filter(Boolean);
  });
  const tableProps = computed(() => {
    const result: any = {
      props: {
        columns: columns.value,
        data: tableData.value,
        'span-method': (args: any) => {
          const { row, columnIndex, column, rowIndex } = args;
          if (columnIndex === 0 && row.span) {
            return row.span;
          } else if (column.property === 'level_ass' || column.property === 'result_ass') {
            if (rowIndex === 0) {
              return [tableData.value.length, 1];
            } else {
              return [0, 0];
            }
          } else if (column.property === 'self_evaluation_summary') {
            if (rowIndex === 0) {
              return [tableData.value.length, 1];
            } else {
              return [0, 0];
            }
          } else if (column.property === 'superior_assessment_summary') {
            if (rowIndex === 0) {
              return [tableData.value.length, 1];
            } else {
              return [0, 0];
            }
          }
          return [1, 1];
        },
        border: true,
      },
    };

    if (data.value.present_stage >= EASSESSMENT_STAGE.SELF) {
      result.props['summary-method'] = (param: any) => {
        const { columns } = param;

        return columns.map((item: any, index: number) => {
          if (index === 0) return <span class="cell_per">总分</span>;
          let result;
          let value;
          const prop = item.prop || item.property;
          switch (prop) {
            case 'self_assessment_score':
            case 'assign_assessment_score':
            case 'superior_assessment_score':
              value = tableData.value.reduce((a: number, dt: any) => {
                let width = dt[prop + '_edit'] || dt[prop];
                if (isNaN(width)) return a;
                width = Number(width);
                if (
                  dt.indicator_type === EINDICATOR_TYPE.RATION ||
                  dt.indicator_type === EINDICATOR_TYPE.QUALITATIVE
                ) {
                  width = width * (dt.weight / 100);
                } else if (dt.indicator_type === EINDICATOR_TYPE.DEDUCT) {
                  width = -width;
                }

                return width + a;
              }, 0);
              result = <span class="cell_per">{value.toFixed(2)}</span>;
              break;
            default:
              result = <span class="cell_per">--</span>;
              break;
          }
          return result;
        });
      };
      result.props['show-summary'] = true;
    }
    return result;
  });

  // 开启编辑自身评分
  const toggleEditSelfResult = (open: boolean) => {
    status.value = open ? AssessTableStatus.EDIT_SELF_RESULT : AssessTableStatus.NONE;
  };
  // 开启自身评分
  const toggleEditSelfTarget = (open: boolean) => {
    status.value = open ? AssessTableStatus.EDIT_SELF_TARGET : AssessTableStatus.NONE;
    if (open) {
      tableData.value.forEach((row: any) => {
        if (row.assign_scorer_id && !row.assign_scorer_options) {
          set(row, 'assign_scorer_options', [
            { label: row.assign_scorer_username, value: row.assign_scorer_id },
          ]);
        }
      });
    }
  };
  // 开启上级评分
  const toggleEditSupperScore = (open: boolean) => {
    status.value = open ? AssessTableStatus.EDIT_SUPPER_SCORE : AssessTableStatus.NONE;
  };
  // 开启隔级调整评分
  const toggleEditSuperiorModify = (open: boolean) => {
    status.value = open ? AssessTableStatus.EDIT_SUPERIOR_MODIFY : AssessTableStatus.NONE;
    if (open === false) {
      set(data.value, 'result_edit', null);
    } else {
      set(data.value, 'result_edit', data.value.result);
    }
  };

  // 开启上级评分
  const toggleEditSupperTarget = (open: boolean) => {
    status.value = open ? AssessTableStatus.EDIT_SUPERIOR_TARGET : AssessTableStatus.NONE;
    if (open) {
      tableData.value.forEach((row: any) => {
        if (row.assign_scorer_id && !row.assign_scorer_options) {
          set(row, 'assign_scorer_options', [
            { label: row.assign_scorer_username, value: row.assign_scorer_id },
          ]);
        }
      });
    }
  };

  // 更新数据
  const updateDimension = (value: any) => {
    const _data: any[] = useTransformAssessToTable(value);
    // 如果没有自评总结,把对象格式补齐
    if (!value.self_evaluation_summary) {
      value.self_evaluation_summary = {
        summary_memo: undefined,
        summary_files: [],
      };
    }
    // 如果没有上级总结,补充对象格式
    if (!value.superior_assessment_summary) {
      value.superior_assessment_summary = {
        summary_memo: undefined,
        summary_files: [],
      };
    }
    data.value = value;
    tableData.value = _data;
  };
  const bindSave = (fn: any) => {
    submit = fn;
  };
  return reactive({
    tableProps,
    tableData,
    data,
    updateDimension,
    toggleEditSelfResult,
    toggleEditSelfTarget,
    toggleEditSupperScore,
    toggleEditSupperTarget,
    toggleEditSuperiorModify,
    status,
    bindSave,
  });
};
