import { defineComponent, ref } from '@vue/composition-api';

// import { Select } from '@gm/component/select';
import dialogImageView from '@/modules/supplier/playerManager/common/dialogImageView/index.vue';
import { BudgetModel } from '@/modules/management/budget/use';
import { ElTable } from 'element-ui/types/table';
import { GetProjectFilesList } from '@/services/workbentch';
import qs from 'query-string';
import { ObjectFilterEmpty } from '@/utils/func';
import { getToken } from '@/utils/token';

type FormData = {
  business_type?: string | undefined;
  department_id?: number | undefined;
  project_id?: number | undefined;
  project_name?: string | undefined;
};
export default defineComponent({
  components: { dialogImageView },
  setup: (props, ctx) => {
    const formData = ref<FormData>({
      project_id: undefined,
      project_name: '',
      department_id: undefined,
      business_type: undefined,
    } as any);
    const projectOptions = ref<TG.OptionType[]>([]);
    const loading = ref(false);
    const projectBudgetTable = ref<ElTable>();
    const tableData = ref<BudgetModel[]>([]);
    const multipleSelection = ref<BudgetModel[]>([]);
    const query = async () => {
      loading.value = true;
      const res = await GetProjectFilesList({
        ...formData.value,
        page_num: 1,
        num: 1000,
      });
      loading.value = false;
      if (res.data.success) {
        tableData.value = res.data.data || [];
        ctx.root.$nextTick(() => {
          if (projectBudgetTable.value) {
            multipleSelection.value = tableData.value;
            tableData.value.forEach(row => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              projectBudgetTable.value.toggleRowSelection(row, undefined);
            });
          }
        });
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const formRef = ref<IFormRef>();
    const visible = ref(false);
    const hide = () => {
      // prop.confirm!();
      visible.value = false;
    };
    const show = () => {
      formData.value = {
        project_id: undefined,
        project_name: '',
        department_id: undefined,
        business_type: undefined,
      };
      multipleSelection.value = [];
      visible.value = true;
      query();
    };
    const exportClick = () => {
      const _paramsstr = qs.stringify({
        ...ObjectFilterEmpty({
          ...formData.value,
          page_num: 1,
          num: 1000,
          export_ids: multipleSelection.value.map(item => item.project_id).join(','),
        }),
      });
      const token = getToken();
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/shop_live/workbench/export_shop_live_projects?${_paramsstr}&Authorization=${token}`,
      );
    };

    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val || [];
    };
    return {
      projectBudgetTable,
      tableData,
      loading,
      handleSelectionChange,
      multipleSelection,
      exportClick,
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
      <el-dialog
        title="项目清单"
        class="tg-dialog-classic tg-dialog-vcenter-new tg-invoice-dialog"
        width="848px"
        visible={this.visible}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.hide}
      >
        <div class="dialog-container">
          <div class="form-search">
            <el-form attrs={{ model: formData }} inline={true} size="mini">
              <el-form-item label="项目名称：">
                {/*<Select
                  options={this.projectOptions}
                  v-model={formData.project_id}
                  filterable
                  remote
                  remote-method={this.projectSearch}
                />*/}
                <el-input
                  v-key-enter={this.query}
                  placeholder="请输入项目名称"
                  v-model={formData.project_name}
                />
              </el-form-item>
              <el-form-item label="部门：">
                <department-select
                  style="width:200px"
                  size="mini"
                  placeholder="请选择部门"
                  queryForm={{}}
                  checkOnClickNode={true}
                  // disabledLevel={2}
                  // levelDisabled={(level: number) => level !== 2}
                  levelHidden={(level: number) => level > 2}
                  clearable
                  v-model={formData.department_id}
                />
              </el-form-item>
              {/*<el-form-item label="妆造师：" style="width:180px">
                <Select
                  v-model={formData.image_design_id}
                  options={this.reqImageDesigner.data as any}
                />
              </el-form-item>*/}
              <el-form-item label="类型：">
                <el-select
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
              <el-form-item>
                <tg-button type="primary" class="mgr-12" onClick={this.query}>
                  查询
                </tg-button>
                <tg-button disabled={this.multipleSelection.length < 1} onClick={this.exportClick}>
                  导出
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
              class="budget-table"
              data={this.tableData}
              on-selection-change={this.handleSelectionChange}
            >
              <el-table-column align="center" type="selection" width="55" />
              <el-table-column
                label="部门"
                minWidth={160}
                show-overflow-tooltip
                scopedSlots={{
                  default: ({ row, column }: any) => {
                    return row.department_name || '--';
                  },
                }}
              />
              <el-table-column
                label="项目编码"
                show-overflow-tooltip
                minWidth={110}
                scopedSlots={{
                  default: ({ row, column }: any) => {
                    return row.project_uid || '--';
                  },
                }}
              />
              <el-table-column
                label="项目名称"
                show-overflow-tooltip
                minWidth={150}
                scopedSlots={{
                  default: ({ row, column }: any) => {
                    return row.project_name || '--';
                  },
                }}
              />
              <el-table-column
                label="项目类型"
                minWidth={80}
                align="center"
                scopedSlots={{
                  default: ({ row, column }: any) => {
                    return row.business_type_name || '--';
                  },
                }}
              />
              <div class="tg-page-empty" slot="empty">
                <empty-common img-height="120" img-width="180" />
              </div>
            </el-table>
          </div>
        </div>
      </el-dialog>
    );
  },
});
