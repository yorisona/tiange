<template>
  <div>
    <layerForm>
      <el-form class="filter-form flex-form" size="mini" :show-message="false" :inline="true">
        <el-form-item label="项目名称：" prop="">
          <el-select
            popper-class="el-select-popper-mini"
            @change="getAccess"
            v-model="project_id"
            filterable
            style="width: 264px"
          >
            <el-option
              v-for="item in project_list"
              :label="item.project_name"
              :key="item.project_id"
              :value="item.project_id"
              >{{ item.project_name }}
              <span v-if="item.project_status === ProjectStatusEnum.finish">(已完结)</span>
              <span v-else-if="item.project_status === ProjectStatusEnum.executionEnd"
                >(执行结束)</span
              >
              <span v-else>(进行中)</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </layerForm>
    <div class="content-box">
      <div class="commodity-navgition mgb-16">
        <styleBeforeWords class="mgr-20">销售数据</styleBeforeWords>
        <tg-button
          @click="linkAccess"
          style="margin-right: 8px; border-radius: 2px"
          :disabled="accessObj.has_access"
          >商家授权</tg-button
        >
        <span v-if="!accessObj.has_access" class="tips">
          <i
            class="el-icon-warning-outline"
            style="font-size: 14px; margin-top: 3px; margin-right: 2px"
          ></i>
          <span class="text" style="color: #c1c1c1; font-size: 12px">当前商家未授权</span>
        </span>
        <span v-else class="tips">
          <tg-icon
            name="ico-icon_tongyong_chenggong_xianxing1"
            style="color: #33ba5d; font-size: 18px; margin-top: -1px"
          ></tg-icon>
          <span class="text" style="color: #c1c1c1; font-size: 12px">当前商家已授权</span>
        </span>
        <span class="time">数据更新于 {{ getUpTime() }}</span>
      </div>
      <div class="list-box" v-loading="loading">
        <styleBeforeWords type="dot" class="mgb-12">销售数据</styleBeforeWords>
        <div class="grid-box-3">
          <div>
            <span>全年销售额目标：</span>
            <span class="value">{{
              project_sale_obj && project_sale_obj.year && project_sale_obj.year.goal_gmv !== null
                ? formatPriceFormYuan((project_sale_obj.year.goal_gmv || 0) / 100, 2, true)
                : '--'
            }}</span>
          </div>
          <div>
            <span>店铺总销售额：</span>
            <span class="value">{{
              project_sale_obj && project_sale_obj.year && project_sale_obj.year.gmv !== null
                ? formatPriceFormYuan((project_sale_obj.year.gmv || 0) / 100, 2, true)
                : '--'
            }}</span>
          </div>
          <div>
            <span>目标完成度：</span>
            <span class="value">{{
              project_sale_obj &&
              project_sale_obj.year &&
              project_sale_obj.year.gmv_percent !== null
                ? (project_sale_obj.year.gmv_percent || 0) + '%'
                : '--'
            }}</span>
          </div>
        </div>
      </div>
      <div class="box sale-div" v-loading="loading" style="margin-right: -8px">
        <div class="list-box">
          <styleBeforeWords type="dot" class="mgb-12">昨日销售数据</styleBeforeWords>
          <div class="grid-box-2">
            <div>
              <span>销售额目标：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_day &&
                project_sale_obj.last_day.goal_gmv !== null
                  ? formatPriceFormYuan((project_sale_obj.last_day.goal_gmv || 0) / 100, 2, true)
                  : '--'
              }}</span>
            </div>
            <div>
              <span>店铺总销量：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_day &&
                project_sale_obj.last_day.sale_count !== null
                  ? formatPriceFormYuan(project_sale_obj.last_day.sale_count || 0, 0, false)
                  : '--'
              }}</span>
            </div>
            <div>
              <span>店铺总销售额：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_day &&
                project_sale_obj.last_day.gmv !== null
                  ? formatPriceFormYuan((project_sale_obj.last_day.gmv || 0) / 100, 2, true)
                  : '--'
              }}</span>
            </div>
            <div>
              <span>目标完成度：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_day &&
                project_sale_obj.last_day.gmv_percent !== null
                  ? (project_sale_obj.last_day.gmv_percent || 0) + '%'
                  : '--'
              }}</span>
            </div>
          </div>
        </div>
        <div class="list-box">
          <styleBeforeWords type="dot" class="mgb-12">上周销售数据</styleBeforeWords>
          <div class="grid-box-2">
            <div>
              <span>销售额目标：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_week &&
                project_sale_obj.last_week.goal_gmv !== null
                  ? formatPriceFormYuan((project_sale_obj.last_week.goal_gmv || 0) / 100, 2, true)
                  : '--'
              }}</span>
            </div>
            <div>
              <span>店铺总销量：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_week &&
                project_sale_obj.last_week.sale_count !== null
                  ? formatPriceFormYuan(project_sale_obj.last_week.sale_count || 0, 0, false)
                  : '--'
              }}</span>
            </div>
            <div>
              <span>店铺总销售额：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_week &&
                project_sale_obj.last_week.gmv !== null
                  ? formatPriceFormYuan((project_sale_obj.last_week.gmv || 0) / 100, 2, true)
                  : '--'
              }}</span>
            </div>
            <div>
              <span>目标完成度：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_week &&
                project_sale_obj.last_week.gmv_percent !== null
                  ? (project_sale_obj.last_week.gmv_percent || 0) + '%'
                  : '--'
              }}</span>
            </div>
          </div>
        </div>
        <div class="list-box">
          <styleBeforeWords type="dot" class="mgb-12">上月销售数据</styleBeforeWords>
          <div class="grid-box-2">
            <div>
              <span>销售额目标：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_month &&
                project_sale_obj.last_month.goal_gmv !== null
                  ? formatPriceFormYuan(
                      project_sale_obj.last_month.goal_gmv === 0
                        ? 0
                        : project_sale_obj.last_month.goal_gmv / 100,
                      2,
                      true,
                    )
                  : '--'
              }}</span>
            </div>
            <div>
              <span>店铺总销量：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_month &&
                project_sale_obj.last_month.sale_count !== null
                  ? formatPriceFormYuan(
                      project_sale_obj.last_month.sale_count === 0
                        ? 0
                        : project_sale_obj.last_month.sale_count,
                      0,
                      false,
                    )
                  : '--'
              }}</span>
            </div>
            <div>
              <span>店铺总销售额：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_month &&
                project_sale_obj.last_month.gmv !== null
                  ? formatPriceFormYuan(
                      project_sale_obj.last_month.gmv === 0
                        ? 0
                        : project_sale_obj.last_month.gmv / 100,
                      2,
                      true,
                    )
                  : '--'
              }}</span>
            </div>
            <div>
              <span>目标完成度：</span>
              <span class="value">{{
                project_sale_obj &&
                project_sale_obj.last_month &&
                project_sale_obj.last_month.gmv_percent !== null
                  ? (project_sale_obj.last_month.gmv_percent || 0) + '%'
                  : '--'
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="commodity-navgition mgt-24">
        <styleBeforeWords class="mgr-20">商品分析模块</styleBeforeWords>
      </div>
      <div class="box">
        <div class="analysis-box" @click="gotoAnalysisClick(0)">
          <tg-icon class="week" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>日/周/月销售分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(1)">
          <tg-icon class="brand" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>品牌类目分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(2)">
          <tg-icon class="year" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>年度季节分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(3)">
          <tg-icon class="sale" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>竞品销售分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(4)">
          <tg-icon class="monitor" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>商品监控分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(5)">
          <tg-icon class="shop" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>预售商品分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(6)" v-if="project_id">
          <tg-icon class="multi" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>商品多维分析</span>
        </div>
        <div class="analysis-box" @click="gotoAnalysisClick(7)" v-if="project_id">
          <tg-icon class="track" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>搭配效果追踪</span>
        </div>
        <div
          class="analysis-box"
          @click="gotoAnalysisClick(8)"
          v-if="permission.inventory_sold_out_monitoring"
        >
          <tg-icon class="soldOut" name="ico-icon_pinpaishangpinfenxi"></tg-icon>
          <span>库存售罄监控</span>
        </div>
      </div>
      <div class="commodity-navgition mgt-24 mgb-16">
        <styleBeforeWords class="mgr-20">商品分析设置</styleBeforeWords>
      </div>
      <div>
        <tg-button class="mgr-12" @click="showRuleSettingClick(1)">年度季节规则设置</tg-button>
        <tg-button class="mgr-12" @click="showRuleSettingClick(2)">款数判定规则设置</tg-button>
        <tg-button class="mgr-12" @click="showRuleSettingClick(3)">款别判断规则设置</tg-button>
        <!--        <tg-button @click="showRuleSettingClick(4)"
          >竞店款号抓取规则设置</tg-button
        >-->
      </div>
    </div>
  </div>
</template>
<script src="./home.ts"></script>
<style lang="less" scoped>
.commodity-form {
  position: fixed;
  height: 70px;
  width: 100%;
  border-bottom: 10px #f4f5f6 solid;
}
.content-box {
  margin-top: 70px;
  min-width: 1250px;
  overflow-x: auto;
  background-color: #ffffff;
  padding: 16px;
  height: 100%;
  .commodity-navgition {
    display: flex;
    align-items: center;
    .time {
      color: var(--text-third-color);
      text-align: right;
      margin-left: auto;
    }
  }
  .list-box {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    padding: 16px;
    font-weight: 400;
    color: var(--text-second-color);
    &:first-child {
      margin-left: 0;
    }
    .grid-box-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 260px));
      grid-gap: 0px;
      padding-left: 8px;
      .value {
        color: var(--text-color);
        font-weight: 600;
        margin-left: -2px;
      }
    }
  }
  .box {
    margin-top: 16px;
    display: grid;
    //gap: 16px;
    grid-template-columns: repeat(4, minmax(0px, 1fr));
    &.sale-div {
      grid-template-columns: repeat(3, minmax(0px, 350px));
      padding-right: 8px;
    }
    grid-gap: 12px 12px;

    @media only screen and (min-width: 1700px) {
      grid-template-columns: repeat(auto-fit, minmax(0px, 1fr));
    }
    .list-box {
      flex: 1;
      &:first-child {
        margin-left: 0;
      }
      .grid-box-2 {
        display: grid;
        justify-content: space-between;
        grid-template-columns: 2fr 1.5fr;
        grid-gap: 6px 6px;
        padding-left: 8px;
        .value {
          color: var(--text-color);
          font-weight: 600;
        }
      }
    }
    .analysis-box {
      flex: 1;
      height: 64px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      line-height: 64px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      align-items: center;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background: #f0f9ff;
        border: 1px solid var(--theme-color);
        box-shadow: 0 6px 11px 0 rgba(0, 0, 0, 0.08);
      }
      &:active {
        background: #e9f4fc;
        border: 1px solid var(--theme-color);
        box-shadow: 0 6px 11px 0 rgba(0, 0, 0, 0.08);
      }
      .icon {
        margin-right: 10px;
        width: 16px;
        height: 16px;
        position: relative;
        &.week {
          color: var(--theme-color) !important;
        }
        &.brand {
          color: #fb8500 !important;
        }
        &.year {
          color: #14c900 !important;
        }
        &.sale {
          color: #ed3434 !important;
        }
        &.monitor {
          color: #0ebeb6 !important;
        }
        &.shop {
          color: #5f59f7 !important;
        }
        &.multi {
          color: #ffbf00 !important;
        }
        &.track {
          color: #ff58c7 !important;
        }
        &.soldOut {
          color: #7cb305 !important;
        }
      }
    }
  }
  .tips {
    padding-top: 2px;
    display: flex;
  }
}
</style>
