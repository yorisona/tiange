import { defineComponent, computed, watch, ref, PropType } from '@vue/composition-api';
import { Design_Order_Details } from '../../useOrder';
// import { RouterNameDesign } from '@/const/router';
import opinionDialog from './opinionDialog.vue';
import auditFailedDialog from './auditFailedDialog.vue';
import historicalAuditRecordsDialog from './historicalAuditRecordsDialog.vue';
import { useDialog } from '@/use/dialog';
import { Confirm } from '@/use/asyncConfirm';
import upload from './upload.vue';
import { UserInfo } from '@/types/tiange/system';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import {
  Set_Design_Order_add_comment,
  Set_Design_Order_approved_review,
  Set_Design_Order_failed_review,
  Set_Design_Order_add_attachment,
  Set_Design_Order_del_attachment,
  Set_Design_Order_start_review,
} from '@/services/design';

type attachment = {
  file_name: string;
  url: string;
};

export default defineComponent({
  name: 'opinionStep1',
  components: {
    opinionUpload: upload,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    allData: {
      type: Object as PropType<Design_Order_Details>,
      default: () => ({}),
    },
    showMask: {
      type: Boolean,
    },
    order_id: {
      type: String,
      default: '',
    },
    is_last_step: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const fileList = ref<string[]>([]);
    // const fileList = computed<string[]>(() => {
    //   return props.data.attachment.map((item: attachment) => item.url);
    // });
    // onMounted(() => {
    //   if (props.data.attachment && props.data.attachment.length > 0) {
    //     fileList.value = props.data.attachment.map((item: attachment) => item.url);
    //     // console.log(fileList.value, 'fileList');
    //   }
    // });
    watch(
      () => props.data.attachment,
      () => {
        fileList.value = props.data.attachment.map((item: attachment) => item.url);
        // console.log(fileList.value, 'fileList');
      },
      {
        immediate: true,
      },
    );
    const getInfoProperty = (property: string, v: any) => {
      if (property === 'time') {
        return v.replace(/-/g, '.');
      }
      return props.data[property] ?? '无';
    };
    /* 审核意见 */
    const dialogOpinon = useDialog({
      component: opinionDialog,
      title: '审核意见',
      width: '320px',
      on: {
        submit: async ({ type, message }: any) => {
          console.log('type', type, message);
          ctx.emit('update:showMask', true);
          Set_Design_Order_add_comment({
            order_id: props.order_id,
            comment: message,
          }).then(res => {
            ctx.emit('update:showMask', false);
            if (res.data.error_code === 0) {
              ctx.emit('change');
              ctx.root.$message.success(res.data.message ?? '保存成功');
            } else {
              ctx.root.$message.error(res.data.message ?? '保存失败');
            }
            dialogOpinon.close();
          });
          // submit(message, type);
        },
      },
    });
    /* 发起审核 */
    const initiateAnAudit = () => {
      Confirm('是否确定发起审核？').then(() => {
        ctx.emit('update:showMask', true);
        Set_Design_Order_start_review({
          order_id: props.order_id,
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            ctx.emit('change');
            ctx.root.$message.success(res.data.message ?? '审核通过');
          } else {
            ctx.root.$message.error(res.data.message ?? '审核失败');
          }
        });
      });
    };
    /* 审核通过 */
    const approved = () => {
      Confirm('是否确定审核通过？').then(() => {
        ctx.emit('update:showMask', true);
        Set_Design_Order_approved_review({
          order_id: props.order_id,
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            ctx.emit('change');
            ctx.root.$message.success(res.data.message ?? '审核通过');
          } else {
            ctx.root.$message.error(res.data.message ?? '审核失败');
          }
        });
      });
    };
    /* 审核不通过 */
    const dialogAuditFailed = useDialog({
      component: auditFailedDialog,
      title: '审核结果',
      width: '320px',
      on: {
        submit: async ({ comment }: any) => {
          ctx.emit('update:showMask', true);
          Set_Design_Order_failed_review({
            order_id: props.order_id,
            audit_comment: comment,
          }).then(res => {
            ctx.emit('update:showMask', false);
            if (res.data.error_code === 0) {
              ctx.emit('change');
              ctx.root.$message.success(res.data.message ?? '保存成功');
            } else {
              ctx.root.$message.error(res.data.message ?? '保存失败');
            }
            dialogAuditFailed.close();
          });
        },
      },
    });

    /* 历史审核记录 */
    const HISTORICAL_AUDIT_RECORDS = {
      dialogAuditRecords: useDialog({
        component: historicalAuditRecordsDialog,
        title: '历史审核记录',
        width: '580px',
        okText: '确定',
        on: {
          submit: async () => {
            console.log('this', window);
            HISTORICAL_AUDIT_RECORDS.dialogAuditRecords.close();
          },
        },
      }),
    };
    /* 上传or删除附件 */
    const changeUpload = (type: 'add' | 'delete', file = '') => {
      console.log(file, 'file');
      if (type === 'add') {
        ctx.emit('update:showMask', true);
        Set_Design_Order_add_attachment({
          order_id: props.order_id,
          attachment_url_list: [file], //接口需要数组
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            fileList.value.push(file);
            ctx.root.$message.success(res.data.message ?? '上传成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '上传失败');
          }
        });
      } else if (type === 'delete') {
        ctx.emit('update:showMask', true);
        Set_Design_Order_del_attachment({
          order_id: props.order_id,
          attachment_url: file,
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            fileList.value = fileList.value.filter(item => item !== file);
            ctx.root.$message.success(res.data.message ?? '删除成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '删除失败');
          }
        });
      }
    };
    /** 权限检查 */
    const underReview = [200, 210, 220];
    const Permission = computed(() => {
      const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];
      /* 审核发起 */
      const initiateAnAudit =
        !underReview.includes(props.allData.status) &&
        user.id === props.allData.executor &&
        fileList.value.length > 0 &&
        props.is_last_step &&
        !props.allData.audit_finish; //不为审核结束
      /* 上传附件 */
      const uploadAttachments =
        !underReview.includes(props.allData.status) &&
        user.id === props.allData.executor &&
        props.is_last_step &&
        !props.allData.audit_finish;
      /* 审核意见 */
      const auditOpinion =
        underReview.includes(props.allData.status) &&
        props.is_last_step &&
        HasPermission(RIGHT_CODE.design_order_audit_opinion);
      /* 审核通过or不通过 */
      const passOrNotPass =
        underReview.includes(props.allData.status) &&
        props.is_last_step &&
        HasPermission(RIGHT_CODE.design_order_audit);
      return { initiateAnAudit, auditOpinion, passOrNotPass, uploadAttachments };
    });
    console.log(underReview.includes(props.allData.status) && props.is_last_step, 'Permission');
    return {
      fileList,
      dialogOpinon,
      approved,
      dialogAuditFailed,
      getInfoProperty,
      changeUpload,
      initiateAnAudit,
      Permission,
      ...HISTORICAL_AUDIT_RECORDS,
    };
  },
});
