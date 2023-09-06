import { PropType, defineComponent, watchEffect } from '@vue/composition-api';
import {
  SwitchTabQueryForm,
  useProjectTopList,
} from '@/modules/management/companyDashboard/switchTab/switchTabUse';
import { useRequest } from '@gm/hooks/ahooks';
import { Query_Operate_Manage_Poject_Operating_Top_Project } from '@/services/management';
import { RouterManagement } from '@/const/router';

export default defineComponent({
  props: {
    queryForm: {
      type: Object as PropType<SwitchTabQueryForm>,
    },
  },
  setup(props, ctx) {
    const list = useProjectTopList(props as { queryForm: SwitchTabQueryForm }, ctx);
    const reqData = useRequest(Query_Operate_Manage_Poject_Operating_Top_Project, { manual: true });
    const methods = {
      getType() {
        return props.queryForm?.is_department ? 'department' : 'company';
      },
      getData() {
        const { start_date, end_date, is_department, department_id } = props.queryForm || {};
        if (!start_date || !end_date) return;
        if (is_department && !department_id) return;
        reqData.runAsync(
          {
            start_date,
            end_date,
            business_type: list.activedBusinessType.value,
            sort: list.sortInfo.value.sort,
            desc: list.sortInfo.value.desc,
            department_id,
          },
          methods.getType(),
        );
      },
      headerCellClassName(cell: any) {
        const { column } = cell;
        const sortable = list.columnSortabld(column.property);
        return sortable ? undefined : 'no-sortable';
      },
      /* headerCellStyle(cell: any) {
        const { column } = cell;
        return list.sortInfo.value.sort && column.property === list.sortInfo.value.sort
          ? 'background: #f0f8ff !important'
          : 'background: transparent !important';
      },*/
      cellClassName(cell: any) {
        const { column } = cell;
        return list.sortInfo.value.sort && column.property === list.sortInfo.value.sort
          ? 'sort-column'
          : undefined;
      },
    };
    watchEffect(() => {
      methods.getData();
    });
    return {
      list,
      reqData,
      ...methods,
    };
  },
  render() {
    const { date_type } = this.queryForm || {};
    if (date_type === 'day') {
      return (
        <div class="tg-project-top-page-container">
          <div class="empty-no-support">
            <empty-common detail-text="不支持自定义统计"></empty-common>
          </div>
        </div>
      );
    }
    return (
      <div class="tg-project-top-page-container">
        <section class="operator-field">
          <div class="business-type-switch">
            <div
              actived={this.list.activedBusinessType.value === undefined}
              class="item"
              onClick={() => {
                this.list.activedBusinessType.value = undefined;
              }}
            >
              全部
            </div>
            {E.management.BusinessTypeOption.map(el => (
              <div
                actived={this.list.activedBusinessType.value === el.value}
                class="item"
                key={el.value}
                onClick={() => {
                  this.list.activedBusinessType.value = el.value;
                }}
              >
                {el.label}
              </div>
            ))}
          </div>
          <tg-button
            type="link"
            onClick={() => {
              const routeUrl = this.$router.resolve({
                name: RouterManagement.projectDashboard,
              });
              window.open(routeUrl.href, '_blank');
            }}
          >
            <span>查看更多项目明细</span>
            <tg-icon name="ico-arrow-right"></tg-icon>
          </tg-button>
        </section>
        <section class="table-field">
          <tg-table
            stripe
            height={300}
            cell-style={{ borderBottom: '1px solid transparent' }}
            cell-class-name={this.cellClassName}
            // header-cell-class-name={this.cellClassName}
            header-cell-class-name={this.headerCellClassName}
            // header-cell-style={this.headerCellStyle}
            v-loading={this.reqData.loading}
            columns={this.list.columns.value}
            data={this.reqData.data || []}
            on-sort-change={this.list.onSortChange}
            default-sort={{ prop: 'gmv', order: 'descending' }}
          ></tg-table>
        </section>
      </div>
    );
  },
});
