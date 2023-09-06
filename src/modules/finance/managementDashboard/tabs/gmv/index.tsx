/** GMV */
import { defineComponent, h, ref } from '@vue/composition-api';
import gmvEcharts from '@/modules/finance/managementDashboard/components/dataEcharts/gmvindex.vue';
import gmvDataDetail from '@/modules/finance/managementDashboard/components/dataDeatil/gmvindex.vue';

export default defineComponent({
  components: {
    gmvEcharts,
    gmvDataDetail,
  },
  setup() {
    const selectIndex = ref(0);
    const methods = {};
    const onSwitch = (index: number) => {
      selectIndex.value = index;
    };
    const switchComponents = [gmvEcharts.name, gmvDataDetail.name];
    return {
      onSwitch,
      switchComponents,
      selectIndex,
      ...methods,
    };
  },
  render() {
    const componentObj = {
      name: this.switchComponents[this.selectIndex],
    };
    return (
      <div style="background:white;height:100%;overflow:auto;border-top: 1px solid rgba(164, 178, 194, 0.3);">
        <div class="data-center-switch">
          <tg-button
            selected={this.selectIndex === 0}
            type="link"
            on-click={() => this.onSwitch(0)}
          >
            数据图表
          </tg-button>
          <span class="mgl-18 mgr-18 line-ver">|</span>
          <tg-button
            selected={this.selectIndex === 1}
            type="link"
            on-click={() => this.onSwitch(1)}
          >
            数据明细
          </tg-button>
        </div>
        {this.selectIndex === 1 && (
          <div>
            {/*<div style="border-top: 1px solid rgba(164, 178, 194, 0.3); margin: 0 18px;"></div>*/}
            <div style="background: #f4f5f6; height: 10px; margin: 0; margin-bottom: 18px"></div>
          </div>
        )}
        <div class="data-center-template">{h(componentObj.name)}</div>
      </div>
    );
  },
});
