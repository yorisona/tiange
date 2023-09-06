import { defineComponent, onMounted, provide, ref } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import { UpdateApprovalStatus } from '@/services/workbentch';
import { sleep } from '@/utils/func';
import addSettlementDialog from '@/views/medium/components/addSettlementDialog.vue';
import NewAddSettlementDialog from '@/views/medium/components/newAddSettlementDialog.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import AddStatement from '@/modules/customer/contract/form/statement.vue';
import NewStatement from '@/modules/customer/contract/form/newStatement.vue';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { update_use_seal } from '@/services/legal';

export default defineComponent({
  name: 'advanceDetailDialog',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Appendix,
    WorkbenchTimeLine,
    addSettlementDialog,
    AddStatement,
    NewStatement,
    NewAddSettlementDialog,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const settlementDialogRef = ref<{ show(): void } | null>(null);
    const newSettlementDialogRef = ref<{ show(): void } | null>(null);
    const settlementDialogVisible = ref(false);
    const setNewtlementDialogVisible = ref(false);
    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('dialog:close', success);
    };
    const handleSubmit = async () => {
      const result = await new Promise(resolve => {
        ctx.root.$TDialog({
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
      saveLoading.value = true;
      const payload = {
        approval_id: props.info.approval_id,
        update_code: 4,
      };
      const [{ data: response }, _] = await Promise.all([
        await UpdateApprovalStatus(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        emitClose();
        ctx.emit('reload:refund', true);
        ctx.root.$message.success('撤销成功');
      } else {
        ctx.root.$message.error(response.message ?? '撤销失败');
      }
    };
    const showSettlementDialog = () => {
      settlementDialogRef.value?.show();
    };
    const confirmSettlementDialog = (val: any) => {
      settlementDialogVisible.value = false;
      setNewtlementDialogVisible.value = false;
      if (val) {
        emitClose();
        ctx.emit('reload:refund', true);
      }
    };
    const editData = ref({
      // 关联合同编号
      contract_no: undefined,
      // 合同编号
      partner_name: undefined,
      // 合同id
      contract_id: 11111111,
      // 审批金额
      approval_amount: undefined,
      // 申请内容
      comment: '',
      // 附件文件url，以英文","分隔
      attachment_url: '',
      project_id: '',
      // 结算情况
      settlement_detail: [
        {
          settle_amount: '', // 结算金额
          settle_way: 1, // 结算方式
          start_date: '', // 开始日期
          end_date: '', // 结束日期
          done_amount: '', // 已收金额/已付金额
          wait_amount: '', // 待收金额/待付金额
          invoice_amount: '', // 已开发票金额/已收发票金额
          remark: '', // 备注
          shop_name: '', // 店铺名称
          wangwang_num: '', // 旺旺号
        },
      ],
      isEdit: true,
    });
    const project_add_id = ref(undefined);
    const project = ref({
      brand_name: '',
      business_type: '',
      cooperation_name: '',
      project_name: '',
      id: '',
    });
    const contract = ref({
      contract_info: {
        id: '',
        partner_id: '',
        contract_uid: '',
      },
      partner_info: {
        partner_name: '',
      },
    });
    provide('project_add_id', project_add_id);
    provide('project', project);
    provide('contract', contract);
    const resubmit = async () => {
      const result = await AsyncConfirm(ctx, '你确定重新申请吗?');
      if (result) {
        console.log(props.info, project, contract, 'props.info?.approval_detail?.auto_create');

        if (props.info.approval_type === 9) {
          if (props.info?.approval_detail?.auto_create !== undefined) {
            setNewtlementDialogVisible.value = true;
          } else {
            settlementDialogVisible.value = true;
          }
        } else {
          if (props.info?.approval_detail?.auto_create !== undefined) {
            newSettlementDialogRef.value?.show();
          } else {
            // newSettlementDialogRef.value?.show();
            showSettlementDialog();
          }
        }
      }
    };
    onMounted(() => {
      editData.value = Object.assign({}, editData.value, {
        approval_type: props.info.approval_type,
        contract_id: props.info.contract_id,
        contract_no: props.info.contract_uid,
        partner_name: props.info.customer_name,
        partner_id: props.info.partner_id,
        approval_amount: props.info.approve_amount,
        comment: props.info.approval_content,
        attachment_url: props.info.attachment.join(','),
        business_type: props.info.business_type,
        project_id: props.info.project_id,
        contract_type: props.info.contract_type,
        settlement_detail: props.info.details.map((item: any) => {
          return {
            settle_amount: item.settle_amount,
            settle_way: item.settlement_way,
            start_date: item.start_date?.replace(/-/g, '.'),
            end_date: item.end_date?.replace(/-/g, '.'),
            done_amount: '',
            wait_amount: '',
            invoice_amount: '',
            remark: item.comment,
            shop_name: item.shop_name,
            wangwang_num: item.wangwang_name,
          };
        }),
      });
      contract.value = {
        contract_info: {
          id: props.info.contract_id,
          partner_id: props.info.partner_id,
          contract_uid: props.info.contract_uid,
        },
        partner_info: {
          partner_name: props.info.customer_name,
        },
      };
      project_add_id.value = props.info.project_id;
      project.value = Object.assign(
        {},
        {
          brand_name: props.info.brand_name,
          business_type: props.info.business_type,
          cooperation_name: props.info.project_name,
          project_name: props.info.project_name,
          id: props.info.project_id,
        },
      );
    });
    // 上传扫描件
    const method = {
      beforeUpload(config: any) {
        return ValidationFileUpload({
          doc: true,
          excel: true,
          pdf: true,
          image: true,
          fileSize: 20,
        })(config);
      },
      async scanSuccessHandle(res: { data: { source: string } }) {
        console.log(props.info);
        (props.info as any).scan?.push(res.data.source);
        const data = await update_use_seal({
          approval_id: (props.info as any).approval_id,
          scans: (props.info as any).scan,
        });
        console.log(data, 'data');

        if (data.data.error_code === 0) {
          ctx.root.$message.success('上传成功');
        } else {
          ctx.root.$message.error(data.data.message);
        }
      },
      async deleteItem(item: any) {
        const data = await update_use_seal({
          approval_id: (props.info as any).approval_id,
          scans: (props.info as any).scan.filter((item1: any) => item1 !== item.link),
        });
        if (data.data.error_code === 0) {
          (props.info as any).scan = (props.info as any).scan.filter(
            (item1: any) => item1 !== item.link,
          );
          ctx.root.$message.success('删除成功');
        } else {
          ctx.root.$message.error(data.data.message);
        }
        console.log(item);
      },
    };
    return {
      emitClose,
      numberFormat,
      saveLoading,
      handleSubmit,
      resubmit,
      settlementDialogRef,
      settlementDialogVisible,
      newSettlementDialogRef,
      setNewtlementDialogVisible,
      addSettlementDialog,
      confirmSettlementDialog,
      editData,
      ...method,
    };
  },
});
