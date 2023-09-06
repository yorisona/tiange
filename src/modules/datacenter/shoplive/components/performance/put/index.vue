<script src="./index.ts" lang="ts"></script>

<template>
  <div>
    <div
      class="put-warp"
      v-loading="loudouLoading"
      style="
        margin-top: 24px;
        height: 628px;
        border: 1px solid var(--border-line-div-color);
        border-radius: 4px;
      "
    >
      <div
        v-loading="loudouLoading"
        class="put-warp-title"
        style="
          margin: 0 auto;
          margin-top: 48px;
          height: 50px;
          display: flex;
          justify-content: flex-start;
          color: var(--text-second-color);
          width: 1100px;
          font-size: var(--small-font-size);
        "
      >
        <div style="min-width: 120px; padding-right: 66px">
          <div>投放消耗</div>
          <div style="color: var(--text-color); line-height: 32px; font-size: 18px">
            {{
              projectDetail.cost === null || projectDetail.cost === undefined
                ? '--'
                : formatAmount(Number(projectDetail.cost / 100))
            }}
          </div>
        </div>
        <div style="min-width: 140px; padding-right: 66px">
          <div>广告成交金额</div>
          <div style="color: var(--text-color); line-height: 32px; font-size: 18px">
            {{
              projectDetail.ad_gmv === null || projectDetail.ad_gmv === undefined
                ? '--'
                : formatAmount(Number(projectDetail.ad_gmv / 100))
            }}
          </div>
        </div>
        <div style="min-width: 120px; padding-right: 66px">
          <span>广告ROI</span>
          <div style="color: var(--text-color); line-height: 32px; font-size: 18px">
            {{
              projectDetail.ad_roi === null || projectDetail.ad_roi === undefined
                ? '--'
                : formatAmount(Number(projectDetail.ad_roi / 100), 'None')
            }}
          </div>
        </div>
        <div style="min-width: 120px; padding-right: 66px">
          <div>整体ROI</div>
          <div style="color: var(--text-color); line-height: 32px; font-size: 18px">
            {{
              projectDetail.roi === null || projectDetail.roi === undefined
                ? '--'
                : formatAmount(Number(projectDetail.roi / 100), 'None')
            }}
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; width: 1100px; margin: 0 auto">
        <div
          style="
            margin: 3px 12px 3px 24px;
            width: 12px;
            height: 12px;
            background: #0285ff;
            border-radius: 2px;
          "
        ></div>
        <div style="font-weight: 400; font-size: 12px; color: #343f4c; line-height: 18px">
          广告流量
        </div>
        <div
          style="
            margin: 3px 12px 3px 24px;
            width: 12px;
            height: 12px;
            background: #02c38f;
            border-radius: 2px;
          "
        ></div>
        <div
          style="
            margin-right: 100px;
            font-weight: 400;
            font-size: 12px;
            color: #343f4c;
            line-height: 18px;
          "
        >
          自然流量
        </div>
      </div>
      <div class="loudoudiv">
        <div style="width: 520px">
          <line-div
            :obj="{
              people_num_ratio: detail_obj.ad_exposure_ratio,
              people_num: detail_obj.ad_exposure,
              one_lable: '直播间曝光次数：',
              second_people_num_ratio: detail_obj.nature_exposure_ratio,
              second_people_num: detail_obj.nature_exposure,
            }"
          ></line-div>
          <line-div
            style="padding-top: 12px"
            :obj="{
              people_num_ratio: detail_obj.ad_watch_ratio,
              people_num: detail_obj.ad_watch,
              one_lable: '直播间观看次数：',
              second_people_num_ratio: detail_obj.nature_watch_ratio,
              second_people_num: detail_obj.nature_watch,
            }"
          ></line-div>
          <line-div
            style="padding-top: 24px"
            :obj="{
              people_num_ratio: detail_obj.ad_click_ratio,
              people_num: detail_obj.ad_click,
              one_lable: '商品点击次数：',
              second_people_num_ratio: detail_obj.nature_click_ratio,
              second_people_num: detail_obj.nature_click,
            }"
          ></line-div>
          <line-div
            style="padding-top: 36px"
            :obj="{
              people_num_ratio: detail_obj.ad_order_ratio,
              people_num: detail_obj.ad_order,
              one_lable: '创建订单：',
              second_people_num_ratio: detail_obj.nature_order_ratio,
              second_people_num: detail_obj.nature_order,
            }"
          ></line-div>
          <line-div
            style="padding-top: 48px"
            :obj="{
              people_num_ratio: detail_obj.ad_pay_ratio,
              people_num: detail_obj.ad_pay,
              one_lable: '成交：',
              second_people_num_ratio: detail_obj.nature_pay_ratio,
              second_people_num: detail_obj.nature_pay,
            }"
          ></line-div>
        </div>
        <div class="label-box" style="width: 230px; height: 100%; margin-left: -14px">
          <div
            class="titlediv"
            style="
              padding-right: 18px;
              margin-top: 173px;
              height: 20px;
              line-height: 20px;
              margin-bottom: 0px;
              font-size: 14px;
            "
          >
            {{
              detail_obj.ad_watch_click_ratio === null ||
              detail_obj.ad_watch_click_ratio === undefined
                ? '--'
                : detail_obj.ad_watch_click_ratio + '%'
            }}
          </div>
          <div
            class="titlediv"
            style="
              margin-top: 75px;
              height: 20px;
              line-height: 20px;
              margin-bottom: 0px;
              text-align: left;
              font-size: 14px;
            "
          >
            <div
              style="display: inline-block; width: 90px; padding-right: 26px; text-align: center"
            >
              {{
                detail_obj.ad_watch_pay_ratio === null ||
                detail_obj.ad_watch_pay_ratio === undefined
                  ? '--'
                  : detail_obj.ad_watch_pay_ratio + '%'
              }}
            </div>
            <div style="display: inline-block; width: 74px; text-align: center; margin-left: -35px">
              {{
                detail_obj.ad_click_order_ratio === null ||
                detail_obj.ad_click_order_ratio === undefined
                  ? '--'
                  : detail_obj.ad_click_order_ratio + '%'
              }}
            </div>
          </div>
          <div
            class="titlediv"
            style="
              padding-right: 18px;
              margin-top: 75px;
              height: 20px;
              line-height: 20px;
              margin-bottom: 0px;
              font-size: 14px;
            "
          >
            {{
              detail_obj.ad_order_pay_ratio === null || detail_obj.ad_order_pay_ratio === undefined
                ? '--'
                : detail_obj.ad_order_pay_ratio + '%'
            }}
          </div>
        </div>
        <!--        //text-shadow: 2px 2px 2px #19232d-->
        <div style="width: 265px">
          <div class="titlediv">直播间曝光</div>
          <div class="titlediv">进入直播间</div>
          <div class="titlediv">商品点击</div>
          <div class="titlediv">创建订单</div>
          <div class="titlediv" style="line-height: 72px">成交</div>
        </div>
        <div style="width: 225px; height: 100%">
          <div
            class="titlediv"
            style="
              padding-left: 28px;
              margin-top: 173px;
              height: 20px;
              line-height: 20px;
              margin-bottom: 0px;
              font-size: 14px;
            "
          >
            {{
              detail_obj.nature_watch_click_ratio === null ||
              detail_obj.nature_watch_click_ratio === undefined
                ? '--'
                : detail_obj.nature_watch_click_ratio + '%'
            }}
          </div>
          <div
            class="titlediv"
            style="
              margin-top: 75px;
              height: 20px;
              line-height: 20px;
              margin-bottom: 0px;
              text-align: right;
              padding-left: 10px;
              font-size: 14px;
            "
          >
            <div
              style="display: inline-block; width: 60px; text-align: center; margin-right: -23px"
            >
              {{
                detail_obj.nature_click_order_ratio === null ||
                detail_obj.nature_click_order_ratio === undefined
                  ? '--'
                  : detail_obj.nature_click_order_ratio + '%'
              }}
            </div>
            <div style="display: inline-block; width: 80px; padding-left: 20px; text-align: center">
              {{
                detail_obj.nature_watch_pay_ratio === null ||
                detail_obj.nature_watch_pay_ratio === undefined
                  ? '--'
                  : detail_obj.nature_watch_pay_ratio + '%'
              }}
            </div>
          </div>
          <div
            class="titlediv"
            style="
              padding-left: 28px;
              margin-top: 75px;
              height: 20px;
              line-height: 20px;
              margin-bottom: 0px;
              font-size: 14px;
            "
          >
            {{
              detail_obj.nature_order_pay_ratio === null ||
              detail_obj.nature_order_pay_ratio === undefined
                ? '--'
                : detail_obj.nature_order_pay_ratio + '%'
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.echartTitle {
  font-size: var(--small-font-size);
  color: var(--text-color);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  width: 80%;
  text-align: left;
  padding: 0;
  margin-left: 12px;
}

.loudoudiv {
  width: 1100px;
  height: 460px;
  background: url('../../../../../../assets/echarts/icon-shoplive-put.png');
  background-size: 100% 100%;
  margin: 24px auto;
  display: flex;
  justify-content: center;
  .titlediv {
    font-weight: 400;
    font-size: 16px;
    color: var(--text-color);
    line-height: 80px;
    text-align: center;
    margin-bottom: 15px;
    width: 100%;
  }
}
/*/deep/ .el-table .el-table__body .el-table__row {
          .el-table__cell:first-child,
          .el-table__cell:nth-child(2) {
            background: #f6f6f6 !important;
          }
        }*/
</style>
