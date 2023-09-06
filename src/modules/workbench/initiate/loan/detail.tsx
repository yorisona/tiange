/**
 * 用款审批单详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 10:38:31
 */
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { UpdateApprovalStatus } from '@/services/workbentch';
import ApprovalFlow from '@/modules/workbench/approvalFlow.vue';
import { ExportApprovalInfoPDF } from '@/services/workbench/workbench';

export default defineComponent({
  name: 'TgLoanDetailModal',
  filters: {
    filter_business_type(val: number) {
      switch (val) {
        case 1:
          return '营销业务';
        case 2:
          return '淘宝店播';
        case 3:
          return '抖音店播';
        case 7:
          return '本地生活';
        case 8:
          return '淘宝甄选';
        case 9:
          return '供应链';
        default:
          return val;
      }
    },
    filter_price(val: any) {
      if (!val) return '--';
      return `￥${val.toFixed(2)}`;
    },
    filter_cost_type(val: any) {
      //成本类型 {1: '人员工资', 2: '主播服务费', 3: '固定资产采购', 4: '水电', 5: '装修', 6: '房租'}
      switch (val) {
        case 1:
          return '人员工资';
        case 2:
          return '主播服务费';
        case 3:
          return '固定资产采购';
        case 4:
          return '水电';
        case 5:
          return '装修';
        case 6:
          return '房租';
        default:
          return val;
      }
    },
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    approval: {
      type: Object as PropType<ApprovalInfo>,
    },
  },
  components: { ApprovalFlow },
  mounted(): void {
    //
  },
  setup(props, ctx) {
    const customerVisible = ref(true);
    /** 审批-拒绝 */
    const approvalDialogVisible = ref(false);
    /** 备注 */
    const remark = ref('');

    const currentUserInfo = computed(() => ctx.root.$store.getters['user/getUserInfo']);

    // 撤销和再次提交
    // 判断是否是本人
    const revocationVisiable = computed(() => currentUserInfo.value?.id === props.approval?.add_by);

    // 能否撤销
    const canICancel = computed(
      () => revocationVisiable.value && props.approval?.approval_status === 1,
    );

    // 同意和拒绝权限
    // 是否当前审批人
    const btnVisiable = computed(() => currentUserInfo.value?.id === props.approval?.now_id);

    const canIAudit = computed(() => btnVisiable.value && props.approval?.approval_status === 1);

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

    // 抛出关闭事件
    const emitClose = () => ctx.emit('dialog:close');

    // 再次提交
    const again = () => {
      ctx.emit('loan:edit');
    };

    return {
      step_status,
      customerVisible,
      approvalDialogVisible,
      remark,
      currentUserInfo,
      emitClose,
      revocationVisiable,
      btnVisiable,
      canICancel,
      canIAudit,
      again,
    };
  },
  methods: {
    // updateInfo(val: any) {
    //   // 子组件保存后触发父组件刷新
    //   if (val) {
    //     (this.$parent as any).handleSearch();
    //   }
    // },
    // 导出PDF
    exportPdf() {
      if (this.approval?.approval_id) {
        ExportApprovalInfoPDF(this.approval?.approval_id);
      }
    },
    // 撤销
    async revocation() {
      const result = await new Promise(resolve => {
        this.$TDialog({
          title: '你确定撤销吗',
          onConfirm: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });

      if (!result) {
        return;
      }

      const payload = {
        approval_id: this.approval?.approval_id as number,
        update_code: 4,
      };

      UpdateApprovalStatus(payload).then(res => {
        if (res && res.data && res.data.success) {
          this.emitClose();
          this.$message.success('保存成功');
          this.remark = '';
          this.$emit('reload:loan');
        } else {
          this.$message.error('保存失败');
        }
      });
    },
    // 同意弹框
    agree() {
      this.$TDialog({
        title: '你确定同意该申请吗',
        confirmText: '同意',
        cancelText: '取消',
        onConfirm: () => {
          const payload = {
            approval_id: this.approval?.approval_id as number,
            update_code: 2,
          };
          //调用更新接口
          UpdateApprovalStatus(payload).then(res => {
            if (res && res.data && res.data.success) {
              this.emitClose();
              this.$message.success('保存成功');
              this.remark = '';
              // (this.$parent as any).handleSearch();
            } else {
              this.$message.error('保存失败');
            }
          });
        },
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
            this.emitClose();
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
