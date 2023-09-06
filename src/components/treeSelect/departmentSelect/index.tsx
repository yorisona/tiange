import { GetFeishuDepartmentList } from '@/services/live';
import { useRequest } from '@gm/hooks/ahooks';
import { defineComponent, PropType, ref, watch } from '@vue/composition-api';

export default defineComponent({
  model: {
    prop: 'value',
    event: 'check',
  },
  props: {
    /** 选中的节点值,多选为数组；单选为非数组 */
    value: {
      type: Object as PropType<Array<any> | String | Number>,
      default: () => undefined,
    },
    /** 是否多选，默认 false */
    selectMultiple: {
      type: Boolean,
      default: () => false,
    },
    /** 占位显示文案 */
    placeholder: {
      type: String,
      default: () => '请选择',
    },
    /** 是否可清空，默认 false */
    clearable: {
      type: Boolean,
      default: () => false,
    },
    /** 默认展开的节点数组，默认为空 */
    defaultExpandedKeys: {
      type: Array as PropType<string[] | number[]>,
      default: () => [],
    },
    /** 一级是否可选，默认为 false */
    // firstLevelDisabled: {
    //   type: Boolean,
    //   default: () => false,
    // },
    queryForm: {
      type: Object as any,
    },
    /** 禁用层级 */
    // disabledLevel: {
    //   type: Number,
    //   default: () => 0,
    // },
    levelDisabled: {
      type: Function as PropType<(level: number) => boolean>,
      default: () => false,
    },
    levelHidden: {
      type: Function as PropType<(level: number, node: any) => boolean>,
      default: () => false,
    },
    /** 是否在点击节点的时候选中节点 */
    checkOnClickNode: {
      type: Boolean,
      default: () => false,
    },
    /** 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的，默认 id */
    nodeKey: {
      type: String,
      default: () => 'id',
      required: true,
    },
  },
  setup(props, ctx) {
    const treeSelectRef = ref<any>();
    const methods = {
      onCheck(newVal: any) {
        if (props.selectMultiple) {
          dataForm.value.department_ids = newVal;
        } else {
          dataForm.value.department_id = newVal;
        }
        ctx.emit('check', newVal);
      },
      mulDisplayTagsFn(nodes: any[]) {
        const result: any[] = [];
        nodes.forEach(el => {
          const finder = nodes.find(subEl => el.parent_department_id === subEl.open_department_id);
          if (!finder) {
            result.push(el);
          }
        });
        return result;
      },
      getCheckedNodes() {
        return treeSelectRef.value?.getCheckedNodes();
      },
    };
    const dataForm = ref<{
      department_id?: number;
      department_ids: number[];
    }>({
      department_id: !props.selectMultiple ? (props.value as number) : undefined,
      department_ids: props.selectMultiple ? (props.value ? (props.value as []) : []) : [],
    });
    const processedData = (data: any[]): any => {
      return data
        .filter(el => !props.levelHidden(el.level, el))
        .map((node: any) => {
          return {
            ...node,
            disabled: props.levelDisabled(node.level),
            sons: props.levelHidden(node.level + 1, null)
              ? undefined
              : node.sons
              ? processedData(node.sons)
              : undefined,
          };
          // if (node.level <= level) {
          //   // 如果节点属于禁用层级，则将其禁用
          // return {
          //   ...node,
          //   disabled: true,
          //   sons: node.sons ? processedData(node.sons, level) : undefined,
          // };
          // } else {
          //   // 否则，返回原始节点数据
          //   return {
          //     ...node,
          //     sons: node.sons ? processedData(node.sons, level) : undefined,
          //   };
          // }
        });
    };
    const reqFeishuDep = useRequest(GetFeishuDepartmentList, {
      transform(res) {
        const data = res.data || [];
        // const level = props.firstLevelDisabled ? 1 : props.disabledLevel;
        return processedData(data);
      },
      defaultParams: props.queryForm ? [props.queryForm] : [],
    });
    /*reqProject.runAsync({
      exclude_project_status: [5, 6],
    });*/

    watch(
      () => [props.value, props.selectMultiple],
      () => {
        if (props.selectMultiple) {
          dataForm.value.department_ids = props.value ? (props.value as []) : [];
        } else {
          dataForm.value.department_id = props.value as number;
        }
      },
    );

    return {
      treeSelectRef,
      dataForm,
      reqFeishuDep,
      ...methods,
    };
  },
  render() {
    const {
      selectMultiple,
      placeholder,
      clearable,
      reqFeishuDep,
      dataForm,
      onCheck,
      mulDisplayTagsFn,
      nodeKey,
    } = this;
    return (
      <tree-select
        ref="treeSelectRef"
        clearable={clearable}
        selectMultiple={selectMultiple}
        placeholder={placeholder}
        value={selectMultiple ? dataForm.department_ids : dataForm.department_id}
        on-check={onCheck}
        nodeKey={nodeKey}
        // v-model={selectMultiple ? dataForm.department_ids : dataForm.department_id}
        data={reqFeishuDep.data}
        default-expanded-keys={this.defaultExpandedKeys}
        mulDisplayTagsFn={selectMultiple ? mulDisplayTagsFn : undefined}
        checkOnClickNode={this.checkOnClickNode}
        props={{
          props: {
            label: 'name',
            children: 'sons',
          },
        }}
      ></tree-select>
    );
  },
});
