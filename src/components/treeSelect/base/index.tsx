import { computed, defineComponent, PropType, ref, watch } from '@vue/composition-api';
// @ts-ignore
import clickoutside from 'element-ui/src/utils/clickoutside';

const arrowIconClass = 'arrow-icon';
const arrowIconRotateClass = 'rotate';
export interface NodeProps {
  /** 指定节点标签为节点对象的某个属性值，默认 label */
  label: string;
  /** 指定子树为节点对象的某个属性值，默认 children */
  children: string;
}

const initTreeProps = () => ({ label: 'label', children: 'children' });

export default defineComponent({
  directives: {
    clickoutside,
  },
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
    /** 数据源 */
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
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
    /** 是否在点击节点的时候选中节点 */
    checkOnClickNode: {
      type: Boolean,
      default: () => false,
    },
    /** 多选时，展示的标签方法回调，默认展示所有选择的标签，checkedNodes当前选择的节点数据列表 */
    mulDisplayTagsFn: {
      type: Function as PropType<(checkedNodes: any[]) => any[]>,
    },
    /** 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的，默认 id */
    nodeKey: {
      type: String,
      default: () => 'id',
      required: true,
    },
    defaultExpandedKeys: {
      type: Array as PropType<string[] | number[]>,
      default: () => [],
    },
    /** 节点配置选项 */
    props: {
      type: Object as PropType<NodeProps>,
      default: () => initTreeProps(),
    },
  },
  setup(props, ctx) {
    const visible = ref(false);
    const computedValues = computed(() => {
      if (props.selectMultiple) {
        return props.value ? [...(props.value as [])] : [];
      }
      return props.value ? [props.value as any] : [];
    });
    const treeData = computed<any[]>(() => props.data);
    const treeRef = ref<{
      setCheckedKeys: (val: any[]) => void;
      getCheckedNodes: () => any[];
      getCheckedKeys: () => any[];
      setChecked: (arg1: any, checked: boolean, deep: boolean) => void;
    }>();

    const methods = {
      popoverShow() {
        const container = document.querySelector('.tg-tree-select-container');
        const width = container?.clientWidth || 220;
        const popover = document.querySelector('.tg-tree-select-popover') as HTMLElement;
        if (popover) {
          popover.style.minWidth = `${width}px`;
        }

        const arrow = document.querySelector(`.${arrowIconClass}`);
        if (arrow) {
          // arrow.className += ` ${arrowIconRotateClass}`;
          arrow.classList.add(`${arrowIconRotateClass}`);
        }
      },
      popoverHide() {
        const arrow = document.querySelector(`.${arrowIconClass}`);
        if (arrow) {
          arrow.classList.remove(`${arrowIconRotateClass}`);
        }
      },
      onCheck(newNode: any, checked: boolean) {
        if (!props.selectMultiple) {
          if (checked) {
            const nodeVal = newNode[props.nodeKey];
            treeRef.value?.setCheckedKeys([nodeVal]);
          }
        }
        methods.emitCheck();
      },
      emitCheck() {
        const newVal = props.selectMultiple
          ? treeRef.value?.getCheckedKeys() || []
          : (treeRef.value?.getCheckedKeys() || [])[0];
        ctx.emit('check', newVal);
      },
      clearChecked() {
        treeRef.value?.setCheckedKeys([]);
      },
      getCheckedNodes() {
        return treeRef.value?.getCheckedNodes() || [];
      },
    };

    watch(
      () => props.value,
      () => {
        methods.clearChecked();
      },
    );

    return {
      visible,
      computedValues,
      treeRef,
      treeData,
      ...methods,
    };
  },
  render() {
    const selectedInfo = this.treeRef?.getCheckedNodes() || [];
    const { props, selectMultiple, mulDisplayTagsFn, placeholder, clearable } = this;
    const treeProps = { ...initTreeProps(), ...props };
    const labelKey = treeProps.label;
    // input框展示的文案，单选显示选中的节点，多选不显示
    const displayText = !selectMultiple
      ? selectedInfo[0]?.[labelKey]
      : selectedInfo.length
      ? ' '
      : undefined;
    // 多选时，展示的标签列表
    const mulDisplayTags = mulDisplayTagsFn ? mulDisplayTagsFn(selectedInfo) : selectedInfo;
    return (
      <div class="tg-tree-select-container" vClickoutside={() => (this.visible = false)}>
        <el-popover
          placement="bottom-start"
          append-to-body={false}
          v-model={this.visible}
          trigger="click"
          on-show={this.popoverShow}
          on-hide={this.popoverHide}
          popper-class="el-tree-popper-mini tg-tree-select-popover"
        >
          <div slot="reference" class="tree-select-reference">
            <el-input
              size="mini"
              value={displayText}
              style="color: var(--placeholder-color)"
              placeholder={placeholder}
              readonly
            >
              <div
                slot="suffix"
                class="input-suffix"
                clearable={(this.computedValues || []).length > 0 && clearable}
              >
                <i class={`${arrowIconClass} el-icon-arrow-down`} />
                <i
                  class="close-icon el-icon-circle-close"
                  on-click={(event: MouseEvent) => {
                    this.clearChecked();
                    this.emitCheck();
                    event.stopPropagation();
                  }}
                />
              </div>
            </el-input>
            {selectMultiple && mulDisplayTags.length > 0 && (
              <div class="tree-select-tags">
                <span>
                  <span class="line-clamp-1" style="max-width: 88px;">
                    {mulDisplayTags[0][labelKey]}
                  </span>
                  <i
                    class="el-icon-close"
                    on-click={(event: MouseEvent) => {
                      const deleteNode = mulDisplayTags.shift();
                      this.treeRef?.setChecked(deleteNode[this.nodeKey], false, true);
                      // this.treeRef?.setCheckedKeys(mulDisplayTags.map(el => el[this.nodeKey]));
                      this.emitCheck();
                      event.stopPropagation();
                    }}
                  ></i>
                </span>
                {mulDisplayTags.length > 1 && <span>+ {mulDisplayTags.length - 1}</span>}
              </div>
            )}
          </div>
          <div class="tree-container">
            <el-tree
              ref="treeRef"
              props={{
                props: treeProps,
              }}
              check-strictly={!selectMultiple}
              node-key={this.nodeKey}
              data={this.treeData}
              show-checkbox
              on-check-change={this.onCheck}
              default-checked-keys={this.computedValues}
              default-expanded-keys={this.defaultExpandedKeys}
              check-on-click-node={this.checkOnClickNode}
            ></el-tree>
          </div>
        </el-popover>
      </div>
    );
  },
});
