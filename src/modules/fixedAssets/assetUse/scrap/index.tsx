import { defineComponent, ref, computed } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { UpdateContractTaxSubject } from '@/services/contract';
// import { Select } from '@gm/component/select';
import { FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { QueryFixedAssetScrappedRecord } from '@/services/fixedAssets';
// import { usePermission } from '@/use/permission';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { useComonTable } from '@/modules/fixedAssets/use';
import detail from './dialog/detail.vue';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        align: 'center',
        label: '报废单号',
        minWidth: 120,
        prop: 'scrapped_code',
      },
      {
        align: 'center',
        label: '申请时间',
        minWidth: 100,
        prop: 'initiator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'left',
        label: '报废原因',
        prop: 'scrapped_reason',
        'show-overflow-tooltip': true,
        minWidth: 150,
        dataType: {
          type: 'enum',
          enum: E.fixedassets.reasonForScrappingMap,
        },
      },
      {
        align: 'center',
        label: '申请人',
        minWidth: 80,
        prop: 'add_by_name',
      },
      // {
      //   label: '审批状态',
      //   align: 'center',
      //   prop: 'reservation_status',
      //   dataType: {
      //     type: 'enum',
      //     enum: E.fixedassets.ReceiveStatusEnumMap,
      //   },
      // },
      {
        align: 'center',
        label: '资产清单',
        minWidth: 80,
        prop: 'appointment_time',
        formatter: row => {
          return (
            <el-popover placement="bottom" width="584" trigger="click">
              {useComonTable(row.scrapped_relation_list)}
              <tg-button type="link" slot="reference">
                查看
              </tg-button>
            </el-popover>
          );
        },
      },
      {
        label: '操作',
        width: 100,
        align: 'center',
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          addButns('查看', () => {
            DetailDialog.show({ ...row });
          });
          return <div>{btns}</div>;
        },
      },
    ];
    const otherQueryFrom = ref({
      returnTime: [],
    }); // 其他查询条件
    const initQueryForm = (): any => {
      return {
        scrapped_code: undefined, // 报废单号
        add_by: undefined, // 申请人ID
        initiator_start_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[0];
        }),
        initiator_end_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[1];
        }),
      };
    };
    const DetailDialog = useDialog({
      component: detail,
      footer: false,
      width: '686px',
      title: '报废',
      on: {
        submit(row: any) {
          const UpdateContractTaxSubjectSmb = useRequest(UpdateContractTaxSubject, {
            manual: true,
          });
          UpdateContractTaxSubjectSmb.runAsync({
            id: row.contract_info.id,
            tax_subject_type: row.contract_info.tax_subject_type,
          }).then(res => {
            console.log(res, 'res');
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    // const query = usePagination(QueryFixedAssetScrappedRecord);
    const query = usePagination(QueryFixedAssetScrappedRecord);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
        otherQueryFrom.value.returnTime = [];
      },
      table: {
        border: true,
        rowClick(row: any, column: any) {
          // if (column.label === '操作') return;
          // dialogRecruitmentFeedback.show(row, true);
        },
      },
    };
    return {
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      otherQueryFrom,
    };
  },
  render() {
    const keyEnter = () =>
      this.query.run(
        {
          page_num: 1,
          num: this.query.pagination.num,
        },
        this.queryForm,
      );
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="报废单号：">
          <el-input
            v-model={this.queryForm.scrapped_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="申请人：">
          {/* <el-input v-model={this.queryForm.add_by} v-auto-placeholder v-key-enter={keyEnter} /> */}
          <FunctionSelect
            style="width: 100%"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={this.queryForm.add_by}
            otherParams={{ is_contain_goumee: true }}
            placeholder="请选择申请人"
            ref="projectSelect"
          />
        </el-form-item>
        <el-form-item label="申请时间：">
          <el-date-picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.otherQueryFrom.returnTime}
          />
        </el-form-item>
        {/* <el-form-item label="审批状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.sign_type}
            v-auto-placeholder
            options={E.fixedassets.ReceiveStatusEnumOption.filter(v => v.value !== 2)}
          />
        </el-form-item> */}
        {/* <div slot="btnLine">
          <tg-button type="primary" icon="ico-btn-add" on-click={() => {}}>
            批量归还
          </tg-button>
        </div> */}
      </ListGenerallyTemplate>
    );
  },
});
