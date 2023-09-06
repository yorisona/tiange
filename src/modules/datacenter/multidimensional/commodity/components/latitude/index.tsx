import {
  defineComponent,
  inject,
  PropType,
  ref,
  onMounted,
  onUnmounted,
} from '@vue/composition-api';
import chart from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { LatitudeOption, TargetType, useTemplate, useTemplateManager } from '../../use';
import utils from '@/utils';
const EchartGl = utils.createPromise();

const loadScript = () => {
  let script: HTMLScriptElement = document.querySelector('echarts-gl') as HTMLScriptElement;
  if (script) {
    EchartGl.resolve(undefined);
    return;
  }
  script = document.createElement('script');
  script.src = 'https://tiange-oss.goumee.com/prod/front/npm/echarts/echarts-gl.min.js';
  script.addEventListener('load', () => {
    EchartGl.resolve(undefined);
  });
  document.head.appendChild(script);
};
loadScript();
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ReturnType<typeof useTemplate>>,
      required: true,
    },
  },
  components: {
    chart,
  },
  setup(props, ctx) {
    const template = inject('template') as ReturnType<typeof useTemplateManager>;
    const isFullScreen = ref(false);
    const isLoadEcharts = ref(false);

    // 过滤已被其他下拉框现在的数据
    const filter_other_selected = (
      options: LatitudeOption[],
      selects: string[],
      current: string,
    ) => {
      const dataLatitude = {
        label: '数据纬度',
        options: [] as LatitudeOption[],
      };
      const attributeLatitude = {
        label: '属性纬度',
        options: [] as LatitudeOption[],
      };
      for (const option of options) {
        if (option.value === current || !selects.includes(option.value)) {
          if (option.latitude_type === 1) {
            dataLatitude.options.push(option);
          } else {
            attributeLatitude.options.push(option);
          }
        }
      }

      return [dataLatitude, attributeLatitude];
    };
    const refChartBox = ref();
    const onFullScreen = () => {
      if (!refChartBox.value) return;
      if (isFullScreen.value) {
        document.exitFullscreen().then(() => {
          isFullScreen.value = false;
        });
      } else {
        refChartBox.value.requestFullscreen().then(() => {
          isFullScreen.value = true;
        });
      }
    };

    const onFullScreenListener = (e: Event) => {
      if (document.fullscreenElement && e.target !== refChartBox.value) return;
      isFullScreen.value = !!document.fullscreenElement;
      (ctx.refs.chart as any)?.refresh();
    };
    onMounted(() => {
      document.addEventListener('fullscreenchange', onFullScreenListener);
    });
    onUnmounted(() => {
      document.removeEventListener('fullscreenchange', onFullScreenListener);
    });
    EchartGl.promise.then(() => {
      isLoadEcharts.value = true;
    });
    return {
      isFullScreen,
      template,
      filter_other_selected,
      refChartBox,
      onFullScreen,
      isLoadEcharts,
    };
  },
  render() {
    if (!this.isLoadEcharts) return <div />;
    const {
      template,
      data: { formData },
      onFullScreen,
    } = this;
    const chartsOption = this.data.chart_options;
    if (chartsOption) {
      if (chartsOption.tooltip) chartsOption.tooltip.appendToBody = !this.isFullScreen;
    }
    return (
      <div class={`latitude ${this.isFullScreen ? 'full' : ''}`}>
        <div class="filter filter-latitude">
          <span class="label">选择维度：</span>
          {formData.latitude_list.map((_, index) => {
            let disabled = false;
            let claerable = true;
            if (template.loading) disabled = true;
            if (index > 0) {
              // 如果前一个没有选择,则后一个不选择
              if (!formData.latitude_list[index - 1]) {
                disabled = true;
              }
            }
            if (index < formData.latitude_list.length - 1) {
              if (formData.latitude_list[index + 1]) claerable = false;
            }
            return (
              <el-select
                filterable={true}
                disabled={disabled}
                size="mini"
                v-model={formData.latitude_list[index]}
                clearable={claerable}
                onChange={() => {
                  template.addLoadQueue(this.data);
                }}
              >
                {this.filter_other_selected(
                  template.latitude_options,
                  formData.latitude_list,
                  formData.latitude_list[index],
                ).map(it => {
                  return (
                    <el-option-group label={it.label}>
                      {it.options.map((it, key) => {
                        return <el-option label={it.label} value={it.value} key={'__' + key} />;
                      })}
                    </el-option-group>
                  );
                })}
              </el-select>
            );
          })}
        </div>
        <div class="filter filter-index">
          <div>
            <span class="label">分析指标：</span>
            <tg-button
              size="mini"
              disabled={template.loading}
              type={formData.target_type === TargetType.SALES ? 'primary' : undefined}
              onClick={() => {
                if (formData.target_type === TargetType.SALES) return;
                formData.target_type = TargetType.SALES;
                template.addLoadQueue(this.data);
              }}
            >
              销量
            </tg-button>
            <tg-button
              size="mini"
              disabled={template.loading}
              type={formData.target_type === TargetType.SALESQUOTA ? 'primary' : undefined}
              onClick={() => {
                if (formData.target_type === TargetType.SALESQUOTA) return;
                formData.target_type = TargetType.SALESQUOTA;
                template.addLoadQueue(this.data);
              }}
            >
              销售额
            </tg-button>
          </div>
          <div class="operating" onClick={() => this.$emit('delete')}>
            <tg-icon name="ico-btn-delete" />
            <span>删除面板</span>
          </div>
          {/*<tg-button*/}
          {/*  size="mini"*/}
          {/*  disabled={template.loading}*/}
          {/*  type={formData.target_type === TargetType.WELCOMEINDEX ? 'primary' : undefined}*/}
          {/*  onClick={() => {*/}
          {/*    if (formData.target_type === TargetType.WELCOMEINDEX) return;*/}
          {/*    formData.target_type = TargetType.WELCOMEINDEX;*/}
          {/*    template.addLoadQueue(this.data);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  欢迎指数*/}
          {/*</tg-button>*/}
        </div>
        <div class="chart-box" v-loading={this.data.loading} ref="refChartBox">
          {chartsOption && <chart options={chartsOption} class="chart" ref="chart" />}
          {chartsOption?.effectiveLength >= 4 && (
            <span class={`full-screen ${this.isFullScreen}`} onclick={onFullScreen} />
          )}
        </div>
      </div>
    );
  },
});
