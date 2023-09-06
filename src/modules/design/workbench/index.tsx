import { defineComponent, ref, computed, inject } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { Select } from '@gm/component/select';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import makeAppointment from '@/modules/design/dialog/makeAppointment/index.vue';
import dateSetting from '@/modules/design/dialog/dateSetting/index.vue';
import { useDialog } from '@/use/dialog';
import { useImageMethod } from './common';
import { Query_Project_Name, Query_Reservation_Form } from '@/services/design';
import chargeBack from '../dialog/chargeBack/index.vue';
import utils from '@/utils';
import { VNode } from 'vue';
import { useMarkeup, useUserInfo } from '@/use/vuex';
import { usePermission } from '@/use/permission';
import moment from 'moment';

enum ETabType {
  ALL = 1,
  BACKLOG,
  DONE,
  WITHDRAWN,
  CC_ME,
}

export default defineComponent({
  setup: (props, ctx) => {
    const user = useUserInfo();
    const permission = usePermission();
    const ImageMethod = useImageMethod();
    const columns: TgTableColumn<M.design.ReservationQuery>[] = [
      {
        align: 'left',
        label: '业务类型',
        minWidth: 80,
        prop: 'business_type',
        dataType: {
          type: 'enum',
          enum: E.project.BusinessTypeMap,
        },
      },
      {
        align: 'left',
        'show-overflow-tooltip': true,
        label: '项目名称',
        prop: 'project_name',
        minWidth: 120,
      },
      {
        align: 'center',
        label: '预约主体',
        prop: 'appointment_subject',
        minWidth: 80,
        dataType: {
          type: 'enum',
          enum: E.design.AppointmentSubjectMap,
        },
      },
      {
        align: 'center',
        label: '主播类型',
        prop: 'anchor_type',
        minWidth: 80,
        formatter: row => {
          return row.appointment_subject === E.design.AppointmentSubject.MODEL
            ? '--'
            : E.supplier.AnchorTypeMap.get(row.anchor_type);
        },
      },
      {
        align: 'center',
        label: '预约人',
        minWidth: 80,
        prop: 'reservation_person_username',
      },
      {
        align: 'center',
        label: '预约日期',
        minWidth: 100,
        prop: 'appointment_date',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '预约时间',
        minWidth: 100,
        prop: 'appointment_time',
      },
      {
        label: '服务类型',
        align: 'center',
        minWidth: 80,
        prop: 'service_type',
        dataType: {
          type: 'enum',
          enum: E.design.ServiceTypeMap,
        },
      },
      {
        label: '预约状态',
        align: 'center',
        prop: 'reservation_status',
        dataType: {
          type: 'enum',
          enum: E.design.AppointmentStatusMap,
        },
      },
      {
        label: '操作',
        width: 152,
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string) => {
            btns.push(
              <tg-button
                type="link"
                class="mgl-6"
                onClick={() => {
                  ImageMethod.emit(txt, row);
                }}
              >
                {txt}
              </tg-button>,
            );
          };
          const hasSelf = row.image_design_id === user.value.id;
          addButns('查看');
          if (formData.value.tab_type === ETabType.CC_ME) return btns;
          if (
            row.reservation_status === E.design.AppointmentStatus.PENDING_ORDER &&
            hasMarkeup.value
          )
            addButns('接单'), addButns('退单');
          if (
            row.reservation_status === E.design.AppointmentStatus.PENDING_ORDER &&
            row.reservation_person_id === userinfo.value.id
          ) {
            addButns('撤销');
          }

          if (
            row.reservation_status === E.design.AppointmentStatus.TOBE_COMPLETED &&
            hasMarkeup.value
          )
            addButns('完成'), addButns('未完成');

          if (hasSelf && row.reservation_status === E.design.AppointmentStatus.COMMENT) {
            addButns('评价');
            addButns('调整妆造师');
          }
          if (
            hasSelf &&
            row.reservation_status === E.design.AppointmentStatus.PENDING_UPLOAD &&
            hasMarkeup.value
          )
            addButns('上传');
          if (
            row.reservation_status === E.design.AppointmentStatus.CHARGED_BACK &&
            !hasMarkeup.value
          )
            addButns('重新提交');

          return <div>{btns}</div>;
        },
      },
    ];
    const formData = ref({
      reservation_status: null,
      tab_type: 1,
      business_type: null,
      project_name: '',
      appointment_date_list: null,
      start_date: '',
      end_date: '',
      project_id: null,
    });
    const hasMarkeup = useMarkeup();
    const userinfo = useUserInfo();
    const reqList = usePagination(Query_Reservation_Form, { manual: true });
    const tabs: TG.OptionType<ETabType>[] = [
      {
        label: '全部',
        value: ETabType.ALL,
      },
      {
        label: '待办',
        value: ETabType.BACKLOG,
      },
      {
        label: '已办',
        value: ETabType.DONE,
      },
      {
        label: '已撤回',
        value: ETabType.WITHDRAWN,
      },
      hasMarkeup.value && {
        label: '抄送我',
        value: ETabType.CC_ME,
      },
    ].filter(Boolean) as any;
    const onChangeTabs = (value: number) => {
      formData.value.tab_type = value;
      formData.value.reservation_status = null;
      reQuery();
    };
    const subTabsMap = E.design.AppointmentStatusOption.map(it => ({ ...it }));
    const batchSetTabsValue = (...keys: E.design.AppointmentStatus[]) => {
      subTabsMap.forEach(it => {
        const hasFind = keys.find(key => key === it.value);
        if (hasFind || keys.length === 0) {
          it.disabled = false;
        } else {
          it.disabled = true;
        }
      });
    };
    const subTabs = computed(() => {
      switch (formData.value.tab_type) {
        case ETabType.ALL:
          batchSetTabsValue();
          break;
        case ETabType.BACKLOG:
          batchSetTabsValue(
            E.design.AppointmentStatus.PENDING_ORDER,
            E.design.AppointmentStatus.TOBE_COMPLETED,
            E.design.AppointmentStatus.COMMENT,
            E.design.AppointmentStatus.PENDING_UPLOAD,
          );
          break;
        case ETabType.DONE:
          batchSetTabsValue(
            E.design.AppointmentStatus.INVOICED,
            E.design.AppointmentStatus.CHARGED_BACK,
          );
          break;
        case ETabType.WITHDRAWN:
          batchSetTabsValue(0 as any);
          break;
        case ETabType.CC_ME:
          batchSetTabsValue(
            E.design.AppointmentStatus.INVOICED,
            E.design.AppointmentStatus.COMMENT,
            E.design.AppointmentStatus.PENDING_UPLOAD,
            E.design.AppointmentStatus.CHARGED_BACK,
          );
          break;
      }
      return subTabsMap.filter(it => it.disabled === false);
    });
    const dialogMakeAppointment = useDialog({
      component: makeAppointment,
      title: '形象设计预约',

      width: '760px',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });

    const dialogDateSetting = useDialog({
      component: dateSetting,
      title: '预约日期设置',
      okText: '确定',
      width: '380px',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });

    // 这里复用一下
    const ChargeBackPromise: ReturnType<typeof utils.createPromise>[] = [];

    const dialogChargeBack = useDialog({
      component: chargeBack,
      width: '360px',
      on: {
        submit(obj: any) {
          const pm = ChargeBackPromise.shift();
          pm?.resolve(obj);
        },
      },
    });

    const reQuery = () => {
      reqList.pagination.reQuery(formData.value);
    };
    const config = {
      reset() {
        formData.value.project_name = '';
        formData.value.project_id = null;
        formData.value.business_type = null;
        formData.value.appointment_date_list = null;
        formData.value.start_date = '';
        formData.value.end_date = '';
      },
      searchBefor() {
        if (formData.value.appointment_date_list) {
          formData.value.start_date = formData.value.appointment_date_list[0]
            ? moment(formData.value.appointment_date_list[0]).format('YYYY-MM-DD')
            : '';
          formData.value.end_date = formData.value.appointment_date_list[1]
            ? moment(formData.value.appointment_date_list[1]).format('YYYY-MM-DD')
            : '';
        }
        return {
          ...formData.value,
          appointment_date_list: null,
        };
      },
    };
    reQuery();
    const routes = [
      {
        title: '工作台',
        name: 'Workbench',
      },
      {
        title: '形象设计预约',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const projectOptions = ref<TG.OptionType[]>([]);
    const projectSearch = (val: string) => {
      Query_Project_Name(
        { page_num: 1, num: 20 },
        { search_type: 2, project_name: val, business_type: formData.value.business_type as any },
      ).then(res => {
        projectOptions.value = res.data.data.data.map(item => {
          return {
            label: item.project_name,
            value: item.project_id,
          };
        });
      });
    };
    ImageMethod.on(
      ['撤销', '退单', '接单', '完成', '未完成', '上传', '重新提交', '调整妆造师'],
      reqList.reload,
    );

    return {
      permission,
      config,
      reQuery,
      tabs,
      columns,
      formData,
      reqList,
      subTabs,
      onChangeTabs,
      dialogMakeAppointment,
      dialogChargeBack,
      dialogDateSetting,
      hasMarkeup,
      userinfo,
      routes,
      projectOptions,
      projectSearch,
    };
  },
  render() {
    const { formData, columns, tabs, subTabs, config } = this;
    return (
      <ListGenerallyTemplate
        columns={columns}
        v-model={formData}
        config={config}
        service={this.reqList}
      >
        {!this.hasMarkeup ? (
          <div slot="searchBefor" class="initiate-box" key="makeAnAppointment">
            <tg-button
              icon="ico-btn-add"
              type="primary"
              onClick={() => this.dialogMakeAppointment.show()}
            >
              发起预约
            </tg-button>
          </div>
        ) : (
          this.permission.appointment_date_setting && (
            <div slot="searchBefor" class="initiate-box" key="appointmentDateSetting">
              <tg-button onClick={() => this.dialogDateSetting.show()}>预约日期设置</tg-button>
            </div>
          )
        )}
        <el-form-item label="业务类型：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            placeholder="请选择业务类型"
            v-model={formData.business_type}
            options={E.project.BusinessTypeOption}
            onChange={() => {
              formData.project_id = null;
            }}
          />
        </el-form-item>
        <el-form-item label="项目名称：">
          <Select
            popper-class="el-select-popper-mini"
            disabled={!formData.business_type}
            placeholder="请输入项目名称"
            v-model={formData.project_id}
            filterable
            remote
            options={this.projectOptions}
            remote-method={this.projectSearch}
          />
        </el-form-item>
        <el-form-item label="预约日期：">
          {/*<el-date-picker
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择预约日期"
            v-model={formData.appointment_date}
          />*/}
          <el-date-picker
            v-model={formData.appointment_date_list}
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width:214px"
          />
        </el-form-item>
        <div slot="middle" class="tabs" key="tabs">
          <tg-tabs tabs={tabs} value={formData.tab_type} onInput={this.onChangeTabs} />
          {subTabs.length > 0 && (
            <div class="radio-box">
              <el-radio-group v-model={formData.reservation_status} onChange={this.reQuery}>
                <el-radio label={null}>全部</el-radio>
                {subTabs.map(item => {
                  return <el-radio label={item.value}>{item.label}</el-radio>;
                })}
              </el-radio-group>
            </div>
          )}
        </div>
      </ListGenerallyTemplate>
    );
  },
});
