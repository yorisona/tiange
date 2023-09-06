<template>
  <div class="commodity-analysis-monitor">
    <tg-card
      class="flex-none"
      :padding="[16, 0, 16, 16]"
      @rect:update="onTopCardRectUpdate"
      style="border-bottom: 10px #f4f5f6 solid"
    >
      <el-form
        class="filter-form flex-form"
        size="mini"
        :show-message="false"
        :inline="true"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="项目名称：" prop="">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.project_id"
            @change="getProjectId"
            filterable
            style="width: 222px"
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
        <el-form-item label="竞品账号：">
          <el-select
            size="mini"
            popper-class="el-select-popper-mini"
            style="width: 222px"
            clearable
            multiple
            :multiple-limit="3"
            collapse-tags
            collapse-tags-tooltip
            filterable
            v-model="queryForm.shop_name"
            placeholder="请选择竞品账号"
          >
            <el-option
              v-for="item in competitiveList"
              :key="item.shop_name"
              :label="item.shop_name"
              :value="item.shop_name"
            >
              <span>{{ item.shop_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码：" prop="item_id">
          <el-input
            clearable
            v-model.trim="queryForm.item_id"
            placeholder="请输入商品编码"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品款号：">
          <el-input
            clearable
            v-model.trim="queryForm.item_sn"
            placeholder="请输入商品款号"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="一级类目：">
          <el-select
            clearable
            @change="onFirstCatChange"
            v-model="queryForm.first_cat_id"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in firstCatList"
              :key="index"
              :label="item.cat_name"
              :value="item.cat_id"
            >
              <span>{{ item.cat_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级类目：">
          <el-select
            clearable
            v-model="queryForm.third_cat_id"
            @change="onThirdCatChange"
            placeholder="请选择"
            multiple
            :multiple-limit="3"
            collapse-tags
            collapse-tags-tooltip
            filterable
            popper-class="el-select-popper-mini"
          >
            <el-option
              style="width: 100%"
              v-for="item in thirdCatList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品年度：" prop="year">
          <el-select clearable v-model="queryForm.year" placeholder="请选择年度">
            <el-option
              style="width: 100%"
              v-for="item in yearList"
              :key="item.real"
              :label="item.real"
              :value="item.real"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品季度：" prop="season">
          <el-select clearable v-model="queryForm.season" placeholder="请选择季度">
            <el-option
              style="width: 100%"
              v-for="item in quarterList"
              :key="item.real"
              :label="item.real"
              :value="item.real"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态：">
          <el-select clearable v-model="queryForm.product_status" placeholder="请选择上架状态">
            <el-option style="width: 100%" :key="2" label="全部" :value="2" />
            <el-option style="width: 100%" :key="0" label="上架" :value="0" />
            <el-option style="width: 100%" :key="1" label="下架" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="样衣有无：">
          <el-select clearable v-model="queryForm.sample_status" placeholder="请选择样衣有无">
            <el-option style="width: 100%" :key="undefined" label="全部" :value="undefined" />
            <el-option style="width: 100%" :key="1" label="有" :value="1" />
            <el-option style="width: 100%" :key="0" label="无" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item style="width: 300px">
          <tg-button type="primary" @click="onQueryClick">查询</tg-button>
          <tg-button class="mgl-8" @click="onResetClick">重置</tg-button>
          <tg-button class="mgl-8" @click="showSettingClick"> 指标配置 </tg-button>
          <tg-button class="mgl-8" v-loading="exportLoading" @click="exportBtnClick"
            >导出</tg-button
          >
          <tg-button class="mgl-8" @click="importClick"> 导入 </tg-button>
        </el-form-item></el-form
      ></tg-card
    >
    <tg-card
      class="flex-none category-table"
      :padding="[16, 0, 0, 0]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div class="commodity-analysis-system">
        <div class="category-table" :style="{ paddingBottom: list.length > 0 ? '0px' : '32px' }">
          <tg-table
            :key="mainTableKey"
            v-loading="loading"
            :data="list"
            @row-click="onRowClick"
            border
            height="100%"
          >
            <el-table-column
              label="自营店铺"
              :key="querySelectForm.project_id + 'all'"
              :column-key="querySelectForm.project_id + 'all'"
              fixed="left"
              width="306"
            >
              <el-table-column
                label="商品基本信息"
                class-name="department-fund-statement-head-even"
                :key="querySelectForm.project_id + '12'"
                :column-key="querySelectForm.project_id"
                fixed="left"
                width="306"
              >
                <template v-for="(col, subIndex) in shopBaseColumns()">
                  <el-table-column
                    v-bind="col"
                    :key="querySelectForm.project_id + '13' + subIndex"
                    :column-key="querySelectForm.project_id + '10' + subIndex"
                    class-name="department-fund-statement-head-even"
                  />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label=""
              :key="querySelectForm.project_id + 'all2'"
              :column-key="querySelectForm.project_id + 'all2'"
            >
              <el-table-column
                label="商品销售信息"
                v-if="isShowColumn('商品销售信息')"
                :class-name="getClassNameColumn('商品销售信息')"
                :key="querySelectForm.project_id + '2'"
                :column-key="querySelectForm.project_id + '2'"
              >
                <template v-for="(col, subIndex) in shopSaleColumns()">
                  <el-table-column
                    v-bind="col"
                    :key="subIndex"
                    v-if="isShowColumn(col.label)"
                    :class-name="getClassNameColumn('商品销售信息')"
                  />
                </template>
                <el-table-column
                  v-if="isShowColumn('追单')"
                  :render-header="renderHeader"
                  label="追单 （手动维护）"
                  width="98"
                  :class-name="getClassNameColumn('商品销售信息')"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.index === clickRow && clickCellLabel.indexOf('追单') >= 0">
                      <el-input
                        ref="editInput"
                        v-model="scope.row.additional_order"
                        maxlength="300"
                        size="mini"
                        @blur="inputBlur(scope.row)"
                        v-key-enter="
                          () => {
                            inputBlur(scope.row);
                          }
                        "
                      />
                    </div>
                    <div v-else-if="scope.row.additional_order">
                      <el-popover
                        v-if="scope.row.additional_order.length > 15"
                        placement="top"
                        title=""
                        :width="200"
                        trigger="hover"
                      >
                        <template #reference>
                          <div class="information-div">{{ scope.row.additional_order }}</div>
                        </template>
                        <template #default>
                          <div class="cell-input">
                            {{ scope.row.additional_order }}
                          </div>
                        </template>
                      </el-popover>
                      <div class="cell-input" v-else>
                        {{ scope.row.additional_order }}
                      </div>
                    </div>
                    <div class="cell-input" v-else style="color: #c1c1c1">双击输入</div>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="renderHeader"
                  v-if="isShowColumn('当前库存')"
                  label="当前库存 （每日更新）"
                  width="98"
                  prop="stock"
                  align="right"
                  :class-name="getClassNameColumn('商品销售信息')"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.stock !== null
                        ? numberFormat(Number(scope.row.stock || 0), 0, '.', ',')
                        : '--'
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="renderHeader"
                  v-if="isShowColumn('货值')"
                  label="货值 （每日更新）"
                  width="98"
                  align="right"
                  prop="products_worth"
                  :class-name="getClassNameColumn('商品销售信息')"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.products_worth !== null
                        ? formatPriceFormYuan((scope.row.products_worth || 0) / 100, 2, true)
                        : '--'
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="isShowColumn('近7天销售跟踪')"
                label="近7天销售跟踪"
                :class-name="getClassNameColumn('近7天销售跟踪')"
                :key="querySelectForm.project_id + '3'"
                :column-key="querySelectForm.project_id + '3'"
              >
                <template v-for="(col, subIndex) in weekDayArr">
                  <el-table-column
                    :key="subIndex"
                    :class-name="getClassNameColumn('近7天销售跟踪')"
                    :label="col + '销量'"
                    width="98"
                    align="right"
                    v-if="isShowColumn('Day' + (7 - subIndex) + '销量')"
                    ><template slot-scope="scope">
                      {{
                        scope.row.sale_count_list &&
                        scope.row.sale_count_list.length > subIndex &&
                        scope.row.sale_count_list[subIndex].sale_count !== null
                          ? numberFormat(
                              Number(scope.row.sale_count_list[subIndex].sale_count || 0),
                              0,
                              '.',
                              ',',
                            )
                          : '--'
                      }}
                    </template></el-table-column
                  ></template
                >
                <el-table-column
                  :render-header="renderHeader"
                  v-if="isShowColumn('日销量趋势图')"
                  label="日销量趋势图 （每日更新）"
                  width="128"
                  :class-name="getClassNameColumn('近7天销售跟踪')"
                >
                  <template slot-scope="scope">
                    <div
                      class="line"
                      v-if="
                        scope.row.sale_count_list_line && scope.row.sale_count_list_line.length > 1
                      "
                    >
                      <svg>
                        <defs>
                          <marker id="dot" markerWidth="8" markerHeight="8" refX="4" refY="4">
                            <circle cx="4" cy="4" r="2.5"></circle>
                          </marker>
                        </defs>
                        <line
                          v-for="(col, index) in scope.row.sale_count_list_line.slice(
                            0,
                            scope.row.sale_count_list_line.length - 1,
                          )"
                          :x1="col.x + '%'"
                          :y1="col.y + '%'"
                          :x2="scope.row.sale_count_list_line[index + 1].x + '%'"
                          :y2="scope.row.sale_count_list_line[index + 1].y + '%'"
                          :key="index"
                        ></line>
                      </svg>
                    </div>
                    <div
                      v-else-if="
                        scope.row.sale_count_list_line &&
                        scope.row.sale_count_list_line.length === 1
                      "
                      class="circle"
                    />
                    <div v-else style="text-align: center">--</div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="isShowColumn('上周销售跟踪')"
                label="上周销售跟踪"
                :class-name="getClassNameColumn('上周销售跟踪')"
                :key="querySelectForm.project_id + '5'"
                :column-key="querySelectForm.project_id + '5'"
              >
                <template
                  v-for="(col, subIndex) in shopLastSaleColumns(
                    list.length > 0 && list[0].last_week_sale_info
                      ? list[0].last_week_sale_info.week_number || null
                      : null,
                  )"
                >
                  <el-table-column
                    v-bind="col"
                    :key="subIndex"
                    v-if="isShowColumn(col.label, true, '上周销售跟踪')"
                    :class-name="getClassNameColumn('上周销售跟踪')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowColumn('近4周销售跟踪')"
                label="近4周销售跟踪"
                :class-name="getClassNameColumn('近4周销售跟踪')"
                :key="querySelectForm.project_id + '6'"
                :column-key="querySelectForm.project_id + '6'"
              >
                <template
                  v-for="(col, subIndex) in shopWeekSaleColumns(
                    true,
                    0,
                    list.length > 0 ? list[0].last_4week_sale_info || [] : [],
                  )"
                >
                  <el-table-column
                    v-bind="col"
                    :key="subIndex"
                    v-if="
                      isShowColumn(
                        subIndex !== 3 ? '第W-' + (3 - subIndex || '') + '周销量' : '第W周销量',
                        true,
                        '近4周销售跟踪',
                      )
                    "
                    :class-name="getClassNameColumn('近4周销售跟踪')"
                  />
                </template>
                <el-table-column
                  :render-header="renderHeader"
                  v-if="isShowColumn('周销量趋势图', true, '近4周销售跟踪')"
                  label="周销量趋势图 （每周更新）"
                  width="128"
                  :class-name="getClassNameColumn('近4周销售跟踪')"
                >
                  <template slot-scope="scope">
                    <div
                      class="line"
                      v-if="
                        scope.row.last_4week_sale_info_line &&
                        scope.row.last_4week_sale_info_line.length > 1
                      "
                    >
                      <svg>
                        <defs>
                          <marker id="dot" markerWidth="8" markerHeight="8" refX="4" refY="4">
                            <circle cx="4" cy="4" r="2.5"></circle>
                          </marker>
                        </defs>
                        <line
                          v-for="(col, trend_index) in scope.row.last_4week_sale_info_line.slice(
                            0,
                            scope.row.last_4week_sale_info_line.length - 1,
                          )"
                          :x1="col.x + '%'"
                          :y1="col.y + '%'"
                          :x2="scope.row.last_4week_sale_info_line[trend_index + 1].x + '%'"
                          :y2="scope.row.last_4week_sale_info_line[trend_index + 1].y + '%'"
                          :key="trend_index"
                        ></line>
                      </svg>
                    </div>
                    <div
                      v-else-if="
                        scope.row.last_4week_sale_info_line &&
                        scope.row.last_4week_sale_info_line.length === 1
                      "
                      class="circle"
                    />
                    <div v-else style="text-align: center">--</div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="isShowColumn('累计销售统计')"
                label="累计销售统计"
                :class-name="getClassNameColumn('累计销售统计')"
                :key="querySelectForm.project_id + '7'"
                :column-key="querySelectForm.project_id + '7'"
              >
                <template v-for="(col, subIndex) in shopAllSaleColumns()">
                  <el-table-column
                    v-bind="col"
                    :key="subIndex"
                    v-if="isShowColumn(col.label)"
                    :class-name="getClassNameColumn('累计销售统计')"
                  />
                </template>
                <el-table-column
                  :render-header="renderHeader"
                  v-if="isShowColumn('商品健康度')"
                  label="商品健康度/商品质量分 （手动维护）"
                  width="158"
                  :class-name="getClassNameColumn('累计销售统计')"
                >
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.index === clickRow && clickCellLabel.indexOf('商品健康度') >= 0
                      "
                    >
                      <el-input
                        ref="editInput"
                        v-model="scope.row.health"
                        maxlength="300"
                        size="mini"
                        @blur="inputBlur(scope.row)"
                        v-key-enter="
                          () => {
                            inputBlur(scope.row);
                          }
                        "
                      />
                    </div>
                    <div v-else-if="scope.row.health" class="information-div">
                      <el-popover
                        v-if="scope.row.health.length > 20"
                        placement="top"
                        title=""
                        :width="200"
                        trigger="hover"
                      >
                        <template #reference>
                          <div class="information-div">{{ scope.row.health }}</div>
                        </template>
                        <template #default>
                          <div class="cell-input">
                            {{ scope.row.health }}
                          </div>
                        </template>
                      </el-popover>
                      <div class="cell-input" v-else>
                        {{ scope.row.health }}
                      </div>
                    </div>
                    <div class="cell-input" v-else style="color: #c1c1c1">双击输入</div>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="renderHeader"
                  v-if="isShowColumn('商品策略建议')"
                  label="商品策略建议 （手动维护）"
                  width="128"
                  :class-name="getClassNameColumn('累计销售统计')"
                >
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.index === clickRow && clickCellLabel.indexOf('商品策略建议') >= 0
                      "
                    >
                      <el-input
                        ref="editInput"
                        v-model="scope.row.advice"
                        maxlength="300"
                        size="mini"
                        @blur="inputBlur(scope.row)"
                        v-key-enter="
                          () => {
                            inputBlur(scope.row);
                          }
                        "
                      />
                    </div>
                    <div v-else-if="scope.row.advice" class="information-div">
                      <el-popover
                        v-if="scope.row.advice.length > 20"
                        placement="top"
                        title=""
                        :width="200"
                        trigger="hover"
                      >
                        <template #reference>
                          <div class="information-div">{{ scope.row.advice }}</div>
                        </template>
                        <template #default>
                          <div class="cell-input">
                            {{ scope.row.advice }}
                          </div>
                        </template>
                      </el-popover>
                      <div class="cell-input" v-else>
                        {{ scope.row.advice }}
                      </div>
                    </div>
                    <div class="cell-input" v-else style="color: #c1c1c1">双击输入</div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="isShowColumn('商品基本属性')"
                :class-name="getClassNameColumn('商品基本属性')"
                label="商品基本属性"
                :key="querySelectForm.project_id + '8'"
                :column-key="querySelectForm.project_id + '8'"
              >
                <template v-for="(col, subIndex) in shopAllBaseColumns()">
                  <el-table-column
                    v-bind="col"
                    :key="subIndex"
                    v-if="isShowColumn(col.label)"
                    :class-name="getClassNameColumn('商品基本属性')"
                  />
                </template>
                <el-table-column
                  v-if="isShowColumn('其他字段')"
                  label="其他字段"
                  :class-name="getClassNameColumn('商品基本属性')"
                  align="center"
                  min-width="97"
                  fixed="center"
                  prop="view"
                  ><template slot-scope="scope">
                    <template
                      v-if="
                        scope.row.prop_info_list &&
                        scope.row.prop_info_list.filter(item => {
                          return item.value;
                        }).length > 0
                      "
                    >
                      <el-popover placement="left" :width="300" trigger="click">
                        <template #reference>
                          <a type="link" class="m-2">完整字段</a>
                        </template>
                        <template #default>
                          <div class="el-dialog-center-pover">
                            <template v-for="item in scope.row.prop_info_list">
                              <div v-if="item.value" :key="item.name" class="more-div line">
                                <span>{{ item.name }}</span>
                                <span>{{ item.value }}</span>
                              </div>
                            </template>
                          </div>
                        </template>
                      </el-popover>
                    </template>
                    <template v-else>--</template>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <template v-if="shop_name_list && shop_name_list.length > 0">
              <template v-if="isShowColumn('近4周销售跟踪', false)">
                <el-table-column
                  :show-overflow-tooltip="true"
                  v-for="(shop_name, index) in shop_name_list"
                  :label="shop_name"
                  :key="shop_name"
                  :column-key="shop_name"
                  :class-name="
                    (index + 1 + showColumnArr.slice(0, 6).filter(it => it).length) % 2 === 0
                      ? 'department-fund-statement-head-even'
                      : 'department-fund-statement-head-odd'
                  "
                  ><el-table-column
                    v-if="isShowColumn('近4周销售跟踪', false, '近4周销售跟踪')"
                    label="近4周销售跟踪"
                    :class-name="
                      (index + 1 + showColumnArr.slice(0, 6).filter(it => it).length) % 2 === 0
                        ? 'department-fund-statement-head-even'
                        : 'department-fund-statement-head-odd'
                    "
                    :key="shop_name + '1'"
                    :column-key="shop_name + '1'"
                  >
                    <template
                      v-for="(col, subIndex) in shopWeekSaleColumns(
                        false,
                        index,
                        list.length > 0 &&
                          list[0].competitive_sku_info_list &&
                          list[0].competitive_sku_info_list.length > 0
                          ? list[0].competitive_sku_info_list[0].last_4week_sale_info || []
                          : [],
                      )"
                    >
                      <el-table-column
                        v-bind="col"
                        :key="subIndex"
                        v-if="
                          isShowColumn(
                            subIndex !== 3 ? '第W-' + (3 - subIndex || '') + '周销量' : '第W周销量',
                            false,
                            '近4周销售跟踪',
                          )
                        "
                        :class-name="
                          (index + 1 + showColumnArr.slice(0, 6).filter(it => it).length) % 2 === 0
                            ? 'department-fund-statement-head-even'
                            : 'department-fund-statement-head-odd'
                        "
                      />
                    </template>
                    <el-table-column
                      :render-header="renderHeader"
                      v-if="isShowColumn('周销量趋势图', false, '近4周销售跟踪')"
                      label="周销量趋势图 （每周更新）"
                      width="128"
                      :class-name="
                        (index + 1 + showColumnArr.slice(0, 6).filter(it => it).length) % 2 === 0
                          ? 'department-fund-statement-head-even'
                          : 'department-fund-statement-head-odd'
                      "
                    >
                      <template slot-scope="scope">
                        <div
                          class="line"
                          v-if="
                            scope.row.competitive_sku_info_list[index].last_4week_sale_info_line &&
                            scope.row.competitive_sku_info_list[index].last_4week_sale_info_line
                              .length > 1
                          "
                        >
                          <svg>
                            <defs>
                              <marker id="dot" markerWidth="8" markerHeight="8" refX="4" refY="4">
                                <circle cx="4" cy="4" r="2.5"></circle>
                              </marker>
                            </defs>
                            <line
                              v-for="(col, thirdIndex) in scope.row.competitive_sku_info_list[
                                index
                              ].last_4week_sale_info_line.slice(
                                0,
                                scope.row.competitive_sku_info_list[index].last_4week_sale_info_line
                                  .length - 1,
                              )"
                              :x1="col.x + '%'"
                              :y1="col.y + '%'"
                              :x2="
                                getXY(
                                  'x',
                                  index,
                                  thirdIndex + 1,
                                  scope.row.competitive_sku_info_list,
                                ) + '%'
                              "
                              :y2="
                                getXY(
                                  'y',
                                  index,
                                  thirdIndex + 1,
                                  scope.row.competitive_sku_info_list,
                                ) + '%'
                              "
                              :key="thirdIndex"
                            ></line>
                          </svg>
                        </div>
                        <div
                          v-else-if="
                            scope.row.competitive_sku_info_list[index].last_4week_sale_info_line &&
                            scope.row.competitive_sku_info_list[index].last_4week_sale_info_line
                              .length === 1
                          "
                          class="circle"
                        />
                        <div v-else style="text-align: center">--</div>
                      </template>
                    </el-table-column>
                  </el-table-column></el-table-column
                >
              </template>
              <el-table-column
                v-if="isShowColumn('累计销量', false)"
                label="竞店累计销量"
                :key="querySelectForm.project_id + 'sale'"
                :column-key="querySelectForm.project_id + 'sale'"
                :class-name="
                  (queryForm.shop_name.length +
                    1 +
                    showColumnArr.slice(0, 6).filter(it => it).length) %
                    2 ===
                  0
                    ? 'department-fund-statement-head-even'
                    : 'department-fund-statement-head-odd'
                "
              >
                <el-table-column
                  width="128"
                  v-if="isShowColumn('累计销量', false)"
                  label="累计销量"
                  align="right"
                  :class-name="
                    (queryForm.shop_name.length +
                      1 +
                      showColumnArr.slice(0, 6).filter(it => it).length) %
                      2 ===
                    0
                      ? 'department-fund-statement-head-even'
                      : 'department-fund-statement-head-odd'
                  "
                  ><template slot-scope="scope">
                    {{
                      scope.row.competitive_total_sale_count !== null
                        ? numberFormat(
                            Number(scope.row.competitive_total_sale_count || 0),
                            0,
                            '.',
                            ',',
                          )
                        : '--'
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="销售差异对比"
                v-if="isShowColumn('销售差异预警', false)"
                :key="querySelectForm.project_id + 'diff'"
                :column-key="querySelectForm.project_id + 'diff'"
                :class-name="
                  (queryForm.shop_name.length + showColumnArr.slice(0, 6).filter(it => it).length) %
                    2 ===
                  0
                    ? 'department-fund-statement-head-even'
                    : 'department-fund-statement-head-odd'
                "
              >
                <el-table-column
                  width="128"
                  :render-header="renderHeader"
                  v-if="isShowColumn('销售差异预警', false)"
                  label="销量差异预警 （上周销量对比）"
                  align="right"
                  :class-name="
                    (queryForm.shop_name.length +
                      showColumnArr.slice(0, 6).filter(it => it).length) %
                      2 ===
                    0
                      ? 'department-fund-statement-head-even'
                      : 'department-fund-statement-head-odd'
                  "
                  ><template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          scope.row.difference > 50 ? 'var(--error-color)' : 'var(--text-color)',
                      }"
                    >
                      {{ scope.row.difference !== null ? scope.row.difference : '--' }}
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
            <template #empty>
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
          </tg-table>
          <el-pagination
            :current-page.sync="queryForm.page_num"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryForm.num"
            layout="total, prev, pager, next, sizes, jumper"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handlePageSizeChange"
            v-if="total > 0"
          />
        </div>
      </div>
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less">
.el-dialog-center-pover {
  min-height: 150px;
  max-height: 300px;
  overflow: auto;
  .more-div {
    padding: 12px 4px;
    display: flex;
    font-size: 12px;
    color: var(--text-color);
    > span:first-child {
      width: 100px;
      color: var(--text-third-color);
    }
    .el-check-div {
      display: flex;
      font-size: 12px;
      margin-bottom: 12px;
      .el-checkbox {
        width: 120px;
        margin-right: 30px;
      }
      .el-checkbox__input .el-checkbox__inner,
      .el-checkbox__label {
        font-size: 12px;
      }
      .el-checkbox-group {
        display: grid;
        width: 500px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import './index.less';
</style>
