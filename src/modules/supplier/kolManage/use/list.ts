/*
 * @Author: 肖槿
 * @Date: 2021-07-20 16:17:44
 * @Description: 达人管理逻辑
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-02 10:31:05
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\use\list.ts
 */
import { SetupContext } from '@vue/composition-api';
import { ref } from '@vue/composition-api';
import { GetKOLList, GetCategories } from '@/services/kol';
import { category } from '@/types/tiange/kol';
import { sleep } from '@/utils/func';
import { fetchCities, getFlatCities } from '@/utils/~city~';
import { parse } from '@/utils/func';
import { uploadFile } from '@/api/upload';
//  cityId2name, cityName2id,
export const useList = (ctx: SetupContext) => {
  const tableLoading = ref(false);
  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    pageSizes: [10, 20, 30],
    total: 100,
  });
  const fileMaxSize = 5 * 1024 * 1024;
  const city = ref([]);
  const flatCity = ref([]);
  /*  const newdate = new Date();
  const timestr = newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate();*/
  const filterParams = ref({
    kol_name: '', // kol名称
    business_type: '', // 业务类型
    area: 0, // 擅长领域
    platform: '', // 擅长平台
    kol_tag: '', // kol标签
    page: 1,
    num: 20,
    verify_status: '',
    add_by: '',
    gmt_modified_gte: '',
  });
  const customerList = ref<any[]>([]);
  const categoryList = ref<category[]>([]);
  const getKolList = async (payload: any) => {
    tableLoading.value = true;
    const params: any = {};
    Object.keys(payload).forEach((item: any) => {
      if (payload[item]) {
        params[item] = payload[item];
      }
    });
    const [_, { data: response }] = await Promise.all([await sleep(500), await GetKOLList(params)]);
    tableLoading.value = false;
    if (response.success) {
      customerList.value = response.data.data;
      pagination.value.total = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const getCategorData = async () => {
    const [_, { data: response }] = await Promise.all([await sleep(500), await GetCategories()]);
    if (response.success) {
      categoryList.value = response.data;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const fetchCityData = async () => {
    const res: any = await fetchCities();
    city.value = res;
    flatCity.value = getFlatCities(parse(res)) as any;
  };
  const importAjax = (param: any) => {
    const file = param.file;
    if (file.size > fileMaxSize) {
      ctx.root.$message.error('导入文件大于5M');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('operate', 'kol');
    uploadFile(form).then(response => {
      const result = response.data;
      if (result.success) {
        ctx.root.$message.success(result.message);
        getKolList(filterParams.value);
      } else {
        ctx.root.$message.error(result.message);
      }
    });
  };
  return {
    tableLoading,
    customerList,
    getKolList,
    pagination,
    filterParams,
    city,
    flatCity,
    fetchCityData,
    categoryList,
    getCategorData,
    importAjax,
  };
};
