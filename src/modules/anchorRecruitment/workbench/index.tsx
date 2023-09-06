import { usePagination } from '@gm/hooks/ahooks';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { defineComponent, h, ref } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import { Col, useColumns } from '../use/useColumn';
import {
  QuerySelfAnchorRecruitmentList,
  QueryShopAndCommonProject,
} from '@/services/anchorRecruitment';
import { useDialog } from '@/use/dialog';
import recruitmentFeedback from '@/modules/anchorRecruitment/dialog/recruitmentFeedback/index.vue';
import { QueryAnchorList } from '@/services/supplier';
import { GetUser } from '@/services/system';
import { UserInfo } from '@/types/tiange/system';
import { CommonBusinessProject } from '@/types/tiange/commonBusiness/project';
import { formatAmount } from '@/utils/string';
import { projectLabelDisplay } from '../use/common';
import { wait } from '@/utils/func';

export default defineComponent({
  setup() {
    const initFormData = () => {
      return {
        dates: undefined,
        recruit_status: undefined,
        anchor_id: undefined,
        project_id: '',
        referrer_id: undefined,
      };
    };
    const {
      dateColumn,
      projectColumn,
      recruitmentStatusColumn,
      userNameColumn,
      cooperationContentColumn,
      cooperationSituationColumn,
      referorColumn,
      businessFeeColumn,
      otherExplanationsColumn,
      serviceRatingColumn,
    } = useColumns();

    const columns = [
      dateColumn.value,
      projectColumn.value,
      recruitmentStatusColumn.value,
      userNameColumn.value,
      cooperationContentColumn.value,
      cooperationSituationColumn.value,
      referorColumn.value,
      businessFeeColumn.value,
      otherExplanationsColumn.value,
      serviceRatingColumn.value,
      {
        label: '操作',
        align: 'center',
        width: 60,
        formatter: row => {
          return row.recruit_status === E.supplier.RecruitmentStatus.COMPLETE
            ? ''
            : h(
                'tg-button',
                {
                  props: {
                    type: 'link',
                  },
                  on: {
                    click() {
                      dialogRecruitmentFeedback.show(row, false);
                      // console.log('确认');
                    },
                  },
                },
                '确认',
              );
        },
      } as Col,
    ];

    const business_cost = ref<number | undefined>(undefined);
    const formData = ref(initFormData());
    const reqList = usePagination(QuerySelfAnchorRecruitmentList, {
      onSuccess(_, oData) {
        business_cost.value = (oData as any).data?.merge_data?.business_cost;
      },
    });
    const anchorLoading = ref(false);
    const anchorOptions = ref<any[]>([]);
    const referrerLoading = ref(false);
    const referrerOptions = ref<UserInfo[]>([]);
    const projectLoading = ref(false);
    const projectOptions = ref<CommonBusinessProject[]>([]);

    const exportModel = {
      config: {
        reset() {
          formData.value = initFormData();
        },
        searchBefor() {
          const { dates, ...rest } = formData.value;
          const [start_date, end_date] = dates || [];
          return {
            start_date,
            end_date,
            ...rest,
          };
        },
        table: {
          border: true,
          showSummary: true,
          summaryMethod({ columns }: { columns: any; data: any }) {
            const sums: string[] = [];
            columns.forEach((column: any) => {
              if (column.property === 'business_cost') {
                const sumStr =
                  business_cost.value === undefined || business_cost.value === null
                    ? ' --'
                    : formatAmount(business_cost.value / 100, 'None');
                sums.push(sumStr);
              }
              if (column.property === 'create_date') {
                sums.push('合计');
              } else {
                sums.push('--');
              }
            });
            return sums;
          },
          rowClick(row: any, column: any) {
            if (column.label === '操作') return;
            dialogRecruitmentFeedbackDetail.show(row, true);
          },
        },
      },

      async queryAnchorList(keywords?: string) {
        if (!keywords) {
          anchorOptions.value = [];
          return;
        }
        anchorLoading.value = true;
        const [res] = await wait(
          200,
          QueryAnchorList({
            flower_name: keywords,
            page_num: 1,
            num: 1000,
          }),
        );
        anchorLoading.value = false;
        if (res.data.success) {
          anchorOptions.value = res.data.data.data || [];
        } else {
          anchorOptions.value = [];
        }
      },
      async getUser(keywords?: string) {
        if (!keywords) {
          referrerOptions.value = [];
          return;
        }
        referrerLoading.value = true;
        const [res] = await wait(
          200,
          GetUser({
            page_num: 1,
            num: 1000,
            search_type: 2,
            search_value: keywords,
            is_checked: 1,
          }),
        );
        referrerLoading.value = false;
        if (res.data.success) {
          referrerOptions.value = res.data.data.data || [];
        } else {
          referrerOptions.value = [];
        }
      },
      async queryShopAndCommonProject(keywords?: string) {
        if (!keywords) {
          projectOptions.value = [];
          return;
        }
        projectLoading.value = true;
        const [res] = await wait(
          200,
          QueryShopAndCommonProject({
            page_num: 1,
            num: 1000,
            search_type: 6,
            search_value: keywords,
          }),
        );
        projectLoading.value = false;
        if (res.data.success) {
          projectOptions.value = res.data.data.data || [];
        } else {
          projectOptions.value = [];
        }
      },
      projectLabelDisplay,
      formData,
      reqList,
      columns,
    };

    const dialogRecruitmentFeedback = useDialog({
      component: recruitmentFeedback,
      title: '招募结果反馈',
      width: '554px',
      okText: '确定',
      footer: false,
      on: {
        submit() {
          reqList.reload();
        },
      },
    });

    const dialogRecruitmentFeedbackDetail = useDialog({
      component: recruitmentFeedback,
      title: '招募结果反馈详情',
      width: '554px',
      footer: false,
    });
    return {
      anchorOptions,
      anchorLoading,
      referrerLoading,
      referrerOptions,
      projectLoading,
      projectOptions,
      ...exportModel,
    };
  },
  render() {
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        v-model={this.formData}
        config={this.config}
        service={this.reqList}
        // routes={}
      >
        <el-form-item label="发起日期：">
          <el-date-picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.formData.dates}
          />
        </el-form-item>
        <el-form-item label="招募状态：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            placeholder="请选择"
            v-model={this.formData.recruit_status}
            options={E.supplier.RecruitmentStatusOption}
          />
        </el-form-item>
        <el-form-item label="项目名称：">
          {/* <el-input vModel_trim={this.formData.project_id} placeholder="请输入项目名称"></el-input> */}
          <el-select
            v-model={this.formData.project_id}
            filterable
            remote
            reserve-keyword
            placeholder="请输入项目名称"
            remote-method={this.queryShopAndCommonProject}
            loading={this.projectLoading}
            clearable
          >
            {this.projectOptions.map(el => (
              <el-option key={el.id} label={this.projectLabelDisplay(el)} value={el.id}></el-option>
            ))}
          </el-select>
        </el-form-item>
        <el-form-item label="主播花名：">
          {/* <el-input vModel_trim={this.formData.anchor_id} placeholder="请输入花名"></el-input> */}
          <el-select
            v-model={this.formData.anchor_id}
            filterable
            remote
            reserve-keyword
            placeholder="请输入花名"
            remote-method={this.queryAnchorList}
            loading={this.anchorLoading}
            clearable
          >
            {this.anchorOptions.map(el => (
              <el-option
                key={el.id}
                label={`${el.flower_name} (${el.real_name})`}
                value={el.id}
              ></el-option>
            ))}
          </el-select>
        </el-form-item>
        <el-form-item label="推荐人：">
          {/* <el-input vModel_trim={this.formData.referrer_id} placeholder="请输入花名"></el-input> */}
          <el-select
            v-model={this.formData.referrer_id}
            filterable
            remote
            reserve-keyword
            placeholder="请输入花名"
            remote-method={this.getUser}
            loading={this.referrerLoading}
            clearable
          >
            {this.referrerOptions.map(el => (
              <el-option key={el.id} label={`${el.username}`} value={el.id}></el-option>
            ))}
          </el-select>
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
