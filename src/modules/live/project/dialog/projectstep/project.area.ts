/*
 * @Author: 矢车
 * @Date: 2021-01-11 09:59:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-03 12:57:58
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段 - 区域执行
 */
import {
  ref,
  Ref,
  reactive,
  toRefs,
  onMounted,
  defineComponent,
  inject,
} from '@vue/composition-api';
import { getCompanyName, postCompanyName } from '@/api/shop.project';
import { ElForm } from 'element-ui/types/form';
import { LiveProject } from '@/types/tiange/live.project';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const project =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    const data = reactive({
      // 需提交的表单数据
      form: {
        id: parseInt(ctx.root.$route.params.id, 10),
        supplier_company_id: undefined,
      } as { id: number; supplier_company_id: number | undefined },
      list_companyInfo: [],
      // 表单规则
      rules: {
        supplier_company_id: [
          { required: true, message: '请输入搜索区域合作公司', trigger: 'change' },
        ],
      },
    });

    onMounted(() => {
      getCompanyNameAndId();
    });

    // 获取所有公司名和id
    const getCompanyNameAndId = async () => {
      const res = await getCompanyName(data.form);
      if (res.data.success) {
        data.list_companyInfo = res.data.data;
      } else {
        ctx.root.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    };
    const { business_type } = useProjectBaseInfo();
    //  提交表单校验
    const submitForm = (formName: string) => {
      (ctx.refs[formName] as ElForm).validate(async (valid: boolean) => {
        if (valid) {
          const res = await postCompanyName(data.form, business_type.value);
          if (res.data.success) {
            ctx.root.$message({
              type: 'success',
              message: '保存成功',
            });
            ctx.emit('ProjectAreaStep:close');
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
      if (project.value?.supplier_company_id) {
        data.form.supplier_company_id = project.value.supplier_company_id;
      } else {
        data.form.supplier_company_id = undefined;
      }
    };

    // 关闭 dialog 回调
    const closeDialog = () => {
      resetForm();

      ctx.emit('ProjectAreaStep:close');
    };

    if (project.value?.supplier_company_id) {
      data.form.supplier_company_id = project.value.supplier_company_id;
    }

    return {
      ...toRefs(data),
      getCompanyNameAndId,
      closeDialog,
      resetForm,
      submitForm,
    };
  },
});
