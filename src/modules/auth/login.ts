/**
 * * 登录模块
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-30 17:31:59
 */
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import AuthLayout from '@/layouts/auth';
import { ElForm } from 'element-ui/types/form';
import { setCode, setToken } from '@/utils/token';
import { GetVerifyCode, Login } from '@/services/auth';
import { getPhoneCode } from '@/api/auth';
import { ElInput } from 'element-ui/types/input';

export default defineComponent({
  name: 'newLogin',
  components: {
    AuthLayout,
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | undefined>(undefined);
    const form = ref({
      username: '',
      password: '',
      phone: '',
      usercode: '',
      code: '',
    });

    /** 密码输入框ref */
    const passwordRef = ref<null | ElInput>(null);
    /** 验证码输入框ref */
    const codeRef = ref<null | ElInput>(null);
    /** 图形验证码输入框ref */
    const usercodeRef = ref<null | ElInput>(null);

    const triggerPasswordFocus = () => {
      passwordRef.value?.focus();
    };

    const triggerUsercodeFocus = () => {
      usercodeRef.value?.focus();
    };

    const triggerCodeFocus = () => {
      codeRef.value?.focus();
    };

    const formRules = ref({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
      ],
      phone: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur',
        },
      ],
      usercode: [
        {
          required: true,
          message: '请输入图形验证码',
          trigger: 'blur',
        },
      ],
      code: [
        {
          required: true,
          message: '请输入短信验证码',
          trigger: 'blur',
        },
      ],
    });

    const loginType = ref('account');

    const isAccountLogin = computed(() => loginType.value === 'account');

    const isMobileLogin = computed(() => loginType.value === 'mobile');

    const toggleLoginType = () => {
      formRef.value?.clearValidate();
      if (isAccountLogin.value) {
        loginType.value = 'mobile';
      } else {
        loginType.value = 'account';
      }
    };

    const codeImageBase64 = ref('');

    // 请求图片验证码
    const getVerifyCode = async () => {
      const { data: response } = await GetVerifyCode();
      if (response.success) {
        codeImageBase64.value = response.data.img;
        setCode(response.data.actcode);
      } else {
        ctx.root.$message.error(response.message);
      }
    };

    const vCode = computed(() =>
      codeImageBase64.value === '' ? '' : `data:image/png;base64,${codeImageBase64.value}`,
    );

    watch(
      () => loginType.value,
      新值 => {
        if (新值 === 'mobile' && codeImageBase64.value === '') {
          getVerifyCode();
        }
      },
    );

    const phoneCodeTimeTip = ref(false);

    const getPhoneCodeStatus = ref({
      status: false,
      time: 60,
    });

    /** 获取短信验证码 */
    const handleGetPhoneCode = async () => {
      formRef.value?.clearValidate();
      const [err1, err2] = await Promise.all([
        await new Promise(resolve => {
          formRef.value?.validateField('phone', error => {
            resolve(error);
          });
        }),
        await new Promise(resolve => {
          formRef.value?.validateField('usercode', async error => {
            resolve(error);
          });
        }),
      ]);

      if (err1 || err2) {
        return;
      }

      const payload = {
        phone: form.value.phone,
        usercode: form.value.usercode,
        type: 5,
      };

      // 获取
      const res = await getPhoneCode(payload);

      if (res.data.success) {
        phoneCodeTimeTip.value = true;
        // 倒计时
        getPhoneCodeStatus.value = {
          status: true,
          time: 60,
        };

        const timer = setInterval(() => {
          if (getPhoneCodeStatus.value.time === 1) {
            getPhoneCodeStatus.value.status = false;
            phoneCodeTimeTip.value = false;
            clearInterval(timer);
          } else {
            getPhoneCodeStatus.value.time = getPhoneCodeStatus.value.time - 1;
          }
        }, 1000);
      } else {
        ctx.root.$message.error({ message: res.data.message });
        if (res.data.error_code === 1) {
          getVerifyCode();
        }
      }
    };

    /** 提交登录 */
    const onLoginBtnClick = async () => {
      const result = await new Promise(resolve => {
        formRef.value?.validate(pass => {
          resolve(pass);
        });
      });
      if (!result) {
        return;
      }

      const loginPayload = isAccountLogin.value
        ? {
            username: form.value.username,
            password: form.value.password,
            login_type: 1,
          }
        : {
            username: form.value.phone,
            password: form.value.code,
            login_type: 2,
          };

      const { data: response } = await Login(loginPayload);

      if (response.success) {
        setToken(response.data.token);
        ctx.root.$store.commit('user/login', response.data.user_info);
        const { redirect } = ctx.root.$route.query;
        if (typeof redirect === 'string' && redirect !== '') {
          ctx.root.$router.push({ path: redirect });
        } else {
          ctx.root.$router.push({ name: 'Home' });
        }
      } else {
        ctx.root.$message.error(response.message);
      }
    };

    return {
      formRef,
      form,
      formRules,
      isAccountLogin,
      isMobileLogin,
      toggleLoginType,
      getVerifyCode,
      vCode,
      onLoginBtnClick,
      phoneCodeTimeTip,
      getPhoneCodeStatus,
      handleGetPhoneCode,
      passwordRef,
      triggerPasswordFocus,
      codeRef,
      triggerCodeFocus,
      usercodeRef,
      triggerUsercodeFocus,
    };
  },
});
