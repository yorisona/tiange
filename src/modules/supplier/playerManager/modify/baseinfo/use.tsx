import { ref, reactive } from '@vue/composition-api';
import supplierService from '@/services/supplier';

export interface ICate {
  label: string;
  value: number;
}

export interface IFormData {
  id?: number;
  anchor_type?: number;
  live_year?: number;
  has_kol_exp?: boolean;
  flower_name?: string;
  wechat?: string;
  real_name?: string;
  shoes_size?: number;
  gender?: number;
  height?: number;
  weight?: number;
  verify_status?: number;
  verify_message?: string;
  cates: number[];
  tags: number[];
  images: string[];
  cases: {
    id?: number;
    title: string;
    description: string;
    images: string[];
    videos: string[];
  }[];
}

export const useFormData = () => {
  // 表单数据
  const formData = ref<IFormData>({
    anchor_type: undefined,
    live_year: undefined,
    has_kol_exp: undefined,
    flower_name: undefined,
    wechat: undefined,
    real_name: undefined,
    shoes_size: undefined,
    gender: undefined,
    height: undefined,
    weight: undefined,
    cates: [],
    tags: [],
    images: [],
    cases: [],
  });
  // 擅长类目
  const catesList = ref<ICate[]>([]);
  const tagsList = ref<ICate[]>([]);
  supplierService.GetAnchorGoodAtCategories().then(res => {
    catesList.value = res.data.data
      ? res.data.data.map(item => ({ label: item.name, value: item.code }))
      : [];
  });
  supplierService.GetAnchorTags().then(res => {
    tagsList.value = res.data.data
      ? res.data.data.map(item => ({ label: item.name, value: item.id }))
      : [];
  });

  const saveAnchor = async () => {
    const postData: any = {
      ...formData.value,
    };
    return supplierService.PostAnchorBasic(postData);
  };

  const getEditInfo = (anchor_id: string) => {
    supplierService.GetAnchorDetail(anchor_id).then((res: any) => {
      if (res.cates.length > 3) res.cates.length = 3;
      if (res.tags.length > 5) res.tags.length = 5;
      const editValue = {
        ...res,
      };
      if (res.cates) editValue.cates = res.cates.map((item: any) => item.code);
      if (res.tags) editValue.tags = res.tags.map((item: any) => item.id);

      formData.value = editValue;
    });
  };
  return {
    formData,
    saveAnchor,
    getEditInfo,
    catesData: reactive({
      catesList,
    }),
    tagsData: reactive({
      tagsList,
    }),
  };
};
