/*
 * @Author: 矢车
 * @Date: 2021-01-11 09:59:58
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-22 16:22:55
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段 - 项目试播
 */
import { reactive, toRefs, defineComponent } from '@vue/composition-api';
import { postUpdataProjectTryLive } from '@/api/shop.project';
import { useJump } from '../../use/jump';
import { ElForm } from 'element-ui/types/form';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    const data = reactive({
      // 需提交的表单数据
      form: {
        id: parseInt(ctx.root.$route.params.id, 10),
        try_live_end_date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      },
      // 表单规则
      rules: {
        try_live_end_date: [{ required: true, message: '请选择试播结束时间', trigger: 'change' }],
      },
    });

    //  提交表单校验
    const submitForm = (formName: string) => {
      (ctx.refs[formName] as ElForm).validate(async (valid: boolean) => {
        if (valid) {
          const res = await postUpdataProjectTryLive(
            data.form,
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
            ctx.emit('ProjectTrailStep:close');
            if (!isFromLocalLife.value) {
              useJump({}, ctx).jump({
                id: parseInt(ctx.root.$route.params.id, 10),
                liveType: ctx.root.$route.params.liveType,
                tab: ctx.root.$route.params.tab,
              });
            }

            ctx.emit('getDetail');
          } else {
            ctx.root.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    };

    // 清除表单数据
    const resetForm = () => {
      data.form.id = parseInt(ctx.root.$route.params.id, 10);
      data.form.try_live_end_date = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`;
    };

    // 关闭 dialog 回调
    const closeDialog = () => {
      resetForm();

      ctx.emit('ProjectTrailStep:close');
    };

    return {
      ...toRefs(data),
      closeDialog,
      resetForm,
      submitForm,
    };
  },
});
