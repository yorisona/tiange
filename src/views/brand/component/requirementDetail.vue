<template>
  <el-row class="edit-demand-row">
    <el-row :gutter="5">
      <el-col :span="8">
        <div>
          <p>品牌名称：</p>
          <span>{{ requirementDetailInfo.brand_name }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>提报时间：</p>
          <span>{{ showProDateFormat(requirementDetailInfo.report_date) }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>预&#12288;算：</p>
          <span>{{ requirementDetailInfo.budget }}元</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <div>
          <p>需求名称：</p>
          <span>{{ requirementDetailInfo.requirement_name }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>直播类型：</p>
          <span>{{ displayTypeFormate(requirementDetailInfo) }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>返&#12288;点：</p>
          <span>{{ requirementDetailInfo.rebate }} 元</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-bottom: 14px">
      <el-col :span="8">
        <div>
          <p>需求介绍：</p>
          <span>{{
            requirementDetailInfo.introduce === '' ? '-' : requirementDetailInfo.introduce
          }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>KPI 指标：</p>
          <span v-show="requirementDetailInfo.kpi_sales_amount !== -1"
            >{{ requirementDetailInfo.kpi_sales_amount }}元(销售额)</span
          >
          <span v-show="requirementDetailInfo.kpi_uv !== -1"
            >{{ requirementDetailInfo.kpi_uv }}次(UV)</span
          >
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>利润率：</p>
          <span>{{ requirementDetailInfo.profit }} %</span>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import { showProDateFormat, displayTypeFormate } from '@/utils/format';

export default {
  name: 'requirementDetail',
  props: ['requirementDetailInfo', 'brandList'],
  data() {
    return {};
  },
  methods: {
    showProDateFormat,
    displayTypeFormate,
  },
};
</script>

<style lang="less" scoped>
.edit-demand-row {
  background: #fff;
  padding: 10px 10px 10px 50px;
  .el-col {
    div {
      overflow: hidden;
      white-space: nowrap;
      margin: 6px 0;
      p {
        display: inline-block;
        margin: 0;
        color: var(--text-des-color);
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        display: inline-block;
        color: #666;
        width: calc(100% - 80px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
