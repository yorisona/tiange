import { ref, defineComponent, h, computed, onMounted, inject } from '@vue/composition-api';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { GetFeishuDepartmentList } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { useExpiringContract } from './useList';
import { RouterLegal } from '@/const/router';
import AnnexDialog from '@/modules/customer/contract/annex.dialog.vue';
import { departmentFilterDisabled } from '@/utils/filter';
// import { usePageJump } from '@/utils/pageJump';

export default defineComponent({
  name: '',
  setup(props, ctx) {
    const routes: any = [
      {
        name: RouterLegal.LegalBulletinBoard,
        title: '合同看板',
      },
      {
        path: '',
        title: '倒签合同',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const {
      saleData,
      loading: tableLoading,
      AbnormalTableColumn: tableColumn,
      // rejectVisible,
      getData,
      total: infoTotal,
      onAnnexDialogClose,
    } = useExpiringContract(ctx);
    const data = ref();
    const initQueryForm = (): any => {
      return {
        page_num: 1,
        num: 20,
        // total: 0,
        department_name: ctx.root.$route.query.department_name ?? undefined,
        business_type: Number(ctx.root.$route.query.business_type ?? 0) || undefined,
        department_id: ctx.root.$route.query.department_id ?? undefined,
        department_level: ctx.root.$route.query.department_level ?? undefined,
        start_date: ctx.root.$route.query.start_date ?? undefined,
        end_date: ctx.root.$route.query.end_date ?? undefined,
        project_name: '',
        company_name: '',
        no_normal: true,
      } as any;
    };
    const queryForm = ref(initQueryForm());
    const businessList = computed(() => {
      return [
        {
          label: '全部',
          value: undefined,
        },
        ...BusinessTypeOptions,
      ];
    });
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);
    const methods = {
      async getFeishuDepartmentList(_ = false) {
        const res = await GetFeishuDepartmentList({});
        if (res.data.success) {
          const list = res.data.data.data;
          departmentFilterDisabled(list, true, 3);
          feishuDepartmentList.value = list;
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      handleCheckChange: (data: FeiShuDepartment) => {
        department_tree.value?.setCheckedKeys([]);
        if (queryForm.value.department_id === data.id) {
          queryForm.value.department_id = undefined;
          queryForm.value.department_name = undefined;
        } else {
          queryForm.value.department_id = data.id;
          queryForm.value.department_name = data.name;
          queryForm.value.department_level = data.level;
          department_tree.value?.setCheckedKeys([data.id]);
        }
      },
      ondepartmentCleaar(event?: any) {
        department_tree.value?.setCheckedKeys([]);
        queryForm.value.department_id = undefined;
        queryForm.value.department_name = undefined;
        queryForm.value.department_level = undefined;
        if (event) {
          event.stopPropagation();
        }
      },
    };
    onMounted(async () => {
      methods.getFeishuDepartmentList(false);
      getData(queryForm.value);
      queryForm.value.department_id &&
        department_tree.value?.setCheckedKeys([queryForm.value.department_id]);
      // methods.onQueryHandler();
    });
    // 查询
    const reset = async () => {
      queryForm.value = {
        page_num: 1,
        num: 20,
        // total: 0,
        department_name: undefined,
        business_type: undefined,
        department_id: undefined,
        department_level: undefined,
        start_date: undefined,
        end_date: undefined,
        project_name: '',
        company_name: '',
        no_normal: true,
      };
      methods.ondepartmentCleaar();
      getData(queryForm.value);
      // await reload();
    };
    const reload = async () => {
      getData(queryForm.value);
    };
    const onCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      getData(queryForm.value);
    };
    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      getData(queryForm.value);
    };
    //跳转
    // const { jumpProjectDetail } = usePageJump();
    // 点击进入合同详情
    const handleRowClick = (row: any, column: any) => {
      if (column) {
        if (column.label === '操作') return;
        if (column.label === '项目信息' && row.project_infos.length > 0) return;
      }
      if (
        row.contract_info.contract_type === 1 ||
        row.contract_info.contract_type === 2 ||
        row.contract_info.contract_type === 5
      ) {
        // 客户合同
        const routeUrl = ctx.root.$router.resolve({
          name: row.template_info
            ? RouterLegal.contracts.customer.detailTemplate
            : RouterLegal.contracts.customer.detail,
          params: { id: `${row.contract_info.id}` },
        });
        window.open(routeUrl.href, '_blank');
      } else if (
        row.contract_info.contract_type === 3 ||
        row.contract_info.contract_type === 4 ||
        row.contract_info.contract_type === 6
      ) {
        // 供应商
        const routeUrl = ctx.root.$router.resolve({
          name: row.template_info
            ? RouterLegal.contracts.supplier.detailTemplate
            : RouterLegal.contracts.supplier.detail,
          params: { id: `${row.contract_info.id}` },
          query: {
            contract_type: `${row.contract_info.contract_type}`,
          },
        });
        window.open(routeUrl.href, '_blank');
      } else {
        // 主播
        const routeUrl = ctx.root.$router.resolve({
          name: RouterLegal.contracts.anchor.detailTemplate,
          params: { id: `${row.contract_info.id}` },
          query: {
            contract_type: `${row.contract_info.contract_type}`,
          },
        });
        window.open(routeUrl.href, '_blank');
      }
    };
    return {
      data,
      reset,
      reload,
      queryForm,
      businessList,
      feishuDepartmentList,
      department_tree,
      tableLoading,
      infoTotal,
      tableColumn,
      saleData,
      handleRowClick,
      onCurrentChange,
      handlePageSizeChange,
      onAnnexDialogClose,
      ...methods,
    };
  },
  render() {
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    const addBtnProps = {
      on: {
        'dialog:close': () => {
          this.onAnnexDialogClose();
        },
      },
    };
    return (
      <div class="tg-contract-page flex-auto">
        <tg-card padding={[16, 0, 12, 16]}>
          <el-form
            class="filter-form flex-form"
            size="mini"
            label-width="70px"
            show-message={false}
            label-position="left"
            inline={true}
          >
            <el-form-item label="业务类型：">
              <el-select
                style="width: 204px;"
                v-model={this.queryForm.business_type}
                clearable
                size="mini"
                on-focus={this.selectControlPopoverHide}
              >
                {this.businessList.map(el => (
                  <el-option label={el.label} value={el.value} key={el.value}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门：">
              <el-popover
                placement="bottom-start"
                trigger="click"
                width="370"
                popper-class="project-fund-statement-tree-popper el-tree-popper-mini"
              >
                <div
                  slot="reference"
                  class="department-tree-select"
                  style="display: block; cursor: pointer;"
                >
                  {this.queryForm.department_name && (
                    <div class="depart-select-box">
                      <span style=" line-height: 27px; font-size: var(--default-font-size);">
                        {this.queryForm.department_name}
                      </span>
                      <i
                        style="margin-top: 7px; color: white; font-size: var(--small-font-size)"
                        class="el-icon-circle-close"
                        onClick={this.ondepartmentCleaar}
                      ></i>
                    </div>
                  )}
                  {!this.queryForm.department_name && (
                    <div class="depart-select-box">
                      <span style="color: var(--disabled-color); line-height: 27px; font-size: var(--default-font-size);">
                        请选择所属部门
                      </span>
                      <i
                        style="margin-top: 7px; color: var(--disabled-color);font-size: var(--small-font-size)"
                        class="el-icon-arrow-down"
                      ></i>
                    </div>
                  )}
                </div>
                <div class="department-tree">
                  <el-tree
                    ref="department_tree"
                    props={{
                      props: treeProps,
                    }}
                    check-strictly={true}
                    node-key="id"
                    data={this.feishuDepartmentList}
                    show-checkbox
                    check-on-click-node
                    // default-expand-all
                    // default-checked-keys="default_checked_department_ids"
                    default-expanded-keys={
                      this.queryForm.department_id ? [this.queryForm.department_id] : []
                    }
                    on-check={this.handleCheckChange}
                  ></el-tree>
                </div>
              </el-popover>
              <li style="display: none" class="controlPopoverHide"></li>
            </el-form-item>
            <el-form-item label="项目名称：">
              <el-input
                style="width: 204px;"
                clearable
                size="mini"
                placeholder="请输入项目名称"
                v-model={this.queryForm.project_name}
              />
            </el-form-item>
            <el-form-item
              label="公司名称："
              class="flex-form-item form-item-group"
              style="margin-bottom: 12px"
            >
              <el-input
                style="width: 204px;"
                clearable
                size="mini"
                placeholder="请输入公司名称"
                v-model={this.queryForm.company_name}
              />
            </el-form-item>
            <el-form-item class="flex-form-item order-100" style="margin-bottom: 14px">
              <tg-button type="primary" size="mini" onClick={this.reload}>
                查询
              </tg-button>
              <tg-button class="mgl-12" size="mini" onClick={this.reset}>
                重置
              </tg-button>
            </el-form-item>
          </el-form>
        </tg-card>
        <section class="table-field">
          <div style="height: 100%;">
            <tg-table
              stripe
              tooltip-effect="light"
              height={'100%'}
              v-loading={this.tableLoading}
              border
              class="precharge-table"
              data={this.saleData}
              on-row-click={this.handleRowClick}
              row-style={{ cursor: 'pointer' }}
            >
              <template slot="empty">
                <empty-common
                  style="margin-top:20px"
                  imgHeight="100"
                  imgWidth="200"
                  detail-text="暂无数据"
                ></empty-common>
              </template>
              {this.tableColumn.map(v => (
                <el-table-column
                  show-overflow-tooltip
                  // class-name={v.className}
                  label={v.label}
                  prop={v.property}
                  align={v.align}
                  headerAlign={v.headerAlign}
                  // width={v.minWidth}
                  minWidth={v.minWidth}
                  formatter={v.formatter}
                />
              ))}
            </tg-table>
          </div>
        </section>
        {this.saleData.length > 0 && (
          <div class="pagination">
            <el-pagination
              class="flex-none"
              current-page={this.queryForm.page_num}
              page-sizes={[10, 20, 30, 50, 100]}
              page-size={this.queryForm.num}
              total={this.infoTotal}
              layout="total, prev, pager, next, sizes, jumper"
              on-current-change={this.onCurrentChange}
              on-size-change={this.handlePageSizeChange}
            />
          </div>
        )}
        <AnnexDialog {...addBtnProps} />
      </div>
    );
  },
});
