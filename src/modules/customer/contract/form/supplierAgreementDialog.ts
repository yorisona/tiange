import { defineComponent, ref, watch } from '@vue/composition-api';
import { getContractShopUid, getContractUid, getPartnerList } from '@/api/customer';
import { RouterNameSupplier } from '@/const/router';
import { downloadFileFromBlob, getFileExtension } from '@/utils/func';
import {
  PostTemplateProjectContractDetail,
  PostPreviewTemplateContractDetail,
} from '@/services/contract';
import { uploadContractAttachment } from '@/api/customer';
import { Loading } from 'element-ui';
/*import { GetSupplierCustomerList } from '@/services/customers';*/
import { ElForm } from 'element-ui/types/form';
import { getCostContractUid } from '@/api/cooperative';
import { ProjectTypeEnum } from '@/types/tiange/common';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { getToken } from '@/utils/token';
import { getPositiveNumber } from '@/utils/string';
import invoiceFiledImage from '@/assets/img/finance/icon-invoice-content-tip.jpg';
import inputLimit from '@/utils/inputLimit';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
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
    const contract_uid = ref(undefined);
    const contract_id = ref(undefined);
    const my_project_id = ref(undefined);
    const saveLoading = ref(false);
    /** 用户信息 */
    const userinfo: any = ctx.root.$store.getters['user/getUserInfo'];
    const username: any = userinfo.username;
    const phone: any = userinfo.phone;
    // 合同表单
    const form = ref<any>({
      approval_department_id: undefined,
      cooperation_live_way: undefined,
      payee_remarkstr: undefined,
      live_start_day_pre: undefined,
      live_line_day_later: undefined,
      refund_day: undefined,
      live_day_later: undefined,
      live_day_pre: undefined,
      contract_xieyi_yuangao_type: false,
      contract_xieyi_yifang_type: false,
      file_url_list: undefined,
      other_remark: undefined,
      other_stamp_send_address: undefined,
      other_stamp_send_type: undefined,
      other_stamp_time: undefined,
      other_stamp_type: undefined,
      other_stamp_count: undefined,
      cashdeposit_need_day: undefined,
      cashdeposit_need_money: undefined,
      cashdeposit_need_date: undefined,
      cashdeposit_need_type: 0,
      payee_paymoney_type_other: undefined,
      payee_paymoney_type_link: undefined,
      payee_paymoney_type: undefined,
      payee_request_opencard_default_shuilv: undefined,
      payee_request_opencard_shuilv: undefined,
      payee_request_opencard_type: undefined,
      payee_request_card_type: undefined,
      payee_request_type: undefined,
      payee_execute_type: undefined,
      payee_ROI_request_fw: undefined,
      payee_ROI_request_xs: undefined,
      payee_ROI_request: undefined,
      payee_ROI_type: undefined,
      payee_other: undefined,
      payee_yongjinlv_four: undefined,
      payee_yongjinlv_three: undefined,
      payee_yongjinlv_two: undefined,
      payee_yongjinlv_one: undefined,
      payee_money_two: undefined,
      payee_money: undefined,
      payee_type: undefined,
      payee_type_other: undefined,
      cooperation_zhubo_real_last_time: undefined,
      cooperation_contract_long_type: undefined,
      cooperation_zhubo_real_end_time: undefined,
      cooperation_zhubo_real_start_time: undefined,
      cooperation_zhubo_real_time: undefined,
      cooperation_link_contract_id: undefined,
      cooperation_contract_type: undefined,
      cooperation_work_other: undefined,
      cooperation_work_video_time: undefined,
      cooperation_work_video: undefined,
      cooperation_work_day: undefined,
      cooperation_work_platform: undefined,
      cooperation_gather_date: undefined,
      cooperation_work_time: undefined,
      cooperation_work_name: undefined,
      cooperation_shop_name: undefined,
      cooperation_link_count: undefined,
      cooperation_zhubo_name: undefined,
      own_tel: phone,
      own_contract_type: undefined,
      own_name: username,
      contract_status: 0,
      content_type: undefined,
      content_type_other: undefined,
    });
    const formRules = ref({
      approval_department_id: [
        { required: true, message: '请选择合同所属部门', trigger: ['change'] },
      ],
      cooperation_gather_date: [
        { required: true, message: '请输入直播日期（暂定）', trigger: 'blur' },
      ],
      cooperation_work_name: [
        { required: true, message: '请输入产品服务/服务名称', trigger: 'blur' },
      ],
      cooperation_shop_name: [
        { required: true, message: '请输入店铺名称', trigger: ['blur', 'change'] },
      ],
      cooperation_link_count: [
        { required: true, message: '请输入链接数量', trigger: ['blur', 'change'] },
      ],
      cooperation_zhubo_name: [
        { required: true, message: '请输入主播名称', trigger: ['blur', 'change'] },
      ],
      cooperation_live_way: [{ required: true, message: '请选择直播形式', trigger: 'change' }],
      cooperation_work_platform: [{ required: true, message: '请选择直播平台', trigger: 'change' }],
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
      ],
      payee_paymoney_type: [
        { required: true, message: '请选择付款方式', trigger: 'change' },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (form.value.payee_paymoney_type === 3) {
              if (!form.value.payee_paymoney_type_link) {
                callback(new Error('请输入V任务链接'));
              } else {
                callback();
              }
            } else if (form.value.payee_paymoney_type === 4) {
              if (!form.value.payee_paymoney_type_other) {
                callback(new Error('请输入其它'));
              } else {
                callback();
              }
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      payee_request_opencard_type: [
        { required: true, message: '请选择开票要求', trigger: 'change' },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (form.value.payee_request_opencard_type === 1) {
              if (!form.value.payee_request_opencard_shuilv) {
                callback(new Error('请输入专票税率'));
              } else {
                callback();
              }
            } else if (form.value.payee_request_opencard_type === 2) {
              if (!form.value.payee_request_opencard_default_shuilv) {
                callback(new Error('请输入普票税率'));
              } else {
                callback();
              }
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      payee_request_card_type: [{ required: true, message: '请选择票款要求', trigger: 'change' }],
      content_type: [{ required: true, message: '请选择开票内容', trigger: 'change' }],
      content_type_other: [
        { required: true, message: '请输入开票内容', trigger: ['blur', 'change'] },
      ],
      payee_request_type: [{ required: true, message: '请选择付款要求', trigger: 'change' }],
      payee_execute_type: [{ required: true, message: '请选择执行要求', trigger: 'change' }],
      payee_ROI_type: [{ required: true, message: '请选择ROI要求', trigger: 'change' }],
      payee_type: [
        { required: true, message: '请选择收费类型', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (form.value.payee_type_other === true && !form.value.payee_remarkstr) {
              callback(new Error('请输入其它'));
            } else if (value === 1) {
              if (!form.value.payee_money) {
                callback(new Error('请输入固定服务费'));
              } else {
                callback();
              }
            } else if (value === 2) {
              if (!form.value.payee_money_two) {
                callback(new Error('请输入服务费、主播佣金'));
              } else if (!form.value.payee_yongjinlv_two) {
                callback(new Error('请输入服务费、主播佣金'));
              } else {
                callback();
              }
            } else if (value === 3) {
              if (!form.value.payee_yongjinlv_four) {
                callback(new Error('请输入主播佣金'));
              } else {
                callback();
              }
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      cooperation_zhubo_real_last_time: [
        { required: true, message: '请选择最后一期款项付款时间', trigger: 'change' },
      ],
      cooperation_zhubo_real_start_time: [
        { required: true, message: '请选择合同有效期', trigger: 'change' },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (form.value.cooperation_contract_long_type) {
              callback();
            } else if (!form.value.cooperation_zhubo_real_end_time) {
              callback(new Error('请选择合同有效期'));
            } else {
              callback();
            }
          },
          trigger: ['blur'],
        },
      ],
      cooperation_link_contract_id: [
        { required: true, message: '请输入关联主合同编号', trigger: ['blur', 'change'] },
      ],
      gonyingshang_name: [
        { required: true, message: '请选择供应商名称', trigger: ['blur', 'change'] },
      ],
      own_name: [{ required: true, message: '请输入联系人花名', trigger: ['blur', 'change'] }],
      own_tel: [{ required: true, message: '请输入联系人电话', trigger: ['blur', 'change'] }],
      business_types: [{ required: true, message: '请选择签约主体', trigger: 'change' }],
      cooperation_contract_type: [{ required: true, message: '请选择签约类型', trigger: 'change' }],
      own_contract_type: [{ required: true, message: '请选择签约主体', trigger: 'change' }],
      priority: [{ required: true, message: '请输入显示顺序', trigger: ['blur', 'change'] }],
      status: [{ required: true, message: '请选择模板状态', trigger: 'change' }],
      proceeds_plan: [],
    });
    const { project_id } = useProjectBaseInfo();
    const business_type = ref(useProjectBaseInfo().business_type.value);
    const isUnableClick = ref(true);
    const frame_contract_uid = ref(undefined);
    const pay_ROI_type_rule: any = [
      { required: true, message: '请选择ROI要求', trigger: 'change' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (form.value.payee_ROI_type === 2) {
            if (!form.value.payee_ROI_request_fw) {
              callback(new Error('请输入服务费'));
            } else if (!form.value.payee_ROI_request_xs) {
              callback(new Error('请输入保量销售额'));
            } else {
              callback();
            }
          } else {
            callback();
          }
        },
        trigger: ['blur'],
      },
    ];
    const pay_ROI_no_type_rule: any = [
      { required: false, message: '请选择ROI要求', trigger: 'change' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (form.value.payee_ROI_type === 2) {
            if (!form.value.payee_ROI_request_fw) {
              callback(new Error('请输入服务费'));
            } else if (!form.value.payee_ROI_request_xs) {
              callback(new Error('请输入保量销售额'));
            } else {
              callback();
            }
          } else {
            callback();
          }
        },
        trigger: ['blur'],
      },
    ];
    watch(
      () => {
        return form;
      },
      form => {
        if (form.value.contract_status === 1) {
          formRules.value.payee_ROI_type = pay_ROI_type_rule;
          formRules.value.file_url_list = [
            { required: false, message: '请上传合同文本及附件', trigger: ['blur', 'change'] },
          ];
        } else {
          formRules.value.payee_ROI_type = pay_ROI_no_type_rule;
          formRules.value.file_url_list = [
            { required: true, message: '请上传合同文本及附件', trigger: ['blur', 'change'] },
          ];
        }
        const formValue = form.value;
        if (
          formValue.cooperation_zhubo_real_start_time &&
          frame_contract_uid.value &&
          formValue.own_contract_type
        ) {
          isUnableClick.value = false;
        } else {
          isUnableClick.value = true;
        }
        if (formValue.cooperation_contract_long_type) {
          formValue.cooperation_zhubo_real_end_time = '';
        }
        if (formValue.payee_type_other) {
          if (formValue.payee_type === undefined) {
            formValue.payee_type = 4;
          }
        } else {
          if (formValue.payee_type === 4) {
            formValue.payee_type = undefined;
          }
        }
        if (
          (formValue.payee_type === 1 && formValue.payee_money) ||
          (formValue.payee_type === 2 &&
            formValue.payee_money_two &&
            formValue.payee_yongjinlv_two) ||
          (formValue.payee_type === 3 && formValue.payee_yongjinlv_four) ||
          (formValue.payee_type_other && formValue.payee_remarkstr)
        ) {
          setTimeout(() => {
            formRef.value?.clearValidate('payee_type');
          }, 10);
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => {
        return form.value.contract_xieyi_yifang_type;
      },
      contract_xieyi_yifang_type => {
        if (contract_xieyi_yifang_type === true) {
          form.value.contract_xieyi_yuangao_type = false;
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => {
        return form.value.contract_xieyi_yuangao_type;
      },
      contract_xieyi_yuangao_type => {
        if (contract_xieyi_yuangao_type === true) {
          form.value.contract_xieyi_yifang_type = false;
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => {
        return frame_contract_uid;
      },
      () => {
        const formValue = form.value;
        if (
          formValue.cooperation_zhubo_real_start_time &&
          frame_contract_uid.value &&
          formValue.own_contract_type
        ) {
          isUnableClick.value = false;
        } else {
          isUnableClick.value = true;
        }
      },
      {
        deep: true,
      },
    );

    watch(
      () => {
        return form.value.contract_status;
      },
      () => {
        clearValidate();
      },
      {
        deep: true,
      },
    );
    const contractInfoRecords = ref([]);
    const gotoAddCompany = () => {
      ctx.root.$router.push({
        name: RouterNameSupplier.manage,
      });
    };

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
    /** 所有供应商 */
    const allSupplierName = ref<any>([]);
    // 选择具体供应商
    const onSupplierIdChange = (id: string) => {
      const id_str: any = id;
      frame_contract_uid.value = id_str;
    };
    // 搜索获取供应商列表
    const getAllSupplierName = async (keyword: string) => {
      const { data: response } = await getPartnerList({
        partner_type: 2,
        verify_status: 1,
        partner_name: keyword,
      });
      allSupplierName.value = response.success ? response.data : [];
    };
    const ownInfoRecords = [
      { value: 1, label: '构美（浙江）信息科技有限公司' },
      { value: 2, label: '杭州煜丰电子商务有限公司' },
      { value: 3, label: '构美（浙江）信息科技有限公司上海分公司' },
      { value: 4, label: '杭州构茂科技有限公司' },
      { value: 5, label: '杭州构美星耀科技有限公司' },
      { value: 6, label: '杭州莱茂信息科技有限公司' },
    ];
    const pingtaiRecords = [
      { value: 1, label: '抖音' },
      { value: 2, label: '淘宝' },
      { value: 3, label: '快手' },
      { value: 4, label: '小红书' },
    ];
    const liveWayRecords = [
      { value: 1, label: '混场' },
      { value: 2, label: '专场' },
    ];
    const qianyueRecord = [
      { value: 1, label: '单次合同' },
      { value: 2, label: '框架合同' },
      { value: 4, label: '补充协议' },
      { value: 0, label: '续签合同' },
      { value: 6, label: '解除协议' },
    ];
    const stampRecord = [
      { value: 1, label: '公章' },
      { value: 2, label: '合同专用章' },
    ];
    /** 店播项目 */
    const project_type = ref(ProjectTypeEnum.live);
    const breadcrumb = useBreadcrumb();
    if (
      breadcrumb.isCommonBusinessDetail ||
      breadcrumb.isCommonBusinessCustomerContractDetail ||
      breadcrumb.isCommonBusinessSupplierContractDetail
    ) {
      /** 通用业务类型 */
      project_type.value = ProjectTypeEnum.common_business;
    } else if (breadcrumb.isLiveDetail) {
      project_type.value = ProjectTypeEnum.live;
      form.value.contract_status = 0;
    } else if (breadcrumb.isCoopDetail) {
      project_type.value = ProjectTypeEnum.marketing;
    } else if (breadcrumb.isSupplyChainDetail) {
      project_type.value = ProjectTypeEnum.supply_chain;
    } else if (breadcrumb.isLocalLifeDetail) {
      project_type.value = ProjectTypeEnum.local_life;
    }
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
      if (formValue.contract_status === 1) {
        if (
          !formValue.cooperation_work_time &&
          !formValue.cooperation_work_day &&
          !formValue.cooperation_work_video_time &&
          !formValue.cooperation_work_other
        ) {
          ctx.root.$message.warning('讲解时长、平台信息流授权、种草视频时长、其它权益4选1必填。');
          return false;
        }
        if (!formValue.live_day_pre || !formValue.live_day_later || !formValue.refund_day) {
          ctx.root.$message.warning('请将条款填写全');
          return false;
        }
        if (
          (formValue.payee_yongjinlv_three > 0 && formValue.payee_type === 3) ||
          (formValue.payee_yongjinlv_one > 0 && formValue.payee_type === 2)
        ) {
          if (!formValue.live_line_day_later) {
            ctx.root.$message.warning('请将条款填写全');
            return false;
          }
        }
        if (
          formValue.contract_xieyi_yuangao_type === false &&
          formValue.contract_xieyi_yifang_type === false
        ) {
          ctx.root.$message.warning('请将条款填写全');
          return false;
        }
      }
      if (form.value.cashdeposit_need_type) {
        if (
          !form.value.cashdeposit_need_date ||
          !form.value.cashdeposit_need_money ||
          !form.value.cashdeposit_need_day
        ) {
          ctx.root.$message.warning('请完善保证金信息');
          return false;
        }
      }
      const result = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!contract_id.value && !contract_uid.value) {
        if (project_type.value === 2) {
          getMarketContractNumber();
        } else {
          getContractNumber();
        }
        ctx.root.$message.warning('正在获取合同编码，请稍等重新提交');
        return false;
      }
      if (result) {
        //有效期判断
        if (!formValue.cooperation_contract_long_type) {
          const startTime = new Date(form.value.cooperation_zhubo_real_start_time);
          const endTime = new Date(form.value.cooperation_zhubo_real_end_time);
          if (endTime < startTime) {
            ctx.root.$message.warning('合同有效期结束时间不得小于开始时间');
            return false;
          }
        }
        const our_info = [
          {
            key: '签约主体',
            value: ownInfoRecords[formValue.own_contract_type - 1].label,
          },
          {
            key: '联系人花名',
            value: formValue.own_name,
          },
          {
            key: '电话',
            value: formValue.own_tel,
          },
          {
            key: '合同所属部门',
            value: formValue.approval_department_id,
          },
        ];
        let cooperation_content: any = [];
        if (formValue.contract_status === 1) {
          cooperation_content = [
            {
              key: '直播平台',
              value: formValue.cooperation_work_platform
                ? pingtaiRecords[formValue.cooperation_work_platform - 1].label
                : undefined,
            },
            {
              key: '直播形式',
              value: formValue.cooperation_live_way
                ? liveWayRecords[formValue.cooperation_live_way - 1].label
                : undefined,
            },
            {
              key: '主播名称',
              value: formValue.cooperation_zhubo_name,
            },
            {
              key: '链接数量',
              value: formValue.cooperation_link_count,
            },
            {
              key: '店铺名称',
              value: formValue.cooperation_shop_name,
            },
            {
              key: '产品服务/服务名称',
              value: formValue.cooperation_work_name,
            },
            {
              key: '直播日期',
              value: formValue.cooperation_gather_date,
            },
            {
              key: '讲解时长',
              value: formValue.cooperation_work_time,
            },
            {
              key: '授权天数',
              value: formValue.cooperation_work_day,
            },
            {
              key: '种草视频时长',
              value: formValue.cooperation_work_video_time,
            },
            {
              key: '其它权益',
              value: formValue.cooperation_work_other,
            },
          ];
        }
        let timestr = formValue.cooperation_zhubo_real_start_time;
        if (formValue.cooperation_contract_long_type) {
          timestr = timestr + '/长期有效';
        } else {
          timestr = timestr + '/' + formValue.cooperation_zhubo_real_end_time;
        }
        const cooperation_duration = [
          {
            key: '签约类型',
            value: qianyueRecord.find(item => item.value === formValue.cooperation_contract_type)
              ? qianyueRecord.find(item => item.value === formValue.cooperation_contract_type)
                  ?.label
              : '',
          },
          {
            key: formValue.cooperation_contract_type === 0 ? '关联原合同' : '关联主合同',
            value:
              formValue.cooperation_contract_type >= 4 || formValue.cooperation_contract_type === 0
                ? formValue.cooperation_link_contract_id
                : undefined,
          },
          {
            key: '合同有效期',
            value: timestr,
          },
          {
            key: '最后一期款项付款时间',
            value: formValue.cooperation_zhubo_real_last_time,
          },
        ];
        let pay_condition = [
          {
            key: '收费类型',
            value:
              formValue.payee_type === 1
                ? '固定服务费'
                : formValue.payee_type === 2
                ? '固定服务费+佣金'
                : formValue.payee_type === 3
                ? '纯佣金'
                : '',
          },
          {
            key: '收费类型-其它',
            value: formValue.payee_type_other ? 1 : 0,
          },
          {
            key: '固定服务费',
            value:
              formValue.payee_type === 1
                ? formValue.payee_money
                : formValue.payee_type === 2
                ? formValue.payee_money_two
                : undefined,
          },
          {
            key: '构美佣金',
            value:
              formValue.payee_type === 3
                ? formValue.payee_yongjinlv_three || 0
                : formValue.payee_type === 2
                ? formValue.payee_yongjinlv_one || 0
                : undefined,
          },
          {
            key: '主播佣金',
            value:
              formValue.payee_type === 3
                ? formValue.payee_yongjinlv_four
                : formValue.payee_type === 2
                ? formValue.payee_yongjinlv_two
                : undefined,
          },
          {
            key: '其它',
            value: formValue.payee_type_other ? formValue.payee_remarkstr : undefined,
          },
          {
            key: 'ROI要求',
            value:
              formValue.payee_ROI_type === 1
                ? '不保量'
                : formValue.payee_ROI_type === 2
                ? '保量'
                : '',
          },
          {
            key: 'ROI要求保量-服务费',
            value: formValue.payee_ROI_type === 2 ? formValue.payee_ROI_request_fw : undefined,
          },
          {
            key: 'ROI要求保量-保量销售额',
            value: formValue.payee_ROI_type === 2 ? formValue.payee_ROI_request_xs : undefined,
          },
          {
            key: '执行要求',
            value: formValue.payee_execute_type === 1 ? '先执行后付款' : '先付款后执行',
          },
          {
            key: '付款要求',
            value: formValue.payee_request_type === 1 ? '分期付款' : '一次性付款',
          },
          {
            key: '票款要求',
            value: formValue.payee_request_card_type === 1 ? '先票后款' : '先款后票',
          },
          {
            key: '开票要求',
            value:
              formValue.payee_request_opencard_type === 1
                ? '专票'
                : formValue.payee_request_opencard_type === 2
                ? '普票'
                : '不开票',
          },
          {
            key: '开票税率',
            value:
              formValue.payee_request_opencard_type === 1
                ? formValue.payee_request_opencard_shuilv
                : formValue.payee_request_opencard_type === 2
                ? formValue.payee_request_opencard_default_shuilv
                : undefined,
          },
        ];
        if (formValue.contract_status === 1) {
          pay_condition = pay_condition.concat(
            {
              key: '付款方式',
              value:
                formValue.payee_paymoney_type === 1
                  ? '对公账户转账'
                  : formValue.payee_paymoney_type === 2
                  ? '支付宝转账'
                  : formValue.payee_paymoney_type === 3
                  ? 'V任务下单'
                  : '其它',
            },
            {
              key: 'V任务下单',
              value:
                formValue.payee_paymoney_type === 3
                  ? formValue.payee_paymoney_type_link
                  : undefined,
            },
            {
              key: '付款方式-其它',
              value:
                formValue.payee_paymoney_type === 4
                  ? formValue.payee_paymoney_type_other
                  : undefined,
            },
          );
        }
        const margin = [
          {
            key: '是否有保证金',
            value: formValue.cashdeposit_need_type === 1 ? 1 : 0,
          },
          {
            key: '支付日期',
            value:
              formValue.cashdeposit_need_type === 1 ? formValue.cashdeposit_need_date : undefined,
          },
          {
            key: '保证金金额',
            value:
              formValue.cashdeposit_need_type === 1 ? formValue.cashdeposit_need_money : undefined,
          },
          {
            key: '直播结束后退还日期',
            value:
              formValue.cashdeposit_need_type === 1 ? formValue.cashdeposit_need_day : undefined,
          },
        ];
        let others = [
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
          {
            key: '邮寄信息',
            value:
              formValue.other_stamp_send_type === 1
                ? formValue.other_stamp_send_address
                : undefined,
          },
        ];
        if (formValue.contract_status === 1) {
          others = others.concat(
            {
              key: '签订日期',
              value: formValue.live_day_pre,
            },
            {
              key: '直播结束日期',
              value: formValue.live_day_later,
            },
            {
              key: '退款日期',
              value: formValue.refund_day,
            },
            {
              key: '线下结算日期',
              value:
                (formValue.payee_yongjinlv_three > 0 && formValue.payee_type === 3) ||
                (formValue.payee_yongjinlv_one > 0 && formValue.payee_type === 2)
                  ? formValue.live_line_day_later
                  : undefined,
            },
            {
              key: '诉讼方',
              value: formValue.contract_xieyi_yifang_type ? '甲方' : '原告',
            },
          );
        }
        // contract_type: project_type.value === 1 ? undefined : formValue.contract_status,
        const payload: any = {
          contract_id: contract_id.value,
          project_id: my_project_id.value || project_id.value,
          contract_uid: contract_uid.value,
          contract_type: Number(formValue.contract_status),
          our_info: our_info,
          cooperation_duration: cooperation_duration,
          cooperation_content: cooperation_content,
          pay_condition: pay_condition,
          margin: margin,
          others: others,
          supplier_id: frame_contract_uid.value,
          attachment_urls: file_url_list.value,
          remark: formValue.other_remark,
          content_type_other:
            form.payee_request_opencard_type !== 3 ? formValue.content_type_other : undefined,
          frontend_data: {
            ...formValue,
            myproject_type: project_type.value,
            mybusiness_type: business_type.value,
            my_project_id: my_project_id.value || project_id.value,
            content_type_other:
              form.payee_request_opencard_type !== 3 ? formValue.content_type_other : undefined,
          },
        };
        // startLoading();
        saveLoading.value = true;
        if (btntype === 1) {
          const typestr =
            project_type.value === 3
              ? 'common'
              : project_type.value === 2
              ? 'coop'
              : project_type.value === 4
              ? 'local_life'
              : project_type.value === 5
              ? 'supply_chain'
              : 'shop_live';
          const { data: response } = await PostTemplateProjectContractDetail(payload, typestr);
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
            contract_agreement_type: 'supplier',
            contract_uid: contract_uid.value,
            dataset: {
              project_id: my_project_id.value || project_id.value,
              contract_uid: contract_uid.value,
              contract_type: Number(formValue.contract_status),
              our_info: our_info,
              cooperation_duration: cooperation_duration,
              cooperation_content: cooperation_content,
              pay_condition: pay_condition,
              margin: margin,
              others: others,
              supplier_id: frame_contract_uid.value,
              attachment_urls: file_url_list.value,
              remark: formValue.other_remark,
            },
          };
          const { data: response } = await PostPreviewTemplateContractDetail(postData);
          // closeLoading();
          saveLoading.value = false;
          if (response.success) {
            const file_data: any = response.data;
            const url: string = file_data.file_url;
            const ttime: any = new Date().getTime();
            if (btntype === 2) {
              window.open(url + '?Authorization=' + myToken + '&t=' + ttime);
            } else {
              downClick(url + '?Authorization=' + myToken + '&t=' + ttime);
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
    const tabscontract_statusChange = (item: any) => {
      form.value.contract_status = item;
    };
    const tabsROIChange = (item: any) => {
      if (form.value.payee_ROI_type === item) {
        if (form.value.contract_status === 0) {
          form.value.payee_ROI_type = undefined;
        }
      } else {
        form.value.payee_ROI_type = item;
      }
    };
    const noChange = () => {};
    // 获取合同编号
    const getContractNumber = async () => {
      Promise.resolve()
        .then(() => {
          return getContractShopUid({
            business_type: business_type.value,
          });
        })
        .then(res => {
          if (res.data.success) {
            contract_uid.value = res.data.data;
          } else {
            ctx.root.$message.error(res.data.message);
          }
        })
        .catch(() => {
          ctx.root.$message.error('合同编号获取失败，稍后重试');
        });
    };
    // 获取合同编号
    const getMarketContractNumber = async () => {
      getContractUid()
        .then(res => {
          if (res.data.success) {
            contract_uid.value = res.data.data;
          } else {
            ctx.root.$message.error(res.data.message);
          }
        })
        .catch(() => {
          ctx.root.$message.error('合同编号获取失败，稍后重试');
        });
    };
    const departmentDefaultExpandedKeys = ref<number[]>([]);
    const levelDisabled = (level: number) => {
      return level === 1;
    };

    return {
      invoiceFiledImage,
      departmentDefaultExpandedKeys,
      noChange,
      checked2: true,
      getContractNumber,
      getMarketContractNumber,
      clearValidate,
      clearValidateUpload,
      username,
      phone,
      refresh,
      saveLoading,
      my_project_id,
      no_upload_click,
      visible,
      project_id,
      contract_id,
      tabscontract_statusChange,
      tabsShoufeiChange,
      tabsROIChange,
      downClick,
      myToken,
      contract_uid,
      project_type,
      pingtaiRecords,
      liveWayRecords,
      onSaveBtnClick,
      formRef,
      allSupplierName,
      getAllSupplierName,
      onSupplierIdChange,
      file_url_list,
      startLoading,
      closeLoading,
      ownInfoRecords,
      qianyueRecord,
      baozhengjinrecord: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
      ],
      stampRecord,
      gotoAddCompany,
      frame_contract_uid,
      contractInfoRecords,
      formRules,
      form,
      isUnableClick,
      business_type,
      contract_id_list,
      levelDisabled,
      bailingOutContent: E.supplier.BailingOutContentOption,
    };
  },
  methods: {
    getfixIntPositiveNumber(value: any, key: any) {
      if (
        key === 'payee_request_opencard_shuilv' ||
        key === 'payee_request_opencard_default_shuilv'
      ) {
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
        if (key !== 'payee_ROI_request_fw' && key !== 'payee_ROI_request_xs') {
          value = value.replace(/[^\d]+/gu, '');
          value = getPositiveNumber(value);
          this.form[key] = getPositiveNumber(value);
          return;
        }
        this.form[key] = inputLimit.EightIntergerAndDecimals(value);
      }
    },
    getfixPositiveNumber(value: any, key: any) {
      value = getPositiveNumber(value);
      if (value > 100000000) {
        const arr = String(this.form[key]).split('');
        arr.pop();
        this.form[key] = arr.join('');
        this.form[key] = getPositiveNumber(this.form[key]);
      } else {
        this.form[key] = getPositiveNumber(value);
      }
    },
    getfixIsBaiPositiveNumber(value: any, key: any) {
      value = getPositiveNumber(value);
      if (value > 100) {
        const arr = String(this.form[key]).split('');
        arr.pop();
        this.form[key] = arr.join('');
        this.form[key] = getPositiveNumber(this.form[key]);
      } else {
        this.form[key] = getPositiveNumber(value);
        if (
          (key === 'payee_yongjinlv_one' && this.form['payee_yongjinlv_two']) ||
          (key === 'payee_yongjinlv_two' && this.form['payee_yongjinlv_one'])
        ) {
          if (
            Number(this.form['payee_yongjinlv_one']) + Number(this.form['payee_yongjinlv_two']) >
            100
          ) {
            const arr = String(this.form[key]).split('');
            arr.pop();
            this.form[key] = arr.join('');
            this.form[key] = getPositiveNumber(this.form[key]);
          }
        }
        if (
          (key === 'payee_yongjinlv_three' && this.form['payee_yongjinlv_four']) ||
          (key === 'payee_yongjinlv_four' && this.form['payee_yongjinlv_three'])
        ) {
          if (
            Number(this.form['payee_yongjinlv_three']) + Number(this.form['payee_yongjinlv_four']) >
            100
          ) {
            const arr = String(this.form[key]).split('');
            arr.pop();
            this.form[key] = arr.join('');
            this.form[key] = getPositiveNumber(this.form[key]);
            return;
          }
        }
      }
    },
    blurIsZoreNumber(value: any, key: any) {
      // if (this.form[key] === 0 || this.form[key] === '0') {
      //   this.form[key] = undefined;
      // } else {
      const arr = String(this.form[key]).split('');
      if (arr.length > 0 && arr[arr.length - 1] === '.') {
        arr.pop();
        this.form[key] = arr.join('');
      }
      if (arr.length > 0 && arr[0] === '.') {
        this.form[key] = undefined;
      }
      // }
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
    // 关联供应商合同输入值获取
    getContract(val: any) {
      const project_type: any = this.project_type || '';
      getCostContractUid({
        partner_type: 2,
        contract_status: 2,
        release_status: 0,
        search: val,
        only_main: this.form.cooperation_contract_type !== 0,
        project_type: project_type,
      }).then(({ data }) => {
        this.contract_id_list = data.data.data;
      });
    },
    // 选择关联框架合同
    selectContractUidChange(val: any) {
      this.form.cooperation_link_contract_id = val;
    },
    // 提供给父组件使用，勿删
    show(item: any) {
      this.form = {
        approval_department_id: undefined,
        cooperation_live_way: undefined,
        payee_remarkstr: undefined,
        live_start_day_pre: undefined,
        live_line_day_later: undefined,
        refund_day: undefined,
        live_day_later: undefined,
        live_day_pre: undefined,
        contract_xieyi_yuangao_type: false,
        contract_xieyi_yifang_type: false,
        payee_money_two: undefined,
        payee_yongjinlv_two: undefined,
        file_url_list: undefined,
        other_remark: undefined,
        other_stamp_send_address: undefined,
        other_stamp_send_type: undefined,
        other_stamp_time: undefined,
        other_stamp_type: undefined,
        other_stamp_count: undefined,
        cashdeposit_need_day: undefined,
        cashdeposit_need_money: undefined,
        cashdeposit_need_date: undefined,
        cashdeposit_need_type: 0,
        payee_paymoney_type_other: undefined,
        payee_paymoney_type_link: undefined,
        payee_paymoney_type: undefined,
        payee_request_opencard_default_shuilv: undefined,
        payee_request_opencard_shuilv: undefined,
        payee_request_opencard_type: undefined,
        payee_request_card_type: undefined,
        payee_request_type: undefined,
        payee_execute_type: undefined,
        payee_ROI_request_fw: undefined,
        payee_ROI_request_xs: undefined,
        payee_ROI_request: undefined,
        payee_ROI_type: undefined,
        payee_other: undefined,
        payee_yongjinlv: undefined,
        payee_money: undefined,
        payee_type: undefined,
        payee_type_other: undefined,
        cooperation_zhubo_real_last_time: undefined,
        cooperation_contract_long_type: undefined,
        cooperation_zhubo_real_end_time: undefined,
        cooperation_zhubo_real_start_time: undefined,
        cooperation_zhubo_real_time: undefined,
        cooperation_link_contract_id: undefined,
        cooperation_contract_type: undefined,
        cooperation_work_other: undefined,
        cooperation_work_video_time: undefined,
        cooperation_work_video: undefined,
        cooperation_work_day: undefined,
        cooperation_work_platform: undefined,
        cooperation_gather_date: undefined,
        cooperation_work_time: undefined,
        cooperation_work_name: undefined,
        cooperation_shop_name: undefined,
        cooperation_link_count: undefined,
        cooperation_zhubo_name: undefined,
        own_contract_type: undefined,
        own_tel: this.phone,
        own_name: this.username,
        contract_status: 0,
        content_type: undefined,
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
            } else if (key === 'owncontracttype') {
              const find = (item.cooperation_duration || []).find(
                (item: { key: string; value: string }) => item.key === '签约类型',
              );
              if (find.value === '长期合作') {
                this.form.own_contract_type = 2;
              } else if (find.value === '从合同') {
                this.form.own_contract_type = 4;
              } else {
                this.form.own_contract_type = form[key];
              }
            } else {
              this.form[key] = form[key];
            }
          }
        }
        this.departmentDefaultExpandedKeys = this.form.approval_department_id
          ? [this.form.approval_department_id]
          : [];
        this.contract_id = item.contract_detail.contract_id;
        this.contract_uid = item.template_info.contract_uid;
        if (!this.form.contract_status) {
          this.form.contract_status = 0;
        }
        this.frame_contract_uid = item.template_info.supplier_id || item.contract_info.company_id;
        this.file_url_list =
          item.template_info.frontend_data.file_url_list ||
          item.template_info.frontend_data.filelisturl ||
          [];
        this.form.file_url_list = this.file_url_list;
        this.my_project_id =
          item.contract_info.project_id || item.template_info.frontend_data.my_project_id;
        this.business_type =
          item.contract_info.business_type || item.template_info.frontend_data.mybusiness_type;
        if (item.template_info.frontend_data.myproject_type) {
          this.project_type = item.template_info.frontend_data.myproject_type;
        }
        this.getAllSupplierName(item.contract_info.company_name || '');
      } else {
        this.file_url_list = [];
        this.frame_contract_uid = undefined;
        this.isUnableClick = true;
        if (this.project_type === 1 || this.project_type === 4 || this.project_type === 5) {
          this.form.contract_status = 0;
        }
        if (this.project_type === 2) {
          this.getMarketContractNumber();
        } else {
          this.getContractNumber();
        }
      }
      this.no_upload_click = true;
      this.visible = true;
      this.$nextTick(() => {});
    },
    backClick() {
      if (this.frame_contract_uid || this.form.own_contract_type) {
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
