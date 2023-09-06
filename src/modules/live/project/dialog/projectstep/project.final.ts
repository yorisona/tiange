/*
 * @Author: 矢车
 * @Date: 2021-01-11 09:59:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-21 13:52:39
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段 - 项目完结
 */
import { reactive, toRefs, defineComponent } from '@vue/composition-api';
import { enumEndHandleType, enumEndType } from '@/utils/enumFunc';
import { postEndProject, postEndMcnProject } from '@/api/shop.project';
// import { useJump } from '../../use/jump';
import { ElForm } from 'element-ui/types/form';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  emit: ['getDetail'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    IsMcn: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const data = reactive({
      // 需提交的表单数据
      form: {
        id: parseInt(ctx.root.$route.params.id, 10),
        end_type: '',
        end_handle_type: 1,
        end_handle_detail: '',
        end_time: undefined,
      },
      // 表单规则
      rules: {
        end_type: [{ required: true, message: '请输入执行结果', trigger: 'change' }],
        end_handle_type: [{ required: true, message: '请选择终止处理', trigger: 'change' }],
        end_handle_detail: [{ required: true, message: '请输入处理方案', trigger: 'blur' }],
        end_time: [{ required: true, message: '请选择完结时间', trigger: 'change' }],
      },
    });

    // 提交表单校验
    const submitForm = (formName: string) => {
      (ctx.refs[formName] as ElForm).validate(async (valid: boolean) => {
        if (valid) {
          const { end_time, end_handle_type, end_handle_detail, end_type, id } = data.form;
          if (props.IsMcn) {
            const res = await postEndMcnProject({
              end_handle_detail,
              end_handle_type,
              end_type: String(end_type) === '3' ? undefined : end_type,
              execute_end: String(end_type) === '3' ? 1 : undefined,
              id,
              end_time: (end_time ?? 0) / 1000,
            });
            if (res.data.success) {
              ctx.root.$message({
                type: 'success',
                message: '保存成功',
              });
              ctx.emit('ProjectFinalStep:close');
              // useJump({}, ctx).jump({
              //   id: parseInt(ctx.root.$route.params.id, 10),
              //   liveType: ctx.root.$route.params.liveType,
              //   tab: ctx.root.$route.params.tab,
              // });
              ctx.emit('getDetail');
            } else {
              ctx.root.$message({
                type: 'error',
                message: res.data.message,
              });
            }
          } else {
            const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
            const res = await postEndProject(
              {
                end_handle_detail,
                end_handle_type,
                end_type: String(end_type) === '3' ? undefined : end_type,
                execute_end: String(end_type) === '3' ? 1 : undefined,
                id,
                end_time: (end_time ?? 0) / 1000,
              },
              isFromSupplyChain.value
                ? E.project.BusinessType.supplyChain
                : isFromLocalLife.value
                ? E.project.BusinessType.locallife
                : E.project.BusinessType.douyin,
            );
            if (res.data.success) {
              ctx.root.$message({
                type: 'success',
                message: '保存成功',
              });
              ctx.emit('ProjectFinalStep:close');
              // useJump({}, ctx).jump({
              //   id: parseInt(ctx.root.$route.params.id, 10),
              //   liveType: ctx.root.$route.params.liveType,
              //   tab: ctx.root.$route.params.tab,
              // });
              ctx.emit('getDetail');
            } else {
              ctx.root.$message({
                type: 'error',
                message: res.data.message,
              });
            }
          }
        } else {
          return false;
        }
      });
    };

    // 清除表单数据
    const resetForm = () => {
      data.form.id = parseInt(ctx.root.$route.params.id, 10);
      data.form.end_type = '';
      data.form.end_handle_type = 1;
      data.form.end_handle_detail = '';
      data.form.end_time = undefined;
    };

    // 关闭 dialog 回调
    const closeDialog = () => {
      resetForm();

      ctx.emit('ProjectFinalStep:close');
    };

    return {
      ProjectStatusEnum,
      ...toRefs(data),
      enumEndHandleType,
      enumEndType,
      closeDialog,
      resetForm,
      submitForm,
    };
  },
});
