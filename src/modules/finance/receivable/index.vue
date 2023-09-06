<template>
  <div class="finance-receivable-page flex-auto" style="padding-bottom: 0px">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" :show-message="false" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="业务类型：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="queryForm.receivable_type"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, key) in BusinessTypeOptions"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="核销状态：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="queryForm.write_off_status"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option label="已核销" :value="2" />
                <el-option label="部分核销" :value="1" />
                <el-option label="未核销" :value="0" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="min-width: 314px">
            <el-form-item
              label="项目搜索："
              class="form-item-group"
              @keypress.enter.native="getList"
            >
              <el-input
                placeholder="请输入关键字"
                v-model.trim="queryForm.search_value"
                maxlength="100"
                clearable
                class="input-with-select"
                style="width: 234px"
                v-key-enter="onQuerySearchClick"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  placeholder="请选择"
                  v-model="queryForm.search_type"
                  style="width: 100px; padding-left: 6px"
                  slot="prepend"
                >
                  <el-option label="应收编号" :value="1" />
                  <el-option label="项目编号" :value="2" />
                  <el-option label="项目名称" :value="3" />
                  <el-option label="结算单号" :value="4" />
                  <!-- <el-option label="客户经理" :value="5" /> -->
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="客户经理：">
              <el-input
                placeholder="请输入关键字"
                v-model="queryForm.customer_manager"
                v-key-enter="onQuerySearchClick"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="结算公司：">
              <el-input
                placeholder="请输入关键字"
                v-model="queryForm.company_name"
                v-key-enter="onQuerySearchClick"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="品牌：">
              <el-input
                placeholder="请输入关键字"
                v-model="queryForm.brand_name"
                v-key-enter="onQuerySearchClick"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="结算周期：">
              <el-date-picker
                type="month"
                placeholder="选择月"
                style="width: 100%"
                format="yyyy.MM"
                value-format="yyyy-MM"
                v-model="queryForm.settlement_date"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px">
            <el-form-item label="账期：">
              <el-date-picker
                type="month"
                placeholder="选择账期"
                style="width: 100%"
                format="yyyy.MM"
                value-format="yyyy.MM"
                v-model="queryForm.account_detail_date"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="width: 314px; display: flex">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
                <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
                <tg-button class="mgl-8" :disabled="isDisabled" @click="exportQuick"
                  >导出</tg-button
                >
              </div>
            </el-form-item>
            <div class="reverse-div">
              <el-checkbox @change="onQuerySearchClick" v-model="isHideReversed" size="small">
                <span>隐藏已冲销数据</span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10"
      style="flex-grow: 1"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <el-table stripe border :data="list" v-loading="loading" v-bind="tableProps">
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <el-table-column label="业务类型" min-width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.business_type ? BusinessTypeMap.get(scope.row.business_type) : '--' }}
          </template>
        </el-table-column>
        <el-table-column className="project-info-column" label="项目信息" min-width="192">
          <template slot-scope="scope">
            <div @click="goProjectDetail(scope.row)">
              <el-popover
                v-if="scope.row.project_name && scope.row.project_name.length > 12"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.project_name"
              >
                <p slot="reference" class="line-clamp-1 empty-data-line hover-link">
                  {{ scope.row.project_name }}
                </p>
              </el-popover>
              <p v-else class="line-clamp-1 empty-data-line hover-link">
                {{ scope.row.project_name | emptyData }}
              </p>
            </div>
            <!--<div @click="goProjectDetail(scope.row)">
                <p class="empty-data-line color-a4b2c2 hover-link">{{ scope.row.project_uid }}</p>
                </div>-->
          </template>
        </el-table-column>
        <el-table-column label="客户公司" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.customer_company_name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="客户经理" min-width="110" align="center">
          <template slot-scope="scope">{{ scope.row.customer_manager || '--' }}</template>
        </el-table-column>
        <el-table-column label="创建日期" min-width="110" align="center">
          <template slot-scope="scope">{{ scope.row.create_date }}</template>
        </el-table-column>
        <el-table-column
          v-for="(col, colIndex) in columns2"
          v-bind="col"
          :key="`col2-${colIndex}`"
        />
        <el-table-column label="核销状态" min-width="112" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p
                v-if="
                  scope.row.gather_type === 5
                    ? scope.row.refund_write_off_status === 2
                    : scope.row.write_off_status === 2
                "
                class="write-on"
              >
                <write-list-pop
                  v-if="writeOffPopoverVisible(scope.row)"
                  :list="writeOffPopoverInfo(scope.row)"
                  btntitle="已核销"
                  btncolor="var(--text-color)"
                ></write-list-pop>
                <template v-else>已核销</template>
              </p>
              <p
                v-else-if="
                  scope.row.gather_type === 5
                    ? scope.row.refund_write_off_status === 1
                    : scope.row.write_off_status === 1
                "
                class="write-off"
              >
                <write-list-pop
                  v-if="writeOffPopoverVisible(scope.row)"
                  :list="writeOffPopoverInfo(scope.row)"
                  btntitle="部分核销"
                  btncolor="#ff7a36"
                ></write-list-pop>
                <template v-else>部分核销</template>
              </p>
              <p v-else class="write-off">未核销</p>
            </div>
            <!--<div v-if="writeOffPopoverVisible(scope.row)" class="line-info">
                <p class="label-50">详情：</p>
                <write-list-pop :list="writeOffPopoverInfo(scope.row)" />
                </div>-->
          </template>
        </el-table-column>
        <template #empty>
          <empty-common detail-text="暂无应收"></empty-common>
        </template>
      </el-table>
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
    </tg-card>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less">
@import './index.less';
.finance-receivable-page {
  .tg-btn-link {
    font-size: 12px;
  }
}
</style>
