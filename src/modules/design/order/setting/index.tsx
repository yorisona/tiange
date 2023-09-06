import { computed, defineComponent, h, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { useRequest } from '@gm/hooks/ahooks';
import { Query_Setting_Design_Type_Form } from '@/services/design';
import { useDialog } from '@/use/dialog';
import newTypeDialog from '@/modules/design/dialog/newType/form.vue';
import departmentSettingDialog from '@/modules/design/dialog/departmentSetting/form.vue';
import projectLevelSettings from '@/modules/design/dialog/projectLevelSettings/index.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';

export default defineComponent({
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canView = HasPermission(RIGHT_CODE.design_order_setting_type_view);
      const canEdit = HasPermission(RIGHT_CODE.design_order_setting_type_edit);
      const canDepartmentEdit = HasPermission(RIGHT_CODE.design_order_setting_department_edit);
      return { canEdit, canView, canDepartmentEdit };
    });
    const columns: TgTableColumn<M.design.DesignSetting>[] = [
      {
        align: 'center',
        label: '序号',
        minWidth: 88,
        prop: 'id',
      },
      {
        align: 'left',
        label: '制作内容',
        className: 'type-name',
        prop: 'name',
        minWidth: 300,
        // formatter(row) {
        //   return <div ref="testRef">{row.project_name}</div>;
        // },
      },
      {
        align: 'center',
        label: '负责小组',
        prop: 'team_name',
        minWidth: 180,
      },
      {
        align: 'center',
        label: '对应项目类型',
        prop: 'team_label',
        minWidth: 180,
      },
      {
        align: 'center',
        label: '交付天数',
        prop: 'delivery_days',
        minWidth: 100,
        formatter: row => {
          let days = Number(row.delivery_days || 0);
          (row.addition_content || []).map((item: { delivery_days: number | string }) => {
            days = days + Number(item.delivery_days);
          });
          return String(days);
        },
      },
      {
        label: '操作',
        width: 78,
        formatter: row => {
          return Permission.value.canView
            ? h(
                'a',
                {
                  on: {
                    click: () => {
                      dialogNewType.config.props = {
                        data: JSON.parse(JSON.stringify(row)),
                      };
                      dialogNewType.show();
                    },
                  },
                },
                ['查看'],
              )
            : null;
        },
      },
    ];
    const reqList = useRequest(Query_Setting_Design_Type_Form);
    const dialogNewType = useDialog({
      component: newTypeDialog,
      title: '设计类型',
      width: '700px',
      footer: false,
      props: {},
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const dialogDepartmentSetting = useDialog({
      component: departmentSettingDialog,
      title: '部门设置',
      width: 600,
      footer: false,
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const dialogProjectLevelSettings = useDialog({
      component: projectLevelSettings,
      width: 680,
      title: '项目级别设置',
    });
    const tempDesignOrderListRef = ref();
    const formData = ref({ id: 21 });
    const config = {
      table: {
        rowClick: (row: any) => {
          dialogNewType.config.props = {
            data: JSON.parse(JSON.stringify(row)),
          };
          dialogNewType.show();
        },
      },
    };
    return {
      config,
      formData,
      tempDesignOrderListRef,
      Permission,
      columns,
      reqList,
      dialogNewType,
      dialogDepartmentSetting,
      dialogProjectLevelSettings,
    };
  },
  render() {
    const { columns, config } = this;
    return (
      <ListGenerallyTemplate
        ref="tempDesignOrderListRef"
        v-model={this.formData}
        config={config}
        columns={columns}
        service={this.reqList}
      >
        {(this.Permission.canEdit || this.Permission.canDepartmentEdit) && (
          <div slot="searchBefor" class="initiate-box">
            {this.Permission.canEdit && (
              <tg-button
                icon="ico-btn-add"
                type="primary"
                onClick={() => {
                  this.dialogNewType.config.props = {
                    data: {},
                  };
                  this.dialogNewType.show();
                }}
              >
                新增类型
              </tg-button>
            )}
            {this.Permission.canDepartmentEdit && (
              <tg-button
                style="margin-left:12px"
                type="default"
                onClick={() => this.dialogDepartmentSetting.show()}
              >
                部门设置
              </tg-button>
            )}
            <tg-button
              style="margin-left:12px"
              type="default"
              onClick={() => this.dialogProjectLevelSettings.show()}
            >
              项目级别设置
            </tg-button>
          </div>
        )}
      </ListGenerallyTemplate>
    );
  },
});
