import { defineComponent, ref, watch, computed, nextTick } from '@vue/composition-api';
import { downloadFileFromBlob, getFileExtension } from '@/utils/func';
import {
  PostTemplateAnchorContractDetail,
  PostPreviewAnchorTemplateContractDetail,
  GetContract,
} from '@/services/contract';
import { uploadContractAttachment } from '@/api/customer';
import { Loading } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import { getCostContractUid, getProjectids, getUserids } from '@/api/cooperative';
import { getToken } from '@/utils/token';
import { useRouter } from '@/use/vue-router';
import { getPositiveNumber } from '@/utils/string';
import invoiceFiledImage from '@/assets/img/finance/icon-invoice-content-tip.jpg';

const EMAIL_LEN_MAX = 32;
// 邮件
const RegEmail = /^([\w\-.])+@([\w_\-.])+\.([A-Za-z]{2,4})$/u;
export default defineComponent({
  name: 'TemplateContract',
  props: {
    type: {
      type: String,
      default: 'add',
    },
  },
  components: {},
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const myToken = getToken();
    const no_upload_click = ref(false);
    const visible = ref(false);
    const contract_id = ref(undefined);
    const router = useRouter();
    const anchorId = ref(router.currentRoute.params.id);
    const saveLoading = ref(false);
    /** 用户信息 */
    const userinfo: any = ctx.root.$store.getters['user/getUserInfo'];
    const username: any = userinfo.username;
    const phone: any = userinfo.phone;
    const departmentDefaultExpandedKeys = ref<number[]>([]);
    // 合同表单
    const form = ref<any>({
      file_url_list: undefined,
      other_remark: undefined,
      other_stamp_send_address: undefined,
      other_stamp_send_type: undefined,
      other_stamp_time: undefined,
      other_stamp_type: undefined,
      other_stamp_count: undefined,
      dateUnit: '月',
      cooperation_zhubo_real_time: [],
      // cooperation_zhubo_real_end_time: undefined,
      // cooperation_zhubo_real_start_time: undefined,
      cooperation_zhubo_real_year: undefined,
      cooperation_zhubo_real_month: undefined,
      cooperation_zhubo_try_type: undefined,
      cooperation_zhubo_try_end_time: undefined,
      cooperation_zhubo_try_start_time: undefined,
      cooperation_link_contract_id: undefined,
      cooperation_contract_type: undefined,
      own_tel: phone,
      own_name: username,
      own_id: undefined,
      anchor_name: '',
      anchor_real_name: '',
      anchor_ident: '',
      anchor_tel: '',
      anchor_weixin: '',
      anchor_email: '',
      anchor_address: '',
      organization_id: undefined,
      organization_name: '',
      organization_tel: '',
      organization_address: '',
      project_relevancy_id: undefined,
      project_relevancy_name: undefined,
      // project_operation_prople: undefined,  运营审批人 - 移除
      approval_department_id: undefined,
      settlement_way: 1,
      settlement_hour_pay: undefined,
      settlement_server_low_pay: undefined,
      settlement_server_low_pay_A: undefined,
      settlement_server_low_pay_B: undefined,
      settlement_rate: undefined,
      settlement_month_fee_type: undefined,
      settlement_month_tax_rate: undefined,
      settlement_month_sales: [
        {
          settlement_month_sales_point: undefined,
          settlement_month_sales_rate: undefined,
        },
        {
          settlement_month_sales_point: undefined,
          settlement_month_sales_rate: undefined,
        },
      ],
      settlement_month_first_point: 0,
      content_type_other: undefined,
    });
    const formRules = ref({
      file_url_list: [
        { required: true, message: '请上传合同文本及附件', trigger: ['blur', 'change'] },
      ],
      other_stamp_send_address: [
        { required: true, message: '请输入邮寄信息', trigger: ['blur', 'change'] },
      ],
      other_stamp_send_type: [{ required: true, message: '请选择是否邮寄', trigger: 'change' }],
      other_stamp_time: [{ required: true, message: '请选择用印时间', trigger: 'change' }],
      other_stamp_type: [{ required: true, message: '请选择印章名称', trigger: 'change' }],
      other_stamp_count: [
        { required: true, message: '请输入盖章份数', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === 0 || value === '0') {
              callback('盖章份数不能为0');
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      cooperation_zhubo_real_year: [
        { message: '请输入合同有效期', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            console.log(
              form.value.cooperation_zhubo_real_month,
              typeof form.value.cooperation_zhubo_real_month,
              !Number(form.value.cooperation_zhubo_real_month),
              'form.value',
            );

            if (
              !Number(form.value.cooperation_zhubo_real_year) &&
              !Number(form.value.cooperation_zhubo_real_month)
            ) {
              callback('合同有效期不能为空');
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      /*  cooperation_zhubo_try_type: [
        { required: true, message: '请选择是否有试合作期', trigger: ['blur', 'change'] },
      ],
      cooperation_zhubo_try_start_time: [
        { required: true, message: '请选择试合作期限', trigger: 'change' },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (form.value.cooperation_zhubo_try_end_time) {
              const startTime = new Date(form.value.cooperation_zhubo_try_start_time);
              const endTime = new Date(form.value.cooperation_zhubo_try_end_time);
              if (endTime < startTime) {
                callback('结束日期不能小于开始日期');
              } else {
                callback();
              }
            } else {
              callback('请选择试合作期限');
            }
          },
          trigger: ['blur'],
        },
      ],*/
      cooperation_zhubo_real_time: [
        { required: true, message: '请选择合作期限', trigger: 'change' },
        {
          validator: (rule: any, value: any, callback: any) => {
            callback();
          },
          trigger: ['blur'],
        },
      ],
      cooperation_link_contract_id: [
        { required: true, message: '请输入关联主合同编号', trigger: ['blur', 'change'] },
      ],
      content_type_other: [
        { required: true, message: '请输入开票内容', trigger: ['blur', 'change'] },
      ],
      own_id: [{ required: true, message: '请输入经办人', trigger: ['blur', 'change'] }],
      own_tel: [{ required: true, message: '请输入电话', trigger: ['blur', 'change'] }],
      cooperation_contract_type: [{ required: true, message: '请选择签约类型', trigger: 'change' }],
      anchor_email: [
        { required: true, message: '请输入电子邮箱', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === '') {
              callback();
            } else if (value.length > EMAIL_LEN_MAX) {
              callback(new Error(`最多输入${EMAIL_LEN_MAX}个字符`));
            } else if (!RegEmail.test(value)) {
              callback(new Error('请输入正确的邮箱地址'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      anchor_address: [{ required: true, message: '请输入联系地址', trigger: ['blur', 'change'] }],
      organization_address: [
        { required: true, message: '请输入联系地址', trigger: ['blur', 'change'] },
      ],
      project_relevancy_id: [
        { required: true, message: '请选择关联项目', trigger: ['blur', 'change'] },
      ],
      approval_department_id: [{ required: true, message: '请选择用人部门', trigger: ['change'] }],
      // project_operation_prople: [
      //   {
      //     validator: (rule: any, value: any, callback: () => void) => {
      //       console.log({
      //         rule,
      //         value,
      //         callback,
      //       });
      //       debugger;
      //     },
      //     trigger: ['change'],
      //   },
      // ],
      settlement_way: [{ required: true, message: '请选择计算方式', trigger: ['blur', 'change'] }],
      settlement_hour_pay: [
        { required: true, message: '请输入小时服务费', trigger: ['blur', 'change'] },
      ],
      settlement_server_low_pay: [
        { required: true, message: '请输入保底服务费', trigger: ['blur', 'change'] },
      ],
      settlement_server_low_pay_A: [
        { required: true, message: '请输入保底服务费A', trigger: ['blur', 'change'] },
      ],
      settlement_server_low_pay_B: [
        { required: true, message: '请输入保底服务费B', trigger: ['blur', 'change'] },
      ],
      settlement_rate: [
        { required: true, message: '请输入提成比例', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === 0 || value === '0') {
              callback('提成比例不能为0');
            } else if (Number(value) > 100) {
              callback('提成比例输入错误');
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      settlement_month_fee_type: [
        { required: true, message: '请选择票款类型', trigger: ['blur', 'change'] },
      ],
      settlement_month_tax_rate: [
        { required: true, message: '请输入税率', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (Number(value || 0) > 100) {
              callback('税率输入错误');
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      settlement_month_sales: [
        { required: true, message: '请输入', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            callback('');
          },
          trigger: ['blur'],
        },
      ],
    });
    const isUnableClick = ref(true);
    watch(
      () => {
        return form;
      },
      form => {
        if (
          form.value.cooperation_contract_type === 1 ||
          form.value.cooperation_contract_type === 2
        ) {
          formRules.value.file_url_list = [
            { required: false, message: '请上传合同文本及附件', trigger: ['blur', 'change'] },
          ];
        } else {
          formRules.value.file_url_list = [
            { required: true, message: '请上传合同文本及附件', trigger: ['blur', 'change'] },
          ];
        }
        const formValue = form.value;
        if (formValue.cooperation_zhubo_real_time?.length && formValue.cooperation_contract_type) {
          isUnableClick.value = false;
        } else {
          isUnableClick.value = true;
        }
        // if (
        //   formValue.cooperation_zhubo_real_year &&
        //   formValue.cooperation_zhubo_real_time?.length
        // ) {
        //   const date: Date = new Date(formValue.cooperation_zhubo_real_start_time);
        //   date.setFullYear(date.getFullYear() + Number(formValue.cooperation_zhubo_real_year));
        //   date.setDate(date.getDate() - 1);
        //   const y = date.getFullYear();
        //   const m = date.getMonth() + 1;
        //   const d = date.getDate();
        //   formValue.cooperation_zhubo_real_end_time =
        //     y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
        // } else {
        //   formValue.cooperation_zhubo_real_end_time = undefined;
        // }
      },
      {
        deep: true,
      },
    );
    const contractInfoRecords = ref([]);
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
    const file_url_list = ref<any>([]);
    const ownInfoRecords = [
      { value: 1, label: '轻奢项目负责人' },
      { value: 2, label: '时尚项目负责人' },
    ];
    const computeWayRecords = [
      { value: 1, label: '小时服务费' },
      { value: 9, label: '保底服务费' },
      { value: 4, label: '小时服务费或提点' },
      { value: 2, label: '保底服务费或提点' },
      { value: 5, label: '小时服务费或阶梯式提点' },
      { value: 6, label: '保底服务费或阶梯式提点' },
      { value: 7, label: '保底服务费A或保底服务费B+提点' },
      { value: 8, label: '小时服务费或保底服务费+提点' },
    ];
    const qianyueRecord = [
      { value: 1, label: '合作协议' },
      { value: 2, label: '结算协议' },
      { value: 3, label: '补充协议' },
      { value: 4, label: '解除协议' },
    ];
    const stampRecord = [
      { value: 1, label: '公章' },
      { value: 2, label: '合同专用章' },
    ];
    const requestOptions = {
      headers: {
        Authorization: getToken() ?? '',
      },
    };
    const downClick = (urlString: string) => {
      fetch(urlString, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            const url = new URL(urlString);
            const filename = decodeURIComponent(url.pathname.split('/').pop() ?? '');
            downloadFileFromBlob(data, filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };
    const refresh = async () => {
      setTimeout(() => {
        new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      }, 10);
    };
    const clearValidate = () => {
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 10);
    };
    const clearValidateUpload = () => {
      setTimeout(() => {
        formRef.value?.clearValidate('file_url_list');
      }, 10);
    };
    const onSaveBtnClick = async (btntype: any) => {
      const formValue = form.value;
      const result = await new Promise(resolve =>
        formRef.value?.validate((pass: any) => resolve(pass)),
      );
      if (result) {
        const our_info = [
          {
            key: '经办人',
            value: formValue.own_id,
          },
          {
            key: '经办人Name',
            value: formValue.own_name,
          },
          {
            key: '电话',
            value: formValue.own_tel,
          },
        ];
        const cooperation_content: any = [
          {
            key: '计算方式',
            value: formValue.settlement_way ? formValue.settlement_way : undefined,
          },
          {
            key: '小时服务费',
            value:
              formValue.settlement_way === 1 ||
              formValue.settlement_way === 4 ||
              formValue.settlement_way === 5 ||
              formValue.settlement_way === 8
                ? formValue.settlement_hour_pay
                : undefined,
          },
          {
            key: '保底服务费',
            value:
              formValue.settlement_way === 2 ||
              formValue.settlement_way === 9 ||
              formValue.settlement_way === 6 ||
              formValue.settlement_way === 8
                ? formValue.settlement_server_low_pay
                : undefined,
          },
          {
            key: '保底服务费A',
            value:
              formValue.settlement_way === 7 ? formValue.settlement_server_low_pay_A : undefined,
          },
          {
            key: '保底服务费B',
            value:
              formValue.settlement_way === 7 ? formValue.settlement_server_low_pay_B : undefined,
          },
          {
            key: '提成比例',
            value:
              formValue.settlement_way === 2 ||
              formValue.settlement_way === 4 ||
              formValue.settlement_way === 7 ||
              formValue.settlement_way === 8
                ? formValue.settlement_rate
                : undefined,
          },
          {
            key: '阶梯提点',
            value:
              formValue.settlement_way === 5 || formValue.settlement_way === 6
                ? formValue.settlement_month_sales
                : undefined,
          },
          {
            key: '票款类型',
            value:
              formValue.settlement_month_fee_type === 1
                ? '先票后款'
                : formValue.settlement_month_fee_type === 2
                ? '先款后票'
                : '',
          },
          {
            key: '发票类型',
            value: '专票',
          },
          {
            key: '税率',
            value: formValue.settlement_month_tax_rate,
          },
        ];
        /*  let trytimestr = formValue.cooperation_zhubo_try_start_time;
        trytimestr = trytimestr + '/' + formValue.cooperation_zhubo_try_end_time;*/
        const [start_time, end_time] = formValue.cooperation_zhubo_real_time ?? [];
        const real_time_str = start_time + '/' + end_time;
        const cooperation_duration = [
          {
            key: '签约类型',
            value: qianyueRecord.find(item => item.value === formValue.cooperation_contract_type)
              ? qianyueRecord.find(item => item.value === formValue.cooperation_contract_type)
                  ?.label
              : '',
          },
          {
            key: '关联主合同',
            value:
              formValue.cooperation_contract_type < 2
                ? undefined
                : formValue.cooperation_link_contract_id,
          },
          {
            key: '合同有效期',
            value:
              Number(formValue.cooperation_zhubo_real_year ?? 0) * 12 +
              Number(formValue.cooperation_zhubo_real_month ?? 0),
          },
          {
            key: '合作期限',
            value: real_time_str,
          },
          { key: '试合作期', value: '无' },
          { key: '合同有效期单位', value: formValue.dateUnit },
        ];
        /*  {
           key: '试合作期',
             value:
           formValue.cooperation_zhubo_try_type === 1
             ? '有'
             : formValue.cooperation_zhubo_try_type === 0
             ? '无'
             : '',
         },
        if (formValue.cooperation_zhubo_try_type === 1) {
           cooperation_duration.push({
             key: '起止时间',
             value: trytimestr,
           });
         }*/
        const others = dialogConfig.value.personalSign
          ? []
          : [
              {
                key: '盖章份数',
                value: formValue.other_stamp_count,
              },
              {
                key: '印章名称',
                value: stampRecord[formValue.other_stamp_type - 1].label,
              },
              {
                key: '用印时间',
                value: formValue.other_stamp_time,
              },
              {
                key: '是否邮寄',
                value: formValue.other_stamp_send_type === 1 ? 1 : 0,
              },
            ];
        if (!dialogConfig.value.personalSign && formValue.other_stamp_send_type === 1) {
          others.push({
            key: '邮寄信息',
            value:
              formValue.other_stamp_send_type === 1
                ? formValue.other_stamp_send_address
                : undefined,
          });
        }
        const company_info: any = [
          {
            key: '机构ID',
            value: formValue.organization_id,
          },
          {
            key: '机构名称',
            value: formValue.organization_name,
          },
          {
            key: '联系电话',
            value: formValue.organization_tel,
          },
          {
            key: '联系地址',
            value: formValue.organization_address,
          },
        ];
        const anchor_info: any = [
          {
            key: '主播花名',
            value: formValue.anchor_name,
          },
          {
            key: '主播姓名',
            value: formValue.anchor_real_name,
          },
          {
            key: '身份证号',
            value: formValue.anchor_ident,
          },
          {
            key: '电话',
            value: formValue.anchor_tel,
          },
          {
            key: '微信号',
            value: formValue.anchor_weixin,
          },
          {
            key: '电子邮箱',
            value: formValue.anchor_email,
          },
          {
            key: '联系地址',
            value: formValue.anchor_address,
          },
        ];
        const payload: any = {
          cooperative_sign_type: dialogConfig.value.personalSign
            ? E.supplier.CooperativeSignType.PERSONAL
            : E.supplier.CooperativeSignType.OFFICIAL,
          contract_id: contract_id.value || '',
          anchor_id: anchorId.value,
          project_id: formValue.project_relevancy_id,
          // approver_name: ownInfoRecords[formValue.project_operation_prople - 1].label,
          approval_department_id: formValue.approval_department_id,
          our_info: our_info,
          cooperation_duration: cooperation_duration,
          cooperation_content: cooperation_content,
          company_info: company_info,
          anchor_info: anchor_info,
          others: others,
          attachment_urls: file_url_list.value,
          remark: formValue.other_remark,
          content_type_other: formValue.content_type_other,
          frontend_data: {
            ...formValue,
            content_type_other: formValue.content_type_other,
          },
        };
        saveLoading.value = true;
        if (btntype === 1) {
          const { data: response } = await PostTemplateAnchorContractDetail(payload);
          // closeLoading();
          saveLoading.value = false;
          if (response.success) {
            ctx.root.$message.success(response.message);
            no_upload_click.value = false;
            visible.value = false;
            ctx.emit('added');
          } else {
            ctx.root.$message.error(response.message);
          }
        } else if (btntype === 2 || btntype === 3) {
          const postData: any = {
            sign_type: formValue.cooperation_contract_type === 1 ? 4 : -4,
            dataset: {
              // contract_type: Number(formValue.contract_status),
              contract_id: contract_id.value || '',
              anchor_id: anchorId.value,
              project_id: formValue.project_relevancy_id,
              // approver_name: ownInfoRecords[formValue.project_operation_prople - 1].label,
              approval_department_id: formValue.approval_department_id,
              our_info: our_info,
              cooperation_duration: cooperation_duration,
              cooperation_content: cooperation_content,
              company_info: company_info,
              anchor_info: anchor_info,
              others: others,
              attachment_urls: file_url_list.value,
              remark: formValue.other_remark,
            },
          };
          const { data: response } = await PostPreviewAnchorTemplateContractDetail(postData);
          // closeLoading();
          saveLoading.value = false;
          if (response.success) {
            const file_data: any = response.data;
            if (file_data.file_url) {
              const url: string = file_data.file_url;
              const ttime: any = new Date().getTime();
              if (btntype === 2) {
                window.open(url + '?Authorization=' + myToken + '&t=' + ttime);
              } else {
                downClick(url + '?Authorization=' + myToken + '&t=' + ttime);
              }
            } else if (file_data.file_urls) {
              const files: string[] = file_data.file_urls;
              files.map((url: string) => {
                const ttime: any = new Date().getTime();
                if (btntype === 2) {
                  window.open(url + '?Authorization=' + myToken + '&t=' + ttime);
                } else {
                  downClick(url + '?Authorization=' + myToken + '&t=' + ttime);
                }
              });
            }
          } else {
            ctx.root.$message.error(response.message);
          }
        } else {
          saveLoading.value = false;
        }
      }
    };
    const contract_id_list = ref<any>([]);
    const tabsChange = (item: any) => {
      form.value.cooperation_contract_type = item;
    };
    const tabsShoufeiChange = (item: any) => {
      if (form.value.payee_type === item) {
        if (form.value.payee_type_other === true) {
          form.value.payee_type = 4;
        } else {
          form.value.payee_type = undefined;
        }
      } else {
        form.value.payee_type = item;
      }
    };
    const tabsROIChange = (item: any) => {
      if (form.value.payee_ROI_type === item) {
        form.value.payee_ROI_type = undefined;
      } else {
        form.value.payee_ROI_type = item;
      }
    };
    const noChange = () => {};
    const anchor_ident = computed(() => {
      return form.value.anchor_ident.length > 10
        ? form.value.anchor_ident.substring(0, 6) + '*****' + form.value.anchor_ident.substring(14)
        : '******';
    });
    const anchor_tel = computed(() => {
      return form.value.anchor_tel.length > 10
        ? form.value.anchor_tel.substring(0, 3) + '****' + form.value.anchor_tel.substring(7)
        : '******';
    });
    const anchor_weixin = computed(() => {
      return form.value.anchor_weixin.length > 0
        ? form.value.anchor_weixin.substring(0, 1) + '****'
        : '******';
    });
    const addSettlementItem = () => {
      if (form.value.settlement_month_sales.length < 5) {
        form.value.settlement_month_sales.push({
          settlement_month_sales_point: undefined,
          settlement_month_sales_rate: undefined,
        });
        /*  for (let i = 1; i < form.value.settlement_month_sales.length; i++) {
          form.value.settlement_month_sales[i].settlement_month_sales_one = form.value.settlement_month_sales[i - 1].settlement_month_sales_two;
        }*/
      }
    };
    const reduceSettlementItem = () => {
      if (form.value.settlement_month_sales.length > 2) {
        form.value.settlement_month_sales.pop();
      }
    };
    const sales_rules_money = (index: number) => {
      return [
        { required: true, message: '请输入月净销额', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (index === form.value.settlement_month_sales.length - 1) {
              callback();
            } else if (form.value.settlement_month_sales[index].settlement_month_sales_point) {
              if (index === 0) {
                callback();
              } else if (
                form.value.settlement_month_sales[index - 1].settlement_month_sales_point &&
                Number(form.value.settlement_month_sales[index].settlement_month_sales_point) <=
                  Number(form.value.settlement_month_sales[index - 1].settlement_month_sales_point)
              ) {
                callback('月净销额输入有误');
              } else {
                callback();
              }
            } else {
              callback('请输入月净销额');
            }
          },
          trigger: ['blur'],
        },
      ];
    };
    const sales_rules_rate = (index: number) => {
      return [
        { required: true, message: '请输入提成比例', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (form.value.settlement_month_sales[index].settlement_month_sales_rate) {
              if (
                (Number(
                  form.value.settlement_month_sales[index].settlement_month_sales_rate || 0,
                ) <= 0 &&
                  index !== 0) ||
                Number(form.value.settlement_month_sales[index].settlement_month_sales_rate || 0) >
                  100
              ) {
                callback(new Error('提成比例有误'));
              } else {
                callback();
              }
            } else {
              callback(new Error('请输入提成比例'));
            }
          },
          trigger: ['blur'],
        },
      ];
    };
    const queryContractDetail = async (payload: any) => {
      const getType = 7;
      // payload.partner_type = partner_type;
      const response = await GetContract(payload, getType);
      if (response.success && response.data) {
        if (response.data?.template_info?.frontend_data) {
          const formData: any = JSON.parse(
            JSON.stringify(response.data?.template_info.frontend_data),
          );
          for (const key in formData) {
            if (
              key !== 'cooperation_contract_type' &&
              key !== 'cooperation_link_contract_id' &&
              key !== 'cooperation_link_contract_ID' &&
              key !== 'anchor_name' &&
              key !== 'anchor_real_name' &&
              key !== 'anchor_ident' &&
              key !== 'anchor_tel' &&
              key !== 'anchor_weixin' &&
              key !== 'organization_id' &&
              key !== 'organization_name' &&
              key !== 'organization_tel' &&
              key !== 'file_url_list' &&
              key !== 'filelisturl'
            ) {
              form.value[key] = formData[key];
            }
          }
          if (!form.value.project_relevancy_id) {
            form.value.project_relevancy_name = response.data?.contract_info.project_name || '暂无';
            form.value.project_relevancy_id = response.data?.contract_info.project_id || 0;
          }
          const own_arr: any = [{ username: form.value.own_name, id: form.value.own_id }];
          own_name_ids.value = own_arr;
        }
      } else {
        ctx.root.$message.warning(response.message ?? '主合同详情获取失败');
      }
    };
    const project_ids = ref([]);
    const own_name_ids = ref([]);
    const dialogConfig = ref({
      personalSign: false,
    });

    // const reqFeishuDep = useRequest(GetFeishuDepartmentList, {
    //   transform(res) {
    //     return (res.data || []).map(el => {
    //       return {
    //         disabled: true,
    //         ...el,
    //       };
    //     });
    //   },
    // });
    const levelDisabled = (level: number) => {
      return level === 1;
    };

    return {
      invoiceFiledImage,
      queryContractDetail,
      sales_rules_rate,
      sales_rules_money,
      reduceSettlementItem,
      addSettlementItem,
      anchor_tel,
      anchor_ident,
      anchor_weixin,
      noChange,
      project_ids,
      own_name_ids,
      checked2: true,
      clearValidate,
      clearValidateUpload,
      username,
      phone,
      refresh,
      saveLoading,
      no_upload_click,
      visible,
      anchorId,
      contract_id,
      tabsShoufeiChange,
      tabsROIChange,
      tabsChange,
      downClick,
      myToken,
      computeWayRecords,
      onSaveBtnClick,
      formRef,
      file_url_list,
      startLoading,
      closeLoading,
      ownInfoRecords,
      qianyueRecord,
      sendAddressRecord: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
      ],
      stampRecord,
      contractInfoRecords,
      formRules,
      form,
      isUnableClick,
      contract_id_list,
      dialogConfig,
      // reqFeishuDep,
      departmentDefaultExpandedKeys,
      levelDisabled,
      bailingOutContent: E.supplier.BailingOutContentOption,
    };
  },
  methods: {
    getfixIntPositiveNumber(value: any, key: any) {
      if (key === 'settlement_month_tax_rate') {
        value = value.replace(/[^.\d]+/gu, '');
        if (value >= 100) {
          const arr = String(this.form[key]).split('');
          arr.pop();
          this.form[key] = arr.join('');
          this.form[key] = getPositiveNumber(this.form[key]);
        } else {
          this.form[key] = getPositiveNumber(value);
        }
      } else {
        value = value.replace(/[^\d]+/gu, '');
        value = getPositiveNumber(value);
        if (
          (value > 20 && key === 'cooperation_zhubo_real_year') ||
          (value > 12 && key === 'cooperation_zhubo_real_month')
        ) {
          const arr = String(this.form[key]).split('');
          arr.pop();
          this.form[key] = arr.join('');
          this.form[key] = getPositiveNumber(this.form[key]);
        } else {
          this.form[key] = getPositiveNumber(value);
        }
      }
    },
    getfixPositiveSalseNumber(value: any, key: any, index: any) {
      value = getPositiveNumber(value);
      if (value > 100000000 || (value > 100 && key === 'settlement_month_sales_rate')) {
        const arr = String(value).split('');
        arr.pop();
        const value_one = arr.join('');
        this.form.settlement_month_sales[index][key] = getPositiveNumber(value_one);
      } else {
        this.form.settlement_month_sales[index][key] = getPositiveNumber(value);
      }
    },
    getfixPositiveNumber(value: any, key: any) {
      value = getPositiveNumber(value);
      if (value > 100000000 || (value > 100 && key === 'settlement_rate')) {
        const arr = String(this.form[key]).split('');
        arr.pop();
        this.form[key] = arr.join('');
        this.form[key] = getPositiveNumber(this.form[key]);
      } else {
        this.form[key] = getPositiveNumber(value);
      }
    },
    blurPositiveNumber(value: any, key: any) {
      const arr = String(this.form[key]).split('');
      if (arr.length > 0 && arr[arr.length - 1] === '.') {
        arr.pop();
        this.form[key] = arr.join('');
      }
      if (arr.length > 0 && arr[0] === '.') {
        this.form[key] = undefined;
      }
    },
    // 关联主播主合同输入值获取
    getContract(val: any) {
      getCostContractUid({
        contract_type: 7,
        contract_status: 2,
        search: val,
        only_main: 1,
        anchor_id: this.anchorId,
        // cooperation_status: 1,
        release_status: 0,
      }).then(({ data }) => {
        this.contract_id_list = data.data.data;
      });
    },
    // 关联项目
    getProjectIds(val: any) {
      getProjectids({
        project_name: val,
        cooperation_type: 1,
        business_type: '3,7,9',
        is_end: 0,
      }).then(({ data }) => {
        const item: any = {
          id: 0,
          project_name: '暂无',
        };
        const arr: any = [];
        let project_ids = data.data || [];
        if (
          project_ids.length < 1 &&
          this.form.project_relevancy_name &&
          this.form.project_relevancy_id
        ) {
          project_ids = [
            { project_name: this.form.project_relevancy_name, id: this.form.project_relevancy_id },
          ];
        }
        arr.push(...project_ids);
        arr.push(item);
        this.project_ids = arr;
      });
    },
    // 选择关联框架合同
    selectContractUidChange(val: any) {
      this.form.cooperation_link_contract_id = val;
      if (this.form.cooperation_link_contract_id) {
        this.contract_id_list.map((item: any) => {
          if (item.contract_uid === val) {
            this.queryContractDetail({ id: item.contract_id });
          }
        });
      }
    },
    // 选择关联项目
    selectProjrctIDChange(val: any) {
      this.form.project_relevancy_id = val;
      this.project_ids.map((item: any) => {
        if (item.id === val) {
          this.form.project_relevancy_name = item.project_name;
          // if (item.department_id) {
          this.form.approval_department_id = item.department_id;
          this.departmentDefaultExpandedKeys = item.department_id ? [item.department_id] : [];
          nextTick(() => {
            this.formRef?.clearValidate();
          });
          // }
        }
      });
    },
    // 经办人
    getOwnNameIds(val: any, isDefault = false) {
      getUserids({
        is_checked: 1,
        search_type: 2,
        search_value: val,
      }).then(({ data }) => {
        if (data.success) {
          this.own_name_ids = data.data.data;
          if (isDefault && this.form.own_name && this.own_name_ids.length > 0) {
            const item: any = this.own_name_ids[0];
            this.form.own_id = item.id || undefined;
          }
        }
      });
    },
    // 选择经办人
    selecOwnNameidChange(val: any) {
      this.form.own_id = val;
      this.own_name_ids.map((item: any) => {
        if (item.id === val) {
          this.form.own_name = item.username;
        }
      });
    },
    // 提供给父组件使用，勿删
    show(anchor: any, item: any, config: any) {
      if (config) {
        this.dialogConfig = { ...this.dialogConfig, ...config };
      }
      this.form = {
        file_url_list: undefined,
        other_remark: undefined,
        other_stamp_send_address: undefined,
        other_stamp_send_type: undefined,
        other_stamp_time: undefined,
        other_stamp_type: undefined,
        other_stamp_count: undefined,
        dateUnit: '月',
        cooperation_zhubo_real_last_time: undefined,
        cooperation_zhubo_real_time: [],
        // cooperation_zhubo_real_end_time: undefined,
        // cooperation_zhubo_real_start_time: undefined,
        cooperation_zhubo_real_year: undefined,
        cooperation_zhubo_real_month: undefined,
        cooperation_zhubo_try_type: undefined,
        cooperation_zhubo_try_end_time: undefined,
        cooperation_zhubo_try_start_time: undefined,
        cooperation_link_contract_id: undefined,
        cooperation_contract_type: undefined,
        own_tel: this.phone,
        own_name: this.username,
        own_id: undefined,
        anchor_name: anchor.flower_name || '',
        anchor_real_name: anchor.real_name || '',
        anchor_ident: anchor.id_card || '',
        anchor_tel: anchor.collection_phone || '',
        anchor_weixin: anchor.wechat || '',
        anchor_email: anchor.email || '',
        anchor_address: '',
        organization_id: anchor.settlement_company_id || '',
        organization_name: anchor.settlement_company_name || '',
        organization_tel: anchor.settlement_company_contact_no || '',
        organization_address: anchor.settlement_company_address || '',
        project_relevancy_id: undefined,
        project_relevancy_name: undefined,
        // project_operation_prople: undefined,
        approval_department_id: undefined,
        settlement_way: 1,
        settlement_hour_pay: undefined,
        settlement_server_low_pay: undefined,
        settlement_server_low_pay_A: undefined,
        settlement_server_low_pay_B: undefined,
        settlement_rate: undefined,
        settlement_month_fee_type: undefined,
        settlement_month_tax_rate: undefined,
        settlement_month_sales: [
          {
            settlement_month_sales_point: undefined,
            settlement_month_sales_rate: undefined,
          },
          {
            settlement_month_sales_point: undefined,
            settlement_month_sales_rate: undefined,
          },
        ],
        settlement_month_first_point: 0,
        content_type_other: undefined,
      };
      this.clearValidate();
      if (item) {
        this.isUnableClick = false;
        if (item.template_info.frontend_data) {
          const form: any = JSON.parse(JSON.stringify(item.template_info.frontend_data));
          for (const key in form) {
            if (key === 'cooperation_link_contract_ID') {
              this.form.cooperation_link_contract_id = form[key];
            } else {
              this.form[key] = form[key];
            }
          }
        }
        this.contract_id = item.contract_detail.contract_id;
        this.anchorId = item.contract_info.anchor_id;
        this.file_url_list =
          item.template_info.frontend_data.file_url_list ||
          item.template_info.frontend_data.filelisturl ||
          [];
        this.form.file_url_list = this.file_url_list;
        this.form.approval_department_id = item.contract_info?.approval_department_id;
        const projectArr: any = [
          { project_name: this.form.project_relevancy_name, id: this.form.project_relevancy_id },
        ];
        this.project_ids = projectArr;
        const own_arr: any = [{ username: this.form.own_name, id: this.form.own_id }];
        this.own_name_ids = own_arr;
      } else {
        this.file_url_list = [];
        this.isUnableClick = true;
        if (this.form.own_name) {
          this.getOwnNameIds(this.form.own_name, true);
        }
      }
      this.getProjectIds('');
      this.getContract('');
      this.no_upload_click = true;
      this.visible = true;
      this.$nextTick(() => {});
    },
    backClick() {
      if (
        this.form.cooperation_contract_type ||
        this.form.cooperation_zhubo_real_year ||
        this.form.project_relevancy_id
      ) {
        this.$confirm('你确定退出当前合同协议编辑吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
          .then(() => {
            this.visible = false;
          })
          .catch(() => {
            return false;
          });
      } else {
        this.visible = false;
      }
    },
    beforeUpload(file: File) {
      if (file.size > 20 * 1024 * 1024) {
        this.$message.warning(
          `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在20MB以内`,
        );
        return false;
      }
      if (
        ![
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          '.sheet',
        ].includes(file.type) &&
        !['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xlsx'].includes(
          getFileExtension(file.name),
        )
      ) {
        this.$message.warning('文件格式不正确，请使用  pdf / docx / doc / jpg / png / xlsx');
        return false;
      }
      return true;
    },
    // 上传附件
    async uploadAttachmentFile(value: any) {
      const result = this.beforeUpload(value.file);
      if (!result) {
        return;
      }
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
            const arr = this.file_url_list || [];
            arr.push(res.data.data.source);
            this.file_url_list = arr;
            this.form.file_url_list = arr;
            this.clearValidateUpload();
          }
        })
        .catch(() => {
          this.closeLoading();
          this.$message({
            type: 'error',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          // this.uploadAttachment.uploading = false;
        });
    },
  },
});
