import { defineComponent, ref, set } from '@vue/composition-api';
// import DepartmentTree from '@/modules/design/order/workbench/modules/department_tree';
import { useRequest } from '@gm/hooks/ahooks';
import { GetFeishuDepartmentList } from '@/services/live';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      department_name: undefined,
      department_ids: undefined,
    } as any);
    const formRef = ref<IFormRef>();
    const treeRef = ref<any>();
    const show = (value: any) => {
      console.log(value, 'vvvv');
      set(formData.value, 'department_ids', value);
      treeRef.value?.setCheckedKeys(value);
      setTimeout(() => {
        selectedNodes.value = treeRef.value?.getCheckedNodes() || [];
        // console.log(treeRef.value?.getCheckedNodes(), 'selectedNodes111');
      }, 800);
      // nextTick(() => {
      //   selectedNodes.value = treeRef.value?.getCheckedNodes() || [];
      //   console.log(selectedNodes.value, 'selectedNodes');
      // });
    };
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', formData.value.department_ids);
        }
      });
    };

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

    const resetDepartmentIds = (nodes: any[]) => {
      set(
        formData.value,
        'department_ids',
        nodes.map((el: any) => el.open_department_id),
      );
    };
    const reqFeishuDep = useRequest(GetFeishuDepartmentList, {
      transform(res) {
        return res.data;
      },
    });
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      selectedNodes,
      removeSubNode,
      resetDepartmentIds,
      treeRef,
      reqFeishuDep,
    };
  },
  render() {
    return (
      <div class="dialog-container" style="padding: 40px 32px 60px 14px;">
        <el-form
          size="small"
          ref="formRef"
          hide-required-asterisk={true}
          attrs={{
            model: this.formData,
          }}
          label-width="86px"
        >
          {/* <el-form-item
            label="选择部门："
            prop="department_id"
            rules={{ required: true, message: `请选择部门`, trigger: 'blur' }}
          >
            <DepartmentTree v-model={this.formData} />
          </el-form-item> */}
          <el-form-item
            label="员工部门："
            prop="department_ids"
            rules={{ required: true, message: `请选择部门`, trigger: 'change' }}
          >
            <el-popover
              placement="bottom-start"
              trigger="click"
              popper-class="marketing-department-tree-popper-class el-tree-popper-mini"
            >
              <div slot="reference" class="repain-select" style="display: block">
                <el-input
                  // value={this.formData.department_id_input}
                  value={this.selectedNodes.length ? ' ' : undefined}
                  style="color: var(--placeholder-color)"
                  size="mini"
                  placeholder="请选择所属部门"
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
                      ></i>
                    </span>
                    {this.selectedNodes.length > 1 && (
                      <span>+ {this.selectedNodes.length - 1}</span>
                    )}
                  </div>
                )}
              </div>
              <div class="department-tree" style="overflow: auto;">
                <el-tree
                  ref="treeRef"
                  props={{
                    props: {
                      label: 'name',
                      children: 'sons',
                    },
                  }}
                  // check-strictly="true"
                  node-key="id"
                  data={this.reqFeishuDep.data}
                  show-checkbox
                  style="max-height: 300px;"
                  oncheck={() => {
                    const selectedNodes = (this.treeRef as any).getCheckedNodes() || [];
                    this.selectedNodes = this.removeSubNode(selectedNodes);
                    this.resetDepartmentIds(selectedNodes);
                    // set(
                    //   formData,
                    //   'feishu_department_id_list',
                    //   selectedNodes.map((el: any) => el.id).join(','),
                    // );
                    // this.treeRef?.setCheckedKeys([]);
                    // if (node.name !== formData.department_id_input) {
                    //   this.treeRef?.setCheckedKeys([node.id]);
                    //   set(formData, 'department_id_input', node.name);
                    //   set(formData, 'feishu_department_id_list', this.eachDemp(node, []));
                    // } else {
                    //   set(formData, 'department_id_input', '');
                    //   set(formData, 'feishu_department_id_list', '');
                    // }
                  }}
                />
              </div>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
