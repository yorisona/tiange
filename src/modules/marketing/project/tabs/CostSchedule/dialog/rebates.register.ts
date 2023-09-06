/*
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 返点登记
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-24 13:57:15
 */

import { defineComponent, inject, ref, Ref, watch, PropType } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ElUpload } from 'element-ui/types/upload';
import { getToken } from '@/utils/token';
import { queryArchievement, saveRebateCost, UploadFile } from '@/services/marketing.project';
import { MarketingProjectDetail, RebateParams } from '@/types/tiange/marketing/project';
import { format } from '@/utils/time';
import Upp from '@/components/Uploader/uploader';

const currentDate = () => {
  const current = new Date();
  return format(current, 'YYYY-mm-dd');
};

const formInitData = () => {
  return {
    //** 修改时必传 */
    cost_id: undefined,
    //** 合作id */
    cooperation_id: undefined,
    //** 业绩编号 */
    achievement_uid: undefined,
    //** 返点金额 */
    pay_amount: undefined,
    //** 银行卡号 */
    bank_card_num: undefined,
    //** 开户行 */
    bank_name: undefined,
    //** 真实姓名 */
    real_name: undefined,
    //** 身份证号 */
    id_number: undefined,
    //** 用款日期 */
    transfer_date: currentDate(),
    //** 身份证照片url */
    id_card_pic: undefined,
    //** 银行卡照片url */
    bank_card_pic: undefined,
    //** 电话号码 */
    phone: undefined,
  };
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    editRebate: {
      type: Object as PropType<RebateParams>,
    },
  },
  components: {
    Upp,
  },
  setup(props, ctx) {
    const project =
      inject<Ref<MarketingProjectDetail>>('MarketingProject') ?? ref<MarketingProjectDetail>();
    const achievementList = ref([]);
    const form = ref<RebateParams>(formInitData());

    const arch_amount = ref<string | undefined>(undefined);
    const ruleForm = ref<ElForm | undefined>(undefined);
    const id_card_pic_upload = ref<ElUpload | undefined>(undefined);
    const bank_card_pic_upload = ref<ElUpload | undefined>(undefined);

    const hiddenBankUpload = ref<boolean>(false);
    const hiddenIdUpload = ref<boolean>(false);

    const saveLoading = ref<boolean>(false);

    const idFileList = ref<any>([]);
    const bankFileList = ref<any>([]);

    // 校验规则
    const formRules = ref({
      achievement_uid: { required: true, message: '请选择关联业绩', trigger: ['change', 'blur'] },
      pay_amount: { required: true, message: '请输入返点金额', trigger: 'blur' },
      bank_card_num: { required: true, message: '请输入银行卡号', trigger: 'blur' },
      id_number: { required: true, message: '请输入正确身份证号', trigger: 'blur' },
      bank_name: { required: true, message: '请输入开户行', trigger: 'blur' },
      real_name: { required: true, message: '请输入真实姓名', trigger: ['blur'] },
    });

    watch([() => props.visible, () => props.editRebate], ([newVisiable, newEditRebate]) => {
      if (newVisiable) {
        // resetForm();
        // sendGetStudioListRequest();
        if (newEditRebate) {
          form.value = newEditRebate as RebateParams;
          // hiddenBankUpload.value = (form.value.bank_card_pic?.length ?? 0) > 0;
          // hiddenIdUpload.value = (form.value.id_card_pic?.length ?? 0) > 0;
          // const tokenStr = `Authorization=${getToken()}`;
          // if ((form.value.bank_card_pic?.length ?? 0) > 0) {
          //   bankFileList.value = [
          //     {
          //       url: `${form.value.bank_card_pic}?${tokenStr}`,
          //     },
          //   ];
          // }
          // if ((form.value.id_card_pic?.length ?? 0) > 0) {
          //   idFileList.value = [
          //     {
          //       url: `${form.value.id_card_pic}?${tokenStr}`,
          //     },
          //   ];
          // }
        }
        getAchievement(project.value?.cooperation_id, form.value.achievement_uid);
      } else {
        resetForm();
      }
    });

    const achievementChanged = (val: string | undefined) => {
      const fil = achievementList.value.filter((item: any) => {
        return item.achievement_uid === val;
      });
      if (fil && fil.length > 0) {
        arch_amount.value = fil[0]['gather_amount_str'];
      } else {
        arch_amount.value = undefined;
      }
    };

    const close = () => {
      // props.visible = false
      ctx.emit('update:visible', false);
    };

    const save = () => {
      ruleForm.value?.validate(success => {
        if (success) {
          saveRebate();
        }
      });
    };

    const idCardPicRemoved = () => {
      form.value.id_card_pic = undefined;
      hiddenIdUpload.value = false;
    };
    const idCardPicUploaded = (response: any) => {
      form.value.id_card_pic = response.data.source;
    };

    const bankCardPicRemoved = () => {
      form.value.bank_card_pic = undefined;
      hiddenBankUpload.value = false;
    };
    const bankCardPicUploaded = (response: any) => {
      form.value.bank_card_pic = response.data.source;
    };
    const beforeUpload = (file: any) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        ctx.root.$message.error('上传图片大小不能超过 2MB!');
      }
      if (
        (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') ||
        file.name.endsWith('.jfif.jpg') ||
        file.name.endsWith('.jfif')
      ) {
        ctx.root.$message.error('文件格式不正确！');
        return false;
      }
      return isLt2M;
    };

    const dealIdImgChange = (file: any, fileList: any) => {
      hiddenIdUpload.value = fileList.length >= 1;
    };
    const dealBankImgChange = (file: any, fileList: any) => {
      hiddenBankUpload.value = fileList.length >= 1;
    };

    const moneyChange = (value: string | number, index: number) => {
      let tempValue = `${value}`;
      tempValue = tempValue.replace(/[^\d.]/g, '');
      tempValue = tempValue.replace(/\.{2,}/g, '.');
      tempValue = tempValue.replace(/^\./g, '0.');
      tempValue = tempValue.replace(/^\d*\.\d*\./g, tempValue.substring(0, tempValue.length - 1));
      tempValue = tempValue.replace(/^0[^.]+/g, '0');
      tempValue = tempValue.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');

      form.value.pay_amount = tempValue;
    };

    /** send request */
    const getAchievement = async (id: number | undefined, achievement: string | undefined) => {
      if (id) {
        const res = await queryArchievement(id);
        achievementList.value = res.data.data.data;
        if (achievement) {
          achievementChanged(achievement);
        }
      }
    };

    const saveRebate = async () => {
      form.value.cooperation_id = project.value?.cooperation_id;
      saveLoading.value = true;
      const res = await saveRebateCost(form.value);
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '保存返点成功');
        ctx.emit('update:visible', false);
        ctx.emit('save');
      } else {
        ctx.root.$message.error(res.data.message ?? '保存返点失败');
      }
    };

    // 附件上传
    const uploadIdCardFile = (value: { file: File; filename: string }) => {
      const res = uploadFile(value, 'rebate/id_card_pic', 0);
      return res;
    };
    const uploadBankFile = (value: { file: File; filename: string }) => {
      const res = uploadFile(value, 'rebate/bank_card_pic', 1);
      return res;
    };
    const uploadFile = async (
      value: { file: File; filename: string },
      type: string,
      flag: number,
    ) => {
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('type', type);

      const res = await UploadFile(formData);
      const { data: response } = res;
      if (response.success) {
        if (flag) {
          form.value.bank_card_pic = response.data.source;
        } else {
          form.value.id_card_pic = response.data.source;
        }
      } else {
        ctx.root.$message.error(response.message);
      }

      return res;
    };

    const onBankPicRemove = () => {
      form.value.id_card_pic = '';
    };
    const onIdCardPicRemove = () => {
      form.value.bank_card_pic = '';
    };

    const resetForm = () => {
      form.value = formInitData();
      arch_amount.value = undefined;
      achievementList.value = [];
      bank_card_pic_upload.value?.clearFiles();
      id_card_pic_upload.value?.clearFiles();
      hiddenBankUpload.value = false;
      hiddenIdUpload.value = false;
      idFileList.value = [];
      bankFileList.value = [];
      // ruleForm.value?.clearValidate()
      setTimeout(() => {
        ruleForm.value?.clearValidate();
      }, 100);
    };

    return {
      saveLoading,
      close,
      save,
      getToken,
      achievementList,
      achievementChanged,
      arch_amount,
      idCardPicRemoved,
      idCardPicUploaded,
      bankCardPicRemoved,
      bankCardPicUploaded,
      moneyChange,
      dealBankImgChange,
      dealIdImgChange,
      form,
      formRules,
      id_card_pic_upload,
      bank_card_pic_upload,
      ruleForm,
      project,
      hiddenBankUpload,
      hiddenIdUpload,
      idFileList,
      bankFileList,
      beforeUpload,
      uploadIdCardFile,
      uploadBankFile,
      onIdCardPicRemove,
      onBankPicRemove,
    };
  },
});
