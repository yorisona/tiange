/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-13 13:11:29
 */
import { defineComponent, ref } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import moment from 'moment';
import UseSealApply from '@/modules/workbench/dialog/useSealApply/index.vue';
import finishProject from '@/modules/live/project/dialog/finishProject/index.vue';

import {
  SealTypeMap,
  UseSealBusinessMap,
  UseSealCompanyMap,
  UseSealMatterMap,
} from '@/types/tiange/workbench';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { update_use_seal } from '@/services/legal';
import { useDialog } from '@/use/dialog';
export default defineComponent({
  name: 'InvoiceRedDetailDialog',
  props: {
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
    UseSealApply,
  },
  setup(props, ctx) {
    const edit = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const baseData = ref<any>(undefined);

    const dialogFinishProject = useDialog({
      title: '项目完结',
      width: 428,
      okText: '提交',
      component: finishProject,
      on: {
        submit() {
          reClose();
        },
      },
    });

    // const useSealApplyRef = ref<UseSealApplyType | undefined>(undefined);

    // 抛出关闭事件
    const emitClose = () => {
      visible.value = false;
      ctx.emit('close');
    };

    const show = (data: any) => {
      baseData.value = data;
      console.log(data, 'data');

      visible.value = true;
    };

    const reSubmit = async () => {
      dialogFinishProject.show(
        baseData.value.approval_detail?.project_id,
        baseData.value.approval_detail,
      );
      // useSealApplyRef.value?.show(baseData.value);
    };

    const reClose = () => {
      emitClose();
      ctx.emit('success');
    };

    const task_out_date_str = (data: any) => {
      if (data) {
        const format = 'yyyy.MM.DD';
        const start_moment = moment(data.take_out_start_date * 1000).format(format);
        const end_moment = moment(data.take_out_end_date * 1000).format(format);
        return `${start_moment}~${end_moment}`;
      }
      return '--';
    };
    const amount = (data: any) => {
      if (data) {
        const amount_involved = data.amount_involved >= 0 ? data.amount_involved : '--';
        return formatAmountWithoutPrefix(amount_involved);
      }
      return '--';
    };

    const seal_name = (data: any) => {
      if (data && data.seal_type) {
        return SealTypeMap.get(data.seal_type) ?? '--';
      }
      return '--';
    };

    const endTypeStr = () => {
      const end_str =
        baseData.value?.approval_detail?.end_type === 1
          ? '正常结束'
          : baseData.value?.approval_detail?.end_type === 2
          ? '意外终止'
          : '--';
      return end_str;
    };

    const company_name = (data: any) => {
      if (data && data.company_name_code) {
        return UseSealCompanyMap.get(data.company_name_code) ?? '--';
      }
      return '--';
    };

    const matter_name = (data: any) => {
      if (data && data.matter_type) {
        return UseSealMatterMap.get(data.matter_type) ?? '--';
      }
      return '--';
    };

    const business_type_name = (data: any) => {
      if (data && data.business_type) {
        return UseSealBusinessMap.get(data.business_type) ?? '--';
      }
      return '--';
    };

    const onSuccess = () => {
      reClose();
    };
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
        console.log(baseData.value);
        (baseData as any).value.scan?.push(res.data.source);
        const data = await update_use_seal({
          approval_id: (baseData as any).value.approval_id,
          scans: (baseData as any).value.scan,
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
          approval_id: (baseData as any).value.approval_id,
          scans: (baseData as any).value.scan.filter((item1: any) => item1 !== item.link),
        });
        if (data.data.error_code === 0) {
          (baseData as any).value.scan = (baseData as any).value.scan.filter(
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
      visible,
      emitClose,
      numberFormat,
      edit,
      reSubmit,
      baseData,
      reClose,
      show,
      moment,
      // useSealApplyRef,
      seal_name,
      company_name,
      matter_name,
      business_type_name,
      task_out_date_str,
      amount,
      onSuccess,
      endTypeStr,
      ...method,
    };
  },
});
