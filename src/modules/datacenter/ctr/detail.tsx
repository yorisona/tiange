import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  inject,
} from '@vue/composition-api';
import styleSwitch from '@/modules/datacenter/components/switch/index.vue';
import ctrList from './list/index.vue';
import ctrChart from './chart/index.vue';
import { CTRDetailQueryForm, CTRDetailRefType } from './type';
import moment from 'moment';
import { getToken } from '@/utils/token';
import { ObjectFilterEmpty } from '@/utils/func';
import qs from 'query-string';
import { QueryProjectShifts, QueryCTRProjects } from '@/services/datacenter';
import { CTRProject, ShiftInfo } from '@/types/tiange/datacenter';

import shiftSetting from './dialog/shift.setting.vue';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  components: {
    styleSwitch,
    ctrList,
    ctrChart,
    shiftSetting,
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const initFormData = (): CTRDetailQueryForm => {
      const dateFormat = 'yyyy-MM-DD';
      const end_moment = moment().subtract(1, 'days');
      const start_moment = end_moment.clone().subtract(6, 'days');
      return {
        project_id: project_id ? parseInt(project_id, 10) : undefined,
        dates: [start_moment.format(dateFormat), end_moment.format(dateFormat)],
        shift_id: undefined,
      };
    };
    const formData = ref<CTRDetailQueryForm>(initFormData());
    const shiftInfo = ref<ShiftInfo[]>([]);
    const currentIndex = ref(0);

    const ctrRef = ref<CTRDetailRefType | undefined>(undefined);

    const shouldShiftSetting = ref(false);
    const projectList = ref<CTRProject[]>([]);

    const methods = {
      onQuery() {
        ctrRef.value?.reload?.(formData.value);
      },
      // 切换样式
      onSwitch(index: number) {
        currentIndex.value = index;
        // console.log(`index=${index}`);
        nextTick(() => {
          ctrRef.value?.reload?.(formData.value);
        });
      },
      // 班次设置
      async getShiftInfo() {
        const res = await QueryProjectShifts();
        if (res.data.success) {
          shiftInfo.value = res.data.data;
        }
      },
      onShift() {
        shouldShiftSetting.value = true;
      },
      async onHide(isRefresh = false) {
        if (isRefresh) {
          await methods.getShiftInfo();
          ctrRef.value?.reload?.(formData.value);
        }
        shouldShiftSetting.value = false;
      },
      async queryCTRProjects() {
        const res = await QueryCTRProjects();
        if (res.data.success) {
          projectList.value = res.data.data;
        }
      },
      onProjectChange(val: number) {
        ctx.root.$router.replace({
          params: { id: `${val}` },
        });
        // methods.getShiftInfo();
      },
      exportQuick() {
        const params = {
          start_date: formData.value.dates[0],
          end_date: formData.value.dates[1],
          project_id: formData.value.project_id,
          shift_id: formData.value.shift_id,
        };
        const _paramsstr = qs.stringify({ ...ObjectFilterEmpty(params) });
        const token = getToken();
        console.log(_paramsstr, 'ppp');

        window.open(
          `${process.env.VUE_APP_BASE_API}/api/shop_live/query_ctr_shop_live/export?${_paramsstr}&Authorization=${token}`,
        );
      },
    };
    console.log(formData.value, 'vale');

    const routes = [
      {
        name: RouterDataCenter.ctrDataAnalysis,
        title: 'CTR数据分析',
      },
      {
        path: '',
        title: '项目明细',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    onBeforeMount(() => {
      methods.getShiftInfo();
      methods.queryCTRProjects();
    });

    onMounted(() => {
      nextTick(() => {
        ctrRef.value?.reload?.(formData.value);
      });
    });

    const pickDate = ref<Date | undefined>(undefined);
    const dayPickerOptions = {
      onPick({ maxDate, minDate }: { maxDate: Date; minDate: Date }) {
        if (!maxDate) {
          pickDate.value = minDate;
        } else {
          pickDate.value = undefined;
        }
      },
      disabledDate(date: Date) {
        if (!pickDate.value) {
          return false;
        }
        const pickMoment = moment(pickDate.value);
        const dateMoment = moment(date);
        const minMoment = pickMoment.clone().subtract(29, 'day');
        const maxMoment = pickMoment.clone().add(29, 'day');
        if (dateMoment.isBefore(minMoment) || dateMoment.isAfter(maxMoment)) {
          return true;
        }
        return false;
      },
    };

    return {
      projectList,
      shouldShiftSetting,
      ctrRef,
      formData,
      shiftInfo,
      currentIndex,
      dayPickerOptions,
      pickDate,
      ...methods,
    };
  },
  render() {
    const { projectList } = this;
    return (
      <div class="datacenter-ctr-detail-page-container">
        <div class="query-container">
          {/* 筛选部分 */}
          <el-form
            label-width="60px"
            size="mini"
            props={{ model: this.formData }}
            class="query-form"
          >
            <el-form-item label="项目名称：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.formData.project_id}
                // clearable
                filterable
                style="width: 100%;"
                placeholder="请输入并选择项目"
                on-change={this.onProjectChange}
              >
                {projectList.map(el => (
                  <el-option
                    label={el.project_name}
                    value={el.project_id}
                    key={el.project_id}
                  ></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="查询日期：">
              <el-date-picker
                clearable={false}
                editable={false}
                v-model={this.formData.dates}
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
                pickerOptions={this.dayPickerOptions}
                on-blur={() => {
                  this.pickDate = undefined;
                }}
              />
            </el-form-item>
            <el-form-item label="选择班次：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.formData.shift_id}
                style="width: 100%;"
              >
                <el-option label={'全部'} value={undefined} key={-1}></el-option>
                {this.shiftInfo.map((el, index) => (
                  <el-option
                    label={el.shift_name}
                    value={el.shift_id}
                    key={el.shift_id}
                  ></el-option>
                ))}
                <el-option label={'其他'} value={0} key={-2}></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-button type="primary" on-click={this.onQuery}>
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="style-switch-container mgt-12"
          border-bottom={this.currentIndex === 0 ? false : true}
        >
          {/* 展示样式设置 */}
          <div class="lt-box">
            <tg-button type="primary" on-click={this.onShift}>
              班次设置
            </tg-button>
            <tg-button
              class="mgl-8"
              icon="ico-btn-export"
              type="default"
              onclick={this.exportQuick}
            >
              导出
            </tg-button>
          </div>
          <styleSwitch index={this.currentIndex} on-checkATab={this.onSwitch}></styleSwitch>
        </div>
        <div class={this.currentIndex === 0 ? 'ctr-data-container' : 'ctr-data-container chart'}>
          {/*列表/图样*/}
          {this.currentIndex === 0 ? <ctrList ref="ctrRef" /> : <ctrChart ref="ctrRef" />}
        </div>
        <shiftSetting
          visiable={this.shouldShiftSetting}
          on-closeAction={this.onHide}
          list={this.shiftInfo}
        ></shiftSetting>
      </div>
    );
  },
});
