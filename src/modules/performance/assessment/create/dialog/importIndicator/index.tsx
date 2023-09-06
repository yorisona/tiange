import { defineComponent, ref } from '@vue/composition-api';
import {
  Query_Indicator_Tag,
  Query_Indicators_Library,
  Save_Indicator_Tag,
} from '@/services/performance';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { INDICATOR_TYPE_OPTIONS } from '@/const/performance';
import { Select } from '@gm/component/select';
export default defineComponent({
  props: {
    autoClose: {
      type: Boolean,
      default: () => true,
    },
  },
  setup(props, ctx) {
    const name = ref<string>();
    const dimension_type_list = ref<number[]>([]);
    const show = (value: NPerformance.Indicators[], types: number[] = []) => {
      dimension_type_list.value = types;
      query();
    };
    const query = () => {
      const params = { ...formData.value };
      if (params.indicator_type === undefined) {
        params.indicator_type = dimension_type_list.value.join(',');
      }
      reqIndicators.runAsync({ num: 20, page_num: 1 }, params);
    };
    const tableRef = ref<{ tableRef: ITableRef }>();
    const formRef = ref<IFormRef>();
    const reqQueryTag = useRequest(Query_Indicator_Tag);
    const reqSaveTag = useRequest(Save_Indicator_Tag, { manual: true });
    const onSaveBtnClick = () => {
      ctx.emit('submit', selected.value);
      if (props.autoClose) {
        ctx.emit('close');
      }
    };
    const formData = ref<any>({} as any);
    // 指标类表
    const reqIndicators = usePagination(Query_Indicators_Library, {
      manual: true,
    });
    const selectedHistory = ref<NPerformance.Indicators[]>([]);
    const selected = ref<NPerformance.Indicators[]>([]);
    const filter = query;

    return {
      name,
      onSaveBtnClick,
      show,
      reqSaveTag,
      formData,
      formRef,
      reqIndicators,
      selected,
      selectedHistory,
      tableRef,
      reqQueryTag,
      filter,
      dimension_type_list,
    };
  },
  render() {
    const { formData, dimension_type_list } = this;

    return (
      <div class="page-container">
        <el-form
          inline
          size="mini"
          hide-required-asterisk={true}
          ref="formRef"
          attrs={{
            model: this.formData,
          }}
        >
          <el-form-item label="指标名称：">
            <el-input
              placeholder="请输入维度名称"
              v-model={this.formData.name}
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="指标标签：">
            <Select
              popper-class="el-select-popper-mini"
              showAll={true}
              placeholder="请选择"
              v-model={formData.tag_id}
              options={this.reqQueryTag.data?.map(item => {
                return {
                  value: item.tag_id,
                  label: item.name,
                };
              })}
              clearable={true}
            />
          </el-form-item>
          <el-form-item label="指标类型：">
            <Select
              popper-class="el-select-popper-mini"
              placeholder="请选择"
              showAll={true}
              v-model={formData.indicator_type}
              options={INDICATOR_TYPE_OPTIONS.map(item => {
                return {
                  ...item,
                  disabled: !dimension_type_list.some(it => it === item.value),
                };
              })}
              clearable={false}
            />
          </el-form-item>
          <tg-button type="primary" onClick={this.filter}>
            查询
          </tg-button>
        </el-form>
        <div class="content-box">
          <div class="library-box">
            <tg-table
              ref="tableRef"
              height="100%"
              border
              show-header={true}
              data={this.reqIndicators.data}
              onselect-all={(all: NPerformance.Indicators[]) => {
                const isAdd = all.length > 0;
                if (isAdd) {
                  all.forEach(item => {
                    const findIndex = this.selected.findIndex(it => it.id === item.id);
                    if (findIndex === -1) this.selected.push(item);
                  });
                } else {
                  const data: NPerformance.Indicators[] = this.reqIndicators.data as any;
                  data.forEach(item => {
                    const findIndex = this.selected.findIndex(it => it.id === item.id);
                    if (findIndex !== -1) this.selected.splice(findIndex, 1);
                  });
                }
              }}
              // pagination={this.reqIndicators.pagination}
            >
              <el-table-column
                type="selection"
                width="42px"
                align="center"
                scopedSlots={{
                  default: ({ row, isSelected }: any) => {
                    const hasChecked = this.selected.some(it => it.id === row.id);
                    const hasDisabled = this.selectedHistory.some(it => it.id === row.id);

                    if (isSelected !== hasChecked) {
                      setTimeout(() => {
                        this.tableRef?.tableRef.toggleRowSelection(row);
                      });
                      //
                    }

                    return (
                      <el-checkbox
                        onInput={() => {
                          if (hasChecked) {
                            this.selected = this.selected.filter(it => it.id !== row.id);
                          } else {
                            this.selected.push(row);
                          }
                        }}
                        value={hasChecked}
                        disabled={hasDisabled}
                      />
                    );
                  },
                }}
                selectable={(row: NPerformance.Indicators) => {
                  return !this.selectedHistory.some(it => it.id === row.id);
                }}
              />
              <el-table-column label="指标" prop="name" class-name="table-column" align="left" />
              <el-table-column
                label="权重"
                prop="weight"
                width="76px"
                align="right"
                scopedSlots={{
                  default: ({ row }: any) => {
                    return row.weight ? `${row.weight}%` : '--';
                  },
                }}
              />
            </tg-table>
            <div class="pagination">
              <el-pagination
                small={true}
                layout="prev,pager,next"
                total={this.reqIndicators.pagination.total}
                current-page={this.reqIndicators.pagination.page_num}
                page-size={this.reqIndicators.pagination.page_size}
                oncurrent-change={this.reqIndicators.pagination.onCurrentChange}
              />
            </div>
          </div>
          <div class="select-box">
            <div class="selected-info">
              <span>已选：{this.selected.length} 个指标</span>
              <a
                onclick={() => {
                  this.selected = [];
                }}
              >
                清空选中
              </a>
            </div>
            <div class="selected-people">
              <div class="selected-people-list">
                {this.selected.map((item, index) => {
                  return (
                    <span>
                      {item.name}
                      <i
                        class="el-input__icon el-icon-close"
                        onclick={() => {
                          this.selected.splice(index, 1);
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
