import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import {
  Query_Image_Designer,
  Query_Images_By_Project_Name,
  Query_Project_Name,
} from '@/services/design';
import moment, { Moment } from 'moment';
import CalendarCustom, { ECalendarType } from '@/components/CalendarCustom';
import { useCalendarConfig } from '@/components/CalendarCustom/use';
import { Select } from '@gm/component/select';
import dialogImageView from '@/modules/supplier/playerManager/common/dialogImageView/index.vue';
import ImageViewer from '@/components/Image/ImageViewer';

type FormData = TG.ParameterFirst<typeof Query_Images_By_Project_Name>;
export default defineComponent({
  components: { dialogImageView },
  setup: (props, ctx) => {
    let _showData: FormData | undefined;
    const show = (_: FormData & any) => {
      _showData = { ..._ };
      setData();
    };
    const setData = () => {
      const _: any = _showData;
      formData.value.project_id = _.project_id;
      formData.value.business_type = _.business_type;
      formData.value.selectedDate = moment().format('YYYY-MM-DD');
      formData.value.image_design_id = null as any;
      projectOptions.value = [{ label: _.project_name, value: _.project_id }];
      query();
    };
    const reqSaveAssement = useRequest(Query_Images_By_Project_Name, {
      manual: true,
    });
    const formData = ref<FormData>({
      selectedDate: null,
      business_type: null,
      project_id: null,
      image_design_id: null,
    } as any);
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
    const query = () => {
      const params = { ...formData.value };
      const selectedDate = moment(formData.value.selectedDate);
      if (selectedDate.isValid()) {
        params.start_time = selectedDate
          .clone()
          .startOf('month')
          .startOf('week')
          .format('YYYY-MM-DD');
        params.end_time = selectedDate.clone().endOf('month').endOf('week').format('YYYY-MM-DD');
      }
      reqSaveAssement.runAsync(params).then(() => {
        config.changeDate(formData.value.selectedDate);
      });
    };
    const reqImageDesigner = usePagination(Query_Image_Designer, {
      transform: data => {
        return data.data.map(item => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      },
    });
    const reset = () => {
      setData();
    };

    const config = useCalendarConfig(ECalendarType.Month);
    const dialogImageViewRef = ref<{ show: TG.anyFunc }>();
    const renderTd = (day: Moment) => {
      const dayStr = day.format('YYYY-MM-DD');
      const findDay = reqSaveAssement.data ? reqSaveAssement.data[dayStr] : null;
      if (!findDay || findDay.length === 0) return '';
      const imgUrl = findDay[0];
      return (
        <tg-image
          class="des"
          fit="cover"
          src={imgUrl}
          onclick={() => {
            ImageViewer.show(findDay);
          }}
        />
      );
    };

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (!success) {
          return;
        }
        const params = { ...formData.value };

        reqSaveAssement.runAsync(params as any).then(() => {
          Message.success('发起成功');
          ctx.emit('submit');
          ctx.emit('close');
        });
      });
    };
    const formRef = ref<IFormRef>();
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      config,
      renderTd,
      projectOptions,
      query,
      reset,
      reqImageDesigner,
      dialogImageViewRef,
      projectSearch,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="dialog-container">
        <div class="form-search">
          <el-form attrs={{ model: formData }} inline={true} size="mini">
            <el-form-item label="业务类型：" style="width:180px">
              <Select
                clearable={false}
                v-model={formData.business_type}
                options={E.project.BusinessTypeOption}
              />
            </el-form-item>
            <el-form-item label="项目名称：">
              <Select
                options={this.projectOptions}
                v-model={formData.project_id}
                filterable
                remote
                remote-method={this.projectSearch}
              />
            </el-form-item>
            <el-form-item label="预约时间：" style="width:190px">
              <el-date-picker type="month" v-model={formData.selectedDate} />
            </el-form-item>
            <el-form-item label="妆造师：" style="width:180px">
              <Select
                v-model={formData.image_design_id}
                options={this.reqImageDesigner.data as any}
              />
            </el-form-item>
            <el-form-item>
              <tg-button type="primary" class="mgr-12" onClick={this.query}>
                查询
              </tg-button>
              <tg-button onClick={this.reset}>重置</tg-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-body">
          <CalendarCustom
            config={this.config}
            scopedSlots={{
              render: this.renderTd,
            }}
          />
        </div>
        <dialog-image-view ref="dialogImageViewRef" />
      </div>
    );
  },
});
