import { defineComponent, ref } from '@vue/composition-api';
import moment from 'moment';
import { ObjectFilterEmpty } from '@/utils/func';
import qs from 'query-string';
import { getToken } from '@/utils/token';

export default defineComponent({
  setup(props, ctx) {
    const select_year = ref(moment().format('YYYY'));
    const select_department_ids = ref<number[]>([]);
    const select_project_ids = ref<number[]>([]);
    const show = (
      year: string,
      department_ids: number[] | undefined,
      project_ids: number[] | undefined,
    ) => {
      select_year.value = year;
      select_department_ids.value = department_ids || [];
      select_project_ids.value = project_ids || [];
    };
    const queryForm = ref({
      month: undefined as undefined | number,
      type: undefined as undefined | number,
    });
    const onClose = () => {
      ctx.emit('close');
    };
    const onSuccessClick = () => {
      ctx.emit('close');
      ctx.emit('submit');
    };
    const exportLoading = ref(false);
    const exportBtnClick = async () => {
      if (queryForm.value.month === undefined || queryForm.value.type === undefined) {
        ctx.root.$message.warning('请选择月份或类型！！！');
        return;
      }
      const month =
        select_year.value + '-' + (queryForm.value.month !== 0 ? queryForm.value.month : '01');
      const params = {
        start_date: moment(month)
          .startOf(queryForm.value.month !== 0 ? 'month' : 'year')
          .format('YYYY-MM-DD'),
        end_date: moment(month)
          .endOf(queryForm.value.month !== 0 ? 'month' : 'year')
          .format('YYYY-MM-DD'),
        project_ids: select_project_ids.value.join(','),
        department_ids: select_department_ids.value.join(','),
        the_type: queryForm.value.type === 0 ? '1,2,3,4,5,6,8' : queryForm.value.type + '',
      };
      const props = ObjectFilterEmpty(params);
      const _paramsstr = qs.stringify(props);
      const token = getToken();
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/data_center/operating/profit_loss_detail/export_special_type?${_paramsstr}&Authorization=${token}`,
      );
    };
    const currentMonthOptions = [
      { label: '全部月份', value: 0 },
      { label: '1月', value: 1 },
      { label: '2月', value: 2 },
      { label: '3月', value: 3 },
      { label: '4月', value: 4 },
      { label: '5月', value: 5 },
      { label: '6月', value: 6 },
      { label: '7月', value: 7 },
      { label: '8月', value: 8 },
      { label: '9月', value: 9 },
      { label: '10月', value: 10 },
      { label: '11月', value: 11 },
      { label: '12月', value: 12 },
    ];
    /*1: 办公费 2: 物料成本 3: 装修费 4: 差旅交通费 5: 招待费 6: 招聘咨询 7: 公摊成本 8: 其他成本-其它*/
    const currentTypeOptions = [
      { label: '全部其他成本', value: 0 },
      { label: '其他成本-办公费', value: 1 },
      { label: '其他成本-物料成本', value: 2 },
      { label: '其他成本-装修费', value: 3 },
      { label: '其他成本-差旅交通费', value: 4 },
      { label: '其他成本-招待费', value: 5 },
      { label: '其他成本-招聘咨询', value: 6 },
      // { label: '公摊成本', value: 7 },
      { label: '其他成本-其他', value: 8 },
    ];
    return {
      currentTypeOptions,
      queryForm,
      currentMonthOptions,
      exportBtnClick,
      onSuccessClick,
      onClose,
      show,
      select_year,
      exportLoading,
    };
  },
  render() {
    return (
      <div>
        <div>
          <div class="dialog-container">
            <el-form size="mini" label-width="60px">
              <el-form-item
                label="月份："
                rules={{ required: true, message: '请选择月份', trigger: 'change' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model={this.queryForm.month}
                  class="budget-select"
                  placeholder="请选择月份"
                  style="width: 100%"
                >
                  {this.currentMonthOptions.map((el, index) => {
                    return (
                      <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                    );
                  })}
                </el-select>
              </el-form-item>
              <el-form-item
                label="类型："
                rules={{ required: true, message: '请选择类型', trigger: 'change' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model={this.queryForm.type}
                  class="budget-select"
                  placeholder="请选择类型"
                  style="width: 100%"
                >
                  {this.currentTypeOptions.map((el, index) => {
                    return (
                      <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                    );
                  })}
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="btns-line">
            <tg-button onClick={this.onClose}>取消</tg-button>
            <tg-button v-loading={this.exportLoading} type="primary" onClick={this.exportBtnClick}>
              导出
            </tg-button>
          </div>
        </div>
      </div>
    );
  },
});
