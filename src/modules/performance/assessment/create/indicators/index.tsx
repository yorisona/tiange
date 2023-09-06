import { defineComponent, Ref, inject, set, ref } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import dialogEvaluation from '../dialog/createEvaluation/index.vue';
import dialogImportIndicator from '../dialog/importIndicator/index.vue';
import { useDialog, useDrawer } from '@/use/dialog';
import { Message } from 'element-ui';
import createIndic from '@/modules/performance/indicatorLibrary/create/index.vue';
import { EINDICATOR_TYPE, INDICATOR_TYPE_MAP } from '@/const/performance';
import { Confirm } from '@/use/asyncConfirm';
import { isEmpty } from '@/utils/func';

export default defineComponent({
  setup: () => {
    const formData = inject('formData') as Ref<NPerformance.IEvaluationGroup>;

    const columnsEvaluation: (
      item: NPerformance.IEvaluationDimension,
    ) => TgTableColumn<NPerformance.Indicators>[] = item => {
      return [
        { label: '指标名称', minWidth: 100, prop: 'name', align: 'left' },
        {
          align: 'center',
          label: '指标类型',
          minWidth: 100,
          prop: 'indicator_type',
          formatter: row => INDICATOR_TYPE_MAP.get(row.indicator_type),
        },
        {
          label: '指标定义',
          minWidth: 140,
          prop: 'remark',
          align: 'left',
          'show-overflow-tooltip': true,
        },
        { label: '考核标准', minWidth: 200, prop: 'check_standard', 'show-overflow-tooltip': true },
        {
          label: '目标值',
          minWidth: 100,
          prop: 'is_target',
          align: 'center',
          formatter: row => {
            return row.indicator_type === EINDICATOR_TYPE.RATION ? '' : '--';
          },
        },
        {
          label: '结果值',
          minWidth: 100,
          prop: 'is_result',
          align: 'center',
          formatter: row => {
            return row.indicator_type === EINDICATOR_TYPE.RATION ? '' : '--';
          },
        },
        {
          label: '权重',
          minWidth: 80,
          prop: 'weight',
          align: 'right',
          dataType: {
            suffix: '%',
          },
          formatter: row => {
            switch (row.indicator_type) {
              case EINDICATOR_TYPE.DEDUCT:
              case EINDICATOR_TYPE.BONUS:
                return '--';
              case EINDICATOR_TYPE.QUALITATIVE:
              case EINDICATOR_TYPE.RATION:
                if (isEmpty(row.weight)) return '';
                return `${row.weight}%`;
            }
          },
        },
        {
          label: '指定评分人',
          minWidth: 90,
          prop: 'is_assign_scorer',
          align: 'center',
        },
        {
          label: '评分方式',
          minWidth: 100,
          prop: 'scoring_method',
          align: 'center',
          formatter: () => '直接输入分数',
        },
        {
          label: '操作',
          minWidth: 100,
          align: 'center',
          formatter: (row, _, colIndex, rowIndex) => {
            return (
              <el-button-group>
                <tg-button
                  type="link"
                  class="mgr-12"
                  onclick={() => {
                    operation.value = rowIndex;
                    currentImportEva.value = item;
                    drawerCreateIndic.show({ ...row }, item.dimension_type_list);
                  }}
                >
                  编辑
                </tg-button>
                <tg-button
                  type="link"
                  onClick={async () => {
                    await Confirm('确定删除该指标');
                    item.indicator_list.splice(rowIndex, 1);
                  }}
                >
                  删除
                </tg-button>
              </el-button-group>
            );
          },
        },
      ];
    };

    const checkIndicator = (value: NPerformance.Indicators | NPerformance.Indicators[]) => {
      const source = value instanceof Array ? value : [value];
      const repeatValue: NPerformance.Indicators[] = [];
      const indcators = source.filter(it => {
        for (let i = 0; i < formData.value.assessment_dimension_list.length; i++) {
          const tmp = formData.value.assessment_dimension_list[i];
          for (let j = 0; j < tmp.indicator_list.length; j++) {
            const tmpInd = tmp.indicator_list[j];
            if (tmpInd.name === it.name) {
              repeatValue.push(it);
              return false;
            }
          }
        }
        return true;
      });
      return {
        indcators,
        repeatValue,
      };
    };
    const drawerCreateIndic = useDrawer({
      component: createIndic,
      width: '523px',
      title: '新增指标',
      props: {
        disabledSubmit: true,
      },
      on: {
        submit(value: any) {
          if (value.id === undefined) value.id = Date.now();
          if (operation.value !== null) {
            set(currentImportEva.value!.indicator_list, operation.value, value);
          } else {
            const check = checkIndicator(value);
            if (check.indcators.length === 0) {
              Message.error(`${value.name} 名称重复`);
              return;
            }
            currentImportEva.value!.indicator_list.push(value);
          }
          drawerCreateIndic.close();
        },
      },
    });
    const dialogEva = useDialog({
      title: '添加考核维度',
      width: '421px',

      component: dialogEvaluation,
      on: {
        submit(value: NPerformance.IEvaluationDimension) {
          const assessment_dimension = formData.value.assessment_dimension_list;

          const find = assessment_dimension.findIndex(it => it.name === value.name);
          if (find !== -1 && find !== operation.value) {
            Message.error('维度名称已存在');
            return;
          }
          if (operation.value !== null) {
            set(formData.value.assessment_dimension_list, operation.value, value);
          } else {
            formData.value.assessment_dimension_list.push(value);
          }

          dialogEva.close();
        },
      },
    });
    const dialogInd = useDialog({
      component: dialogImportIndicator,
      title: '指标库导入',

      width: '800px',
      props: {
        autoClose: false,
      },
      on: {
        submit(value: NPerformance.Indicators[]) {
          const check = checkIndicator(value);
          if (check.repeatValue.length > 0) {
            Message.error(`${check.repeatValue[0].name} 名称重复`);
            return;
          }
          currentImportEva.value!.indicator_list.push(...value);
          dialogInd.close();
        },
      },
    });
    const currentImportEva = ref<NPerformance.IEvaluationDimension>();
    const operation = ref<number | null>(null);
    const validate = () => {
      return new Promise(resolve => {
        resolve(undefined);
      });
    };
    return {
      formData,
      columnsEvaluation,
      dialogEva,
      validate,
      dialogInd,
      currentImportEva,
      drawerCreateIndic,
      operation,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="page-container">
        <div class="page-tips">
          <div>评分规则：</div>
          <div class="tip">每项指标的评分按照百分制打分</div>
          <div class="tip">总分=累加所有单项指标权重*评分之和</div>
        </div>
        <div class="mgb-18">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            onClick={() => {
              this.operation = null;
              this.dialogEva.show();
            }}
          >
            添加考核维度
          </tg-button>
        </div>
        <div>
          {formData.assessment_dimension_list.map((item, index) => {
            return (
              <div key={index} class={index === 0 ? 'dimension-box' : 'mgt-18 dimension-box'}>
                <div class="dimension-title">
                  <div class="dimension-name">
                    {item.name}
                    {!item.is_modify_delete && (
                      <span class="tips">
                        <tg-icon name="ico-icon_tongyong_jinggao_mianxingbeifen-01" />
                        不支持被考核人编辑、删除指标
                      </span>
                    )}
                  </div>
                  <div class="dimension-operate">
                    <tg-icon
                      name="ico-icon_bianji"
                      onClick={() => {
                        this.operation = index;
                        this.dialogEva.show({ ...item });
                      }}
                    />
                    <span class="split" />
                    <tg-icon
                      name="ico-btn-delete"
                      onClick={() => {
                        if (item.indicator_list && item.indicator_list.length > 0) {
                          Confirm('确认删除该维度的所有内容，删除后无法恢复？').then(() => {
                            formData.assessment_dimension_list.splice(index, 1);
                          });
                        } else {
                          formData.assessment_dimension_list.splice(index, 1);
                        }
                      }}
                    />
                  </div>
                </div>
                <tg-table
                  border
                  columns={this.columnsEvaluation(item)}
                  data={item.indicator_list}
                />
                <div class="dimension-footer">
                  <tg-button
                    onClick={() => {
                      this.currentImportEva = item;
                      this.dialogInd.show(item.indicator_list, item.dimension_type_list);
                    }}
                  >
                    指标库导入
                  </tg-button>
                  <tg-button
                    class="mgl-12"
                    onClick={() => {
                      this.operation = null;
                      this.currentImportEva = item;
                      this.drawerCreateIndic.show(null, item.dimension_type_list);
                    }}
                  >
                    增加指标
                  </tg-button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
