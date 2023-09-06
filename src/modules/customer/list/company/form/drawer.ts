/**
 * 客户管理 - 公司管理 - 新增/编辑(抽屉)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-06 15:35:49
 */
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  ref,
  watch,
} from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';
import type { Company } from '@/types/tiange/company';
import type { CompanyCreateParams, CompanyForm } from '@/types/tiange/company';
import { cityId2name, cityName2id, fetchCities, getFlatCities } from '@/utils/~city~';
import type { City } from '@/types/tiange/city';
import { parse, sleep } from '@/utils/func';
import type { FormRule } from '@/types/vendor/form';
import { CreateCompany, EditCompany, GetCompanyId } from '@/services/company';
import { getRect } from '@/components/Uploader/fileFunctions';
import { ElForm } from 'element-ui/types/form';
import { ElCalendar } from 'element-ui/types/calendar';
import { REG_TAX_ID } from '@/const/regexp';
import { ElInput } from 'element-ui/types/input';

// 品牌名称
const RegName =
  /^(?:[A-Za-z\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/u;
// 品牌名称 用来除去范围外字符
const RegNameInput =
  /(?![A-Za-z\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]).+/gu;
// 邮件
const RegEmail = /^([\w\-.])+@([\w_\-.])+\.([A-Za-z]{2,4})$/u;

/** 手机/座机 */
const RegPhone = /^(?:\d{11,18}|\d{3}-\d{5,14}|\d{4}-\d{5,13}|1\d{10})$/;

const EMAIL_LEN_MAX = 32;

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<Company>,
    },
  },
  setup(props, ctx) {
    /** 是否可见 */
    const companyDrawerVisible = ref(false);
    const autoFocuseRef = ref<ElInput | undefined>(undefined);

    /** 切换是否可见 */
    const toggleVisible = (visible = false) => {
      companyDrawerVisible.value = visible;
    };

    /**
     * 新增公司
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-10-31 11:37:12
     */
    const onCreateBtnClick = () => {
      toggleVisible(true);
    };

    // 关闭
    const onDrawerClose = () => {
      toggleVisible();
    };

    // 新增公司保存成功
    const onCompanyFormSubmitSuccess = async () => {
      toggleVisible();
    };

    const companyForm = ref<CompanyForm>({
      id: undefined,
      company_name: '',
      logo: '',
      cities: [],
      address: '',
      contact: '',
      contact_phone: '',
      wechat: '',
      email: '',
      introduce: '',
      introduce_file: '',
      cw_contact: '',
      cw_contact_phone: '',
      cw_wechat: '',
      cw_email: '',
      bank_name: '',
      tax_id: '',
      bank_account: '',
      cw_info_contact_phone: '',
      cw_invoice_phone: '',
      cw_invoice_email: '',
      cw_register_address: '',
      is_taxpayer: 0,
    });

    const onLogoRemove = () => {
      companyForm.value.logo = '';
    };

    // 是否编辑模式
    const isEditMode = computed(() => companyForm.value.id !== undefined);

    // 重置表单数据
    const resetCompanyForm = () => {
      companyForm.value.id = undefined;
      companyForm.value.company_name = '';
      companyForm.value.logo = '';
      companyForm.value.cities = [];
      companyForm.value.address = '';
      companyForm.value.contact = '';
      companyForm.value.contact_phone = '';
      companyForm.value.wechat = '';
      companyForm.value.email = '';
      companyForm.value.introduce = '';
      companyForm.value.introduce_file = '';
      // 财务联系人 @since v2.3.1
      companyForm.value.cw_contact = '';
      companyForm.value.cw_contact_phone = '';
      companyForm.value.cw_wechat = '';
      companyForm.value.cw_email = '';
      // 财务信息 @since v2.3.1
      companyForm.value.bank_name = '';
      companyForm.value.tax_id = '';
      companyForm.value.bank_account = '';
      companyForm.value.cw_info_contact_phone = '';
      companyForm.value.cw_invoice_phone = '';
      companyForm.value.cw_invoice_email = '';
      companyForm.value.cw_register_address = '';
    };

    // 模态框标题
    const companyFormModalTitle = computed(() => (isEditMode.value ? '编辑公司' : '新增公司'));

    const companyNameExists = async (name: string) => {
      const res = await GetCompanyId(name);

      if (res.data.success) {
        return (
          res.data.data.filter(el =>
            isEditMode.value
              ? el.company_name === name && el.id !== companyForm.value.id
              : el.company_name === name,
          ).length > 0
        );
      }

      return false;
    };

    // 初始化编辑表单
    const fillForm = (company?: Company) => {
      if (company === undefined) {
        resetCompanyForm();
        return;
      }

      const { id, province, city, county, ...rest } = company;

      companyForm.value.id = id;
      companyForm.value.cities = cityName2id([province, city, county], flatCity.value);
      companyForm.value.company_name = rest.company_name;
      companyForm.value.logo = rest.logo ?? '';
      companyForm.value.address = rest.address;
      companyForm.value.contact = rest.contact;
      companyForm.value.contact_phone = rest.contact_phone;
      companyForm.value.wechat = rest.wechat;
      companyForm.value.email = rest.email;
      companyForm.value.introduce = rest.introduce;
      companyForm.value.introduce_file = rest.introduce_file;

      // 财务联系人 @since v2.3.1
      companyForm.value.is_taxpayer = rest.is_taxpayer;
      companyForm.value.cw_contact = rest.cw_contact;
      companyForm.value.cw_contact_phone = rest.cw_contact_phone;
      companyForm.value.cw_wechat = rest.cw_wechat;
      companyForm.value.cw_email = rest.cw_email;

      // 财务信息 @since v2.3.1
      companyForm.value.bank_name = rest.bank_name;
      companyForm.value.tax_id = rest.tax_id;
      companyForm.value.bank_account = rest.bank_account;
      companyForm.value.cw_info_contact_phone = rest.cw_info_contact_phone;
      companyForm.value.cw_invoice_phone = rest.cw_invoice_phone;
      companyForm.value.cw_invoice_email = rest.cw_invoice_email;
      companyForm.value.cw_register_address = rest.cw_register_address;
    };

    const formRules = ref<{ [key in keyof CompanyForm]?: FormRule<CompanyForm[key]>[] }>({
      // 公司名称
      company_name: [
        {
          required: true,
          message: '请填写公司名称',
        },
        {
          validator: (rule, value: string, callback) => {
            if (value === '') {
              callback(new Error('请填写公司名称'));
            } else {
              callback();
            }
          },
        },
        {
          validator: async (rule, value, callback) => {
            if (value !== '') {
              const exits = await companyNameExists(value);
              if (exits) {
                callback(new Error('该公司名称已存在'));
              }
            }
            callback();
          },
          trigger: 'blur',
        },
      ],
      // 联系人
      contact: [
        {
          validator: (rule, value: string, callback) => {
            if (value === '') {
              callback();
            } else if (!RegName.test(value)) {
              callback(new Error('仅支持输入中英文字符'));
            } else {
              callback();
            }
          },
        },
      ],
      // 联系人电话
      contact_phone: [
        {
          validator: (rule, phone: string, callback) => {
            if (phone === '') {
              callback();
            } else if (!RegPhone.test(phone)) {
              callback(new Error('联系电话格式不正确'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      wechat: [],
      email: [
        {
          validator: (rule, email, callback) => {
            if (email === '') {
              callback();
            } else if (email.length > EMAIL_LEN_MAX) {
              callback(new Error(`最多输入${EMAIL_LEN_MAX}个字符`));
            } else if (!RegEmail.test(email)) {
              callback(new Error('请输入正确的邮箱地址'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      cw_contact: [
        {
          validator: (rule, value: string, callback) => {
            if (value === '') {
              callback();
            } else if (!RegName.test(value)) {
              callback(new Error('仅支持输入中英文字符'));
            } else {
              callback();
            }
          },
        },
      ],
      cw_contact_phone: [
        {
          validator: (rule, phone: string, callback) => {
            if (phone === '') {
              callback();
            } else if (!RegPhone.test(phone)) {
              callback(new Error('联系电话格式不正确'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      cw_wechat: [],
      cw_email: [
        {
          validator: (rule, email: string, callback) => {
            if (email === '') {
              callback();
            } else if (email.length > EMAIL_LEN_MAX) {
              callback(new Error(`最多输入${EMAIL_LEN_MAX}个字符`));
            } else if (!RegEmail.test(email)) {
              callback(new Error('请输入正确的邮箱地址'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      is_taxpayer: [
        {
          required: true,
          message: '请选择是否一般纳税人',
        },
      ],
      bank_name: [
        {
          required: true,
          message: '请输入开户行名称',
          trigger: 'blur',
        },
      ],
      bank_account: [
        {
          required: true,
          message: '请输入银行账号',
          trigger: 'blur',
        },
      ],
      tax_id: [
        {
          required: true,
          message: '请输入纳税人识别号',
          trigger: 'blur',
        },
        {
          validator(rule, value, callback) {
            if (value === '') {
              callback();
            } else if (!REG_TAX_ID.test(value)) {
              callback(new Error('请输入正确的纳税人识别号'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      cw_register_address: [
        {
          required: true,
          message: '请输入公司注册地址',
          trigger: 'blur',
        },
      ],
      cw_info_contact_phone: [
        {
          required: true,
          message: '请输入联系电话',
          trigger: 'blur',
        },
        {
          validator: (rule, phone, callback) => {
            if (!RegPhone.test(phone)) {
              callback(new Error('联系电话格式不正确'));
            } else {
              callback();
            }
          },
        },
      ],
      cw_invoice_phone: [
        {
          validator: (rule, phone, callback) => {
            /** 手机/座机 */
            const reg = /^1\d{10}$/;
            if (phone !== '' && !reg.test(phone)) {
              callback(new Error('手机号码格式不正确'));
            } else {
              callback();
            }
          },
        },
      ],
      cw_invoice_email: [
        {
          validator: (rule, email, callback) => {
            const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (email !== '' && !reg.test(email)) {
              callback(new Error('邮箱格式不正确'));
            } else {
              callback();
            }
          },
        },
      ],
    });

    /** 输入联系人 */
    const inputContact = (val: string, field: 'contact' | 'cw_contact') => {
      const value = val.replace(RegNameInput, '');
      companyForm.value[field] = value;
    };

    /** 输入联系人电话 */
    const inputContactPhone = (val: string, field: 'contact_phone' | 'cw_contact_phone') => {
      const value = val.replace(/[^\d-]+/gu, '');
      companyForm.value[field] = value;
    };

    /** 输入微信 */
    const inputWechat = (val: string, field: 'wechat' | 'cw_wechat') => {
      const value = val.replace(/[^\w-]+/gu, '');
      companyForm.value[field] = value;
    };

    /** 输入银行账号 */
    const onInputBankCount = (value: string) => {
      const val = value.replace(/\D/g, '');

      companyForm.value.bank_account = val;
    };

    const onInputTaxID = (value: string) => {
      const val = value.toUpperCase().trim();
      companyForm.value.tax_id = val;
    };

    const city = ref<City[]>([]);
    const flatCity = ref<City[]>([]);

    const formSetting = ref<{
      leftLabelWidth: string;
      rightLabelWidth: string;
    }>({
      leftLabelWidth: '93px',
      rightLabelWidth: '95px',
    });

    onBeforeMount(async () => {
      const res = await fetchCities();
      city.value = res;

      flatCity.value = getFlatCities(parse(res));
    });

    // 上传LOGO成功回调
    const onLogoUploadSuccess = (url: string) => {
      companyForm.value.logo = url;
    };

    /**
     * 上传前检查
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-11-09 13:21:08
     */
    const onBeforeLogoUpload = async (file: File) => {
      const { width, height } = await getRect(file);

      if (width !== height) {
        ctx.root.$message.warning(`图片应为正方形, 当前${width} * ${height}`);
        return false;
      }

      return true;
    };
    // 上传介绍文件成功回调
    const onIntroduceFileUploadSuccess = (url: string) => {
      companyForm.value.introduce_file = url;
    };

    // 删除文件
    const onIntroduceFileRemove = () => {
      companyForm.value.introduce_file = '';
    };

    /** 表单引用 */
    const formRef = ref<null | ElForm>(null);
    /** 日期选择器引用 */
    const cascaderRef = ref<null | (ElCalendar & { inputValue: string })>(null);

    // 用于给上传组件加key
    const timestamp = ref<number>(0);

    watch(
      () => companyDrawerVisible.value,
      (val, prevVal) => {
        if (val && val !== prevVal) {
          timestamp.value = Date.now();
        }
      },
    );

    const filename = computed(() => companyForm.value.introduce_file?.split('/').pop());

    const clearValidate = () => {
      setTimeout(() => {
        formRef.value?.clearValidate?.();
      }, 100);
    };

    // 取消
    const onCancel = () => {
      if (!isEditMode.value) {
        resetCompanyForm();
      } else {
        fillForm();
      }

      clearValidate();

      toggleVisible(false);
    };

    const saveCompany = async () => {
      const { id, cities, ...rest } = companyForm.value;

      const [province, city, county] = cityId2name(cities, flatCity.value);

      const payload: CompanyCreateParams = {
        province,
        city,
        county,
        ...rest,
      };

      return id === undefined
        ? await CreateCompany(payload)
        : await EditCompany({ ...payload, id });
    };

    const loading = ref(false);
    // 提交保存并处理后续
    const onSubmit = async () => {
      const result = await new Promise(resolve => {
        formRef.value?.validate(valid => resolve(valid));
      });

      if (!result) {
        return;
      }

      loading.value = true;
      const [{ data: response }] = await Promise.all([await saveCompany(), await sleep(500)]);
      loading.value = false;

      if (response.success) {
        ctx.root.$message.success(`${isEditMode.value ? '编辑' : '新增'}公司成功`);
        resetCompanyForm();

        toggleVisible();

        clearValidate();
        ctx.emit('form:submit:success');
      } else {
        const msg = response.message ?? `${isEditMode.value ? '编辑' : '新增'}公司失败`;
        ctx.root.$message.error(msg);
        ctx.emit('form:submit:fail');
      }
    };

    const onClose = () => {
      if (!isEditMode.value) {
        resetCompanyForm();
      } else {
        fillForm();
      }

      clearValidate();
      toggleVisible();
      ctx.emit('form:close');
    };

    const logo = computed(() => companyForm.value?.logo ?? '');

    watch(
      () => companyDrawerVisible.value,
      next => {
        if (next) {
          const formData = props.data;
          if (formData !== undefined) {
            const { province, city, county } = formData;
            const inputValue = `${province} / ${city} / ${county}`;
            setTimeout(() => {
              if (cascaderRef.value === null) {
                return;
              }
              cascaderRef.value.inputValue = inputValue === ' /  / ' ? '' : inputValue;
            }, 17);
          }
        }
      },
    );

    const open = (company?: Company) => {
      toggleVisible(true);
      if (company !== undefined) {
        fillForm(company);
      } else {
        nextTick(() => {
          autoFocuseRef.value?.focus();
        });
      }
    };

    const introduceFileName = computed(() => companyForm.value.introduce_file.split('/').pop());
    const isIntroduceFilePdf = computed(() =>
      /\.pdf/giu.test(companyForm.value.introduce_file ?? ''),
    );

    const removeIntroduceFile = () => {
      companyForm.value.introduce_file = '';
    };

    return {
      autoFocuseRef,
      loading,
      companyDrawerVisible,
      filename,
      onCancel,
      onClose,
      logo,
      timestamp,
      formRef,
      cascaderRef,
      companyForm,
      onLogoRemove,
      isEditMode,
      resetCompanyForm,
      companyFormModalTitle,
      city,
      flatCity,
      formSetting,
      formRules,
      inputContact,
      inputContactPhone,
      inputWechat,
      onLogoUploadSuccess,
      onBeforeLogoUpload,
      onIntroduceFileUploadSuccess,
      onIntroduceFileRemove,
      onSubmit,
      fillForm,
      onCreateBtnClick,
      onDrawerClose,
      onCompanyFormSubmitSuccess,
      open,
      onInputBankCount,
      onInputTaxID,
      isIntroduceFilePdf,
      introduceFileName,
      removeIntroduceFile,
    };
  },
});
