<template>
  <div>
    <qrcode-vue
      :value="baseUrl"
      :size="300"
      level="H"
      style="width: 300px; margin: 60px auto 20px"
    ></qrcode-vue>
    <p style="padding-bottom: 80px; text-align: center; font-size: 16px; color: #6a7b92">
      使用微信扫描二维码在手机端拍照上传发票
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import QrcodeVue from 'qrcode.vue';
import { getToken } from '@/utils/token';

export default defineComponent({
  components: {
    QrcodeVue,
  },
  props: ['baseType', 'projectType', 'baseInfo'],
  setup(props, ctx) {
    const JWToken = getToken();
    const baseUrl = ref<string>('');

    const getUrl = (type: number) => {
      if (type === 1) {
        baseUrl.value += `upload?id=${props.baseInfo.id}&company=${props.baseInfo.company}&total_amount=${props.baseInfo.total_amount}&jwt=${JWToken}`;
      } else {
        baseUrl.value += `cost?id=${props.baseInfo.id}&company=${props.baseInfo.company}&project_type=${props.projectType}&jwt=${JWToken}`;
      }
      baseUrl.value = encodeURI(baseUrl.value);
      return baseUrl.value;
    };
    if (
      process.env.VUE_APP_BASE_API === 'http://dev.goumee.com' ||
      process.env.NODE_ENV === 'development'
    ) {
      baseUrl.value = 'http://m1.goumee.com/';
      getUrl(props.baseType);
    } else if (process.env.NODE_ENV === 'production') {
      baseUrl.value = 'https://m.goumee.com/';
      getUrl(props.baseType);
    } else {
      ctx.root.$message.warning('除测试2其他环境请自行配置二维码链接！');
    }

    return {
      baseUrl,
    };
  },
});
</script>
