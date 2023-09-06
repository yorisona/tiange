import {
  defineComponent,
  ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
} from '@vue/composition-api';
import { useRequest } from '@gm/hooks/ahooks';
import { Query_Living_Stream } from '@/services/strategicInformation';
import FlvVideo from '../components/flvVideo/index.vue';
import { Select } from '@gm/component/select';
import { useRouteNameTabs } from '@/use/tab';
// import { RouterNameDesign } from '@/const/router';

enum business_type {
  /** 营销业务 */
  marketing = '1',
  /** 淘宝店播*/
  taobao = '2',
  /** 抖音店播 */
  douyin = '3',
  /** 基地业务 */
  base = '4',
  /** 创新项目 */
  innovation = '5',
  /** 淘宝甄选 */
  taobao_selection = '6',
  local_life = '7',
  supply_chain = '9',
}

export default defineComponent({
  components: {
    FlvVideo,
  },
  setup() {
    let init = false;
    const tabs = useRouteNameTabs([
      {
        label: '品牌中心',
        value: business_type.douyin,
      },
      {
        label: '创新项目',
        value: business_type.innovation,
      },
    ]);
    const tabValue = ref<string>('3');
    const reqList = useRequest(Query_Living_Stream, {
      defaultParams: [
        {
          business_type: tabValue.value,
        },
      ],
      onSuccess(res) {
        if (!init) {
          nextTick(() => {
            selectAll();
          });
          init = true;
        } else {
          filterValues.value = filterValues.value.filter(item => {
            return res.some(it => it.shop_name === item);
          });
        }
      },
    });

    const checkTab = (value: string) => {
      init = false;
      reqList.runAsync({ business_type: tabValue.value }).then(() => {
        selectAll();
      });
    };
    const lives = computed(() => {
      const data = reqList.data || [];
      const filter = filterValues.value || [];
      return data.filter(item => {
        return filter.includes(item.shop_name);
      });
    });
    const selectOptions = computed<TG.OptionType[]>(() => {
      const data = reqList.data || [];
      return data.map(item => {
        return {
          label: item.shop_name,
          value: item.shop_name,
        };
      });
    });
    const filterValues = ref<string[]>([]);
    const clear = () => (filterValues.value = []);
    const selectAll = () => {
      filterValues.value = selectOptions.value.map(it => it.label);
    };

    let timer: number;
    onMounted(() => {
      timer = setInterval(() => reqList.runAsync({ business_type: tabValue.value }), 10000);
    });
    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      reqList,
      tabValue,
      tabs,
      lives,
      selectOptions,
      filterValues,
      selectAll,
      clear,
      checkTab,
    };
  },
  render() {
    const { lives, selectOptions, selectAll, clear, reqList, tabs } = this;
    return (
      <div class="live-monitoring">
        <tg-tabs
          tabs={tabs.tabs}
          v-model={this.tabValue}
          onChange={this.checkTab}
          style="border-bottom: 1px solid #e5e5e5"
        />
        <div class="filter-container">
          <div class="label">选择项目：</div>
          <div>
            <Select
              filterable
              multiple
              clearable={false}
              options={selectOptions}
              v-model={this.filterValues}
              style={'width:100%'}
            />
          </div>
          <div>
            <tg-button type="link" onClick={clear}>
              清除
            </tg-button>
            <tg-button type="link" onClick={selectAll}>
              全选
            </tg-button>
          </div>
        </div>
        <div class="live-header">
          当前正在直播项目数：<b>{reqList.data?.length}</b>
        </div>
        <div class="live-container-box">
          <div class={`live-container ${lives.length === 0 && 'empty'}`}>
            {lives.map((item, index) => {
              return (
                <div class="live">
                  <flv-video src={item.stream_flv} poster={item.stream_screenshot} />
                  <div class="video-title">{item.shop_name}</div>
                </div>
              );
            })}
            {lives.length === 0 && <empty-common detailText="暂无直播" />}
          </div>
        </div>
      </div>
    );
  },
});
