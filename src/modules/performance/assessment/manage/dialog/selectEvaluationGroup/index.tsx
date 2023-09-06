import { defineComponent, ref, computed } from '@vue/composition-api';
import { Query_Evaluation_Group } from '@/services/performance';
import { usePagination } from '@gm/hooks/ahooks';
import { ECYCLE_TYPE, ECYCLE_TYPE_OPTIONS } from '@/const/performance';

export default defineComponent({
  setup: (_, ctx) => {
    const formData = ref({
      selectedAssess: [] as NPerformance.IEvaluationGroup[],
      currentCycleType: ECYCLE_TYPE.MONTHLY,
      name: '',
    });
    const reqEvalation = usePagination(Query_Evaluation_Group, {
      manual: true,
    });
    const filterData = computed(() => {
      const list = reqEvalation.data || [];
      // const searchKey = formData.value.searchKey;
      // if (isEmpty(searchKey)) return list;
      // return list.filter(item => {
      //   return item.name.indexOf(searchKey) !== -1;
      // });
      return list;
    });
    const checkAllStatus = computed(() => {
      let isIndeterminate = false;
      let allCheck = true;

      filterData.value.map(it => {
        const hasFind = formData.value.selectedAssess.some(it2 => it2.id === it.id);
        if (!hasFind) allCheck = false;
        if (hasFind) isIndeterminate = true;
      });
      if (filterData.value.length === 0) {
        isIndeterminate = false;
        allCheck = false;
      } else {
        if (allCheck) isIndeterminate = false;
      }

      return {
        isIndeterminate,
        allCheck,
      };
    });
    const show = (value: any[]) => {
      if (value) {
        formData.value.selectedAssess = value;
        if (value.length > 0) {
          formData.value.currentCycleType = value[0].cycle_type;
        }
      }
      reqEvalation.runAsync(
        { page_num: 1, num: 20 },
        { cycle_type: formData.value.currentCycleType },
      );
    };

    const dialogSubmit = () => {
      ctx.emit('submit', formData.value.selectedAssess);
      ctx.emit('close');
    };
    return { reqEvalation, formData, checkAllStatus, dialogSubmit, filterData, show };
  },
  render() {
    const { formData, reqEvalation } = this;
    const { pagination } = reqEvalation;
    return (
      <div class="launch-container">
        <div class="content-select">
          <div class="header">
            {ECYCLE_TYPE_OPTIONS.map(item => {
              let className = '';
              let hasDisabled = false;

              if (formData.currentCycleType === item.value) className += 'active';
              if (
                this.formData.selectedAssess.length > 0 &&
                formData.selectedAssess[0].cycle_type !== item.value
              ) {
                hasDisabled = true;
                className += ' disabled';
              }
              return (
                <span
                  key={item.value}
                  class={className}
                  onclick={() => {
                    if (hasDisabled) return;
                    formData.currentCycleType = item.value;
                    this.reqEvalation.pagination.reQuery({ cycle_type: item.value });
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
          <div class="search">
            <el-input
              v-model={formData.name}
              clearable
              size="mini"
              on-input={() => {
                reqEvalation.pagination.reQuery({
                  name: formData.name,
                  cycle_type: formData.currentCycleType,
                });
              }}
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
            {/* <tg-button
              type="primary"
              onClick={() => {
                reqEvalation.pagination.reQuery({
                  name: formData.name,
                  cycle_type: formData.currentCycleType,
                });
              }}
            >
              查询
            </tg-button> */}
          </div>
          <div class="flex-fill">
            <div class="table">
              <div class="table-row">
                <div class="mgr-6">
                  <el-checkbox
                    isIndeterminate={this.checkAllStatus.isIndeterminate}
                    value={this.checkAllStatus.allCheck}
                    onInput={() => {
                      if (this.checkAllStatus.allCheck) {
                        formData.selectedAssess = formData.selectedAssess.filter(
                          it => !this.filterData.some(it2 => it2.id === it.id),
                        );
                      } else {
                        const added: any = this.filterData.filter(
                          it => !formData.selectedAssess.some(it2 => it2.id === it.id),
                        );
                        formData.selectedAssess.push(...added);
                      }
                    }}
                  />
                </div>
                <div>全选</div>
                {/* <div />
              <div /> */}
              </div>
              {this.filterData.map((item, index) => {
                const hasChecked = formData.selectedAssess.some(it => it.id === item.id);
                return (
                  <div class="table-row" key={index}>
                    <div class="mgr-6">
                      <el-checkbox
                        value={hasChecked}
                        onInput={() => {
                          if (hasChecked)
                            formData.selectedAssess = formData.selectedAssess.filter(
                              it => it.id !== item.id,
                            );
                          else formData.selectedAssess.unshift(item);
                        }}
                      />
                    </div>
                    <div>{item.name}</div>
                    <div class="group-count">（{item.by_evaluation_person.length}人）</div>
                    {/* <div /> */}
                  </div>
                );
              })}
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              small={true}
              layout="prev,pager,next"
              total={pagination.total}
              current-page={pagination.page_num}
              page-size={pagination.page_size}
              oncurrent-change={pagination.onCurrentChange}
            />
          </div>
        </div>
        <div class="select-box">
          <div class="selected-info">
            <span>已选择 {this.formData.selectedAssess.length} 个考评组</span>
            <a
              onclick={() => {
                formData.selectedAssess = [];
              }}
            >
              清空选中
            </a>
          </div>
          <div class="selected-people">
            <div class="selected-people-list">
              {this.formData.selectedAssess.map((item, index) => {
                return (
                  <span key={index}>
                    {item.name}
                    <i
                      class="el-input__icon el-icon-close"
                      onclick={() => {
                        this.formData.selectedAssess.splice(index, 1);
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
