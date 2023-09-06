<template>
  <div style="height: 531px; border: 1px solid var(--border-line-div-color); border-radius: 4px">
    <div
      style="
        margin: 32px auto;
        width: 968px;
        height: 56px;
        border-radius: 10px;
        display: flex;
        background: #ff8c00;
      "
    >
      <div
        style="
          width: 0px;
          background: var(--theme-color);
          font-weight: 400;
          font-size: 18px;
          color: #ffffff;
          padding-left: 70px;
          text-align: left;
          min-width: 250px;
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;
        "
        :style="{
          width: getWidthperent(detail_obj.purchase_people_num, detail_obj.not_purchase_people_num),
        }"
      >
        <div style="line-height: 56px">
          成交人数：{{
            detail_obj.purchase_people_num === null || detail_obj.purchase_people_num === undefined
              ? '&#45;&#45;'
              : formatAmount(Number(detail_obj.purchase_people_num || 0).toFixed(0), 'None', true)
          }}
        </div>
      </div>
      <div
        style="
          flex: 1;
          font-weight: 400;
          font-size: 18px;
          color: #ffffff;
          padding-right: 70px;
          text-align: right;
          min-width: 250px;
          border-bottom-right-radius: 10px;
          border-top-right-radius: 10px;
        "
      >
        <div style="line-height: 56px">
          未成交人数：{{
            detail_obj.not_purchase_people_num === null ||
            detail_obj.not_purchase_people_num === undefined
              ? '&#45;&#45;'
              : formatAmount(
                  Number(detail_obj.not_purchase_people_num || 0).toFixed(0),
                  'None',
                  true,
                )
          }}
        </div>
      </div>
    </div>
    <div
      style="
        margin: 32px auto;
        width: 968px;
        display: flex;
        justify-content: space-between;
        padding-top: 0px;
      "
    >
      <div
        style="
          width: 520px;
          height: 376px;
          background: #fafafa;
          border: 1px solid var(--border-line-div-color);
        "
      >
        <div
          style="
            height: 20px;
            width: 20px;
            background-color: #fafafa;
            z-index: 1;
            border-left: 1px solid var(--border-line-div-color);
            border-top: 1px solid var(--border-line-div-color);
            transform: rotate(45deg);
            margin-left: 150px;
            margin-top: -11px;
          "
        ></div>
        <line-div
          :obj="{
            people_num_ratio: detail_obj.first_purchase_people_num_ratio,
            people_num: detail_obj.first_purchase_people_num,
            one_lable: '首购人数',
            two_lable: '复购人数',
            second_people_num_ratio: detail_obj.second_purchase_people_num_ratio,
            second_people_num: detail_obj.second_purchase_people_num,
            issuccess: true,
          }"
        ></line-div>
        <line-div
          :obj="{
            people_num_ratio: detail_obj.purchase_interact_num_ratio,
            people_num: detail_obj.purchase_interact_num,
            one_lable: '有互动人数',
            two_lable: '无互动人数',
            second_people_num_ratio: detail_obj.purchase_not_interact_num_ratio,
            second_people_num: detail_obj.purchase_not_interact_num,
            issuccess: true,
          }"
        ></line-div>
        <line-div
          :obj="{
            people_num_ratio: detail_obj.purchase_fans_num_ratio,
            people_num: detail_obj.purchase_fans_num,
            one_lable: '粉丝人数',
            two_lable: '非粉丝人数',
            second_people_num_ratio: detail_obj.purchase_not_fans_num_ratio,
            second_people_num: detail_obj.purchase_not_fans_num,
            issuccess: true,
          }"
        ></line-div>
      </div>
      <div
        style="
          margin-left: 24px;
          width: 520px;
          height: 376px;
          background: #fafafa;
          border: 1px solid var(--border-line-div-color);
        "
      >
        <div
          style="
            height: 20px;
            width: 20px;
            background-color: #fafafa;
            z-index: 1;
            border-left: 1px solid var(--border-line-div-color);
            border-top: 1px solid var(--border-line-div-color);
            transform: rotate(45deg);
            margin-left: 350px;
            margin-top: -11px;
          "
        ></div>
        <line-div
          :obj="{
            people_num_ratio: detail_obj.watch_time_40_seconds_more_ratio,
            people_num: detail_obj.watch_time_40_seconds_more,
            one_lable: '观看40s+人数',
            two_lable: '无效观看人数',
            second_people_num_ratio: detail_obj.invalid_watch_people_num_ratio,
            second_people_num: detail_obj.invalid_watch_people_num,
            issuccess: false,
          }"
        ></line-div>
        <line-div
          :obj="{
            people_num_ratio: detail_obj.interact_people_num_ratio,
            people_num: detail_obj.interact_people_num,
            one_lable: '有互动人数',
            two_lable: '无互动人数',
            second_people_num_ratio: detail_obj.not_interact_people_num_ratio,
            second_people_num: detail_obj.not_interact_people_num,
            issuccess: false,
          }"
        ></line-div>
        <line-div
          :obj="{
            people_num_ratio: detail_obj.not_purchase_fans_num_ratio,
            people_num: detail_obj.not_purchase_fans_num,
            one_lable: '粉丝人数',
            two_lable: '非粉丝人数',
            second_people_num_ratio: detail_obj.not_purchase_not_fans_num_ratio,
            second_people_num: detail_obj.not_purchase_not_fans_num,
            issuccess: false,
          }"
        ></line-div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetShopLiveCrowdProjectStatisticsList } from '@/services/datacenter/shoplive';
import { inject, ref } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import lineDiv from '@/modules/datacenter/shoplive/components/crowd/line.vue';
export default {
  components: {
    lineDiv,
  },
  props: {
    performanceId: {
      type: Number,
      default: 0,
    },
    projectData: {
      type: Object,
      default: () => ({}),
    },
    project_id: {
      type: Number,
      default: 0,
    },
    end_date: {
      type: String,
      default: '',
    },
    start_date: {
      type: String,
      default: '',
    },
    merge_shop_live_id: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const searchParams = inject('searchParams') || ref({});
    const daytrendLoading = ref(false);
    const detail_obj = ref({});
    GetShopLiveCrowdProjectStatisticsList(
      {
        is_from_project:
          props.performanceId === 0
            ? searchParams.value.is_from_project || false
            : props.projectData.from_project || false,
        // start_date: props.start_date ? props.start_date : undefined,
        // end_date: props.end_date ? props.end_date : undefined,
        project_id: props.project_id,
        // shop_live_id: props.performanceId,
        merge_shop_live_id: props.merge_shop_live_id,
      },
      // business_type.value,
    ).then(({ data }) => {
      daytrendLoading.value = false;
      if (data.success) {
        detail_obj.value = data.data;
      } else {
        detail_obj.value = {};
        ctx.root.$message.error(data.message || '数据获取失败');
      }
    });
    const getWidthperent = (oneval, twoval) => {
      if (!twoval && !oneval) {
        return '0%';
      }
      if (!twoval) {
        return '100%';
      }
      const total = oneval + twoval;
      return (oneval * 100) / total + '%';
    };
    return {
      daytrendLoading,
      detail_obj,
      formatAmount,
      getWidthperent,
    };
  },
};
</script>
<style lang="less" scoped></style>
