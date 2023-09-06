<template>
  <div class="wrap" v-loading="loading">
    <tg-table
      :data="res"
      row-key="id"
      stripe
      class="table"
      border
      :row-style="rowHightlight"
      :show-summary="false"
    >
      <el-table-column
        prop="name"
        label=""
        align="center"
        class-name="rightBorderColor"
        :show-overflow-tooltip="true"
        min-width="80"
      >
      </el-table-column>
      <template v-for="(v, i) in data.size_list">
        <el-table-column :label="v" class-name="rightBorderColor" :key="i">
          <el-table-column
            class-name="sub_cell"
            :prop="`warehouse_stock_num${v}`"
            label="在仓"
            min-width="60"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            :prop="`refund_stock_num${v}`"
            label="退货"
            min-width="60"
            align="center"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
      </template>
    </tg-table>
  </div>
</template>

<script>
import { QueryShopLiveDouyinItemPlaceOrderStyleStock } from '@/services/datacenter';
import { sleep } from '@/utils/func';
export default {
  components: {},
  data() {
    return {
      loading: false,
      data: {
        size_list: ['L', 'M', 'S', 'XL'],
      },
      res: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    convertData(data) {
      const res = [];
      data.color_list.forEach((color, colorIndex) => {
        const colorObj = {
          name: color,
        };
        data.size_list.forEach((size, sizeIndex) => {
          const row = data.row_list[colorIndex][sizeIndex];
          const warehouseStockKey = `warehouse_stock_num${size}`;
          const refundStockKey = `refund_stock_num${size}`;

          colorObj[warehouseStockKey] = row.warehouse_stock_num;
          colorObj[refundStockKey] = row.refund_stock_num;
        });
        res.push(colorObj);
      });
      return res;
    },
    async show({ project_id, product_id }) {
      console.log('show', { project_id, product_id });
      if (product_id) {
        this.loading = true;
        const [{ data: res }, _] = await Promise.all([
          await QueryShopLiveDouyinItemPlaceOrderStyleStock({ project_id, product_id }),
          await sleep(200),
        ]);
        this.loading = false;
        console.log(res, 'res');
        if (res.success) {
          this.data = res.data;
          this.res = this.convertData(this.data);
        }
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.wrap {
  padding: 18px 18px 24px;
  min-width: 400px;
  max-width: 800px;
  /deep/.el-table thead > tr > th.el-table__cell {
    border-bottom-width: 1px !important;
  }
}
</style>
