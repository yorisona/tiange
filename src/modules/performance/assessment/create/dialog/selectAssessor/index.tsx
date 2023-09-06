import { defineComponent, ref, computed } from '@vue/composition-api';
import { RouterNamePerformance } from '@/const/router';
import { isEmpty } from '@/utils/func';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref<NPerformance.IEvaluationGroup>();
    const visible = ref(false);
    const selected = ref<number>();
    const show = (value: NPerformance.IEvaluationGroup) => {
      if (value) {
        formData.value = value;
        visible.value = true;
      }
    };

    const filterValue = ref('');
    const filterList = computed(() => {
      const value = filterValue.value;
      const list: any[] = formData.value?.by_evaluation_person || [];
      if (isEmpty(value)) return list;
      return list.filter(item => {
        return item.username.indexOf(value) !== -1;
      });
    });

    return {
      show,
      formData,
      visible,
      selected,
      filterValue,
      filterList,
    };
  },
  render() {
    return (
      <el-drawer
        title="选择模拟被考核人员"
        size="378px"
        visible={this.visible}
        onClose={() => {
          this.visible = false;
        }}
      >
        <div class="assessor-container">
          <div class="search">
            <el-input size="mini" placeholder="输入姓名查找 " v-model={this.filterValue}>
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
          <div class="body">
            <el-radio-group v-model={this.selected}>
              {this.filterList.map(item => {
                return (
                  <div class="assessor-item">
                    <el-radio name="assessor" label={item.user_id}>
                      {item.username} ({item.real_name})
                    </el-radio>
                  </div>
                );
              })}
            </el-radio-group>
          </div>
          <div class="footer">
            <tg-button onclick={() => (this.visible = false)}>取消</tg-button>
            <tg-button
              type="primary"
              class="mgl-12"
              onClick={() => {
                if (this.selected) {
                  this.$router.push({
                    name: RouterNamePerformance.assessment.preview,
                    query: {
                      user_id: this.selected + '',
                    },
                  });
                  this.visible = false;
                }
              }}
            >
              确定
            </tg-button>
          </div>
        </div>
      </el-drawer>
    );
  },
});
