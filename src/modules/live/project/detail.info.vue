<template>
  <div v-if="project">
    <div class="project-detail-title">
      项目编号：<DefText :content="project.project_uid" />
      <div class="project-edit-block" v-if="Permission.canEdit">
        <a @click="toggleAddProjectModalVisible(true)">编辑</a>
      </div>
    </div>

    <div class="sub-block">
      <!-- [基础信息] -->
      <div class="base-grid">
        <div class="base-grid-item">
          <div class="base-grid-item-lbl">客户名称：</div>
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
        <div
          class="base-grid-item"
          v-if="
            project.cooperation_type === 1 &&
            (project.business_type === 3 || project.business_type === 7)
          "
        >
          <div class="base-grid-item-lbl">服务费：</div>
          <div class="base-grid-item-content">
            <DefText :content="server_amount_str" />
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
    <div class="base-grid-item">
      <div class="base-grid-item-lbl flex-none">备注：</div>
      <div class="base-grid-item-content line-clamp-2">
        <DefText :content="project.remark" />
      </div>
    </div>

    <div class="line mgt-20 mgb-20"></div>

    <div class="project-detail-title">客户需求</div>
    <div class="sub-block">
      <!-- [客户需求] -->
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
    <div class="base-grid-item mgb-10">
      <div class="base-grid-item-lbl flex-none">其他需求：</div>
      <div class="base-grid-item-content">
        <DefText :content="project.other_requirement" />
      </div>
    </div>
    <AddLiveProject
      :visible="AddProjectVisible"
      :project="currentProject"
      :isEditForm="true"
      @dialog:close="onAddProjectModalClose"
    />
  </div>
</template>

<script src="./detail.info.ts"></script>
