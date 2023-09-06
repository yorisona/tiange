import {
  QueryOverdueAssessmentDetail,
  RestartOverdueAssessmentDetail,
} from '@/services/performance';
import { defineComponent, ref, computed, watch } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const loading = ref(false);
    const filterName = ref<string | undefined>(undefined);
    const userList = ref<NPerformance.IOverdueAssessmentDetail[]>([]);
    const filterUserList = computed(() => {
      if (!filterName.value) {
        return userList.value;
      }
      return userList.value.filter(el => el.user_name.indexOf(filterName.value || '') !== -1) ?? [];
    });
    const allChecked = ref(false);
    const indeterminate = ref(false);
    const selectedIds = ref<number[]>([]);
    const selectedUserList = computed(() => {
      return (
        userList.value.filter(el => {
          return selectedIds.value.find(subEL => el.assessment_detail_id === subEL);
        }) ?? []
      );
    });
    const methods = {
      show(assessment_management_id: number) {
        // console.log(id);
        methods.queryOverdueAssessmentDetail(assessment_management_id);
      },
      dialogSubmit() {
        if (selectedIds.value.length === 0) {
          ctx.root.$message.warning('请选择需要重启的人员');
          return;
        }
        methods.restartOverdueAssessmentDetail();
      },
      resetAllCheck() {
        allChecked.value =
          filterUserList.value.length > 0 &&
          filterUserList.value.every(
            el => selectedIds.value.indexOf(el.assessment_detail_id) !== -1,
          );
        // filterUserList.value.length > 0 &&
        //   selectedIds.value.length > 0 &&
        //   selectedIds.value.length >=
        //     filterUserList.value.filter(el => selectedIds.value.indexOf(el.value) !== -1).length;
        const filterSelectedList = filterUserList.value.filter(el =>
          selectedIds.value.find(subEl => el.assessment_detail_id === subEl),
        );
        indeterminate.value =
          selectedIds.value.length > 0 &&
          filterSelectedList.length > 0 &&
          filterSelectedList.length < filterUserList.value.length;
      },
      async queryOverdueAssessmentDetail(assessment_management_id: number) {
        const res = await QueryOverdueAssessmentDetail({
          assessment_management_id,
        });
        if (res.data.success) {
          userList.value = res.data.data || [];
        }
      },
      async restartOverdueAssessmentDetail() {
        loading.value = true;
        const res = await RestartOverdueAssessmentDetail({
          assessment_detail_ids: selectedIds.value || [],
        });
        loading.value = false;
        if (res.data.success) {
          ctx.emit('close');
          ctx.emit('submit');
          ctx.root.$message.success(res.data.message);
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
    };

    watch(
      () => filterUserList.value,
      () => {
        methods.resetAllCheck();
      },
    );

    return {
      loading,
      indeterminate,
      allChecked,
      filterName,
      filterUserList,
      userList,
      selectedIds,
      selectedUserList,
      ...methods,
    };
  },
  render() {
    return (
      <div class="overdue-restart-dialog">
        <div class="overdue-restart-grid">
          <section class="left-container">
            <el-input
              clearable
              vModel_trim={this.filterName}
              placeholder="请输入花名"
              size="small"
            />
            <div
              class="mgt-12"
              style="font-size:var(--small-font-size)"
            >{`逾期考核（${this.userList.length}人）`}</div>
            <div class="content">
              <el-checkbox
                v-model={this.allChecked}
                indeterminate={this.indeterminate}
                on-change={(val: boolean) => {
                  if (val) {
                    this.selectedIds = [
                      ...this.selectedIds,
                      ...this.filterUserList
                        .filter(el => this.selectedIds.indexOf(el.assessment_detail_id) === -1)
                        .map(el => el.assessment_detail_id),
                    ];
                  } else {
                    this.selectedIds = this.selectedIds.filter(el => {
                      const finder = this.filterUserList.every(
                        subEl => subEl.assessment_detail_id !== el,
                      );
                      return finder;
                    });
                    // this.userList
                    //   .filter(el => this.selectedIds.indexOf(el.value) === -1)
                    //   .map(el => el.value) || [];
                  }
                  this.indeterminate = false;
                }}
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model={this.selectedIds}
                on-change={() => {
                  this.resetAllCheck();
                }}
                class="content-items"
              >
                {this.filterUserList.map(el => {
                  return (
                    <div class="content-item">
                      <el-checkbox label={el.assessment_detail_id} key={el.assessment_detail_id}>
                        {el.user_name}
                      </el-checkbox>
                    </div>
                  );
                })}
              </el-checkbox-group>
            </div>
          </section>
          <section class="right-container">
            <div class="header">
              <div class="header-selected">{`已选择：${this.selectedIds.length}个`}</div>
              <tg-button
                type="link"
                on-click={() => {
                  this.selectedIds = [];
                  this.resetAllCheck();
                }}
              >
                清空
              </tg-button>
            </div>
            <div class="content">
              {this.selectedUserList.map(el => {
                return (
                  <span class="content-item">
                    <span>{el.user_name}</span>
                    <i
                      class="el-icon-close"
                      on-click={() => {
                        const index = this.selectedIds.indexOf(el.assessment_detail_id);
                        if (index !== -1) {
                          this.selectedIds.splice(index, 1);
                        }
                        this.resetAllCheck();
                      }}
                    ></i>
                  </span>
                );
              })}
            </div>
          </section>
        </div>
        {/* <div class="overdue-restart-desc">
          <div>默认仅展示最近一次考核中逾期操作的人员</div>
        </div> */}
        <tg-mask-loading visible={this.loading} content="  正在保存，请稍候..."></tg-mask-loading>
      </div>
    );
  },
});
