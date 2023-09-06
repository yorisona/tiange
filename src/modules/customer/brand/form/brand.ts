import { Brand, BrandForm } from '@/types/tiange/brand';
import { computed, defineComponent, nextTick, PropType, ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';

import lodash from '@/utils/lodash/custom';
import { SaveBrand } from '@/services/brand';
import { ElInput } from 'element-ui/types/input';
import { GetCompanyId } from '@/services/company';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';

const { debounce } = lodash;

export default defineComponent({
  name: 'AddBrand',
  props: {
    brand: {
      type: Object as PropType<Brand>,
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const autoFocuseRef = ref<ElInput | undefined>(undefined);

    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
      ctx.root.$nextTick(resetForm);
    };

    const formTitle = ref<string>('新增品牌');

    const brandForm = ref<BrandForm>({
      id: -1,
      brand_name: '',
      customer_ids: [undefined],
    });

    watch(
      () => props.visible,
      newVal => {
        formRef.value?.clearValidate();

        if (newVal) {
          formTitle.value = props.brand === undefined ? '新增品牌' : '编辑品牌';

          if (props.brand !== undefined) {
            brandForm.value.brand_name = props.brand.brand_name;
            brandForm.value.id = props.brand.id;
            brandForm.value.customer_ids =
              (props.brand.customer_info?.length || 0) > 0
                ? props.brand.customer_info?.map(el => el.company_id)
                : [undefined];
          } else {
            nextTick(() => {
              autoFocuseRef.value?.focus();
            });
          }
        }
      },
    );

    /** 重置表单 */
    const resetForm = () => {
      brandForm.value.brand_name = '';
      brandForm.value.id = -1;
      brandForm.value.customer_ids = [undefined];
    };

    const brandFormRules = ref({
      brand_name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
    });

    /** 点击保存 */
    const submit = async () => {
      if (brandForm?.value === undefined) {
        return;
      }

      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }
      if ((brandForm.value.customer_ids?.filter(el => el !== undefined)?.length || 0) <= 0) {
        Message.warning('至少关联一个公司');
        return;
      }

      const payload: BrandForm = {
        brand_name: brandForm.value.brand_name,
        customer_ids: brandForm.value.customer_ids?.filter(el => el !== undefined) || [],
      };
      if (brandForm?.value.id !== -1) {
        payload.id = brandForm.value.id;
      }

      const { data: response } = await SaveBrand(payload);
      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);
        resetForm();
      } else {
        ctx.root.$message.error(response.message ?? '品牌保存失败');
      }
    };

    const onSaveBtnClick = debounce(submit, 200);

    const defaultCompanyList = computed(() => {
      return (
        props.brand?.customer_info
          ?.filter(el => brandForm.value.customer_ids?.indexOf(el.company_id) !== -1)
          ?.map(el => ({
            id: el.company_id,
            company_name: el.company_name,
          })) || []
      );
    });
    const displayComplayList = computed(() => {
      const defaultList = defaultCompanyList.value.filter(el => {
        return !(companyListServe.data || []).find(subEl => subEl.id === el.id);
      });
      return [...defaultList, ...(companyListServe.data || [])];
    });
    const companyListServe = useRequest(GetCompanyId, { manual: true });
    const queryCompanyList = (keyword: string) => {
      if (keyword) {
        companyListServe.runAsync(keyword);
      }
    };

    const onAddCompanyHandler = () => {
      brandForm.value.customer_ids?.push(undefined);
    };

    const onDelCompanyHandler = (index: number) => {
      brandForm.value.customer_ids?.splice(index, 1);
    };

    const optionDisabled = (selected_id: number, company_id: number) => {
      if (selected_id === company_id) {
        return false;
      }
      return brandForm.value.customer_ids?.find(el => el === company_id && el !== selected_id)
        ? true
        : false;
    };

    return {
      autoFocuseRef,
      formTitle,
      formRef,
      onCancelBtnClick,
      onSaveBtnClick,
      brandForm,
      brandFormRules,
      companyListServe,
      queryCompanyList,
      onAddCompanyHandler,
      onDelCompanyHandler,
      displayComplayList,
      optionDisabled,
    };
  },
});

// max-height: 700
