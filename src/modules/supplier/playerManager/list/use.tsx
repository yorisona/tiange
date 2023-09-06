import { reactive, ref } from '@vue/composition-api';
import { Moment } from 'moment';
import supplierService from '@/services/supplier';
import { LiveProjectDailydata } from '@/types/tiange/live.project';

export const useAnchorData = () => {
  const list = ref<LiveProjectDailydata[]>([]);
  const total = ref<LiveProjectDailydata | undefined>();
  const page_num = ref<number>(0);
  const find = (day: Moment): LiveProjectDailydata | undefined => {
    return list.value.find(item => item.date + '' === day.format('YYYYMMDD'));
  };
  const queryForm = ref({
    good_at_category: '',
    flower_name: '',
    real_name: '',
    gender: '',
    verify_status: '',
    live_year_from: '',
    live_year_to: '',
    anchor_type: '',
    cooperation_status: '',
    num: 50,
    page_num: 1,
    live_years: [],
    add_by: '',
    anchor_tag: '',
  });
  const gmt_create = ref([]);

  const catesList = ref<any[]>([]);

  // 查询数据
  const query = (params: any) => {
    const transParams = {
      ...params,
    };
    if (params.live_years[0] !== undefined) {
      transParams.live_year_from = params.live_years[0];
    }
    if (params.live_years[1] !== undefined) {
      transParams.live_year_to = params.live_years[1];
    }
    delete transParams.live_years;
    supplierService.GetAnchorList(transParams).then((data: any) => {
      list.value = data.data;
      total.value = data.total;
      queryForm.value.page_num = params.page_num;
    });
  };
  const queryStart = () => {
    // console.log(queryForm.value);
    query({
      ...queryForm.value,
      page_num: 1,
      gmt_create_from: gmt_create.value[0],
      gmt_create_to: gmt_create.value[1],
    });
  };
  const reset = () => {
    queryForm.value = {
      ...queryForm.value,
      flower_name: '',
      real_name: '',
      gender: '',
      verify_status: '',
      good_at_category: '',
      live_year_from: '',
      live_year_to: '',
      anchor_type: '',
      cooperation_status: '',
      num: 50,
      page_num: 1,
      live_years: [],
      add_by: '',
      anchor_tag: '',
    };
    gmt_create.value = [];
    queryStart();
  };

  supplierService.GetAnchorGoodAtCategories().then(res => {
    catesList.value = [
      { label: '全部', value: '' },
      ...res.data.data.map(item => ({ label: item.name, value: item.code })),
    ];
  });

  return reactive({
    reset,
    queryStart,
    queryForm,
    catesList,
    query,
    list,
    gmt_create,
    total,
    page_num,
    find,
  });
};
