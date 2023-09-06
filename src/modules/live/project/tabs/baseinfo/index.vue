<template>
  <div>
    <div v-if="project" class="tg-live-project-base-info">
      <div class="project-detail-title">
        项目名称：<DefText :content="project.project_name" /> (<DefText
          :content="project.project_uid"
        />)
        <span
          v-if="Permission.canEdit"
          @click="toggleAddProjectModalVisible(true)"
          style="cursor: pointer; margin-left: 30px; display: inline-block"
          ><i class="el-icon-edit-outline" style="font-size: 20px"
        /></span>
      </div>

      <div class="sub-block">
        <!-- [基础信息] -->
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">公司名称：</div>
            <div
              class="base-grid-item-content"
              @click="jumptoCompanyDetailPage(project.company_id)"
              style="cursor: pointer; color: var(--theme-color)"
            >
              <DefText :content="project.company_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">店铺名称：</div>
            <div class="base-grid-item-content">
              <DefText :content="project.shop_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">品牌：</div>
            <div class="base-grid-item-content">
              <DefText :content="project.brand_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">店铺类目：</div>
            <div class="base-grid-item-content">
              <DefText :content="category_str" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">业务类型：</div>
            <div class="base-grid-item-content">
              <DefText :content="business_type_str" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">合作类型：</div>
            <div class="base-grid-item-content">
              <DefText :content="cooperation_type_str" />
            </div>
          </div>
          <div class="base-grid-item" v-if="SelfSupportCooperation">
            <div class="base-grid-item-lbl">直播间：</div>
            <div class="base-grid-item-content">
              <DefText :content="project.studio_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">结算周期：</div>
            <div class="base-grid-item-content">
              <DefText :content="settlement_cycle_type_str" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">小时报价：</div>
            <div class="base-grid-item-content">
              <DefText :content="price_per_hour_str" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">佣金比例：</div>
            <div class="base-grid-item-content"><DefText :content="commission_rate_str" /></div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">项目周期：</div>
            <div class="base-grid-item-content">
              <DefText :content="project_date_range" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">项目经理：</div>
            <div class="base-grid-item-content">
              <DefText :content="project.project_manager" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">客户经理：</div>
            <div class="base-grid-item-content">
              <DefText :content="project.customer_manager" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="project.business_type === BusinessTypeEnum.taobao"
        class="base-grid-item"
        style="width: 100%; margin-top: 12px"
      >
        <div class="base-grid-item-lbl flex-none">直播账号：</div>
        <div class="base-grid-item-content line-clamp-1">
          <DefText :content="live_account_ids_str" />
        </div>
      </div>

      <!-- <div class="base-grid-item" style="width: 100%; margin-top: 12px">
        <div class="base-grid-item-lbl flex-none">备注：</div>
        <div class="base-grid-item-content line-clamp-2">
          <DefText :content="project.remark" />
        </div>
      </div> -->

      <!-- <div class="line mgt-18 mgb-6"></div> -->

      <!-- <div class="project-detail-second-title">客户需求</div>
      <div class="sub-block">
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">每月场次：</div>
            <div class="base-grid-item-content">
              <DefText :content="live_num_per_month_str" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">每场时长：</div>
            <div class="base-grid-item-content">
              <DefText :content="duration_per_live_str" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">月度时长：</div>
            <div class="base-grid-item-content">
              <DefText :content="month_duration_str" />
            </div>
          </div>
        </div>
      </div>
      <div class="base-grid-item mgt-12">
        <div class="base-grid-item-lbl flex-none">其他需求：</div>
        <div class="base-grid-item-content">
          <DefText :content="project.other_requirement" />
        </div>
      </div> -->
    </div>
    <AddLiveProject
      :visible="AddProjectVisible"
      :project="currentProject"
      :isEditForm="true"
      @dialog:close="onAddProjectModalClose"
    />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
