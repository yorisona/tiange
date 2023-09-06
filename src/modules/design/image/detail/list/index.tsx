import { defineComponent, ref, reactive, computed } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { Select } from '@gm/component/select';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { useDialog } from '@/use/dialog';
import { Query_Image_Design, Query_Image_Designer, Query_Project_Name } from '@/services/design';
import viewImagePhoto from '@/modules/design/dialog/viewImagePhoto/index.vue';
import moment from 'moment';
import { usePermission } from '@/use/permission';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<M.design.ReservationQuery>[] = [
      {
        align: 'center',
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
        label: '项目名称',
        prop: 'project_name',
        'show-overflow-tooltip': true,
        minWidth: 100,
        formatter(row) {
          return (
            <tg-button
              type="link"
              onClick={() => {
                dialogViewImagePhoto.show(row);
              }}
            >
              {row.project_name ?? '--'}
            </tg-button>
          );
        },
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
        dataType: {
          type: 'enum',
          enum: E.supplier.AnchorTypeMap,
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
        formatter(row) {
          return row.appointment_date.replace(/-/g, '.');
        },
      },
      {
        align: 'center',
        label: '预约时间',
        minWidth: 100,
        prop: 'appointment_time',
      },
      {
        align: 'center',
        label: '开播时间',
        minWidth: 100,
        prop: 'start_broadcast_time',
      },
      {
        align: 'center',
        label: '服务类型',
        minWidth: 80,
        prop: 'service_type',
        dataType: {
          type: 'enum',
          enum: E.design.ServiceTypeMap,
        },
      },
      {
        align: 'center',
        label: '预约状态',
        prop: 'reservation_status',
        dataType: {
          type: 'enum',
          enum: E.design.AppointmentStatusMap,
        },
      },
      {
        align: 'center',
        label: '妆造师',
        prop: 'image_design_username',
      },
      {
        align: 'center',
        label: '好评度',
        prop: 'satisfaction',
        dataType: {
          type: 'enum',
          enum: E.design.SatisfactionMap,
        },
      },
    ];
    const formData = ref({
      project_name: '',
      appointment_date: '',
      appointment_date_list: undefined,
      start_date: undefined,
      end_date: undefined,
      business_type: undefined,
      appointment_subject: undefined,
      reservation_status: undefined,
      anchor_type: undefined,
      service_type: undefined,
      image_design_id: undefined,
      satisfaction: undefined,
      project_id: undefined,
      search_type: 1,
    } as any);
    const reqList = usePagination(Query_Image_Design, { manual: true });
    const dialogViewImagePhoto = useDialog({
      component: viewImagePhoto,
      title: '',
      width: '1142px',
      footer: false,
    });
    const permission = usePermission();
    const reQuery = () => {
      reqList.pagination.reQuery(formData.value);
    };
    const disabledExport = computed(() => {
      const value = formData.value;
      if ((reqList.data as any)?.length === 0) return true;
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        const tmp = value[keys[i]];
        if (tmp) return false;
      }

      return true;
    });
    const config = reactive({
      showExport: permission.image_design_export,
      disabledExport: disabledExport,
      exportURL: '/api/image_design/export_image_design',
      reset() {
        formData.value.project_name = '';
        formData.value.business_type = undefined;
        formData.value.appointment_date_list = undefined;
        formData.value.reservation_status = undefined;
        formData.value.appointment_subject = undefined;
        formData.value.anchor_type = undefined;
        formData.value.service_type = undefined;
        formData.value.image_design_id = undefined;
        formData.value.satisfaction = undefined;
        formData.value.project_id = undefined;
        formData.value.start_date = undefined;
        formData.value.end_date = undefined;
      },
      searchBefor() {
        if (formData.value.appointment_date_list) {
          formData.value.start_date = formData.value.appointment_date_list[0]
            ? moment(formData.value.appointment_date_list[0]).format('YYYY-MM-DD')
            : undefined;
          formData.value.end_date = formData.value.appointment_date_list[1]
            ? moment(formData.value.appointment_date_list[1]).format('YYYY-MM-DD')
            : undefined;
        }
        return {
          ...formData.value,
          appointment_date_list: null,
          appointment_date:
            formData.value.appointment_date &&
            moment(formData.value.appointment_date).format('YYYY-MM-DD'),
        };
      },
    });
    reQuery();

    const reqImageDesigner = usePagination(Query_Image_Designer, {
      manual: true,
      transform: data => {
        return data.data.map(item => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      },
    });
    reqImageDesigner.runAsync({} as any, {});
    const queryImage = (username: string) => {
      reqImageDesigner.runAsync({} as any, { username });
    };
    const projectOptions = ref<TG.OptionType[]>([]);
    const projectSearch = (val: string) => {
      Query_Project_Name(
        { page_num: 1, num: 20 },
        { search_type: 2, project_name: val, business_type: formData.value.business_type },
      ).then(res => {
        projectOptions.value = res.data.data.data.map(item => {
          return {
            label: item.project_name,
            value: item.project_id,
          };
        });
      });
    };

    return {
      config,
      reQuery,
      columns,
      formData,
      reqList,
      dialogViewImagePhoto,
      reqImageDesigner,
      queryImage,
      projectOptions,
      projectSearch,
    };
  },
  render() {
    const { formData, columns, config } = this;
    return (
      <ListGenerallyTemplate
        columns={columns}
        v-model={formData}
        config={config}
        service={this.reqList}
        class="container"
      >
        <div class="line" slot="searchBefor">
          <div />
        </div>
        <el-form-item label="业务类型：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            placeholder="请选择业务类型"
            v-model={formData.business_type}
            options={E.project.BusinessTypeOption}
            onChange={() => {
              formData.project_id = undefined;
            }}
          />
        </el-form-item>
        <el-form-item label="项目名称：">
          <Select
            popper-class="el-select-popper-mini"
            disabled={!formData.business_type}
            options={this.projectOptions}
            v-model={formData.project_id}
            filterable
            remote
            remote-method={this.projectSearch}
          />
        </el-form-item>
        <el-form-item label="预约主体：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            v-model={formData.appointment_subject}
            options={E.design.AppointmentSubjectOption}
          />
        </el-form-item>
        <el-form-item label="主播类型：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            v-model={formData.anchor_type}
            options={E.supplier.AnchorTypeOption}
          />
        </el-form-item>
        <el-form-item label="预约日期：">
          {/*<el-date-picker placeholder="请选择日期" v-model={formData.appointment_date} />*/}
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
        <el-form-item label="预约状态：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            v-model={formData.reservation_status}
            options={E.design.AppointmentStatusOption}
          />
        </el-form-item>
        <el-form-item label="服务类型：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            v-model={formData.service_type}
            options={E.design.ServiceTypeOption}
          />
        </el-form-item>
        <el-form-item label="妆造师：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={formData.image_design_id}
            options={this.reqImageDesigner.data as any}
            clearable
            filterable
            remote
            remote-method={this.queryImage}
          />
        </el-form-item>
        <el-form-item label="好评度：">
          <Select
            popper-class="el-select-popper-mini"
            showAll={true}
            v-model={formData.satisfaction}
            options={E.design.SatisfactionOption}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
