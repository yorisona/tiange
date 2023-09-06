/*
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 打款凭证
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-21 14:54:11
 */
import { defineComponent, computed, watch } from '@vue/composition-api';
import { getToken } from '@/utils/token';
import { ref } from '@vue/composition-api';

export default defineComponent({
  name: 'PayCertificate',
  props: {
    visible: {
      type: Boolean,
    },
    pay_certificate_pic: {
      type: String,
    },
  },
  setup(props, ctx) {
    const tokenStr = `Authorization=${getToken()}`;
    const didClosed = ref(false);

    const picList = computed(() => {
      if (
        props.pay_certificate_pic === undefined ||
        props.pay_certificate_pic === '' ||
        didClosed.value
      ) {
        return [];
      }
      return props.pay_certificate_pic.split(',');
    });

    watch([() => props.visible], ([newVisible]) => {
      if (newVisible) {
        didClosed.value = false;
      }
    });

    const closed = () => {
      didClosed.value = true;
    };

    /** methods */
    const close = () => {
      ctx.emit('update:visible', false);
    };
    return {
      picList,
      close,
      tokenStr,
      closed,
    };
  },
});
