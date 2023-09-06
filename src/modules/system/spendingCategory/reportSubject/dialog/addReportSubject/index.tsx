import { defineComponent, ref, computed } from '@vue/composition-api';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { add_report_subject, MaycurListExpenseCategories } from '@/services/maycur';
import { ElTree } from 'element-ui/types/tree';
import { Message } from 'element-ui';
export default defineComponent({
  setup(props, ctx) {
    const elTreeRef = ref<ElTree<any, any>>();
    const opType = ref<'add' | 'update'>('add');
    const show = (value: any) => {
      opType.value = value ? 'update' : 'add';
      formData.value.name = value?.subject_name;
      formData.value.old_subject_name = value?.subject_name;
      selected.value =
        value?.expense_type_objs?.map((subEl: any) => ({
          ...subEl,
          label: subEl.expense_type_name,
        })) || [];
      query();
    };
    const query = async () => {
      reqIndicators.runAsync(
        { num: 10000, page_num: 1 },
        {
          expense_category_name: filterFormData.value.expense_category_name,
          expense_type_name: filterFormData.value.expense_type_name,
        },
      );
    };
    // const formRef = ref<IFormRef>();
    const reqSaveTag = useRequest(add_report_subject, { manual: true });
    const treeExpandAll = ref(false);
    const onSaveBtnClick = async () => {
      if (!formData.value.name) {
        Message.warning('请输入管报科目名称');
        return;
      }
      if (!selected.value.length) {
        Message.warning('请关联费用类别');
        return;
      }
      const res = await reqSaveTag.runAsync(opType.value, {
        subject_name: formData.value.name,
        old_subject_name: formData.value.old_subject_name,
        expense_type_biz_codes: selected.value.map(el => el.expense_type_biz_code),
      });
      if (res.data.success) {
        Message.success(res.data.message);
        ctx.emit('submit');
        ctx.emit('close');
      } else {
        Message.error(res.data.message);
      }
    };
    const filterFormData = ref<any>({
      expense_type_name: undefined,
      expense_category_name: undefined,
    });
    const formData = ref<any>({
      name: undefined,
      old_subject_name: undefined,
    });
    // 会计科目列表
    const reqIndicators = usePagination(MaycurListExpenseCategories, {
      manual: true,
      onSuccess() {
        treeExpandAll.value =
          !!filterFormData.value.expense_type_name || !!filterFormData.value.expense_category_name;
      },
    });
    const selectedHistory = ref<any[]>([]);
    const selected = ref<any[]>([]);
    const filter = query;
    const defaultTreeProps = {
      children: 'children',
      label: 'label',
    };
    const treeData = computed(() => {
      return (reqIndicators.data || []).map(el => ({
        ...el,
        label: el.expense_category_name,
        children:
          el.expense_type_objs?.map(subEl => ({
            ...subEl,
            label: subEl.expense_type_name,
          })) || [],
      }));
    });
    const defaultCheckedKeys = computed(() => selected.value.map(el => el.key));
    const defaultexpandedKeys = computed(() => {
      if (treeExpandAll.value) {
        return (
          treeData.value?.map(el => el.expense_type_objs?.map(obj => obj.key) || []).flat() || []
        );
      }
      return defaultCheckedKeys.value;
    });

    const onTreeNodeCheck = (nodeData: any, { checkedNodes }: any) => {
      selected.value = checkedNodes.filter((el: any) => el.key.indexOf('-') !== -1);
    };

    return {
      onSaveBtnClick,
      show,
      reqSaveTag,
      filterFormData,
      formData,
      // formRef,
      reqIndicators,
      selected,
      selectedHistory,
      filter,
      defaultTreeProps,
      treeData,
      elTreeRef,
      onTreeNodeCheck,
      defaultCheckedKeys,
      defaultexpandedKeys,
    };
  },
  render() {
    const { defaultTreeProps, defaultCheckedKeys, defaultexpandedKeys, treeData } = this;
    return (
      <div class="page-container">
        <div class="mgl-18 mgt-16 mgb-16">
          <span>管报科目名称：</span>
          <el-input
            size="mini"
            placeholder="请输入管报科目名称"
            v-model={this.formData.name}
            style="width: 222px"
            clearable
          />
        </div>
        <el-form
          inline
          size="mini"
          hide-required-asterisk={true}
          // ref="formRef"
          // attrs={{
          //   model: this.filterFormData,
          // }}
        >
          <div class="filter-header">关联费用类别</div>
          <div class="filter-items mgt-12">
            <el-form-item label="会计科目：">
              <el-input
                v-key-enter={this.filter}
                placeholder="请输入会计科目"
                v-model={this.filterFormData.expense_category_name}
                style="width:100%"
                clearable
              />
            </el-form-item>
            <el-form-item label="费用类别：">
              <el-input
                v-key-enter={this.filter}
                placeholder="请输入费用类别"
                v-model={this.filterFormData.expense_type_name}
                style="width:100%"
                clearable
              />
            </el-form-item>
            <tg-button type="primary" onClick={this.filter}>
              查询
            </tg-button>
          </div>
        </el-form>
        <div class="content-box" v-loading={this.reqIndicators.loading}>
          <div class="library-box">
            <el-tree
              ref="elTreeRef"
              data={treeData}
              show-checkbox
              node-key="key"
              default-expanded-keys={defaultexpandedKeys}
              default-checked-keys={defaultCheckedKeys}
              onCheck={this.onTreeNodeCheck}
              props={defaultTreeProps}
            ></el-tree>
          </div>
          <div class="select-box">
            <div class="selected-info">
              <span>已选：{this.selected.length} 个费用类别</span>
              <a
                onclick={() => {
                  this.selected = [];
                  this.elTreeRef?.setCheckedNodes([]);
                }}
              >
                清空选中
              </a>
            </div>
            <div class="selected-people">
              <div class="selected-people-list">
                {this.selected.map((item, index) => {
                  return (
                    <span key={item.expense_type_biz_code}>
                      {item.label}
                      <i
                        class="el-input__icon el-icon-close"
                        onclick={() => {
                          this.selected.splice(index, 1);
                          this.elTreeRef?.setCheckedNodes(this.selected);
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <tg-mask-loading visible={this.reqSaveTag.loading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
