<template>
  <div class="order-detail-box">
    <div class="title mgt-20">
      <span class="mgr-12">交付</span>
      <template>
        <tg-button
          v-if="Permission.delivery"
          size="mini"
          type="primary"
          class="mgr-8"
          @click="approved"
        >
          交付
        </tg-button>
      </template>
    </div>
    <div class="grid-box">
      <div
        class="grid-box-item col-span-full"
        style="margin-bottom: 12px; display: block"
        v-for="(i, index) in getInfoProperty_list"
        :key="i.id"
      >
        <div
          class="grid-box-item-title mgr-10"
          style="
            display: flex;
            min-width: auto;
            text-align: start;
            align-items: start;
            line-height: 24px;
          "
        >
          <!-- <tg-textPopover :text="i.design_type_name" :maxWidth="150" /> -->
          <div v-if="i.design_type_name" class="mgb-10">{{ i.design_type_name }}</div>
        </div>
        <div class="grid-box-item-content" style="width: 100%">
          <!-- <tg-textPopover
            :text="i.name"
            class="pdl-18 mgr-12"
            style="margin-right: 12px"
            :maxWidth="80"
          /> -->
          <div style="min-width: 80px; padding-top: 3px; white-space: nowrap" class="pdl-18">
            {{ i.name }}：
          </div>
          <opinion-upload
            style="flex: 1"
            v-if="Permission.showFileList"
            :extensions="i.require_type"
            :showDelete="Permission.initiateAnAudit"
            :canIUpload="Permission.initiateAnAudit"
            @change="(type, file) => changeUpload(type, file, index, 'addition_attachment')"
            v-model="i.attachment"
          ></opinion-upload>
        </div>
      </div>
      <!-- <div
        class="grid-box-item col-span-full"
        style="margin-bottom: 8px"
        v-for="i in getInfoProperty('delivery_attachment')"
        :key="i.id"
      >
        <div
          class="grid-box-item-title mgr-10"
          style="
            display: flex;
            min-width: auto;
            text-align: start;
            align-items: start;
            line-height: 24px;
          "
        >
          <tg-textPopover :text="i.design_type_name" :maxWidth="80" />：{{ i.name }}
        </div>
        <div class="grid-box-item-content" style="width: 100%">
          <opinion-upload
            :extensions="i.require_type"
            :showDelete="Permission.initiateAnAudit"
            :canIUpload="Permission.initiateAnAudit"
            @change="(type, file) => changeUpload(type, file, i, 'delivery_attachment')"
            v-model="i.attachment"
          ></opinion-upload>
        </div>
      </div> -->
      <!-- <div class="grid-box-item col-span-full">
        <div class="grid-box-item-title">场景施工图：</div>
        <div class="grid-box-item-content" style="width: 100%">
          <opinion-upload v-model="fileList"></opinion-upload>
        </div>
      </div> -->
      <div class="grid-box-item" style="flex-direction: initial" v-if="data.actual_delivery_time">
        <div class="grid-box-item-title">交付时间：</div>
        <div class="grid-box-item-content">{{ data.actual_delivery_time }}</div>
      </div>
    </div>
  </div>
</template>

<script src="./delivery.ts"></script>
<style lang="less" scoped>
@import '../detailOld.less';
</style>
