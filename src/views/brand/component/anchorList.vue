<template>
  <section class="anchor-list-wrapper">
    <div class="layout-table">
      <div class="layout-head">
        <div class="head-left">价格区间</div>
        <div class="head-right">
          注：<i class="gm-icon-percent"></i
          ><span>图标表示最近15款平均销售额（元）/&nbsp;最近15款点击数（次）</span>
        </div>
      </div>
      <div class="layout-body">
        <ul class="body-left">
          <template v-for="item in costRangeList">
            <li class="item" :key="item.cost_range_str" v-if="item.star_list.length > 0">
              {{ item.cost_range_str }}
            </li>
          </template>
          <li class="item" v-if="noList"></li>
        </ul>
        <div class="body-right">
          <el-scrollbar style="width: 100%" ref="scroll">
            <div class="body-right-box">
              <template v-for="(item, rangeIndex) in costRangeList">
                <div
                  class="item"
                  v-if="item.star_list.length > 0"
                  :key="rangeIndex"
                  :style="'width: ' + getMaxWidth() + 'px'"
                >
                  <template>
                    <div
                      class="anchor-item-wrapper"
                      v-for="(anchor, anchorIndex) in item.star_list"
                      :key="anchorIndex"
                      @click="selectAnchor(rangeIndex, anchorIndex)"
                    >
                      <anchor-item
                        :anchor="anchor"
                        :rangeIndex="rangeIndex"
                        :anchorIndex="anchorIndex"
                        @del="delStar(anchor, rangeIndex, anchorIndex)"
                      ></anchor-item>
                    </div>
                  </template>
                </div>
              </template>
              <div class="item" v-if="noList">
                <div class="no-list">无系统匹配主播了，请手动添加主播</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { delCandidate } from '@/api/candidate';
import anchorItem from './anchorItem';
export default {
  name: 'anchorList',
  props: {
    // chosenPlanList: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    // costRangeList: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {};
  },
  computed: {
    costRangeList() {
      return this.$store.getters['requirement/currentCostRangeList'];
    },
    noList() {
      let ret = true;
      this.costRangeList.forEach(item => {
        if (item.star_list.length > 0) {
          ret = false;
        }
      });
      return ret;
    },
  },
  created() {
    /* do nth */
  },
  methods: {
    getMaxWidth() {
      let _width = 0;
      let _len = 0;
      this.costRangeList.forEach(item => {
        if (item.star_list.length > _len) {
          _len = item.star_list.length;
        }
      });
      _width = _len * 232 + 10;
      return _width;
    },
    // 选择主播
    selectAnchor(rangeIndex, anchorIndex) {
      // console.log(this.$store.state.requirement.importedProList.star_list[anchorIndex].isSelect = )
      // anchor.isSelect = 1
      this.$store.commit('requirement/selectAnchor', { rangeIndex, anchorIndex });
      // 选择的时候初始化为1
      this.$store.commit('requirement/updateDisplayNum', {
        rangeIndex,
        anchorIndex,
        number: 1,
      });
    },
    // 删除候选集列表里的主播
    delStar(anchor, rangeIndex, anchorIndex) {
      const params = {
        plan_id: anchor.plan_id,
      };
      delCandidate(params).then(() => {
        // const res = _res.data;
        this.$store.commit('requirement/delStar', {
          rangeIndex,
          anchorIndex,
        });
      });
    },
  },
  components: {
    anchorItem,
  },
  watch: {
    costRangeList() {
      this.$nextTick(() => {
        this.$refs.scroll.update();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.anchor-list-wrapper {
  .layout-table {
    .layout-head {
      display: flex;
      height: 50px;
      .head-left {
        width: 120px;
        background: #eaebeb;
        box-sizing: border-box;
        padding-left: 20px;
        line-height: 50px;
        font-weight: 600;
      }
      .head-right {
        flex: 1;
        background: #f0f1f2;
        text-indent: 12px;
        line-height: 50px;
        .gm-icon-percent {
          vertical-align: top;
          margin: 19px 5px 0 3px;
        }
        span {
          font-size: 12px;
        }
      }
    }
    .layout-body {
      display: flex;
      // height: 524px;
      .body-left {
        width: 120px;
        flex: 0 0 120px;
        box-sizing: border-box;
        background: #eaebeb;
        font-weight: 600;
        .item {
          padding-left: 20px;
          border-top: 1px solid #fff;
          height: 130px;
          line-height: 130px;
        }
      }
      .body-right {
        flex: 1;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        overflow-x: auto;
        position: relative;
        // .body-right-box {
        //     width: 100%;
        //     overflow-y: hidden;
        //     overflow-x: auto;
        // }
        .no-list {
          margin-left: 10px;
          height: 130px;
          line-height: 130px;
          font-size: 14px;
        }
        .item {
          min-width: 100%;
          height: 130px;
          font-size: 0;
          &:nth-child(n + 2) {
            border-top: 1px solid #fbfbfb;
          }
          .anchor-item-wrapper {
            margin-top: 10px;
            font-size: 14px;
            display: inline-block;
            vertical-align: top;
            &:nth-child(n + 1) {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
