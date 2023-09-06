/*
 * @Brief: 店铺代播-场次详情-直播留档 录入
 */
import { uploadFile } from '@/api/cooperative';
import { DisplayLiveDataForm, LiveDisplay, LiveDisplayDetail } from '@/types/tiange/live';
import { getToken } from '@/utils/token';
import { defineComponent, PropType, ref, Ref, watch, inject, computed } from '@vue/composition-api';
import { HttpRequestOptions } from 'element-ui/types/upload';
import lodash from '@/utils/lodash/custom';
import { UpdateShopLiveRecordDataService } from '@/services/live';
import { ValidateCallback } from '@/types/vendor/form';
import { ElForm } from 'element-ui/types/form';
import { format as DateTimeFormat } from '@/utils/time';
import { REG_RMEOVE_NON_DIGITAL } from '@/const/regexp';
import moment from 'moment';
import { ShopLiveRecordDataForm } from '@/types/tiange/live';
import Decimal from 'decimal.js';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const { debounce } = lodash;

/** 时间差计算 */
const calcDuration = (start_date_str: string, end_date_str: string) => {
  // const startDate = new Date(start_date_str);
  // const endDate = new Date(end_date_str);
  const startDate = moment(start_date_str).toDate();
  const endDate = moment(end_date_str).toDate();

  const diff = (endDate.getTime() - startDate.getTime()) / (3600 * 1000);
  const diffstr = new Decimal(diff.toString()).toFixed(1);

  return diffstr;
};

export default defineComponent({
  name: 'TgLiveDisplayDataInputDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    DisplayInfo: {
      type: Object as PropType<LiveDisplayDetail>,
      required: false,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const liveDisplay = inject<Ref<LiveDisplay>>('liveDisplay');

    const DateTimeField = ref({
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
    });

    const defaultDateTime = ref({
      real_start_time: '',
      real_end_time: '',
    });

    const DisplayDataForm = ref<DisplayLiveDataForm>({
      id: liveDisplay?.value.id ?? -1,
      real_start_time: defaultDateTime.value.real_start_time,

      /** 实际直播结束时间 */
      real_end_time: defaultDateTime.value.real_end_time,

      /** 实际直播时长 */
      real_duration: '',

      /** 直播链接 */
      live_url: '',

      /** 直播时长截图 */
      duration_screenshot: '',

      /** 直播数据截图 */
      data_screenshot: '',
    });

    const reloadDateTimePicker = () => {
      /** 开始时间 */
      if (props.DisplayInfo?.real_start_time) {
        DisplayDataForm.value.real_start_time = props.DisplayInfo?.real_start_time;

        // const startDateTimeStr = DateTimeFormat(
        //   new Date(parseInt(props.DisplayInfo.real_start_time, 10) * 1000),
        //   'YYYY-mm-dd HH:ii',
        // );
        const startDateTimeStr = DateTimeFormat(
          moment(parseInt(props.DisplayInfo.real_start_time, 10) * 1000).valueOf(),
          'YYYY-mm-dd HH:ii',
        );
        defaultDateTime.value.real_start_time = startDateTimeStr;

        const [start_date_str, start_time_str] = startDateTimeStr.split(' ');
        DateTimeField.value.start_date = start_date_str;
        DateTimeField.value.start_time = start_time_str;

        DisplayDataForm.value.real_start_time = start_date_str + ' ' + start_time_str;
      } else {
        /** 没有数据默认从 排期时间带入 */
        const live_start_time_str = liveDisplay?.value.live_start_time ?? '';
        if (live_start_time_str) {
          const [start_date_str, start_time_str] = live_start_time_str.split(' ');
          DateTimeField.value.start_date = start_date_str;
          DateTimeField.value.start_time = start_time_str;

          DisplayDataForm.value.real_start_time = live_start_time_str;
        }
      }

      /** 结束时间 */
      if (props.DisplayInfo?.real_end_time) {
        DisplayDataForm.value.real_end_time = props.DisplayInfo?.real_end_time;

        // const endDateTimeStr = DateTimeFormat(
        //   new Date(parseInt(props.DisplayInfo.real_end_time, 10) * 1000),
        //   'YYYY-mm-dd HH:ii',
        // );
        const endDateTimeStr = DateTimeFormat(
          moment(parseInt(props.DisplayInfo.real_end_time, 10) * 1000).valueOf(),
          'YYYY-mm-dd HH:ii',
        );
        defaultDateTime.value.real_end_time = endDateTimeStr;

        const [end_date_str, end_time_str] = endDateTimeStr.split(' ');
        DateTimeField.value.end_date = end_date_str;
        DateTimeField.value.end_time = end_time_str;

        DisplayDataForm.value.real_end_time = end_date_str + ' ' + end_time_str;
      } else {
        /** 没有数据默认从 排期时间带入 */
        const live_end_time_str = liveDisplay?.value.live_end_time ?? '';
        if (live_end_time_str) {
          const [end_date_str, end_time_str] = live_end_time_str.split(' ');
          DateTimeField.value.end_date = end_date_str;
          DateTimeField.value.end_time = end_time_str;

          DisplayDataForm.value.real_end_time = live_end_time_str;
        }
      }
      reloadDuration();
    };

    const reloadDuration = () => {
      /** 计算时长 */
      if (DisplayDataForm.value.real_start_time && DisplayDataForm.value.real_end_time) {
        DisplayDataForm.value.real_duration = calcDuration(
          DisplayDataForm.value.real_start_time,
          DisplayDataForm.value.real_end_time,
        );
      }
    };

    reloadDateTimePicker();

    const DisplayDataImageUrl = ref('');
    const DisplayTimeImageUrl = ref('');

    /** is valid url */
    const isValidUrl = (value: string) => {
      const Pattern =
        /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]*\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/;
      return Pattern.test(value);
    };

    const DisplayDataFormRules = ref({
      real_duration: [
        { required: true, message: '请输入直播时长', trigger: 'blur' },
        {
          validator: (_: any, value: number, callback: ValidateCallback) => {
            if (value <= 0) {
              callback(new Error('只能是正数'));
            } else {
              callback();
            }
          },
          trigger: 'change',
        },
      ],
      real_start_date: [{ required: true, message: '请输入直播开始时间', trigger: 'change' }],
      real_start_time: [{ required: true, message: '请输入直播开始时间', trigger: 'change' }],
      real_end_time: [{ required: true, message: '请输入直播结束时间', trigger: 'change' }],
    });

    /** 重置表单 */
    const resetForm = () => {
      DisplayDataForm.value.real_start_time = '';

      /** 实际直播结束时间 */
      DisplayDataForm.value.real_end_time = '';

      /** 实际直播时长 */
      DisplayDataForm.value.real_duration = '';

      /** 直播链接 */
      DisplayDataForm.value.live_url = '';

      /** 直播时长截图 */
      DisplayDataForm.value.duration_screenshot = '';

      /** 直播数据截图 */
      DisplayDataForm.value.data_screenshot = '';

      DateTimeField.value.start_date = '';
      DateTimeField.value.start_time = '';
      DateTimeField.value.end_date = '';
      DateTimeField.value.end_time = '';
    };

    const JWToken = getToken();

    watch(
      () => props.visible,
      newVal => {
        formRef.value?.clearValidate();
        if (newVal) {
          if (props.DisplayInfo?.id && props.DisplayInfo?.id !== -1) {
            DisplayDataForm.value.id = props.DisplayInfo?.id;
          }
          DisplayDataForm.value.real_duration = props.DisplayInfo?.real_duration ?? '';
          DisplayDataForm.value.live_url = props.DisplayInfo?.live_url;
          DisplayDataForm.value.duration_screenshot = props.DisplayInfo?.duration_screenshot;
          DisplayDataForm.value.data_screenshot = props.DisplayInfo?.data_screenshot;

          DisplayTimeImageUrl.value =
            DisplayDataForm.value.duration_screenshot + `?Authorization=${JWToken}`;
          DisplayDataImageUrl.value =
            DisplayDataForm.value.data_screenshot + `?Authorization=${JWToken}`;

          reloadDateTimePicker();
        }
      },
    );

    watch(
      () =>
        [
          DateTimeField.value.start_date,
          DateTimeField.value.start_time,
          DateTimeField.value.end_date,
          DateTimeField.value.end_time,
        ].join(','),
      newVal => {
        if (DateTimeField.value.start_date) {
          // const start_date = DateTimeFormat(new Date(DateTimeField.value.start_date), 'YYYY-mm-dd');
          const start_date = DateTimeFormat(
            moment(DateTimeField.value.start_date).valueOf(),
            'YYYY-mm-dd',
          );
          if (start_date && DateTimeField.value.start_time) {
            DisplayDataForm.value.real_start_time =
              start_date + ' ' + DateTimeField.value.start_time;
          } else {
            DisplayDataForm.value.real_start_time = '';
          }
        } else {
          DisplayDataForm.value.real_start_time = '';
        }

        if (DateTimeField.value.end_date) {
          // const end_date = DateTimeFormat(new Date(DateTimeField.value.end_date), 'YYYY-mm-dd');
          const end_date = DateTimeFormat(
            moment(DateTimeField.value.end_date).valueOf(),
            'YYYY-mm-dd',
          );
          if (end_date && DateTimeField.value.end_time) {
            DisplayDataForm.value.real_end_time = end_date + ' ' + DateTimeField.value.end_time;
          } else {
            DisplayDataForm.value.real_end_time = '';
          }
        } else {
          DisplayDataForm.value.real_end_time = '';
        }
        if (newVal) {
          reloadDuration();
        }
      },
    );

    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
      resetForm();
    };

    /** 上传图片 */
    const uploadDisplayTimeImage = async (params: HttpRequestOptions) => {
      uploadDisplayImage('time', params);
    };
    const uploadDisplayDataImage = async (params: HttpRequestOptions) => {
      uploadDisplayImage('data', params);
    };

    const uploadDisplayImage = async (type: 'time' | 'data', params: HttpRequestOptions) => {
      const beforeUpload = (file: File) => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          ctx.root.$message.warning('文件格式不正确，请使用 png / jpg/ jpeg');
          return false;
        }

        if (file.size > 2 * 1024 * 1024) {
          ctx.root.$message.error(
            `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在2MB以内`,
          );
          return false;
        }

        return true;
      };
      if (!beforeUpload(params.file)) {
        return;
      }

      const form = new FormData();
      form.append('file', params.file);
      form.append('type', 'shop_live_screenshot');

      const { data: response } = await uploadFile(form);

      if (response.success) {
        const url = response.data.source;
        if (type === 'time') {
          DisplayTimeImageUrl.value = url + `?Authorization=${getToken()}`;
          DisplayDataForm.value.duration_screenshot = url;
        } else {
          DisplayDataImageUrl.value = url + `?Authorization=${getToken()}`;
          DisplayDataForm.value.data_screenshot = url;
        }
      } else {
        ctx.root.$message.error('上传失败！');
      }
    };
    const { business_type } = useProjectBaseInfo();
    /** 点击保存 */
    const submit = async () => {
      if (DisplayDataForm?.value === undefined) {
        return;
      }
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }

      if (DisplayDataForm.value.real_start_time === DisplayDataForm.value.real_end_time) {
        ctx.root.$message.error('直播结束时间需晚于开始时间');
        return;
      }

      if (
        DisplayDataForm.value.live_url !== '' &&
        !isValidUrl(DisplayDataForm.value.live_url ?? '')
      ) {
        ctx.root.$message.error('请输入有效的链接');
        return;
      }

      if (!DisplayDataForm.value.real_start_time || !DisplayDataForm.value.real_end_time) {
        ctx.root.$message.error('请选择直播时间');
        return;
      }
      if (DisplayDataForm.value.id === -1) {
        ctx.root.$message.error('请求失败，无效的场次ID');
        return;
      }
      const ShopLiveRecordDataForm = ref<
        ShopLiveRecordDataForm & { business_type: number | undefined }
      >({
        data_screenshot: DisplayDataForm.value.data_screenshot ?? '',
        duration_screenshot: DisplayDataForm.value.duration_screenshot ?? '',
        real_duration: DisplayDataForm.value.real_duration ?? '',
        live_url: DisplayDataForm.value.live_url ?? '',
        real_start_time: DisplayDataForm.value.real_start_time,
        real_end_time: DisplayDataForm.value.real_end_time,
        business_type: liveDisplay?.value?.business_type,
      });

      const record_id = computed(() => {
        return props.DisplayInfo?.id ?? -1;
      });

      if (record_id.value !== -1) {
        ShopLiveRecordDataForm.value.id = record_id.value;
      } else {
        ShopLiveRecordDataForm.value.shop_live_id = liveDisplay?.value.id;
      }

      const { data: response } = await UpdateShopLiveRecordDataService(
        ShopLiveRecordDataForm.value,
        business_type.value,
      );

      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', response.data);
      } else {
        ctx.root.$message.error(response.message);
      }
    };

    const onSaveBtnClick = debounce(submit, 200);

    const getPositiveInteger = (value: string) =>
      (/\d+(?:\.\d{0,1})?|\.\d{0,1}/u.exec(value.replace(REG_RMEOVE_NON_DIGITAL, '')) ?? [''])[0];

    const inputPositiveInteger = (value: string) => {
      DisplayDataForm.value.real_duration = getPositiveInteger(value);
    };

    const removeDataScreenshot = () => {
      DisplayDataForm.value.data_screenshot = '';
    };

    const removeDurationScreenshot = () => {
      DisplayDataForm.value.duration_screenshot = '';
    };

    return {
      removeDurationScreenshot,
      removeDataScreenshot,
      inputPositiveInteger,
      formRef,
      DateTimeField,
      DisplayDataForm,
      DisplayDataFormRules,
      onCancelBtnClick,
      onSaveBtnClick,
      DisplayTimeImageUrl,
      DisplayDataImageUrl,
      uploadDisplayTimeImage,
      uploadDisplayDataImage,
    };
  },
});
