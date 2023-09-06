import { defineComponent, PropType, ref, watch } from '@vue/composition-api';
import { useRequest } from '@gm/hooks/ahooks';
import { GetFeishuDepartmentList } from '@/services/live';

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<{ name: string; id: string }[]>,
      default: () => [],
    },
    placeholder: {},
    'check-strictly': {
      type: Boolean,
    },
    // 是否能多选
    multiple: {
      type: Boolean,
      default: () => true,
    },
  },
  model: {
    prop: 'value',
  },
  setup(props, ctx) {
    const treeRef = ref<any>();
    const resetDepartmentIds = (nodes: any[]) => {
      ctx.emit('input', nodes.map((el: any) => el.id).join(','));
    };
    const reqFeishuDep = useRequest(GetFeishuDepartmentList, {
      transform(res) {
        return res.data;
      },
    });
    const selectedNodes = ref<any[]>([]);
    const removeSubNode = (nodes: any[]) => {
      const result: any[] = [];
      nodes.forEach(el => {
        const finder = nodes.find(subEl => el.parent_department_id === subEl.open_department_id);
        if (!finder) {
          result.push(el);
        }
      });
      return result;
    };
    watch(
      () => props.value,
      newValue => {
        // 如果数据清空了
        if (!newValue || newValue.length === 0) {
          const treeChecked = treeRef.value.getCheckedNodes() || [];
          selectedNodes.value = [];
          // 如果树组件还没有清空则清空一下
          if (treeChecked.length !== 0) {
            treeRef.value?.setCheckedNodes([]);
          }
        }
      },
    );
    return { selectedNodes, treeRef, resetDepartmentIds, reqFeishuDep, removeSubNode };
  },
  render() {
    return (
      <el-popover
        placement="bottom-start"
        trigger="click"
        popper-class="marketing-department-tree-popper-class  el-tree-popper-mini"
      >
        <div slot="reference" class="repain-select" style="display: block">
          <el-input
            value={this.selectedNodes.length ? ' ' : undefined}
            style="color: var(--placeholder-color)"
            placeholder={this.placeholder}
            readonly
          >
            <i class="select-icon select-icon-user-add el-icon-arrow-down" slot="suffix" />
          </el-input>
          {this.selectedNodes.length > 0 && (
            <div class="department-select-tags">
              <span>
                <span class="line-clamp-1" style="max-width: 88px;">
                  {this.selectedNodes[0].name}
                </span>
                <i
                  class="el-icon-close"
                  on-click={(event: MouseEvent) => {
                    this.selectedNodes.shift();
                    this.treeRef?.setCheckedKeys(this.selectedNodes.map(el => el.id));
                    const selectedNodes = (this.treeRef as any).getCheckedNodes() || [];
                    this.resetDepartmentIds(selectedNodes);
                    event.stopPropagation();
                  }}
                />
              </span>
              {/*{this.value.length > 1 && <span>+ {this.value.length - 1}</span>}*/}
              {this.selectedNodes.length > 1 && <span>+ {this.selectedNodes.length - 1}</span>}
            </div>
          )}
        </div>
        <div class="department-tree">
          <el-tree
            ref="treeRef"
            data={this.reqFeishuDep.data}
            check-strictly={this.checkStrictly}
            props={{
              props: {
                label: 'name',
                children: 'sons',
              },
            }}
            node-key="id"
            show-checkbox
            oncheck={(node: any, info: any) => {
              if (this.multiple) {
                const selectedNodes = (this.treeRef as any).getCheckedNodes() || [];
                this.selectedNodes = this.removeSubNode(selectedNodes);
                this.resetDepartmentIds(selectedNodes);
              } else {
                const hasSelected = info.checkedKeys.find((it: any) => it === node.id);
                for (let i = 0; i < info.checkedKeys.length; i++) {
                  (this.treeRef as any).setChecked(info.checkedKeys[i], false);
                }
                if (hasSelected) {
                  (this.treeRef as any).setChecked(node.id, true);
                }
                this.selectedNodes = hasSelected ? [node] : [];
                this.resetDepartmentIds(hasSelected ? [node] : []);
              }
            }}
          />
        </div>
      </el-popover>
    );
  },
});
