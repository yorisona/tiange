import { defineComponent } from 'vue-demi';
import {
  kolBasic,
  kolContact,
  kolPlatform,
} from '@/modules/supplier/kolManage/newGenerateKol/components';

export default defineComponent({
  components: {
    kolBasic,
    kolContact,
    kolPlatform,
  },
  setup(_, ctx) {
    const validateBase = async () => {
      try {
        const basicObj = await (
          ctx.refs.kolBasic as unknown as { validate: () => void }
        ).validate();
        const contractObj = await (
          ctx.refs.kolContact as unknown as { validate: () => void }
        ).validate();
        const platformObj: any = await (
          ctx.refs.kolPlatform as unknown as { validate: () => void }
        ).validate();
        return Promise.resolve(
          Object.assign({}, basicObj, contractObj, { platforms: platformObj }),
        );
      } catch (error) {
        return Promise.reject();
      }
    };
    const submitHandler = () => {
      validateBase();
    };
    return {
      validateBase,
      submitHandler,
    };
  },
  render() {
    return (
      <div class="page-content-container">
        <kol-basic ref="kolBasic" />
        <kol-contact ref="kolContact" />
        <kol-platform ref="kolPlatform" />
      </div>
    );
  },
});
