<template>
  <div class="tg-page-container tg-workbench-page">
    <tg-card class="flex-auto" :padding="0">
      <div class="article-block">
        <div class="header">
          <div class="title">下载</div>
          <div class="operation-bar">
            <!-- <span class="link" @click="router.push('/workbench/mine')">我发起的</span> -->
          </div>
        </div>
        <div class="body">
          <div class="block-menu-grid">
            <div
              class="block-menu"
              v-for="(item, key) in DownloadItems"
              :key="key"
              @click="onControlItemClick(item)"
            >
              <div class="img-container"><img :src="item.logo" :alt="item.name" /></div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="article-block">
        <div class="header">
          <div class="title">审批</div>
          <div class="operation-bar">
            <span class="link" @click="router.push('/workbench/mine')">我发起的</span>
          </div>
        </div>
        <div class="body">
          <div class="block-menu-grid">
            <div
              class="block-menu"
              v-for="(item, key) in ApprovalItems"
              :key="key"
              @click="onControlItemClick(item)"
            >
              <div class="img-container"><img :src="item.logo" :alt="item.name" /></div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="article-block">
        <div class="header">
          <div class="title">预约</div>
        </div>
        <div class="body">
          <div class="block-menu-grid">
            <div
              class="block-menu"
              v-for="(item, key) in AppointmentItems"
              :key="key"
              @click="onControlItemClick(item)"
            >
              <div class="img-container"><img :src="item.logo" :alt="item.name" /></div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="article-block"
        :class="Agency.list.length === 0 ? 'flex-full' : undefined"
        :bodyStyle="{ padding: 0 }"
        v-if="Agency.list.length > 0"
      >
        <div class="header">
          <div class="title">待办</div>
          <div class="operation-bar"></div>
        </div>
        <div class="body">
          <div class="block-menu-grid">
            <div
              class="block-menu"
              v-for="(item, key) in Agency.list"
              :key="key"
              @click="onControlItemClick(item)"
            >
              <div class="img-container">
                <img :src="item.logo" :alt="item.name" />
                <div class="block-badge" v-if="item.count">{{ item.count }}</div>
              </div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="article-block">
        <div class="header">
          <div class="title">福利</div>
        </div>
        <div class="body">
          <div class="block-menu-grid">
            <div
              class="block-menu"
              v-for="(item, key) in Approvalwelfare"
              :key="key"
              @click="onControlItemClick(item)"
            >
              <div class="img-container"><img :src="item.logo" :alt="item.name" /></div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="article-block flex-full"
        :bodyStyle="{ padding: 0 }"
        v-if="Scheduling.jurisdiction"
      >
        <div class="header">
          <div class="title">我的排班</div>
          <div class="operation-bar"></div>
        </div>
        <div class="body">
          <div class="scheduling-contarner">
            <div class="scheduling-column" v-for="(item, key) in Scheduling.list" :key="key">
              <div class="week">
                <span>{{ item.date }}</span
                >{{ item.week }}
              </div>
              <!-- <div class="day">{{ item.day }}</div> -->
              <div
                class="scheduling"
                v-for="(live, index) in item.data"
                :key="index"
                @click="jumpToLive(live)"
              >
                <div class="line-clamp-1 project-name">
                  {{ live.project_name ? live.project_name : '--' }}
                </div>
                <div class="line-clamp-1 studio-name">{{ live.studio_name }}</div>
                <div
                  v-for="(liveTime, scheduleIndex) in live.live_times"
                  :key="scheduleIndex"
                  class="time"
                >
                  <span></span><span v-if="scheduleIndex !== live.live_times.length - 1"></span
                  >{{ liveTime }}
                </div>
                <!-- <div class="live">
                  <span class="label">直播间：</span>
                  <span class="name">{{ live.studio_name }}</span>
                </div> -->
              </div>
              <div class="empty" v-if="item.empty">暂无排班</div>
            </div>
          </div>
        </div>
      </div>
    </tg-card>
    <LoanFormModal
      :visible="loanFormVisible"
      :approval="approval"
      @dialog:close="onLoanFormClose"
      @close="onLoanFormClose"
      @reload:loan="triggerReload('loan')"
    />
    <LoanDetailModal
      v-if="loanDetailVisible"
      :visible="loanDetailVisible"
      :approval="approval"
      @dialog:close="onLoanDetailClose"
      @close="onLoanDetailClose"
      @loan:edit="onLoanEdit"
      @reload:loan="triggerReload('loan')"
    />
    <RefundFormModal
      :visible="refundFormVisible"
      :approval="approval"
      @dialog:close="onRefundFormClose"
      @close="onRefundFormClose"
      @reload:refund="triggerReload('refund')"
    />
    <RefundDetailModal
      v-if="refundDetailVisible"
      :visible="refundDetailVisible"
      :approval="approval"
      @dialog:close="onLoanDetailClose"
      @close="onRefundDetailClose"
      @loan:edit="onRefundEdit"
      @reload:refund="triggerReload('refund')"
    />
    <AdvanceFormDialog
      v-if="advanceFormDialogVisible"
      :visible="advanceFormDialogVisible"
      @dialog:close="onAdvanceFormDialogClose"
      @close="onAdvanceFormDialogClose"
      @reload:refund="triggerReload('advance')"
    />
    <ApplicationDialog ref="applicationDialog" @close="onAdvanceFormClose" />
    <ApplicationDetail
      ref="applicationDetail"
      v-if="advanceDetailVisible"
      @close="onAdvanceDetailClose"
      @reload:application="triggerReload('application')"
    />
    <InvoicesDetail
      ref="invoicingDetail"
      v-if="invoicingDetailVisible"
      @close="onInvoicingDetailClose"
      @reload:invoices="triggerReload('invoices')"
    />
    <InvoicesDialog ref="invoicesDialog" />
    <Initate2Dialog ref="initate2Dialog" />
    <ProjectFilesDialog ref="projectFilesDialog" />
    <UseSealApply ref="useSealApplyRef" />
  </div>
</template>

<script src="./index.tsx"></script>

<style lang="less" scoped>
@import '~@/styles/utils/index.less';
.tg-workbench-page {
  flex: auto;
  overflow: auto;
  overflow: overlay;
}
.article-block {
  .header {
    display: flex;
    padding: 18px 18px 12px 18px;
    line-height: 20px;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 400;
      color: var(--text-color);
    }

    .operation-bar {
      margin-left: 12px;
      .link {
        color: var(--theme-color);
        cursor: pointer;
      }
    }
  }

  .body {
    padding: 0 18px 18px 18px;
  }
}

.flex-full {
  flex: 1;
}

.block-menu-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 112px);
  grid-column-gap: 30px;
  grid-row-gap: 12px;

  > .block-menu {
    width: 112px;
    height: 98px;
    .brdr(4px);
    .pd(12px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: #f6f9ff;
    }

    .img-container {
      @size: 44px;
      .wh(@size, @size);
      margin: 12px 34px 12px 34px;
      position: relative;

      .block-badge {
        position: absolute;
        padding: 2px 6px;
        right: -13px;
        top: -8px;
        background: #ec1e1e;
        border-radius: 10px;
        border: 2px solid #ffffff;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1;
      }

      img {
        width: 44px;
        height: 44px;
        display: block;
      }
    }

    > span {
      font-size: 14px;
      color: var(--text-second-color);
    }
  }
}

.scheduling-contarner {
  display: grid;
  background-color: var(--table-border-color);
  border: solid 1px var(--table-border-color);
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 1px;

  .scheduling-column {
    min-height: 167px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;

    .empty {
      flex: 1;
      content: '暂无排班';
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: var(--text-third-color);
    }

    .week {
      display: flex;
      align-items: center;
      // justify-content: center;
      height: 40px;
      background: var(--table-thead-th-bg-color); //fade(#a4b2c2, 10);
      border-bottom: solid 1px var(--table-border-color);
      color: var(--text-third-color);
      padding-left: 12px;
      font-size: 12px;
      > span {
        font-weight: 600;
        margin-right: 6px;
        color: var(--text-color);
      }
    }

    .day {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-second-color);
      padding: 6px 0 2px 6px;
    }

    .scheduling {
      overflow: hidden;
      position: relative;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid rgba(var(--theme-rgb-color), 0.5);
      margin: -1px 8px 8px -1px;
      display: flex;
      flex-direction: column;
      padding: 6px 8px 8px 8px;
      font-size: 12px;
      cursor: pointer;

      &:before {
        position: absolute;
        left: -1px;
        top: -1px;
        right: -1px;
        content: ' ';
        height: 4px;
        background: rgba(var(--theme-rgb-color), 0.8);
        border-radius: 4px;
      }

      .project-name {
        font-weight: 600;
        color: var(--text-color);
        line-height: 18px;
      }
      .studio-name {
        background: var(--table-thead-th-bg-color);
        border-radius: 2px;
        line-height: 18px;
        color: var(--text-second-color);
        margin-top: 6px;
        padding: 0 4px;
      }
      .time {
        color: var(--text-color);
        margin-top: 12px;
        padding-left: 12px;
        position: relative;
        line-height: 18px;
        > span {
          position: absolute;
          display: inline-block;
          &:first-of-type {
            left: 0;
            top: 6px;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background: fade(#3c5269, 30);
          }
          &:nth-of-type(2) {
            left: 2px;
            top: 14px;
            width: 2px;
            height: 20px;
            background: rgba(var(--tip-icon-rgb-color), 0.3);
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
@import './index.less';
</style>
