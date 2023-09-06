<template>
  <div class="cooperation-container">
    <div v-if="canSign" class="btn-field">
      <tg-button icon="ico-btn-add" type="primary" @click="operation.add">个人签约</tg-button>
    </div>
    <div class="table-field" :class="canSign ? '' : 'mgt-18'">
      <tg-table
        stripe
        border
        :columns="columns"
        max-height="100%"
        :height="(info.cooperations || []).length === 0 ? '100%' : ''"
        :data="info.cooperations"
      >
        <template #empty>
          <empty-common detail-text="暂无合作信息" />
        </template>
      </tg-table>
    </div>
  </div>
</template>
<script src="./index.tsx"></script>

<style lang="less" scoped>
@import './index.less';
.cooperation-container {
  height: 100%;
  padding: 0 24px 18px;
  display: flex;
  flex-direction: column;
}
.btn-field {
  padding: 12px 0;
  flex-shrink: 0;
}
.table-field {
  flex-grow: 1;
  overflow: hidden;
}
/deep/ .el-table {
  display: flex;
  flex-direction: column;
  .el-table__header-wrapper {
    flex-shrink: 0;
  }
  .el-table__body-wrapper {
    flex-grow: 1;
  }
  .normal {
    color: var(--success-color);
  }
  .approving {
    color: #ff7a36;
  }
  .failed {
    color: #ec1e1e;
  }
  .invalid {
    color: #6a7b92;
  }
}
</style>
<!-- <template>
  <div>
    <div class="cooperation-info-box" v-if="operation.isEdit">
      <tg-button type="primary" icon="ico-btn-add" @click="operation.add">新增合作</tg-button>
    </div>
    <div class="cooperation-info">
      <div class="cooperation-item" v-for="item in info.cooperations" :key="item.id">
        <div class="title-area">
          <span class="cooperation-shop">
            <tg-textPopover
              :text="item.project_name"
              defaultText="未关联项目"
              :maxWidth="192"
              textClass="cooperation-shop-title"
            />
            <span class="cooperation-status invalid" v-if="item.release_status === 1">已解除</span>
            <span
              class="cooperation-status normal"
              v-else-if="item.cooperation_status === 2 && contract_isValid(item)"
              >合作中</span
            >
            <span
              class="cooperation-status invalid"
              v-else-if="item.cooperation_status === 2 && !contract_isValid(item)"
              >已过期</span
            >

            <span class="cooperation-status approving" v-else-if="item.cooperation_status === 4"
              >审核中</span
            >
            <span class="cooperation-status failed" v-else-if="item.cooperation_status === 3"
              >审核不通过</span
            >
          </span>
          <span class="fill"></span>
          <span class="cooperation-operation" v-if="operation.isEdit">
            <tg-icon class="ico-btn-delete" name="ico-btn-delete" @click="operation.del(item.id)" />
            <tg-icon name="ico-edit" @click="operation.edit(item)" />
          </span>
          <tg-button type="link" @click="gotoContractClick(item)">详情</tg-button>
        </div>
        <div class="content-area">
          <div class="content-row">
            <span class="label">合作时间：</span>
            <span class="text"
              >{{ item.start_date ? item.start_date.replace(/-/g, '.') : '' }}～{{
                item.end_date ? item.end_date.replace(/-/g, '.') : ''
              }}</span
            >
          </div>
          <div class="content-row">
            <span class="label">计算方式：</span>
            <span class="text">{{
              item.settlement_type_label ? item.settlement_type_label : '--'
            }}</span>
          </div>

          <div class="content-row" v-if="item.settlement_type === 1">
            <span class="label">{{ item.settlement_type_label }}：</span>
            <span class="text">{{ item.hourly_wage ? item.hourly_wage : '--' }} 元/时</span>
          </div>
          <div class="content-row" v-if="item.settlement_type === 3">
            <span class="label">{{ item.settlement_type_label }}：</span>
            <span class="text">{{ item.base_salary ? item.base_salary : '--' }} 元</span>
          </div>
          <div class="content-row">
            <span class="label">直播场次：</span>
            <span class="text"
              >{{ item.live_count ? item.live_count : '--' }}场&nbsp;&nbsp;{{
                item.live_time ? parseInt(item.live_time / 60) : '--'
              }}小时{{ item.live_time ? item.live_time % 60 : '--' }}分</span
            >
          </div>
          <div class="content-row contract">
            <span class="label">合同附件：</span>
            <div class="attach">
              <ul>
                <li class="attach-item text" v-for="(attach, index) in item.appendix" :key="index">
                  <tg-icon :name="urlHelper.getFileInfo(attach.url).icoName" />
                  <div class="text line-clamp-1" style="word-break: break-all; line-height: 18px">
                    {{ urlHelper.getFileInfo(attach.url).fileName }}
                  </div>
                  <tg-button
                    type="link"
                    class="view"
                    @click.prevent="() => downloadAPIFileHandler(attach.url, attach.file_name)"
                  >
                    <tg-icon name="ico-xiazai"></tg-icon>
                  </tg-button>
                </li>
                <li class="attach-item text" v-if="item.appendix.length === 0">
                  <div class="text">暂无附件</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-data" v-if="info.cooperations.length <= 0">
      <empty-common detail-text="暂无合作信息"></empty-common>
    </div>
  </div>
</template> -->
