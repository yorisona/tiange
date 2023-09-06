import { defineComponent, onMounted, ref, computed, inject } from '@vue/composition-api';
import { RouterNameDesign } from '@/const/router';
import step1 from './modules/step1.vue';
import delivery from './modules/delivery.vue';
import taskAssignmentDialog from './modules/taskAssignmentDialog.vue';
import { useDialog } from '@/use/dialog';
import { Confirm } from '@/use/asyncConfirm';
import opinionDialog from './modules/opinionDialog.vue';
import {
  Query_Design_Order_Detail,
  Set_Design_Order_distribution,
  Set_Design_Order_refuse,
  Set_Design_cancel,
  Set_Design_order_confirm,
} from '@/services/design';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import upload from './modules/upload.vue';

export default defineComponent({
  components: {
    step1,
    delivery,
    opinionUpload: upload,
  },
  setup: (props, ctx) => {
    const loading = ref(false);
    const order_id = ref<string>('');
    order_id.value = ctx.root.$route.query.order_id as string;
    // order_id.value = '1';
    const routes = [
      {
        name:
          ctx.root.$route.path.indexOf('workbench') >= 0
            ? RouterNameDesign.workbench.design_order_list
            : RouterNameDesign.design_order_list,
        title: '视觉设计',
      },
      {
        path: '',
        title: '视觉设计明细',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    /* 活动取消 */
    const eventCancellation = () => {
      Confirm('是否确定活动取消？').then(() => {
        loading.value = true;
        Set_Design_cancel({
          order_id: order_id.value,
        }).then(res => {
          loading.value = false;
          if (res.data.error_code === 0) {
            loadData();
            ctx.root.$message.success(res.data.message ?? '取消成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '取消失败');
          }
        });
      });
    };
    /* 确认完成 */
    const confirmCompletion = () => {
      Confirm('是否确定活动完成？').then(() => {
        loading.value = true;
        Set_Design_order_confirm({
          order_id: order_id.value,
        }).then(res => {
          loading.value = false;
          if (res.data.error_code === 0) {
            loadData();
            ctx.root.$message.success(res.data.message ?? '保存成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '保存失败');
          }
        });
      });
    };
    /* 任务分配 */
    const dialogTask = useDialog({
      component: taskAssignmentDialog,
      title: '任务分配',
      width: '340px',
      on: {
        submit: async (v: any) => {
          loading.value = true;
          Set_Design_Order_distribution({
            order_id: order_id.value,
            ...v,
          }).then(res => {
            loading.value = false;
            if (res.data.error_code === 0) {
              loadData();
              ctx.root.$message.success(res.data.message ?? '分配成功');
            } else {
              ctx.root.$message.error(res.data.message ?? '分配失败');
            }
            dialogTask.close();
          });
          // submit(message, type);
        },
      },
    });
    const clickRedistribution = () => {
      dialogTask.show({
        executor_name: info.value.executor_name,
        executor: info.value.executor,
        re_distribute: true,
        delivery_time: info.value.delivery_time,
        level: info.value.design_level_id,
      });
    };
    /* 审核意见 */
    const dialogOpinon = useDialog({
      component: opinionDialog,
      title: '拒绝原因',
      width: '320px',
      on: {
        submit: async ({ message }: any) => {
          loading.value = true;
          Set_Design_Order_refuse({
            order_id: order_id.value,
            refuse_comment: message,
          }).then(res => {
            loading.value = false;
            if (res.data.error_code === 0) {
              loadData();
              ctx.root.$message.success(res.data.message ?? '拒绝成功');
            } else {
              ctx.root.$message.error(res.data.message ?? '拒绝失败');
            }
            dialogOpinon.close();
          });
          // submit(message, type);
        },
      },
    });
    const info = ref<any>({});
    const getInfoProperty = (property: string) => {
      if (property === 'project_type') {
        if (info.value?.delivery_attachment?.length > 0) {
          const set = new Set();
          info.value.delivery_attachment.forEach((item: any) => {
            set.add(item.design_type_name);
          });
          return Array.from(set).join('、');
          // return info.value.delivery_attachment
          //   .map((item: any) => item.design_type_name)
          //   .join('、');
        } else {
          return '--';
        }
      }
      if (property === 'addition_attachment' || property === 'delivery_attachment') {
        if (info.value?.design_type_detail_list?.length > 0) {
          const temporary = new Map();
          info.value[property].forEach((v: any) => {
            if (v.name === '其他') return;
            if (temporary.has(v.design_type_name)) {
              temporary.get(v.design_type_name).push(v.name);
            } else {
              temporary.set(v.design_type_name, [v.name]);
            }
          });
          return Array.from(temporary).map((v: any) => {
            return `${v[0]}：${v[1].join('、')}`;
          });
          // const type = info.value.design_type_detail_list.map((item: any) => {
          //   return { name: item.design_type.name, value: [] };
          // });
          // info.value[property].forEach((v: any) => {
          //   type.forEach((item: any) => {
          //     if (item.name === v.design_type_name) {
          //       item.value.push(v.name);
          //     }
          //   });
          // });
          // return type.map((item: any) => {
          //   return `${item.name}：${item.value.join('、')}`;
          // });
        } else {
          return [];
        }
      }
      return info.value[property] ?? '--';
    };
    const getContent = (v: string) => {
      try {
        return JSON.parse(v);
      } catch (error) {
        return [];
      }
    };
    const getColor = new Map([
      ['待接单', '#FB8500'],
      ['已接单', '#2877FF'],
      ['内审中', '#FFB703'],
      ['内审通过', '#2877FF'],
      ['内审不通过', '#ED3434'],
      ['初稿审核中', ' #FFB703'],
      ['初稿审核通过', '#2877FF'],
      ['初稿审核不通过', '#ED3434'],
      ['终稿审核中', '#FFB703'],
      ['终稿审核通过', '#2877FF'],
      ['终稿审核不通过', '#ED3434'],
      ['已交付', '#2877FF'],
      ['已完成', '#20BF55'],
      ['已拒绝', '#ED3434'],
      ['已取消', '#888888'],
    ]);
    const getBgColor = new Map([
      ['待接单', '#FFF7F3'],
      ['已接单', '#F2F7FF'],
      ['内审中', '#FEFAF0'],
      ['内审通过', '#F2F7FF'],
      ['内审不通过', '#FDF1F1'],
      ['初稿审核中', ' #FEFAF0'],
      ['初稿审核通过', '#F2F7FF'],
      ['初稿审核不通过', '#FDF1F1'],
      ['终稿审核中', '#FEFAF0'],
      ['终稿审核通过', '#F2F7FF'],
      ['终稿审核不通过', '#FDF1F1'],
      ['已交付', '#F2F7FF'],
      ['已完成', '#F0FAF3'],
      ['已拒绝', '#FDF1F1'],
      ['已取消', '#F6F6F6'],
    ]);
    const loadData = () => {
      const isWorkbench = /workbench/.test(ctx.root.$route.fullPath);
      Query_Design_Order_Detail(order_id.value, isWorkbench).then(res => {
        if (res.data.error_code === 0) {
          info.value = res.data.data;
          // console.log(getColor.get(getInfoProperty('status_name')));
        }
      });
    };
    onMounted(async () => {
      loadData();
    });
    /** 权限检查 */
    const TERMINATION_STATUS_CODE = [610, 620];
    const Permission = computed(() => {
      /* 分配or拒绝 */
      const distribution = info.value.status === 0 && HasPermission(RIGHT_CODE.design_order_allot);
      /* 重新分配 */
      const redistribution =
        info.value.assigner &&
        HasPermission(RIGHT_CODE.design_order_allot) &&
        !info.value?.audit_finish;
      /* 是否进入交付阶段 */
      const delivery = info.value?.audit_finish;
      /* 活动取消 */
      const eventCancellation =
        !TERMINATION_STATUS_CODE.includes(info.value.status) &&
        HasPermission(RIGHT_CODE.cancel_design_order);
      /* 活动确认 */
      const complete_design_order =
        info.value.status === 400 && HasPermission(RIGHT_CODE.complete_design_order);
      return { distribution, delivery, eventCancellation, complete_design_order, redistribution };
    });
    // console.log(Permission, 'redistribution');
    return {
      loading,
      order_id,
      info,
      getInfoProperty,
      routes,
      dialogTask,
      eventCancellation,
      dialogOpinon,
      confirmCompletion,
      loadData,
      getContent,
      getColor,
      getBgColor,
      Permission,
      clickRedistribution,
    };
  },
});
