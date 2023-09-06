<template>
  <div style="padding-right: 18px; padding-left: 18px">
    <div>
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
          width="100"
          fixed="left"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scoped">
            <div :class="getClassName(scoped.row)">
              <span>{{ scoped.row.depart_ment }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="项目"
          width="120"
          fixed="left"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scoped">
            <div :class="getClassName(scoped.row)">
              <span style="padding-left: 12px">
                {{ scoped.row.project_name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <template v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
          <el-table-column :label="item + '月'" :key="item + 'detail'">
            <!--          :class-name="Number(currentMonth) < item ? 'isaftermonth' : ''"-->
            <el-table-column
              prop="project_name"
              label="目标 (元)"
              min-width="120"
              align="right"
              :class-name="Number(currentMonth) < item ? 'issubaftermonth' : ''"
            >
              <template slot-scope="scoped">
                <div :class="getClassName(scoped.row)">
                  <span>{{
                    getNewAmount(scoped.row[monthTargetType[item - 1]], item, false)
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="project_name"
              label="完成 (元)"
              min-width="136"
              align="right"
              :class-name="Number(currentMonth) < item ? 'issubaftermonth' : ''"
            >
              <template slot-scope="scoped">
                <div :class="getClassName(scoped.row)">
                  <span>{{ getNewAmount(scoped.row[monthCompleteType[item - 1]], item) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="project_name"
              label="完成率"
              min-width="110"
              align="left"
              :class-name="Number(currentMonth) < item ? 'issubaftermonth' : ''"
            >
              <template slot-scope="scoped">
                <div
                  class="backgronddiv"
                  style="
                    width: 100%;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                    padding-top: 5px !important;
                  "
                  :class="getClassName(scoped.row)"
                >
                  <div
                    class="backgrondRate"
                    style="padding: 0px 3px !important"
                    :style="{
                      width: getRateWidth(scoped.row[monthRateType[item - 1]]),
                    }"
                    :class="getImgClassName(scoped.row[monthRateType[item - 1]], item)"
                  ></div>
                  <div v-if="scoped.row[monthRateType[item - 1]] >= 100" class="imgRate"></div>
                  <div v-else class="noimgRate"></div>
                  <div class="rate">
                    {{ getNewRate(scoped.row[monthRateType[item - 1]], item) }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
        <el-table-column label="合计" fixed="right" min-width="350">
          <el-table-column prop="project_name" label="目标 (元)" min-width="120" align="right">
            <template slot-scope="scoped">
              <div :class="getClassName(scoped.row)">
                <span>{{ getNewAmount(scoped.row[monthTargetType[12]], 1, false) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="project_name" label="完成 (元)" min-width="120" align="right">
            <template slot-scope="scoped">
              <div :class="getClassName(scoped.row)">
                <span>{{ getNewAmount(scoped.row[monthCompleteType[12]], 1, false) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="project_name" label="完成率" min-width="110" align="left">
            <template slot-scope="scoped">
              <div
                class="backgronddiv"
                style="
                  width: 100%;
                  padding-left: 0px !important;
                  padding-right: 0px !important;
                  padding-top: 5px !important;
                  height: 32px;
                "
                :class="getClassName(scoped.row)"
              >
                <div
                  class="backgrondRate"
                  style="padding: 0px 3px !important; height: 22px; line-height: 22px"
                  :style="{
                    width: getRateWidth(scoped.row[monthRateType[12]]),
                  }"
                  :class="getImgClassName(scoped.row[monthRateType[12]], 12)"
                ></div>
                <div v-if="scoped.row[monthRateType[12]] >= 100" class="imgRate"></div>
                <div v-else class="noimgRate"></div>
                <div class="rate">{{ getNewRate(scoped.row[monthRateType[12]], 1) }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂无数据"></empty-common>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" src="./gmvindex.ts"></script>

<style lang="less" scoped>
/deep/ .el-table {
  .el-table__header-wrapper .el-table__header {
    thead {
      tr:last-child {
        th {
          border-top: 1px solid #ebeef5;
        }
      }
      tr th {
        padding: 5px 10px;
      }
    }
  }
  .el-table__fixed-right .el-table__fixed-header-wrapper,
  .el-table__fixed .el-table__fixed-header-wrapper {
    thead {
      tr:last-child {
        th {
          border-top: 1px solid #ebeef5;
        }
      }
      tr th {
        padding: 5px 10px;
      }
    }
  }
  .issubaftermonth {
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0MTBENjMyQjg1MDExRUI5NjA5OEM1QTAyOEREQUM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0MTBENjMzQjg1MDExRUI5NjA5OEM1QTAyOEREQUM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTQxMEQ2MzBCODUwMTFFQjk2MDk4QzVBMDI4RERBQzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTQxMEQ2MzFCODUwMTFFQjk2MDk4QzVBMDI4RERBQzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAALAAsDAREAAhEBAxEB/8QAaAAAAwEAAAAAAAAAAAAAAAAAAAIECgEBAQEAAAAAAAAAAAAAAAAAAAEDEAAABAMHBQEAAAAAAAAAAAABESESMQIDAFFhIjITU0GRsTMEFBEBAAEFAAAAAAAAAAAAAAAAAAERMWECEv/aAAwDAQACEQMRAD8A3ozziAhSpAA1BA1005YPnIkRAjMOBiGzHEXJ+YOSoeo8rt7nc03khaWoRJZU5HzQqX7iu9zmyu3+jzgWVpEhWSaqO8cLvFor/9k=)
      repeat;
    background-size: 11px 11px;
    transition: border-color ease-in 300ms, box-shadow ease-in 300ms;
    &:hover {
      background: var(--table-current-row-bg-color);
    }
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
      span {
        padding-right: 12px;
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
  .el-table__footer tbody tr td.el-table__cell {
    background-color: #e9e9e9 !important;
    border-bottom: 0;
    color: var(--text-color);
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
      div {
        height: 32px;
        line-height: 22px;
        padding: 5px 12px 5px 0;
        span {
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
.backgronddiv {
  width: 100%;
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin: 0px;
  position: relative;
  .noimgRate {
    padding-left: 0px !important;
    padding-right: 0px !important;
    height: 14px !important;
    width: 14px !important;
    display: inline-block;
    top: 10px;
    left: 16px;
    position: absolute;
  }
  .imgRate {
    padding-left: 0px !important;
    padding-right: 0px !important;
    height: 14px !important;
    width: 14px !important;
    background: url('../../../../../assets/img/finance/icon-rateico.png') no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    top: 10px;
    left: 16px;
    position: absolute;
  }
  .rate {
    left: 32px;
    display: inline-block;
    position: absolute;
    padding: 0 !important;
  }
  .backgrondRate {
    position: absolute;
    top: 5px;
    left: 0px;
    height: 22px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
    margin: 0px;
    background-size: 100% 100%;
    &.success {
      background-image: linear-gradient(270deg, rgba(188, 249, 206, 0.1) 0%, #bcf9ce 100%);
      border: 1px solid #9ce7b2;
    }
    &.process {
      background-image: linear-gradient(270deg, rgba(255, 225, 134, 0.1) 0%, #ffe186 100%);
      border: 1px solid #ffde7b;
    }
    &.block {
      background-image: linear-gradient(270deg, rgba(255, 168, 167, 0.1) 0%, #ffa8a7 100%);
      border: 1px solid #ffa8a7;
    }
    &.current {
      background-image: linear-gradient(270deg, rgba(172, 235, 255, 0.1) 0%, #acebff 100%);
      border: 1px solid #9ce2f8;
    }
    background-repeat: no-repeat;
  }
}
</style>
