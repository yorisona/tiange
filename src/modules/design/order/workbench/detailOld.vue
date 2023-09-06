<template>
  <div class="order-detail-box">
    <tg-card :padding="[18, 28, 40, 18]" style="flex: 1">
      <div class="projectTitle">
        <div style="display: flex; align-items: center">
          <span class="projectTitle-title">{{ getInfoProperty('name') }}</span>
          <span
            :style="{
              color: getColor.get(getInfoProperty('status_name')),
              background: getBgColor.get(getInfoProperty('status_name')),
              padding: '1px 10px',
              borderRadius: '10px',
            }"
            >{{ getInfoProperty('status_name') }}</span
          >
        </div>
        <tg-button
          size="mini"
          style="border-color: var(--border-line-color)"
          class="tg-btn tg-btn-default"
          v-if="Permission.eventCancellation"
          @click="eventCancellation"
        >
          活动取消
        </tg-button>
      </div>
      <div class="title">
        <span class="mgr-12">下单明细</span>
      </div>
      <div class="grid-box">
        <!-- <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">项目名称：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('name') }}</div>
        </div> -->
        <div class="grid-box-item col-span-full" v-if="getInfoProperty('brand') !== '--'">
          <div class="grid-box-item-title">品牌名称：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('brand') }}</div>
        </div>
        <!-- <div class="grid-box-item">
          <div class="grid-box-item-title">项目状态：</div>
          <div
            class="grid-box-item-content"
            :style="{ color: getColor.get(getInfoProperty('status_name')) }"
          >
            {{ getInfoProperty('status_name') }}
          </div>
        </div> -->
        <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">项目小组：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('team_name') }}</div>
        </div>
        <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">项目类型：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('project_type') }}</div>
        </div>
        <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">交付内容&nbsp;&nbsp;&nbsp;</div>
          <div
            class="grid-box-item-columns"
            v-if="info.delivery_attachment && info.delivery_attachment.length"
          >
            <div v-for="v in getInfoProperty('delivery_attachment')" :key="v">{{ v }}</div>
          </div>
          <div v-else class="grid-box-item-content">--</div>
        </div>
        <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">附加内容&nbsp;&nbsp;&nbsp;</div>
          <div
            class="grid-box-item-columns"
            v-if="info.addition_attachment && info.addition_attachment.length"
          >
            <div
              v-for="v in getInfoProperty('addition_attachment')"
              :key="v"
              style="margin-bottom: 4px"
            >
              {{ v }}
            </div>
          </div>
          <div v-else class="grid-box-item-content">--</div>
        </div>
        <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">期望交付时间：</div>
          <div class="grid-box-item-content">
            {{ getInfoProperty('expectation_delivery_time') }}
          </div>
        </div>
        <div class="grid-box-item col-span-full">
          <div class="grid-box-item-title">项目主题：</div>
          <div class="grid-box-item-content">
            {{ getInfoProperty('subject') }}
          </div>
        </div>
        <template v-for="i in getInfoProperty('design_type_detail_list')">
          <!-- <div class="grid-box-item col-span-full item-type" :key="i">
            <div class="grid-box-item-title" style="text-align: start">
              {{ i.design_type && i.design_type.name }}
            </div>
          </div> -->
          <div class="col-span-full" :key="i">
            <div class="grid-box-item col-span-full" v-for="ii in i.design_type_detail" :key="ii">
              <template
                v-if="
                  ii.design_type_field_name === '项目内容' ||
                  ii.design_type_field_name === '视觉层级'
                "
              >
                <div class="grid-box-item-title">
                  {{ ii.design_type_field_name }}&nbsp;&nbsp;&nbsp;
                </div>
                <div class="grid-box-item-columns">
                  <span
                    class="multiple-columns"
                    :key="iii"
                    v-for="iii in getContent(ii.design_order_type_field_detail)"
                  >
                    {{ iii.key }}：{{ iii.value || '--' }}
                  </span>
                </div>
              </template>
              <template v-else-if="ii.design_type_field_name === '参考资料'">
                <div class="grid-box-item-title">{{ ii.design_type_field_name }}：</div>
                <div class="grid-box-item-columns">
                  <opinion-upload
                    v-if="ii.design_order_type_field_detail"
                    :canIUpload="false"
                    v-model="ii.design_order_type_field_detail"
                    :showDelete="false"
                  ></opinion-upload>
                  <span v-else>--</span>
                </div>
              </template>
              <template v-else>
                <div class="grid-box-item-title">{{ ii.design_type_field_name }}：</div>
                <div class="grid-box-item-columns">
                  <span
                    class="multiple-columns"
                    v-if="Array.isArray(ii.design_order_type_field_detail)"
                    >{{ ii.design_order_type_field_detail.join('、') || '--' }}</span
                  >
                  <span class="multiple-columns" v-else>{{
                    ii.design_order_type_field_detail || '--'
                  }}</span>
                </div>
              </template>
            </div>
            <!-- <div class="grid-box-item col-span-full">
              <div class="grid-box-item-title">视觉层级：</div>
              <div class="grid-box-item-columns">
                <span class="multiple-columns">第一层级：双十一狂欢 下单送好礼</span>
                <span class="multiple-columns">第二层级：双十一狂欢 下单送好礼</span>
                <span class="multiple-columns">第三层级：双十一狂欢 下单送好礼</span>
              </div>
            </div>
            <div class="grid-box-item col-span-full">
              <div class="grid-box-item-title">偏好：</div>
              <div class="grid-box-item-content">
                <span>色彩偏好：红色、金色</span>
                <span>风格偏好：时尚、潮酷</span>
              </div>
            </div>
            <div class="grid-box-item col-span-full">
              <div class="grid-box-item-title">物料尺寸：</div>
              <div class="grid-box-item-content">1080*2146px</div>
            </div> -->
            <!-- <div class="grid-box-item col-span-full">
              <div class="grid-box-item-title">备注：</div>
              <div class="grid-box-item-content">双十一氛围感浓一点，利益点突出一点</div>
            </div>
            <div class="grid-box-item col-span-full">
              <div class="grid-box-item-title">参考资料：</div>
              <div class="grid-box-item-content">
                {{ getInfoProperty('attachment').length === 0 && '无' }}
              </div>
            </div> -->
          </div>
        </template>
        <div class="grid-box-item">
          <div class="grid-box-item-title">下单人：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('add_by_name') }}</div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">下单部门：</div>
          <div class="grid-box-item-content">
            {{ getInfoProperty('department_name') }}
          </div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">下单时间：</div>
          <div class="grid-box-item-content">
            {{ getInfoProperty('gmt_modified') }}
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="title mgt-20">
        <span class="mgr-12">项目分配</span>
        <tg-button
          size="mini"
          v-if="Permission.distribution && !info.assigner"
          type="primary"
          class="mgr-8"
          @click="dialogTask.show()"
        >
          任务分配
        </tg-button>
        <tg-button
          size="mini"
          v-if="Permission.redistribution"
          type="primary"
          class="mgr-8"
          @click="clickRedistribution"
        >
          重新分配
        </tg-button>
        <tg-button
          size="mini"
          v-if="Permission.distribution"
          @click="dialogOpinon.show('拒绝原因')"
        >
          拒绝
        </tg-button>
      </div>
      <div class="grid-box">
        <div class="grid-box-item">
          <div class="grid-box-item-title">执行人：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('executor_name') }}</div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">交付时间：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('delivery_time') }}</div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">项目等级：</div>
          <div class="grid-box-item-content">
            {{ getInfoProperty('design_level_info').level_name || '--' }}
          </div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">分配人：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('assigner_name') }}</div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">分配时间：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('allocate_time') }}</div>
        </div>
      </div>
      <!-- 三个审核状态 -->
      <template v-if="info.step_list && info.step_list.length > 0">
        <template v-for="(i, idx) in info.step_list">
          <div class="line" :key="i.step_id"></div>
          <step1
            :order_id="order_id"
            :showMask.sync="loading"
            :data="i"
            :key="i.step_id"
            :allData="info"
            :is_last_step="idx + 1 === info.step_list.length"
            @change="loadData"
          />
          <!-- <div class="line" :key="i.step_id"></div> -->
        </template>
      </template>
      <div class="line" v-if="Permission.delivery"></div>
      <delivery
        v-if="Permission.delivery"
        @change="loadData"
        :order_id="order_id"
        :showMask.sync="loading"
        :data="info"
      />
      <div v-if="Permission.complete_design_order || info.status === 600" class="line"></div>
      <tg-button
        v-if="Permission.complete_design_order"
        size="mini"
        type="primary"
        class="mgr-8 mgt-20"
        @click="confirmCompletion"
      >
        确认完成
      </tg-button>
      <div class="grid-box mgt-20" v-if="info.status === 600">
        <div class="grid-box-item">
          <div class="grid-box-item-title">确认完成：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('gmt_modified') }}</div>
        </div>
        <div class="grid-box-item">
          <div class="grid-box-item-title">确认人：</div>
          <div class="grid-box-item-content">{{ getInfoProperty('modified_by_name') }}</div>
        </div>
      </div>
    </tg-card>
    <tg-mask-loading :visible="loading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./detailOld.ts"></script>

<style lang="less" scoped>
@import './detailOld.less';
</style>
