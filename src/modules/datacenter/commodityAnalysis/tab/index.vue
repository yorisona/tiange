<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-17 11:19:16
-->
<template>
  <div>
    <div class="tab-box">
      <tg-tabs
        :tabs="tabs"
        v-model="checkedTab"
        @change="onTabChange"
        style="width: 180px; height: 48px"
      />

      <div class="tab-fake analysis">
        <p class="tab-fake-node" @click="goYuShowShangpinFenXi">预售商品分析</p>
      </div>
      <div class="tab-fake analysis">
        <p class="tab-fake-node" @click="goAnalysisPage">竞品对比分析</p>
      </div>
      <div class="tab-fake week">
        <p class="tab-fake-node" @click="goWeekPage">每周爆款对比</p>
      </div>
    </div>
    <System class="flex-auto" v-if="activeIndex === 'System'" />
    <Timer class="flex-auto" v-if="activeIndex === 'Timer'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import System from '../components/list/index.vue';
import Timer from '../yearSeason/index.vue';
import { useRefTabs } from '@/use/tab';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { RouterDataCenter } from '@/const/router';

export default defineComponent({
  props: {
    tab: {
      type: String,
      default: 'system',
    },
  },
  components: {
    System,
    Timer,
  },
  setup(props, ctx) {
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const searchProjectName = inject('searchProjectName') as Ref<string>;
    const activeIndex = ref<string>('System');
    const defaultTab = ref<string>('System');
    const tabs = useRefTabs(
      computed(() => {
        const tabList = [
          {
            label: '自定义类目分析',
            value: 'System',
          },
          // {
          //   label: '年度季节分析',
          //   value: 'Timer',
          // },
        ];
        return tabList;
      }),
      defaultTab,
    );
    const goYuShowShangpinFenXi = () => {
      ctx.root.$router.push({
        name: RouterDataCenter.commodityAnalysisPreSale,
        query: {
          project_name: searchProjectName.value,
          project_id: String(searchParams.value.project_id),
        },
      });
    };
    const goAnalysisPage = () => {
      ctx.root.$router.push({
        name: RouterDataCenter.commodityAnalysisCompetitive,
        query: {
          project_name: searchProjectName.value,
          project_id: String(searchParams.value.project_id),
        },
      });
    };
    const goWeekPage = () => {
      ctx.root.$router.push({
        name: RouterDataCenter.commodityWeekPopular,
        query: {
          project_name: searchProjectName.value,
          project_id: String(searchParams.value.project_id),
        },
      });
    };
    const onTabChange = (item: { label: string; value: string }) => {
      activeIndex.value = item.value;
    };

    return { activeIndex, ...tabs, onTabChange, goAnalysisPage, goWeekPage, goYuShowShangpinFenXi };
  },
});
</script>
<style scoped lang="less">
/deep/ .tg-tabs-header-tab-item {
  font-size: 15px !important;
  padding: 0 20px !important;
}
.tab-box {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  .tab-fake {
    background-color: #ffffff;
    line-height: 45px;
    &.analysis {
      width: 128px;
    }
    &.week {
      flex: 1;
    }
    .tab-fake-node {
      width: 100px;
      height: 46px;
      margin-top: 2px;
      cursor: pointer;
      font-size: 16px;
      color: var(--text-second-color);
    }
  }
}
</style>
