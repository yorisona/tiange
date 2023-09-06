<template>
  <section>
    <el-table
      :data="starTableData"
      stripe
      :header-cell-style="{ background: '#f0f1f2', padding: '8px 0' }"
      size="medium"
      max-height="450"
    >
      <el-table-column label="头像" align="center" width="100">
        <template v-slot="scope">
          <img :src="scope.row.pic_url" width="60px" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="主播信息">
        <template v-slot="scope">
          <div class="slot-star">
            <p>
              昵&#12288;称：<span>{{ scope.row.star_name }}</span>
            </p>
            <p>
              主播ID：<span>{{ scope.row.star_id }}</span>
            </p>
            <p>
              淘客ID：<span>{{
                scope.row.wangwang_name === '' ? '-' : scope.row.wangwang_name
              }}</span>
            </p>
            <p>
              粉丝数：<span>{{ scope.row.fans_number }}万</span>
            </p>
            <p>
              配合度：<span class="rate-icon"
                ><el-rate disabled v-model="scope.row.responsivity"></el-rate
              ></span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="主播报价及成本/元">
        <template v-slot="scope">
          <div class="slot-star">
            <p>
              混播报价：<span>{{
                scope.row.star_mix_price === 0 ? '-' : scope.row.star_mix_price
              }}</span>
            </p>
            <p>
              混播成本：<span>{{
                scope.row.star_mix_cost === 0 ? '-' : scope.row.star_mix_cost
              }}</span>
            </p>
            <p>
              专场报价：<span>{{
                scope.row.star_special_price === 0 ? '-' : scope.row.star_special_price
              }}</span>
            </p>
            <p>
              专场成本：<span>{{
                scope.row.star_special_cost === 0 ? '-' : scope.row.star_special_price
              }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品属性">
        <template v-slot="scope">
          <div class="slot-star">
            <p>
              品类：<span>{{ scope.row.category }}</span>
            </p>
            <p>
              客单价：<span>{{ salesFormat(scope.row) }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最近15场场均PV/万">
        <template v-slot="scope">
          <div class="slot-star">
            <p>
              混播：<span>{{ scope.row.latest_15_mix_pv }}</span>
            </p>
            <p>
              专场：<span>{{ scope.row.latest_15_special_pv }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最近30款产品点击数">
        <template v-slot="scope">
          <div class="slot-star">
            <p
              v-show="scope.row.cate_click_num_items.length > 0"
              v-for="(item, index) in scope.row.cate_click_num_items"
              :key="index"
            >
              {{ item[0] }}：
              <span>{{ item[1] }} 次</span>
            </p>
            <p v-show="scope.row.cate_click_num_items.length === 0">暂无数据~</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="安排场次数" v-if="!isReplaceStar">
        <template>
          <div class="arrange-display-num">
            <el-select size="mini" v-model="display_num" placeholder="请选择">
              <el-option
                v-for="item in 5"
                :key="item"
                :value="item"
                :label="item + '场'"
                @click.native="clickDisplayNum"
              >
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { salesFormat } from '@/utils/format';

export default {
  name: 'addStar',
  props: ['starTableData', 'isReplaceStar'],
  data() {
    return {
      display_num: '1场',
    };
  },
  methods: {
    clickDisplayNum() {
      this.$emit('pass-star-id', this.display_num);
    },
    salesFormat,
  },
};
</script>

<style lang="less" scoped>
.slot-star {
  p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 20px;
    color: var(--text-des-color);
    span {
      color: #666;
    }
  }
}
.arrange-display-num {
  width: 66%;
}
</style>
<style lang="less">
.rate-icon {
  .el-rate {
    display: inline-block;
    .el-rate__icon,
    .el-icon-star-on {
      font-size: 14px !important;
      margin: 0;
    }
  }
}
</style>
