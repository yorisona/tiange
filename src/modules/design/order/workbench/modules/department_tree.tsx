import { ref, defineComponent, h, onMounted, PropType, computed } from '@vue/composition-api';
import { FeiShuDepartment } from '@/types/tiange/live';
import { GetFeishuDepartmentList } from '@/services/live';
import { FormType } from '@/modules/design/order/useOrder';
import './department_tree.less';

export default defineComponent({
  name: 'department_tree',
  props: {
    /* id及部门名称字段 */
    value: Object as PropType<FormType>,
  },
  setup(props, ctx) {
    // 部门
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);
    const formData = computed<Pick<FormType, 'department_name' | 'department_id'>>(() => {
      return {
        department_name: props.value?.department_name ?? undefined,
        department_id: props.value?.department_id ?? undefined,
      };
    });
    const DEPARTMENT_TREE_METHOD = {
      async getFeishuDepartmentList(_ = false) {
        const res = await GetFeishuDepartmentList({
          // root_department_name: '品牌',
        });
        if (res.data.success) {
          const list = res.data.data.data;
          // departmentFilterDisabled(list, true, 3);
          feishuDepartmentList.value = list;
          // if (isMounted) {
          //   const finder = methods.getDPRuningDepartment(feishuDepartmentList.value);
          //   formData.value.department_id = finder?.id;
          //   formData.value.department_name = finder?.name;
          //   if (formData.value.department_id) {
          //     department_tree.value?.setCheckedKeys([formData.value.department_id]);
          //   }
          // }
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      ondepartmentCleaar(event: any) {
        department_tree.value?.setCheckedKeys([]);
        formData.value.department_id = undefined;
        formData.value.department_name = undefined;
        ctx.emit('input', { ...props.value, ...formData.value });
        if (event) {
          event.stopPropagation();
        }
      },
      handleCheckChange: (data: FeiShuDepartment) => {
        department_tree.value?.setCheckedKeys([]);
        if (formData.value.department_id === data.id) {
          formData.value.department_id = undefined;
          formData.value.department_name = undefined;
        } else {
          formData.value.department_id = data.id;
          formData.value.department_name = data.name;
          ctx.emit('input', { ...props.value, ...formData.value });
          department_tree.value?.setCheckedKeys([data.id]);
        }
      },
    };
    onMounted(async () => {
      DEPARTMENT_TREE_METHOD.getFeishuDepartmentList(false);
    });
    return {
      ...DEPARTMENT_TREE_METHOD,
      feishuDepartmentList,
      department_tree,
      formData,
    };
  },
  render() {
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    return (
      <div class="department_tree">
        <el-popover
          placement="bottom-start"
          trigger="click"
          width="370"
          popper-class="pending-pay-detail-tree-popper el-tree-popper-mini"
        >
          <div
            slot="reference"
            class="department-tree-select"
            style="display: block; cursor: pointer;"
          >
            {this.formData.department_name && (
              <div class="depart-select-box">
                <span style="height: var(--default-height); line-height: var(--default-height);overflow:hidden">
                  {this.formData.department_name}
                </span>
                <i
                  style="
                    margin-top: 8px;
                    color: white;
                    font-size: var(--small-font-size);
                  "
                  class="el-icon-circle-close"
                  onClick={this.ondepartmentCleaar}
                ></i>
              </div>
            )}
            {!this.formData.department_name && (
              <div class="depart-select-box">
                <span style="color: var(--disabled-color); height: var(--default-height); line-height: var(--default-height);overflow:hidden">
                  请选择下单部门
                </span>
                <i
                  style="margin-top: 8px; color: var(--disabled-color);font-size: var(--small-font-size);"
                  class="el-icon-arrow-down"
                ></i>
              </div>
            )}
          </div>
          <div class="department-tree">
            <el-tree
              ref="department_tree"
              props={{
                props: treeProps,
              }}
              check-strictly={true}
              node-key="id"
              data={this.feishuDepartmentList}
              show-checkbox
              check-on-click-node
              // default-expand-all
              // default-checked-keys="default_checked_department_ids"
              default-expanded-keys={
                this.formData.department_id ? [this.formData.department_id] : []
              }
              on-check={this.handleCheckChange}
            ></el-tree>
          </div>
        </el-popover>
        <li style="display: none" class="controlPopoverHide"></li>
      </div>
    );
  },
});
