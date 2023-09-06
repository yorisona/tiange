/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-05-07 13:16:45
 */

import { defineComponent, nextTick, ref } from '@vue/composition-api';
import DrawerHeader from '@/components/DrawerHeader/drawer.header.vue';
import Upp from '@/components/Uploader/uploader';
import { cityList } from '@/utils/city';
import { categoryList, cooperationPlatformList } from '@/utils/format';
import { uploadFile, addCompany, updateCompany } from '@/api/medium';
// import { fixFileToken } from '@/utils/http';
import { CompanyParams } from '@/types/tiange/supplier';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import { watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { computed } from '@vue/composition-api';
import { PropType } from '@vue/composition-api';
import { ValidateCallback } from '@/types/vendor/form';
import { ElInput } from 'element-ui/types/input';

interface UploadedFile {
  icon: string;
  type: string;
  size?: number;
  name: string;
  path: string;
}

const initCompanyParams = () => {
  return {
    id: undefined,
    /** 地址 */
    address: '',
    /** 擅长领域，用“,”拼接。 */
    areas: '',
    /** 市 */
    city: '',
    /** 区 */
    county: '',
    /** 描述 */
    description: '',
    /** 描述文件的url */
    description_file: '',
    // /** 描述预览预览的url */
    // description_file_preview: '',
    /** 上传的logo的url，没有就传空 */
    logo: '',
    /** 公司名称 */
    name: '',
    /** 合作平台，用“,”拼接。 */
    platforms: '',
    /** 省 */
    province: '',
    /** 报价单的url */
    quotation: '',
    // quotation_size: 0.03
    /** 是否专票 */
    special_ticket: 1,
    /** 联系人邮箱 */
    contact_email: '',
    /** 联系电话 */
    contact_no: '',
    /** 联系人 */
    contact_person: '',
    /** 微信号 */
    wechat: '',

    /** 财务联系邮箱 */
    contact_email2: '',
    /** 财务联系电话 */
    contact_no2: '',
    /** 财务联系人 */
    contact_person2: '',
    /** 财务微信 */
    wechat2: '',
    /** 开户行 */
    bank_of_deposit: '',
    /** 银行账号 */
    bank_card_number: '',
    /** 支付宝账号 */
    alipay_account: '',
    /** 营业执照 */
    business_license: [],
    /** 开户许可证 */
    account_permit: [],
  };
};

export default defineComponent({
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    editCompany: {
      type: Object as PropType<CompanyParams>,
      default: undefined,
    },
  },
  components: {
    DrawerHeader,
    Upp,
  },

  setup(props, ctx) {
    const autoFocuseRef = ref<ElInput | undefined>(undefined);
    const resetCities = () => {
      return cityList.map(item => {
        // debugger
        return {
          label: item.item_name,
          value: item.item_code,
          children: item.citys
            ? item.citys.map((city: any) => {
                // debugger
                return {
                  label: city.item_name,
                  value: city.item_code,
                  children: city.countys
                    ? city.countys.map((county: any) => {
                        // debugger
                        return {
                          label: county.item_name,
                          value: county.item_code,
                        };
                      })
                    : [],
                };
              })
            : [],
        };
      });
    };

    const phoneRegResult = (value: string) => {
      const myreg1 = /^[1][0-9]{10}$/;
      const myreg2 = /^(0[0-9]{2,3}[-\s])?([1-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
      if (!myreg1.test(value) && !myreg2.test(value)) {
        return false;
      } else {
        return true;
      }
    };

    const emailRegResult = (value: string) => {
      const myreg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!myreg.test(value)) {
        return false;
      } else {
        return true;
      }
    };

    const phoneValid = (rule: any, value: string, callback: ValidateCallback) => {
      if (value === '') {
        callback();
        return;
      }
      if (phoneRegResult(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的电话号码'));
      }
    };

    const emailValid = (rule: any, value: string, callback: ValidateCallback) => {
      if (value === '') {
        callback();
        return;
      }
      if (emailRegResult(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的邮箱'));
      }
    };

    const contractNamelValid = (rule: any, value: string, callback: ValidateCallback) => {
      if (value === '') {
        callback();
        return;
      }
      const myreg = /^([\u4e00-\u9fa5]|[a-zA-Z])+$/;
      if (!myreg.test(value)) {
        callback(new Error('请输入正确的联系人姓名'));
      } else {
        callback();
      }
    };

    const wechatlValid = (rule: any, value: string, callback: ValidateCallback) => {
      if (value === '') {
        callback();
        return;
      }
      const myreg = /^([0-9]|[a-zA-Z]|[-]|[_])+$/;
      if (!myreg.test(value)) {
        callback(new Error('请输入正确的微信号'));
      } else {
        callback();
      }
    };

    const bankNumberValid = (rule: any, value: string, callback: ValidateCallback) => {
      if (value === '') {
        callback();
        return;
      }
      const myreg = /^[0-9]+$/;
      if (!myreg.test(value)) {
        callback(new Error('请输入正确的银行卡账号'));
      } else {
        callback();
      }
    };

    const alipayValid = (rule: any, value: string, callback: ValidateCallback) => {
      if (value === '') {
        callback();
        return;
      }
      const myreg = /^([0-9]|[a-zA-Z]|[@]|[.])+$/;
      if (!phoneRegResult(value) && !emailRegResult(value) && !myreg.test(value)) {
        callback(new Error('请输入正确的支付宝账号'));
      } else {
        callback();
      }

      //   const myreg = /^[0-9]+$/;
      //   if (!myreg.test(value)) {
      //     callback(new Error('请输入正确的银行卡账号'));
      //   } else {
      //     callback();
      //   }
    };

    const rules = ref({
      name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
      platforms: [{ required: true, message: '请选择擅长平台', trigger: 'change' }],
      contact_person: [{ validator: contractNamelValid, trigger: 'blur' }],
      contact_person2: [{ validator: contractNamelValid, trigger: 'blur' }],
      wechat: [{ validator: wechatlValid, trigger: 'blur' }],
      wechat2: [{ validator: wechatlValid, trigger: 'blur' }],
      contact_no: [{ validator: phoneValid, trigger: 'blur' }],
      contact_no2: [{ validator: phoneValid, trigger: 'blur' }],
      contact_email: [{ validator: emailValid, trigger: 'blur' }],
      contact_email2: [{ validator: emailValid, trigger: 'blur' }],
      bank_card_number: [{ validator: bankNumberValid, trigger: 'blur' }],
      alipay_account: [{ validator: alipayValid, trigger: 'blur' }],
      areas: [{ required: true, message: '请选择擅长领域', trigger: 'change' }],
      special_ticket: [{ required: true, message: '请选择是否专票', trigger: 'change' }],
      business_license: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
      account_permit: [{ required: true, message: '请上传开户许可证', trigger: 'change' }],
    });

    const fileTypeIconMap = new Map([
      ['image/jpeg', 'picture'],
      ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
      ['application/msword', 'word'],
      ['application/pdf', 'pdf'],
      ['xlsx', 'excel'],
      ['docx', 'word'],
      ['doc', 'word'],
      ['pdf', 'pdf'],
      ['jpeg', 'picture'],
    ]);
    const saveLoading = ref<boolean>(false);
    const form = ref<CompanyParams>(initCompanyParams());
    const formRef = ref<ElForm | null>(null);
    const cities = ref(resetCities());

    const selectedAddress = ref<string[]>([]);

    const cooperationPlatforms = ref(cooperationPlatformList);
    cooperationPlatforms.value[0].value = '全部';
    const checkCooperationPlatformList = ref<string[]>([]);

    const categories = ref(categoryList);
    categories.value[0] = '全部';
    const checkCategoryList = ref<string[]>([]);
    const descriptionAccepts = ref<string[]>(['image/jpeg', 'image/png', 'application/pdf']);

    const isIndeterminatePlatform = computed(() => {
      const result = checkCooperationPlatformList.value.find((item: any) => item === '全部') as
        | string
        | undefined;

      if (
        checkCooperationPlatformList.value.length &&
        !result &&
        checkCooperationPlatformList.value.length !== cooperationPlatforms.value.length - 1
      ) {
        return true;
      }
      return false;
    });
    const isIndeterminateCategory = computed(() => {
      const result = checkCategoryList.value.find((item: any) => item === '全部') as
        | string
        | undefined;
      if (
        checkCategoryList.value.length &&
        !result &&
        checkCooperationPlatformList.value.length !== cooperationPlatforms.value.length - 1
      ) {
        return true;
      }
      return false;
    });

    const uploadedQuotationFileList = ref<UploadedFile[]>([]);
    const uploadedDescriptionFileList = ref<UploadedFile[]>([]);
    const uploadedDLicenseFileList = ref<UploadedFile[]>([]);
    const uploadedPermitFileList = ref<UploadedFile[]>([]);

    const addressChanged = (value: string[]) => {
      if (value.length) {
        const province = cities.value.find(item => item.value === value[0]);
        form.value.province = province?.label;
        if (value.length > 1) {
          const city = province?.children.find((item: any) => item.value === value[1]);
          form.value.city = city?.label;
          if (value.length > 2) {
            const county = city?.children.find((item: any) => item.value === value[2]);
            form.value.county = county?.label;
          }
        }
      } else {
        form.value.province = '';
        form.value.city = '';
        form.value.county = '';
      }
    };

    const resetForm = () => {
      form.value = initCompanyParams();
      checkCooperationPlatformList.value = [];

      checkCategoryList.value = [];

      uploadedQuotationFileList.value = [];
      uploadedDescriptionFileList.value = [];
      uploadedDLicenseFileList.value = [];
      uploadedPermitFileList.value = [];
    };

    const getDefaultAddressCodeArr = (newCompany: CompanyParams) => {
      const arr = [];
      if (newCompany.province) {
        const province = cities.value.find(item => item.label === newCompany.province);
        arr.push(province?.value);
        if (newCompany.city) {
          const city = province?.children.find((item: any) => item.label === newCompany.city);
          arr.push(city?.value);
          if (newCompany.county) {
            const county = city?.children.find((item: any) => item.label === newCompany.county);
            arr.push(county?.value);
          }
        }
      }
      selectedAddress.value = arr;
    };

    const getDefaultSelectedPlatformAndAreas = (newCompany: CompanyParams) => {
      if (newCompany.platforms) {
        const arr = newCompany.platforms
          .split(',')
          .map(item => {
            const platform = cooperationPlatforms.value.find(plt => plt.type === Number(item));
            return platform?.value;
          })
          .filter(item => item !== undefined) as string[];
        if (arr.length === cooperationPlatforms.value.length - 1) {
          arr.push('全部');
        }
        checkCooperationPlatformList.value = arr;
      }
      if (newCompany.areas) {
        const arr = newCompany.areas
          .split(',')
          .map(item => {
            return categories.value[Number(item)];
          })
          .filter(item => item !== undefined) as string[];
        if (arr.length === categories.value.length - 1) {
          arr.push('全部');
        }
        checkCategoryList.value = arr;
      }
    };

    const getUploadedFile = (urlArr: string[]) => {
      return urlArr.map(item => {
        const filename = decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--');
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        const fileType = filename_suffix;

        return {
          name: filename,
          type: fileType,
          icon: fileTypeIconMap.get(fileType) ?? 'picture',
          path: item,
        };
      });
    };

    watch(
      () => props.visible,
      newVisible => {
        if (newVisible) {
          if (props.editCompany) {
            const newEditCompany = { ...props.editCompany };
            if (!newEditCompany.account_permit) {
              newEditCompany.account_permit = [];
            }
            if (!newEditCompany.business_license) {
              newEditCompany.business_license = [];
            }

            form.value = newEditCompany;

            getDefaultAddressCodeArr(newEditCompany);
            getDefaultSelectedPlatformAndAreas(newEditCompany);

            if (newEditCompany.quotation) {
              uploadedQuotationFileList.value = getUploadedFile([newEditCompany.quotation]);
            }
            if (newEditCompany.description_file) {
              uploadedDescriptionFileList.value = getUploadedFile([
                newEditCompany.description_file,
              ]);
            }
            if (newEditCompany.account_permit) {
              uploadedPermitFileList.value = getUploadedFile(newEditCompany.account_permit);
            }
            if (newEditCompany.business_license) {
              uploadedDLicenseFileList.value = getUploadedFile(newEditCompany.business_license);
            }
          } else {
            nextTick(() => {
              autoFocuseRef.value?.focus();
            });
          }
          formRef.value?.clearValidate();
        } else {
          setTimeout(() => {
            resetForm();
          }, 250);
        }
      },
    );

    const saveCompany = () => {
      const params = { ...form.value };

      saveLoading.value = true;
      if (props.id) {
        params.id = props.id;
        updateCompany(params).then(res => {
          saveLoading.value = false;
          if (res.data.success) {
            ctx.emit('save');
          } else {
            ctx.root.$message.error(res.data.message ?? '保存失败，请稍后重试');
          }
        });
      } else {
        addCompany(params).then(res => {
          saveLoading.value = false;
          if (res.data.success) {
            ctx.emit('save');
          } else {
            ctx.root.$message.error(res.data.message ?? '保存失败，请稍后重试');
          }
        });
      }
    };

    const close = () => {
      //   ctx.emit('close');
      ctx.emit('update:visible', false);
    };
    const submit = () => {
      formRef.value?.validate(valid => {
        if (valid) {
          saveCompany();
        }
      });
    };

    const selectAllPlatform = (selected: boolean) => {
      if (selected) {
        checkCooperationPlatformList.value = cooperationPlatforms.value.map(item => item.value);
      } else {
        checkCooperationPlatformList.value = [];
      }
    };

    const selectAllCategory = (selected: boolean) => {
      if (selected) {
        checkCategoryList.value = categories.value.map(item => item);
      } else {
        checkCategoryList.value = [];
      }
    };

    const checkedPlatformChange = (val: boolean, index: number) => {
      if (index === 0) {
        if (val) {
          selectAllPlatform(true);
        } else {
          selectAllPlatform(false);
        }
      } else {
        if (val) {
          if (checkCooperationPlatformList.value.length === cooperationPlatforms.value.length - 1) {
            checkCooperationPlatformList.value.push('全部');
          }
        } else {
          if (checkCooperationPlatformList.value.length === cooperationPlatforms.value.length - 1) {
            checkCooperationPlatformList.value.forEach((item, index) => {
              if (item === '全部') {
                checkCooperationPlatformList.value.splice(index, 1);
                return;
              }
            });
          }
        }
      }
      const newLsit = checkCooperationPlatformList.value.filter(item => item !== '全部') ?? [];
      const typeList = newLsit
        .map(item => {
          const filter = cooperationPlatforms.value.filter(platform => platform.value === item);
          return filter[0] ? filter[0].type : undefined;
        })
        .filter(item => item !== undefined);
      form.value.platforms = typeList.length > 0 ? typeList.join(',') : '';
      //   debugger;
    };
    const checkedCategoryChange = (val: boolean, index: number) => {
      if (index === 0) {
        if (val) {
          selectAllCategory(true);
        } else {
          selectAllCategory(false);
        }
      } else {
        if (val) {
          if (checkCategoryList.value.length === categories.value.length - 1) {
            checkCategoryList.value.push('全部');
          }
        } else {
          if (checkCategoryList.value.length === categories.value.length - 1) {
            checkCategoryList.value.forEach((item, index) => {
              if (item === '全部') {
                checkCategoryList.value.splice(index, 1);
                return;
              }
            });
          }
        }
      }
      const newLsit = checkCategoryList.value.filter(item => item !== '全部');
      const typeList = newLsit
        .map(item => {
          // const filter = categories.value.filter((category) => category === item)
          const idx = categories.value.indexOf(item);
          return idx === -1 ? undefined : idx;
        })
        .filter(item => item !== undefined);
      form.value.areas = typeList.length > 0 ? typeList.join(',') : '';
      //   debugger;
    };

    const handleRemoveQuotationClick = (index: number) => {
      form.value.quotation = '';
      uploadedQuotationFileList.value.splice(index, 1);
    };
    const handleRemoveFileClick = (type: number, index: number) => {
      switch (type) {
        case 0:
          form.value.business_license.splice(index, 1);
          uploadedDLicenseFileList.value.splice(index, 1);
          break;
        case 1:
          form.value.account_permit.splice(index, 1);
          uploadedPermitFileList.value.splice(index, 1);
          break;
        case 2:
          form.value.description_file = '';
          uploadedDescriptionFileList.value.splice(index, 1);
          break;
        default:
          break;
      }
    };

    const commonUpload = (file: any) => {
      const form = new FormData();
      form.append('file', file);
      return uploadFile(form).then(res => {
        const result = res.data;
        if (result.success) {
          return Promise.resolve(res);
        } else {
          ctx.root.$message.error(result.message);
          return Promise.reject(result.message);
        }
      });
    };
    const beforeUploadLogo = (file: any) => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        ctx.root.$message.error('图片格式不正确！');
        return false;
      }
      if (file.size > 1024 * 1024) {
        ctx.root.$message.error('上传LOGO图片大小不能超过 1MB!');
        return false;
      }
      const _URL = window.URL || window.webkitURL;
      const img = new Image();
      img.src = _URL.createObjectURL(file);
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const valid = img.width === img.height && img.width >= 160;
          if (valid) {
            resolve(true);
          } else {
            ctx.root.$message.error('上传LOGO图片必须为正方形，并且像素大于160!');
            reject();
          }
        };
      });
    };
    const uploadLogo = async (params: any) => {
      const file = params.file;
      const res = await commonUpload(file);
      if (res.data.success) {
        form.value.logo = res.data.data.source;
      } else {
        ctx.root.$message.error(res.data.message ?? '传失败，稍后重试');
      }
      return res;
    };

    const uploadQuotationHandler = async (params: any) => {
      const file = params.file;
      if (file.size > 80 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 80MB!');
        return;
      }
      const res = await commonUpload(file);
      if (res.data.success) {
        const filename = file.name;
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        const fileType = file.type !== '' ? file.type : filename_suffix;

        uploadedQuotationFileList.value.push({
          name: file.name,
          type: file.type,
          icon: fileTypeIconMap.get(fileType) ?? 'picture',
          size: file.size,
          path: res.data.data.source,
        });

        form.value.quotation = res.data.data.source;
      } else {
        ctx.root.$message.error(res.data.message ?? '传失败，稍后重试');
      }
    };

    const uploadDescriptionHandler = async (params: any) => {
      const file = params.file;
      const found = descriptionAccepts.value.find(type => {
        return file.type === type;
      });
      if (!found) {
        ctx.root.$message.error('上传格式不正确！');
        return;
      }
      if (file.size > 80 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 80MB!');
        return;
      }
      const res = await commonUpload(file);
      if (res.data.success) {
        const filename = file.name;
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        const fileType = file.type !== '' ? file.type : filename_suffix;

        uploadedDescriptionFileList.value.push({
          name: file.name,
          type: file.type,
          icon: fileTypeIconMap.get(fileType) ?? 'picture',
          size: file.size,
          path: res.data.data.source,
        });

        form.value.description_file = res.data.data.source;
      } else {
        ctx.root.$message.error(res.data.message ?? '传失败，稍后重试');
      }
    };

    const uploadLicenseHandler = (value: HttpRequestOptions) => {
      uploadFileHandler(value, 0);
    };

    const uploadPermitHandler = (value: HttpRequestOptions) => {
      uploadFileHandler(value, 1);
    };

    const uploadFileHandler = async (value: HttpRequestOptions, type: number) => {
      const file = value.file;
      if (file.size > 30 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 30MB!');
        return;
      }
      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      switch (type) {
        case 0:
          formData.append('type', 'supplier_company_business_license');
          break;
        case 1:
          formData.append('type', 'supplier_company_account_permit');
          break;
        default:
          break;
      }

      const res = await uploadFileService(formData);
      if (res.data.success) {
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        const fileType = value.file.type !== '' ? value.file.type : filename_suffix;
        const fileItem = {
          name: value.file.name,
          type: value.file.type,
          icon: fileTypeIconMap.get(fileType) ?? 'picture',
          size: value.file.size,
          path: res.data.data.source,
        };
        switch (type) {
          case 0:
            uploadedDLicenseFileList.value.push(fileItem);
            form.value.business_license.push(fileItem.path);
            formRef.value?.validateField('business_license');
            break;
          case 1:
            uploadedPermitFileList.value.push(fileItem);
            form.value.account_permit.push(fileItem.path);
            formRef.value?.validateField('account_permit');
            break;
          default:
            break;
        }
      } else {
        ctx.root.$message({
          type: 'warning',
          message: res.data.message ?? '上传失败，稍后重试',
          showClose: true,
          duration: 3000,
        });
      }
    };

    return {
      autoFocuseRef,
      saveLoading,
      rules,
      form,
      formRef,
      cities,
      cooperationPlatforms,
      isIndeterminatePlatform,
      checkCooperationPlatformList,
      selectedAddress,
      addressChanged,
      checkedPlatformChange,
      checkedCategoryChange,
      isIndeterminateCategory,
      checkCategoryList,
      selectAllPlatform,
      categories,
      close,
      submit,
      descriptionAccepts,
      handleRemoveQuotationClick,
      handleRemoveFileClick,
      beforeUploadLogo,
      uploadLogo,
      uploadDescriptionHandler,
      uploadQuotationHandler,
      uploadLicenseHandler,
      uploadPermitHandler,
      uploadedQuotationFileList,
      uploadedDescriptionFileList,
      uploadedDLicenseFileList,
      uploadedPermitFileList,
    };
  },
});
