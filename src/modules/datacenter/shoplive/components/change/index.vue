<script src="./index.ts" lang="ts"></script>

<template>
  <div style="padding: 0 18px 12px 18px">
    <div style="margin-bottom: 25px">
      <div v-loading="trendLoading" style="height: 360px; width: 100%; padding-top: 0px">
        <div v-if="baseOptions.series.length > 0">
          <div
            style="
              height: 360px;
              padding: 6px 12px 12px 6px;
              margin-right: 0px;
              margin-left: 0px;
              margin-top: 0px;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
            "
          >
            <BaseEcharts style="height: 320px" :options="baseOptions"></BaseEcharts>
          </div>
        </div>
        <div
          v-else
          style="
            height: 360px;
            padding: 120px 12px 12px 0;
            margin-right: 0px;
            margin-left: 0px;
            margin-top: 0px;
            border: 1px solid var(--border-line-div-color);
            border-radius: 4px;
          "
          v-loading="trendLoading"
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
    <el-table
      class="table-div"
      ref="singleTable"
      highlight-current-row
      @cell-click="row => onViewBtnClick(row)"
      border
      :data="list"
      v-loading="detailLoading"
      :default-sort="{ prop: 'present_watch_pay_ratio', order: 'descending' }"
    >
      <el-table-column
        prop="project_name"
        label="项目"
        align="left"
        min-width="100px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scoped">
          <div>
            <span class="left">{{ scoped.row.project_name || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="department_name" label="所属项目组" min-width="100px" align="center">
        <template slot-scope="scope">
          <div>
            <span class="left"> {{ scope.row.department_name || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="present_exposure"
        label="曝光人数"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_exposure !== null
              ? formatAmount(Number(scope.row.present_exposure || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="present_watch"
        label="观看人数"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_watch !== null
              ? formatAmount(Number(scope.row.present_watch || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="present_product_watch"
        label="商品曝光人数"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_product_watch !== null
              ? formatAmount(Number(scope.row.present_product_watch || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="present_product_click"
        label="商品点击人数"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_product_click !== null
              ? formatAmount(Number(scope.row.present_product_click || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="present_pay" label="成交人数" align="right" min-width="130px" sortable>
        <template slot-scope="scope">
          {{
            scope.row.present_pay !== null
              ? formatAmount(Number(scope.row.present_pay || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="present_watch_click_ratio"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '观看-点击率'"
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.present_watch_click_ratio !== null
                ? formatAmount(Number(scope.row.present_watch_click_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="history_watch_click_ratio"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '观看-点击率'"
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.history_watch_click_ratio !== null
                ? formatAmount(Number(scope.row.history_watch_click_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="watch_click_ratio_link_ratio"
        label="观看-点击率环比"
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          <div class="huanbi">
            <span
              v-if="scope.row.watch_click_ratio_link_ratio > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.watch_click_ratio_link_ratio < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.watch_click_ratio_link_ratio !== null
                ? formatAmount(Math.abs(scope.row.watch_click_ratio_link_ratio), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="present_watch_pay_ratio"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '观看-成交率'"
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.present_watch_pay_ratio !== null
                ? formatAmount(Number(scope.row.present_watch_pay_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="history_watch_pay_ratio"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '观看-成交率'"
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.history_watch_pay_ratio !== null
                ? formatAmount(Number(scope.row.history_watch_pay_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="watch_pay_ratio_link_ratio"
        label="观看-成交率环比"
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          <div class="huanbi">
            <span
              v-if="scope.row.watch_pay_ratio_link_ratio > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.watch_pay_ratio_link_ratio < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.watch_pay_ratio_link_ratio !== null
                ? formatAmount(Math.abs(scope.row.watch_pay_ratio_link_ratio), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <template #empty>
        <empty-common :imgWidth="200" :imgHeight="100" />
      </template>
    </el-table>
    <div style="flex: 1; margin-top: 24px">
      <div v-loading="daytrendLoading" style="height: 354px; width: 100%; padding-top: 0px">
        <div class="echartTitle" style="margin-bottom: 18px; margin-left: 0px">
          <span style="color: 5a5a5a; font-weight: 400">当前分析项目：</span>{{ project_name }}
        </div>
        <div v-if="baseProjectOptions.series.length > 0">
          <div
            style="
              height: 320px;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
              padding: 8px 12px 18px 6px;
            "
          >
            <BaseEcharts :options="baseProjectOptions"></BaseEcharts>
          </div>
        </div>
        <div
          v-else
          style="
            padding-top: 100px;
            height: 320px;
            border: 1px solid var(--border-line-div-color);
            border-radius: 4px;
          "
          v-loading="daytrendLoading"
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
    <div
      style="
        margin-top: 24px;
        display: flex;
        padding: 18px 24px;
        justify-content: space-between;
        height: 412px;
        border: 1px solid var(--border-line-div-color);
        border-radius: 4px;
      "
    >
      <div style="flex: 1">
        <div class="echartTitle" style="margin-bottom: 24px; margin-left: 0px">
          本{{ analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年' }}成交转化漏斗(人数)
        </div>
        <div v-if="project_trends.present" class="tg-datacenter-shoplive-funnel">
          <section class="funnel-line-left">
            <img class="line-part-top" :src="funnel_item_arrow_top" alt="" />
            <div class="line-text-container">
              <div>
                {{
                  project_trends.present.exposure_pay_ratio === null
                    ? '--'
                    : Number(project_trends.present.exposure_pay_ratio || 0) + '%'
                }}
                <span style="font-size: 12px"
                  ><span
                    v-if="project_trends.present.exposure_pay_ratio_link_ratio > 0"
                    style="text-align: left; padding: 0"
                    class="tgicon"
                    ><tg-icon
                      style="margin: auto 1px; color: #f30220; font-size: 14px"
                      name="ico-icon_tongyong_shangsheng_16_red"
                    ></tg-icon
                    >{{ project_trends.present.exposure_pay_ratio_link_ratio }}%
                  </span>
                  <span
                    v-else-if="project_trends.present.exposure_pay_ratio_link_ratio < 0"
                    style="text-align: left; padding: 0"
                    class="tgicon"
                    ><tg-icon
                      style="margin: auto 1px; font-size: 14px"
                      name="ico-icon_tongyong_xiajiang_16_green"
                    ></tg-icon
                    >{{ Math.abs(project_trends.present.exposure_pay_ratio_link_ratio) }}%
                  </span>
                </span>
              </div>
              <div>曝光-成交转化率</div>
            </div>
            <img class="line-part-bottom" :src="funnel_item_arrow_bottom" alt="" />
          </section>
          <section class="funnel-items">
            <div class="item" style="width: 300px">
              <img class="img" :src="funnel_item_1" alt="" />
              <span class="text"
                >直播间曝光人数：{{
                  project_trends.present.exposure === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.present.exposure || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 277px">
              <img class="img" :src="funnel_item_2" alt="" />
              <span class="text"
                >直播间观看人数：{{
                  project_trends.present.watch === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.present.watch || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 253px">
              <img class="img" :src="funnel_item_3" alt="" />
              <span class="text"
                >商品曝光人数：{{
                  project_trends.present.product_watch === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.present.product_watch || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 230px">
              <img class="img" :src="funnel_item_4" alt="" />
              <span class="text"
                >商品点击人数：{{
                  project_trends.present.product_click === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.present.product_click || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 206px">
              <img class="img" :src="funnel_item_5" alt="" />
              <span class="text"
                >成交人数：{{
                  project_trends.present.pay === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.present.pay || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
          </section>
          <section class="funnel-line-right">
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.present.exposure_watch_ratio === null
                      ? '--'
                      : project_trends.present.exposure_watch_ratio + '%'
                  }}
                  <span style="font-size: 12px"
                    ><span
                      v-if="project_trends.present.exposure_watch_ratio_link_ratio > 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; font-size: 14px"
                        name="ico-icon_tongyong_shangsheng_16_red"
                      ></tg-icon
                      >{{ project_trends.present.exposure_watch_ratio_link_ratio }}%
                    </span>
                    <span
                      v-else-if="project_trends.present.exposure_watch_ratio_link_ratio < 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; font-size: 14px"
                        name="ico-icon_tongyong_xiajiang_16_green"
                      ></tg-icon
                      >{{ Math.abs(project_trends.present.exposure_watch_ratio_link_ratio) }}%
                    </span>
                  </span>
                </div>
                <div>曝光-观看率</div>
              </div>
            </div>
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.present.watch_product_watch_ratio === null
                      ? '--'
                      : project_trends.present.watch_product_watch_ratio + '%'
                  }}
                  <span style="font-size: 12px"
                    ><span
                      v-if="project_trends.present.watch_product_watch_ratio_link_ratio > 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; color: #f30220; font-size: 14px"
                        name="ico-icon_tongyong_shangsheng_16_red"
                      ></tg-icon
                      >{{ project_trends.present.watch_product_watch_ratio_link_ratio }}%
                    </span>
                    <span
                      v-else-if="project_trends.present.watch_product_watch_ratio_link_ratio < 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; font-size: 14px"
                        name="ico-icon_tongyong_xiajiang_16_green"
                      ></tg-icon
                      >{{ Math.abs(project_trends.present.watch_product_watch_ratio_link_ratio) }}%
                    </span>
                  </span>
                </div>
                <div>观看-商品曝光率</div>
              </div>
            </div>
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.present.product_watch_product_click_ratio === null
                      ? '--'
                      : project_trends.present.product_watch_product_click_ratio + '%'
                  }}
                  <span style="font-size: 12px"
                    ><span
                      v-if="project_trends.present.product_watch_product_click_ratio_link_ratio > 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; color: #f30220; font-size: 14px"
                        name="ico-icon_tongyong_shangsheng_16_red"
                      ></tg-icon
                      >{{ project_trends.present.product_watch_product_click_ratio_link_ratio }}%
                    </span>
                    <span
                      v-else-if="
                        project_trends.present.product_watch_product_click_ratio_link_ratio < 0
                      "
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; font-size: 14px"
                        name="ico-icon_tongyong_xiajiang_16_green"
                      ></tg-icon
                      >{{
                        Math.abs(
                          project_trends.present.product_watch_product_click_ratio_link_ratio,
                        )
                      }}%
                    </span>
                  </span>
                </div>
                <div>商品曝光-点击率</div>
              </div>
            </div>
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.present.product_click_pay_ratio === null
                      ? '--'
                      : project_trends.present.product_click_pay_ratio + '%'
                  }}
                  <span style="font-size: 12px"
                    ><span
                      v-if="project_trends.present.product_click_pay_ratio_link_ratio > 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; color: #f30220; font-size: 14px"
                        name="ico-icon_tongyong_shangsheng_16_red"
                      ></tg-icon
                      >{{ project_trends.present.product_click_pay_ratio_link_ratio }}%
                    </span>
                    <span
                      v-else-if="project_trends.present.product_click_pay_ratio_link_ratio < 0"
                      style="text-align: left; padding: 0"
                      class="tgicon"
                      ><tg-icon
                        style="margin: auto 1px; font-size: 14px"
                        name="ico-icon_tongyong_xiajiang_16_green"
                      ></tg-icon
                      >{{ Math.abs(project_trends.present.product_click_pay_ratio_link_ratio) }}%
                    </span>
                  </span>
                </div>
                <div>商品点击-成交转化率</div>
              </div>
            </div>
          </section>
        </div>
        <div v-else class="tg-datacenter-shoplive-funnel" style="padding-top: 100px">
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
      <div
        style="
          margin-left: 8px;
          margin-top: 48px;
          margin-bottom: 32px;
          width: 1px;
          border-left: 1px dashed var(--border-line-div-color);
        "
      ></div>
      <div style="margin-left: 8px; flex: 1">
        <div class="echartTitle" style="margin-bottom: 24px; margin-left: 0px">
          上{{ analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年' }}成交转化漏斗(人数)
        </div>
        <div v-if="project_trends.history" class="tg-datacenter-shoplive-funnel">
          <section class="funnel-line-left">
            <img class="line-part-top" :src="funnel_item_arrow_top" alt="" />
            <div class="line-text-container">
              <div>
                {{
                  project_trends.history.exposure_pay_ratio === null
                    ? '--'
                    : Number(project_trends.history.exposure_pay_ratio || 0) + '%'
                }}
              </div>
              <div>曝光-成交转化率</div>
            </div>
            <img class="line-part-bottom" :src="funnel_item_arrow_bottom" alt="" />
          </section>
          <section class="funnel-items">
            <div class="item" style="width: 300px">
              <img class="img" :src="funnel_item_1" alt="" />
              <span class="text"
                >直播间曝光人数：{{
                  project_trends.history.exposure === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.history.exposure || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 277px">
              <img class="img" :src="funnel_item_2" alt="" />
              <span class="text"
                >直播间观看人数：{{
                  project_trends.history.watch === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.history.watch || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 253px">
              <img class="img" :src="funnel_item_3" alt="" />
              <span class="text"
                >商品曝光人数：{{
                  project_trends.history.product_watch === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.history.product_watch || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 230px">
              <img class="img" :src="funnel_item_4" alt="" />
              <span class="text"
                >商品点击人数：{{
                  project_trends.history.product_click === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.history.product_click || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
            <div class="item" style="width: 206px">
              <img class="img" :src="funnel_item_5" alt="" />
              <span class="text"
                >成交人数：{{
                  project_trends.history.pay === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.history.pay || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )
                }}</span
              >
            </div>
          </section>
          <section class="funnel-line-right">
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.history.exposure_watch_ratio === null
                      ? '--'
                      : formatAmount(
                          Number(project_trends.history.exposure_watch_ratio || 0),
                          'None',
                        ) + '%'
                  }}
                </div>
                <div>曝光-观看率</div>
              </div>
            </div>
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.history.watch_product_watch_ratio === null
                      ? '--'
                      : formatAmount(
                          Number(project_trends.history.watch_product_watch_ratio || 0),
                          'None',
                        ) + '%'
                  }}
                </div>
                <div>观看-商品曝光率</div>
              </div>
            </div>
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.history.product_watch_product_click_ratio === null
                      ? '--'
                      : formatAmount(
                          Number(project_trends.history.product_watch_product_click_ratio || 0),
                          'None',
                        ) + '%'
                  }}
                </div>
                <div>商品曝光-点击率</div>
              </div>
            </div>
            <div class="line-container">
              <img :src="funnel_item_arrow_right" alt="" />
              <div>
                <div>
                  {{
                    project_trends.history.product_click_pay_ratio === null
                      ? '--'
                      : formatAmount(
                          Number(project_trends.history.product_click_pay_ratio || 0),
                          'None',
                        ) + '%'
                  }}
                </div>
                <div>商品点击-成交转化率</div>
              </div>
            </div>
          </section>
        </div>
        <div v-else class="tg-datacenter-shoplive-funnel" style="padding-top: 100px">
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.table-div {
  /deep/ .el-table__body .el-table__row {
    .el-table__cell {
      padding-top: 5px;
      padding-bottom: 5px;
      .cell {
        height: 100%;
        div {
          line-height: 22px;
          height: 22px;
          &.huanbi {
            text-align: left;
            width: 130px;
            padding-left: 36px;
          }
          .left {
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 1;
            display: inline-block;
            width: 100%;
          }
        }
      }
    }
  }
}
.echartTitle {
  font-size: var(--small-font-size);
  color: var(--text-color);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  width: 100%;
  text-align: left;
  padding: 0;
  margin-left: 12px;
}

/deep/ .el-table {
  .el-table__empty-block {
    width: 200px !important;
    height: 200px !important;
    position: absolute;
    top: 20px;
    margin-left: -100px;
  }

  thead > tr > th {
    line-height: 22px;
    padding: 5px 12px !important;
    .cell {
      .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 22px;
        width: 18px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        .sort-caret.ascending {
          // border-bottom-color: #c0c4cc; // ui说点击排序icon要有颜色变化
          top: 0px;
        }
        .sort-caret.descending {
          // border-top-color: #c0c4cc; // ui说点击排序icon要有颜色变化
          bottom: 0px;
        }
      }
    }
  }
}
.tg-datacenter-shoplive-funnel {
  width: 580px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .funnel-line-left {
    margin-right: -85px;
    width: 190px;
    padding-left: 45px;
    .line-part-top {
      height: 97px;
      width: 41px;
      margin-top: 27px;
    }
    .line-text-container {
      margin-left: -35px;
      width: 144px;
      height: 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .line-part-bottom {
      // background: blue;
      height: 116px;
      width: 152px;
    }
    /deep/.tgicon {
      .ico-icon_tongyong_xiajiang_16_green {
        font-size: 14px !important;
      }
      .ico-icon_tongyong_xiajiang_16_red {
        font-size: 14px !important;
      }
    }
  }
  .funnel-items {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 54px;
      margin-top: 12px;
      color: white;
      position: relative;
      font-size: var(--small-font-size);
      &:first-of-type {
        margin-top: 0;
      }
      .img {
        width: 100%;
        height: 100%;
      }
      .text {
        right: 20px;
        position: absolute;
        color: white !important;
      }
    }
  }
  .funnel-line-right {
    margin-left: 12px;
    min-width: 160px;
    .line-container {
      display: flex;
      margin-top: 2px;
      align-items: center;
      &:first-of-type {
        margin-top: 30px;
      }
      > img {
        width: 26px;
        height: 65px;
        margin-right: 16px;
      }
      > div {
        line-height: 23px;
        div:last-child {
          line-height: 16px;
        }
      }

      /deep/.tgicon {
        .ico-icon_tongyong_xiajiang_16_green {
          font-size: 14px !important;
        }
        .ico-icon_tongyong_xiajiang_16_red {
          font-size: 14px !important;
        }
      }
    }
  }
}
/*/deep/ .el-table .el-table__body .el-table__row {
        .el-table__cell:first-child,
        .el-table__cell:nth-child(2) {
          background: #f6f6f6 !important;
        }
      }*/
</style>
