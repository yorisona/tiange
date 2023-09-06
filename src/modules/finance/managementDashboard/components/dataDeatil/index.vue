<template>
  <div style="margin: 0 18px; overflow: hidden">
    <!--:show-summary="true"
     :summary-method="getSummaries"
     -->
    <el-table
      border
      :data="newList"
      v-loading="loading"
      height="calc(100vh - 222px)"
      :span-method="tableSpanMethod"
    >
      <el-table-column
        prop="depart_ment"
        label="业务组"
        min-width="100"
        fixed="left"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scoped">
          <div :class="getClassName(scoped.row)">
            <span class="left">{{ scoped.row.depart_ment }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="project_name"
        label="项目名称"
        min-width="120"
        fixed="left"
        align="left"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scoped">
          <div :class="getClassName(scoped.row)">
            <span class="spanname left">{{ scoped.row.project_name }}</span>
          </div>
        </template>
      </el-table-column>
      <template v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
        <el-table-column
          :label="item + '月 (环比)'"
          :key="item + 'detail'"
          min-width="220"
          :class-name="Number(currentMonth) < item ? 'issubaftermonth' : ''"
          prop="allValue"
          align="right"
        >
          <template slot-scope="scoped">
            <div :class="getClassName(scoped.row)">
              <div
                style="display: flex; justify-content: center; padding: 0 !important"
                :style="{
                  marginRight: scoped.row[monthRateType[item - 1]]
                    ? '0px'
                    : LineRateList[item - 1].isLineValueRate
                    ? LineRateList[item - 1].isLineRate
                      ? '95px'
                      : '30px'
                    : '0px',
                }"
              >
                <span
                  style="display: inline-block; width: 140px; text-align: right; line-height: 22px"
                  :style="{
                    width: LineRateList[item - 1].isLineValueRate ? '140px' : '100%',
                    textAlign: LineRateList[item - 1].isLineValueRate ? 'right' : 'center',
                  }"
                  class="spanname"
                  >{{ getNewAmount(scoped.row[monthType[item - 1]], item) }}</span
                ><span
                  v-if="scoped.row[monthRateType[item - 1]] > 0"
                  style="display: inline-block; width: 20px; text-align: left; padding-top: 0px"
                  class="tgicon"
                  ><tg-icon
                    style="margin: auto 1px auto 6px"
                    name="ico-icon_tongyong_shangsheng_16_red"
                  ></tg-icon>
                </span>
                <span
                  v-if="scoped.row[monthRateType[item - 1]] < 0"
                  style="display: inline-block; width: 20px; text-align: left; padding-top: 0px"
                  class="tgicon"
                  ><tg-icon
                    style="margin: auto 1px auto 6px"
                    name="ico-icon_tongyong_xiajiang_16_green"
                  ></tg-icon>
                </span>
                <span
                  v-if="scoped.row[monthRateType[item - 1]]"
                  style="
                    display: inline-block;
                    width: 86px;
                    text-align: left;
                    color: #a4b2c2;
                    line-height: 22px;
                  "
                  class="spanname"
                >
                  {{ getNewRate(scoped.row[monthRateType[item - 1]]) }}
                  <!--{{
                  numberFormat(Number(scoped.row[monthratetype[item - 1]] || 0) * 100, 2, '.', '')
                }}-->
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="合计" fixed="right" min-width="150" align="right" prop="allValue">
        <template slot-scope="scoped">
          <div :class="getClassName(scoped.row)">
            <div
              style="line-height: 22px; padding: 0 !important; padding-right: 12px !important"
              class="amountdiv"
            >
              <!--            {{ scoped.row['allValue'] || '&#45;&#45;' }}-->
              {{ getNewAmount(scoped.row['allValue'], 1) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 空白页 -->
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
/deep/ .el-table {
  .el-table__header-wrapper .el-table__header {
    thead {
      tr:last-child {
        th {
          border-top: 1px solid var(--table-border-color);
        }
      }
    }
  }
  .el-table__fixed-right .el-table__fixed-header-wrapper {
    thead {
      tr:last-child {
        th {
          border-top: 1px solid var(--table-border-color);
        }
      }
    }
  }
  .issubaftermonth {
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0MTBENjMyQjg1MDExRUI5NjA5OEM1QTAyOEREQUM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0MTBENjMzQjg1MDExRUI5NjA5OEM1QTAyOEREQUM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTQxMEQ2MzBCODUwMTFFQjk2MDk4QzVBMDI4RERBQzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTQxMEQ2MzFCODUwMTFFQjk2MDk4QzVBMDI4RERBQzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAALAAsDAREAAhEBAxEB/8QAaAAAAwEAAAAAAAAAAAAAAAAAAAIECgEBAQEAAAAAAAAAAAAAAAAAAAEDEAAABAMHBQEAAAAAAAAAAAABESESMQIDAFFhIjITU0GRsTMEFBEBAAEFAAAAAAAAAAAAAAAAAAERMWECEv/aAAwDAQACEQMRAD8A3ozziAhSpAA1BA1005YPnIkRAjMOBiGzHEXJ+YOSoeo8rt7nc03khaWoRJZU5HzQqX7iu9zmyu3+jzgWVpEhWSaqO8cLvFor/9k=)
      repeat;
    background-size: 11px 11px;
    transition: border-color ease-in 300ms, box-shadow ease-in 300ms;
  }
  .el-table__body {
    tr.hover-row {
      td,
      .alldiv {
        background: var(--table-current-row-bg-color) !important;
        background-size: 100% 100%;
      }
    }
    tr .alldiv {
      background: #f6f6f6 !important;
      padding: 0 !important;
      line-height: 32px !important;
      height: 32px !important;
      .spanname {
        line-height: 32px !important;
      }
      .tgicon {
        padding-top: 5px !important;
        padding-right: -1px;
      }
      .amountdiv {
        line-height: 32px !important;
      }
    }
  }
  .el-table__body-wrapper {
    /*height: calc(100vh - 285px) !important;*/
  }
  .el-table__footer tbody tr td.el-table__cell {
    background-color: #e9e9e9 !important;
    border-bottom: 0;
    color: var(--text-second-color);
    font-weight: 600;
  }
}
/deep/ .el-table .el-table__body .el-table__row:last-child {
  background: #e1e1e1 !important;
  .el-table__cell {
    background: #e1e1e1 !important;
    font-weight: 600;
  }
}
/deep/ .el-table .el-table__body .el-table__row {
  .el-table__cell {
    padding: 0 !important;
    .cell {
      padding: 0;
      height: 100%;
      > div {
        line-height: 22px;
        padding: 5px 0;
        height: 32px;
        .left {
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          display: inline-block;
          width: 100%;
          padding-left: 12px;
          padding-right: 12px;
        }
      }
    }
  }
}
</style>
