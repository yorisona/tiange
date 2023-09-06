import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { defineComponent, h, ref } from '@vue/composition-api';
import detail from '../dialog/detail/index.vue';
import deliver from '../dialog/deliver/index.vue';
import deduct from '../dialog/deduct/index.vue';
import editBirthday from '../dialog/editBirthday/index.vue';
import { useDialog } from '@/use/dialog';
import { Query_Integral_M_User } from '@/services/integral';
import feishu_department_select from '@/modules/design/components/feishu_department_select/index.vue';
import { usePermission } from '@/use/permission';
import datePicker from '@/modules/design/components/datePicker/index.vue';

export default defineComponent({
  components: {
    feishu_department_select,
    datePicker,
  },
  setup: () => {
    const initQueryForm = () => ({
      birthday: undefined as string[] | undefined,
      department_id: undefined as { id: number }[] | undefined,
      department_ids: undefined as [] | undefined,
      join_date: undefined as string[] | undefined,
      username: undefined,
    });
    const permission = usePermission();

    const queryForm = ref<ReturnType<typeof initQueryForm>>(initQueryForm());
    const columns = ref<TgTableColumn<any>[]>([
      {
        label: '工号',
        align: 'center',
        minWidth: 80,
        prop: 'work_id',
      },
      {
        label: '花名',
        align: 'center',
        minWidth: 50,
        prop: 'username',
      },
      {
        label: '部门',
        align: 'left',
        minWidth: 140,
        showOverflowTooltip: true,
        prop: 'department_name',
      },
      {
        label: '入职时间',
        align: 'center',
        minWidth: 90,
        prop: 'join_date',
        dataType: 'date',
      },
      {
        label: '生日',
        align: 'center',
        minWidth: 60,
        prop: 'birth_date',
        formatter(row) {
          if (!row.birth_date) return '';
          return row.birth_date.replace('-', '.');
        },
      },
      {
        label: 'M币拥有量',
        align: 'right',
        minWidth: 90,
        prop: 'integral_m',
      },
      {
        label: '操作',
        align: 'center',
        minWidth: 120,
        formatter: row => {
          return (
            <div class="operator-btns">
              <tg-button
                type="link"
                onClick={() => {
                  dialogDetail.show(row);
                }}
              >
                明细
              </tg-button>
              {permission.mb_send_less_m && (
                <tg-button
                  type="link"
                  onClick={() => {
                    dialogDeliver.show(row);
                  }}
                >
                  发放
                </tg-button>
              )}
              {permission.mb_send_less_m && (
                <tg-button
                  type="link"
                  onClick={() => {
                    dialogDeduct.show(row);
                  }}
                >
                  扣除
                </tg-button>
              )}

              {permission.mb_edit && (
                <tg-button
                  type="link"
                  onClick={() => {
                    dialogEditBirthday.show(row);
                  }}
                >
                  编辑
                </tg-button>
              )}
            </div>
          );
        },
      },
    ]);

    const reqList = usePagination(Query_Integral_M_User);

    const dialogDetail = useDialog({
      component: detail,
      title: 'M币明细',
      width: '750px',
      footer: false,
    });
    const dialogDeliver = useDialog({
      component: deliver,
      title: 'M币发放',
      width: 393,
      okText: '提交',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const dialogDeduct = useDialog({
      component: deduct,
      title: 'M币扣除',
      width: 393,
      okText: '提交',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const dialogEditBirthday = useDialog({
      component: editBirthday,
      title: '编辑生日',
      width: '328px',
      okText: '提交',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    // watch(
    //   () => queryForm.value.birthday,
    //   () => {
    //     reqList.run(reqList.params[0], queryForm.value as any);
    //   },
    // );
    const methods = {
      config: {
        reset() {
          queryForm.value = initQueryForm();
        },
        searchBefor() {
          const params: any = {};
          /*  if (queryForm.value.department_id) {
            params.department_id = queryForm.value.department_id.map(it => it.id).join(',');
          }*/
          if (queryForm.value.department_ids) {
            params.department_ids = queryForm.value.department_ids;
          }
          if (queryForm.value.birthday) {
            params.birth_start_date = queryForm.value.birthday[0].replace(/^\d+-/, '');
            params.birth_end_date = queryForm.value.birthday[1].replace(/^\d+-/, '');
          }
          params.username = queryForm.value.username;
          if (queryForm.value.join_date) {
            params.join_start_date = queryForm.value.join_date[0];
            params.join_end_date = queryForm.value.join_date[1];
          }

          return params;
        },
        table: {
          border: true,
        },
        onKeyup(event: KeyboardEvent) {
          if (event.key === 'Enter') {
            reqList.run(reqList.params[0], queryForm.value as any);
          }
        },
      },
    };

    return {
      reqList,
      queryForm,
      columns,
      ...methods,
    };
  },
  render() {
    const { queryForm, config } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        v-model={this.queryForm}
        config={this.config}
        service={this.reqList}
      >
        <el-form-item label="员工花名：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={this.queryForm.username}
            placeholder="请输入员工花名"
          />
        </el-form-item>
        <el-form-item label="员工部门：">
          <feishu_department_select
            v-model={queryForm.department_ids}
            nativeOnKeyup={config.onKeyup}
            placeholder="请选择员工部门"
          />
        </el-form-item>
        <el-form-item label="入职时间：">
          <el-date-picker
            // onChange={() => {
            //   reqList.run(reqList.params[0], queryForm as any);
            // }}
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.queryForm.join_date}
          />
        </el-form-item>
        <el-form-item label="员工生日：">
          <date-Picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.queryForm.birthday}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
