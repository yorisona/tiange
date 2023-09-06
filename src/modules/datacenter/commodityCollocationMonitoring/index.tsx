import { defineComponent, reactive, provide, ref, inject } from '@vue/composition-api';
import { useRouteNameTabs } from '@/use/tab';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import moment, { Moment } from 'moment';
import { FormList } from '@gm/templates/form';
import { Select } from '@gm/component';
import { useRequest } from '@gm/hooks/ahooks';
import { GetQueryDouyinReportProjects, query_project_second_list } from '@/services/datacenter';
export default defineComponent({
  components: {
    FormList,
  },
  watch: {
    $route: {
      handler(to) {
        this.checkDefault(to);
      },
      deep: true,
    },
  },
  setup() {
    const router = useRouter();
    const formData = reactive({
      project_id: Number(router.currentRoute.query.project_id),
      // date: [moment().subtract(7, 'day'), moment().subtract(1, 'day')],
      product_sn: '',
      product_id: '',
      date: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
      // 已更改为Template中的category
      // category: undefined as any,
    });

    provide('formData', formData);
    const tabs = useRouteNameTabs(
      [
        {
          label: '直播讲解',
          value: RouterDataCenter.commodityCollocationMonitoringLive,
        },
        {
          label: '搭配统计',
          value: RouterDataCenter.commodityCollocationMonitoringStatistics,
        },
      ].filter(Boolean) as any,
      '',
      false,
    );
    const project_options = ref<TG.OptionType<any>[]>([
      {
        label: String(router.currentRoute.query.project_name),
        value: formData.project_id,
      },
    ]);
    const reqQueryProjectSecondList = useRequest(query_project_second_list, {
      manual: true,
      transform: (res: any) => {
        return res.map((item: any) => {
          return {
            label: `${item.first_cname}/${item.second_name}`,
            value: item.second_cid,
          } as any;
        });
      },
    });
    const loadCategory = () => {
      reqQueryProjectSecondList.runAsync({
        project_id: formData.project_id,
        start_date: moment(formData.date[0]).format('YYYY-MM-DD'),
        end_date: moment(formData.date[1]).format('YYYY-MM-DD'),
      });
    };
    const loadProjectOptions = () => {
      GetQueryDouyinReportProjects().then(res => {
        const list = res.data.data.projects || [];
        project_options.value = list.map((it: any) => {
          return {
            label: it.project_name,
            value: it.project_id,
          };
        });
      });
    };
    const currentDate = moment().startOf('day');

    const pickerOptions = {
      min: null as null | Moment,
      max: null as null | Moment,
      disabledDate(date: Moment) {
        if (currentDate.isSameOrBefore(date)) return true;
        else if (pickerOptions.min?.isAfter(date)) return true;
        else if (pickerOptions.max?.isBefore(date)) return true;
        return false;
      },
      onPick(date: any) {
        pickerOptions.min = moment(date.minDate).subtract(30, 'day');
        pickerOptions.max = moment(date.minDate).add(30, 'day');
      },
    };
    const checkDefault = (to?: any) => {
      tabs.updateChecked(to.name);
    };
    checkDefault(router.currentRoute);
    const onTabChange = (value: any) => {
      if (tabs.checkedTab === value) return;
      tabs.onTabChange({ value } as any, { query: router.currentRoute.query });
    };
    const dateStr = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const currentSelectDate = ref([dateStr, dateStr]);
    provide('currentSelectDate', currentSelectDate);

    loadProjectOptions();
    const searchFn = ref(() => {});
    const setSearchFN = (fn: TG.anyFunc) => {
      searchFn.value = fn;
    };
    const resetFn = () => {
      formData.product_sn = '';
      formData.product_id = '';
      searchFn.value();
    };
    const routes = [
      { title: '品牌商品分析', name: RouterDataCenter.commodityAnalysis },
      { title: '搭配效果追踪' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    // checkDefault();
    return reactive({
      tabs,
      checkDefault,
      onTabChange,
      project_options,
      formData,
      loadCategory,
      pickerOptions,
      searchFn,
      resetFn,
      setSearchFN,
    });
  },
  render() {
    const { tabs, onTabChange, formData, searchFn, resetFn } = this;
    return (
      <div class="exchangeMall-container">
        <form-list onSearch={searchFn} onReset={resetFn}>
          <el-form-item label="项目名称：">
            <Select
              clearable={false}
              options={this.project_options}
              v-model={formData.project_id}
              style="width:100%"
              filterable={true}
            />
          </el-form-item>
          <el-form-item label="选择日期：">
            <el-date-picker
              format="yyyy.MM.dd"
              type="daterange"
              style="width:100%"
              range-separator="~"
              v-model={formData.date}
              clearable={false}
              picker-options={this.pickerOptions}
              onChange={this.onTimeChange}
            />
          </el-form-item>
          <el-form-item label="商品编码：">
            <el-input placeholder="请输入商品编码" v-model={formData.product_id} />
          </el-form-item>
          <el-form-item label="商品款号：">
            <el-input placeholder="请输入商品款号" v-model={formData.product_sn} />
          </el-form-item>
        </form-list>
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs.tabs}
          value={tabs.checkedTab}
          onInput={onTabChange}
        />
        <router-view class="context" />
      </div>
    );
  },
});
