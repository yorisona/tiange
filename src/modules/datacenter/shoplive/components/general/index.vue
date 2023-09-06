<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-29 14:58:21
-->
<template>
  <div class="tg-datacenter-shoplive-general" v-loading="loading">
    <div class="general-item" v-for="(item, itemIdx) in projectList" :key="itemIdx">
      <div class="department-name">
        <div>{{ item.department_name ? item.department_name : '--' }}</div>
        <div class="depart-name-line"></div>
      </div>
      <section
        class="department-projects"
        v-for="(project, projectIdx) in item.projects ? item.projects : []"
        :key="projectIdx"
      >
        <div class="project-desc-info" :class="`${project.live_status}` === '0' ? 'live' : ''">
          <div class="project-icon-container" @click="gotoClick(project)">
            <el-image class="project-icon" :src="project.shop_logo">
              <div slot="placeholder" class="project-icon-slot">
                <img src="../../../../../assets/img/image_placeholder.png" alt="" />
              </div>
              <div slot="error" class="project-icon-slot">
                <img src="../../../../../assets/img/image_placeholder.png" alt="" />
              </div>
            </el-image>
            <div class="project-icon-container-animation"></div>
            <div class="live-tag">直播中</div>
          </div>
          <div class="project-name" @click="gotoClick(project)">
            {{ project.project_name ? project.project_name : '--' }}
          </div>
        </div>
        <el-progress
          class="project-rate"
          :class="progressTextColorClass(project.gmv_completion_rate)"
          :percentage="
            project.gmv_completion_rate
              ? project.gmv_completion_rate > 100
                ? 100
                : project.gmv_completion_rate
              : 0
          "
          :stroke-width="10"
          color="#2877FF"
          :format="() => progressTextFormat(project.gmv_completion_rate)"
        ></el-progress>
        <div class="live-info">
          <div class="live-info-item">
            <div class="label top">开播场次</div>
            <div class="value">
              {{
                project.live_count !== null && project.live_count !== undefined
                  ? formatAmount(project.live_count, 'None', true)
                  : '--'
              }}
            </div>
            <div class="label bottom">直播时长</div>
            <div class="value">
              {{ transformSecond(project.live_duration) }}
            </div>
          </div>
          <div class="live-info-item">
            <div class="label top">成交金额（元）</div>
            <div class="value">
              {{
                project.gmv !== undefined && project.gmv !== null
                  ? formatAmount(project.gmv / 100, 'None')
                  : '--'
              }}
            </div>
            <div class="label bottom">成交订单</div>
            <div class="value">
              {{
                project.pay_order_cnt !== undefined && project.pay_order_cnt !== null
                  ? formatAmount(project.pay_order_cnt, 'None', true)
                  : '--'
              }}
            </div>
          </div>
          <div class="live-info-item">
            <div class="label top">观看人数</div>
            <div class="value">
              {{
                project.watch_ucnt !== undefined && project.watch_ucnt !== null
                  ? formatAmount(project.watch_ucnt, 'None', true)
                  : '--'
              }}
            </div>
            <div class="label bottom">人均观看时长</div>
            <div class="value">
              {{ transformSecond(project.avg_watch_duration) }}
            </div>
          </div>
          <div class="live-info-item">
            <div class="label top">新增粉丝数量</div>
            <div class="value">
              {{
                project.new_fans_count !== undefined && project.new_fans_count !== null
                  ? formatAmount(project.new_fans_count, 'None', true)
                  : '--'
              }}
            </div>
            <div class="label bottom">涨粉率</div>
            <div class="value">
              {{
                project.incr_fans_ratio !== undefined && project.incr_fans_ratio !== null
                  ? `${project.incr_fans_ratio}%`
                  : '--'
              }}
            </div>
          </div>
          <div class="live-info-item">
            <div class="label top">曝光-进入率</div>
            <div class="value">
              {{
                project.watch_cnt_show_ratio !== undefined && project.watch_cnt_show_ratio !== null
                  ? `${project.watch_cnt_show_ratio}%`
                  : '--'
              }}
            </div>
            <div class="label bottom">观看-付款率</div>
            <div class="value">
              {{
                project.watch_pay_ucnt_ratio !== undefined && project.watch_pay_ucnt_ratio !== null
                  ? `${project.watch_pay_ucnt_ratio}%`
                  : '--'
              }}
            </div>
          </div>
          <div class="live-info-item">
            <div class="label top">投放金额</div>
            <div class="value">
              {{
                project.ad_cost !== undefined && project.ad_cost !== null
                  ? formatAmount(project.ad_cost / 100, 'None')
                  : '--'
              }}
            </div>
            <div class="label bottom">ROI</div>
            <div class="value">
              {{ project.roi !== undefined && project.roi !== null ? project.roi : '--' }}
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="empty" v-if="projectList.length === 0">
      <empty-common detail-text="暂无数据"></empty-common>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style lang="less" scoped>
.tg-datacenter-shoplive-general {
  @keyframes icon_border_animation {
    0% {
      -webkit-transform: scale(1);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1.2);
      opacity: 0;
    }
  }
  @keyframes icon_animation {
    0% {
      -webkit-transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.2);
    }
    100% {
      -webkit-transform: scale(1);
    }
  }
  padding: 0 18px;
  .general-item {
    .department-projects {
      margin-top: 64px;
      border: 1px solid var(--border-line-div-color);
      border-radius: 4px;
      position: relative;
    }
    .department-name {
      margin-top: 32px;
      color: var(--text-color);
      font-size: 14px;
      display: flex;
      align-items: center;
      font-weight: 600;
      &::before {
        display: block;
        content: '';
        background-color: var(--theme-color);
        width: 3px;
        height: 13px;
        margin-right: 8px;
        border-radius: 1px;
      }
      .depart-name-line {
        flex: 1;
        margin-left: 12px;
        border-bottom: 1px dashed var(--border-line-div-color);
      }
    }
    .project-desc-info {
      position: absolute;
      display: flex;
      align-items: center;
      background: white;
      left: 25px;
      top: -41px;
      padding: 0px 6px 0 8px;
      .project-icon-container {
        cursor: pointer;
        position: relative;
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ .project-icon {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          outline: 1px solid var(--border-line-div-color);
          display: block;
          .el-image__error {
            font-size: 12px;
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
      .project-name {
        cursor: pointer;
        color: var(--text-color);
        font-size: 14px;
        //font-weight: 600;
        margin-left: 10px;
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
    .project-rate {
      width: 406px;
      margin-left: 122px;
      margin-top: 18px;
    }
    .live-info {
      display: grid;
      grid-template-columns: repeat(6, minmax(auto, 1fr));
      align-items: center;
      column-gap: 12px;
      padding: 12px 18px 24px;
      .live-info-item {
        border: 0.5px solid var(--border-line-div-color);
        height: 132px;
        border-radius: 4px;
        background: #f6fafb;
        padding: 16px 12px;
        text-align: center;
        .label {
          font-size: 12px;
          color: var(--text-second-color);
          height: 18px;
          line-height: 18px;
          &.bottom {
            margin-top: 8px;
          }
        }
        .value {
          font-size: 16px;
          color: var(--text-color);
          //font-weight: 600;
          margin-top: 2px;
          height: 26px;
          line-height: 26px;
        }
      }
    }
    /deep/ .project-rate {
      width: 406px;
      display: flex;
      align-items: center;
      .el-progress-bar__outer {
        background-color: #f1f4f9;
      }
      .el-progress__text {
        margin-left: 14px;
        font-size: 14px !important;
      }
      &.low {
        .el-progress__text {
          color: var(--error-color);
        }
      }
      &.medium {
        .el-progress__text {
          color: var(--warning-color);
        }
      }
      &.high {
        .el-progress__text {
          color: #20bf55;
        }
      }
    }
  }
  .project-icon-slot {
    > img {
      height: 60px;
      width: 60px;
    }
  }
}
.empty {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
