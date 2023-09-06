import { defineComponent, ref, watch, computed } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { getPositiveNumber } from '@/utils/string';
import { uploadContractAttachment } from '@/api/customer';
import { Loading } from 'element-ui';
import { sleep } from '@/utils/func';
import upload from '@/modules/design/order/workbench/modules/upload.vue';
import { FunctionSelect, IFunctionSelectConfig } from '@gm/component/select/FunctionSelect';
import {
  Get_Visual_Design_Search_Brand,
  Query_Design_Type_Color_Preferences,
  Query_Design_Type_Department,
  Query_Design_Type_Style_Preferences,
  Query_Setting_Design_Type_Form,
  Save_Design_Order_Form,
  Save_Design_Order_Form_Save,
  Get_Studio,
} from '../../../../services/design';

import ButtonGroup from './buttonGroup';
// import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';

type option_form = {
  id: number;
  name: string;
};

interface FormData {
  // 项目名称
  project_name: string;
  // 品牌名称
  brand_name: string;
  // 是否选择品牌
  is_select_brand: number;
  // 期望交付时间
  expect_delivery_time: string;
  // 项目类型
  department_id: number;
  // 制作内容
  project_type: number | null;
  // 附加内容
  addition_content: number[];
  // 项目主题
  project_subject: string;
  // 备注
  remark: string;

  // 色彩偏好
  color_prefer: number[];
  // 其他
  other_color: string;
  select_project_types: Record<string, any>;
  //  风格偏好
  style_prefer: string[] | number[];
  other_style: string;
  // 结算预算
  project_budget: string;
  // 物料尺寸
  size: string;
  project_content_title: string;
  // 副标题
  project_content_second_title: string;
  project_content_profit_point: string;
  project_content_other_content: string;
  view_first_tier: string;
  view_second_tier: string;
  view_third_tier: string;
  // 参考资料
  references: { url: string }[];
  [key: string | number]: any;
}

export default defineComponent({
  name: 'newTypeDialog',
  props: {
    data: {
      type: Object,
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { opinionUpload: upload, FunctionSelect, ButtonGroup },
  setup(props, ctx) {
    const buttons = [
      { label: '空间设计', value: '1', subtitle: '直播间装修设计/活动设计/磁贴设计等' },
      { label: '平面设计', value: '2', subtitle: '直播贴片设计/物料KT板/秀场大屏设计等' },
      { label: '创意设计', value: '3', subtitle: '绿幕设计/海报设计/详情页设计等' },
    ];

    const selectedValue = ref('1');

    const updateSelectedValue = (value: string) => {
      selectedValue.value = value;
    };
    //
    const saveLoading = ref(false);
    const orderFormRef = ref<ElForm | undefined>(undefined);
    const initOrderForm = () => {
      return {
        references: [],
        remark: '',
        size: '',
        other_style: '',
        other_color: '',
        style_prefer: [],
        color_prefer: [],
        view_first_tier: '',
        view_second_tier: '',
        view_third_tier: '',
        project_content_title: '',
        project_content_other_content: '',
        project_content_profit_point: '',
        project_content_second_title: '',
        project_budget: '',
        project_subject: '',
        expect_delivery_time: '',
        addition_content: [],
        is_select_brand: false,
        brand_name: '',
        department_id: '',
        project_type: null,
        select_project_types: {},
        project_name: '',
      } as any;
    };

    const orderForm = ref<FormData>(initOrderForm());
    const deliveryDaysChances = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const deliveryTypeChances = ['图片（PNG、JPG）', 'PDF', 'execl', 'doc', 'ppt'];
    const projectGroupOptions = [
      {
        value: 1,
        label: '空间设计组',
      },
      {
        value: 2,
        label: '平面设计组',
      },
      {
        value: 3,
        label: '创意设计组',
      },
    ];
    const department_list = ref<option_form[]>([]);
    const Get_Design_Type_Department_List = async () => {
      const res = await Query_Design_Type_Department();
      if (res.data.success) {
        const list = res.data.data;
        department_list.value = list;
      }
    };
    Get_Design_Type_Department_List();
    const old_select_project_types = ref<any>({});
    const projectTypeChances = ref<M.design.DesignSetting[]>([]);

    const GetProjectTypeChancesList = async (team_id: number) => {
      const res = await Query_Setting_Design_Type_Form({
        team_id,
      });
      if (res.data.success) {
        return res.data.data;
        projectTypeChances.value = res.data.data;
      } else {
        return [];
      }
    };

    const initWatch = async () => {
      // if (initValue.department_id) {
      //   projectTypeChances.value = await GetProjectTypeChancesList(initValue.department_id);
      // }

      watch(
        () => orderForm.value.department_id,
        async () => {
          orderFormRef.value?.clearValidate('project_type');
          orderForm.value.project_type = null;
          orderForm.value.addition_content = [];
          additionContentChances.value = [];
          old_select_project_types.value = orderForm.value.select_project_types
            ? orderForm.value.select_project_types
            : old_select_project_types.value;
          orderForm.value.select_project_types = {};
          projectTypeChances.value = await GetProjectTypeChancesList(orderForm.value.department_id);
        },
      );
      watch(
        () => orderForm.value.project_type,
        () => {
          orderFormRef.value?.clearValidate('project_type');
          old_select_project_types.value = orderForm.value.select_project_types
            ? orderForm.value.select_project_types
            : old_select_project_types.value;
          old_addition_content.value =
            orderForm.value.addition_content.length > 0
              ? orderForm.value.addition_content
              : old_addition_content.value;
          orderForm.value.addition_content = [];
          orderForm.value.select_project_types = {};
          additionContentChances.value = [];
          if (orderForm.value.project_type !== null) {
            (
              projectTypeChances.value.filter((el: M.design.DesignSetting) => {
                return orderForm.value.project_type === el.id;
              }) || []
            ).map((el: M.design.DesignSetting, index) => {
              if ((el.addition_content || []).length > 0) {
                additionContentChances.value.push(
                  ...el.addition_content.map((sub: any) => {
                    if (sub.is_required === 1) {
                      orderForm.value.addition_content.push(sub.id);
                    }
                    // if (old_addition_content.value.indexOf(sub.id) >= 0) {
                    //   orderForm.value.addition_content.push(sub.id);
                    // }
                    return {
                      ...sub,
                      name: el.name + '：' + sub.name,
                      required: sub.is_required === 1,
                    };
                  }),
                );
              }
              //fields
              el.fields.map((item: { name: string; id: number }) => {
                orderForm.value.select_project_types[item.name] = String(item.id);
              });
            });
          }
          console.log(additionContentChances.value, 'additionContentChances.value');
        },
      );
    };

    const additionContentChances = ref<any[]>([]);
    const old_addition_content = ref<any>([]);

    const show = (data: any) => {
      if (data) {
        if (data.__projectTypeChances) {
          projectTypeChances.value = data.__projectTypeChances;
          delete data.__projectTypeChances;
        }
        if (data.__additionContentChances) {
          additionContentChances.value = data.__additionContentChances;
          delete data.__additionContentChances;
        }
        if (data.brand_id) {
          brand_id_options.value = [{ label: data.brand_name, value: data.brand_id }];
        }

        orderForm.value = data;
      }
      initWatch();
      console.log('传入内容', data);
    };

    const colorPreferenceChances = ref<option_form[]>([]);
    const Get_Design_Type_Color_List = async () => {
      const res = await Query_Design_Type_Color_Preferences();
      if (res.data.success) {
        const list = res.data.data;
        colorPreferenceChances.value = list;
      }
    };
    Get_Design_Type_Color_List();
    const stylePreferenceChances = ref<option_form[]>([]);
    const Get_Design_Type_style_List = async () => {
      const res = await Query_Design_Type_Style_Preferences();
      if (res.data.success) {
        const list = res.data.data;
        stylePreferenceChances.value = list;
      }
    };
    Get_Design_Type_style_List();
    const resetForm = () => {
      orderForm.value = initOrderForm();
    };

    const orderFormRules = ref({
      size: [{ required: true, message: '请输入物料尺寸', trigger: ['change'] }],
      project_content_title: [{ required: true, message: '请输入主标题', trigger: ['change'] }],
      project_subject: [{ required: true, message: '请输入项目主题', trigger: ['change'] }],
      project_budget: [{ required: true, message: '请输入施工位置', trigger: ['change'] }],
      construction_location: [{ required: true, message: '请输入项目预算', trigger: ['change'] }],
      project_name: [{ required: true, message: '请输入项目名称', trigger: ['change'] }],
      // brand_name: [{ required: true, message: '请输入品牌名称', trigger: ['change'] }],
      department_id: [{ required: true, message: '请选择项目小组', trigger: ['change'] }],
      project_type: [{ required: true, message: '请选择项目类型', trigger: ['change'] }],
      expect_delivery_time: [{ required: true, message: '请选择交付天数', trigger: ['change'] }],
    });
    // 抛出关闭事件
    const emitClose = () => {
      ctx.emit('close');
    };

    // 提交form
    const handleDialogSubmit = async (isSave: boolean) => {
      const result = await new Promise(resolve =>
        (orderFormRef.value as ElForm).validate(result => resolve(result)),
      );

      if (!result) {
        return;
      }

      const payload: any = {
        project_name: orderForm.value.project_name,
        brand_id: orderForm.value.brand_id,
        team_id: orderForm.value.department_id,
        project_subject: orderForm.value.project_subject,
        additional_contents: orderForm.value.addition_content,
        expect_delivery_time: orderForm.value.expect_delivery_time,
        id: orderForm.value.id,
        /*remark: orderForm.value.remark,
        references: orderForm.value.references,*/
      };
      if (orderForm.value.project_type) {
        const project_type_details: { type_field_id: number; type_field_detail: any }[] = [];
        if (orderForm.value.select_project_types['色彩偏好']) {
          project_type_details.push({
            type_field_id: orderForm.value.select_project_types['色彩偏好'],
            type_field_detail: orderForm.value.color_prefer.map(
              (color_item: string | number, index: number) => {
                if (color_item === '其他') {
                  return orderForm.value.other_color;
                } else {
                  return color_item;
                }
              },
            ),
          });
        }
        if (orderForm.value.select_project_types['风格偏好']) {
          project_type_details.push({
            type_field_id: orderForm.value.select_project_types['风格偏好'],
            type_field_detail: orderForm.value.style_prefer.map(
              (style_item: string | number, index: number) => {
                if (style_item === '其他') {
                  return orderForm.value.other_style;
                } else {
                  return style_item;
                }
              },
            ),
          });
        }
        if (orderForm.value.select_project_types['项目预算']) {
          project_type_details.push({
            type_field_id: orderForm.value.select_project_types['项目预算'],
            type_field_detail: orderForm.value.project_budget,
          });
        }
        if (orderForm.value.select_project_types['施工位置']) {
          project_type_details.push({
            type_field_id: orderForm.value.select_project_types['施工位置'],
            type_field_detail: orderForm.value.construction_location,
          });
        }
        if (
          orderForm.value.select_project_types['物料/设备尺寸'] ||
          orderForm.value.select_project_types['物料尺寸']
        ) {
          project_type_details.push({
            type_field_id:
              orderForm.value.select_project_types['物料/设备尺寸'] ||
              orderForm.value.select_project_types['物料尺寸'],
            type_field_detail: orderForm.value.size,
          });
        }
        if (orderForm.value.select_project_types['项目内容']) {
          const detail = JSON.stringify([
            {
              key: '主标题',
              value: orderForm.value.project_content_title,
            },
            {
              key: '副标题',
              value: orderForm.value.project_content_second_title,
            },
            {
              key: '利益点',
              value: orderForm.value.project_content_profit_point,
            },
            {
              key: '其他内容',
              value: orderForm.value.project_content_other_content,
            },
          ]);
          project_type_details.push({
            type_field_id: orderForm.value.select_project_types['项目内容'],
            type_field_detail: detail,
          });
        }
        if (orderForm.value.select_project_types['视觉层级']) {
          const detail = JSON.stringify([
            {
              key: '第一层级',
              value: orderForm.value.view_first_tier,
            },
            {
              key: '第二层级',
              value: orderForm.value.view_second_tier,
            },
            {
              key: '第三层级',
              value: orderForm.value.view_third_tier,
            },
          ]);
          project_type_details.push({
            type_field_id: orderForm.value.select_project_types['视觉层级'],
            type_field_detail: detail,
          });
        }
        payload.project_type = {
          project_type_details,
          project_type_id: orderForm.value.project_type,
          project_type_remark: orderForm.value.remark,
          project_type_references: orderForm.value.references.map((sub: { url: string }) => {
            return sub.url;
          }),
        };
      }
      if (isSave) {
        payload.draft = {
          ...orderForm.value,
          __projectTypeChances: projectTypeChances.value,
          __additionContentChances: additionContentChances.value,
        };
      }
      saveLoading.value = true;
      const PostMethod = isSave === true ? Save_Design_Order_Form_Save : Save_Design_Order_Form;
      const [{ data: response }, _] = await Promise.all([
        await PostMethod(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('submit');
        emitClose();
        if (props.edit) {
          ctx.emit('dialog:reClose');
        }
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    /* const onDeliveryWayChanged = (val: string, index: number) => {
      const findVal = deliveryTypeChances.find(el => el === val);
      orderForm.value.delivery_content.splice(index, 1, {
        ...deepClone(findVal),
      });
    };*/
    let loading: any;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const closeLoading = () => {
      // 使用Element loading-start 方法
      loading.close();
    };
    const clearValidateUpload = () => {
      setTimeout(() => {
        orderFormRef.value?.clearValidate('file_url_list');
      }, 10);
    };
    const pickerOptions = {
      disabledDate: (date: any) => {
        return date.getTime() < new Date().getTime() - 86400000;
      },
    };
    const handleProjectTypeContent = (item: any) => {
      item.open = !item.open;
    };
    const onRemoveFile = (item: any, index: number) => {
      item.references.splice(index, 1);
    };
    const need_days = computed(() => {
      let days = 0;
      if (orderForm.value.project_type !== null) {
        const find = projectTypeChances.value.find(el => el.id === orderForm.value.project_type);
        if (find) days += Number(find.delivery_days || 0);
      }
      additionContentChances.value.map((item: any) => {
        console.log(orderForm.value.addition_content, 'orderForm.value.addition_content');

        orderForm.value.addition_content.map(sub => {
          if (sub === item.id) {
            days = days + Number(item.delivery_days || 0);
          }
        });
      });
      return days;
    });
    /* 上传or删除附件 */
    const changeUpload = (type: 'add' | 'delete', file = '') => {
      clearValidateUpload();
      let references: any = orderForm.value.references;
      if (type === 'add') {
        references.push({ url: file });
      } else {
        // item.slice(index, 1);
        references.map((sub: { url: string }, index: number) => {
          if (sub.url === file) {
            references.slice(index, 1);
          }
          console.log(sub.url, file);
        });
        references = references.filter((sub: { url: string }) => sub.url !== file);
      }
      orderForm.value.references = references;
    };
    const project_select_config: IFunctionSelectConfig = {
      request: value =>
        Get_Visual_Design_Search_Brand(value).then(res =>
          res.data.data.map(it => ({ label: it.name, value: it.id })),
        ),
    };

    const construction_location_config: IFunctionSelectConfig = {
      request: value =>
        Get_Studio(value).then(res =>
          res.data.data.data.map(it => ({ label: it.studio_name, value: it.id })),
        ),
    };

    const brand_id_options = ref<TG.OptionType[]>([]);
    return {
      brand_id_options,
      show,
      project_select_config,
      construction_location_config,
      changeUpload,
      need_days,
      onRemoveFile,
      handleProjectTypeContent,
      pickerOptions,
      department_list,
      clearValidateUpload,
      startLoading,
      closeLoading,
      stylePreferenceChances,
      colorPreferenceChances,
      projectTypeChances,
      projectGroupOptions,
      deliveryTypeChances,
      deliveryDaysChances,
      additionContentChances,
      saveLoading,
      emitClose,
      handleDialogSubmit,
      orderForm,
      orderFormRules,
      resetForm,
      orderFormRef,
      buttons,
      selectedValue,
      updateSelectedValue,
    };
  },
  methods: {
    getfixPositiveNumber(value: any, key: any) {
      value = getPositiveNumber(value);
      if (value > 100000000) {
        const arr = String(this.orderForm[key]).split('');
        arr.pop();
        this.orderForm[key] = arr.join('');
        this.orderForm[key] = getPositiveNumber(this.orderForm[key]);
      } else {
        this.orderForm[key] = getPositiveNumber(value);
      }
    },

    blurPositiveNumber(value: any, key: any) {
      const arr = String(this.orderForm[key]).split('');
      if (arr.length > 0 && arr[arr.length - 1] === '.') {
        arr.pop();
        this.orderForm[key] = arr.join('');
      }
      if (arr.length > 0 && arr[0] === '.') {
        this.orderForm[key] = undefined;
      }
    },
    // 上传附件
    uploadAttachmentFile(value: any, item: any) {
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract_annex');
      this.startLoading();
      uploadContractAttachment(formData)
        .then(res => {
          this.closeLoading();
          if (!res.data.success) {
            this.$message({
              type: 'warning',
              message: res.data.message,
              showClose: true,
              duration: 2000,
            });
          } else {
            const arr = item.references || [];
            arr.push(res.data.data.source);
            item.references = arr;
            this.clearValidateUpload();
          }
        })
        .catch(err => {
          this.closeLoading();
          this.$message({
            type: 'error',
            message: err.message ?? '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          // this.uploadAttachment.uploading = false;
        });
    },
  },
});
