/**
 * 退款申请表单弹窗
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 17:39:09
 */
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { UpdateApprovalStatus } from '@/services/workbentch';
import ApprovalFlow from '@/modules/workbench/approvalFlow';
import { ExportApprovalInfoPDF } from '@/services/workbench/workbench';

export default defineComponent({
  name: 'refundDetail',
  props: {
    visible: {
      type: Boolean,
    },
    approval: {
      type: Object as PropType<ApprovalInfo>,
    },
    commitAgainVisible: {
      type: Boolean,
      default: true,
    },
  },
  components: { ApprovalFlow },
  setup(props, ctx) {
    /** 步骤 */
    const step_status = computed(() => {
      if (props.approval === undefined) {
        return 0;
      } else if ([2, 3].includes(props.approval.approval_status ?? -1)) {
        return props.approval.steps + 1;
      } else {
        return props.approval.steps;
      }
    });

    const currentUserInfo = computed(() => ctx.root.$store.getters['user/getUserInfo']);

    /** 备注 */
    const remark = ref('');

    /** 撤销和再次提交 判断是否是本人 */
    const revocationVisiable = computed(() => currentUserInfo.value?.id === props.approval?.add_by);

    // 同意和拒绝权限
    const btnVisiable = computed(() => currentUserInfo.value?.id === props.approval?.now_id);

    // 再次提交
    const again = () => {
      ctx.emit('loan:edit');
    };

    return {
      step_status,
      customerVisible: true,
      // 审批-拒绝
      approvalDialogVisible: false,
      remark,
      currentUserInfo,
      revocationVisiable,
      btnVisiable,
      again,
    };
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('close');
    },
    // 导出PDF
    exportPdf() {
      if (this.approval?.approval_id) {
        ExportApprovalInfoPDF(this.approval?.approval_id);
      }
    },
    // 撤销
    revocation() {
      this.$confirm('你确定撤销吗', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const payload = {
            approval_id: this.approval?.approval_id as number,
            update_code: 4,
          };
          UpdateApprovalStatus(payload).then(res => {
            if (res && res.data && res.data.success) {
              this.close();
              this.$message.success('保存成功');
              this.remark = '';
              this.$emit('reload:refund');
            } else {
              this.$message.error('保存失败');
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    // 同意弹框
    agree() {
      this.$confirm('你确定同意该申请吗', '提示', {
        confirmButtonText: '同意',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'success-icon',
      })
        .then(() => {
          const payload = {
            approval_id: this.approval?.approval_id as number,
            update_code: 2,
          };
          //调用更新接口
          UpdateApprovalStatus(payload).then(res => {
            if (res && res.data && res.data.success) {
              this.close();
              this.$message.success('保存成功');
              // (this.$parent as any).handleSearch();
            } else {
              this.$message.error('保存失败');
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    // 拒绝按钮
    refuse() {
      this.approvalDialogVisible = true;
    },
    // 拒绝审批确定点击回调
    handleApprovalSubmitClick() {
      const payload = {
        approval_id: this.approval?.approval_id as number,
        update_code: 3,
        remark: this.remark,
      };

      UpdateApprovalStatus(payload)
        .then(res => {
          if (res && res.data && res.data.success) {
            this.approvalDialogVisible = false;
            this.close();
            this.$message.success('保存成功');
            this.remark = '';
            // (this.$parent as any).handleSearch();
          } else {
            this.$message.error('保存失败');
          }
        })
        .catch(() => {
          return false;
        });
    },
  },
});
