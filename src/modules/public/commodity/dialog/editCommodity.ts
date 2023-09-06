import { defineComponent, reactive, ref, watch } from '@vue/composition-api';
import { GetQueryDouyinReportProjects, GetCategories, UpdateCommodity } from '@/services/public';
import { ElForm } from 'element-ui/types/form';
import { quarterList } from '../index';
import { CommodityBase } from '@/types/tiange/public';
import inputLimit from '@/utils/inputLimit';
type CatBase = {
  cat_id: number;
  cat_name: string;
  sub_categories?: any;
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
      required: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const formRef = ref<ElForm | null>(null);
    const form = reactive<CommodityBase>({
      id: '',
      project_id: '',
      project_name: '',
      item_id: '',
      item_sn: '',
      year: '',
      season: '',
      first_tiange_cat_id: '',
      first_tiange_cat_name: '',
      third_tiange_cat_id: '',
      third_tiange_cat_name: '',
      target_sale_count: '',
      is_key: 0,
    });
    /** 重置表单 */
    const resetForm = () => {
      form.id = '';
      form.project_id = '';
      form.project_name = '';
      form.item_id = '';
      form.item_sn = '';
      form.first_tiange_cat_id = '';
      form.first_tiange_cat_name = '';
      form.third_tiange_cat_id = '';
      form.third_tiange_cat_name = '';
      form.year = '';
      form.season = '';
    };

    const formRules = ref<any>({
      project_id: [{ required: true, message: '请输入并选择项目', trigger: ['blur', 'change'] }],
      item_id: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
      first_tiange_cat_id: [
        { required: true, message: '请选择自定义一级类目', trigger: ['blur', 'change'] },
      ],
      third_tiange_cat_id: [
        { required: true, message: '请选择自定义三级类目', trigger: ['blur', 'change'] },
      ],
      year: [{ required: true, message: '请选择年度', trigger: ['blur', 'change'] }],
      season: [{ required: true, message: '请选择季度', trigger: ['blur', 'change'] }],
      is_key: [{ required: true, message: '请选择是否重点', trigger: ['blur'] }],
    });

    watch(
      () => props.visible,
      newVal => {
        if (newVal) {
          if (props.item.id) {
            form.id = props.item.id;
            form.project_id = props.item.project_id;
            form.project_name = props.item.project_name;
            form.item_id = props.item.item_id;
            form.item_sn = props.item.item_sn;
            form.first_tiange_cat_name = props.item.first_tiange_cat_name;
            form.first_tiange_cat_id = props.item.first_tiange_cat_id;
            form.third_tiange_cat_name = props.item.third_tiange_cat_name;
            form.third_tiange_cat_id = props.item.third_tiange_cat_id;
            form.year = props.item.year + '';
            form.season = props.item.season;
            form.is_key = props.item.is_key;
            form.target_sale_count = props.item.target_sale_count;
            getFirstCatList();
          }
        } else {
          formRef.value?.resetFields();
          resetForm();
        }
      },
    );

    /** 项目名称列表 */
    const projectList = ref<{ project_id: number; project_name: string }[]>([]);
    const getProjectList = async (project_name: string) => {
      if (!project_name) {
        return;
      }
      const params = {
        project_name,
      };
      const { data: response } = await GetQueryDouyinReportProjects(params);
      if (response.success) {
        projectList.value = response.data.projects;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    const onProjectIdChange = (id: number) => {
      form.project_id = id;
    };

    /** 公司名称搜索 */
    const firstCatList = ref<CatBase[]>([]);
    const thirdCatList = ref<CatBase[]>([]);

    const getFirstCatList = async () => {
      const { data: response } = await GetCategories();
      if (response.success) {
        firstCatList.value = response.data;
        const catOne = firstCatList.value.filter(item => {
          return item.cat_id === form.first_tiange_cat_id;
        });
        thirdCatList.value = catOne[0].sub_categories;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const onFirstCatChange = async (cat_id: number) => {
      form.first_tiange_cat_id = cat_id;
      form.third_tiange_cat_id = '';
      form.third_tiange_cat_name = '';
      const catOne = firstCatList.value.filter(item => {
        return item.cat_id === cat_id;
      });
      thirdCatList.value = catOne[0].sub_categories;
    };

    const onThirdCatChange = (cat_id: number) => {
      form.third_tiange_cat_id = cat_id;
    };

    const methods = {
      onClose: () => {
        resetForm();
        ctx.emit('update:visible', false);
      },
      onSave: async () => {
        const isValid = await new Promise(resolve =>
          formRef.value?.validate(pass => resolve(pass)),
        );
        if (!isValid) {
          return;
        }
        const params = {
          id: form.id,
          project_id: form.project_id,
          item_id: form.item_id,
          item_sn: form.item_sn,
          year: form.year,
          season: form.season,
          first_tiange_cat_id: form.first_tiange_cat_id,
          third_tiange_cat_id: form.third_tiange_cat_id,
          is_key: form.is_key,
          target_sale_count: form.target_sale_count,
        };
        saveLoading.value = true;
        const res = await UpdateCommodity(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '修改成功');
          resetForm();
          ctx.emit('save');
          ctx.emit('update:visible', false);
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败，请稍候重试');
        }
      },
    };

    const formatInterger = (val: any) => {
      form.target_sale_count = inputLimit.Interger(val);
    };

    return {
      form,
      formRef,
      formRules,
      saveLoading,
      firstCatList,
      onFirstCatChange,
      getFirstCatList,
      ...methods,
      projectList,
      getProjectList,
      onProjectIdChange,
      quarterList,
      thirdCatList,
      onThirdCatChange,
      formatInterger,
    };
  },
});
