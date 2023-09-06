import { defineComponent, ref } from '@vue/composition-api';
import { FeiShuDepartment } from '@/types/tiange/live';
import { GetFeishuDepartmentList } from '@/services/live';
import { departmentFilterDisabled } from '@/utils/filter';
import { Query_Design_Type_Department, Save_Department_Setting_Form } from '@/services/design';
import { ElTree } from 'element-ui/types/tree';
import { sleep } from '../../../../utils/func';
import { FunctionSelect, EFunctionSelectType } from '@gm/component/select/FunctionSelect';
type query_form = {
  feishu_department_id: number | string | undefined;
  feishu_department_name: string;
  label?: string;
  assigner_ids: string[];
};
type option_form = {
  id: number;
  name: string;
  department_id?: number;
};

export default defineComponent({
  components: { FunctionSelect },
  name: 'departmentSetting',
  setup(props, ctx) {
    const queryForm = ref<query_form[]>([
      {
        feishu_department_id: undefined,
        feishu_department_name: '',
        label: '',
        assigner_ids: [],
      },
    ]);
    const department_list = ref<option_form[]>([]);
    const Get_Design_Type_Department_List = async () => {
      const res = await Query_Design_Type_Department();
      if (res.data.success) {
        const list = res.data.data || [];
        queryForm.value = list.map((item: any) => {
          return {
            label: item.label,
            feishu_department_id: item.department_id,
            feishu_department_name: item.name,
            assigner_ids: item.assigner_info.map((it: any) => it.id),
            defaultValue: item.assigner_info.map((it: any) => {
              return { label: it.username, value: it.id } as TG.OptionType;
            }),
          };
        });
      }
    };
    Get_Design_Type_Department_List();

    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const getFeishuDepartmentList = async () => {
      const res = await GetFeishuDepartmentList();
      const list = res.data.data.data;
      //设置一级选项不让选择
      departmentFilterDisabled(list, false, 1);
      feishuDepartmentList.value = processedData(list);
    };
    const processedData = (data: any[]): any => {
      return data.map((node: any) => {
        return {
          ...node,
          disabled: node.level !== 3,
          sons: node.sons ? processedData(node.sons) : undefined,
        };
      });
    };
    getFeishuDepartmentList();
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    const cb_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);
    const handleCheckChange = (data: FeiShuDepartment, index: number) => {
      // cb_department_tree.value?.setCheckedKeys([]);
      if (data.id === queryForm.value[index].feishu_department_id) {
        queryForm.value[index].feishu_department_id = undefined;
        queryForm.value[index].feishu_department_name = '';
      } else {
        queryForm.value[index].feishu_department_id = data.id;
        queryForm.value[index].feishu_department_name = data.name;
        // cb_department_tree.value?.setCheckedKeys([data.id]);
      }
    };
    const default_checked_department_ids = (index: number) => {
      return queryForm.value[index].feishu_department_id
        ? [queryForm.value[index].feishu_department_id]
        : [];
    };
    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('close');
      ctx.emit('update:visible', false);
      ctx.emit('dialog:close', success);
    };
    const saveLoading = ref(false);
    // 提交form
    const handleDialogSubmit = async () => {
      const payload: any = {
        depertment_team_datas: queryForm.value
          .filter((item: query_form) => {
            return item.feishu_department_id;
          })
          .map((item: any) => {
            item.department_id = item.feishu_department_id;
            return item;
          }),
      };
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await Save_Department_Setting_Form(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('submit');
        emitClose();
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    const onAddDepartment = () => {
      queryForm.value.push({
        feishu_department_id: undefined,
        feishu_department_name: '',
        assigner_ids: [],
      });
    };
    const onDeleteDepartment = (index: number) => {
      queryForm.value.splice(index, 1);
    };
    return {
      department_list,
      saveLoading,
      onDeleteDepartment,
      onAddDepartment,
      emitClose,
      handleDialogSubmit,
      feishuDepartmentList,
      cb_department_tree,
      treeProps,
      handleCheckChange,
      default_checked_department_ids,
      queryForm,
      visible: false,
      modeType: EFunctionSelectType.FLOWER_NAME,
    };
  },
  methods: {
    // 提供给父组件使用，勿删
    show() {
      this.visible = true;
      this.$nextTick(() => {});
    },
    handleNewCheckChange(data: FeiShuDepartment, index: number) {
      const cb_department_tree: any = this.$refs['cb_department_tree' + index];
      if (cb_department_tree && cb_department_tree[0]) {
        cb_department_tree[0].setCheckedKeys([]);
      }
      if (data.id === this.queryForm[index].feishu_department_id) {
        this.queryForm[index].feishu_department_id = undefined;
        this.queryForm[index].feishu_department_name = '';
      } else {
        this.queryForm[index].feishu_department_id = data.department_id;
        this.queryForm[index].feishu_department_name = data.name;
        if (cb_department_tree && cb_department_tree[0]) {
          cb_department_tree[0].setCheckedKeys([data.department_id]);
        }
      }
    },
  },
});
