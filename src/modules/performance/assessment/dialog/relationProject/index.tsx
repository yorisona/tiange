import { defineComponent, ref } from '@vue/composition-api';
import dialogImageView from '@/modules/supplier/playerManager/common/dialogImageView/index.vue';

import { ElTable } from 'element-ui/types/table';
import { GetRelatedProjectsList } from '../../../../../services/performance';
import { useRouter } from '../../../../../use/vue-router';

type FormData = {
  business_type?: string | undefined;
  project_manager_name?: string | undefined;
  project_id?: number | undefined;
  project_name?: string | undefined;
};

export default defineComponent({
  components: { dialogImageView },
  setup: (props, ctx) => {
    const formData = ref<FormData>({
      project_id: undefined,
      project_name: '',
      project_manager_name: undefined,
      business_type: undefined,
    } as any);
    const projectOptions = ref<TG.OptionType[]>([]);
    const loading = ref(false);
    const projectBudgetTable = ref<ElTable>();
    const tableData = ref<NPerformance.RelationProjectItem[]>([]);
    const multipleSelection = ref<NPerformance.RelationProjectItem[]>([]);
    const selected = ref<any[]>([]);
    const select_assessment_detail_id = ref();

    const query = async (selected_list?: string[]) => {
      loading.value = true;

      const res = await GetRelatedProjectsList({
        ...formData.value,
        assessment_detail_id: select_assessment_detail_id.value || undefined,
      });
      loading.value = false;
      if (res.data.success) {
        tableData.value = res.data.data || [];
        if (selected_list || selected.value.length > 0) {
          const select_multipleSelection =
            (res.data.data || []).filter((item: NPerformance.RelationProjectItem) => {
              const find =
                (selected_list || []).find(
                  (sub: string) => Number(sub) === Number(item.project_id),
                ) ||
                selected.value.find(
                  (sub: NPerformance.RelationProjectItem) => sub.project_id === item.project_id,
                );
              return find;
            }) || [];

          ctx.root.$nextTick(() => {
            if (projectBudgetTable.value) {
              select_multipleSelection.forEach((row: NPerformance.RelationProjectItem) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                projectBudgetTable.value?.toggleRowSelection(row, undefined);
              });
            }
          });
        }
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    const selectRow = ref();

    const formRef = ref<IFormRef>();
    const visible = ref(false);
    const hide = () => {
      visible.value = false;
    };
    const router = useRouter();
    const show = (row: NPerformance.Indicators, assessment_detail_id?: number | null) => {
      selectRow.value = row;
      const id = Number(router.currentRoute.params.id || 0);
      select_assessment_detail_id.value = assessment_detail_id || id ? Number(id) : undefined;
      formData.value = {
        project_id: undefined,
        project_name: '',
        project_manager_name: undefined,
        business_type: undefined,
      };
      multipleSelection.value = [];
      visible.value = true;
      query(row.related_project_ids ? row.related_project_ids.split(',') : []);
    };
    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val || [];
      selected.value = selected.value.filter((item: any) => {
        return tableData.value.find(sub => item.project_id === sub.project_id) ? false : true;
      });
      selected.value = Array.from(new Set([...selected.value, ...multipleSelection.value]));
    };
    const numFormat = (num: string) => {
      const res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ',';
        });
      });
      return res;
    };
    const onSaveBtnClick = () => {
      selectRow.value.related_project_ids = selected.value.map(item => item.project_id).join(',');
      let check_standard = ''; //项目GMV月度目标
      (selected.value || []).map((sub: NPerformance.RelationProjectItem) => {
        check_standard =
          check_standard +
          sub.project_name +
          ':\n' +
          (sub.goal_value !== null ? '¥' + numFormat(sub.goal_value + '') : '--') +
          '\n\n';
      });
      check_standard = check_standard.substring(0, check_standard.lastIndexOf('\n'));
      selectRow.value.check_standard = selected.value.length > 0 ? check_standard : '';
      ctx.emit('submit', selectRow.value);
    };
    return {
      onSaveBtnClick,
      selected,
      projectBudgetTable,
      tableData,
      loading,
      handleSelectionChange,
      multipleSelection,
      hide,
      visible,
      projectTypeOption: E.project.ProjectTypeOption,
      show,
      formData,
      formRef,
      projectOptions,
      query,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="dialog-container relation-project">
        <div class="form-search">
          <el-form attrs={{ model: formData }} inline={true} size="mini">
            <el-form-item label="项目名称：">
              <el-input
                style="width: 160px"
                clearable={true}
                v-key-enter={() => {
                  this.query();
                }}
                placeholder="请输入项目名称"
                v-model={formData.project_name}
              />
            </el-form-item>
            <el-form-item label="项目经理：">
              <el-input
                style="width: 160px"
                clearable={true}
                v-key-enter={() => {
                  this.query();
                }}
                placeholder="请输入项目经理"
                v-model={formData.project_manager_name}
              />
            </el-form-item>
            <el-form-item label="项目类型：">
              <el-select
                clearable={true}
                popper-class="el-select-popper-mini"
                v-model={formData.business_type}
                class="budget-select"
                placeholder="请选择"
                style="width: 130px"
              >
                <el-option label="全部" value={undefined} key={undefined}></el-option>
                {this.projectTypeOption
                  .filter(el => el.value !== 1)
                  .map((el, index) => {
                    return (
                      <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                    );
                  })}
              </el-select>
            </el-form-item>
            <el-form-item style="margin-right:0">
              <tg-button
                type="primary"
                onClick={() => {
                  this.query();
                }}
              >
                查询
              </tg-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-body">
          <el-table
            ref="projectBudgetTable"
            height="100%"
            v-loading={this.loading}
            border
            class="project-table"
            data={this.tableData}
            on-selection-change={this.handleSelectionChange}
          >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column
              label="项目名称"
              show-overflow-tooltip
              minWidth={150}
              scopedSlots={{
                default: ({ row }: any) => {
                  return row.project_name || '--';
                },
              }}
            />
            <el-table-column
              label="项目经理"
              minWidth={100}
              align="center"
              scopedSlots={{
                default: ({ row }: any) => {
                  return row.project_manager_name || '--';
                },
              }}
            />
            <el-table-column
              label="项目类型"
              minWidth={70}
              align="center"
              scopedSlots={{
                default: ({ row }: any) => {
                  return row.business_type ? E.project.ProjectTypeMap.get(row.business_type) : '--';
                },
              }}
            />
            <div class="tg-page-empty" slot="empty">
              <empty-common img-height="120" img-width="180" />
            </div>
          </el-table>
          <div class="select-box">
            <div class="selected-info">
              <span>已选：{this.selected.length} 个项目</span>
              <a
                onclick={() => {
                  this.multipleSelection.map(item => {
                    this.projectBudgetTable?.toggleRowSelection(item, undefined);
                  });
                  this.selected = [];
                  this.multipleSelection = [];
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
                      {item.project_name}
                      <i
                        class="el-input__icon el-icon-close"
                        onclick={() => {
                          const row = this.selected[index];
                          this.selected.splice(index, 1);
                          if (this.multipleSelection.indexOf(row) >= 0) {
                            this.multipleSelection.splice(this.multipleSelection.indexOf(row), 1);
                            this.projectBudgetTable?.toggleRowSelection(row, undefined);
                          }
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
