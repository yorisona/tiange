import { defineComponent, ref } from '@vue/composition-api';
import { ITemplateConfig, ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component';
import { Query_Gift_Details, CheckIntegralMGiveRecord } from '@/services/integral';
import { Confirm } from '@/use/asyncConfirm';
import { useDialog } from '@/use/dialog';
import auditFailed from './module/auditFailed.vue';
import { usePermission } from '@/use/permission';
// import { FunctionSelect, EFunctionSelectType } from '@/gm/component/select/FunctionSelect';

type Params = TG.PaginationParams<typeof Query_Gift_Details>;
type List = TG.HttpListResultType<typeof Query_Gift_Details>;
export default defineComponent({
  setup: (props, ctx) => {
    const permission = usePermission();

    const dialogAuditFailed = useDialog({
      component: auditFailed,
      title: '审核不通过',
      width: '350px',
      // footer: false,
      props: {},
      on: {
        submit(formData: any) {
          CheckIntegralMGiveRecord({
            record_id: formData.id,
            failed_reason: formData.comment,
            operator_status: 0,
          }).then(res => {
            if (res.data.success) {
              reqList.run(reqList.params[0], formData.value);
              reqList.reload();
            }
            ctx.root.$message.error(res.data.message ?? '操作成功');
          });
          dialogAuditFailed.close();
        },
      },
    });
    const columns: TgTableColumn<List>[] = [
      {
        label: '赠送时间',
        minWidth: 130,
        prop: 'gmt_create',
        align: 'center',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
      },
      {
        label: '发起人',
        minWidth: 80,
        prop: 'from_user_id',
        align: 'center',
      },
      {
        label: '受赠人',
        minWidth: 80,
        prop: 'to_user_id',
        align: 'center',
      },
      {
        label: '赠送金额',
        minWidth: 80,
        prop: 'm_num',
        align: 'right',
      },
      {
        label: '赠送理由',
        minWidth: 120,
        prop: 'reason',
        align: 'left',
        'show-overflow-tooltip': true,
      },
      {
        label: '赠送状态',
        minWidth: 80,
        prop: 'status',
        align: 'center',
        dataType: {
          type: 'enum',
          enum: E.mb.GivingAwayStatusMap,
        },
      },
      {
        label: '操作时间',
        minWidth: 120,
        prop: 'operator_time',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
        align: 'center',
        formatter(row) {
          if (row.operator_time === null) return '--';
          return row.operator_time.replace(/-/g, '.');
        },
      },
      {
        label: '操作人',
        minWidth: 80,
        align: 'center',
        prop: 'operator_id',
      },
      {
        label: '操作',
        minWidth: 118,
        align: 'left',
        formatter: row => {
          return permission.mb_good_present_record_audit && row.status === 2 ? (
            <div class="status-box">
              <tg-button
                type="link"
                class="mgr-12"
                onClick={() => {
                  Confirm('是否确定审核通过？').then(() => {
                    CheckIntegralMGiveRecord({
                      record_id: row.id,
                      operator_status: 1,
                    }).then(res => {
                      if (res.data.success) {
                        reqList.run(reqList.params[0], formData.value);
                        ctx.root.$message.success(res.data.message ?? '审核通过');
                      } else {
                        ctx.root.$message.error(res.data.message ?? '审核失败');
                      }
                    });
                  });
                }}
              >
                审核通过
              </tg-button>
              <tg-button
                type="link"
                onClick={() => {
                  dialogAuditFailed.show(row.id);
                  // Confirm('是否确定审核不通过？').then(() => {
                  //   CheckIntegralMGiveRecord({
                  //     give_record_id: row.id,
                  //     operator_status: 0,
                  //   }).then(res => {
                  //     if (res.data.success) {
                  //       reqList.run(reqList.params[0], formData.value);
                  //       ctx.root.$message.success(res.data.message ?? '操作通过');
                  //     } else {
                  //       ctx.root.$message.error(res.data.message ?? '操作失败');
                  //     }
                  //   });
                  // });
                }}
              >
                审核不通过
              </tg-button>
            </div>
          ) : (
            '--'
          );
        },
      },
    ];
    const formDataInit = () => {
      return {
        integral_goods_id: undefined,
        integral_goods_name: undefined,
        exchange_status: undefined,
      } as any;
    };
    const formData = ref<Params>(formDataInit());
    const reqList = usePagination(Query_Gift_Details);
    const config: ITemplateConfig = {
      reset() {
        formData.value = formDataInit();
      },
      table: {
        border: true,
      },
      emptyText: '暂无兑换记录，快去商城看看吧～',
      showExport: permission.mb_good_present_record_export ? true : false,
      exportURL: '/api/integral_m/export_integral_m_give_record',
      onKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          reqList.run(reqList.params[0], formData.value);
        }
      },
    };
    return { columns, reqList, formData, config };
  },
  render() {
    const { columns, reqList, formData, config } = this;
    return (
      <ListGenerallyTemplate columns={columns} service={reqList} v-model={formData} config={config}>
        <el-form-item label="发起人：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={formData.from_user}
            placeholder="请输入发起人花名"
          />
          {/* <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入并选择花名"
            v-model={formData.from_user_id}
          /> */}
        </el-form-item>
        <el-form-item label="受赠人：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={formData.to_user}
            placeholder="请输入受赠人花名"
          />
          {/* <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入并选择花名"
            v-model={formData.to_user_id}
          /> */}
        </el-form-item>
        <el-form-item label="赠送状态：">
          <Select
            showAll
            // onChange={() => {
            //   reqList.run(reqList.params[0], formData);
            // }}
            placeholder="请选择赠送状态"
            v-model={formData.status}
            options={E.mb.GivingAwayStatusOption}
          />
        </el-form-item>
        {/* <div slot="searchBtn">
          <tg-button
            class="el-btn-mini"
            type="primary"
            onClick={() => {
              this.reqList.pagination.reQuery(formData);
            }}
          >
            查询
          </tg-button>
          <tg-button class="mgl-8 el-btn-mini" onClick={() => {}}>
            重置
          </tg-button>
          <tg-button class="mgl-8 el-btn-mini">导出</tg-button>
        </div> */}
      </ListGenerallyTemplate>
    );
  },
});
