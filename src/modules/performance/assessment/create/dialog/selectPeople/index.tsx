import { defineComponent, ref, computed, onMounted } from '@vue/composition-api';
import { Feishu_Department_and_User_List } from '@/services/performance';
import { isEmpty } from '@/utils/func';
import { Message } from 'element-ui';

interface ITransFormDepartment extends Feishu.IDepartmentAndUser {
  nodeType: number;
  nodeId: string;
  real_name: string;
}
export default defineComponent({
  setup(props, ctx) {
    const formData = ref<NPerformance.IEvaluationGroup>();
    const visible = ref(false);
    const selected = ref<ITransFormDepartment[]>([]);
    const treeData = ref<ITransFormDepartment[]>([]);
    const treeRef = ref<ITreeRef>();
    const searchValue = ref('');
    const AllMember = ref(0);
    const hasCheckAll = computed(() => {
      if (AllMember.value === 0) return false;
      if (selected.value.length === AllMember.value) return true;
      return false;
    });
    let defaultSelect: number[] = [];

    const show = (value: { user_id: number }[]) => {
      if (value) {
        defaultSelect = value.map(t => t.user_id);
      }
    };
    // 转换数据结构,变成树组件可用状态
    const transformDepartment = (node: ITransFormDepartment) => {
      node.nodeType = 1;
      node.nodeId = node.department_id;
      const sons = node.sons?.map(t => t);
      node.user_list?.forEach(item => {
        node.sons?.unshift({
          nodeType: 2,
          nodeId: item.id,
          name: item.username,
          real_name: item.real_name,
        } as any);
      });
      sons?.forEach(transformDepartment as any);
      return node;
    };
    onMounted(() => {
      Feishu_Department_and_User_List()
        .then(res => {
          if (!res.data.success) return;
          const _data: any[] = [];
          let allMember = 0;
          res.data.data.data.forEach(item => {
            allMember += item.member_count;
            const newItem = transformDepartment(item as any);
            _data.push(newItem);
          });
          treeData.value = _data;
          AllMember.value = allMember;
        })
        .then(() => {
          if (defaultSelect.length > 0) {
            defaultSelect.forEach(item => {
              treeRef.value?.setChecked(item, true);
            });
          }
        });
    });

    const onCheck = (value: ITransFormDepartment, isSelect: boolean) => {
      if (isSelect) {
        if (value.nodeType === 2) {
          selected.value.push(value);
        }
      } else {
        const index = selected.value.findIndex(t => t.nodeId === value.nodeId);
        if (index !== -1) {
          selected.value.splice(index, 1);
        }
      }
    };
    const clearSelect = () => {
      selected.value.forEach(item => {
        treeRef.value?.setChecked(item.nodeId, false);
      });
      selected.value = [];
    };

    const dialogSubmit = () => {
      if (selected.value.length === 0) {
        Message.error('请选择考核人员');
        return;
      }
      ctx.emit(
        'submit',
        selected.value.map(item => {
          return {
            real_name: item.real_name,
            username: item.name,
            user_id: item.nodeId,
          };
        }),
      );
      ctx.emit('close');
    };

    return {
      dialogSubmit,
      show,
      formData,
      visible,
      selected,
      treeData,
      onCheck,
      treeRef,
      searchValue,
      hasCheckAll,
      AllMember,
      clearSelect,
    };
  },
  render() {
    const { selected } = this;
    return (
      <div class="dialog-container">
        <div class="select-box">
          <el-input
            class="mgb-24"
            size="mini"
            placeholder="请输入花名查找"
            v-model={this.searchValue}
            onInput={() => {
              this.treeRef?.filter(this.searchValue);
            }}
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <el-tree
            ref="treeRef"
            data={this.treeData}
            node-key="nodeId"
            show-checkbox={true}
            render-after-expand={false}
            onCheck-change={this.onCheck}
            filter-node-method={(value: string, data: ITransFormDepartment) => {
              if (isEmpty(value)) return true;
              return data.name.indexOf(value) !== -1;
            }}
            render-content={(h: any, { data }: { data: ITransFormDepartment }) => {
              if (data.nodeType === 2) {
                return <span>{data.name}</span>;
              }
              return (
                <span>
                  {data.name} <span class="people-count">（{data.member_count}人）</span>
                </span>
              );
            }}
            props={{
              props: {
                label: 'name',
                children: 'sons',
              },
            }}
          />
        </div>
        <div class="select-box">
          <div class="selected-info">
            <span>已选：{this.selected.length} 个考核人员</span>
            <a onclick={this.clearSelect}>清空选中</a>
          </div>
          <div class="selected-people">
            <div class="selected-people-list">
              {selected.map((item, index) => {
                return (
                  <span key={index}>
                    {item.name}
                    <i
                      class="el-input__icon el-icon-close"
                      onclick={() => {
                        this.selected.splice(index, 1);
                        this.treeRef?.setChecked(item.nodeId, false);
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
