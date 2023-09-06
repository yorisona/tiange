<script src="./index.ts" lang="ts"></script>

<template>
  <div :style="from_project || 'padding: 0 18px 12px 18px'" v-loading="loading">
    <template v-if="!from_project">
      <div class="project-desc-info">
        <div class="project-icon-container">
          <el-image class="project-icon" :src="projectDetail.shop_logo">
            <div slot="placeholder" class="project-icon-slot">
              <img src="../../../../../assets/img/image_placeholder.png" alt="" />
            </div>
            <div slot="error" class="project-icon-slot">
              <img src="../../../../../assets/img/image_placeholder.png" alt="" />
            </div>
          </el-image>
        </div>
        <div class="project-desc">
          <div class="title" style="display: flex; justify-content: space-between">
            {{ projectDetail.shop_name ? projectDetail.shop_name : '--' }}
            <!--          project_trends.present.exposure === null
                    ? '--'
                    : formatPriceToThousand(
                        Number(project_trends.present.exposure || 0).toFixed(0),
                        2,
                        false,
                        true,
                      )-->
            <span style="color: var(--text-third-color); font-size: 12px"
              >数据更新时间：{{ projectDetail.last_update_time }}</span
            >
          </div>
          <div>
            开播时粉丝数：<span>
              {{
                projectDetail.before_live_fans_num === null ||
                projectDetail.before_live_fans_num === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.before_live_fans_num).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}</span
            >
          </div>
          <div>
            直播时间：<span>
              {{
                (projectDetail.start_time === null || projectDetail.start_time === undefined) &&
                (projectDetail.end_time === null || projectDetail.end_time === undefined)
                  ? '--'
                  : projectDetail.start_time + ' - ' + projectDetail.end_time
              }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp; 直播时长：<span>{{
              projectDetail.live_duration === null || projectDetail.live_duration === undefined
                ? '--'
                : transformSecond(projectDetail.live_duration)
            }}</span>
          </div>
        </div>
      </div>
      <div
        style="
          margin-top: 24px;
          padding: 20px;
          height: 152px;
          background: #f5f5f5;
          border-radius: 4px;
        "
      >
        <div class="title-amount">
          <div class="item">
            <div>直播间成交金额</div>
            <div class="amount">
              {{
                projectDetail.gmv === null || projectDetail.gmv === undefined
                  ? '--'
                  : formatAmount(Number(projectDetail.gmv / 100))
              }}
            </div>
          </div>
          <div class="item">
            <div>千次观看成交金额</div>
            <div class="amount">
              {{
                projectDetail.gpm === null || projectDetail.gpm === undefined
                  ? '--'
                  : formatAmount(Number(projectDetail.gpm / 100))
              }}
            </div>
          </div>
          <div class="item">
            <div>直播间成交订单数</div>
            <div class="amount">
              {{
                projectDetail.pay_order_cnt === null || projectDetail.pay_order_cnt === undefined
                  ? '--'
                  : formatAmount(Number(projectDetail.pay_order_cnt).toFixed(0), 'None', true)
              }}
            </div>
          </div>
          <div class="item">
            <div>直播间成交人数</div>
            <div class="amount">
              {{
                projectDetail.pay_ucnt === null || projectDetail.pay_ucnt === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.pay_ucnt).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}
            </div>
          </div>
          <div class="item">
            <div>客单价</div>
            <div class="amount">
              {{
                projectDetail.per_customer_price === null ||
                projectDetail.per_customer_price === undefined
                  ? '--'
                  : formatAmount(Number(projectDetail.per_customer_price / 100))
              }}
            </div>
          </div>
          <div class="item">
            <div>退款金额</div>
            <div class="amount">
              {{
                projectDetail.refund_in_live_order_gmv === null ||
                projectDetail.refund_in_live_order_gmv === undefined
                  ? '--'
                  : formatAmount(Number(projectDetail.refund_in_live_order_gmv / 100))
              }}
            </div>
          </div>
        </div>
        <div class="title-amount">
          <div class="item">
            <div>直播间观看人数</div>
            <div class="amount">
              {{
                projectDetail.watch_ucnt === null || projectDetail.watch_ucnt === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.watch_ucnt || 0).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}
            </div>
          </div>
          <div class="item">
            <div>平均在线人数</div>
            <div class="amount">
              {{
                projectDetail.avg_online_cnt === null || projectDetail.avg_online_cnt === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.avg_online_cnt).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}
            </div>
          </div>
          <div class="item">
            <div>最高在线人数</div>
            <div class="amount">
              {{
                projectDetail.max_online_cnt === null || projectDetail.max_online_cnt === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.max_online_cnt).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}
            </div>
          </div>
          <div class="item">
            <div>人均观看时长</div>
            <div class="amount">
              {{
                projectDetail.avg_watch_duration === null ||
                projectDetail.avg_watch_duration === undefined
                  ? '--'
                  : transformSecond(projectDetail.avg_watch_duration)
              }}
            </div>
          </div>
          <div class="item">
            <div>新增粉丝人数</div>
            <div class="amount">
              {{
                projectDetail.incr_fans_cnt === null || projectDetail.incr_fans_cnt === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.incr_fans_cnt).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}
            </div>
          </div>
          <div class="item">
            <div>取关粉丝人数</div>
            <div class="amount">
              {{
                projectDetail.unfollow_fans_cnt === null ||
                projectDetail.unfollow_fans_cnt === undefined
                  ? '--'
                  : formatPriceToThousandformatAmount(
                      Number(projectDetail.unfollow_fans_cnt).toFixed(0),
                      0,
                      false,
                      true,
                    )
              }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div :style="!from_project ? 'margin-top: 24px; display: flex' : 'display: flex'">
      <div style="width: 250px; height: 446px">
        <videoPlayer
          v-if="projectDetail.stream_url"
          @videoStudyTime="videoStudyTime"
          :videoData="videoData"
          :poster="projectDetail.stream_screenshot_url"
          :src="projectDetail.stream_url"
        />
        <div
          v-else
          style="
            height: 450px;
            width: 250px;
            padding: auto;
            border: 1px solid var(--border-line-div-color);
          "
        >
          <empty-common
            style="margin-top: 150px"
            :imgWidth="120"
            :imgHeight="80"
            detail-text="暂无视频"
          />
        </div>
      </div>
      <div style="flex: 1; height: 460px">
        <div class="explain-shop">
          <div v-if="projectShop">
            讲解时间：<span>{{ project_shop_time === '' ? '--' : project_shop_time }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;主播：<span>
              {{ project_shop_koi === '' ? '--' : project_shop_koi }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;人数变化：<span>{{
              projectShop.num_change === null ? '--' : projectShop.num_change
            }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;新增粉丝：<span>{{
              projectShop.incr_fans_cnt === null ? '--' : projectShop.incr_fans_cnt
            }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;平均在线：<span>{{
              projectShop.avg_online_person === null ? '--' : projectShop.avg_online_person
            }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;评论数：<span>{{
              projectShop.comment_cnt === null ? '--' : projectShop.comment_cnt
            }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #a4b2c2">以下为商品全场汇总数据</span>
          </div>
          <div v-else>
            主播：<span> {{ project_shop_koi === '' ? '--' : project_shop_koi }}</span>
            <empty-common
              style="margin-top: 10px"
              :imgWidth="100"
              :imgHeight="50"
              detail-text="当前暂无讲解商品"
            />
          </div>
          <div
            v-if="projectShop"
            style="margin-top: 12px; display: flex; justify-content: flex-start"
          >
            <div class="goods-info" style="width: 256px">
              <el-image class="project-icon" :src="projectShop.image_uri">
                <div slot="placeholder" class="project-icon-slot">
                  <img src="../../../../../assets/img/goods-empty.png" alt="" />
                </div>
                <div slot="error" class="project-icon-slot">
                  <img src="../../../../../assets/img/goods-empty.png" alt="" />
                </div>
              </el-image>
              <div class="info-row">
                <div class="detail">
                  <span style="color: var(--text-third-color)">{{
                    project_shop_id === '' ? '--' : project_shop_id
                  }}</span>
                </div>
                <div class="line-clamp-2 goods-title" style="margin-top: 2px">
                  {{
                    projectShop.product_title === '' || projectShop.product_title === undefined
                      ? '--'
                      : projectShop.product_title
                  }}
                </div>
                <div class="detail" style="margin-top: 4px">
                  <span style="color: var(--text-third-color)">{{
                    projectShop.sn === '' || projectShop.sn === undefined ? '--' : projectShop.sn
                  }}</span>
                </div>
              </div>
            </div>
            <div class="line"></div>
            <div style="flex: 1; margin-left: 12px">
              <div style="display: flex; justify-content: flex-start; height: 40px">
                <div style="width: 18%; min-width: 120px">
                  <div>成交金额</div>
                  <span>{{
                    projectShop.pay_in_live_order_product_gmv === null ||
                    projectShop.pay_in_live_order_product_gmv === undefined
                      ? '--'
                      : formatAmount(Number(projectShop.pay_in_live_order_product_gmv / 100))
                  }}</span>
                </div>
                <div style="width: 15%; min-width: 100px">
                  <div>成交件数</div>
                  <span>{{
                    projectShop.pay_in_live_order_product_cnt === null ||
                    projectShop.pay_in_live_order_product_cnt === undefined
                      ? '--'
                      : formatAmount(
                          Number(projectShop.pay_in_live_order_product_cnt).toFixed(0),
                          'None',
                          true,
                        )
                  }}</span>
                </div>
                <div style="width: 15%; min-width: 100px">
                  <div>成交人数</div>
                  <span>
                    {{
                      projectShop.pay_in_live_order_ucnt === null ||
                      projectShop.pay_in_live_order_ucnt === undefined
                        ? '--'
                        : formatAmount(
                            Number(projectShop.pay_in_live_order_ucnt).toFixed(0),
                            'None',
                            true,
                          )
                    }}
                  </span>
                </div>
                <div style="width: 15%; min-width: 120px">
                  <div>成交订单数</div>
                  <span>{{
                    projectShop.pay_in_live_order_cnt === null ||
                    projectShop.pay_in_live_order_cnt === undefined
                      ? '--'
                      : formatAmount(
                          Number(projectShop.pay_in_live_order_cnt).toFixed(0),
                          'None',
                          true,
                        )
                  }}</span>
                </div>
                <div style="width: 18%; min-width: 120px">
                  <div>退款金额</div>
                  <span>{{
                    projectShop.refund_in_live_order_gmv === null ||
                    projectShop.refund_in_live_order_gmv === undefined
                      ? '--'
                      : formatAmount(Number(projectShop.refund_in_live_order_gmv / 100))
                  }}</span>
                </div>
                <div style="width: 15%; min-width: 100px">
                  <div>退款订单数</div>
                  <span>{{
                    projectShop.refund_in_live_order_cnt === null ||
                    projectShop.refund_in_live_order_cnt === undefined
                      ? '--'
                      : formatAmount(
                          Number(projectShop.refund_in_live_order_cnt).toFixed(0),
                          'None',
                          true,
                        )
                  }}</span>
                </div>
              </div>
              <div
                style="margin-top: 6px; display: flex; justify-content: flex-start; height: 40px"
              >
                <div style="width: 18%; min-width: 120px">
                  <div>商品讲解次数</div>
                  <span>
                    {{
                      projectShop.explain_times === null || projectShop.explain_times === undefined
                        ? '--'
                        : formatPriceToThousandformatAmount(
                            Number(projectShop.explain_times).toFixed(0),
                            0,
                            false,
                            true,
                          )
                    }}
                  </span>
                </div>
                <div style="width: 15%; min-width: 100px">
                  <div>商品曝光人数</div>
                  <span>
                    {{
                      projectShop.product_watch_ucnt === null ||
                      projectShop.product_watch_ucnt === undefined
                        ? '--'
                        : formatPriceToThousandformatAmount(
                            Number(projectShop.product_watch_ucnt).toFixed(0),
                            0,
                            false,
                            true,
                          )
                    }}
                  </span>
                </div>
                <div style="width: 15%; min-width: 100px">
                  <div>商品点击人数</div>
                  <span>
                    {{
                      projectShop.product_click_ucnt === null ||
                      projectShop.product_click_ucnt === undefined
                        ? '--'
                        : formatPriceToThousandformatAmount(
                            Number(projectShop.product_click_ucnt).toFixed(0),
                            0,
                            false,
                            true,
                          )
                    }}
                  </span>
                </div>
                <div style="width: 15%; min-width: 120px">
                  <div>商品曝光-点击率</div>
                  <span>{{
                    projectShop.product_watch_click_ucnt_ration === null ||
                    projectShop.product_watch_click_ucnt_ration === undefined
                      ? '--'
                      : formatAmount(Number(projectShop.product_watch_click_ucnt_ration), 'None') +
                        '%'
                  }}</span>
                </div>
                <div style="width: 18%; min-width: 120px">
                  <div>商品曝光-成交率</div>
                  <span>{{
                    projectShop.product_click_pay_ucnt_ration === null ||
                    projectShop.product_click_pay_ucnt_ration === undefined
                      ? '--'
                      : formatAmount(Number(projectShop.product_click_pay_ucnt_ration), 'None') +
                        '%'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="padding: 18px 0px">
          <BaseEcharts
            :currentIndex="currentIndex"
            @selectClick="selectClick"
            style="height: 280px"
            :options="baseOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.project-desc-info {
  display: flex;
  align-items: center;
  background: white;
  left: 25px;
  top: -41px;
  padding: 0px 6px 0 8px;
  .project-icon-container {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    /deep/ .project-icon {
      width: 72px;
      height: 72px;
      border-radius: 70px;
      outline: 1px solid var(--border-line-div-color);
      display: block;
      .el-image__error {
        font-size: 12px;
      }
    }
    .project-icon-slot {
      width: 72px;
      height: 72px;
      img {
        width: 72px;
        height: 72px;
      }
    }
    .live-tag {
      display: none;
      position: absolute;
      width: 48px;
      height: 20px;
      text-align: center;
      border-radius: 10px;
      left: 16px;
      bottom: 0px;
      font-size: 12px;
      color: white;
      line-height: 20px;
      background-color: #ff4d79;
      line-height: 20px;
    }

    .project-icon-container-animation {
      display: none;
      position: absolute;
      top: 6px;
      left: 6px;
      width: 68px;
      height: 68px;
      outline: 1px solid #ff4d79;
      border-radius: 34px;
    }
  }
  .project-desc {
    color: black;
    font-size: 12px;
    margin-left: 10px;
    flex: 1;
    color: var(--text-third-color);
    div {
      line-height: 20px;
      span {
        color: var(--text-color);
      }
    }
    .title {
      color: var(--text-color);
      line-height: 28px;
      font-size: 14px;
    }
  }
  &.live {
    // top: -34px;
    /deep/ .project-icon {
      width: 68px;
      height: 68px;
      border-radius: 34px;
      outline: 2px solid #ff4d79;
      border: 4px solid white;
      & .el-image__error {
        animation: icon_animation 1s linear infinite;
      }
      & .el-image__inner {
        animation: icon_animation 1s linear infinite;
      }
    }
    .live-tag {
      display: block;
    }
    .project-icon-container-animation {
      display: block;
      animation: icon_border_animation 1s linear infinite;
    }
  }
}
.goods-info {
  display: flex;
  .project-icon {
    width: 80px;
    height: 80px;
    border-radius: 2px;
    margin-right: 10px;
    .project-icon-slot {
      width: 80px;
      height: 80px;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
  .info-row {
    flex: 1;
    display: inline-block;
    font-size: 12px;
    .goods-title {
      /*width: 220px;*/
      height: 32px;
      line-height: 16px;
      font-size: 12px;
      color: var(--text-color);
      font-weight: 600;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 4px;
    }
    .detail {
      line-height: 16px;
    }
  }
}
.title-amount {
  display: flex;
  justify-content: space-between;
  height: 60px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-third-color);
  letter-spacing: 0;
  .item {
    flex: 1;
    padding: 10px 0 10px 18px;
    min-width: 190px;
    line-height: 20px;
  }
  .amount {
    font-size: 16px;
    line-height: 22px;
    color: var(--text-color);
  }
}
.explain-shop {
  display: block;
  margin-left: 16px;
  padding: 18px 0px 18px 24px;
  border: 1px solid var(--border-line-div-color);
  border-radius: 4px;
  height: 144px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-third-color);
  span {
    color: var(--text-color);
  }
}
.line {
  margin: 12px;
  width: 1px;
  height: 60px;
  background-image: linear-gradient(to bottom, #d1d8e0 0%, #d1d8e0 50%, transparent 50%);
  background-size: 3px 10px;
  background-repeat: repeat-y;
}
/deep/.base-good-title {
  font-size: 12px;
  color: var(--text-color);
  font-weight: 400;
  width: 180px;
  line-height: 20px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
  word-break: break-all; //只对英文起作用，以字母作为换行依据
  word-wrap: break-word; //只对英文起作用，以单词作为换行依据
  white-space: pre-wrap; //只对中文起作用，强制换行
}
/deep/.base-title {
  font-size: 12px;
  color: var(--text-color);
  font-weight: 400;
  width: 180px;
  line-height: 20px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
  word-break: break-all; //只对英文起作用，以字母作为换行依据
  word-wrap: break-word; //只对英文起作用，以单词作为换行依据
  white-space: pre-wrap; //只对中文起作用，强制换行
}
</style>
