<template>
  <div class="order-detail-box">
    <div class="title mgt-20">
      <span class="mgr-12">{{ data.step_name }}</span>
      <template>
        <tg-button
          size="mini"
          type="primary"
          class="mgr-8"
          v-if="Permission.initiateAnAudit"
          @click="initiateAnAudit"
        >
          发起审核
        </tg-button>
        <tg-button
          v-if="Permission.auditOpinion"
          size="mini"
          type="primary"
          class="mgr-8"
          @click="dialogOpinon.show('审核意见')"
        >
          审核意见
        </tg-button>
        <tg-button
          v-if="Permission.passOrNotPass"
          size="mini"
          type="primary"
          class="mgr-8"
          @click="approved"
        >
          审核通过
        </tg-button>
        <tg-button v-if="Permission.passOrNotPass" size="mini" @click="dialogAuditFailed.show()">
          审核不通过
        </tg-button>
        <span
          v-if="data.history_record && data.history_record.length > 0"
          class="mgl-12"
          style="font-weight: 400; font-size: 12px; color: var(--theme-color); cursor: pointer"
          @click="dialogAuditRecords.show(data.history_record)"
          >查看历史审核记录</span
        >
      </template>
    </div>
    <div class="grid-box">
      <div class="grid-box-item col-span-full">
        <div class="grid-box-item-title">设计稿：</div>
        <div class="grid-box-item-content" style="width: 100%">
          <opinion-upload
            :canIUpload="Permission.uploadAttachments"
            :showDelete="Permission.uploadAttachments"
            @change="changeUpload"
            v-model="fileList"
          ></opinion-upload>
        </div>
      </div>
      <div class="grid-box-item col-span-full">
        <div class="grid-box-item-title">提交时间：</div>
        <div class="grid-box-item-content">{{ getInfoProperty('submit_time') }}</div>
      </div>
      <div class="grid-box-item col-span-full">
        <div class="grid-box-item-title">审核意见：</div>
        <div class="grid-box-item-columns">
          <template v-if="data.comment_list && data.comment_list.length > 0">
            <div
              class="grid-box-item-columns mgb-12"
              v-for="(i, idx) in data.comment_list"
              :key="i"
              :style="idx + 1 === data.comment_list.length ? 'margin-bottom:0' : ''"
            >
              <span>{{ i.comment }}</span>
              <span class="label-time" style="margin-top: 2px"
                >{{ i.add_by_name }}&nbsp; {{ getInfoProperty('time', i.gmt_create) }}</span
              >
            </div>
          </template>
          <div class="grid-box-item-content" v-else>无</div>
        </div>
      </div>
      <div class="grid-box-item" v-if="data.audit_by_name">
        <div class="grid-box-item-title">审核人：</div>
        <div class="grid-box-item-content">{{ getInfoProperty('audit_by_name') }}</div>
      </div>
      <div class="grid-box-item" v-if="data.audit_by_name">
        <div class="grid-box-item-title">审核时间：</div>
        <div class="grid-box-item-content">{{ getInfoProperty('gmt_modified') }}</div>
      </div>
    </div>
  </div>
</template>

<script src="./step1.ts"></script>
<style lang="less" scoped>
@import '../detailOld.less';
</style>
