/*
 * @Author: 肖槿
 * @Date: 2022-02-18 13:50:41
 * @Description:商品大盘分析
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 17:06:29
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\marketAnalysis\index.tsx
 */
import { defineComponent, SetupContext, onMounted, ref } from '@vue/composition-api';
import { useMarket, ExportList } from '@/modules/datacenter/marketAnalysis/use';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import BaseMapEcharts from '@/modules/datacenter/components/baseMap/chart.vue';
import moment from 'moment';
// import { DateStr } from '@/types/base/advanced';

export default defineComponent({
  name: 'marketAnalysis',
  components: {
    BaseMapEcharts,
    BaseEcharts,
    Empty,
  },
  setup(_, ctx: SetupContext) {
    const {
      loading: cateLoading,
      getTableData,
      getCategory,
      categoryParams,
      categoryList,
      analysisData,
      echartsLoading,
      categoryColumn,
      echartsAgeList,
      echartsPriceList,
      baseOptions,
      areaColumn,
      echartsRegionList,
      getEchartsData,
    } = useMarket(ctx);
    const currentCate = ref({
      cat_id: '',
      cat_name: '',
      date: '',
      search_type: 1,
    });
    const dateType = ref(1);
    const search = async () => {
      await getTableData({ ...categoryParams.value, search_type: dateType.value });
      currentCate.value.cat_id = analysisData.value[0]?.cat_id;
      currentCate.value.cat_name = analysisData.value[0]?.cat_name;
      currentCate.value.date = categoryParams.value.date;
      currentCate.value.search_type = dateType.value;
      await getEchartsData(currentCate.value);
      (ctx.refs.myChart as unknown as { updateData: () => void })?.updateData();
    };
    const exportCategory = () => {
      if (!categoryParams.value.date || !categoryParams.value.cat_id) {
        ctx.root.$message.warning('请选择类目和日期');
        return;
      }
      ExportList(
        { ...categoryParams.value, search_type: dateType.value },
        '/api/data_center/export_douyin_category_image',
      );
    };
    const categoryRowClick = async (row: any) => {
      if (!row) return;
      currentCate.value.cat_name = row.cat_name;
      const params = {
        cat_id: row.cat_id,
        date: categoryParams.value.date,
        search_type: dateType.value,
      };
      await getEchartsData(params);
      (ctx.refs.myChart as unknown as { updateData: () => void })?.updateData();
    };
    const timeChange = (val: string) => {
      const startDate = moment(val);
      if (dateType.value === 1) {
        startDate.startOf('week');
      } else {
        startDate.startOf('month');
      }
      categoryParams.value.date = startDate.format('YYYY-MM-DD');
    };
    onMounted(() => {
      getCategory();
      search();
    });
    return {
      search,
      categoryParams,
      categoryList,
      cateLoading,
      echartsAgeList,
      echartsPriceList,
      currentCate,
      echartsRegionList,
      echartsLoading,
      categoryColumn,
      baseOptions,
      analysisData,
      areaColumn,
      timeChange,
      exportCategory,
      categoryRowClick,
      dateType,
    };
  },
  render() {
    return (
      <div class="data-center-market-analysis">
        <div class="competitor-form">
          <el-form class="filter-form flex-form" inline label-width="60px" size="mini">
            <el-form-item label=" 选择类目：" prop="">
              <el-select
                popper-class="el-select-popper-mini"
                placeholder="请选择类目"
                v-model={this.categoryParams.cat_id}
                filterable
              >
                {this.categoryList.map((item: any) => {
                  return <el-option label={item.cat_name} key={item.cat_id} value={item.cat_id} />;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="日期：" label-width="42px">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.dateType}
                class="search-type-select"
                onchange={() => {
                  this.timeChange(this.categoryParams.date);
                }}
              >
                <el-option label="按周分析" value={1} />
                <el-option label="按月分析" value={2} />
              </el-select>
              <el-date-picker
                class="search-type-date"
                v-model={this.categoryParams.date}
                picker-options={{
                  firstDayOfWeek: 1,
                }}
                type={this.dateType === 1 ? 'week' : 'month'}
                clearable={false}
                format={this.dateType === 1 ? 'yyyy.MM.dd 第 WW 周' : 'yyyy.MM'}
                value-format={this.dateType === 1 ? 'yyyy-MM-dd' : 'yyyy-MM'}
                placeholder={this.dateType === 1 ? '选择周' : '选择月'}
                onChange={this.timeChange}
              />
            </el-form-item>
            <el-form-item>
              <tg-button type="primary" onClick={this.search}>
                查询
              </tg-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="competitor-main">
          <div class="competitor-category">
            <div class="action-btn">
              <div style="display:flex;alian-item:center">
                <tg-button
                  type="default"
                  icon="ico-btn-export"
                  download
                  onClick={this.exportCategory}
                >
                  导出类目数据
                </tg-button>
              </div>
              <div>
                <tg-table
                  ref="tableRef"
                  border
                  highlight-current-row={true}
                  v-loading={this.cateLoading}
                  height="370"
                  onrow-click={this.categoryRowClick}
                  class="market-analysis-table category-market-table"
                  row-class-name={({ rowIndex }: { rowIndex: number }) => {
                    if (rowIndex === 0) return 'market-analysis-first';
                    return 'market-analysis-second';
                  }}
                  columns={this.categoryColumn}
                  data={this.analysisData}
                  scopedSlots={{
                    empty: () => {
                      return (
                        <div style="position: static;">
                          <empty-common detail-text="暂无数据~"></empty-common>
                        </div>
                      );
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div class="competitor-export">
            <h4 class="title">
              当前分析类目: <span>{this.currentCate.cat_name}</span>
            </h4>
            <div class="price-range-and-area-and-region" v-loading={this.echartsLoading}>
              <div class="price-range-and-age">
                <div class="price-range">
                  <div class="sub-title">商品价格区间</div>
                  <div class="progress-main">
                    {this.echartsPriceList.map((item: any) => {
                      return (
                        <div class="row">
                          <span class="label">{item.interval}</span>
                          <el-progress
                            color="#4DCB73"
                            show-text={false}
                            class="price-progress"
                            percentage={item.value}
                          />
                          <span class="unit">{item.ratio}%</span>
                        </div>
                      );
                    })}
                    {this.echartsPriceList.length === 0 && (
                      <empty-common
                        img-height="100"
                        img-width="150"
                        style="margin-top: 50px;"
                        detail-text="暂无数据~"
                      />
                    )}
                  </div>
                </div>
                <div class="age-range">
                  <div class="sub-title">年龄分布</div>
                  <div class="range-main">
                    {this.echartsAgeList.length ? (
                      <base-echarts style="width: 100%" options={this.baseOptions}></base-echarts>
                    ) : (
                      <empty-common
                        style="margin-top:78px"
                        img-height="100"
                        img-width="150"
                        detail-text="暂无数据~"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div class="region-range">
                <div class="sub-title">地域分布</div>
                <div class="map-and-table">
                  <div class="echarts-map">
                    {this.echartsRegionList.length ? (
                      <base-map-echarts
                        ref="myChart"
                        map-data={this.echartsRegionList.map(item => ({
                          name: item.name,
                          value: item.ratio,
                        }))}
                      ></base-map-echarts>
                    ) : (
                      <empty-common
                        img-height="100"
                        img-width="150"
                        detail-text="暂无数据~"
                        style="margin-top:178px"
                      />
                    )}
                  </div>
                  <div class="border"></div>
                  <div class="echarts-table">
                    <tg-table
                      ref="tableRef"
                      style="width: 100%;"
                      height="93%"
                      stripe
                      class="market-analysis-table cctv"
                      columns={this.areaColumn}
                      data={this.echartsRegionList}
                      scopedSlots={{
                        empty: () => {
                          return (
                            <div style="position: static;">
                              <empty-common
                                img-height="100"
                                img-width="150"
                                detail-text="暂无数据~"
                              ></empty-common>
                            </div>
                          );
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
