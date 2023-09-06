import { defineComponent, ref } from '@vue/composition-api';

import { verificationColumns, prepayQueryForm, statusVerificationOption } from '../use/index';
// import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
// import { Query_User_Performance_Record } from '@/services/performance';
import { Confirm } from '@/use/asyncConfirm';
import {
  QueryDepositReceviedWriteOff,
  AuditDepositReceviedWriteOff,
  ConfirmReverse,
} from '@/services/finance';
import { BooleanType } from '@/types/base/advanced';
import useVisible from '@/use/visible';
import { ConfirmReverseParams, ReverseType } from '@/types/tiange/finance/settlement';
import { wait } from '@/utils/func';
import reverseAuditDialog from '@/modules/finance/components/reverseAudit.vue';

export default defineComponent({
  name: 'registerList',
  components: {
    reverseAuditDialog,
  },
  setup: (props, ctx) => {
    const initQueryForm = (): prepayQueryForm => {
      return {
        business_type: undefined,
        project_name: undefined,
        audit_status: undefined,
      };
    };

    const queryForm = ref<prepayQueryForm>(initQueryForm());
    const tableData = ref<any[]>([]);
    const query = usePagination(QueryDepositReceviedWriteOff);
    const AuditDepositReceviedWriteOffReq = (achievement_id: number, audit_status: number) => {
      return AuditDepositReceviedWriteOff({
        achievement_id,
        audit_status,
      }).then(res => {
        if (res.data.success) {
          ctx.root.$message.success('操作成功');
          query.reload();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };

    const reverseAuditDialogRef = ref<{
      open: (
        msg: string,
        cb: (is_pass: BooleanType, reverse_back_reason: string) => Promise<boolean>,
      ) => void;
    } | null>(null);

    const { visible: reverseAuditLoading, toggleVisible: toggleReverseAuditLoading } = useVisible();

    /** 冲销确认动作 */
    const onReverseAuditConfirm = async (
      achievement_id: number,
      is_pass: BooleanType,
      reverse_back_reason: string,
    ) => {
      toggleReverseAuditLoading();

      const params: ConfirmReverseParams = {
        id: achievement_id,
        reverse_type: ReverseType.receive,
        is_pass,
        reverse_back_reason,
      };
      const [{ data: response }] = await wait(500, ConfirmReverse(params));
      toggleReverseAuditLoading();
      if (response.success) {
        ctx.root.$message.success(response.message ?? '提交成功');
      } else {
        ctx.root.$message.error(response.message ?? '提交失败');
      }

      query.reload();

      return response.success;
    };

    const onReverseAuditBtnClick = (row: any) => {
      reverseAuditDialogRef.value?.open(row.reverse_reason, (is_pass, reverse_back_reason) =>
        onReverseAuditConfirm(row.achievement_id, is_pass, reverse_back_reason),
      );
    };

    const rowClick = (row: any) => {
      // dialog.show(row);
      Confirm({
        title: '确认审核通过吗?',
        confirmText: '通过',
        cancelText: '不通过',
        showClose: true,
      })
        .then(() => {
          // this.submit(false, '撤销目标');
          AuditDepositReceviedWriteOffReq(row.achievement_id, 1);
        })
        .catch(() => {
          AuditDepositReceviedWriteOffReq(row.achievement_id, 0);
        });
    };
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      table: {
        border: true,
        rowClick(row: any, column: any) {
          // if (column.label === '操作') return;
          // dialogRecruitmentFeedback.show(row, true);
        },
      },
    };
    return {
      reverseAuditDialogRef,
      onReverseAuditBtnClick,
      reverseAuditLoading,
      rowClick,
      query,
      config,
      statusVerificationOption,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      tableData,
      verificationColumns,
      // dialog,
    };
  },
  render() {
    const columns = this.verificationColumns(this);
    return (
      <ListGenerallyTemplate
        columns={columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="项目名称：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.project_name}
            placeholder="请输入项目名称"
            v-key-enter={this.query}
          />
        </el-form-item>
        <el-form-item label="业务类型：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.business_type}
            class="prepay-select"
            placeholder="请选择业务类型"
            style="width: 100%"
          >
            <el-option label="全部" value={undefined} key={undefined}></el-option>
            {this.projectTypeOption
              .filter(el => el.value !== 1)
              .map((el, index) => {
                return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
              })}
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.audit_status}
            class="prepay-select"
            placeholder="请选择审核状态"
            style="width: 100%"
          >
            <el-option label="全部" value={undefined} key={undefined}></el-option>
            {this.statusVerificationOption
              // .filter(el => el.value !== 1)
              .map((el, index) => {
                return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
              })}
          </el-select>
        </el-form-item>
        <div slot="middle">
          <reverseAuditDialog ref="reverseAuditDialogRef" />
          <tg-mask-loading visible={this.reverseAuditLoading} content="正在提交，请稍候..." />
        </div>
      </ListGenerallyTemplate>
    );
  },
});
